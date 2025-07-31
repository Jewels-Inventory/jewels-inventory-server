package api

import (
	"jewels/database"
	"net/http"
)

func getUserFromRequest(r *http.Request) *database.Owner {
	return r.Context().Value("owner").(*database.Owner)
}
