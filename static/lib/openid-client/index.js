/**
 * Bundled by jsDelivr using Rollup v2.79.1 and Terser v5.19.2.
 * Original file: /npm/openid-client@6.1.7/build/index.js
 *
 * Do NOT use SRI with dynamically generated files! More information: https://www.jsdelivr.com/using-sri-with-dynamic-files
 */
import * as e from './oauth4webapi.js';
export { AuthorizationResponseError, ResponseBodyError, WWWAuthenticateChallengeError } from './oauth4webapi.js';
import * as t from './jose.js';
import { JOSEError as n } from './jose-errors.js';
let o, r;
if ('undefined' == typeof navigator || !navigator.userAgent?.startsWith?.('Mozilla/5.0 ')) {
  ((r = `${'openid-client'}/${'v6.1.7'}`), (o = { 'user-agent': r }));
}
const s = (e) => a.get(e);
let a;
function c(t) {
  return e.ClientSecretPost(t);
}
function i(t) {
  return e.ClientSecretBasic(t);
}
function u(t, n) {
  return e.ClientSecretJwt(t, n);
}
function l() {
  return e.None();
}
function d(t, n) {
  return e.PrivateKeyJwt(t, n);
}
function h() {
  return e.TlsClientAuth();
}
const p = e.skipStateCheck,
  f = e.skipSubjectCheck,
  m = e.customFetch,
  w = e.modifyAssertion,
  y = e.clockSkew,
  g = e.clockTolerance,
  R = 'ERR_INVALID_ARG_VALUE',
  P = 'ERR_INVALID_ARG_TYPE';
function _(e, t, n) {
  const o = new TypeError(e, { cause: n });
  return (Object.assign(o, { code: t }), o);
}
function E(t) {
  return e.calculatePKCECodeChallenge(t);
}
function O() {
  return e.generateRandomCodeVerifier();
}
function S() {
  return e.generateRandomNonce();
}
function A() {
  return e.generateRandomState();
}
class k extends Error {
  code;
  constructor(e, t) {
    (super(e, t),
      (this.name = this.constructor.name),
      (this.code = t?.code),
      Error.captureStackTrace?.(this, this.constructor));
  }
}
const T = new TextDecoder();
function C(e, t, n) {
  return new k(e, { cause: t, code: n });
}
function D(t) {
  if (
    t instanceof TypeError ||
    t instanceof k ||
    t instanceof e.ResponseBodyError ||
    t instanceof e.AuthorizationResponseError ||
    t instanceof e.WWWAuthenticateChallengeError
  )
    throw t;
  if (t instanceof e.OperationProcessingError)
    switch (t.code) {
      case e.HTTP_REQUEST_FORBIDDEN:
        throw C('only requests to HTTPS are allowed', t, t.code);
      case e.REQUEST_PROTOCOL_FORBIDDEN:
        throw C('only requests to HTTP or HTTPS are allowed', t, t.code);
      case e.RESPONSE_IS_NOT_CONFORM:
        throw C('unexpected HTTP response status code', t.cause, t.code);
      case e.RESPONSE_IS_NOT_JSON:
        throw C('unexpected response content-type', t.cause, t.code);
      case e.PARSE_ERROR:
        throw C('parsing error occured', t, t.code);
      case e.INVALID_RESPONSE:
        throw C('invalid response encountered', t, t.code);
      case e.JWT_CLAIM_COMPARISON:
        throw C('unexpected JWT claim value encountered', t, t.code);
      case e.JSON_ATTRIBUTE_COMPARISON:
        throw C('unexpected JSON attribute value encountered', t, t.code);
      case e.JWT_TIMESTAMP_CHECK:
        throw C('JWT timestamp claim value failed validation', t, t.code);
      default:
        throw C(t.message, t, t.code);
    }
  if (t instanceof e.UnsupportedOperationError) throw C('unsupported operation', t, t.code);
  if (t instanceof DOMException)
    switch (t.name) {
      case 'OperationError':
        throw C('runtime operation error', t, e.UNSUPPORTED_OPERATION);
      case 'NotSupportedError':
        throw C('runtime unsupported operation', t, e.UNSUPPORTED_OPERATION);
      case 'TimeoutError':
        throw C('operation timed out', t, 'OAUTH_TIMEOUT');
      case 'AbortError':
        throw C('operation aborted', t, 'OAUTH_ABORT');
    }
  throw new k('something went wrong', { cause: t });
}
function b(t, n) {
  return e.generateKeyPair(t ?? 'ES256', { extractable: n?.extractable }).catch(D);
}
async function v(t, n, r, a, c) {
  if (!(t instanceof URL)) throw _('"server" must be an instance of URL', P);
  const i = !t.href.includes('/.well-known/'),
    u = c?.timeout ?? 30,
    l = AbortSignal.timeout(1e3 * u),
    d = await (
      i
        ? e.discoveryRequest(t, {
            algorithm: c?.algorithm,
            [e.customFetch]: c?.[m],
            [e.allowInsecureRequests]: c?.execute?.includes(B),
            signal: l,
            headers: new Headers(o),
          })
        : (c?.[m] || fetch)((e.checkProtocol(t, !c?.execute?.includes(B)), t.href), {
            headers: Object.fromEntries(new Headers({ accept: 'application/json', ...o }).entries()),
            body: void 0,
            method: 'GET',
            redirect: 'manual',
            signal: l,
          })
    )
      .then((t) => e.processDiscoveryResponse(e._nodiscoverycheck, t))
      .catch(D);
  i &&
    new URL(d.issuer).href !== t.href &&
    ((function (e, t, n) {
      return !(
        'https://login.microsoftonline.com' !== e.origin ||
        (n?.algorithm && 'oidc' !== n.algorithm) ||
        ((t[L] = !0), 0)
      );
    })(t, d, c) ||
      (function (e, t) {
        return !(!e.hostname.endsWith('.b2clogin.com') || (t?.algorithm && 'oidc' !== t.algorithm));
      })(t, c) ||
      (() => {
        throw new k('discovered metadata issuer does not match the expected issuer', {
          code: e.JSON_ATTRIBUTE_COMPARISON,
          cause: { expected: t.href, body: d, attribute: 'issuer' },
        });
      })());
  const h = new F(d, n, r, a);
  let p = s(h);
  if ((c?.[m] && (p.fetch = c[m]), c?.timeout && (p.timeout = c.timeout), c?.execute)) for (const e of c.execute) e(h);
  return h;
}
function I(e) {
  return 'ECDH' === e.name;
}
const H = 'ECDH-ES',
  U = 'ECDH-ES+A128KW',
  N = 'ECDH-ES+A192KW',
  x = 'ECDH-ES+A256KW';
