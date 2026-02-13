package api

import (
	"encoding/json"
	"jewels/database"
	"net/http"
)

func getOwners(w http.ResponseWriter, r *http.Request) {
	encoder := json.NewEncoder(w)

	owners, err := database.FindAllOwners()
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte(err.Error()))
		return
	}

	encoder.Encode(owners)
}

func getOwnersExceptMe(w http.ResponseWriter, r *http.Request) {
	encoder := json.NewEncoder(w)
	me := getUserFromRequest(r)

	owners, err := database.FindAllOwners()
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte(err.Error()))
		return
	}

	allButMe := make([]database.Owner, 0)
	for _, owner := range owners {
		if owner.Email != me.Email {
			allButMe = append(allButMe, owner)
		}
	}

	encoder.Encode(allButMe)
}
