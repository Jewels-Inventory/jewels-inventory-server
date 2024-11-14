package api

import (
	"github.com/gorilla/mux"
	"net/http"
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
		PathPrefix("/my-jewel").
		Subrouter()

	apiRouter.
		Methods("GET").
		Path("/healthz").
		HandlerFunc(getHealth)

	myJewelsRouter.
		Methods("GET").
		HandlerFunc(getMyJewels).
		Handler(http.HandlerFunc(getMyJewels))
	myJewelsRouter.
		Methods("GET").
		Path("/{id}").
		Handler(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			w.WriteHeader(http.StatusNotImplemented)
		}))
	myJewelsRouter.
		Methods("POST").
		Handler(http.HandlerFunc(createMyJewel))
	myJewelsRouter.
		Methods("PUT").
		Path("/{jewel}").
		Handler(http.HandlerFunc(updateMyJewel))
	myJewelsRouter.
		Methods("DELETE").
		Path("/{jewel}").
		Handler(http.HandlerFunc(deleteMyJewel))

	adminRouter.
		Methods("GET").
		Path("/owner").
		Handler(http.HandlerFunc(getOwners))
	adminRouter.
		Methods("GET").
		Path("/owner/{ownerId}/device").
		Handler(http.HandlerFunc(getDevices))
	adminRouter.
		Methods("POST").
		Path("/owner/{ownerId}/device").
		Handler(http.HandlerFunc(createDevice))
	adminRouter.
		Methods("GET").
		Path("/owner/{ownerId}/device/{deviceId}").
		Handler(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			w.WriteHeader(http.StatusNotImplemented)
		}))
	adminRouter.
		Methods("PUT").
		Path("/owner/{ownerId}/device/{deviceId}").
		Handler(http.HandlerFunc(updateDevice))
	adminRouter.
		Methods("DELETE").
		Path("/owner/{ownerId}/device/{deviceId}").
		Handler(http.HandlerFunc(deleteDevice))

	devicesRouter.
		Methods("POST").
		Path("/{type:(?:watch|computer|phone)}").
		Handler(http.HandlerFunc(pushDeviceData))

	myJewelsRouter.Use(login(), createOrFindUser, contentTypeJson)
	adminRouter.Use(login("admin"), createOrFindUser, contentTypeJson)
	devicesRouter.Use(login(), createOrFindUser, contentTypeJson)
}
