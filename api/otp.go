package api

import (
	"encoding/json"
	"jewels/database"
	"net/http"
	"strconv"

	"github.com/gorilla/mux"
)

func getMyOneTimePasswords(w http.ResponseWriter, r *http.Request) {
	owner := getUserFromRequest(r)
	encoder := json.NewEncoder(w)

	myOtps, err := database.FindMyOneTimePasswords(owner)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte(err.Error()))
		return
	}

	sharedOtps, err := database.FindSharedOneTimePasswords(owner)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte(err.Error()))
		return
	}

	encoder.Encode(map[string]any{
		"myOneTimePasswords":     myOtps,
		"sharedOneTimePasswords": sharedOtps,
	})
}

func createOneTimePassword(w http.ResponseWriter, r *http.Request) {
	owner := getUserFromRequest(r)
	decoder := json.NewDecoder(r.Body)
	encoder := json.NewEncoder(w)

	var body struct {
		AccountName   string `json:"accountName"`
		AccountIssuer string `json:"accountIssuer"`
		SecretKey     string `json:"secretKey"`
	}

	err := decoder.Decode(&body)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		w.Write([]byte(err.Error()))
		return
	}

	otp := &database.OneTimePassword{
		OwnerId:       owner.Id,
		AccountName:   body.AccountName,
		AccountIssuer: body.AccountIssuer,
		SecretKey:     body.SecretKey,
	}

	err = database.CreateOneTimePassword(owner, otp)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte(err.Error()))
		return
	}

	w.WriteHeader(http.StatusCreated)
	encoder.Encode(otp)
}

func updateOneTimePassword(w http.ResponseWriter, r *http.Request) {
	owner := getUserFromRequest(r)
	decoder := json.NewDecoder(r.Body)

	vars := mux.Vars(r)
	id, err := strconv.ParseInt(vars["id"], 10, 64)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		w.Write([]byte(err.Error()))
		return
	}

	var body struct {
		AccountName   string `json:"accountName"`
		AccountIssuer string `json:"accountIssuer"`
		SecretKey     string `json:"secretKey"`
	}

	err = decoder.Decode(&body)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		w.Write([]byte(err.Error()))
		return
	}

	err = database.UpdateOneTimePassword(owner, &database.OneTimePassword{
		Id:            id,
		AccountName:   body.AccountName,
		AccountIssuer: body.AccountIssuer,
	})
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte(err.Error()))
		return
	}

	w.WriteHeader(http.StatusNoContent)
}

func deleteOneTimePassword(w http.ResponseWriter, r *http.Request) {
	owner := getUserFromRequest(r)
	vars := mux.Vars(r)
	id, err := strconv.ParseInt(vars["id"], 10, 64)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		w.Write([]byte(err.Error()))
		return
	}

	err = database.DeleteOneTimePassword(owner, id)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte(err.Error()))
		return
	}

	w.WriteHeader(http.StatusNoContent)
}

func shareOneTimePassword(w http.ResponseWriter, r *http.Request) {
	owner := getUserFromRequest(r)
	vars := mux.Vars(r)
	id, err := strconv.ParseInt(vars["id"], 10, 64)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		w.Write([]byte(err.Error()))
		return
	}

	shareWith, err := strconv.ParseInt(vars["shareWith"], 10, 64)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		w.Write([]byte(err.Error()))
		return
	}

	err = database.ShareOneTimePassword(owner, shareWith, id)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte(err.Error()))
		return
	}

	w.WriteHeader(http.StatusNoContent)
}

func unshareOneTimePassword(w http.ResponseWriter, r *http.Request) {
	owner := getUserFromRequest(r)
	vars := mux.Vars(r)
	id, err := strconv.ParseInt(vars["id"], 10, 64)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		w.Write([]byte(err.Error()))
		return
	}

	shareWith, err := strconv.ParseInt(vars["shareWith"], 10, 64)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		w.Write([]byte(err.Error()))
		return
	}

	err = database.UnshareOneTimePassword(owner, shareWith, id)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte(err.Error()))
		return
	}

	w.WriteHeader(http.StatusNoContent)
}
