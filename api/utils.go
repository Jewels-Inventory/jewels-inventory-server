package api

import (
	"github.com/zitadel/zitadel-go/v3/pkg/authorization"
	"github.com/zitadel/zitadel-go/v3/pkg/authorization/oauth"
	"net/http"
)

func GetUserFromRequest(r *http.Request) *oauth.IntrospectionContext {
	return authorization.Context[*oauth.IntrospectionContext](r.Context())
}
