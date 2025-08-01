/**
 * Bundled by jsDelivr using Rollup v2.79.1 and Terser v5.19.2.
 * Original file: /npm/jose@5.9.6/dist/browser/index.js
 *
 * Do NOT use SRI with dynamically generated files! More information: https://www.jsdelivr.com/using-sri-with-dynamic-files
 */
var e = crypto;
const t = (e) => e instanceof CryptoKey,
  r = async (t, r) => {
    const a = `SHA-${t.slice(-3)}`;
    return new Uint8Array(await e.subtle.digest(a, r));
  },
  a = new TextEncoder(),
  n = new TextDecoder(),
  i = 2 ** 32;
function s(...e) {
  const t = e.reduce((e, { length: t }) => e + t, 0),
    r = new Uint8Array(t);
  let a = 0;
  for (const t of e) (r.set(t, a), (a += t.length));
  return r;
}
function o(e, t, r) {
  if (t < 0 || t >= i) throw new RangeError(`value must be >= 0 and <= ${i - 1}. Received ${t}`);
  e.set([t >>> 24, t >>> 16, t >>> 8, 255 & t], r);
}
function c(e) {
  const t = Math.floor(e / i),
    r = e % i,
    a = new Uint8Array(8);
  return (o(a, t, 0), o(a, r, 4), a);
}
function d(e) {
  const t = new Uint8Array(4);
  return (o(t, e), t);
}
function h(e) {
  return s(d(e.length), e);
}
const p = (e) => {
    let t = e;
    'string' == typeof t && (t = a.encode(t));
    const r = [];
    for (let e = 0; e < t.length; e += 32768) r.push(String.fromCharCode.apply(null, t.subarray(e, e + 32768)));
    return btoa(r.join(''));
  },
  u = (e) => p(e).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_'),
  l = (e) => {
    const t = atob(e),
      r = new Uint8Array(t.length);
    for (let e = 0; e < t.length; e++) r[e] = t.charCodeAt(e);
    return r;
  },
  y = (e) => {
    let t = e;
    (t instanceof Uint8Array && (t = n.decode(t)), (t = t.replace(/-/g, '+').replace(/_/g, '/').replace(/\s/g, '')));
    try {
      return l(t);
    } catch {
      throw new TypeError('The input to be decoded is not correctly encoded.');
    }
  };
class w extends Error {
  constructor(e, t) {
    (super(e, t),
      (this.code = 'ERR_JOSE_GENERIC'),
      (this.name = this.constructor.name),
      Error.captureStackTrace?.(this, this.constructor));
  }
}
w.code = 'ERR_JOSE_GENERIC';
class f extends w {
  constructor(e, t, r = 'unspecified', a = 'unspecified') {
    (super(e, { cause: { claim: r, reason: a, payload: t } }),
      (this.code = 'ERR_JWT_CLAIM_VALIDATION_FAILED'),
      (this.claim = r),
      (this.reason = a),
      (this.payload = t));
  }
}
f.code = 'ERR_JWT_CLAIM_VALIDATION_FAILED';
class m extends w {
  constructor(e, t, r = 'unspecified', a = 'unspecified') {
    (super(e, { cause: { claim: r, reason: a, payload: t } }),
      (this.code = 'ERR_JWT_EXPIRED'),
      (this.claim = r),
      (this.reason = a),
      (this.payload = t));
  }
}
m.code = 'ERR_JWT_EXPIRED';
class g extends w {
  constructor() {
    (super(...arguments), (this.code = 'ERR_JOSE_ALG_NOT_ALLOWED'));
  }
}
g.code = 'ERR_JOSE_ALG_NOT_ALLOWED';
class E extends w {
  constructor() {
    (super(...arguments), (this.code = 'ERR_JOSE_NOT_SUPPORTED'));
  }
}
E.code = 'ERR_JOSE_NOT_SUPPORTED';
class A extends w {
  constructor(e = 'decryption operation failed', t) {
    (super(e, t), (this.code = 'ERR_JWE_DECRYPTION_FAILED'));
  }
}
A.code = 'ERR_JWE_DECRYPTION_FAILED';
class S extends w {
  constructor() {
    (super(...arguments), (this.code = 'ERR_JWE_INVALID'));
  }
}
S.code = 'ERR_JWE_INVALID';
class b extends w {
  constructor() {
    (super(...arguments), (this.code = 'ERR_JWS_INVALID'));
  }
}
b.code = 'ERR_JWS_INVALID';
class _ extends w {
  constructor() {
    (super(...arguments), (this.code = 'ERR_JWT_INVALID'));
  }
}
_.code = 'ERR_JWT_INVALID';
class v extends w {
  constructor() {
    (super(...arguments), (this.code = 'ERR_JWK_INVALID'));
  }
}
v.code = 'ERR_JWK_INVALID';
class H extends w {
  constructor() {
    (super(...arguments), (this.code = 'ERR_JWKS_INVALID'));
  }
}
H.code = 'ERR_JWKS_INVALID';
class k extends w {
  constructor(e = 'no applicable key found in the JSON Web Key Set', t) {
    (super(e, t), (this.code = 'ERR_JWKS_NO_MATCHING_KEY'));
  }
}
k.code = 'ERR_JWKS_NO_MATCHING_KEY';
class P extends w {
  constructor(e = 'multiple matching keys found in the JSON Web Key Set', t) {
    (super(e, t), (this.code = 'ERR_JWKS_MULTIPLE_MATCHING_KEYS'));
  }
}
P.code = 'ERR_JWKS_MULTIPLE_MATCHING_KEYS';
class K extends w {
  constructor(e = 'request timed out', t) {
    (super(e, t), (this.code = 'ERR_JWKS_TIMEOUT'));
  }
}
K.code = 'ERR_JWKS_TIMEOUT';
class C extends w {
  constructor(e = 'signature verification failed', t) {
    (super(e, t), (this.code = 'ERR_JWS_SIGNATURE_VERIFICATION_FAILED'));
  }
}
C.code = 'ERR_JWS_SIGNATURE_VERIFICATION_FAILED';
var W = Object.freeze({
    __proto__: null,
    JOSEError: w,
    JWTClaimValidationFailed: f,
    JWTExpired: m,
    JOSEAlgNotAllowed: g,
    JOSENotSupported: E,
    JWEDecryptionFailed: A,
    JWEInvalid: S,
    JWSInvalid: b,
    JWTInvalid: _,
    JWKInvalid: v,
    JWKSInvalid: H,
    JWKSNoMatchingKey: k,
    JWKSMultipleMatchingKeys: P,
    JWKSTimeout: K,
    JWSSignatureVerificationFailed: C,
  }),
  J = e.getRandomValues.bind(e);
function T(e) {
  switch (e) {
    case 'A128GCM':
    case 'A128GCMKW':
    case 'A192GCM':
    case 'A192GCMKW':
    case 'A256GCM':
    case 'A256GCMKW':
      return 96;
    case 'A128CBC-HS256':
    case 'A192CBC-HS384':
    case 'A256CBC-HS512':
      return 128;
    default:
      throw new E(`Unsupported JWE Algorithm: ${e}`);
  }
}
const R = (e, t) => {
    if (t.length << 3 !== T(e)) throw new S('Invalid Initialization Vector length');
  },
  I = (e, t) => {
    const r = e.byteLength << 3;
    if (r !== t) throw new S(`Invalid Content Encryption Key length. Expected ${t} bits, got ${r} bits`);
  };
function U(e, t = 'algorithm.name') {
  return new TypeError(`CryptoKey does not support this operation, its ${t} must be ${e}`);
}
function O(e, t) {
  return e.name === t;
}
function D(e) {
  return parseInt(e.name.slice(4), 10);
}
function x(e, t) {
  if (t.length && !t.some((t) => e.usages.includes(t))) {
    let e = 'CryptoKey does not support this operation, its usages must include ';
    if (t.length > 2) {
      const r = t.pop();
      e += `one of ${t.join(', ')}, or ${r}.`;
    } else 2 === t.length ? (e += `one of ${t[0]} or ${t[1]}.`) : (e += `${t[0]}.`);
    throw new TypeError(e);
  }
}
function M(e, t, ...r) {
  switch (t) {
    case 'HS256':
    case 'HS384':
    case 'HS512': {
      if (!O(e.algorithm, 'HMAC')) throw U('HMAC');
      const r = parseInt(t.slice(2), 10);
      if (D(e.algorithm.hash) !== r) throw U(`SHA-${r}`, 'algorithm.hash');
      break;
    }
    case 'RS256':
    case 'RS384':
    case 'RS512': {
      if (!O(e.algorithm, 'RSASSA-PKCS1-v1_5')) throw U('RSASSA-PKCS1-v1_5');
      const r = parseInt(t.slice(2), 10);
      if (D(e.algorithm.hash) !== r) throw U(`SHA-${r}`, 'algorithm.hash');
      break;
    }
    case 'PS256':
    case 'PS384':
    case 'PS512': {
      if (!O(e.algorithm, 'RSA-PSS')) throw U('RSA-PSS');
      const r = parseInt(t.slice(2), 10);
      if (D(e.algorithm.hash) !== r) throw U(`SHA-${r}`, 'algorithm.hash');
      break;
    }
    case 'EdDSA':
      if ('Ed25519' !== e.algorithm.name && 'Ed448' !== e.algorithm.name) throw U('Ed25519 or Ed448');
      break;
    case 'ES256':
    case 'ES384':
    case 'ES512': {
      if (!O(e.algorithm, 'ECDSA')) throw U('ECDSA');
      const r = (function (e) {
        switch (e) {
          case 'ES256':
            return 'P-256';
          case 'ES384':
            return 'P-384';
          case 'ES512':
            return 'P-521';
          default:
            throw new Error('unreachable');
        }
      })(t);
      if (e.algorithm.namedCurve !== r) throw U(r, 'algorithm.namedCurve');
      break;
    }
    default:
      throw new TypeError('CryptoKey does not support this operation');
  }
  x(e, r);
}
function N(e, t, ...r) {
  switch (t) {
    case 'A128GCM':
    case 'A192GCM':
    case 'A256GCM': {
      if (!O(e.algorithm, 'AES-GCM')) throw U('AES-GCM');
      const r = parseInt(t.slice(1, 4), 10);
      if (e.algorithm.length !== r) throw U(r, 'algorithm.length');
      break;
    }
    case 'A128KW':
    case 'A192KW':
    case 'A256KW': {
      if (!O(e.algorithm, 'AES-KW')) throw U('AES-KW');
      const r = parseInt(t.slice(1, 4), 10);
      if (e.algorithm.length !== r) throw U(r, 'algorithm.length');
      break;
    }
    case 'ECDH':
      switch (e.algorithm.name) {
        case 'ECDH':
        case 'X25519':
        case 'X448':
          break;
        default:
          throw U('ECDH, X25519, or X448');
      }
      break;
    case 'PBES2-HS256+A128KW':
    case 'PBES2-HS384+A192KW':
    case 'PBES2-HS512+A256KW':
      if (!O(e.algorithm, 'PBKDF2')) throw U('PBKDF2');
      break;
    case 'RSA-OAEP':
    case 'RSA-OAEP-256':
    case 'RSA-OAEP-384':
    case 'RSA-OAEP-512': {
      if (!O(e.algorithm, 'RSA-OAEP')) throw U('RSA-OAEP');
      const r = parseInt(t.slice(9), 10) || 1;
      if (D(e.algorithm.hash) !== r) throw U(`SHA-${r}`, 'algorithm.hash');
      break;
    }
    default:
      throw new TypeError('CryptoKey does not support this operation');
  }
  x(e, r);
}
function j(e, t, ...r) {
  if ((r = r.filter(Boolean)).length > 2) {
    const t = r.pop();
    e += `one of type ${r.join(', ')}, or ${t}.`;
  } else 2 === r.length ? (e += `one of type ${r[0]} or ${r[1]}.`) : (e += `of type ${r[0]}.`);
  return (
    null == t
      ? (e += ` Received ${t}`)
      : 'function' == typeof t && t.name
        ? (e += ` Received function ${t.name}`)
        : 'object' == typeof t &&
          null != t &&
          t.constructor?.name &&
          (e += ` Received an instance of ${t.constructor.name}`),
    e
  );
}
var $ = (e, ...t) => j('Key must be ', e, ...t);
function B(e, t, ...r) {
  return j(`Key for the ${e} algorithm must be `, t, ...r);
}
var G = (e) => !!t(e) || 'KeyObject' === e?.[Symbol.toStringTag];
const L = ['CryptoKey'];
async function F(t, r, a, n, i, o) {
  if (!(r instanceof Uint8Array)) throw new TypeError($(r, 'Uint8Array'));
  const d = parseInt(t.slice(1, 4), 10),
    h = await e.subtle.importKey('raw', r.subarray(d >> 3), 'AES-CBC', !1, ['decrypt']),
    p = await e.subtle.importKey('raw', r.subarray(0, d >> 3), { hash: 'SHA-' + (d << 1), name: 'HMAC' }, !1, ['sign']),
    u = s(o, n, a, c(o.length << 3)),
    l = new Uint8Array((await e.subtle.sign('HMAC', p, u)).slice(0, d >> 3));
  let y, w;
  try {
    y = ((e, t) => {
      if (!(e instanceof Uint8Array)) throw new TypeError('First argument must be a buffer');
      if (!(t instanceof Uint8Array)) throw new TypeError('Second argument must be a buffer');
      if (e.length !== t.length) throw new TypeError('Input buffers must have the same length');
      const r = e.length;
      let a = 0,
        n = -1;
      for (; ++n < r; ) a |= e[n] ^ t[n];
      return 0 === a;
    })(i, l);
  } catch {}
  if (!y) throw new A();
  try {
    w = new Uint8Array(await e.subtle.decrypt({ iv: n, name: 'AES-CBC' }, h, a));
  } catch {}
  if (!w) throw new A();
  return w;
}
const V = async (r, a, n, i, o, c) => {
    if (!(t(a) || a instanceof Uint8Array)) throw new TypeError($(a, ...L, 'Uint8Array'));
    if (!i) throw new S('JWE Initialization Vector missing');
    if (!o) throw new S('JWE Authentication Tag missing');
    switch ((R(r, i), r)) {
      case 'A128CBC-HS256':
      case 'A192CBC-HS384':
      case 'A256CBC-HS512':
        return (a instanceof Uint8Array && I(a, parseInt(r.slice(-3), 10)), F(r, a, n, i, o, c));
      case 'A128GCM':
      case 'A192GCM':
      case 'A256GCM':
        return (
          a instanceof Uint8Array && I(a, parseInt(r.slice(1, 4), 10)),
          (async function (t, r, a, n, i, o) {
            let c;
            r instanceof Uint8Array
              ? (c = await e.subtle.importKey('raw', r, 'AES-GCM', !1, ['decrypt']))
              : (N(r, t, 'decrypt'), (c = r));
            try {
              return new Uint8Array(
                await e.subtle.decrypt({ additionalData: o, iv: n, name: 'AES-GCM', tagLength: 128 }, c, s(a, i)),
              );
            } catch {
              throw new A();
            }
          })(r, a, n, i, o, c)
        );
      default:
        throw new E('Unsupported JWE Content Encryption Algorithm');
    }
  },
  z = (...e) => {
    const t = e.filter(Boolean);
    if (0 === t.length || 1 === t.length) return !0;
    let r;
    for (const e of t) {
      const t = Object.keys(e);
      if (r && 0 !== r.size)
        for (const e of t) {
          if (r.has(e)) return !1;
          r.add(e);
        }
      else r = new Set(t);
    }
    return !0;
  };
