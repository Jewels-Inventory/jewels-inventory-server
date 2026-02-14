package api

import (
	"net/http"

	"github.com/gorilla/mux"
)

func SetupApiRouter(router *mux.Router) {
	apiRouter := router.
		PathPrefix("/api").
		Subrouter()
	devicesRouter := apiRouter.
		PathPrefix("/device").
		Subrouter()
	adminRouter := apiRouter.
		PathPrefix("/admin").
		Subrouter()
	ownerRouter := apiRouter.
		PathPrefix("/owner").
		Subrouter()
	myJewelsRouter := apiRouter.
		PathPrefix("/my-jewels").
		Subrouter()
	otpRouter := apiRouter.
		PathPrefix("/one-time-password").
		Subrouter()
	iconsRouter := apiRouter.
		PathPrefix("/icons").
		Subrouter()

	apiRouter.
		Methods(http.MethodGet).
		Path("/healthz").
		HandlerFunc(getHealth)

	myJewelsRouter.
		Methods(http.MethodGet).
		HandlerFunc(getMyJewels)
	myJewelsRouter.
		Methods(http.MethodPost).
		HandlerFunc(createMyJewel)
	myJewelsRouter.
		Methods(http.MethodPut).
		Path("/{jewel}").
		HandlerFunc(updateMyJewel)
	myJewelsRouter.
		Methods(http.MethodDelete).
		Path("/{jewel}").
		HandlerFunc(deleteMyJewel)
	myJewelsRouter.
		Methods(http.MethodGet).
		Path("/{jewel}/vpn-config").
		HandlerFunc(getVpnConfig)

	ownerRouter.
		Methods(http.MethodGet).
		Path("").
		HandlerFunc(getOwners)
	ownerRouter.
		Methods(http.MethodGet).
		Path("/other").
		HandlerFunc(getOwnersExceptMe)

	otpRouter.
		Methods(http.MethodGet).
		Path("").
		HandlerFunc(getMyOneTimePasswords)
	otpRouter.
		Methods(http.MethodPost).
		Path("").
		HandlerFunc(createOneTimePassword)
	otpRouter.
		Methods(http.MethodPut).
		Path("/{id}").
		HandlerFunc(updateOneTimePassword)
	otpRouter.
		Methods(http.MethodDelete).
		Path("/{id}").
		HandlerFunc(deleteOneTimePassword)
	otpRouter.
		Methods(http.MethodPost).
		Path("/{id}/share").
		HandlerFunc(oneTimePasswordShare)
	otpRouter.
		Methods(http.MethodPost).
		Path("/{id}/share/{shareWith}").
		HandlerFunc(shareOneTimePassword)
	otpRouter.
		Methods(http.MethodDelete).
		Path("/{id}/share/{shareWith}").
		HandlerFunc(unshareOneTimePassword)

	iconsRouter.
		Methods(http.MethodGet).
		PathPrefix("/{brand}").
		HandlerFunc(getIcon)

	adminRouter.
		Methods(http.MethodGet).
		Path("/owner").
		HandlerFunc(getOwners)
	adminRouter.
		Methods(http.MethodGet).
		Path("/owner/{ownerId}/device").
		HandlerFunc(getDevices)
	adminRouter.
		Methods(http.MethodPost).
		Path("/owner/{ownerId}/device").
		HandlerFunc(createDevice)
	adminRouter.
		Methods(http.MethodPut).
		Path("/owner/{ownerId}/device/{deviceId}").
		HandlerFunc(updateDevice)
	adminRouter.
		Methods(http.MethodDelete).
		Path("/owner/{ownerId}/device/{deviceId}").
		HandlerFunc(deleteDevice)

	adminRouter.
		Methods(http.MethodGet).
		Path("/relay-vpn/client").
		HandlerFunc(getRelayClients)
	adminRouter.
		Methods(http.MethodGet).
		Path("/relay-vpn/device").
		HandlerFunc(getAllDevices)
	adminRouter.
		Methods(http.MethodPut).
		Path("/relay-vpn/device/{deviceId}").
		HandlerFunc(setRelayConfig)

	apiRouter.
		Methods(http.MethodGet).
		Path("/relay-vpn/device/{deviceId}").
		Handler(login(false)(createOrFindUser(contentTypeJson(http.HandlerFunc(getRelayConfig)))))

	devicesRouter.
		Methods(http.MethodPost).
		Path("/{type:(?:watch|computer|phone)}").
		HandlerFunc(pushDeviceData)

	otpRouter.Use(login(false), createOrFindUser, createOrFindOwnerEncryptionKey, contentTypeJson)
	ownerRouter.Use(login(false), createOrFindUser, createOrFindOwnerEncryptionKey, contentTypeJson)
	myJewelsRouter.Use(login(false), createOrFindUser, createOrFindOwnerEncryptionKey, contentTypeJson)
	adminRouter.Use(login(true), createOrFindUser, createOrFindOwnerEncryptionKey, contentTypeJson)
	devicesRouter.Use(login(false), createOrFindUser, createOrFindOwnerEncryptionKey, contentTypeJson)
}
