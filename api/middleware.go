package api

import (
	"context"
	"database/sql"
	"errors"
	"github.com/zitadel/zitadel-go/v3/pkg/authorization"
	"github.com/zitadel/zitadel-go/v3/pkg/authorization/oauth"
	"github.com/zitadel/zitadel-go/v3/pkg/http/middleware"
	"github.com/zitadel/zitadel-go/v3/pkg/zitadel"
	"jewels/config"
	"jewels/database"
	"net/http"
	"strings"
)

func getOwnerFromToken(r *http.Request) (*database.Owner, error) {
	bearerToken := r.Header.Get("Authorization")
	bearerToken = strings.TrimPrefix(bearerToken, "Bearer ")

	return database.FindOwnerByToken(bearerToken)
}

func contentTypeJson(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, req *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		next.ServeHTTP(w, req)
	})
}

func getZitadelMiddleware(needsAdmin bool) func(http.Handler) http.Handler {
	ctx := context.Background()

	introspectionAuth := oauth.ClientIDSecretIntrospectionAuthentication(config.LoadedConfiguration.OidcServerClientId, config.LoadedConfiguration.OidcServerClientSecret)
	zitadelConfig := oauth.WithIntrospection[*oauth.IntrospectionContext](introspectionAuth)
	authZ, err := authorization.New(ctx, zitadel.New(config.LoadedConfiguration.OidcDomain), zitadelConfig)

	if err != nil {
		panic(err)
	}

	mw := middleware.New(authZ)

	roleChecks := make([]authorization.CheckOption, 0)
	if needsAdmin {
		roleChecks = append(roleChecks, authorization.WithRole("admin"))
	}

	return mw.RequireAuthorization(roleChecks...)
}

func login(needsAdmin bool) func(next http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			bearerToken := r.Header.Get("Authorization")
			if bearerToken == "" {
				w.WriteHeader(http.StatusUnauthorized)
				return
			}

			owner, err := getOwnerFromToken(r)
			if (err != nil && !errors.Is(err, sql.ErrNoRows)) || owner == nil {
				getZitadelMiddleware(needsAdmin)(next).ServeHTTP(w, r)
				return
			}

			if needsAdmin && !owner.IsAdmin {
				w.WriteHeader(http.StatusUnauthorized)
				return
			}

			next.ServeHTTP(w, r)
		})
	}
}

func createOrFindUser(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		userInfo := authorization.Context[*oauth.IntrospectionContext](r.Context())
		if userInfo != nil {
			roles := userInfo.Claims["roles"].([]interface{})
			stringRoles := make([]string, len(roles))
			for i, role := range roles {
				stringRoles[i] = role.(string)
			}

			owner, err := database.CreateOwnerIfNotExists(userInfo.UserInfoEmail.Email, userInfo.Name, userInfo.Picture, stringRoles)
			if err != nil {
				w.WriteHeader(http.StatusUnauthorized)
				return
			}

			next.ServeHTTP(w, r.WithContext(context.WithValue(r.Context(), "owner", owner)))
			return
		}

		bearerToken := r.Header.Get("Authorization")
		bearerToken = strings.TrimPrefix(bearerToken, "Bearer ")

		owner, err := database.FindOwnerByToken(bearerToken)
		if err != nil {
			w.WriteHeader(http.StatusUnauthorized)
			return
		}

		next.ServeHTTP(w, r.WithContext(context.WithValue(r.Context(), "owner", owner)))
		return
	})
}
