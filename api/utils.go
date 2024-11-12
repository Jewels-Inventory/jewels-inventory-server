package api

import (
	"jewels/database"
	"net/http"
)

func GetUserFromRequest(r *http.Request) *database.Owner {
	return r.Context().Value("owner").(*database.Owner)
}
