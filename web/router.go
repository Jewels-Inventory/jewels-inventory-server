package web

import (
	"github.com/gorilla/mux"
	"net/http"
	"strings"
)

func SetupWebRouter(router *mux.Router) {
	router.
		MatcherFunc(func(r *http.Request, match *mux.RouteMatch) bool {
			return !strings.HasPrefix(r.URL.Path, "/api") && !strings.HasPrefix(r.URL.Path, "/static")
		}).
		HandlerFunc(indexPage)
}
