/**
 * Bundled by jsDelivr using Rollup v2.79.1 and Terser v5.19.2.
 * Original file: /npm/oauth4webapi@3.1.4/build/index.js
 *
 * Do NOT use SRI with dynamically generated files! More information: https://www.jsdelivr.com/using-sri-with-dynamic-files
 */
let e;
if ('undefined' == typeof navigator || !navigator.userAgent?.startsWith?.('Mozilla/5.0 ')) {
  e = `${'oauth4webapi'}/${'v3.1.4'}`;
}
function t(e, t) {
  if (null == e) return !1;
  try {
    return e instanceof t || Object.getPrototypeOf(e)[Symbol.toStringTag] === t.prototype[Symbol.toStringTag];
  } catch {
    return !1;
  }
}
const a = 'ERR_INVALID_ARG_VALUE',
  n = 'ERR_INVALID_ARG_TYPE';
function s(e, t, a) {
  const n = new TypeError(e, { cause: a });
  return (Object.assign(n, { code: t }), n);
}
const r = Symbol(),
  o = Symbol(),
  i = Symbol(),
  c = Symbol(),
  u = Symbol(),
  d = Symbol(),
  p = Symbol(),
  h = new TextEncoder(),
  l = new TextDecoder();
function f(e) {
  return 'string' == typeof e ? h.encode(e) : l.decode(e);
}
const m = 32768;
function w(e) {
  return 'string' == typeof e
    ? (function (e) {
        try {
          const t = atob(e.replace(/-/g, '+').replace(/_/g, '/').replace(/\s/g, '')),
            a = new Uint8Array(t.length);
          for (let e = 0; e < t.length; e++) a[e] = t.charCodeAt(e);
          return a;
        } catch (e) {
          throw s('The input to be decoded is not correctly encoded.', a, e);
        }
      })(e)
    : (function (e) {
        e instanceof ArrayBuffer && (e = new Uint8Array(e));
        const t = [];
        for (let a = 0; a < e.byteLength; a += m) t.push(String.fromCharCode.apply(null, e.subarray(a, a + m)));
        return btoa(t.join('')).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
      })(e);
}
class y extends Error {
  code;
  constructor(e, t) {
    (super(e, t),
      (this.name = this.constructor.name),
      (this.code = Ge),
      Error.captureStackTrace?.(this, this.constructor));
  }
}
class _ extends Error {
  code;
  constructor(e, t) {
    (super(e, t),
      (this.name = this.constructor.name),
      t?.code && (this.code = t?.code),
      Error.captureStackTrace?.(this, this.constructor));
  }
}
function b(e, t, a) {
  return new _(e, { code: t, cause: a });
}
function g(e, t) {
  if (!(e instanceof CryptoKey)) throw s(`${t} must be a CryptoKey`, n);
}
function v(e, t) {
  if ((g(e, t), 'private' !== e.type)) throw s(`${t} must be a private CryptoKey`, a);
}
function S(e) {
  return null !== e && 'object' == typeof e && !Array.isArray(e);
}
function k(n) {
  t(n, Headers) && (n = Object.fromEntries(n.entries()));
  const r = new Headers(n);
  if ((e && !r.has('user-agent') && r.set('user-agent', e), r.has('authorization')))
    throw s('"options.headers" must not include the "authorization" header name', a);
  if (r.has('dpop')) throw s('"options.headers" must not include the "dpop" header name', a);
  return r;
}
function P(e) {
  if (('function' == typeof e && (e = e()), !(e instanceof AbortSignal)))
    throw s('"options.signal" must return or be an instance of AbortSignal', n);
  return e;
}
async function T(e, t) {
  if (!(e instanceof URL)) throw s('"issuerIdentifier" must be an instance of URL', n);
  ae(e, !0 !== t?.[r]);
  const o = new URL(e.href);
  switch (t?.algorithm) {
    case void 0:
    case 'oidc':
      o.pathname = `${o.pathname}/.well-known/openid-configuration`.replace('//', '/');
      break;
    case 'oauth2':
      '/' === o.pathname
        ? (o.pathname = '.well-known/oauth-authorization-server')
        : (o.pathname = `.well-known/oauth-authorization-server/${o.pathname}`.replace('//', '/'));
      break;
    default:
      throw s('"options.algorithm" must be "oidc" (default), or "oauth2"', a);
  }
  const i = k(t?.headers);
  return (
    i.set('accept', 'application/json'),
    (t?.[c] || fetch)(o.href, {
      body: void 0,
      headers: Object.fromEntries(i.entries()),
      method: 'GET',
      redirect: 'manual',
      signal: t?.signal ? P(t.signal) : void 0,
    })
  );
}
function A(e, t, r, o, i) {
  try {
    if ('number' != typeof e || !Number.isFinite(e)) throw s(`${r} must be a number`, n, i);
    if (e > 0) return;
    if (t && 0 !== e) throw s(`${r} must be a non-negative number`, a, i);
    throw s(`${r} must be a positive number`, a, i);
  } catch (e) {
    if (o) throw b(e.message, o, i);
    throw e;
  }
}
function x(e, t, r, o) {
  try {
    if ('string' != typeof e) throw s(`${t} must be a string`, n, o);
    if (0 === e.length) throw s(`${t} must not be empty`, a, o);
  } catch (e) {
    if (r) throw b(e.message, r, o);
    throw e;
  }
}
async function R(e, a) {
  if (!(e instanceof URL) && e !== Yt) throw s('"expectedIssuer" must be an instance of URL', n);
  if (!t(a, Response)) throw s('"response" must be an instance of Response', n);
  if (200 !== a.status)
    throw b('"response" is not a conform Authorization Server Metadata response (unexpected HTTP status code)', at, a);
  let r;
  (_t(a), E(a));
  try {
    r = await a.json();
  } catch (e) {
    throw b('failed to parse "response" body as JSON', Ze, e);
  }
  if (!S(r)) throw b('"response" body must be a top level object', Xe, { body: r });
  if (
    (x(r.issuer, '"response" body "issuer" property', Xe, { body: r }), new URL(r.issuer).href !== e.href && e !== Yt)
  )
    throw b('"response" body "issuer" property does not match the expected value', it, {
      expected: e.href,
      body: r,
      attribute: 'issuer',
    });
  return r;
}
function E(e) {
  !(function (e, t) {
    if (Te(e) !== t) throw j(e, t);
  })(e, 'application/json');
}
function j(e, ...t) {
  let a = '"response" content-type must be ';
  if (t.length > 2) {
    const e = t.pop();
    a += `${t.join(', ')}, or ${e}`;
  } else 2 === t.length ? (a += `${t[0]} or ${t[1]}`) : (a += t[0]);
  return b(a, tt, e);
}
function O() {
  return w(crypto.getRandomValues(new Uint8Array(32)));
}
function H() {
  return O();
}
function U() {
  return O();
}
function W() {
  return O();
}
async function D(e) {
  return (x(e, 'codeVerifier'), w(await crypto.subtle.digest('SHA-256', f(e))));
}
function J(e) {
  return e instanceof CryptoKey
    ? { key: e }
    : e?.key instanceof CryptoKey
      ? (void 0 !== e.kid && x(e.kid, '"kid"'), { key: e.key, kid: e.kid })
      : {};
}
function L(e) {
  switch (e.algorithm.name) {
    case 'RSA-PSS':
      return (function (e) {
        switch (e.algorithm.hash.name) {
          case 'SHA-256':
            return 'PS256';
          case 'SHA-384':
            return 'PS384';
          case 'SHA-512':
            return 'PS512';
          default:
            throw new y('unsupported RsaHashedKeyAlgorithm hash name', { cause: e });
        }
      })(e);
    case 'RSASSA-PKCS1-v1_5':
      return (function (e) {
        switch (e.algorithm.hash.name) {
          case 'SHA-256':
            return 'RS256';
          case 'SHA-384':
            return 'RS384';
          case 'SHA-512':
            return 'RS512';
          default:
            throw new y('unsupported RsaHashedKeyAlgorithm hash name', { cause: e });
        }
      })(e);
    case 'ECDSA':
      return (function (e) {
        switch (e.algorithm.namedCurve) {
          case 'P-256':
            return 'ES256';
          case 'P-384':
            return 'ES384';
          case 'P-521':
            return 'ES512';
          default:
            throw new y('unsupported EcKeyAlgorithm namedCurve', { cause: e });
        }
      })(e);
    case 'Ed25519':
    case 'EdDSA':
      return 'Ed25519';
    default:
      throw new y('unsupported CryptoKey algorithm name', { cause: e });
  }
}
function N(e) {
  const t = e?.[o];
  return 'number' == typeof t && Number.isFinite(t) ? t : 0;
}
function I(e) {
  const t = e?.[i];
  return 'number' == typeof t && Number.isFinite(t) && -1 !== Math.sign(t) ? t : 30;
}
function C() {
  return Math.floor(Date.now() / 1e3);
}
function $(e) {
  if ('object' != typeof e || null === e) throw s('"as" must be an object', n);
  x(e.issuer, '"as.issuer"');
}
function z(e) {
  if ('object' != typeof e || null === e) throw s('"client" must be an object', n);
  x(e.client_id, '"client.client_id"');
}
function K(e) {
  return encodeURIComponent(e).replace(/(?:[-_.!~*'()]|%20)/g, (e) => {
    switch (e) {
      case '-':
      case '_':
      case '.':
      case '!':
      case '~':
      case '*':
      case "'":
      case '(':
      case ')':
        return `%${e.charCodeAt(0).toString(16).toUpperCase()}`;
      case '%20':
        return '+';
      default:
        throw new Error();
    }
  });
}
function M(e) {
  return (
    x(e, '"clientSecret"'),
    (t, a, n, s) => {
      (n.set('client_id', a.client_id), n.set('client_secret', e));
    }
  );
}
function q(e) {
  return (
    x(e, '"clientSecret"'),
    (t, a, n, s) => {
      const r = K(a.client_id),
        o = K(e),
        i = btoa(`${r}:${o}`);
      s.set('authorization', `Basic ${i}`);
    }
  );
}
function F(e, t) {
  const a = C() + N(t);
  return { jti: O(), aud: e.issuer, exp: a + 60, iat: a, nbf: a, iss: t.client_id, sub: t.client_id };
}
function V(e, t) {
  const { key: a, kid: n } = J(e);
  return (
    v(a, '"clientPrivateKey.key"'),
    async (e, s, r, o) => {
      const i = { alg: L(a), kid: n },
        c = F(e, s);
      (t?.[u]?.(i, c),
        r.set('client_id', s.client_id),
        r.set('client_assertion_type', 'urn:ietf:params:oauth:client-assertion-type:jwt-bearer'),
        r.set('client_assertion', await Y(i, c, a)));
    }
  );
}
function B(e, t) {
  x(e, '"clientSecret"');
  const a = t?.[u];
  let n;
  return async (t, s, r, o) => {
    n ||= await crypto.subtle.importKey('raw', f(e), { hash: 'SHA-256', name: 'HMAC' }, !1, ['sign']);
    const i = { alg: 'HS256' },
      c = F(t, s);
    a?.(i, c);
    const u = `${w(f(JSON.stringify(i)))}.${w(f(JSON.stringify(c)))}`,
      d = await crypto.subtle.sign(n.algorithm, n, f(u));
    (r.set('client_id', s.client_id),
      r.set('client_assertion_type', 'urn:ietf:params:oauth:client-assertion-type:jwt-bearer'),
      r.set('client_assertion', `${u}.${w(new Uint8Array(d))}`));
  };
}
function G() {
  return (e, t, a, n) => {
    a.set('client_id', t.client_id);
  };
}
function Q() {
  return (e, t, a, n) => {
    a.set('client_id', t.client_id);
  };
}
async function Y(e, t, n) {
  if (!n.usages.includes('sign'))
    throw s('CryptoKey instances used for signing assertions must include "sign" in their "usages"', a);
  const r = `${w(f(JSON.stringify(e)))}.${w(f(JSON.stringify(t)))}`;
  return `${r}.${w(await crypto.subtle.sign(At(n), n, f(r)))}`;
}
async function Z(e, t, n, r, o) {
  ($(e), z(t), (n = new URLSearchParams(n)));
  const { key: i, kid: c } = J(r);
  (v(i, '"privateKey.key"'), n.set('client_id', t.client_id));
  const d = C() + N(t),
    p = { ...Object.fromEntries(n.entries()), jti: O(), aud: e.issuer, exp: d + 60, iat: d, nbf: d, iss: t.client_id };
  let h;
  n.has('resource') && (h = n.getAll('resource')) && h.length > 1 && (p.resource = h);
  {
    let e = n.get('max_age');
    null !== e && ((p.max_age = parseInt(e, 10)), A(p.max_age, !0, '"max_age" parameter'));
  }
  {
    let e = n.get('claims');
    if (null !== e) {
      try {
        p.claims = JSON.parse(e);
      } catch (e) {
        throw b('failed to parse the "claims" parameter as JSON', Ze, e);
      }
      if (!S(p.claims)) throw s('"claims" parameter must be a JSON with a top level object', a);
    }
  }
  {
    let e = n.get('authorization_details');
    if (null !== e) {
      try {
        p.authorization_details = JSON.parse(e);
      } catch (e) {
        throw b('failed to parse the "authorization_details" parameter as JSON', Ze, e);
      }
      if (!Array.isArray(p.authorization_details))
        throw s('"authorization_details" parameter must be a JSON with a top level array', a);
    }
  }
  const l = { alg: L(i), typ: 'oauth-authz-req+jwt', kid: c };
  return (o?.[u]?.(l, p), Y(l, p, i));
}
let X;
async function ee(e) {
  return (
    (X ||= new WeakMap()),
    X.get(e) ||
      (async function (e) {
        const { kty: t, e: a, n: n, x: s, y: r, crv: o } = await crypto.subtle.exportKey('jwk', e),
          i = { kty: t, e: a, n: n, x: s, y: r, crv: o };
        return (X.set(e, i), i);
      })(e)
  );
}
const te = URL.parse
  ? (e, t) => URL.parse(e, t)
  : (e, t) => {
      try {
        return new URL(e, t);
      } catch {
        return null;
      }
    };
function ae(e, t) {
  if (t && 'https:' !== e.protocol) throw b('only requests to HTTPS are allowed', nt, e);
  if ('https:' !== e.protocol && 'http:' !== e.protocol) throw b('only HTTP and HTTPS requests are allowed', st, e);
}
function ne(e, t, a, n) {
  let s;
  if ('string' != typeof e || !(s = te(e)))
    throw b(
      'authorization server metadata does not contain a valid ' + (a ? `"as.mtls_endpoint_aliases.${t}"` : `"as.${t}"`),
      void 0 === e ? ut : dt,
      { attribute: a ? `mtls_endpoint_aliases.${t}` : t },
    );
  return (ae(s, n), s);
}
function se(e, t, a, n) {
  return a && e.mtls_endpoint_aliases && t in e.mtls_endpoint_aliases
    ? ne(e.mtls_endpoint_aliases[t], t, a, n)
    : ne(e[t], t, a, n);
}
async function re(e, t, a, n, s) {
  ($(e), z(t));
  const o = se(e, 'pushed_authorization_request_endpoint', t.use_mtls_endpoint_aliases, !0 !== s?.[r]),
    i = new URLSearchParams(n);
  i.set('client_id', t.client_id);
  const c = k(s?.headers);
  (c.set('accept', 'application/json'), void 0 !== s?.DPoP && (we(s.DPoP), await s.DPoP.addProof(o, c, 'POST')));
  const u = await xe(e, t, a, o, i, c, s);
  return (s?.DPoP?.cacheNonce(u), u);
}
class oe {
  #e;
  #t;
  #a;
  #n;
  #s;
  #r;
  constructor(e, t, n) {
    if (
      (v(t?.privateKey, '"DPoP.privateKey"'),
      (function (e, t) {
        if ((g(e, t), 'public' !== e.type)) throw s(`${t} must be a public CryptoKey`, a);
      })(t?.publicKey, '"DPoP.publicKey"'),
      !t.publicKey.extractable)
    )
      throw s('"DPoP.publicKey.extractable" must be true', a);
    ((this.#s = n?.[u]), (this.#n = N(e)), (this.#t = t.privateKey), (this.#a = t.publicKey), Ce.add(this));
  }
  #o(e) {
    this.#r ||= new Map();
    let t = this.#r.get(e);
    return (t && (this.#r.delete(e), this.#r.set(e, t)), t);
  }
  #i(e, t) {
    ((this.#r ||= new Map()),
      this.#r.delete(e),
      100 === this.#r.size && this.#r.delete(this.#r.keys().next().value),
      this.#r.set(e, t));
  }
  async addProof(e, t, a, n) {
    this.#e ||= { alg: L(this.#t), typ: 'dpop+jwt', jwk: await ee(this.#a) };
    const s = this.#o(e.origin),
      r = {
        iat: C() + this.#n,
        jti: O(),
        htm: a,
        nonce: s,
        htu: `${e.origin}${e.pathname}`,
        ath: n ? w(await crypto.subtle.digest('SHA-256', f(n))) : void 0,
      };
    (this.#s?.(this.#e, r), t.set('dpop', await Y(this.#e, r, this.#t)));
  }
  cacheNonce(e) {
    try {
      const t = e.headers.get('dpop-nonce');
      t && this.#i(new URL(e.url).origin, t);
    } catch {}
  }
}
function ie(e) {
  if (e instanceof pe) {
    const { 0: t, length: a } = e.cause;
    return 1 === a && 'dpop' === t.scheme && 'use_dpop_nonce' === t.parameters.error;
  }
  return e instanceof ue && 'use_dpop_nonce' === e.error;
}
function ce(e, t, a) {
  return new oe(e, t, a);
}
class ue extends Error {
  cause;
  code;
  error;
  status;
  error_description;
  response;
  constructor(e, t) {
    (super(e, t),
      (this.name = this.constructor.name),
      (this.code = Be),
      (this.cause = t.cause),
      (this.error = t.cause.error),
      (this.status = t.response.status),
      (this.error_description = t.cause.error_description),
      Object.defineProperty(this, 'response', { enumerable: !1, value: t.response }),
      Error.captureStackTrace?.(this, this.constructor));
  }
}
class de extends Error {
  cause;
  code;
  error;
  error_description;
  constructor(e, t) {
    (super(e, t),
      (this.name = this.constructor.name),
      (this.code = Qe),
      (this.cause = t.cause),
      (this.error = t.cause.get('error')),
      (this.error_description = t.cause.get('error_description') ?? void 0),
      Error.captureStackTrace?.(this, this.constructor));
  }
}
class pe extends Error {
  cause;
  code;
  response;
  status;
  constructor(e, t) {
    (super(e, t),
      (this.name = this.constructor.name),
      (this.code = Ve),
      (this.cause = t.cause),
      (this.status = t.response.status),
      (this.response = t.response),
      Object.defineProperty(this, 'response', { enumerable: !1 }),
      Error.captureStackTrace?.(this, this.constructor));
  }
}
const he = /((?:,|, )?[0-9a-zA-Z!#$%&'*+-.^_`|~]+=)/,
  le = /(?:^|, ?)([0-9a-zA-Z!#$%&'*+\-.^_`|~]+)(?=$|[ ,])/g;
function fe(e) {
  if (!t(e, Response)) throw s('"response" must be an instance of Response', n);
  const a = e.headers.get('www-authenticate');
  if (null === a) return;
  const r = [];
  for (const { 1: e, index: t } of a.matchAll(le)) r.push([e, t]);
  if (!r.length) return;
  return r.map(([e, t], n, s) => {
    const r = s[n + 1];
    let o;
    return (
      (o = r ? a.slice(t, r[1]) : a.slice(t)),
      (function (e, t) {
        const a = t.split(he).slice(1);
        if (!a.length) return { scheme: e.toLowerCase(), parameters: {} };
        a[a.length - 1] = a[a.length - 1].replace(/,$/, '');
        const n = {};
        for (let e = 1; e < a.length; e += 2) {
          const t = e;
          if ('"' === a[t][0]) for (; '"' !== a[t].slice(-1) && ++e < a.length; ) a[t] += a[e];
          n[a[t - 1].replace(/^(?:, ?)|=$/g, '').toLowerCase()] =
            (s = a[t]).length >= 2 && '"' === s[0] && '"' === s[s.length - 1] ? s.slice(1, -1) : s;
        }
        var s;
        return { scheme: e.toLowerCase(), parameters: n };
      })(e, o)
    );
  });
}
async function me(e, a, r) {
  if (($(e), z(a), !t(r, Response))) throw s('"response" must be an instance of Response', n);
  let o, i;
  if ((o = fe(r)))
    throw new pe('server responded with a challenge in the WWW-Authenticate HTTP Header', { cause: o, response: r });
  if (201 !== r.status) {
    let e;
    if ((e = await St(r)))
      throw (
        await r.body?.cancel(),
        new ue('server responded with an error in the response body', { cause: e, response: r })
      );
    throw b(
      '"response" is not a conform Pushed Authorization Request Endpoint response (unexpected HTTP status code)',
      at,
      r,
    );
  }
  (_t(r), E(r));
  try {
    i = await r.json();
  } catch (e) {
    throw b('failed to parse "response" body as JSON', Ze, e);
  }
  if (!S(i)) throw b('"response" body must be a top level object', Xe, { body: i });
  x(i.request_uri, '"response" body "request_uri" property', Xe, { body: i });
  let c = 'number' != typeof i.expires_in ? parseFloat(i.expires_in) : i.expires_in;
  return (A(c, !1, '"response" body "expires_in" property', Xe, { body: i }), (i.expires_in = c), i);
}
function we(e) {
  if (!Ce.has(e)) throw s('"options.DPoP" is not a valid DPoPHandle', a);
}
async function ye(e, t, a, o, i, u) {
  if ((x(e, '"accessToken"'), !(a instanceof URL))) throw s('"url" must be an instance of URL', n);
  (ae(a, !0 !== u?.[r]),
    (o = k(o)),
    u?.DPoP
      ? (we(u.DPoP), await u.DPoP.addProof(a, o, t.toUpperCase(), e), o.set('authorization', `DPoP ${e}`))
      : o.set('authorization', `Bearer ${e}`));
  const d = await (u?.[c] || fetch)(a.href, {
    body: i,
    headers: Object.fromEntries(o.entries()),
    method: t,
    redirect: 'manual',
    signal: u?.signal ? P(u.signal) : void 0,
  });
  return (u?.DPoP?.cacheNonce(d), d);
}
async function _e(e, t, a, n, s, r) {
  return ye(e, t, a, n, s, r).then((e) => {
    let t;
    if ((t = fe(e)))
      throw new pe('server responded with a challenge in the WWW-Authenticate HTTP Header', { cause: t, response: e });
    return e;
  });
}
async function be(e, t, a, n) {
  ($(e), z(t));
  const s = se(e, 'userinfo_endpoint', t.use_mtls_endpoint_aliases, !0 !== n?.[r]),
    i = k(n?.headers);
  return (
    t.userinfo_signed_response_alg
      ? i.set('accept', 'application/jwt')
      : (i.set('accept', 'application/json'), i.append('accept', 'application/jwt')),
    ye(a, 'GET', s, i, null, { ...n, [o]: N(t) })
  );
}
let ge;
function ve(e, t, a, n) {
  ((ge ||= new WeakMap()),
    ge.set(e, {
      jwks: t,
      uat: a,
      get age() {
        return C() - this.uat;
      },
    }),
    n && Object.assign(n, { jwks: structuredClone(t), uat: a }));
}
function Se(e, t) {
  (ge?.delete(e), delete t?.jwks, delete t?.uat);
}
async function ke(e, t, a) {
  const { alg: n, kid: s } = a;
  var o;
  let i, u, d;
  if (
    ((function (e) {
      if (!kt(e.alg)) throw new y('unsupported JWS "alg" identifier', { cause: { alg: e.alg } });
    })(a),
    !ge?.has(e) &&
      ((o = t?.[p]),
      'object' == typeof o &&
        null !== o &&
        'uat' in o &&
        'number' == typeof o.uat &&
        !(C() - o.uat >= 300) &&
        'jwks' in o &&
        S(o.jwks) &&
        Array.isArray(o.jwks.keys) &&
        Array.prototype.every.call(o.jwks.keys, S)) &&
      ve(e, t?.[p].jwks, t?.[p].uat),
    ge?.has(e))
  ) {
    if ((({ jwks: i, age: u } = ge.get(e)), u >= 300)) return (Se(e, t?.[p]), ke(e, t, a));
  } else
    ((i = await (async function (e, t) {
      $(e);
      const a = se(e, 'jwks_uri', !1, !0 !== t?.[r]),
        n = k(t?.headers);
      return (
        n.set('accept', 'application/json'),
        n.append('accept', 'application/jwk-set+json'),
        (t?.[c] || fetch)(a.href, {
          body: void 0,
          headers: Object.fromEntries(n.entries()),
          method: 'GET',
          redirect: 'manual',
          signal: t?.signal ? P(t.signal) : void 0,
        })
      );
    })(e, t).then(vt)),
      (u = 0),
      ve(e, i, C(), t?.[p]));
  switch (n.slice(0, 2)) {
    case 'RS':
    case 'PS':
      d = 'RSA';
      break;
    case 'ES':
      d = 'EC';
      break;
    case 'Ed':
      d = 'OKP';
      break;
    default:
      throw new y('unsupported JWS algorithm', { cause: { alg: n } });
  }
  const h = i.keys.filter((e) => {
      if (e.kty !== d) return !1;
      if (void 0 !== s && s !== e.kid) return !1;
      if (void 0 !== e.alg && n !== e.alg) return !1;
      if (void 0 !== e.use && 'sig' !== e.use) return !1;
      if (!1 === e.key_ops?.includes('verify')) return !1;
      switch (!0) {
        case 'ES256' === n && 'P-256' !== e.crv:
        case 'ES384' === n && 'P-384' !== e.crv:
        case 'ES512' === n && 'P-521' !== e.crv:
        case 'Ed25519' === n && 'Ed25519' !== e.crv:
        case 'EdDSA' === n && 'Ed25519' !== e.crv:
          return !1;
      }
      return !0;
    }),
    { 0: l, length: f } = h;
  if (!f) {
    if (u >= 60) return (Se(e, t?.[p]), ke(e, t, a));
    throw b('error when selecting a JWT verification key, no applicable keys found', ct, {
      header: a,
      candidates: h,
      jwks_uri: new URL(e.jwks_uri),
    });
  }
  if (1 !== f)
    throw b(
      'error when selecting a JWT verification key, multiple applicable keys found, a "kid" JWT Header Parameter is required',
      ct,
      { header: a, candidates: h, jwks_uri: new URL(e.jwks_uri) },
    );
  return $t(n, l);
}
const Pe = Symbol();
function Te(e) {
  return e.headers.get('content-type')?.split(';')[0];
}
async function Ae(e, a, r, o, i) {
  if (($(e), z(a), !t(o, Response))) throw s('"response" must be an instance of Response', n);
  let c, u;
  if ((c = fe(o)))
    throw new pe('server responded with a challenge in the WWW-Authenticate HTTP Header', { cause: c, response: o });
  if (200 !== o.status)
    throw b('"response" is not a conform UserInfo Endpoint response (unexpected HTTP status code)', at, o);
  if ((_t(o), 'application/jwt' === Te(o))) {
    const { claims: t, jwt: n } = await Rt(
      await o.text(),
      Dt.bind(void 0, a.userinfo_signed_response_alg, e.userinfo_signing_alg_values_supported, void 0),
      N(a),
      I(a),
      i?.[d],
    )
      .then(Je.bind(void 0, a.client_id))
      .then(Ne.bind(void 0, e));
    (Oe.set(o, n), (u = t));
  } else {
    if (a.userinfo_signed_response_alg) throw b('JWT UserInfo Response expected', Ye, o);
    E(o);
    try {
      u = await o.json();
    } catch (e) {
      throw b('failed to parse "response" body as JSON', Ze, e);
    }
  }
  if (!S(u)) throw b('"response" body must be a top level object', Xe, { body: u });
  if ((x(u.sub, '"response" body "sub" property', Xe, { body: u }), r === Pe));
  else if ((x(r, '"expectedSubject"'), u.sub !== r))
    throw b('unexpected "response" body "sub" property value', it, { expected: r, body: u, attribute: 'sub' });
  return u;
}
async function xe(e, t, a, n, s, r, o) {
  return (
    await a(e, t, s, r),
    r.set('content-type', 'application/x-www-form-urlencoded;charset=UTF-8'),
    (o?.[c] || fetch)(n.href, {
      body: s,
      headers: Object.fromEntries(r.entries()),
      method: 'POST',
      redirect: 'manual',
      signal: o?.signal ? P(o.signal) : void 0,
    })
  );
}
async function Re(e, t, a, n, s, o) {
  const i = se(e, 'token_endpoint', t.use_mtls_endpoint_aliases, !0 !== o?.[r]);
  s.set('grant_type', n);
  const c = k(o?.headers);
  (c.set('accept', 'application/json'), void 0 !== o?.DPoP && (we(o.DPoP), await o.DPoP.addProof(i, c, 'POST')));
  const u = await xe(e, t, a, i, s, c, o);
  return (o?.DPoP?.cacheNonce(u), u);
}
async function Ee(e, t, a, n, s) {
  ($(e), z(t), x(n, '"refreshToken"'));
  const r = new URLSearchParams(s?.additionalParameters);
  return (r.set('refresh_token', n), Re(e, t, a, 'refresh_token', r, s));
}
const je = new WeakMap(),
  Oe = new WeakMap();
function He(e) {
  if (!e.id_token) return;
  const t = je.get(e);
  if (!t) throw s('"ref" was already garbage collected or did not resolve from the proper sources', a);
  return t;
}
async function Ue(e, t, n) {
  if (($(e), !Oe.has(t))) throw s('"ref" does not contain a processed JWT Response to verify the signature of', a);
  const { 0: r, 1: o, 2: i } = Oe.get(t).split('.'),
    c = JSON.parse(f(w(r)));
  if (c.alg.startsWith('HS')) throw new y('unsupported JWS algorithm', { cause: { alg: c.alg } });
  let u;
  ((u = await ke(e, n, c)), await xt(r, o, u, w(i)));
}
async function We(e, a, r, o, i) {
  if (($(e), z(a), !t(r, Response))) throw s('"response" must be an instance of Response', n);
  let c, u;
  if ((c = fe(r)))
    throw new pe('server responded with a challenge in the WWW-Authenticate HTTP Header', { cause: c, response: r });
  if (200 !== r.status) {
    let e;
    if ((e = await St(r)))
      throw (
        await r.body?.cancel(),
        new ue('server responded with an error in the response body', { cause: e, response: r })
      );
    throw b('"response" is not a conform Token Endpoint response (unexpected HTTP status code)', at, r);
  }
  (_t(r), E(r));
  try {
    u = await r.json();
  } catch (e) {
    throw b('failed to parse "response" body as JSON', Ze, e);
  }
  if (!S(u)) throw b('"response" body must be a top level object', Xe, { body: u });
  if (
    (x(u.access_token, '"response" body "access_token" property', Xe, { body: u }),
    x(u.token_type, '"response" body "token_type" property', Xe, { body: u }),
    (u.token_type = u.token_type.toLowerCase()),
    'dpop' !== u.token_type && 'bearer' !== u.token_type)
  )
    throw new y('unsupported `token_type` value', { cause: { body: u } });
  if (void 0 !== u.expires_in) {
    let e = 'number' != typeof u.expires_in ? parseFloat(u.expires_in) : u.expires_in;
    (A(e, !1, '"response" body "expires_in" property', Xe, { body: u }), (u.expires_in = e));
  }
  if (
    (void 0 !== u.refresh_token && x(u.refresh_token, '"response" body "refresh_token" property', Xe, { body: u }),
    void 0 !== u.scope && 'string' != typeof u.scope)
  )
    throw b('"response" body "scope" property must be a string', Xe, { body: u });
  if (void 0 !== u.id_token) {
    x(u.id_token, '"response" body "id_token" property', Xe, { body: u });
    const t = ['aud', 'exp', 'iat', 'iss', 'sub'];
    (!0 === a.require_auth_time && t.push('auth_time'),
      void 0 !== a.default_max_age && (A(a.default_max_age, !1, '"client.default_max_age"'), t.push('auth_time')),
      o?.length && t.push(...o));
    const { claims: n, jwt: s } = await Rt(
      u.id_token,
      Dt.bind(void 0, a.id_token_signed_response_alg, e.id_token_signing_alg_values_supported, 'RS256'),
      N(a),
      I(a),
      i?.[d],
    )
      .then(Ke.bind(void 0, t))
      .then(Ie.bind(void 0, e))
      .then(Le.bind(void 0, a.client_id));
    if (Array.isArray(n.aud) && 1 !== n.aud.length) {
      if (void 0 === n.azp)
        throw b('ID Token "aud" (audience) claim includes additional untrusted audiences', ot, {
          claims: n,
          claim: 'aud',
        });
      if (n.azp !== a.client_id)
        throw b('unexpected ID Token "azp" (authorized party) claim value', ot, {
          expected: a.client_id,
          claims: n,
          claim: 'azp',
        });
    }
    (void 0 !== n.auth_time && A(n.auth_time, !1, 'ID Token "auth_time" (authentication time)', Xe, { claims: n }),
      Oe.set(r, s),
      je.set(u, n));
  }
  return u;
}
async function De(e, t, a, n) {
  return We(e, t, a, void 0, n);
}
function Je(e, t) {
  return void 0 !== t.claims.aud ? Le(e, t) : t;
}
function Le(e, t) {
  if (Array.isArray(t.claims.aud)) {
    if (!t.claims.aud.includes(e))
      throw b('unexpected JWT "aud" (audience) claim value', ot, { expected: e, claims: t.claims, claim: 'aud' });
  } else if (t.claims.aud !== e)
    throw b('unexpected JWT "aud" (audience) claim value', ot, { expected: e, claims: t.claims, claim: 'aud' });
  return t;
}
function Ne(e, t) {
  return void 0 !== t.claims.iss ? Ie(e, t) : t;
}
function Ie(e, t) {
  const a = e[Zt]?.(t) ?? e.issuer;
  if (t.claims.iss !== a)
    throw b('unexpected JWT "iss" (issuer) claim value', ot, { expected: a, claims: t.claims, claim: 'iss' });
  return t;
}
const Ce = new WeakSet();
async function $e(e, t, n, r, o, i, c) {
  if (($(e), z(t), !Ce.has(r)))
    throw s(
      '"callbackParameters" must be an instance of URLSearchParams obtained from "validateAuthResponse()", or "validateJwtAuthResponse()',
      a,
    );
  x(o, '"redirectUri"');
  const u = Jt(r, 'code');
  if (!u) throw b('no authorization code in "callbackParameters"', Xe);
  const d = new URLSearchParams(c?.additionalParameters);
  return (
    d.set('redirect_uri', o),
    d.set('code', u),
    i !== Qt && (x(i, '"codeVerifier"'), d.set('code_verifier', i)),
    Re(e, t, n, 'authorization_code', d, c)
  );
}
const ze = {
  aud: 'audience',
  c_hash: 'code hash',
  client_id: 'client id',
  exp: 'expiration time',
  iat: 'issued at',
  iss: 'issuer',
  jti: 'jwt id',
  nonce: 'nonce',
  s_hash: 'state hash',
  sub: 'subject',
  ath: 'access token hash',
  htm: 'http method',
  htu: 'http uri',
  cnf: 'confirmation',
  auth_time: 'authentication time',
};
function Ke(e, t) {
  for (const a of e)
    if (void 0 === t.claims[a]) throw b(`JWT "${a}" (${ze[a]}) claim missing`, Xe, { claims: t.claims });
  return t;
}
const Me = Symbol(),
  qe = Symbol();
async function Fe(e, t, a, n) {
  return 'string' == typeof n?.expectedNonce || 'number' == typeof n?.maxAge || n?.requireIdToken
    ? (async function (e, t, a, n, s, r) {
        const o = [];
        switch (n) {
          case void 0:
            n = Me;
            break;
          case Me:
            break;
          default:
            (x(n, '"expectedNonce" argument'), o.push('nonce'));
        }
        switch (((s ??= t.default_max_age), s)) {
          case void 0:
            s = qe;
            break;
          case qe:
            break;
          default:
            (A(s, !1, '"maxAge" argument'), o.push('auth_time'));
        }
        const i = await We(e, t, a, o, r);
        x(i.id_token, '"response" body "id_token" property', Xe, { body: i });
        const c = He(i);
        if (s !== qe) {
          const e = C() + N(t),
            a = I(t);
          if (c.auth_time + s < e - a)
            throw b('too much time has elapsed since the last End-User authentication', rt, {
              claims: c,
              now: e,
              tolerance: a,
              claim: 'auth_time',
            });
        }
        if (n === Me) {
          if (void 0 !== c.nonce)
            throw b('unexpected ID Token "nonce" claim value', ot, { expected: void 0, claims: c, claim: 'nonce' });
        } else if (c.nonce !== n)
          throw b('unexpected ID Token "nonce" claim value', ot, { expected: n, claims: c, claim: 'nonce' });
        return i;
      })(e, t, a, n.expectedNonce, n.maxAge, { [d]: n[d] })
    : (async function (e, t, a, n) {
        const s = await We(e, t, a, void 0, n),
          r = He(s);
        if (r) {
          if (void 0 !== t.default_max_age) {
            A(t.default_max_age, !1, '"client.default_max_age"');
            const e = C() + N(t),
              a = I(t);
            if (r.auth_time + t.default_max_age < e - a)
              throw b('too much time has elapsed since the last End-User authentication', rt, {
                claims: r,
                now: e,
                tolerance: a,
                claim: 'auth_time',
              });
          }
          if (void 0 !== r.nonce)
            throw b('unexpected ID Token "nonce" claim value', ot, { expected: void 0, claims: r, claim: 'nonce' });
        }
        return s;
      })(e, t, a, n);
}
const Ve = 'OAUTH_WWW_AUTHENTICATE_CHALLENGE',
  Be = 'OAUTH_RESPONSE_BODY_ERROR',
  Ge = 'OAUTH_UNSUPPORTED_OPERATION',
  Qe = 'OAUTH_AUTHORIZATION_RESPONSE_ERROR',
  Ye = 'OAUTH_JWT_USERINFO_EXPECTED',
  Ze = 'OAUTH_PARSE_ERROR',
  Xe = 'OAUTH_INVALID_RESPONSE',
  et = 'OAUTH_INVALID_REQUEST',
  tt = 'OAUTH_RESPONSE_IS_NOT_JSON',
  at = 'OAUTH_RESPONSE_IS_NOT_CONFORM',
  nt = 'OAUTH_HTTP_REQUEST_FORBIDDEN',
  st = 'OAUTH_REQUEST_PROTOCOL_FORBIDDEN',
  rt = 'OAUTH_JWT_TIMESTAMP_CHECK_FAILED',
  ot = 'OAUTH_JWT_CLAIM_COMPARISON_FAILED',
  it = 'OAUTH_JSON_ATTRIBUTE_COMPARISON_FAILED',
  ct = 'OAUTH_KEY_SELECTION_FAILED',
  ut = 'OAUTH_MISSING_SERVER_METADATA',
  dt = 'OAUTH_INVALID_SERVER_METADATA';
function pt(e, t) {
  if ('string' != typeof t.header.typ || t.header.typ.toLowerCase().replace(/^application\//, '') !== e)
    throw b('unexpected JWT "typ" header parameter value', Xe, { header: t.header });
  return t;
}
async function ht(e, t, a, n, s) {
  return ($(e), z(t), Re(e, t, a, 'client_credentials', new URLSearchParams(n), s));
}
async function lt(e, t, a, n, s, r) {
  return ($(e), z(t), x(n, '"grantType"'), Re(e, t, a, n, new URLSearchParams(s), r));
}
async function ft(e, t, a, n) {
  return We(e, t, a, void 0, n);
}
async function mt(e, t, a, n) {
  return We(e, t, a, void 0, n);
}
async function wt(e, t, a, n, s) {
  ($(e), z(t), x(n, '"token"'));
  const o = se(e, 'revocation_endpoint', t.use_mtls_endpoint_aliases, !0 !== s?.[r]),
    i = new URLSearchParams(s?.additionalParameters);
  i.set('token', n);
  const c = k(s?.headers);
  return (c.delete('accept'), xe(e, t, a, o, i, c, s));
}
async function yt(e) {
  if (!t(e, Response)) throw s('"response" must be an instance of Response', n);
  let a;
  if ((a = fe(e)))
    throw new pe('server responded with a challenge in the WWW-Authenticate HTTP Header', { cause: a, response: e });
  if (200 !== e.status) {
    let t;
    if ((t = await St(e)))
      throw (
        await e.body?.cancel(),
        new ue('server responded with an error in the response body', { cause: t, response: e })
      );
    throw b('"response" is not a conform Revocation Endpoint response (unexpected HTTP status code)', at, e);
  }
}
function _t(e) {
  if (e.bodyUsed) throw s('"response" body has been used already', a);
}
async function bt(e, t, a, n, s) {
  ($(e), z(t), x(n, '"token"'));
  const o = se(e, 'introspection_endpoint', t.use_mtls_endpoint_aliases, !0 !== s?.[r]),
    i = new URLSearchParams(s?.additionalParameters);
  i.set('token', n);
  const c = k(s?.headers);
  return (
    (s?.requestJwtResponse ?? t.introspection_signed_response_alg)
      ? c.set('accept', 'application/token-introspection+jwt')
      : c.set('accept', 'application/json'),
    xe(e, t, a, o, i, c, s)
  );
}
async function gt(e, a, r, o) {
  if (($(e), z(a), !t(r, Response))) throw s('"response" must be an instance of Response', n);
  let i, c;
  if ((i = fe(r)))
    throw new pe('server responded with a challenge in the WWW-Authenticate HTTP Header', { cause: i, response: r });
  if (200 !== r.status) {
    let e;
    if ((e = await St(r)))
      throw (
        await r.body?.cancel(),
        new ue('server responded with an error in the response body', { cause: e, response: r })
      );
    throw b('"response" is not a conform Introspection Endpoint response (unexpected HTTP status code)', at, r);
  }
  if ('application/token-introspection+jwt' === Te(r)) {
    _t(r);
    const { claims: t, jwt: n } = await Rt(
      await r.text(),
      Dt.bind(void 0, a.introspection_signed_response_alg, e.introspection_signing_alg_values_supported, 'RS256'),
      N(a),
      I(a),
      o?.[d],
    )
      .then(pt.bind(void 0, 'token-introspection+jwt'))
      .then(Ke.bind(void 0, ['aud', 'iat', 'iss']))
      .then(Ie.bind(void 0, e))
      .then(Le.bind(void 0, a.client_id));
    if ((Oe.set(r, n), (c = t.token_introspection), !S(c)))
      throw b('JWT "token_introspection" claim must be a JSON object', Xe, { claims: t });
  } else {
    (_t(r), E(r));
    try {
      c = await r.json();
    } catch (e) {
      throw b('failed to parse "response" body as JSON', Ze, e);
    }
    if (!S(c)) throw b('"response" body must be a top level object', Xe, { body: c });
  }
  if ('boolean' != typeof c.active) throw b('"response" body "active" property must be a boolean', Xe, { body: c });
  return c;
}
async function vt(e) {
  if (!t(e, Response)) throw s('"response" must be an instance of Response', n);
  if (200 !== e.status)
    throw b('"response" is not a conform JSON Web Key Set response (unexpected HTTP status code)', at, e);
  let a;
  (_t(e),
    (function (e, ...t) {
      if (!t.includes(Te(e))) throw j(e, ...t);
    })(e, 'application/json', 'application/jwk-set+json'));
  try {
    a = await e.json();
  } catch (e) {
    throw b('failed to parse "response" body as JSON', Ze, e);
  }
  if (!S(a)) throw b('"response" body must be a top level object', Xe, { body: a });
  if (!Array.isArray(a.keys)) throw b('"response" body "keys" property must be an array', Xe, { body: a });
  if (!Array.prototype.every.call(a.keys, S))
    throw b('"response" body "keys" property members must be JWK formatted objects', Xe, { body: a });
  return a;
}
async function St(e) {
  if (e.status > 399 && e.status < 500) {
    (_t(e), E(e));
    try {
      const t = await e.clone().json();
      if (S(t) && 'string' == typeof t.error && t.error.length) return t;
    } catch {}
  }
}
function kt(e) {
  switch (e) {
    case 'PS256':
    case 'ES256':
    case 'RS256':
    case 'PS384':
    case 'ES384':
    case 'RS384':
    case 'PS512':
    case 'ES512':
    case 'RS512':
    case 'Ed25519':
    case 'EdDSA':
      return !0;
    default:
      return !1;
  }
}
function Pt(e) {
  const { algorithm: t } = e;
  if ('number' != typeof t.modulusLength || t.modulusLength < 2048)
    throw new y(`unsupported ${t.name} modulusLength`, { cause: e });
}
function Tt(e) {
  const { algorithm: t } = e;
  switch (t.namedCurve) {
    case 'P-256':
      return 'SHA-256';
    case 'P-384':
      return 'SHA-384';
    case 'P-521':
      return 'SHA-512';
    default:
      throw new y('unsupported ECDSA namedCurve', { cause: e });
  }
}
function At(e) {
  switch (e.algorithm.name) {
    case 'ECDSA':
      return { name: e.algorithm.name, hash: Tt(e) };
    case 'RSA-PSS':
      switch ((Pt(e), e.algorithm.hash.name)) {
        case 'SHA-256':
        case 'SHA-384':
        case 'SHA-512':
          return { name: e.algorithm.name, saltLength: parseInt(e.algorithm.hash.name.slice(-3), 10) >> 3 };
        default:
          throw new y('unsupported RSA-PSS hash name', { cause: e });
      }
    case 'RSASSA-PKCS1-v1_5':
      return (Pt(e), e.algorithm.name);
    case 'Ed25519':
    case 'EdDSA':
      return e.algorithm.name;
  }
  throw new y('unsupported CryptoKey algorithm name', { cause: e });
}
async function xt(e, t, a, n) {
  const s = f(`${e}.${t}`),
    r = At(a);
  if (!(await crypto.subtle.verify(r, a, n, s)))
    throw b('JWT signature verification failed', Xe, { key: a, data: s, signature: n, algorithm: r });
}
async function Rt(e, t, a, n, s) {
  let r,
    o,
    { 0: i, 1: c, length: u } = e.split('.');
  if (5 === u) {
    if (void 0 === s) throw new y('JWE decryption is not configured', { cause: e });
    ((e = await s(e)), ({ 0: i, 1: c, length: u } = e.split('.')));
  }
  if (3 !== u) throw b('Invalid JWT', Xe, e);
  try {
    r = JSON.parse(f(w(i)));
  } catch (e) {
    throw b('failed to parse JWT Header body as base64url encoded JSON', Ze, e);
  }
  if (!S(r)) throw b('JWT Header must be a top level object', Xe, e);
  if ((t(r), void 0 !== r.crit))
    throw new y('no JWT "crit" header parameter extensions are supported', { cause: { header: r } });
  try {
    o = JSON.parse(f(w(c)));
  } catch (e) {
    throw b('failed to parse JWT Payload body as base64url encoded JSON', Ze, e);
  }
  if (!S(o)) throw b('JWT Payload must be a top level object', Xe, e);
  const d = C() + a;
  if (void 0 !== o.exp) {
    if ('number' != typeof o.exp) throw b('unexpected JWT "exp" (expiration time) claim type', Xe, { claims: o });
    if (o.exp <= d - n)
      throw b('unexpected JWT "exp" (expiration time) claim value, expiration is past current timestamp', rt, {
        claims: o,
        now: d,
        tolerance: n,
        claim: 'exp',
      });
  }
  if (void 0 !== o.iat && 'number' != typeof o.iat)
    throw b('unexpected JWT "iat" (issued at) claim type', Xe, { claims: o });
  if (void 0 !== o.iss && 'string' != typeof o.iss)
    throw b('unexpected JWT "iss" (issuer) claim type', Xe, { claims: o });
  if (void 0 !== o.nbf) {
    if ('number' != typeof o.nbf) throw b('unexpected JWT "nbf" (not before) claim type', Xe, { claims: o });
    if (o.nbf > d + n)
      throw b('unexpected JWT "nbf" (not before) claim value', rt, { claims: o, now: d, tolerance: n, claim: 'nbf' });
  }
  if (void 0 !== o.aud && 'string' != typeof o.aud && !Array.isArray(o.aud))
    throw b('unexpected JWT "aud" (audience) claim type', Xe, { claims: o });
  return { header: r, claims: o, jwt: e };
}
async function Et(e, t, a, r, o) {
  if (($(e), z(t), a instanceof URL && (a = a.searchParams), !(a instanceof URLSearchParams)))
    throw s('"parameters" must be an instance of URLSearchParams, or URL', n);
  const i = Jt(a, 'response');
  if (!i) throw b('"parameters" does not contain a JARM response', Xe);
  const {
      claims: c,
      header: u,
      jwt: p,
    } = await Rt(
      i,
      Dt.bind(void 0, t.authorization_signed_response_alg, e.authorization_signing_alg_values_supported, 'RS256'),
      N(t),
      I(t),
      o?.[d],
    )
      .then(Ke.bind(void 0, ['aud', 'exp', 'iss']))
      .then(Ie.bind(void 0, e))
      .then(Le.bind(void 0, t.client_id)),
    { 0: h, 1: l, 2: f } = p.split('.'),
    m = w(f),
    y = await ke(e, o, u);
  await xt(h, l, y, m);
  const _ = new URLSearchParams();
  for (const [e, t] of Object.entries(c)) 'string' == typeof t && 'aud' !== e && _.set(e, t);
  return It(e, t, _, r);
}
async function jt(e, t, a, n) {
  const s = await (async function (e, t, a) {
    let n;
    switch (t.alg) {
      case 'RS256':
      case 'PS256':
      case 'ES256':
        n = 'SHA-256';
        break;
      case 'RS384':
      case 'PS384':
      case 'ES384':
        n = 'SHA-384';
        break;
      case 'RS512':
      case 'PS512':
      case 'ES512':
      case 'Ed25519':
      case 'EdDSA':
        n = 'SHA-512';
        break;
      default:
        throw new y(`unsupported JWS algorithm for ${a} calculation`, { cause: { alg: t.alg } });
    }
    const s = await crypto.subtle.digest(n, f(e));
    return w(s.slice(0, s.byteLength / 2));
  })(e, a, n);
  return t === s;
}
async function Ot(e, t, a, n, s, r, o) {
  return Wt(e, t, a, n, s, r, o, !0);
}
async function Ht(e, t, a, n, s, r, o) {
  return Wt(e, t, a, n, s, r, o, !1);
}
async function Ut(e) {
  if ('POST' !== e.method) throw s('form_post responses are expected to use the POST method', a, { cause: e });
  if ('application/x-www-form-urlencoded' !== Te(e))
    throw s('form_post responses are expected to use the application/x-www-form-urlencoded content-type', a, {
      cause: e,
    });
  return (async function (e) {
    if (e.bodyUsed) throw s('form_post Request instances must contain a readable body', a, { cause: e });
    return e.text();
  })(e);
}
async function Wt(e, r, o, i, c, u, p, h) {
  if (($(e), z(r), o instanceof URL)) {
    if (!o.hash.length)
      throw s(
        '"parameters" as an instance of URL must contain a hash (fragment) with the Authorization Response parameters',
        a,
      );
    o = new URLSearchParams(o.hash.slice(1));
  } else if (t(o, Request)) o = new URLSearchParams(await Ut(o));
  else {
    if (!(o instanceof URLSearchParams))
      throw s('"parameters" must be an instance of URLSearchParams, URL, or Response', n);
    o = new URLSearchParams(o);
  }
  const l = Jt(o, 'id_token');
  switch ((o.delete('id_token'), c)) {
    case void 0:
    case Nt:
      break;
    default:
      x(c, '"expectedState" argument');
  }
  const f = It({ ...e, authorization_response_iss_parameter_supported: !1 }, r, o, c);
  if (!l) throw b('"parameters" does not contain an ID Token', Xe);
  const m = Jt(o, 'code');
  if (!m) throw b('"parameters" does not contain an Authorization Code', Xe);
  const y = ['aud', 'exp', 'iat', 'iss', 'sub', 'nonce', 'c_hash'],
    _ = o.get('state');
  (!h || ('string' != typeof c && null === _) || y.push('s_hash'),
    void 0 !== u
      ? A(u, !1, '"maxAge" argument')
      : void 0 !== r.default_max_age && A(r.default_max_age, !1, '"client.default_max_age"'),
    (u ??= r.default_max_age ?? qe),
    (r.require_auth_time || u !== qe) && y.push('auth_time'));
  const {
      claims: g,
      header: v,
      jwt: S,
    } = await Rt(
      l,
      Dt.bind(void 0, r.id_token_signed_response_alg, e.id_token_signing_alg_values_supported, 'RS256'),
      N(r),
      I(r),
      p?.[d],
    )
      .then(Ke.bind(void 0, y))
      .then(Ie.bind(void 0, e))
      .then(Le.bind(void 0, r.client_id)),
    k = N(r),
    P = C() + k;
  if (g.iat < P - 3600)
    throw b('unexpected JWT "iat" (issued at) claim value, it is too far in the past', rt, {
      now: P,
      claims: g,
      claim: 'iat',
    });
  if (
    (x(g.c_hash, 'ID Token "c_hash" (code hash) claim value', Xe, { claims: g }),
    void 0 !== g.auth_time && A(g.auth_time, !1, 'ID Token "auth_time" (authentication time)', Xe, { claims: g }),
    u !== qe)
  ) {
    const e = C() + N(r),
      t = I(r);
    if (g.auth_time + u < e - t)
      throw b('too much time has elapsed since the last End-User authentication', rt, {
        claims: g,
        now: e,
        tolerance: t,
        claim: 'auth_time',
      });
  }
  if ((x(i, '"expectedNonce" argument'), g.nonce !== i))
    throw b('unexpected ID Token "nonce" claim value', ot, { expected: i, claims: g, claim: 'nonce' });
  if (Array.isArray(g.aud) && 1 !== g.aud.length) {
    if (void 0 === g.azp)
      throw b('ID Token "aud" (audience) claim includes additional untrusted audiences', ot, {
        claims: g,
        claim: 'aud',
      });
    if (g.azp !== r.client_id)
      throw b('unexpected ID Token "azp" (authorized party) claim value', ot, {
        expected: r.client_id,
        claims: g,
        claim: 'azp',
      });
  }
  const { 0: T, 1: R, 2: E } = S.split('.'),
    j = w(E),
    O = await ke(e, p, v);
  if ((await xt(T, R, O, j), !0 !== (await jt(m, g.c_hash, v, 'c_hash'))))
    throw b('invalid ID Token "c_hash" (code hash) claim value', ot, {
      code: m,
      alg: v.alg,
      claim: 'c_hash',
      claims: g,
    });
  if (
    ((h && null !== _) || void 0 !== g.s_hash) &&
    (x(g.s_hash, 'ID Token "s_hash" (state hash) claim value', Xe, { claims: g }),
    x(_, '"state" response parameter', Xe, { parameters: o }),
    !0 !== (await jt(_, g.s_hash, v, 's_hash')))
  )
    throw b('invalid ID Token "s_hash" (state hash) claim value', ot, {
      state: _,
      alg: v.alg,
      claim: 's_hash',
      claims: g,
    });
  return f;
}
function Dt(e, t, a, n) {
  if (void 0 === e)
    if (Array.isArray(t)) {
      if (!t.includes(n.alg))
        throw b('unexpected JWT "alg" header parameter', Xe, {
          header: n,
          expected: t,
          reason: 'authorization server metadata',
        });
    } else {
      if (void 0 === a)
        throw b('missing client or server configuration to verify used JWT "alg" header parameter', void 0, {
          client: e,
          issuer: t,
          fallback: a,
        });
      if ('string' == typeof a ? n.alg !== a : 'function' == typeof a ? !a(n.alg) : !a.includes(n.alg))
        throw b('unexpected JWT "alg" header parameter', Xe, { header: n, expected: a, reason: 'default value' });
    }
  else if ('string' == typeof e ? n.alg !== e : !e.includes(n.alg))
    throw b('unexpected JWT "alg" header parameter', Xe, { header: n, expected: e, reason: 'client configuration' });
}
function Jt(e, t) {
  const { 0: a, length: n } = e.getAll(t);
  if (n > 1) throw b(`"${t}" parameter must be provided only once`, Xe);
  return a;
}
const Lt = Symbol(),
  Nt = Symbol();
function It(e, t, a, r) {
  if (($(e), z(t), a instanceof URL && (a = a.searchParams), !(a instanceof URLSearchParams)))
    throw s('"parameters" must be an instance of URLSearchParams, or URL', n);
  if (Jt(a, 'response'))
    throw b(
      '"parameters" contains a JARM response, use validateJwtAuthResponse() instead of validateAuthResponse()',
      Xe,
      { parameters: a },
    );
  const o = Jt(a, 'iss'),
    i = Jt(a, 'state');
  if (!o && e.authorization_response_iss_parameter_supported)
    throw b('response parameter "iss" (issuer) missing', Xe, { parameters: a });
  if (o && o !== e.issuer)
    throw b('unexpected "iss" (issuer) response parameter value', Xe, { expected: e.issuer, parameters: a });
  switch (r) {
    case void 0:
    case Nt:
      if (void 0 !== i)
        throw b('unexpected "state" response parameter encountered', Xe, { expected: void 0, parameters: a });
      break;
    case Lt:
      break;
    default:
      if ((x(r, '"expectedState" argument'), i !== r))
        throw b(
          void 0 === i ? 'response parameter "state" missing' : 'unexpected "state" response parameter value',
          Xe,
          { expected: r, parameters: a },
        );
  }
  if (Jt(a, 'error')) throw new de('authorization response from the server is an error', { cause: a });
  const c = Jt(a, 'id_token'),
    u = Jt(a, 'token');
  if (void 0 !== c || void 0 !== u) throw new y('implicit and hybrid flows are not supported');
  return ((d = new URLSearchParams(a)), Ce.add(d), d);
  var d;
}
function Ct(e) {
  switch (e) {
    case 'PS256':
    case 'PS384':
    case 'PS512':
      return { name: 'RSA-PSS', hash: `SHA-${e.slice(-3)}` };
    case 'RS256':
    case 'RS384':
    case 'RS512':
      return { name: 'RSASSA-PKCS1-v1_5', hash: `SHA-${e.slice(-3)}` };
    case 'ES256':
    case 'ES384':
      return { name: 'ECDSA', namedCurve: `P-${e.slice(-3)}` };
    case 'ES512':
      return { name: 'ECDSA', namedCurve: 'P-521' };
    case 'Ed25519':
    case 'EdDSA':
      return 'Ed25519';
    default:
      throw new y('unsupported JWS algorithm', { cause: { alg: e } });
  }
}
async function $t(e, t) {
  const { ext: a, key_ops: n, use: s, ...r } = t;
  return crypto.subtle.importKey('jwk', r, Ct(e), !0, ['verify']);
}
async function zt(e, t, a, n, s) {
  ($(e), z(t));
  const o = se(e, 'device_authorization_endpoint', t.use_mtls_endpoint_aliases, !0 !== s?.[r]),
    i = new URLSearchParams(n);
  i.set('client_id', t.client_id);
  const c = k(s?.headers);
  return (c.set('accept', 'application/json'), xe(e, t, a, o, i, c, s));
}
async function Kt(e, a, r) {
  if (($(e), z(a), !t(r, Response))) throw s('"response" must be an instance of Response', n);
  let o, i;
  if ((o = fe(r)))
    throw new pe('server responded with a challenge in the WWW-Authenticate HTTP Header', { cause: o, response: r });
  if (200 !== r.status) {
    let e;
    if ((e = await St(r)))
      throw (
        await r.body?.cancel(),
        new ue('server responded with an error in the response body', { cause: e, response: r })
      );
    throw b('"response" is not a conform Device Authorization Endpoint response (unexpected HTTP status code)', at, r);
  }
  (_t(r), E(r));
  try {
    i = await r.json();
  } catch (e) {
    throw b('failed to parse "response" body as JSON', Ze, e);
  }
  if (!S(i)) throw b('"response" body must be a top level object', Xe, { body: i });
  (x(i.device_code, '"response" body "device_code" property', Xe, { body: i }),
    x(i.user_code, '"response" body "user_code" property', Xe, { body: i }),
    x(i.verification_uri, '"response" body "verification_uri" property', Xe, { body: i }));
  let c = 'number' != typeof i.expires_in ? parseFloat(i.expires_in) : i.expires_in;
  return (
    A(c, !1, '"response" body "expires_in" property', Xe, { body: i }),
    (i.expires_in = c),
    void 0 !== i.verification_uri_complete &&
      x(i.verification_uri_complete, '"response" body "verification_uri_complete" property', Xe, { body: i }),
    void 0 !== i.interval && A(i.interval, !1, '"response" body "interval" property', Xe, { body: i }),
    i
  );
}
async function Mt(e, t, a, n, s) {
  ($(e), z(t), x(n, '"deviceCode"'));
  const r = new URLSearchParams(s?.additionalParameters);
  return (r.set('device_code', n), Re(e, t, a, 'urn:ietf:params:oauth:grant-type:device_code', r, s));
}
async function qt(e, t, a, n) {
  return We(e, t, a, void 0, n);
}
async function Ft(e, t) {
  x(e, '"alg"');
  const a = Ct(e);
  return (
    (e.startsWith('PS') || e.startsWith('RS')) &&
      Object.assign(a, { modulusLength: t?.modulusLength ?? 2048, publicExponent: new Uint8Array([1, 0, 1]) }),
    crypto.subtle.generateKey(a, t?.extractable ?? !1, ['sign', 'verify'])
  );
}
function Vt(e) {
  const t = new URL(e);
  return ((t.search = ''), (t.hash = ''), t.href);
}
async function Bt(e, a, r, o) {
  if (($(e), !t(a, Request))) throw s('"request" must be an instance of Request', n);
  x(r, '"expectedAudience"');
  const i = a.headers.get('authorization');
  if (null === i) throw b('"request" is missing an Authorization HTTP Header', et, { headers: a.headers });
  let { 0: c, 1: u, length: d } = i.split(' ');
  switch (((c = c.toLowerCase()), c)) {
    case 'dpop':
    case 'bearer':
      break;
    default:
      throw new y('unsupported Authorization HTTP Header scheme', { cause: { headers: a.headers } });
  }
  if (2 !== d) throw b('invalid Authorization HTTP Header format', et, { headers: a.headers });
  const p = ['iss', 'exp', 'aud', 'sub', 'iat', 'jti', 'client_id'];
  (o?.requireDPoP || 'dpop' === c || a.headers.has('dpop')) && p.push('cnf');
  const { claims: h, header: l } = await Rt(u, Dt.bind(void 0, o?.signingAlgorithms, void 0, kt), N(o), I(o), void 0)
    .then(pt.bind(void 0, 'at+jwt'))
    .then(Ke.bind(void 0, p))
    .then(Ie.bind(void 0, e))
    .then(Le.bind(void 0, r))
    .catch(Gt);
  for (const e of ['client_id', 'jti', 'sub'])
    if ('string' != typeof h[e]) throw b(`unexpected JWT "${e}" claim type`, et, { claims: h });
  if ('cnf' in h) {
    if (!S(h.cnf)) throw b('unexpected JWT "cnf" (confirmation) claim value', et, { claims: h });
    const { 0: e, length: t } = Object.keys(h.cnf);
    if (t) {
      if (1 !== t) throw new y('multiple confirmation claims are not supported', { cause: { claims: h } });
      if ('jkt' !== e) throw new y('unsupported JWT Confirmation method', { cause: { claims: h } });
    }
  }
  const { 0: m, 1: _, 2: g } = u.split('.'),
    v = w(g),
    k = await ke(e, o, l);
  return (
    await xt(m, _, k, v),
    (o?.requireDPoP || 'dpop' === c || void 0 !== h.cnf?.jkt || a.headers.has('dpop')) &&
      (await (async function (e, t, a, n) {
        const s = e.headers.get('dpop');
        if (null === s)
          throw b('operation indicated DPoP use but the request has no DPoP HTTP Header', et, { headers: e.headers });
        if (!1 === e.headers.get('authorization')?.toLowerCase().startsWith('dpop '))
          throw b("operation indicated DPoP use but the request's Authorization HTTP Header scheme is not DPoP", et, {
            headers: e.headers,
          });
        if ('string' != typeof a.cnf?.jkt)
          throw b('operation indicated DPoP use but the JWT Access Token has no jkt confirmation claim', et, {
            claims: a,
          });
        const r = N(n),
          o = await Rt(s, Dt.bind(void 0, n?.signingAlgorithms, void 0, kt), r, I(n), void 0)
            .then(pt.bind(void 0, 'dpop+jwt'))
            .then(Ke.bind(void 0, ['iat', 'jti', 'ath', 'htm', 'htu'])),
          i = C() + r;
        if (Math.abs(i - o.claims.iat) > 300)
          throw b('DPoP Proof iat is not recent enough', rt, { now: i, claims: o.claims, claim: 'iat' });
        if (o.claims.htm !== e.method)
          throw b('DPoP Proof htm mismatch', ot, { expected: e.method, claims: o.claims, claim: 'htm' });
        if ('string' != typeof o.claims.htu || Vt(o.claims.htu) !== Vt(e.url))
          throw b('DPoP Proof htu mismatch', ot, { expected: Vt(e.url), claims: o.claims, claim: 'htu' });
        {
          const e = w(await crypto.subtle.digest('SHA-256', f(t)));
          if (o.claims.ath !== e)
            throw b('DPoP Proof ath mismatch', ot, { expected: e, claims: o.claims, claim: 'ath' });
        }
        {
          let e;
          switch (o.header.jwk.kty) {
            case 'EC':
              e = { crv: o.header.jwk.crv, kty: o.header.jwk.kty, x: o.header.jwk.x, y: o.header.jwk.y };
              break;
            case 'OKP':
              e = { crv: o.header.jwk.crv, kty: o.header.jwk.kty, x: o.header.jwk.x };
              break;
            case 'RSA':
              e = { e: o.header.jwk.e, kty: o.header.jwk.kty, n: o.header.jwk.n };
              break;
            default:
              throw new y('unsupported JWK key type', { cause: o.header.jwk });
          }
          const t = w(await crypto.subtle.digest('SHA-256', f(JSON.stringify(e))));
          if (a.cnf.jkt !== t)
            throw b('JWT Access Token confirmation mismatch', ot, { expected: t, claims: a, claim: 'cnf.jkt' });
        }
        const { 0: c, 1: u, 2: d } = s.split('.'),
          p = w(d),
          { jwk: h, alg: l } = o.header;
        if (!h) throw b('DPoP Proof is missing the jwk header parameter', et, { header: o.header });
        const m = await $t(l, h);
        if ('public' !== m.type)
          throw b('DPoP Proof jwk header parameter must contain a public key', et, { header: o.header });
        await xt(c, u, m, p);
      })(a, u, h, o).catch(Gt)),
    h
  );
}
function Gt(e) {
  throw (e instanceof _ && e?.code === et && (e.code = Xe), e);
}
const Qt = Symbol(),
  Yt = Symbol(),
  Zt = Symbol();
export {
  Qe as AUTHORIZATION_RESPONSE_ERROR,
  de as AuthorizationResponseError,
  q as ClientSecretBasic,
  B as ClientSecretJwt,
  M as ClientSecretPost,
  ce as DPoP,
  nt as HTTP_REQUEST_FORBIDDEN,
  et as INVALID_REQUEST,
  Xe as INVALID_RESPONSE,
  dt as INVALID_SERVER_METADATA,
  it as JSON_ATTRIBUTE_COMPARISON,
  ot as JWT_CLAIM_COMPARISON,
  rt as JWT_TIMESTAMP_CHECK,
  Ye as JWT_USERINFO_EXPECTED,
  ct as KEY_SELECTION,
  ut as MISSING_SERVER_METADATA,
  G as None,
  _ as OperationProcessingError,
  Ze as PARSE_ERROR,
  V as PrivateKeyJwt,
  st as REQUEST_PROTOCOL_FORBIDDEN,
  Be as RESPONSE_BODY_ERROR,
  at as RESPONSE_IS_NOT_CONFORM,
  tt as RESPONSE_IS_NOT_JSON,
  ue as ResponseBodyError,
  Q as TlsClientAuth,
  Ge as UNSUPPORTED_OPERATION,
  y as UnsupportedOperationError,
  pe as WWWAuthenticateChallengeError,
  Ve as WWW_AUTHENTICATE_CHALLENGE,
  Zt as _expectedIssuer,
  Yt as _nodiscoverycheck,
  Qt as _nopkce,
  r as allowInsecureRequests,
  $e as authorizationCodeGrantRequest,
  D as calculatePKCECodeChallenge,
  ae as checkProtocol,
  ht as clientCredentialsGrantRequest,
  o as clockSkew,
  i as clockTolerance,
  c as customFetch,
  zt as deviceAuthorizationRequest,
  Mt as deviceCodeGrantRequest,
  T as discoveryRequest,
  Me as expectNoNonce,
  Nt as expectNoState,
  Ft as generateKeyPair,
  H as generateRandomCodeVerifier,
  W as generateRandomNonce,
  U as generateRandomState,
  lt as genericTokenEndpointRequest,
  He as getValidatedIdTokenClaims,
  bt as introspectionRequest,
  ie as isDPoPNonceError,
  Z as issueRequestObject,
  d as jweDecrypt,
  p as jwksCache,
  u as modifyAssertion,
  Fe as processAuthorizationCodeResponse,
  mt as processClientCredentialsResponse,
  Kt as processDeviceAuthorizationResponse,
  qt as processDeviceCodeResponse,
  R as processDiscoveryResponse,
  ft as processGenericTokenEndpointResponse,
  gt as processIntrospectionResponse,
  me as processPushedAuthorizationResponse,
  De as processRefreshTokenResponse,
  yt as processRevocationResponse,
  Ae as processUserInfoResponse,
  _e as protectedResourceRequest,
  re as pushedAuthorizationRequest,
  Ee as refreshTokenGrantRequest,
  se as resolveEndpoint,
  wt as revocationRequest,
  qe as skipAuthTimeCheck,
  Lt as skipStateCheck,
  Pe as skipSubjectCheck,
  be as userInfoRequest,
  Ue as validateApplicationLevelSignature,
  It as validateAuthResponse,
  Ht as validateCodeIdTokenResponse,
  Ot as validateDetachedSignatureResponse,
  Bt as validateJwtAccessToken,
  Et as validateJwtAuthResponse,
};
export default null;