function X(e) {
  if (
    !(function (e) {
      return 'object' == typeof e && null !== e;
    })(e) ||
    '[object Object]' !== Object.prototype.toString.call(e)
  )
    return !1;
  if (null === Object.getPrototypeOf(e)) return !0;
  let t = e;
  for (; null !== Object.getPrototypeOf(t); ) t = Object.getPrototypeOf(t);
  return Object.getPrototypeOf(e) === t;
}
const Y = [{ hash: 'SHA-256', name: 'HMAC' }, !0, ['sign']];
function q(e, t) {
  if (e.algorithm.length !== parseInt(t.slice(1, 4), 10)) throw new TypeError(`Invalid key size for alg: ${t}`);
}
function Q(r, a, n) {
  if (t(r)) return (N(r, a, n), r);
  if (r instanceof Uint8Array) return e.subtle.importKey('raw', r, 'AES-KW', !0, [n]);
  throw new TypeError($(r, ...L, 'Uint8Array'));
}
const Z = async (t, r, a) => {
    const n = await Q(r, t, 'wrapKey');
    q(n, t);
    const i = await e.subtle.importKey('raw', a, ...Y);
    return new Uint8Array(await e.subtle.wrapKey('raw', i, n, 'AES-KW'));
  },
  ee = async (t, r, a) => {
    const n = await Q(r, t, 'unwrapKey');
    q(n, t);
    const i = await e.subtle.unwrapKey('raw', a, n, 'AES-KW', ...Y);
    return new Uint8Array(await e.subtle.exportKey('raw', i));
  };
async function te(n, i, o, c, p = new Uint8Array(0), u = new Uint8Array(0)) {
  if (!t(n)) throw new TypeError($(n, ...L));
  if ((N(n, 'ECDH'), !t(i))) throw new TypeError($(i, ...L));
  N(i, 'ECDH', 'deriveBits');
  const l = s(h(a.encode(o)), h(p), h(u), d(c));
  let y;
  y =
    'X25519' === n.algorithm.name
      ? 256
      : 'X448' === n.algorithm.name
        ? 448
        : Math.ceil(parseInt(n.algorithm.namedCurve.substr(-3), 10) / 8) << 3;
  return (async function (e, t, a) {
    const n = Math.ceil((t >> 3) / 32),
      i = new Uint8Array(32 * n);
    for (let t = 0; t < n; t++) {
      const n = new Uint8Array(4 + e.length + a.length);
      (n.set(d(t + 1)), n.set(e, 4), n.set(a, 4 + e.length), i.set(await r('sha256', n), 32 * t));
    }
    return i.slice(0, t >> 3);
  })(new Uint8Array(await e.subtle.deriveBits({ name: n.algorithm.name, public: n }, i, y)), c, l);
}
function re(e) {
  if (!t(e)) throw new TypeError($(e, ...L));
  return (
    ['P-256', 'P-384', 'P-521'].includes(e.algorithm.namedCurve) ||
    'X25519' === e.algorithm.name ||
    'X448' === e.algorithm.name
  );
}
async function ae(r, n, i, o) {
  !(function (e) {
    if (!(e instanceof Uint8Array) || e.length < 8) throw new S('PBES2 Salt Input must be 8 or more octets');
  })(r);
  const c = (function (e, t) {
      return s(a.encode(e), new Uint8Array([0]), t);
    })(n, r),
    d = parseInt(n.slice(13, 16), 10),
    h = { hash: `SHA-${n.slice(8, 11)}`, iterations: i, name: 'PBKDF2', salt: c },
    p = { length: d, name: 'AES-KW' },
    u = await (function (r, a) {
      if (r instanceof Uint8Array) return e.subtle.importKey('raw', r, 'PBKDF2', !1, ['deriveBits']);
      if (t(r)) return (N(r, a, 'deriveBits', 'deriveKey'), r);
      throw new TypeError($(r, ...L, 'Uint8Array'));
    })(o, n);
  if (u.usages.includes('deriveBits')) return new Uint8Array(await e.subtle.deriveBits(h, u, d));
  if (u.usages.includes('deriveKey')) return e.subtle.deriveKey(h, u, p, !1, ['wrapKey', 'unwrapKey']);
  throw new TypeError('PBKDF2 key "usages" must include "deriveBits" or "deriveKey"');
}
const ne = async (e, t, r, a, n) => {
  const i = await ae(n, e, a, t);
  return ee(e.slice(-6), i, r);
};
function ie(e) {
  switch (e) {
    case 'RSA-OAEP':
    case 'RSA-OAEP-256':
    case 'RSA-OAEP-384':
    case 'RSA-OAEP-512':
      return 'RSA-OAEP';
    default:
      throw new E(`alg ${e} is not supported either by JOSE or your javascript runtime`);
  }
}
var se = (e, t) => {
  if (e.startsWith('RS') || e.startsWith('PS')) {
    const { modulusLength: r } = t.algorithm;
    if ('number' != typeof r || r < 2048)
      throw new TypeError(`${e} requires key modulusLength to be 2048 bits or larger`);
  }
};
const oe = async (r, a, n) => {
  if (!t(a)) throw new TypeError($(a, ...L));
  if ((N(a, r, 'decrypt', 'unwrapKey'), se(r, a), a.usages.includes('decrypt')))
    return new Uint8Array(await e.subtle.decrypt(ie(r), a, n));
  if (a.usages.includes('unwrapKey')) {
    const t = await e.subtle.unwrapKey('raw', n, a, ie(r), ...Y);
    return new Uint8Array(await e.subtle.exportKey('raw', t));
  }
  throw new TypeError('RSA-OAEP key "usages" must include "decrypt" or "unwrapKey" for this operation');
};
function ce(e) {
  return X(e) && 'string' == typeof e.kty;
}
const de = async (t) => {
    if (!t.alg) throw new TypeError('"alg" argument is required when "jwk.alg" is not present');
    const { algorithm: r, keyUsages: a } = (function (e) {
        let t, r;
        switch (e.kty) {
          case 'RSA':
            switch (e.alg) {
              case 'PS256':
              case 'PS384':
              case 'PS512':
                ((t = { name: 'RSA-PSS', hash: `SHA-${e.alg.slice(-3)}` }), (r = e.d ? ['sign'] : ['verify']));
                break;
              case 'RS256':
              case 'RS384':
              case 'RS512':
                ((t = { name: 'RSASSA-PKCS1-v1_5', hash: `SHA-${e.alg.slice(-3)}` }),
                  (r = e.d ? ['sign'] : ['verify']));
                break;
              case 'RSA-OAEP':
              case 'RSA-OAEP-256':
              case 'RSA-OAEP-384':
              case 'RSA-OAEP-512':
                ((t = { name: 'RSA-OAEP', hash: `SHA-${parseInt(e.alg.slice(-3), 10) || 1}` }),
                  (r = e.d ? ['decrypt', 'unwrapKey'] : ['encrypt', 'wrapKey']));
                break;
              default:
                throw new E('Invalid or unsupported JWK "alg" (Algorithm) Parameter value');
            }
            break;
          case 'EC':
            switch (e.alg) {
              case 'ES256':
                ((t = { name: 'ECDSA', namedCurve: 'P-256' }), (r = e.d ? ['sign'] : ['verify']));
                break;
              case 'ES384':
                ((t = { name: 'ECDSA', namedCurve: 'P-384' }), (r = e.d ? ['sign'] : ['verify']));
                break;
              case 'ES512':
                ((t = { name: 'ECDSA', namedCurve: 'P-521' }), (r = e.d ? ['sign'] : ['verify']));
                break;
              case 'ECDH-ES':
              case 'ECDH-ES+A128KW':
              case 'ECDH-ES+A192KW':
              case 'ECDH-ES+A256KW':
                ((t = { name: 'ECDH', namedCurve: e.crv }), (r = e.d ? ['deriveBits'] : []));
                break;
              default:
                throw new E('Invalid or unsupported JWK "alg" (Algorithm) Parameter value');
            }
            break;
          case 'OKP':
            switch (e.alg) {
              case 'EdDSA':
                ((t = { name: e.crv }), (r = e.d ? ['sign'] : ['verify']));
                break;
              case 'ECDH-ES':
              case 'ECDH-ES+A128KW':
              case 'ECDH-ES+A192KW':
              case 'ECDH-ES+A256KW':
                ((t = { name: e.crv }), (r = e.d ? ['deriveBits'] : []));
                break;
              default:
                throw new E('Invalid or unsupported JWK "alg" (Algorithm) Parameter value');
            }
            break;
          default:
            throw new E('Invalid or unsupported JWK "kty" (Key Type) Parameter value');
        }
        return { algorithm: t, keyUsages: r };
      })(t),
      n = [r, t.ext ?? !1, t.key_ops ?? a],
      i = { ...t };
    return (delete i.alg, delete i.use, e.subtle.importKey('jwk', i, ...n));
  },
  he = (e) => y(e);
let pe, ue;
const le = (e) => 'KeyObject' === e?.[Symbol.toStringTag],
  ye = async (e, t, r, a, n = !1) => {
    let i = e.get(t);
    if (i?.[a]) return i[a];
    const s = await de({ ...r, alg: a });
    return (n && Object.freeze(t), i ? (i[a] = s) : e.set(t, { [a]: s }), s);
  };
