import { AuthConfig } from 'angular-oauth2-oidc';
import { environment } from '../../environments/environment';

export const authConfig: AuthConfig = {
  scope: 'openid profile email offline_access',
  responseType: 'code',
  oidc: true,
  clientId: jewelsConfig.openIdClientId,
  issuer: jewelsConfig.openIdUrl,
  redirectUri: jewelsConfig.openIdCallbackUrl,
  postLogoutRedirectUri: jewelsConfig.openIdLogoutRedirectUrl,
  requireHttps: environment.production
};