function j(e, t, n) {
  switch (t) {
    case void 0:
      (e.add(H), e.add(U), e.add(N), e.add(x));
      break;
    case H:
    case U:
    case N:
    case x:
      e.add(t);
      break;
    default:
      throw _('invalid key alg', R, { pk: n });
  }
}
function q(e, o = ['A128GCM', 'A192GCM', 'A256GCM', 'A128CBC-HS256', 'A192CBC-HS384', 'A256CBC-HS512'], ...r) {
  if (void 0 !== s(e).decrypt)
    throw new TypeError('enableDecryptingResponses can only be called on a given Configuration instance once');
  if (0 === r.length) throw _('no keys were provided', R);
  const a = new Set(),
    c = [];
  for (const e of r) {
    let t;
    if (
      ('key' in e
        ? ((t = { key: e.key }),
          'string' == typeof e.alg && (t.alg = e.alg),
          'string' == typeof e.kid && (t.kid = e.kid))
        : (t = { key: e }),
      'private' !== t.key.type)
    )
      throw _('only private keys must be provided', R);
    if ('RSA-OAEP' === t.key.algorithm.name)
      switch (t.key.algorithm.hash.name) {
        case 'SHA-1':
        case 'SHA-256':
        case 'SHA-384':
        case 'SHA-512': {
          let n,
            o = 'RSA-OAEP';
          if (
            ((n = parseInt(t.key.algorithm.hash.name.slice(-3), 10)) && (o = `${o}-${n}`), (t.alg ||= o), o !== t.alg)
          )
            throw _('invalid key alg', R, { pk: e });
          a.add(t.alg);
          break;
        }
        default:
          throw _('only SHA-512, SHA-384, SHA-256, and SHA-1 RSA-OAEP keys are supported', R);
      }
    else if (I(t.key.algorithm)) {
      if ('P-256' !== t.key.algorithm.namedCurve) throw _('Only P-256 ECDH keys are supported', R);
      j(a, t.alg, e);
    } else {
      if ('X25519' !== t.key.algorithm.name) throw _('only RSA-OAEP, ECDH, or X25519 keys are supported', R);
      j(a, t.alg, e);
    }
    c.push(t);
  }
  s(e).decrypt = async (e) =>
    (async function (e, o, r, s) {
      return T.decode(
        (
          await t
            .compactDecrypt(
              o,
              async (t) => {
                const { kid: n, alg: o, epk: r } = t;
                return (function (e, t, n, o) {
                  const { 0: r, length: s } = e.filter(
                    (e) =>
                      n === e.kid &&
                      (!e.alg || t === e.alg) &&
                      (function (e, t, n) {
                        if (t.startsWith('RSA-OAEP')) return !0;
                        if (t.startsWith('ECDH-ES')) {
                          if ('ECDH' !== e.algorithm.name && 'X25519' !== e.algorithm.name) return !1;
                          if ('ECDH' === e.algorithm.name) return n?.crv === e.algorithm.namedCurve;
                          if ('X25519' === e.algorithm.name) return 'X25519' === n?.crv;
                        }
                        return !1;
                      })(e.key, t, o),
                  );
                  if (!r) throw C('no applicable decryption key selected', void 0, 'OAUTH_DECRYPTION_FAILED');
                  if (1 !== s)
                    throw C('multiple applicable decryption keys selected', void 0, 'OAUTH_DECRYPTION_FAILED');
                  return r.key;
                })(e, o, n, r);
              },
              { keyManagementAlgorithms: s, contentEncryptionAlgorithms: r },
            )
            .catch((e) => {
              if (e instanceof n) throw C('decryption failed', e, 'OAUTH_DECRYPTION_FAILED');
              D(e);
            })
        ).plaintext,
      );
    })(c, e, o, [...a]).catch(D);
}
const L = Symbol();
class F {
  constructor(t, n, o, r) {
    if ('string' != typeof n || !n.length) throw _('"clientId" must be a non-empty string', P);
    if (('string' == typeof o && (o = { client_secret: o }), void 0 !== o?.client_id && n !== o.client_id))
      throw _('"clientId" and "metadata.client_id" must be the same', R);
    const s = { ...structuredClone(o), client_id: n };
    let i;
    ((s[e.clockSkew] = o?.[e.clockSkew] ?? 0),
      (s[e.clockTolerance] = o?.[e.clockTolerance] ?? 30),
      (i = r || ('string' == typeof s.client_secret && s.client_secret.length ? c(s.client_secret) : l())));
    let u = Object.freeze(s);
    const d = structuredClone(t);
    L in t && (d[e._expectedIssuer] = ({ claims: { tid: e } }) => t.issuer.replace('{tenantid}', e));
    let h = Object.freeze(d);
    ((a ||= new WeakMap()), a.set(this, { __proto__: null, as: h, c: u, auth: i, tlsOnly: !0, jwksCache: {} }));
  }
  serverMetadata() {
    const e = structuredClone(s(this).as);
    return (
      (function (e) {
        Object.defineProperties(
          e,
          (function (e) {
            return {
              supportsPKCE: {
                __proto__: null,
                value: (t = 'S256') => !0 === e.code_challenge_methods_supported?.includes(t),
              },
            };
          })(e),
        );
      })(e),
      e
    );
  }
  get timeout() {
    return s(this).timeout;
  }
  set timeout(e) {
    s(this).timeout = e;
  }
  get [m]() {
    return s(this).fetch;
  }
  set [m](e) {
    s(this).fetch = e;
  }
}
function M(t) {
  Object.defineProperties(
    t,
    (function (t) {
      let n;
      if (void 0 !== t.expires_in) {
        const e = new Date();
        (e.setSeconds(e.getSeconds() + t.expires_in), (n = e.getTime()));
      }
      return {
        expiresIn: {
          __proto__: null,
          value() {
            if (n) {
              const e = Date.now();
              return n > e ? Math.floor((n - e) / 1e3) : 0;
            }
          },
        },
        claims: {
          __proto__: null,
          value() {
            try {
              return e.getValidatedIdTokenClaims(this);
            } catch {
              return;
            }
          },
        },
      };
    })(t),
  );
}
function W(t, n, o) {
  return (ae(t), e.DPoP(s(t).c, n, o));
}
async function z(t, n, r, a) {
  (ae(t), (r = new URLSearchParams(r)));
  let c = n.interval ?? 5;
  const i = a?.signal ?? AbortSignal.timeout(1e3 * n.expires_in);
  try {
    i.throwIfAborted();
  } catch (e) {
    D(e);
  }
  await (function (e) {
    return new Promise((t) => {
      setTimeout(t, 1e3 * e);
    });
  })(c);
  const { as: u, c: l, auth: d, fetch: h, tlsOnly: p, nonRepudiation: f, timeout: m, decrypt: w } = s(t),
    y = await e
      .deviceCodeGrantRequest(u, l, d, n.device_code, {
        [e.customFetch]: h,
        [e.allowInsecureRequests]: !p,
        additionalParameters: r,
        DPoP: a?.DPoP,
        headers: new Headers(o),
        signal: i.aborted ? i : ce(m),
      })
      .catch(D),
    g = e.processDeviceCodeResponse(u, l, y, { [e.jweDecrypt]: w });
  let R;
  try {
    R = await g;
  } catch (o) {
    if (ue(o, a)) return z(t, { ...n, interval: c }, r, { ...a, signal: i, flag: de });
    if (o instanceof e.ResponseBodyError)
      switch (o.error) {
        case 'slow_down':
          c += 5;
        case 'authorization_pending':
          return z(t, { ...n, interval: c }, r, { ...a, signal: i, flag: void 0 });
      }
    D(o);
  }
  return (R.id_token && (await f?.(y)), M(R), R);
}
async function J(t, n) {
  ae(t);
  const { as: r, c: a, auth: c, fetch: i, tlsOnly: u, timeout: l } = s(t);
  return e
    .deviceAuthorizationRequest(r, a, c, n, {
      [e.customFetch]: i,
      [e.allowInsecureRequests]: !u,
      headers: new Headers(o),
      signal: ce(l),
    })
    .then((t) => e.processDeviceAuthorizationResponse(r, a, t))
    .catch(D);
}
function B(e) {
  s(e).tlsOnly = !1;
}
function G(e, t) {
  s(e).jwksCache = structuredClone(t);
}
function K(e) {
  const t = s(e).jwksCache;
  if (t.uat) return t;
}
function V(t) {
  (ae(t),
    (s(t).nonRepudiation = (n) => {
      const { as: r, fetch: a, tlsOnly: c, timeout: i, jwksCache: u } = s(t);
      return e
        .validateApplicationLevelSignature(r, n, {
          [e.customFetch]: a,
          [e.allowInsecureRequests]: !c,
          headers: new Headers(o),
          signal: ce(i),
          [e.jwksCache]: u,
        })
        .catch(D);
    }));
}
function X(t) {
  if ((ae(t), s(t).hybrid))
    throw C('JARM cannot be combined with a hybrid response mode', void 0, e.UNSUPPORTED_OPERATION);
  s(t).jarm = (n, r) =>
    (async function (t, n, r) {
      const { as: a, c: c, fetch: i, tlsOnly: u, timeout: l, decrypt: d, jwksCache: h } = s(t);
      return e
        .validateJwtAuthResponse(a, c, n, r, {
          [e.customFetch]: i,
          [e.allowInsecureRequests]: !u,
          headers: new Headers(o),
          signal: ce(l),
          [e.jweDecrypt]: d,
          [e.jwksCache]: h,
        })
        .catch(D);
    })(t, n, r);
}
function Y(t) {
  if (!s(t).hybrid)
    throw C('"code id_token" response type must be configured to be used first', void 0, e.UNSUPPORTED_OPERATION);
  s(t).hybrid = (e, n, o, r) => Z(t, e, n, o, r, !0);
}
function $(t) {
  if ((ae(t), s(t).jarm))
    throw C('"code id_token" response type cannot be combined with JARM', void 0, e.UNSUPPORTED_OPERATION);
  s(t).hybrid = (e, n, o, r) => Z(t, e, n, o, r, !1);
}
async function Q(t, n, r, a, c) {
  if (
    (ae(t),
    !(
      c?.flag === de ||
      n instanceof URL ||
      (function (e, t) {
        try {
          return Object.getPrototypeOf(e)[Symbol.toStringTag] === t;
        } catch {
          return !1;
        }
      })(n, 'Request')
    ))
  )
    throw _('"currentUrl" must be an instance of URL, or Request', P);
  let i, u;
  const {
    as: l,
    c: d,
    auth: h,
    fetch: p,
    tlsOnly: f,
    jarm: m,
    hybrid: w,
    nonRepudiation: y,
    timeout: g,
    decrypt: R,
  } = s(t);
  if (c?.flag === de) ((i = c.authResponse), (u = c.redirectUri));
  else {
    let t;
    switch (
      (n instanceof URL || ('POST' === n.method && (t = n), (n = new URL(n.url))),
      (E = n),
      ((E = new URL(E)).search = ''),
      (E.hash = ''),
      (u = E.href),
      !0)
    ) {
      case !!m:
        i = await m(n, r?.expectedState);
        break;
      case !!w:
        i = await w(t || n, r?.expectedNonce, r?.expectedState, r?.maxAge);
        break;
      default:
        try {
          i = e.validateAuthResponse(l, d, n.searchParams, r?.expectedState);
        } catch (e) {
          return D(e);
        }
    }
  }
  var E;
  const O = await e
    .authorizationCodeGrantRequest(l, d, h, i, u, r?.pkceCodeVerifier || e._nopkce, {
      additionalParameters: a,
      [e.customFetch]: p,
      [e.allowInsecureRequests]: !f,
      DPoP: c?.DPoP,
      headers: new Headers(o),
      signal: ce(g),
    })
    .catch(D);
  ('string' != typeof r?.expectedNonce && 'number' != typeof r?.maxAge) || (r.idTokenExpected = !0);
  const S = e.processAuthorizationCodeResponse(l, d, O, {
    expectedNonce: r?.expectedNonce,
    maxAge: r?.maxAge,
    requireIdToken: r?.idTokenExpected,
    [e.jweDecrypt]: R,
  });
  let A;
  try {
    A = await S;
  } catch (e) {
    if (ue(e, c)) return Q(t, void 0, r, a, { ...c, flag: de, authResponse: i, redirectUri: u });
    D(e);
  }
  return (A.id_token && (await y?.(O)), M(A), A);
}
async function Z(t, n, r, a, c, i) {
  if ('string' != typeof r) throw _('"expectedNonce" must be a string', P);
  if (void 0 !== a && 'string' != typeof a) throw _('"expectedState" must be a string', P);
  const { as: u, c: l, fetch: d, tlsOnly: h, timeout: p, decrypt: f, jwksCache: m } = s(t);
  return (i ? e.validateDetachedSignatureResponse : e.validateCodeIdTokenResponse)(u, l, n, r, a, c, {
    [e.customFetch]: d,
    [e.allowInsecureRequests]: !h,
    headers: new Headers(o),
    signal: ce(p),
    [e.jweDecrypt]: f,
    [e.jwksCache]: m,
  }).catch(D);
}
async function ee(t, n, r, a) {
  (ae(t), (r = new URLSearchParams(r)));
  const { as: c, c: i, auth: u, fetch: l, tlsOnly: d, nonRepudiation: h, timeout: p, decrypt: f } = s(t),
    m = await e
      .refreshTokenGrantRequest(c, i, u, n, {
        [e.customFetch]: l,
        [e.allowInsecureRequests]: !d,
        additionalParameters: r,
        DPoP: a?.DPoP,
        headers: new Headers(o),
        signal: ce(p),
      })
      .catch(D),
    w = e.processRefreshTokenResponse(c, i, m, { [e.jweDecrypt]: f });
  let y;
  try {
    y = await w;
  } catch (e) {
    if (ue(e, a)) return ee(t, n, r, { ...a, flag: de });
    D(e);
  }
  return (y.id_token && (await h?.(m)), M(y), y);
}
async function te(t, n, r) {
  (ae(t), (n = new URLSearchParams(n)));
  const { as: a, c: c, auth: i, fetch: u, tlsOnly: l, timeout: d } = s(t),
    h = await e
      .clientCredentialsGrantRequest(a, c, i, n, {
        [e.customFetch]: u,
        [e.allowInsecureRequests]: !l,
        DPoP: r?.DPoP,
        headers: new Headers(o),
        signal: ce(d),
      })
      .catch(D),
    p = e.processClientCredentialsResponse(a, c, h);
  let f;
  try {
    f = await p;
  } catch (e) {
    if (ue(e, r)) return te(t, n, { ...r, flag: de });
    D(e);
  }
  return (M(f), f);
}
function ne(t, n) {
  ae(t);
  const { as: o, c: r, tlsOnly: a, hybrid: c, jarm: i } = s(t),
    u = e.resolveEndpoint(o, 'authorization_endpoint', !1, a);
  ((n = new URLSearchParams(n)).has('client_id') || n.set('client_id', r.client_id),
    n.has('request_uri') ||
      n.has('request') ||
      (n.has('response_type') || n.set('response_type', c ? 'code id_token' : 'code'),
      i && n.set('response_mode', 'jwt')));
  for (const [e, t] of n.entries()) u.searchParams.append(e, t);
  return u;
}
async function oe(t, n, o, r) {
  ae(t);
  if (((n = ne(t, n).searchParams), !o)) throw _('"signingKey" must be provided', R);
  const { as: a, c: c } = s(t);
  return ne(t, { request: await e.issueRequestObject(a, c, n, o, r).catch(D) });
}
async function re(t, n, r) {
  ae(t);
  const a = ne(t, n),
    { as: c, c: i, auth: u, fetch: l, tlsOnly: d, timeout: h } = s(t),
    p = await e
      .pushedAuthorizationRequest(c, i, u, a.searchParams, {
        [e.customFetch]: l,
        [e.allowInsecureRequests]: !d,
        DPoP: r?.DPoP,
        headers: new Headers(o),
        signal: ce(h),
      })
      .catch(D),
    f = e.processPushedAuthorizationResponse(c, i, p);
  let m;
  try {
    m = await f;
  } catch (e) {
    if (ue(e, r)) return re(t, n, { ...r, flag: de });
    D(e);
  }
  return ne(t, { request_uri: m.request_uri });
}
function se(t, n) {
  ae(t);
  const { as: o, c: r, tlsOnly: a } = s(t),
    c = e.resolveEndpoint(o, 'end_session_endpoint', !1, a);
  (n = new URLSearchParams(n)).has('client_id') || n.set('client_id', r.client_id);
  for (const [e, t] of n.entries()) c.searchParams.append(e, t);
  return c;
}
function ae(e) {
  if (!(e instanceof F)) throw _('"config" must be an instance of Configuration', P);
  if (Object.getPrototypeOf(e) !== F.prototype) throw _('subclassing Configuration is not allowed', R);
}
function ce(e) {
  return e ? AbortSignal.timeout(1e3 * e) : void 0;
}
async function ie(t, n, r, a) {
  ae(t);
  const { as: c, c: i, fetch: u, tlsOnly: l, nonRepudiation: d, timeout: h, decrypt: p } = s(t),
    f = await e
      .userInfoRequest(c, i, n, {
        [e.customFetch]: u,
        [e.allowInsecureRequests]: !l,
        DPoP: a?.DPoP,
        headers: new Headers(o),
        signal: ce(h),
      })
      .catch(D);
  let m,
    w = e.processUserInfoResponse(c, i, r, f, { [e.jweDecrypt]: p });
  try {
    m = await w;
  } catch (e) {
    if (ue(e, a)) return ie(t, n, r, { ...a, flag: de });
    D(e);
  }
  return ('application/jwt' === me(f) && (await d?.(f)), m);
}
function ue(t, n) {
  return !(!n?.DPoP || n.flag === de) && e.isDPoPNonceError(t);
}
async function le(t, n, r) {
  ae(t);
  const { as: a, c: c, auth: i, fetch: u, tlsOnly: l, nonRepudiation: d, timeout: h, decrypt: p } = s(t),
    f = await e
      .introspectionRequest(a, c, i, n, {
        [e.customFetch]: u,
        [e.allowInsecureRequests]: !l,
        additionalParameters: new URLSearchParams(r),
        headers: new Headers(o),
        signal: ce(h),
      })
      .catch(D),
    m = await e.processIntrospectionResponse(a, c, f, { [e.jweDecrypt]: p }).catch(D);
  return ('application/token-introspection+jwt' === me(f) && (await d?.(f)), m);
}
Object.freeze(F.prototype);
const de = Symbol();
async function he(t, n, r, a) {
  ae(t);
  const { as: c, c: i, auth: u, fetch: l, tlsOnly: d, timeout: h, decrypt: p } = s(t),
    f = await e
      .genericTokenEndpointRequest(c, i, u, n, new URLSearchParams(r), {
        [e.customFetch]: l,
        [e.allowInsecureRequests]: !d,
        DPoP: a?.DPoP,
        headers: new Headers(o),
        signal: ce(h),
      })
      .then((t) => e.processGenericTokenEndpointResponse(c, i, t, { [e.jweDecrypt]: p }))
      .catch(D);
  return (M(f), f);
}
async function pe(t, n, r) {
  ae(t);
  const { as: a, c: c, auth: i, fetch: u, tlsOnly: l, timeout: d } = s(t);
  return e
    .revocationRequest(a, c, i, n, {
      [e.customFetch]: u,
      [e.allowInsecureRequests]: !l,
      additionalParameters: new URLSearchParams(r),
      headers: new Headers(o),
      signal: ce(d),
    })
    .then(e.processRevocationResponse)
    .catch(D);
}
async function fe(t, n, o, a, c, i, u) {
  (ae(t), (i ||= new Headers()), i.has('user-agent') || i.set('user-agent', r));
  const { fetch: l, tlsOnly: d, timeout: h } = s(t),
    p = e.protectedResourceRequest(n, a, o, i, c, {
      [e.customFetch]: l,
      [e.allowInsecureRequests]: !d,
      DPoP: u?.DPoP,
      signal: ce(h),
    });
  let f;
  try {
    f = await p;
  } catch (e) {
    if (ue(e, u)) return fe(t, n, o, a, c, i, { ...u, flag: de });
    D(e);
  }
  return f;
}
function me(e) {
  return e.headers.get('content-type')?.split(';')[0];
}
export {
  k as ClientError,
  i as ClientSecretBasic,
  u as ClientSecretJwt,
  c as ClientSecretPost,
  F as Configuration,
  l as None,
  d as PrivateKeyJwt,
  h as TlsClientAuth,
  B as allowInsecureRequests,
  Q as authorizationCodeGrant,
  ne as buildAuthorizationUrl,
  oe as buildAuthorizationUrlWithJAR,
  re as buildAuthorizationUrlWithPAR,
  se as buildEndSessionUrl,
  E as calculatePKCECodeChallenge,
  te as clientCredentialsGrant,
  y as clockSkew,
  g as clockTolerance,
  m as customFetch,
  v as discovery,
  q as enableDecryptingResponses,
  Y as enableDetachedSignatureResponseChecks,
  V as enableNonRepudiationChecks,
  fe as fetchProtectedResource,
  ie as fetchUserInfo,
  he as genericGrantRequest,
  W as getDPoPHandle,
  K as getJwksCache,
  J as initiateDeviceAuthorization,
  w as modifyAssertion,
  z as pollDeviceAuthorizationGrant,
  b as randomDPoPKeyPair,
  S as randomNonce,
  O as randomPKCECodeVerifier,
  A as randomState,
  ee as refreshTokenGrant,
  G as setJwksCache,
  p as skipStateCheck,
  f as skipSubjectCheck,
  le as tokenIntrospection,
  pe as tokenRevocation,
  $ as useCodeIdTokenResponseType,
  X as useJwtResponseMode,
};
export default null;