var we = {
  normalizePublicKey: (e, t) => {
    if (le(e)) {
      let r = e.export({ format: 'jwk' });
      return (
        delete r.d,
        delete r.dp,
        delete r.dq,
        delete r.p,
        delete r.q,
        delete r.qi,
        r.k ? he(r.k) : (ue || (ue = new WeakMap()), ye(ue, e, r, t))
      );
    }
    if (ce(e)) {
      if (e.k) return y(e.k);
      ue || (ue = new WeakMap());
      return ye(ue, e, e, t, !0);
    }
    return e;
  },
  normalizePrivateKey: (e, t) => {
    if (le(e)) {
      let r = e.export({ format: 'jwk' });
      return r.k ? he(r.k) : (pe || (pe = new WeakMap()), ye(pe, e, r, t));
    }
    if (ce(e)) {
      if (e.k) return y(e.k);
      pe || (pe = new WeakMap());
      return ye(pe, e, e, t, !0);
    }
    return e;
  },
};
function fe(e) {
  switch (e) {
    case 'A128GCM':
      return 128;
    case 'A192GCM':
      return 192;
    case 'A256GCM':
    case 'A128CBC-HS256':
      return 256;
    case 'A192CBC-HS384':
      return 384;
    case 'A256CBC-HS512':
      return 512;
    default:
      throw new E(`Unsupported JWE Algorithm: ${e}`);
  }
}
var me = (e) => J(new Uint8Array(fe(e) >> 3)),
  ge = (e, t) => `-----BEGIN ${t}-----\n${(e.match(/.{1,64}/g) || []).join('\n')}\n-----END ${t}-----`;
const Ee = async (r, a, n) => {
    if (!t(n)) throw new TypeError($(n, ...L));
    if (!n.extractable) throw new TypeError('CryptoKey is not extractable');
    if (n.type !== r) throw new TypeError(`key is not a ${r} key`);
    return ge(p(new Uint8Array(await e.subtle.exportKey(a, n))), `${r.toUpperCase()} KEY`);
  },
  Ae = (e, t, r = 0) => {
    0 === r && (t.unshift(t.length), t.unshift(6));
    const a = e.indexOf(t[0], r);
    if (-1 === a) return !1;
    const n = e.subarray(a, a + t.length);
    return n.length === t.length && (n.every((e, r) => e === t[r]) || Ae(e, t, a + 1));
  },
  Se = (e) => {
    switch (!0) {
      case Ae(e, [42, 134, 72, 206, 61, 3, 1, 7]):
        return 'P-256';
      case Ae(e, [43, 129, 4, 0, 34]):
        return 'P-384';
      case Ae(e, [43, 129, 4, 0, 35]):
        return 'P-521';
      case Ae(e, [43, 101, 110]):
        return 'X25519';
      case Ae(e, [43, 101, 111]):
        return 'X448';
      case Ae(e, [43, 101, 112]):
        return 'Ed25519';
      case Ae(e, [43, 101, 113]):
        return 'Ed448';
      default:
        throw new E('Invalid or unsupported EC Key Curve or OKP Key Sub Type');
    }
  },
  be = async (t, r, a, n, i) => {
    let s, o;
    const c = new Uint8Array(
        atob(a.replace(t, ''))
          .split('')
          .map((e) => e.charCodeAt(0)),
      ),
      d = 'spki' === r;
    switch (n) {
      case 'PS256':
      case 'PS384':
      case 'PS512':
        ((s = { name: 'RSA-PSS', hash: `SHA-${n.slice(-3)}` }), (o = d ? ['verify'] : ['sign']));
        break;
      case 'RS256':
      case 'RS384':
      case 'RS512':
        ((s = { name: 'RSASSA-PKCS1-v1_5', hash: `SHA-${n.slice(-3)}` }), (o = d ? ['verify'] : ['sign']));
        break;
      case 'RSA-OAEP':
      case 'RSA-OAEP-256':
      case 'RSA-OAEP-384':
      case 'RSA-OAEP-512':
        ((s = { name: 'RSA-OAEP', hash: `SHA-${parseInt(n.slice(-3), 10) || 1}` }),
          (o = d ? ['encrypt', 'wrapKey'] : ['decrypt', 'unwrapKey']));
        break;
      case 'ES256':
        ((s = { name: 'ECDSA', namedCurve: 'P-256' }), (o = d ? ['verify'] : ['sign']));
        break;
      case 'ES384':
        ((s = { name: 'ECDSA', namedCurve: 'P-384' }), (o = d ? ['verify'] : ['sign']));
        break;
      case 'ES512':
        ((s = { name: 'ECDSA', namedCurve: 'P-521' }), (o = d ? ['verify'] : ['sign']));
        break;
      case 'ECDH-ES':
      case 'ECDH-ES+A128KW':
      case 'ECDH-ES+A192KW':
      case 'ECDH-ES+A256KW': {
        const e = Se(c);
        ((s = e.startsWith('P-') ? { name: 'ECDH', namedCurve: e } : { name: e }), (o = d ? [] : ['deriveBits']));
        break;
      }
      case 'EdDSA':
        ((s = { name: Se(c) }), (o = d ? ['verify'] : ['sign']));
        break;
      default:
        throw new E('Invalid or unsupported "alg" (Algorithm) value');
    }
    return e.subtle.importKey(r, c, s, i?.extractable ?? !1, o);
  },
  _e = (e, t, r) => be(/(?:-----(?:BEGIN|END) PUBLIC KEY-----|\s)/g, 'spki', e, t, r);
function ve(e) {
  const t = [];
  let r = 0;
  for (; r < e.length; ) {
    const a = He(e.subarray(r));
    (t.push(a), (r += a.byteLength));
  }
  return t;
}
function He(e) {
  let t = 0,
    r = 31 & e[0];
  if ((t++, 31 === r)) {
    for (r = 0; e[t] >= 128; ) ((r = 128 * r + e[t] - 128), t++);
    ((r = 128 * r + e[t] - 128), t++);
  }
  let a = 0;
  if (e[t] < 128) ((a = e[t]), t++);
  else {
    if (128 === a) {
      for (a = 0; 0 !== e[t + a] || 0 !== e[t + a + 1]; ) {
        if (a > e.byteLength) throw new TypeError('invalid indefinite form length');
        a++;
      }
      const r = t + a + 2;
      return { byteLength: r, contents: e.subarray(t, t + a), raw: e.subarray(0, r) };
    }
    {
      const r = 127 & e[t];
      (t++, (a = 0));
      for (let n = 0; n < r; n++) ((a = 256 * a + e[t]), t++);
    }
  }
  const n = t + a;
  return { byteLength: n, contents: e.subarray(t, n), raw: e.subarray(0, n) };
}
function ke(e) {
  const t = e.replace(/(?:-----(?:BEGIN|END) CERTIFICATE-----|\s)/g, ''),
    r = l(t);
  return ge(
    (function (e) {
      const t = ve(ve(He(e).contents)[0].contents);
      return p(t[160 === t[0].raw[0] ? 6 : 5].raw);
    })(r),
    'PUBLIC KEY',
  );
}
async function Pe(e, t, r) {
  if ('string' != typeof e || 0 !== e.indexOf('-----BEGIN PUBLIC KEY-----'))
    throw new TypeError('"spki" must be SPKI formatted string');
  return _e(e, t, r);
}
async function Ke(e, t, r) {
  if ('string' != typeof e || 0 !== e.indexOf('-----BEGIN CERTIFICATE-----'))
    throw new TypeError('"x509" must be X.509 formatted string');
  return ((e, t, r) => {
    let a;
    try {
      a = ke(e);
    } catch (e) {
      throw new TypeError('Failed to parse the X.509 certificate', { cause: e });
    }
    return _e(a, t, r);
  })(e, t, r);
}
async function Ce(e, t, r) {
  if ('string' != typeof e || 0 !== e.indexOf('-----BEGIN PRIVATE KEY-----'))
    throw new TypeError('"pkcs8" must be PKCS#8 formatted string');
  return ((e, t, r) => be(/(?:-----(?:BEGIN|END) PRIVATE KEY-----|\s)/g, 'pkcs8', e, t, r))(e, t, r);
}
async function We(e, t) {
  if (!X(e)) throw new TypeError('JWK must be an object');
  switch ((t || (t = e.alg), e.kty)) {
    case 'oct':
      if ('string' != typeof e.k || !e.k) throw new TypeError('missing "k" (Key Value) Parameter value');
      return y(e.k);
    case 'RSA':
      if (void 0 !== e.oth) throw new E('RSA JWK "oth" (Other Primes Info) Parameter value is not supported');
    case 'EC':
    case 'OKP':
      return de({ ...e, alg: t });
    default:
      throw new E('Unsupported "kty" (Key Type) Parameter value');
  }
}
const Je = (e) => e?.[Symbol.toStringTag],
  Te = (e, t, r) => {
    if (void 0 !== t.use && 'sig' !== t.use)
      throw new TypeError('Invalid key for this operation, when present its use must be sig');
    if (void 0 !== t.key_ops && !0 !== t.key_ops.includes?.(r))
      throw new TypeError(`Invalid key for this operation, when present its key_ops must include ${r}`);
    if (void 0 !== t.alg && t.alg !== e)
      throw new TypeError(`Invalid key for this operation, when present its alg must be ${e}`);
    return !0;
  },
  Re = (e, t, r, a) => {
    if (!(t instanceof Uint8Array)) {
      if (a && ce(t)) {
        if (
          (function (e) {
            return ce(e) && 'oct' === e.kty && 'string' == typeof e.k;
          })(t) &&
          Te(e, t, r)
        )
          return;
        throw new TypeError(
          'JSON Web Key for symmetric algorithms must have JWK "kty" (Key Type) equal to "oct" and the JWK "k" (Key Value) present',
        );
      }
      if (!G(t)) throw new TypeError(B(e, t, ...L, 'Uint8Array', a ? 'JSON Web Key' : null));
      if ('secret' !== t.type)
        throw new TypeError(`${Je(t)} instances for symmetric algorithms must be of type "secret"`);
    }
  };
