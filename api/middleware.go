package api

import (
	"jewels/database"
	"net/http"
)

func contentTypeJson() func(next http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, req *http.Request) {
			w.Header().Set("Content-Type", "application/json")
			next.ServeHTTP(w, req)
		})
	}
}

func createOwnerIfNotExistsMiddleware() func(next http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			userInfo := GetUserFromRequest(r)
			roles := userInfo.Claims["roles"].([]interface{})
			stringRoles := make([]string, len(roles))
			for i, role := range roles {
				stringRoles[i] = role.(string)
			}

			if err := database.CreateOwnerIfNotExists(userInfo.Email, userInfo.Name, userInfo.Picture, stringRoles); err != nil {
				w.WriteHeader(http.StatusUnauthorized)
				return
			}

			next.ServeHTTP(w, r)
		})
	}
}
