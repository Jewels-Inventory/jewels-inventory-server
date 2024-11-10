package api

import (
	"context"
	"github.com/gorilla/mux"
	"github.com/zitadel/zitadel-go/v3/pkg/authorization"
	"github.com/zitadel/zitadel-go/v3/pkg/authorization/oauth"
	"github.com/zitadel/zitadel-go/v3/pkg/http/middleware"
	"github.com/zitadel/zitadel-go/v3/pkg/zitadel"
	"jewels/config"
	"net/http"
)

func SetupApiRouter(router *mux.Router) {
	ctx := context.Background()

	zitadelConfig := oauth.WithIntrospection[*oauth.IntrospectionContext](oauth.ClientIDSecretIntrospectionAuthentication(config.LoadedConfiguration.OidcServerClientId, config.LoadedConfiguration.OidcServerClientSecret))
	authZ, err := authorization.New(ctx, zitadel.New(config.LoadedConfiguration.OidcDomain), zitadelConfig)

	if err != nil {
		panic(err)
	}

	mw := middleware.New(authZ)

	router.Methods("GET").Path("/api/my-jewel").Handler(mw.RequireAuthorization()(createOwnerIfNotExistsMiddleware()(contentTypeJson()(http.HandlerFunc(getMyJewels)))))
	router.Methods("POST").Path("/api/my-jewel").Handler(mw.RequireAuthorization()(createOwnerIfNotExistsMiddleware()(contentTypeJson()(http.HandlerFunc(createMyJewel)))))
	router.Methods("PUT").Path("/api/my-jewel/{jewel}").Handler(mw.RequireAuthorization()(createOwnerIfNotExistsMiddleware()(contentTypeJson()(http.HandlerFunc(updateMyJewel)))))
	router.Methods("DELETE").Path("/api/my-jewel/{jewel}").Handler(mw.RequireAuthorization()(createOwnerIfNotExistsMiddleware()(contentTypeJson()(http.HandlerFunc(deleteMyJewel)))))

	router.Methods("GET").Path("/api/healthz").HandlerFunc(getHealth)
}