function Ie(e, t, r, a) {
  t.startsWith('HS') || 'dir' === t || t.startsWith('PBES2') || /^A\d{3}(?:GCM)?KW$/.test(t)
    ? Re(t, r, a, e)
    : ((e, t, r, a) => {
        if (a && ce(t))
          switch (r) {
            case 'sign':
              if (
                (function (e) {
                  return 'oct' !== e.kty && 'string' == typeof e.d;
                })(t) &&
                Te(e, t, r)
              )
                return;
              throw new TypeError('JSON Web Key for this operation be a private JWK');
            case 'verify':
              if (
                (function (e) {
                  return 'oct' !== e.kty && void 0 === e.d;
                })(t) &&
                Te(e, t, r)
              )
                return;
              throw new TypeError('JSON Web Key for this operation be a public JWK');
          }
        if (!G(t)) throw new TypeError(B(e, t, ...L, a ? 'JSON Web Key' : null));
        if ('secret' === t.type)
          throw new TypeError(`${Je(t)} instances for asymmetric algorithms must not be of type "secret"`);
        if ('sign' === r && 'public' === t.type)
          throw new TypeError(`${Je(t)} instances for asymmetric algorithm signing must be of type "private"`);
        if ('decrypt' === r && 'public' === t.type)
          throw new TypeError(`${Je(t)} instances for asymmetric algorithm decryption must be of type "private"`);
        if (t.algorithm && 'verify' === r && 'private' === t.type)
          throw new TypeError(`${Je(t)} instances for asymmetric algorithm verifying must be of type "public"`);
        if (t.algorithm && 'encrypt' === r && 'private' === t.type)
          throw new TypeError(`${Je(t)} instances for asymmetric algorithm encryption must be of type "public"`);
      })(t, r, a, e);
}
var Ue = Ie.bind(void 0, !1);
const Oe = Ie.bind(void 0, !0);
const De = async (r, a, n, i, o) => {
  if (!(t(n) || n instanceof Uint8Array)) throw new TypeError($(n, ...L, 'Uint8Array'));
  switch ((i ? R(r, i) : (i = J(new Uint8Array(T(r) >> 3))), r)) {
    case 'A128CBC-HS256':
    case 'A192CBC-HS384':
    case 'A256CBC-HS512':
      return (
        n instanceof Uint8Array && I(n, parseInt(r.slice(-3), 10)),
        (async function (t, r, a, n, i) {
          if (!(a instanceof Uint8Array)) throw new TypeError($(a, 'Uint8Array'));
          const o = parseInt(t.slice(1, 4), 10),
            d = await e.subtle.importKey('raw', a.subarray(o >> 3), 'AES-CBC', !1, ['encrypt']),
            h = await e.subtle.importKey('raw', a.subarray(0, o >> 3), { hash: 'SHA-' + (o << 1), name: 'HMAC' }, !1, [
              'sign',
            ]),
            p = new Uint8Array(await e.subtle.encrypt({ iv: n, name: 'AES-CBC' }, d, r)),
            u = s(i, n, p, c(i.length << 3));
          return { ciphertext: p, tag: new Uint8Array((await e.subtle.sign('HMAC', h, u)).slice(0, o >> 3)), iv: n };
        })(r, a, n, i, o)
      );
    case 'A128GCM':
    case 'A192GCM':
    case 'A256GCM':
      return (
        n instanceof Uint8Array && I(n, parseInt(r.slice(1, 4), 10)),
        (async function (t, r, a, n, i) {
          let s;
          a instanceof Uint8Array
            ? (s = await e.subtle.importKey('raw', a, 'AES-GCM', !1, ['encrypt']))
            : (N(a, t, 'encrypt'), (s = a));
          const o = new Uint8Array(
              await e.subtle.encrypt({ additionalData: i, iv: n, name: 'AES-GCM', tagLength: 128 }, s, r),
            ),
            c = o.slice(-16);
          return { ciphertext: o.slice(0, -16), tag: c, iv: n };
        })(r, a, n, i, o)
      );
    default:
      throw new E('Unsupported JWE Content Encryption Algorithm');
  }
};
async function xe(e, t, r, a, n) {
  switch ((Ue(e, t, 'decrypt'), (t = (await we.normalizePrivateKey?.(t, e)) || t), e)) {
    case 'dir':
      if (void 0 !== r) throw new S('Encountered unexpected JWE Encrypted Key');
      return t;
    case 'ECDH-ES':
      if (void 0 !== r) throw new S('Encountered unexpected JWE Encrypted Key');
    case 'ECDH-ES+A128KW':
    case 'ECDH-ES+A192KW':
    case 'ECDH-ES+A256KW': {
      if (!X(a.epk)) throw new S('JOSE Header "epk" (Ephemeral Public Key) missing or invalid');
      if (!re(t)) throw new E('ECDH with the provided key is not allowed or not supported by your javascript runtime');
      const n = await We(a.epk, e);
      let i, s;
      if (void 0 !== a.apu) {
        if ('string' != typeof a.apu) throw new S('JOSE Header "apu" (Agreement PartyUInfo) invalid');
        try {
          i = y(a.apu);
        } catch {
          throw new S('Failed to base64url decode the apu');
        }
      }
      if (void 0 !== a.apv) {
        if ('string' != typeof a.apv) throw new S('JOSE Header "apv" (Agreement PartyVInfo) invalid');
        try {
          s = y(a.apv);
        } catch {
          throw new S('Failed to base64url decode the apv');
        }
      }
      const o = await te(
        n,
        t,
        'ECDH-ES' === e ? a.enc : e,
        'ECDH-ES' === e ? fe(a.enc) : parseInt(e.slice(-5, -2), 10),
        i,
        s,
      );
      if ('ECDH-ES' === e) return o;
      if (void 0 === r) throw new S('JWE Encrypted Key missing');
      return ee(e.slice(-6), o, r);
    }
    case 'RSA1_5':
    case 'RSA-OAEP':
    case 'RSA-OAEP-256':
    case 'RSA-OAEP-384':
    case 'RSA-OAEP-512':
      if (void 0 === r) throw new S('JWE Encrypted Key missing');
      return oe(e, t, r);
    case 'PBES2-HS256+A128KW':
    case 'PBES2-HS384+A192KW':
    case 'PBES2-HS512+A256KW': {
      if (void 0 === r) throw new S('JWE Encrypted Key missing');
      if ('number' != typeof a.p2c) throw new S('JOSE Header "p2c" (PBES2 Count) missing or invalid');
      const i = n?.maxPBES2Count || 1e4;
      if (a.p2c > i) throw new S('JOSE Header "p2c" (PBES2 Count) out is of acceptable bounds');
      if ('string' != typeof a.p2s) throw new S('JOSE Header "p2s" (PBES2 Salt) missing or invalid');
      let s;
      try {
        s = y(a.p2s);
      } catch {
        throw new S('Failed to base64url decode the p2s');
      }
      return ne(e, t, r, a.p2c, s);
    }
    case 'A128KW':
    case 'A192KW':
    case 'A256KW':
      if (void 0 === r) throw new S('JWE Encrypted Key missing');
      return ee(e, t, r);
    case 'A128GCMKW':
    case 'A192GCMKW':
    case 'A256GCMKW': {
      if (void 0 === r) throw new S('JWE Encrypted Key missing');
      if ('string' != typeof a.iv) throw new S('JOSE Header "iv" (Initialization Vector) missing or invalid');
      if ('string' != typeof a.tag) throw new S('JOSE Header "tag" (Authentication Tag) missing or invalid');
      let n, i;
      try {
        n = y(a.iv);
      } catch {
        throw new S('Failed to base64url decode the iv');
      }
      try {
        i = y(a.tag);
      } catch {
        throw new S('Failed to base64url decode the tag');
      }
      return (async function (e, t, r, a, n) {
        const i = e.slice(0, 7);
        return V(i, t, r, a, n, new Uint8Array(0));
      })(e, t, r, n, i);
    }
    default:
      throw new E('Invalid or unsupported "alg" (JWE Algorithm) header value');
  }
}
function Me(e, t, r, a, n) {
  if (void 0 !== n.crit && void 0 === a?.crit)
    throw new e('"crit" (Critical) Header Parameter MUST be integrity protected');
  if (!a || void 0 === a.crit) return new Set();
  if (!Array.isArray(a.crit) || 0 === a.crit.length || a.crit.some((e) => 'string' != typeof e || 0 === e.length))
    throw new e('"crit" (Critical) Header Parameter MUST be an array of non-empty strings when present');
  let i;
  i = void 0 !== r ? new Map([...Object.entries(r), ...t.entries()]) : t;
  for (const t of a.crit) {
    if (!i.has(t)) throw new E(`Extension Header Parameter "${t}" is not recognized`);
    if (void 0 === n[t]) throw new e(`Extension Header Parameter "${t}" is missing`);
    if (i.get(t) && void 0 === a[t]) throw new e(`Extension Header Parameter "${t}" MUST be integrity protected`);
  }
  return new Set(a.crit);
}
const Ne = (e, t) => {
  if (void 0 !== t && (!Array.isArray(t) || t.some((e) => 'string' != typeof e)))
    throw new TypeError(`"${e}" option must be an array of strings`);
  if (t) return new Set(t);
};
async function je(e, t, r) {
  if (!X(e)) throw new S('Flattened JWE must be an object');
  if (void 0 === e.protected && void 0 === e.header && void 0 === e.unprotected) throw new S('JOSE Header missing');
  if (void 0 !== e.iv && 'string' != typeof e.iv) throw new S('JWE Initialization Vector incorrect type');
  if ('string' != typeof e.ciphertext) throw new S('JWE Ciphertext missing or incorrect type');
  if (void 0 !== e.tag && 'string' != typeof e.tag) throw new S('JWE Authentication Tag incorrect type');
  if (void 0 !== e.protected && 'string' != typeof e.protected) throw new S('JWE Protected Header incorrect type');
  if (void 0 !== e.encrypted_key && 'string' != typeof e.encrypted_key) throw new S('JWE Encrypted Key incorrect type');
  if (void 0 !== e.aad && 'string' != typeof e.aad) throw new S('JWE AAD incorrect type');
  if (void 0 !== e.header && !X(e.header)) throw new S('JWE Shared Unprotected Header incorrect type');
  if (void 0 !== e.unprotected && !X(e.unprotected)) throw new S('JWE Per-Recipient Unprotected Header incorrect type');
  let i;
  if (e.protected)
    try {
      const t = y(e.protected);
      i = JSON.parse(n.decode(t));
    } catch {
      throw new S('JWE Protected Header is invalid');
    }
  if (!z(i, e.header, e.unprotected))
    throw new S(
      'JWE Protected, JWE Unprotected Header, and JWE Per-Recipient Unprotected Header Parameter names must be disjoint',
    );
  const o = { ...i, ...e.header, ...e.unprotected };
  if ((Me(S, new Map(), r?.crit, i, o), void 0 !== o.zip))
    throw new E('JWE "zip" (Compression Algorithm) Header Parameter is not supported.');
  const { alg: c, enc: d } = o;
  if ('string' != typeof c || !c) throw new S('missing JWE Algorithm (alg) in JWE Header');
  if ('string' != typeof d || !d) throw new S('missing JWE Encryption Algorithm (enc) in JWE Header');
  const h = r && Ne('keyManagementAlgorithms', r.keyManagementAlgorithms),
    p = r && Ne('contentEncryptionAlgorithms', r.contentEncryptionAlgorithms);
  if ((h && !h.has(c)) || (!h && c.startsWith('PBES2')))
    throw new g('"alg" (Algorithm) Header Parameter value not allowed');
  if (p && !p.has(d)) throw new g('"enc" (Encryption Algorithm) Header Parameter value not allowed');
  let u;
  if (void 0 !== e.encrypted_key)
    try {
      u = y(e.encrypted_key);
    } catch {
      throw new S('Failed to base64url decode the encrypted_key');
    }
  let l,
    w,
    f,
    m = !1;
  'function' == typeof t && ((t = await t(i, e)), (m = !0));
  try {
    l = await xe(c, t, u, o, r);
  } catch (e) {
    if (e instanceof TypeError || e instanceof S || e instanceof E) throw e;
    l = me(d);
  }
  if (void 0 !== e.iv)
    try {
      w = y(e.iv);
    } catch {
      throw new S('Failed to base64url decode the iv');
    }
  if (void 0 !== e.tag)
    try {
      f = y(e.tag);
    } catch {
      throw new S('Failed to base64url decode the tag');
    }
  const A = a.encode(e.protected ?? '');
  let b, _;
  b = void 0 !== e.aad ? s(A, a.encode('.'), a.encode(e.aad)) : A;
  try {
    _ = y(e.ciphertext);
  } catch {
    throw new S('Failed to base64url decode the ciphertext');
  }
  const v = { plaintext: await V(d, l, _, w, f, b) };
  if ((void 0 !== e.protected && (v.protectedHeader = i), void 0 !== e.aad))
    try {
      v.additionalAuthenticatedData = y(e.aad);
    } catch {
      throw new S('Failed to base64url decode the aad');
    }
  return (
    void 0 !== e.unprotected && (v.sharedUnprotectedHeader = e.unprotected),
    void 0 !== e.header && (v.unprotectedHeader = e.header),
    m ? { ...v, key: t } : v
  );
}
async function $e(e, t, r) {
  if ((e instanceof Uint8Array && (e = n.decode(e)), 'string' != typeof e))
    throw new S('Compact JWE must be a string or Uint8Array');
  const { 0: a, 1: i, 2: s, 3: o, 4: c, length: d } = e.split('.');
  if (5 !== d) throw new S('Invalid Compact JWE');
  const h = await je(
      { ciphertext: o, iv: s || void 0, protected: a, tag: c || void 0, encrypted_key: i || void 0 },
      t,
      r,
    ),
    p = { plaintext: h.plaintext, protectedHeader: h.protectedHeader };
  return 'function' == typeof t ? { ...p, key: h.key } : p;
}
async function Be(e, t, r) {
  if (!X(e)) throw new S('General JWE must be an object');
  if (!Array.isArray(e.recipients) || !e.recipients.every(X)) throw new S('JWE Recipients missing or incorrect type');
  if (!e.recipients.length) throw new S('JWE Recipients has no members');
  for (const a of e.recipients)
    try {
      return await je(
        {
          aad: e.aad,
          ciphertext: e.ciphertext,
          encrypted_key: a.encrypted_key,
          header: a.header,
          iv: e.iv,
          protected: e.protected,
          tag: e.tag,
          unprotected: e.unprotected,
        },
        t,
        r,
      );
    } catch {}
  throw new A();
}
const Ge = Symbol(),
  Le = async (r) => {
    if (r instanceof Uint8Array) return { kty: 'oct', k: u(r) };
    if (!t(r)) throw new TypeError($(r, ...L, 'Uint8Array'));
    if (!r.extractable) throw new TypeError('non-extractable CryptoKey cannot be exported as a JWK');
    const { ext: a, key_ops: n, alg: i, use: s, ...o } = await e.subtle.exportKey('jwk', r);
    return o;
  };
