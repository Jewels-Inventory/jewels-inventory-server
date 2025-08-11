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
	myJewelsRouter := apiRouter.
		PathPrefix("/my-jewels").
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

	myJewelsRouter.Use(login(false), createOrFindUser, contentTypeJson)
	adminRouter.Use(login(true), createOrFindUser, contentTypeJson)
	devicesRouter.Use(login(false), createOrFindUser, contentTypeJson)
}
