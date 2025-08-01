/**
 * Bundled by jsDelivr using Rollup v2.79.1 and Terser v5.19.2.
 * Original file: /npm/jose@5.9.6/dist/browser/util/errors.js
 *
 * Do NOT use SRI with dynamically generated files! More information: https://www.jsdelivr.com/using-sri-with-dynamic-files
 */
class e extends Error {
  constructor(e, s) {
    (super(e, s),
      (this.code = 'ERR_JOSE_GENERIC'),
      (this.name = this.constructor.name),
      Error.captureStackTrace?.(this, this.constructor));
  }
}
e.code = 'ERR_JOSE_GENERIC';
class s extends e {
  constructor(e, s, c = 'unspecified', t = 'unspecified') {
    (super(e, { cause: { claim: c, reason: t, payload: s } }),
      (this.code = 'ERR_JWT_CLAIM_VALIDATION_FAILED'),
      (this.claim = c),
      (this.reason = t),
      (this.payload = s));
  }
}
s.code = 'ERR_JWT_CLAIM_VALIDATION_FAILED';
class c extends e {
  constructor(e, s, c = 'unspecified', t = 'unspecified') {
    (super(e, { cause: { claim: c, reason: t, payload: s } }),
      (this.code = 'ERR_JWT_EXPIRED'),
      (this.claim = c),
      (this.reason = t),
      (this.payload = s));
  }
}
c.code = 'ERR_JWT_EXPIRED';
class t extends e {
  constructor() {
    (super(...arguments), (this.code = 'ERR_JOSE_ALG_NOT_ALLOWED'));
  }
}
t.code = 'ERR_JOSE_ALG_NOT_ALLOWED';
class o extends e {
  constructor() {
    (super(...arguments), (this.code = 'ERR_JOSE_NOT_SUPPORTED'));
  }
}
o.code = 'ERR_JOSE_NOT_SUPPORTED';
class _ extends e {
  constructor(e = 'decryption operation failed', s) {
    (super(e, s), (this.code = 'ERR_JWE_DECRYPTION_FAILED'));
  }
}
_.code = 'ERR_JWE_DECRYPTION_FAILED';
class E extends e {
  constructor() {
    (super(...arguments), (this.code = 'ERR_JWE_INVALID'));
  }
}
E.code = 'ERR_JWE_INVALID';
class R extends e {
  constructor() {
    (super(...arguments), (this.code = 'ERR_JWS_INVALID'));
  }
}
R.code = 'ERR_JWS_INVALID';
class r extends e {
  constructor() {
    (super(...arguments), (this.code = 'ERR_JWT_INVALID'));
  }
}
r.code = 'ERR_JWT_INVALID';
class d extends e {
  constructor() {
    (super(...arguments), (this.code = 'ERR_JWK_INVALID'));
  }
}
d.code = 'ERR_JWK_INVALID';
class I extends e {
  constructor() {
    (super(...arguments), (this.code = 'ERR_JWKS_INVALID'));
  }
}
I.code = 'ERR_JWKS_INVALID';
class n extends e {
  constructor(e = 'no applicable key found in the JSON Web Key Set', s) {
    (super(e, s), (this.code = 'ERR_JWKS_NO_MATCHING_KEY'));
  }
}
n.code = 'ERR_JWKS_NO_MATCHING_KEY';
class i extends e {
  constructor(e = 'multiple matching keys found in the JSON Web Key Set', s) {
    (super(e, s), (this.code = 'ERR_JWKS_MULTIPLE_MATCHING_KEYS'));
  }
}
i.code = 'ERR_JWKS_MULTIPLE_MATCHING_KEYS';
class a extends e {
  constructor(e = 'request timed out', s) {
    (super(e, s), (this.code = 'ERR_JWKS_TIMEOUT'));
  }
}
a.code = 'ERR_JWKS_TIMEOUT';
class u extends e {
  constructor(e = 'signature verification failed', s) {
    (super(e, s), (this.code = 'ERR_JWS_SIGNATURE_VERIFICATION_FAILED'));
  }
}
u.code = 'ERR_JWS_SIGNATURE_VERIFICATION_FAILED';
export {
  t as JOSEAlgNotAllowed,
  e as JOSEError,
  o as JOSENotSupported,
  _ as JWEDecryptionFailed,
  E as JWEInvalid,
  d as JWKInvalid,
  I as JWKSInvalid,
  i as JWKSMultipleMatchingKeys,
  n as JWKSNoMatchingKey,
  a as JWKSTimeout,
  R as JWSInvalid,
  u as JWSSignatureVerificationFailed,
  s as JWTClaimValidationFailed,
  c as JWTExpired,
  r as JWTInvalid,
};
export default null;