async function Fe(e) {
  return ((e) => Ee('public', 'spki', e))(e);
}
async function Ve(e) {
  return ((e) => Ee('private', 'pkcs8', e))(e);
}
async function ze(e) {
  return Le(e);
}
async function Xe(r, a, n, i, s = {}) {
  let o, c, d;
  switch ((Ue(r, n, 'encrypt'), (n = (await we.normalizePublicKey?.(n, r)) || n), r)) {
    case 'dir':
      d = n;
      break;
    case 'ECDH-ES':
    case 'ECDH-ES+A128KW':
    case 'ECDH-ES+A192KW':
    case 'ECDH-ES+A256KW': {
      if (!re(n)) throw new E('ECDH with the provided key is not allowed or not supported by your javascript runtime');
      const { apu: h, apv: p } = s;
      let { epk: l } = s;
      l ||
        (l = (
          await (async function (r) {
            if (!t(r)) throw new TypeError($(r, ...L));
            return e.subtle.generateKey(r.algorithm, !0, ['deriveBits']);
          })(n)
        ).privateKey);
      const { x: y, y: w, crv: f, kty: m } = await ze(l),
        g = await te(n, l, 'ECDH-ES' === r ? a : r, 'ECDH-ES' === r ? fe(a) : parseInt(r.slice(-5, -2), 10), h, p);
      if (
        ((c = { epk: { x: y, crv: f, kty: m } }),
        'EC' === m && (c.epk.y = w),
        h && (c.apu = u(h)),
        p && (c.apv = u(p)),
        'ECDH-ES' === r)
      ) {
        d = g;
        break;
      }
      d = i || me(a);
      const A = r.slice(-6);
      o = await Z(A, g, d);
      break;
    }
    case 'RSA1_5':
    case 'RSA-OAEP':
    case 'RSA-OAEP-256':
    case 'RSA-OAEP-384':
    case 'RSA-OAEP-512':
      ((d = i || me(a)),
        (o = await (async (r, a, n) => {
          if (!t(a)) throw new TypeError($(a, ...L));
          if ((N(a, r, 'encrypt', 'wrapKey'), se(r, a), a.usages.includes('encrypt')))
            return new Uint8Array(await e.subtle.encrypt(ie(r), a, n));
          if (a.usages.includes('wrapKey')) {
            const t = await e.subtle.importKey('raw', n, ...Y);
            return new Uint8Array(await e.subtle.wrapKey('raw', t, a, ie(r)));
          }
          throw new TypeError('RSA-OAEP key "usages" must include "encrypt" or "wrapKey" for this operation');
        })(r, n, d)));
      break;
    case 'PBES2-HS256+A128KW':
    case 'PBES2-HS384+A192KW':
    case 'PBES2-HS512+A256KW': {
      d = i || me(a);
      const { p2c: e, p2s: t } = s;
      ({ encryptedKey: o, ...c } = await (async (e, t, r, a = 2048, n = J(new Uint8Array(16))) => {
        const i = await ae(n, e, a, t);
        return { encryptedKey: await Z(e.slice(-6), i, r), p2c: a, p2s: u(n) };
      })(r, n, d, e, t));
      break;
    }
    case 'A128KW':
    case 'A192KW':
    case 'A256KW':
      ((d = i || me(a)), (o = await Z(r, n, d)));
      break;
    case 'A128GCMKW':
    case 'A192GCMKW':
    case 'A256GCMKW': {
      d = i || me(a);
      const { iv: e } = s;
      ({ encryptedKey: o, ...c } = await (async function (e, t, r, a) {
        const n = e.slice(0, 7),
          i = await De(n, r, t, a, new Uint8Array(0));
        return { encryptedKey: i.ciphertext, iv: u(i.iv), tag: u(i.tag) };
      })(r, n, d, e));
      break;
    }
    default:
      throw new E('Invalid or unsupported "alg" (JWE Algorithm) header value');
  }
  return { cek: d, encryptedKey: o, parameters: c };
}
class Ye {
  constructor(e) {
    if (!(e instanceof Uint8Array)) throw new TypeError('plaintext must be an instance of Uint8Array');
    this._plaintext = e;
  }
  setKeyManagementParameters(e) {
    if (this._keyManagementParameters) throw new TypeError('setKeyManagementParameters can only be called once');
    return ((this._keyManagementParameters = e), this);
  }
  setProtectedHeader(e) {
    if (this._protectedHeader) throw new TypeError('setProtectedHeader can only be called once');
    return ((this._protectedHeader = e), this);
  }
  setSharedUnprotectedHeader(e) {
    if (this._sharedUnprotectedHeader) throw new TypeError('setSharedUnprotectedHeader can only be called once');
    return ((this._sharedUnprotectedHeader = e), this);
  }
  setUnprotectedHeader(e) {
    if (this._unprotectedHeader) throw new TypeError('setUnprotectedHeader can only be called once');
    return ((this._unprotectedHeader = e), this);
  }
  setAdditionalAuthenticatedData(e) {
    return ((this._aad = e), this);
  }
  setContentEncryptionKey(e) {
    if (this._cek) throw new TypeError('setContentEncryptionKey can only be called once');
    return ((this._cek = e), this);
  }
  setInitializationVector(e) {
    if (this._iv) throw new TypeError('setInitializationVector can only be called once');
    return ((this._iv = e), this);
  }
  async encrypt(e, t) {
    if (!this._protectedHeader && !this._unprotectedHeader && !this._sharedUnprotectedHeader)
      throw new S(
        'either setProtectedHeader, setUnprotectedHeader, or sharedUnprotectedHeader must be called before #encrypt()',
      );
    if (!z(this._protectedHeader, this._unprotectedHeader, this._sharedUnprotectedHeader))
      throw new S(
        'JWE Protected, JWE Shared Unprotected and JWE Per-Recipient Header Parameter names must be disjoint',
      );
    const r = { ...this._protectedHeader, ...this._unprotectedHeader, ...this._sharedUnprotectedHeader };
    if ((Me(S, new Map(), t?.crit, this._protectedHeader, r), void 0 !== r.zip))
      throw new E('JWE "zip" (Compression Algorithm) Header Parameter is not supported.');
    const { alg: i, enc: o } = r;
    if ('string' != typeof i || !i) throw new S('JWE "alg" (Algorithm) Header Parameter missing or invalid');
    if ('string' != typeof o || !o) throw new S('JWE "enc" (Encryption Algorithm) Header Parameter missing or invalid');
    let c, d, h, p, l;
    if (this._cek && ('dir' === i || 'ECDH-ES' === i))
      throw new TypeError(`setContentEncryptionKey cannot be called with JWE "alg" (Algorithm) Header ${i}`);
    {
      let r;
      (({ cek: d, encryptedKey: c, parameters: r } = await Xe(i, o, e, this._cek, this._keyManagementParameters)),
        r &&
          (t && Ge in t
            ? this._unprotectedHeader
              ? (this._unprotectedHeader = { ...this._unprotectedHeader, ...r })
              : this.setUnprotectedHeader(r)
            : this._protectedHeader
              ? (this._protectedHeader = { ...this._protectedHeader, ...r })
              : this.setProtectedHeader(r)));
    }
    ((p = this._protectedHeader ? a.encode(u(JSON.stringify(this._protectedHeader))) : a.encode('')),
      this._aad ? ((l = u(this._aad)), (h = s(p, a.encode('.'), a.encode(l)))) : (h = p));
    const { ciphertext: y, tag: w, iv: f } = await De(o, this._plaintext, d, this._iv, h),
      m = { ciphertext: u(y) };
    return (
      f && (m.iv = u(f)),
      w && (m.tag = u(w)),
      c && (m.encrypted_key = u(c)),
      l && (m.aad = l),
      this._protectedHeader && (m.protected = n.decode(p)),
      this._sharedUnprotectedHeader && (m.unprotected = this._sharedUnprotectedHeader),
      this._unprotectedHeader && (m.header = this._unprotectedHeader),
      m
    );
  }
}
class qe {
  constructor(e, t, r) {
    ((this.parent = e), (this.key = t), (this.options = r));
  }
  setUnprotectedHeader(e) {
    if (this.unprotectedHeader) throw new TypeError('setUnprotectedHeader can only be called once');
    return ((this.unprotectedHeader = e), this);
  }
  addRecipient(...e) {
    return this.parent.addRecipient(...e);
  }
  encrypt(...e) {
    return this.parent.encrypt(...e);
  }
  done() {
    return this.parent;
  }
}
class Qe {
  constructor(e) {
    ((this._recipients = []), (this._plaintext = e));
  }
  addRecipient(e, t) {
    const r = new qe(this, e, { crit: t?.crit });
    return (this._recipients.push(r), r);
  }
  setProtectedHeader(e) {
    if (this._protectedHeader) throw new TypeError('setProtectedHeader can only be called once');
    return ((this._protectedHeader = e), this);
  }
  setSharedUnprotectedHeader(e) {
    if (this._unprotectedHeader) throw new TypeError('setSharedUnprotectedHeader can only be called once');
    return ((this._unprotectedHeader = e), this);
  }
  setAdditionalAuthenticatedData(e) {
    return ((this._aad = e), this);
  }
  async encrypt() {
    if (!this._recipients.length) throw new S('at least one recipient must be added');
    if (1 === this._recipients.length) {
      const [e] = this._recipients,
        t = await new Ye(this._plaintext)
          .setAdditionalAuthenticatedData(this._aad)
          .setProtectedHeader(this._protectedHeader)
          .setSharedUnprotectedHeader(this._unprotectedHeader)
          .setUnprotectedHeader(e.unprotectedHeader)
          .encrypt(e.key, { ...e.options }),
        r = { ciphertext: t.ciphertext, iv: t.iv, recipients: [{}], tag: t.tag };
      return (
        t.aad && (r.aad = t.aad),
        t.protected && (r.protected = t.protected),
        t.unprotected && (r.unprotected = t.unprotected),
        t.encrypted_key && (r.recipients[0].encrypted_key = t.encrypted_key),
        t.header && (r.recipients[0].header = t.header),
        r
      );
    }
    let e;
    for (let t = 0; t < this._recipients.length; t++) {
      const r = this._recipients[t];
      if (!z(this._protectedHeader, this._unprotectedHeader, r.unprotectedHeader))
        throw new S(
          'JWE Protected, JWE Shared Unprotected and JWE Per-Recipient Header Parameter names must be disjoint',
        );
      const a = { ...this._protectedHeader, ...this._unprotectedHeader, ...r.unprotectedHeader },
        { alg: n } = a;
      if ('string' != typeof n || !n) throw new S('JWE "alg" (Algorithm) Header Parameter missing or invalid');
      if ('dir' === n || 'ECDH-ES' === n)
        throw new S('"dir" and "ECDH-ES" alg may only be used with a single recipient');
      if ('string' != typeof a.enc || !a.enc)
        throw new S('JWE "enc" (Encryption Algorithm) Header Parameter missing or invalid');
      if (e) {
        if (e !== a.enc)
          throw new S('JWE "enc" (Encryption Algorithm) Header Parameter must be the same for all recipients');
      } else e = a.enc;
      if ((Me(S, new Map(), r.options.crit, this._protectedHeader, a), void 0 !== a.zip))
        throw new E('JWE "zip" (Compression Algorithm) Header Parameter is not supported.');
    }
    const t = me(e),
      r = { ciphertext: '', iv: '', recipients: [], tag: '' };
    for (let a = 0; a < this._recipients.length; a++) {
      const n = this._recipients[a],
        i = {};
      r.recipients.push(i);
      const s = { ...this._protectedHeader, ...this._unprotectedHeader, ...n.unprotectedHeader }.alg.startsWith('PBES2')
        ? 2048 + a
        : void 0;
      if (0 === a) {
        const e = await new Ye(this._plaintext)
          .setAdditionalAuthenticatedData(this._aad)
          .setContentEncryptionKey(t)
          .setProtectedHeader(this._protectedHeader)
          .setSharedUnprotectedHeader(this._unprotectedHeader)
          .setUnprotectedHeader(n.unprotectedHeader)
          .setKeyManagementParameters({ p2c: s })
          .encrypt(n.key, { ...n.options, [Ge]: !0 });
        ((r.ciphertext = e.ciphertext),
          (r.iv = e.iv),
          (r.tag = e.tag),
          e.aad && (r.aad = e.aad),
          e.protected && (r.protected = e.protected),
          e.unprotected && (r.unprotected = e.unprotected),
          (i.encrypted_key = e.encrypted_key),
          e.header && (i.header = e.header));
        continue;
      }
      const { encryptedKey: o, parameters: c } = await Xe(
        n.unprotectedHeader?.alg || this._protectedHeader?.alg || this._unprotectedHeader?.alg,
        e,
        n.key,
        t,
        { p2c: s },
      );
      ((i.encrypted_key = u(o)), (n.unprotectedHeader || c) && (i.header = { ...n.unprotectedHeader, ...c }));
    }
    return r;
  }
}
function Ze(e, t) {
  const r = `SHA-${e.slice(-3)}`;
  switch (e) {
    case 'HS256':
    case 'HS384':
    case 'HS512':
      return { hash: r, name: 'HMAC' };
    case 'PS256':
    case 'PS384':
    case 'PS512':
      return { hash: r, name: 'RSA-PSS', saltLength: e.slice(-3) >> 3 };
    case 'RS256':
    case 'RS384':
    case 'RS512':
      return { hash: r, name: 'RSASSA-PKCS1-v1_5' };
    case 'ES256':
    case 'ES384':
    case 'ES512':
      return { hash: r, name: 'ECDSA', namedCurve: t.namedCurve };
    case 'EdDSA':
      return { name: t.name };
    default:
      throw new E(`alg ${e} is not supported either by JOSE or your javascript runtime`);
  }
}
async function et(r, a, n) {
  if (
    ('sign' === n && (a = await we.normalizePrivateKey(a, r)),
    'verify' === n && (a = await we.normalizePublicKey(a, r)),
    t(a))
  )
    return (M(a, r, n), a);
  if (a instanceof Uint8Array) {
    if (!r.startsWith('HS')) throw new TypeError($(a, ...L));
    return e.subtle.importKey('raw', a, { hash: `SHA-${r.slice(-3)}`, name: 'HMAC' }, !1, [n]);
  }
  throw new TypeError($(a, ...L, 'Uint8Array', 'JSON Web Key'));
}
const tt = async (t, r, a, n) => {
  const i = await et(t, r, 'verify');
  se(t, i);
  const s = Ze(t, i.algorithm);
  try {
    return await e.subtle.verify(s, i, a, n);
  } catch {
    return !1;
  }
};
async function rt(e, t, r) {
  if (!X(e)) throw new b('Flattened JWS must be an object');
  if (void 0 === e.protected && void 0 === e.header)
    throw new b('Flattened JWS must have either of the "protected" or "header" members');
  if (void 0 !== e.protected && 'string' != typeof e.protected) throw new b('JWS Protected Header incorrect type');
  if (void 0 === e.payload) throw new b('JWS Payload missing');
  if ('string' != typeof e.signature) throw new b('JWS Signature missing or incorrect type');
  if (void 0 !== e.header && !X(e.header)) throw new b('JWS Unprotected Header incorrect type');
  let i = {};
  if (e.protected)
    try {
      const t = y(e.protected);
      i = JSON.parse(n.decode(t));
    } catch {
      throw new b('JWS Protected Header is invalid');
    }
  if (!z(i, e.header)) throw new b('JWS Protected and JWS Unprotected Header Parameter names must be disjoint');
  const o = { ...i, ...e.header };
  let c = !0;
  if (Me(b, new Map([['b64', !0]]), r?.crit, i, o).has('b64') && ((c = i.b64), 'boolean' != typeof c))
    throw new b('The "b64" (base64url-encode payload) Header Parameter must be a boolean');
  const { alg: d } = o;
  if ('string' != typeof d || !d) throw new b('JWS "alg" (Algorithm) Header Parameter missing or invalid');
  const h = r && Ne('algorithms', r.algorithms);
  if (h && !h.has(d)) throw new g('"alg" (Algorithm) Header Parameter value not allowed');
  if (c) {
    if ('string' != typeof e.payload) throw new b('JWS Payload must be a string');
  } else if ('string' != typeof e.payload && !(e.payload instanceof Uint8Array))
    throw new b('JWS Payload must be a string or an Uint8Array instance');
  let p = !1;
  'function' == typeof t
    ? ((t = await t(i, e)), (p = !0), Oe(d, t, 'verify'), ce(t) && (t = await We(t, d)))
    : Oe(d, t, 'verify');
  const u = s(
    a.encode(e.protected ?? ''),
    a.encode('.'),
    'string' == typeof e.payload ? a.encode(e.payload) : e.payload,
  );
  let l;
  try {
    l = y(e.signature);
  } catch {
    throw new b('Failed to base64url decode the signature');
  }
  if (!(await tt(d, t, l, u))) throw new C();
  let w;
  if (c)
    try {
      w = y(e.payload);
    } catch {
      throw new b('Failed to base64url decode the payload');
    }
  else w = 'string' == typeof e.payload ? a.encode(e.payload) : e.payload;
  const f = { payload: w };
  return (
    void 0 !== e.protected && (f.protectedHeader = i),
    void 0 !== e.header && (f.unprotectedHeader = e.header),
    p ? { ...f, key: t } : f
  );
}
async function at(e, t, r) {
  if ((e instanceof Uint8Array && (e = n.decode(e)), 'string' != typeof e))
    throw new b('Compact JWS must be a string or Uint8Array');
  const { 0: a, 1: i, 2: s, length: o } = e.split('.');
  if (3 !== o) throw new b('Invalid Compact JWS');
  const c = await rt({ payload: i, protected: a, signature: s }, t, r),
    d = { payload: c.payload, protectedHeader: c.protectedHeader };
  return 'function' == typeof t ? { ...d, key: c.key } : d;
}
async function nt(e, t, r) {
  if (!X(e)) throw new b('General JWS must be an object');
  if (!Array.isArray(e.signatures) || !e.signatures.every(X)) throw new b('JWS Signatures missing or incorrect type');
  for (const a of e.signatures)
    try {
      return await rt({ header: a.header, payload: e.payload, protected: a.protected, signature: a.signature }, t, r);
    } catch {}
  throw new C();
}
var it = (e) => Math.floor(e.getTime() / 1e3);
const st = 86400,
  ot =
    /^(\+|\-)? ?(\d+|\d+\.\d+) ?(seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)(?: (ago|from now))?$/i;
var ct = (e) => {
  const t = ot.exec(e);
  if (!t || (t[4] && t[1])) throw new TypeError('Invalid time period format');
  const r = parseFloat(t[2]);
  let a;
  switch (t[3].toLowerCase()) {
    case 'sec':
    case 'secs':
    case 'second':
    case 'seconds':
    case 's':
      a = Math.round(r);
      break;
    case 'minute':
    case 'minutes':
    case 'min':
    case 'mins':
    case 'm':
      a = Math.round(60 * r);
      break;
    case 'hour':
    case 'hours':
    case 'hr':
    case 'hrs':
    case 'h':
      a = Math.round(3600 * r);
      break;
    case 'day':
    case 'days':
    case 'd':
      a = Math.round(r * st);
      break;
    case 'week':
    case 'weeks':
    case 'w':
      a = Math.round(604800 * r);
      break;
    default:
      a = Math.round(31557600 * r);
  }
  return '-' === t[1] || 'ago' === t[4] ? -a : a;
};
const dt = (e) => e.toLowerCase().replace(/^application\//, '');
var ht = (e, t, r = {}) => {
  let a;
  try {
    a = JSON.parse(n.decode(t));
  } catch {}
  if (!X(a)) throw new _('JWT Claims Set must be a top-level JSON object');
  const { typ: i } = r;
  if (i && ('string' != typeof e.typ || dt(e.typ) !== dt(i)))
    throw new f('unexpected "typ" JWT header value', a, 'typ', 'check_failed');
  const { requiredClaims: s = [], issuer: o, subject: c, audience: d, maxTokenAge: h } = r,
    p = [...s];
  (void 0 !== h && p.push('iat'),
    void 0 !== d && p.push('aud'),
    void 0 !== c && p.push('sub'),
    void 0 !== o && p.push('iss'));
  for (const e of new Set(p.reverse())) if (!(e in a)) throw new f(`missing required "${e}" claim`, a, e, 'missing');
  if (o && !(Array.isArray(o) ? o : [o]).includes(a.iss))
    throw new f('unexpected "iss" claim value', a, 'iss', 'check_failed');
  if (c && a.sub !== c) throw new f('unexpected "sub" claim value', a, 'sub', 'check_failed');
  if (
    d &&
    ((u = a.aud),
    (l = 'string' == typeof d ? [d] : d),
    !('string' == typeof u ? l.includes(u) : Array.isArray(u) && l.some(Set.prototype.has.bind(new Set(u)))))
  )
    throw new f('unexpected "aud" claim value', a, 'aud', 'check_failed');
  var u, l;
  let y;
  switch (typeof r.clockTolerance) {
    case 'string':
      y = ct(r.clockTolerance);
      break;
    case 'number':
      y = r.clockTolerance;
      break;
    case 'undefined':
      y = 0;
      break;
    default:
      throw new TypeError('Invalid clockTolerance option type');
  }
  const { currentDate: w } = r,
    g = it(w || new Date());
  if ((void 0 !== a.iat || h) && 'number' != typeof a.iat)
    throw new f('"iat" claim must be a number', a, 'iat', 'invalid');
  if (void 0 !== a.nbf) {
    if ('number' != typeof a.nbf) throw new f('"nbf" claim must be a number', a, 'nbf', 'invalid');
    if (a.nbf > g + y) throw new f('"nbf" claim timestamp check failed', a, 'nbf', 'check_failed');
  }
  if (void 0 !== a.exp) {
    if ('number' != typeof a.exp) throw new f('"exp" claim must be a number', a, 'exp', 'invalid');
    if (a.exp <= g - y) throw new m('"exp" claim timestamp check failed', a, 'exp', 'check_failed');
  }
  if (h) {
    const e = g - a.iat;
    if (e - y > ('number' == typeof h ? h : ct(h)))
      throw new m('"iat" claim timestamp check failed (too far in the past)', a, 'iat', 'check_failed');
    if (e < 0 - y)
      throw new f('"iat" claim timestamp check failed (it should be in the past)', a, 'iat', 'check_failed');
  }
  return a;
};
async function pt(e, t, r) {
  const a = await at(e, t, r);
  if (a.protectedHeader.crit?.includes('b64') && !1 === a.protectedHeader.b64)
    throw new _('JWTs MUST NOT use unencoded payload');
  const n = { payload: ht(a.protectedHeader, a.payload, r), protectedHeader: a.protectedHeader };
  return 'function' == typeof t ? { ...n, key: a.key } : n;
}
async function ut(e, t, r) {
  const a = await $e(e, t, r),
    n = ht(a.protectedHeader, a.plaintext, r),
    { protectedHeader: i } = a;
  if (void 0 !== i.iss && i.iss !== n.iss)
    throw new f('replicated "iss" claim header parameter mismatch', n, 'iss', 'mismatch');
  if (void 0 !== i.sub && i.sub !== n.sub)
    throw new f('replicated "sub" claim header parameter mismatch', n, 'sub', 'mismatch');
  if (void 0 !== i.aud && JSON.stringify(i.aud) !== JSON.stringify(n.aud))
    throw new f('replicated "aud" claim header parameter mismatch', n, 'aud', 'mismatch');
  const s = { payload: n, protectedHeader: i };
  return 'function' == typeof t ? { ...s, key: a.key } : s;
}
class lt {
  constructor(e) {
    this._flattened = new Ye(e);
  }
  setContentEncryptionKey(e) {
    return (this._flattened.setContentEncryptionKey(e), this);
  }
  setInitializationVector(e) {
    return (this._flattened.setInitializationVector(e), this);
  }
  setProtectedHeader(e) {
    return (this._flattened.setProtectedHeader(e), this);
  }
  setKeyManagementParameters(e) {
    return (this._flattened.setKeyManagementParameters(e), this);
  }
  async encrypt(e, t) {
    const r = await this._flattened.encrypt(e, t);
    return [r.protected, r.encrypted_key, r.iv, r.ciphertext, r.tag].join('.');
  }
}
class yt {
  constructor(e) {
    if (!(e instanceof Uint8Array)) throw new TypeError('payload must be an instance of Uint8Array');
    this._payload = e;
  }
  setProtectedHeader(e) {
    if (this._protectedHeader) throw new TypeError('setProtectedHeader can only be called once');
    return ((this._protectedHeader = e), this);
  }
  setUnprotectedHeader(e) {
    if (this._unprotectedHeader) throw new TypeError('setUnprotectedHeader can only be called once');
    return ((this._unprotectedHeader = e), this);
  }
  async sign(t, r) {
    if (!this._protectedHeader && !this._unprotectedHeader)
      throw new b('either setProtectedHeader or setUnprotectedHeader must be called before #sign()');
    if (!z(this._protectedHeader, this._unprotectedHeader))
      throw new b('JWS Protected and JWS Unprotected Header Parameter names must be disjoint');
    const i = { ...this._protectedHeader, ...this._unprotectedHeader };
    let o = !0;
    if (
      Me(b, new Map([['b64', !0]]), r?.crit, this._protectedHeader, i).has('b64') &&
      ((o = this._protectedHeader.b64), 'boolean' != typeof o)
    )
      throw new b('The "b64" (base64url-encode payload) Header Parameter must be a boolean');
    const { alg: c } = i;
    if ('string' != typeof c || !c) throw new b('JWS "alg" (Algorithm) Header Parameter missing or invalid');
    Oe(c, t, 'sign');
    let d,
      h = this._payload;
    (o && (h = a.encode(u(h))),
      (d = this._protectedHeader ? a.encode(u(JSON.stringify(this._protectedHeader))) : a.encode('')));
    const p = s(d, a.encode('.'), h),
      l = await (async (t, r, a) => {
        const n = await et(t, r, 'sign');
        se(t, n);
        const i = await e.subtle.sign(Ze(t, n.algorithm), n, a);
        return new Uint8Array(i);
      })(c, t, p),
      y = { signature: u(l), payload: '' };
    return (
      o && (y.payload = n.decode(h)),
      this._unprotectedHeader && (y.header = this._unprotectedHeader),
      this._protectedHeader && (y.protected = n.decode(d)),
      y
    );
  }
}
class wt {
  constructor(e) {
    this._flattened = new yt(e);
  }
  setProtectedHeader(e) {
    return (this._flattened.setProtectedHeader(e), this);
  }
  async sign(e, t) {
    const r = await this._flattened.sign(e, t);
    if (void 0 === r.payload) throw new TypeError('use the flattened module for creating JWS with b64: false');
    return `${r.protected}.${r.payload}.${r.signature}`;
  }
}
class ft {
  constructor(e, t, r) {
    ((this.parent = e), (this.key = t), (this.options = r));
  }
  setProtectedHeader(e) {
    if (this.protectedHeader) throw new TypeError('setProtectedHeader can only be called once');
    return ((this.protectedHeader = e), this);
  }
  setUnprotectedHeader(e) {
    if (this.unprotectedHeader) throw new TypeError('setUnprotectedHeader can only be called once');
    return ((this.unprotectedHeader = e), this);
  }
  addSignature(...e) {
    return this.parent.addSignature(...e);
  }
  sign(...e) {
    return this.parent.sign(...e);
  }
  done() {
    return this.parent;
  }
}
class mt {
  constructor(e) {
    ((this._signatures = []), (this._payload = e));
  }
  addSignature(e, t) {
    const r = new ft(this, e, t);
    return (this._signatures.push(r), r);
  }
  async sign() {
    if (!this._signatures.length) throw new b('at least one signature must be added');
    const e = { signatures: [], payload: '' };
    for (let t = 0; t < this._signatures.length; t++) {
      const r = this._signatures[t],
        a = new yt(this._payload);
      (a.setProtectedHeader(r.protectedHeader), a.setUnprotectedHeader(r.unprotectedHeader));
      const { payload: n, ...i } = await a.sign(r.key, r.options);
      if (0 === t) e.payload = n;
      else if (e.payload !== n) throw new b('inconsistent use of JWS Unencoded Payload (RFC7797)');
      e.signatures.push(i);
    }
    return e;
  }
}
function gt(e, t) {
  if (!Number.isFinite(t)) throw new TypeError(`Invalid ${e} input`);
  return t;
}
class Et {
  constructor(e = {}) {
    if (!X(e)) throw new TypeError('JWT Claims Set MUST be an object');
    this._payload = e;
  }
  setIssuer(e) {
    return ((this._payload = { ...this._payload, iss: e }), this);
  }
  setSubject(e) {
    return ((this._payload = { ...this._payload, sub: e }), this);
  }
  setAudience(e) {
    return ((this._payload = { ...this._payload, aud: e }), this);
  }
  setJti(e) {
    return ((this._payload = { ...this._payload, jti: e }), this);
  }
  setNotBefore(e) {
    return (
      'number' == typeof e
        ? (this._payload = { ...this._payload, nbf: gt('setNotBefore', e) })
        : e instanceof Date
          ? (this._payload = { ...this._payload, nbf: gt('setNotBefore', it(e)) })
          : (this._payload = { ...this._payload, nbf: it(new Date()) + ct(e) }),
      this
    );
  }
  setExpirationTime(e) {
    return (
      'number' == typeof e
        ? (this._payload = { ...this._payload, exp: gt('setExpirationTime', e) })
        : e instanceof Date
          ? (this._payload = { ...this._payload, exp: gt('setExpirationTime', it(e)) })
          : (this._payload = { ...this._payload, exp: it(new Date()) + ct(e) }),
      this
    );
  }
  setIssuedAt(e) {
    return (
      void 0 === e
        ? (this._payload = { ...this._payload, iat: it(new Date()) })
        : e instanceof Date
          ? (this._payload = { ...this._payload, iat: gt('setIssuedAt', it(e)) })
          : (this._payload =
              'string' == typeof e
                ? { ...this._payload, iat: gt('setIssuedAt', it(new Date()) + ct(e)) }
                : { ...this._payload, iat: gt('setIssuedAt', e) }),
      this
    );
  }
}
class At extends Et {
  setProtectedHeader(e) {
    return ((this._protectedHeader = e), this);
  }
  async sign(e, t) {
    const r = new wt(a.encode(JSON.stringify(this._payload)));
    if (
      (r.setProtectedHeader(this._protectedHeader),
      Array.isArray(this._protectedHeader?.crit) &&
        this._protectedHeader.crit.includes('b64') &&
        !1 === this._protectedHeader.b64)
    )
      throw new _('JWTs MUST NOT use unencoded payload');
    return r.sign(e, t);
  }
}
class St extends Et {
  setProtectedHeader(e) {
    if (this._protectedHeader) throw new TypeError('setProtectedHeader can only be called once');
    return ((this._protectedHeader = e), this);
  }
  setKeyManagementParameters(e) {
    if (this._keyManagementParameters) throw new TypeError('setKeyManagementParameters can only be called once');
    return ((this._keyManagementParameters = e), this);
  }
  setContentEncryptionKey(e) {
    if (this._cek) throw new TypeError('setContentEncryptionKey can only be called once');
    return ((this._cek = e), this);
  }
  setInitializationVector(e) {
    if (this._iv) throw new TypeError('setInitializationVector can only be called once');
    return ((this._iv = e), this);
  }
  replicateIssuerAsHeader() {
    return ((this._replicateIssuerAsHeader = !0), this);
  }
  replicateSubjectAsHeader() {
    return ((this._replicateSubjectAsHeader = !0), this);
  }
  replicateAudienceAsHeader() {
    return ((this._replicateAudienceAsHeader = !0), this);
  }
  async encrypt(e, t) {
    const r = new lt(a.encode(JSON.stringify(this._payload)));
    return (
      this._replicateIssuerAsHeader && (this._protectedHeader = { ...this._protectedHeader, iss: this._payload.iss }),
      this._replicateSubjectAsHeader && (this._protectedHeader = { ...this._protectedHeader, sub: this._payload.sub }),
      this._replicateAudienceAsHeader && (this._protectedHeader = { ...this._protectedHeader, aud: this._payload.aud }),
      r.setProtectedHeader(this._protectedHeader),
      this._iv && r.setInitializationVector(this._iv),
      this._cek && r.setContentEncryptionKey(this._cek),
      this._keyManagementParameters && r.setKeyManagementParameters(this._keyManagementParameters),
      r.encrypt(e, t)
    );
  }
}
const bt = (e, t) => {
  if ('string' != typeof e || !e) throw new v(`${t} missing or invalid`);
};
async function _t(e, t) {
  if (!X(e)) throw new TypeError('JWK must be an object');
  if ((t ?? (t = 'sha256'), 'sha256' !== t && 'sha384' !== t && 'sha512' !== t))
    throw new TypeError('digestAlgorithm must one of "sha256", "sha384", or "sha512"');
  let n;
  switch (e.kty) {
    case 'EC':
      (bt(e.crv, '"crv" (Curve) Parameter'),
        bt(e.x, '"x" (X Coordinate) Parameter'),
        bt(e.y, '"y" (Y Coordinate) Parameter'),
        (n = { crv: e.crv, kty: e.kty, x: e.x, y: e.y }));
      break;
    case 'OKP':
      (bt(e.crv, '"crv" (Subtype of Key Pair) Parameter'),
        bt(e.x, '"x" (Public Key) Parameter'),
        (n = { crv: e.crv, kty: e.kty, x: e.x }));
      break;
    case 'RSA':
      (bt(e.e, '"e" (Exponent) Parameter'), bt(e.n, '"n" (Modulus) Parameter'), (n = { e: e.e, kty: e.kty, n: e.n }));
      break;
    case 'oct':
      (bt(e.k, '"k" (Key Value) Parameter'), (n = { k: e.k, kty: e.kty }));
      break;
    default:
      throw new E('"kty" (Key Type) Parameter missing or unsupported');
  }
  const i = a.encode(JSON.stringify(n));
  return u(await r(t, i));
}
async function vt(e, t) {
  t ?? (t = 'sha256');
  const r = await _t(e, t);
  return `urn:ietf:params:oauth:jwk-thumbprint:sha-${t.slice(-3)}:${r}`;
}
async function Ht(e, t) {
  const r = { ...e, ...t?.header };
  if (!X(r.jwk)) throw new b('"jwk" (JSON Web Key) Header Parameter must be a JSON object');
  const a = await We({ ...r.jwk, ext: !0 }, r.alg);
  if (a instanceof Uint8Array || 'public' !== a.type)
    throw new b('"jwk" (JSON Web Key) Header Parameter must be a public key');
  return a;
}
function kt(e) {
  return X(e);
}
function Pt(e) {
  return 'function' == typeof structuredClone ? structuredClone(e) : JSON.parse(JSON.stringify(e));
}
class Kt {
  constructor(e) {
    if (
      ((this._cached = new WeakMap()),
      !(function (e) {
        return e && 'object' == typeof e && Array.isArray(e.keys) && e.keys.every(kt);
      })(e))
    )
      throw new H('JSON Web Key Set malformed');
    this._jwks = Pt(e);
  }
  async getKey(e, t) {
    const { alg: r, kid: a } = { ...e, ...t?.header },
      n = (function (e) {
        switch ('string' == typeof e && e.slice(0, 2)) {
          case 'RS':
          case 'PS':
            return 'RSA';
          case 'ES':
            return 'EC';
          case 'Ed':
            return 'OKP';
          default:
            throw new E('Unsupported "alg" value for a JSON Web Key Set');
        }
      })(r),
      i = this._jwks.keys.filter((e) => {
        let t = n === e.kty;
        if (
          (t && 'string' == typeof a && (t = a === e.kid),
          t && 'string' == typeof e.alg && (t = r === e.alg),
          t && 'string' == typeof e.use && (t = 'sig' === e.use),
          t && Array.isArray(e.key_ops) && (t = e.key_ops.includes('verify')),
          t && 'EdDSA' === r && (t = 'Ed25519' === e.crv || 'Ed448' === e.crv),
          t)
        )
          switch (r) {
            case 'ES256':
              t = 'P-256' === e.crv;
              break;
            case 'ES256K':
              t = 'secp256k1' === e.crv;
              break;
            case 'ES384':
              t = 'P-384' === e.crv;
              break;
            case 'ES512':
              t = 'P-521' === e.crv;
          }
        return t;
      }),
      { 0: s, length: o } = i;
    if (0 === o) throw new k();
    if (1 !== o) {
      const e = new P(),
        { _cached: t } = this;
      throw (
        (e[Symbol.asyncIterator] = async function* () {
          for (const e of i)
            try {
              yield await Ct(t, e, r);
            } catch {}
        }),
        e
      );
    }
    return Ct(this._cached, s, r);
  }
}
async function Ct(e, t, r) {
  const a = e.get(t) || e.set(t, {}).get(t);
  if (void 0 === a[r]) {
    const e = await We({ ...t, ext: !0 }, r);
    if (e instanceof Uint8Array || 'public' !== e.type) throw new H('JSON Web Key Set members must be public keys');
    a[r] = e;
  }
  return a[r];
}
function Wt(e) {
  const t = new Kt(e),
    r = async (e, r) => t.getKey(e, r);
  return (
    Object.defineProperties(r, { jwks: { value: () => Pt(t._jwks), enumerable: !0, configurable: !1, writable: !1 } }),
    r
  );
}
let Jt;
if ('undefined' == typeof navigator || !navigator.userAgent?.startsWith?.('Mozilla/5.0 ')) {
  Jt = `${'jose'}/${'v5.9.6'}`;
}
const Tt = Symbol();
class Rt {
  constructor(e, t) {
    if (!(e instanceof URL)) throw new TypeError('url must be an instance of URL');
    var r, a;
    ((this._url = new URL(e.href)),
      (this._options = { agent: t?.agent, headers: t?.headers }),
      (this._timeoutDuration = 'number' == typeof t?.timeoutDuration ? t?.timeoutDuration : 5e3),
      (this._cooldownDuration = 'number' == typeof t?.cooldownDuration ? t?.cooldownDuration : 3e4),
      (this._cacheMaxAge = 'number' == typeof t?.cacheMaxAge ? t?.cacheMaxAge : 6e5),
      void 0 !== t?.[Tt] &&
        ((this._cache = t?.[Tt]),
        (r = t?.[Tt]),
        (a = this._cacheMaxAge),
        'object' == typeof r &&
          null !== r &&
          'uat' in r &&
          'number' == typeof r.uat &&
          !(Date.now() - r.uat >= a) &&
          'jwks' in r &&
          X(r.jwks) &&
          Array.isArray(r.jwks.keys) &&
          Array.prototype.every.call(r.jwks.keys, X) &&
          ((this._jwksTimestamp = this._cache.uat), (this._local = Wt(this._cache.jwks)))));
  }
  coolingDown() {
    return 'number' == typeof this._jwksTimestamp && Date.now() < this._jwksTimestamp + this._cooldownDuration;
  }
  fresh() {
    return 'number' == typeof this._jwksTimestamp && Date.now() < this._jwksTimestamp + this._cacheMaxAge;
  }
  async getKey(e, t) {
    (this._local && this.fresh()) || (await this.reload());
    try {
      return await this._local(e, t);
    } catch (r) {
      if (r instanceof k && !1 === this.coolingDown()) return (await this.reload(), this._local(e, t));
      throw r;
    }
  }
  async reload() {
    this._pendingFetch &&
      ('undefined' != typeof WebSocketPair ||
        ('undefined' != typeof navigator && 'Cloudflare-Workers' === navigator.userAgent) ||
        ('undefined' != typeof EdgeRuntime && 'vercel' === EdgeRuntime)) &&
      (this._pendingFetch = void 0);
    const e = new Headers(this._options.headers);
    (Jt && !e.has('User-Agent') && (e.set('User-Agent', Jt), (this._options.headers = Object.fromEntries(e.entries()))),
      this._pendingFetch ||
        (this._pendingFetch = (async (e, t, r) => {
          let a,
            n,
            i = !1;
          'function' == typeof AbortController &&
            ((a = new AbortController()),
            (n = setTimeout(() => {
              ((i = !0), a.abort());
            }, t)));
          const s = await fetch(e.href, {
            signal: a ? a.signal : void 0,
            redirect: 'manual',
            headers: r.headers,
          }).catch((e) => {
            if (i) throw new K();
            throw e;
          });
          if ((void 0 !== n && clearTimeout(n), 200 !== s.status))
            throw new w('Expected 200 OK from the JSON Web Key Set HTTP response');
          try {
            return await s.json();
          } catch {
            throw new w('Failed to parse the JSON Web Key Set HTTP response as JSON');
          }
        })(this._url, this._timeoutDuration, this._options)
          .then((e) => {
            ((this._local = Wt(e)),
              this._cache && ((this._cache.uat = Date.now()), (this._cache.jwks = e)),
              (this._jwksTimestamp = Date.now()),
              (this._pendingFetch = void 0));
          })
          .catch((e) => {
            throw ((this._pendingFetch = void 0), e);
          })),
      await this._pendingFetch);
  }
}
function It(e, t) {
  const r = new Rt(e, t),
    a = async (e, t) => r.getKey(e, t);
  return (
    Object.defineProperties(a, {
      coolingDown: { get: () => r.coolingDown(), enumerable: !0, configurable: !1 },
      fresh: { get: () => r.fresh(), enumerable: !0, configurable: !1 },
      reload: { value: () => r.reload(), enumerable: !0, configurable: !1, writable: !1 },
      reloading: { get: () => !!r._pendingFetch, enumerable: !0, configurable: !1 },
      jwks: { value: () => r._local?.jwks(), enumerable: !0, configurable: !1, writable: !1 },
    }),
    a
  );
}
const Ut = Tt;
class Ot extends Et {
  encode() {
    return `${u(JSON.stringify({ alg: 'none' }))}.${u(JSON.stringify(this._payload))}.`;
  }
  static decode(e, t) {
    if ('string' != typeof e) throw new _('Unsecured JWT must be a string');
    const { 0: r, 1: a, 2: i, length: s } = e.split('.');
    if (3 !== s || '' !== i) throw new _('Invalid Unsecured JWT');
    let o;
    try {
      if (((o = JSON.parse(n.decode(y(r)))), 'none' !== o.alg)) throw new Error();
    } catch {
      throw new _('Invalid Unsecured JWT');
    }
    return { payload: ht(o, y(a), t), header: o };
  }
}
const Dt = u,
  xt = y;
var Mt = Object.freeze({ __proto__: null, encode: Dt, decode: xt });
function Nt(e) {
  let t;
  if ('string' == typeof e) {
    const r = e.split('.');
    (3 !== r.length && 5 !== r.length) || ([t] = r);
  } else if ('object' == typeof e && e) {
    if (!('protected' in e)) throw new TypeError('Token does not contain a Protected Header');
    t = e.protected;
  }
  try {
    if ('string' != typeof t || !t) throw new Error();
    const e = JSON.parse(n.decode(xt(t)));
    if (!X(e)) throw new Error();
    return e;
  } catch {
    throw new TypeError('Invalid Token or Protected Header formatting');
  }
}
function jt(e) {
  if ('string' != typeof e) throw new _('JWTs must use Compact JWS serialization, JWT must be a string');
  const { 1: t, length: r } = e.split('.');
  if (5 === r) throw new _('Only JWTs using Compact JWS serialization can be decoded');
  if (3 !== r) throw new _('Invalid JWT');
  if (!t) throw new _('JWTs must contain a payload');
  let a, i;
  try {
    a = xt(t);
  } catch {
    throw new _('Failed to base64url decode the payload');
  }
  try {
    i = JSON.parse(n.decode(a));
  } catch {
    throw new _('Failed to parse the decoded payload as JSON');
  }
  if (!X(i)) throw new _('Invalid JWT Claims Set');
  return i;
}
function $t(e) {
  const t = e?.modulusLength ?? 2048;
  if ('number' != typeof t || t < 2048)
    throw new E('Invalid or unsupported modulusLength option provided, 2048 bits or larger keys must be used');
  return t;
}
async function Bt(t, r) {
  return (async function (t, r) {
    let a, n;
    switch (t) {
      case 'PS256':
      case 'PS384':
      case 'PS512':
        ((a = {
          name: 'RSA-PSS',
          hash: `SHA-${t.slice(-3)}`,
          publicExponent: new Uint8Array([1, 0, 1]),
          modulusLength: $t(r),
        }),
          (n = ['sign', 'verify']));
        break;
      case 'RS256':
      case 'RS384':
      case 'RS512':
        ((a = {
          name: 'RSASSA-PKCS1-v1_5',
          hash: `SHA-${t.slice(-3)}`,
          publicExponent: new Uint8Array([1, 0, 1]),
          modulusLength: $t(r),
        }),
          (n = ['sign', 'verify']));
        break;
      case 'RSA-OAEP':
      case 'RSA-OAEP-256':
      case 'RSA-OAEP-384':
      case 'RSA-OAEP-512':
        ((a = {
          name: 'RSA-OAEP',
          hash: `SHA-${parseInt(t.slice(-3), 10) || 1}`,
          publicExponent: new Uint8Array([1, 0, 1]),
          modulusLength: $t(r),
        }),
          (n = ['decrypt', 'unwrapKey', 'encrypt', 'wrapKey']));
        break;
      case 'ES256':
        ((a = { name: 'ECDSA', namedCurve: 'P-256' }), (n = ['sign', 'verify']));
        break;
      case 'ES384':
        ((a = { name: 'ECDSA', namedCurve: 'P-384' }), (n = ['sign', 'verify']));
        break;
      case 'ES512':
        ((a = { name: 'ECDSA', namedCurve: 'P-521' }), (n = ['sign', 'verify']));
        break;
      case 'EdDSA': {
        n = ['sign', 'verify'];
        const e = r?.crv ?? 'Ed25519';
        switch (e) {
          case 'Ed25519':
          case 'Ed448':
            a = { name: e };
            break;
          default:
            throw new E('Invalid or unsupported crv option provided');
        }
        break;
      }
      case 'ECDH-ES':
      case 'ECDH-ES+A128KW':
      case 'ECDH-ES+A192KW':
      case 'ECDH-ES+A256KW': {
        n = ['deriveKey', 'deriveBits'];
        const e = r?.crv ?? 'P-256';
        switch (e) {
          case 'P-256':
          case 'P-384':
          case 'P-521':
            a = { name: 'ECDH', namedCurve: e };
            break;
          case 'X25519':
          case 'X448':
            a = { name: e };
            break;
          default:
            throw new E(
              'Invalid or unsupported crv option provided, supported values are P-256, P-384, P-521, X25519, and X448',
            );
        }
        break;
      }
      default:
        throw new E('Invalid or unsupported JWK "alg" (Algorithm) Parameter value');
    }
    return e.subtle.generateKey(a, r?.extractable ?? !1, n);
  })(t, r);
}
async function Gt(t, r) {
  return (async function (t, r) {
    let a, n, i;
    switch (t) {
      case 'HS256':
      case 'HS384':
      case 'HS512':
        ((a = parseInt(t.slice(-3), 10)),
          (n = { name: 'HMAC', hash: `SHA-${a}`, length: a }),
          (i = ['sign', 'verify']));
        break;
      case 'A128CBC-HS256':
      case 'A192CBC-HS384':
      case 'A256CBC-HS512':
        return ((a = parseInt(t.slice(-3), 10)), J(new Uint8Array(a >> 3)));
      case 'A128KW':
      case 'A192KW':
      case 'A256KW':
        ((a = parseInt(t.slice(1, 4), 10)), (n = { name: 'AES-KW', length: a }), (i = ['wrapKey', 'unwrapKey']));
        break;
      case 'A128GCMKW':
      case 'A192GCMKW':
      case 'A256GCMKW':
      case 'A128GCM':
      case 'A192GCM':
      case 'A256GCM':
        ((a = parseInt(t.slice(1, 4), 10)), (n = { name: 'AES-GCM', length: a }), (i = ['encrypt', 'decrypt']));
        break;
      default:
        throw new E('Invalid or unsupported JWK "alg" (Algorithm) Parameter value');
    }
    return e.subtle.generateKey(n, r?.extractable ?? !1, i);
  })(t, r);
}
var Lt = 'WebCryptoAPI';
export {
  lt as CompactEncrypt,
  wt as CompactSign,
  Ht as EmbeddedJWK,
  St as EncryptJWT,
  Ye as FlattenedEncrypt,
  yt as FlattenedSign,
  Qe as GeneralEncrypt,
  mt as GeneralSign,
  At as SignJWT,
  Ot as UnsecuredJWT,
  Mt as base64url,
  _t as calculateJwkThumbprint,
  vt as calculateJwkThumbprintUri,
  $e as compactDecrypt,
  at as compactVerify,
  Wt as createLocalJWKSet,
  It as createRemoteJWKSet,
  Lt as cryptoRuntime,
  jt as decodeJwt,
  Nt as decodeProtectedHeader,
  W as errors,
  Ut as experimental_jwksCache,
  ze as exportJWK,
  Ve as exportPKCS8,
  Fe as exportSPKI,
  je as flattenedDecrypt,
  rt as flattenedVerify,
  Be as generalDecrypt,
  nt as generalVerify,
  Bt as generateKeyPair,
  Gt as generateSecret,
  We as importJWK,
  Ce as importPKCS8,
  Pe as importSPKI,
  Ke as importX509,
  Tt as jwksCache,
  ut as jwtDecrypt,
  pt as jwtVerify,
};
export default null;
