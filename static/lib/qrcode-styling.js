/**
 * Bundled by jsDelivr using Rollup v2.79.2 and Terser v5.39.0.
 * Original file: /npm/qr-code-styling@1.9.2/lib/qr-code-styling.js
 *
 * Do NOT use SRI with dynamically generated files! More information: https://www.jsdelivr.com/using-sri-with-dynamic-files
 */
var t =
    'undefined' != typeof global
      ? global
      : 'undefined' != typeof self
        ? self
        : 'undefined' != typeof window
          ? window
          : {},
  e = [],
  r = [],
  n = 'undefined' != typeof Uint8Array ? Uint8Array : Array,
  i = !1;

function o() {
  i = !0;
  for (var t = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/', n = 0; n < 64; ++n)
    ((e[n] = t[n]), (r[t.charCodeAt(n)] = n));
  ((r['-'.charCodeAt(0)] = 62), (r['_'.charCodeAt(0)] = 63));
}

function s(t, r, n) {
  for (var i, o, s = [], a = r; a < n; a += 3)
    ((i = (t[a] << 16) + (t[a + 1] << 8) + t[a + 2]),
      s.push(e[((o = i) >> 18) & 63] + e[(o >> 12) & 63] + e[(o >> 6) & 63] + e[63 & o]));
  return s.join('');
}

function a(t) {
  var r;
  i || o();
  for (var n = t.length, a = n % 3, h = '', u = [], d = 16383, f = 0, c = n - a; f < c; f += d)
    u.push(s(t, f, f + d > c ? c : f + d));
  return (
    1 === a
      ? ((r = t[n - 1]), (h += e[r >> 2]), (h += e[(r << 4) & 63]), (h += '=='))
      : 2 === a &&
        ((r = (t[n - 2] << 8) + t[n - 1]),
        (h += e[r >> 10]),
        (h += e[(r >> 4) & 63]),
        (h += e[(r << 2) & 63]),
        (h += '=')),
    u.push(h),
    u.join('')
  );
}

function h(t, e, r, n, i) {
  var o,
    s,
    a = 8 * i - n - 1,
    h = (1 << a) - 1,
    u = h >> 1,
    d = -7,
    f = r ? i - 1 : 0,
    c = r ? -1 : 1,
    l = t[e + f];
  for (f += c, o = l & ((1 << -d) - 1), l >>= -d, d += a; d > 0; o = 256 * o + t[e + f], f += c, d -= 8);
  for (s = o & ((1 << -d) - 1), o >>= -d, d += n; d > 0; s = 256 * s + t[e + f], f += c, d -= 8);
  if (0 === o) o = 1 - u;
  else {
    if (o === h) return s ? NaN : (1 / 0) * (l ? -1 : 1);
    ((s += Math.pow(2, n)), (o -= u));
  }
  return (l ? -1 : 1) * s * Math.pow(2, o - n);
}

function u(t, e, r, n, i, o) {
  var s,
    a,
    h,
    u = 8 * o - i - 1,
    d = (1 << u) - 1,
    f = d >> 1,
    c = 23 === i ? Math.pow(2, -24) - Math.pow(2, -77) : 0,
    l = n ? 0 : o - 1,
    g = n ? 1 : -1,
    p = e < 0 || (0 === e && 1 / e < 0) ? 1 : 0;
  for (
    e = Math.abs(e),
      isNaN(e) || e === 1 / 0
        ? ((a = isNaN(e) ? 1 : 0), (s = d))
        : ((s = Math.floor(Math.log(e) / Math.LN2)),
          e * (h = Math.pow(2, -s)) < 1 && (s--, (h *= 2)),
          (e += s + f >= 1 ? c / h : c * Math.pow(2, 1 - f)) * h >= 2 && (s++, (h /= 2)),
          s + f >= d
            ? ((a = 0), (s = d))
            : s + f >= 1
              ? ((a = (e * h - 1) * Math.pow(2, i)), (s += f))
              : ((a = e * Math.pow(2, f - 1) * Math.pow(2, i)), (s = 0)));
    i >= 8;
    t[r + l] = 255 & a, l += g, a /= 256, i -= 8
  );
  for (s = (s << i) | a, u += i; u > 0; t[r + l] = 255 & s, l += g, s /= 256, u -= 8);
  t[r + l - g] |= 128 * p;
}

var d = {}.toString,
  f =
    Array.isArray ||
    function (t) {
      return '[object Array]' == d.call(t);
    };

function c() {
  return g.TYPED_ARRAY_SUPPORT ? 2147483647 : 1073741823;
}

function l(t, e) {
  if (c() < e) throw new RangeError('Invalid typed array length');
  return (
    g.TYPED_ARRAY_SUPPORT
      ? ((t = new Uint8Array(e)).__proto__ = g.prototype)
      : (null === t && (t = new g(e)), (t.length = e)),
    t
  );
}

function g(t, e, r) {
  if (!(g.TYPED_ARRAY_SUPPORT || this instanceof g)) return new g(t, e, r);
  if ('number' == typeof t) {
    if ('string' == typeof e) throw new Error('If encoding is specified then the first argument must be a string');
    return v(this, t);
  }
  return p(this, t, e, r);
}

function p(t, e, r, n) {
  if ('number' == typeof e) throw new TypeError('"value" argument must not be a number');
  return 'undefined' != typeof ArrayBuffer && e instanceof ArrayBuffer
    ? (function (t, e, r, n) {
        if ((e.byteLength, r < 0 || e.byteLength < r)) throw new RangeError("'offset' is out of bounds");
        if (e.byteLength < r + (n || 0)) throw new RangeError("'length' is out of bounds");
        e =
          void 0 === r && void 0 === n
            ? new Uint8Array(e)
            : void 0 === n
              ? new Uint8Array(e, r)
              : new Uint8Array(e, r, n);
        g.TYPED_ARRAY_SUPPORT ? ((t = e).__proto__ = g.prototype) : (t = _(t, e));
        return t;
      })(t, e, r, n)
    : 'string' == typeof e
      ? (function (t, e, r) {
          ('string' == typeof r && '' !== r) || (r = 'utf8');
          if (!g.isEncoding(r)) throw new TypeError('"encoding" must be a valid string encoding');
          var n = 0 | b(e, r);
          t = l(t, n);
          var i = t.write(e, r);
          i !== n && (t = t.slice(0, i));
          return t;
        })(t, e, r)
      : (function (t, e) {
          if (m(e)) {
            var r = 0 | y(e.length);
            return (0 === (t = l(t, r)).length || e.copy(t, 0, 0, r), t);
          }
          if (e) {
            if (('undefined' != typeof ArrayBuffer && e.buffer instanceof ArrayBuffer) || 'length' in e)
              return 'number' != typeof e.length || (n = e.length) != n ? l(t, 0) : _(t, e);
            if ('Buffer' === e.type && f(e.data)) return _(t, e.data);
          }
          var n;
          throw new TypeError('First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.');
        })(t, e);
}

function w(t) {
  if ('number' != typeof t) throw new TypeError('"size" argument must be a number');
  if (t < 0) throw new RangeError('"size" argument must not be negative');
}

function v(t, e) {
  if ((w(e), (t = l(t, e < 0 ? 0 : 0 | y(e))), !g.TYPED_ARRAY_SUPPORT)) for (var r = 0; r < e; ++r) t[r] = 0;
  return t;
}

function _(t, e) {
  var r = e.length < 0 ? 0 : 0 | y(e.length);
  t = l(t, r);
  for (var n = 0; n < r; n += 1) t[n] = 255 & e[n];
  return t;
}

function y(t) {
  if (t >= c())
    throw new RangeError('Attempt to allocate Buffer larger than maximum size: 0x' + c().toString(16) + ' bytes');
  return 0 | t;
}

function m(t) {
  return !(null == t || !t._isBuffer);
}

function b(t, e) {
  if (m(t)) return t.length;
  if (
    'undefined' != typeof ArrayBuffer &&
    'function' == typeof ArrayBuffer.isView &&
    (ArrayBuffer.isView(t) || t instanceof ArrayBuffer)
  )
    return t.byteLength;
  'string' != typeof t && (t = '' + t);
  var r = t.length;
  if (0 === r) return 0;
  for (var n = !1; ; )
    switch (e) {
      case 'ascii':
      case 'latin1':
      case 'binary':
        return r;
      case 'utf8':
      case 'utf-8':
      case void 0:
        return G(t).length;
      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return 2 * r;
      case 'hex':
        return r >>> 1;
      case 'base64':
        return Z(t).length;
      default:
        if (n) return G(t).length;
        ((e = ('' + e).toLowerCase()), (n = !0));
    }
}

function A(t, e, r) {
  var n = !1;
  if (((void 0 === e || e < 0) && (e = 0), e > this.length)) return '';
  if (((void 0 === r || r > this.length) && (r = this.length), r <= 0)) return '';
  if ((r >>>= 0) <= (e >>>= 0)) return '';
  for (t || (t = 'utf8'); ; )
    switch (t) {
      case 'hex':
        return T(this, e, r);
      case 'utf8':
      case 'utf-8':
        return D(this, e, r);
      case 'ascii':
        return k(this, e, r);
      case 'latin1':
      case 'binary':
        return z(this, e, r);
      case 'base64':
        return $(this, e, r);
      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return L(this, e, r);
      default:
        if (n) throw new TypeError('Unknown encoding: ' + t);
        ((t = (t + '').toLowerCase()), (n = !0));
    }
}

function S(t, e, r) {
  var n = t[e];
  ((t[e] = t[r]), (t[r] = n));
}

function x(t, e, r, n, i) {
  if (0 === t.length) return -1;
  if (
    ('string' == typeof r
      ? ((n = r), (r = 0))
      : r > 2147483647
        ? (r = 2147483647)
        : r < -2147483648 && (r = -2147483648),
    (r = +r),
    isNaN(r) && (r = i ? 0 : t.length - 1),
    r < 0 && (r = t.length + r),
    r >= t.length)
  ) {
    if (i) return -1;
    r = t.length - 1;
  } else if (r < 0) {
    if (!i) return -1;
    r = 0;
  }
  if (('string' == typeof e && (e = g.from(e, n)), m(e))) return 0 === e.length ? -1 : C(t, e, r, n, i);
  if ('number' == typeof e)
    return (
      (e &= 255),
      g.TYPED_ARRAY_SUPPORT && 'function' == typeof Uint8Array.prototype.indexOf
        ? i
          ? Uint8Array.prototype.indexOf.call(t, e, r)
          : Uint8Array.prototype.lastIndexOf.call(t, e, r)
        : C(t, [e], r, n, i)
    );
  throw new TypeError('val must be string, number or Buffer');
}

function C(t, e, r, n, i) {
  var o,
    s = 1,
    a = t.length,
    h = e.length;
  if (
    void 0 !== n &&
    ('ucs2' === (n = String(n).toLowerCase()) || 'ucs-2' === n || 'utf16le' === n || 'utf-16le' === n)
  ) {
    if (t.length < 2 || e.length < 2) return -1;
    ((s = 2), (a /= 2), (h /= 2), (r /= 2));
  }

  function u(t, e) {
    return 1 === s ? t[e] : t.readUInt16BE(e * s);
  }

  if (i) {
    var d = -1;
    for (o = r; o < a; o++)
      if (u(t, o) === u(e, -1 === d ? 0 : o - d)) {
        if ((-1 === d && (d = o), o - d + 1 === h)) return d * s;
      } else (-1 !== d && (o -= o - d), (d = -1));
  } else
    for (r + h > a && (r = a - h), o = r; o >= 0; o--) {
      for (var f = !0, c = 0; c < h; c++)
        if (u(t, o + c) !== u(e, c)) {
          f = !1;
          break;
        }
      if (f) return o;
    }
  return -1;
}

function E(t, e, r, n) {
  r = Number(r) || 0;
  var i = t.length - r;
  n ? (n = Number(n)) > i && (n = i) : (n = i);
  var o = e.length;
  if (o % 2 != 0) throw new TypeError('Invalid hex string');
  n > o / 2 && (n = o / 2);
  for (var s = 0; s < n; ++s) {
    var a = parseInt(e.substr(2 * s, 2), 16);
    if (isNaN(a)) return s;
    t[r + s] = a;
  }
  return s;
}

function M(t, e, r, n) {
  return J(G(e, t.length - r), t, r, n);
}

function O(t, e, r, n) {
  return J(
    (function (t) {
      for (var e = [], r = 0; r < t.length; ++r) e.push(255 & t.charCodeAt(r));
      return e;
    })(e),
    t,
    r,
    n,
  );
}

function P(t, e, r, n) {
  return O(t, e, r, n);
}

function R(t, e, r, n) {
  return J(Z(e), t, r, n);
}

function B(t, e, r, n) {
  return J(
    (function (t, e) {
      for (var r, n, i, o = [], s = 0; s < t.length && !((e -= 2) < 0); ++s)
        ((n = (r = t.charCodeAt(s)) >> 8), (i = r % 256), o.push(i), o.push(n));
      return o;
    })(e, t.length - r),
    t,
    r,
    n,
  );
}

function $(t, e, r) {
  return 0 === e && r === t.length ? a(t) : a(t.slice(e, r));
}

function D(t, e, r) {
  r = Math.min(t.length, r);
  for (var n = [], i = e; i < r; ) {
    var o,
      s,
      a,
      h,
      u = t[i],
      d = null,
      f = u > 239 ? 4 : u > 223 ? 3 : u > 191 ? 2 : 1;
    if (i + f <= r)
      switch (f) {
        case 1:
          u < 128 && (d = u);
          break;
        case 2:
          128 == (192 & (o = t[i + 1])) && (h = ((31 & u) << 6) | (63 & o)) > 127 && (d = h);
          break;
        case 3:
          ((o = t[i + 1]),
            (s = t[i + 2]),
            128 == (192 & o) &&
              128 == (192 & s) &&
              (h = ((15 & u) << 12) | ((63 & o) << 6) | (63 & s)) > 2047 &&
              (h < 55296 || h > 57343) &&
              (d = h));
          break;
        case 4:
          ((o = t[i + 1]),
            (s = t[i + 2]),
            (a = t[i + 3]),
            128 == (192 & o) &&
              128 == (192 & s) &&
              128 == (192 & a) &&
              (h = ((15 & u) << 18) | ((63 & o) << 12) | ((63 & s) << 6) | (63 & a)) > 65535 &&
              h < 1114112 &&
              (d = h));
      }
    (null === d
      ? ((d = 65533), (f = 1))
      : d > 65535 && ((d -= 65536), n.push(((d >>> 10) & 1023) | 55296), (d = 56320 | (1023 & d))),
      n.push(d),
      (i += f));
  }
  return (function (t) {
    var e = t.length;
    if (e <= I) return String.fromCharCode.apply(String, t);
    var r = '',
      n = 0;
    for (; n < e; ) r += String.fromCharCode.apply(String, t.slice(n, (n += I)));
    return r;
  })(n);
}

((g.TYPED_ARRAY_SUPPORT = void 0 === t.TYPED_ARRAY_SUPPORT || t.TYPED_ARRAY_SUPPORT),
  c(),
  (g.poolSize = 8192),
  (g._augment = function (t) {
    return ((t.__proto__ = g.prototype), t);
  }),
  (g.from = function (t, e, r) {
    return p(null, t, e, r);
  }),
  g.TYPED_ARRAY_SUPPORT &&
    ((g.prototype.__proto__ = Uint8Array.prototype),
    (g.__proto__ = Uint8Array),
    'undefined' != typeof Symbol && Symbol.species && g[Symbol.species]),
  (g.alloc = function (t, e, r) {
    return (function (t, e, r, n) {
      return (
        w(e),
        e <= 0 ? l(t, e) : void 0 !== r ? ('string' == typeof n ? l(t, e).fill(r, n) : l(t, e).fill(r)) : l(t, e)
      );
    })(null, t, e, r);
  }),
  (g.allocUnsafe = function (t) {
    return v(null, t);
  }),
  (g.allocUnsafeSlow = function (t) {
    return v(null, t);
  }),
  (g.isBuffer = function (t) {
    return (
      null != t &&
      (!!t._isBuffer ||
        V(t) ||
        (function (t) {
          return 'function' == typeof t.readFloatLE && 'function' == typeof t.slice && V(t.slice(0, 0));
        })(t))
    );
  }),
  (g.compare = function (t, e) {
    if (!m(t) || !m(e)) throw new TypeError('Arguments must be Buffers');
    if (t === e) return 0;
    for (var r = t.length, n = e.length, i = 0, o = Math.min(r, n); i < o; ++i)
      if (t[i] !== e[i]) {
        ((r = t[i]), (n = e[i]));
        break;
      }
    return r < n ? -1 : n < r ? 1 : 0;
  }),
  (g.isEncoding = function (t) {
    switch (String(t).toLowerCase()) {
      case 'hex':
      case 'utf8':
      case 'utf-8':
      case 'ascii':
      case 'latin1':
      case 'binary':
      case 'base64':
      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return !0;
      default:
        return !1;
    }
  }),
  (g.concat = function (t, e) {
    if (!f(t)) throw new TypeError('"list" argument must be an Array of Buffers');
    if (0 === t.length) return g.alloc(0);
    var r;
    if (void 0 === e) for (e = 0, r = 0; r < t.length; ++r) e += t[r].length;
    var n = g.allocUnsafe(e),
      i = 0;
    for (r = 0; r < t.length; ++r) {
      var o = t[r];
      if (!m(o)) throw new TypeError('"list" argument must be an Array of Buffers');
      (o.copy(n, i), (i += o.length));
    }
    return n;
  }),
  (g.byteLength = b),
  (g.prototype._isBuffer = !0),
  (g.prototype.swap16 = function () {
    var t = this.length;
    if (t % 2 != 0) throw new RangeError('Buffer size must be a multiple of 16-bits');
    for (var e = 0; e < t; e += 2) S(this, e, e + 1);
    return this;
  }),
  (g.prototype.swap32 = function () {
    var t = this.length;
    if (t % 4 != 0) throw new RangeError('Buffer size must be a multiple of 32-bits');
    for (var e = 0; e < t; e += 4) (S(this, e, e + 3), S(this, e + 1, e + 2));
    return this;
  }),
  (g.prototype.swap64 = function () {
    var t = this.length;
    if (t % 8 != 0) throw new RangeError('Buffer size must be a multiple of 64-bits');
    for (var e = 0; e < t; e += 8)
      (S(this, e, e + 7), S(this, e + 1, e + 6), S(this, e + 2, e + 5), S(this, e + 3, e + 4));
    return this;
  }),
  (g.prototype.toString = function () {
    var t = 0 | this.length;
    return 0 === t ? '' : 0 === arguments.length ? D(this, 0, t) : A.apply(this, arguments);
  }),
  (g.prototype.equals = function (t) {
    if (!m(t)) throw new TypeError('Argument must be a Buffer');
    return this === t || 0 === g.compare(this, t);
  }),
  (g.prototype.inspect = function () {
    var t = '';
    return (
      this.length > 0 &&
        ((t = this.toString('hex', 0, 50).match(/.{2}/g).join(' ')), this.length > 50 && (t += ' ... ')),
      '<Buffer ' + t + '>'
    );
  }),
  (g.prototype.compare = function (t, e, r, n, i) {
    if (!m(t)) throw new TypeError('Argument must be a Buffer');
    if (
      (void 0 === e && (e = 0),
      void 0 === r && (r = t ? t.length : 0),
      void 0 === n && (n = 0),
      void 0 === i && (i = this.length),
      e < 0 || r > t.length || n < 0 || i > this.length)
    )
      throw new RangeError('out of range index');
    if (n >= i && e >= r) return 0;
    if (n >= i) return -1;
    if (e >= r) return 1;
    if (this === t) return 0;
    for (
      var o = (i >>>= 0) - (n >>>= 0),
        s = (r >>>= 0) - (e >>>= 0),
        a = Math.min(o, s),
        h = this.slice(n, i),
        u = t.slice(e, r),
        d = 0;
      d < a;
      ++d
    )
      if (h[d] !== u[d]) {
        ((o = h[d]), (s = u[d]));
        break;
      }
    return o < s ? -1 : s < o ? 1 : 0;
  }),
  (g.prototype.includes = function (t, e, r) {
    return -1 !== this.indexOf(t, e, r);
  }),
  (g.prototype.indexOf = function (t, e, r) {
    return x(this, t, e, r, !0);
  }),
  (g.prototype.lastIndexOf = function (t, e, r) {
    return x(this, t, e, r, !1);
  }),
  (g.prototype.write = function (t, e, r, n) {
    if (void 0 === e) ((n = 'utf8'), (r = this.length), (e = 0));
    else if (void 0 === r && 'string' == typeof e) ((n = e), (r = this.length), (e = 0));
    else {
      if (!isFinite(e)) throw new Error('Buffer.write(string, encoding, offset[, length]) is no longer supported');
      ((e |= 0), isFinite(r) ? ((r |= 0), void 0 === n && (n = 'utf8')) : ((n = r), (r = void 0)));
    }
    var i = this.length - e;
    if (((void 0 === r || r > i) && (r = i), (t.length > 0 && (r < 0 || e < 0)) || e > this.length))
      throw new RangeError('Attempt to write outside buffer bounds');
    n || (n = 'utf8');
    for (var o = !1; ; )
      switch (n) {
        case 'hex':
          return E(this, t, e, r);
        case 'utf8':
        case 'utf-8':
          return M(this, t, e, r);
        case 'ascii':
          return O(this, t, e, r);
        case 'latin1':
        case 'binary':
          return P(this, t, e, r);
        case 'base64':
          return R(this, t, e, r);
        case 'ucs2':
        case 'ucs-2':
        case 'utf16le':
        case 'utf-16le':
          return B(this, t, e, r);
        default:
          if (o) throw new TypeError('Unknown encoding: ' + n);
          ((n = ('' + n).toLowerCase()), (o = !0));
      }
  }),
  (g.prototype.toJSON = function () {
    return { type: 'Buffer', data: Array.prototype.slice.call(this._arr || this, 0) };
  }));
var I = 4096;

function k(t, e, r) {
  var n = '';
  r = Math.min(t.length, r);
  for (var i = e; i < r; ++i) n += String.fromCharCode(127 & t[i]);
  return n;
}

function z(t, e, r) {
  var n = '';
  r = Math.min(t.length, r);
  for (var i = e; i < r; ++i) n += String.fromCharCode(t[i]);
  return n;
}

function T(t, e, r) {
  var n = t.length;
  ((!e || e < 0) && (e = 0), (!r || r < 0 || r > n) && (r = n));
  for (var i = '', o = e; o < r; ++o) i += X(t[o]);
  return i;
}

function L(t, e, r) {
  for (var n = t.slice(e, r), i = '', o = 0; o < n.length; o += 2) i += String.fromCharCode(n[o] + 256 * n[o + 1]);
  return i;
}

function q(t, e, r) {
  if (t % 1 != 0 || t < 0) throw new RangeError('offset is not uint');
  if (t + e > r) throw new RangeError('Trying to access beyond buffer length');
}

function U(t, e, r, n, i, o) {
  if (!m(t)) throw new TypeError('"buffer" argument must be a Buffer instance');
  if (e > i || e < o) throw new RangeError('"value" argument is out of bounds');
  if (r + n > t.length) throw new RangeError('Index out of range');
}

function j(t, e, r, n) {
  e < 0 && (e = 65535 + e + 1);
  for (var i = 0, o = Math.min(t.length - r, 2); i < o; ++i)
    t[r + i] = (e & (255 << (8 * (n ? i : 1 - i)))) >>> (8 * (n ? i : 1 - i));
}

function N(t, e, r, n) {
  e < 0 && (e = 4294967295 + e + 1);
  for (var i = 0, o = Math.min(t.length - r, 4); i < o; ++i) t[r + i] = (e >>> (8 * (n ? i : 3 - i))) & 255;
}

function Y(t, e, r, n, i, o) {
  if (r + n > t.length) throw new RangeError('Index out of range');
  if (r < 0) throw new RangeError('Index out of range');
}

function F(t, e, r, n, i) {
  return (i || Y(t, 0, r, 4), u(t, e, r, n, 23, 4), r + 4);
}

function H(t, e, r, n, i) {
  return (i || Y(t, 0, r, 8), u(t, e, r, n, 52, 8), r + 8);
}

((g.prototype.slice = function (t, e) {
  var r,
    n = this.length;
  if (
    ((t = ~~t) < 0 ? (t += n) < 0 && (t = 0) : t > n && (t = n),
    (e = void 0 === e ? n : ~~e) < 0 ? (e += n) < 0 && (e = 0) : e > n && (e = n),
    e < t && (e = t),
    g.TYPED_ARRAY_SUPPORT)
  )
    (r = this.subarray(t, e)).__proto__ = g.prototype;
  else {
    var i = e - t;
    r = new g(i, void 0);
    for (var o = 0; o < i; ++o) r[o] = this[o + t];
  }
  return r;
}),
  (g.prototype.readUIntLE = function (t, e, r) {
    ((t |= 0), (e |= 0), r || q(t, e, this.length));
    for (var n = this[t], i = 1, o = 0; ++o < e && (i *= 256); ) n += this[t + o] * i;
    return n;
  }),
  (g.prototype.readUIntBE = function (t, e, r) {
    ((t |= 0), (e |= 0), r || q(t, e, this.length));
    for (var n = this[t + --e], i = 1; e > 0 && (i *= 256); ) n += this[t + --e] * i;
    return n;
  }),
  (g.prototype.readUInt8 = function (t, e) {
    return (e || q(t, 1, this.length), this[t]);
  }),
  (g.prototype.readUInt16LE = function (t, e) {
    return (e || q(t, 2, this.length), this[t] | (this[t + 1] << 8));
  }),
  (g.prototype.readUInt16BE = function (t, e) {
    return (e || q(t, 2, this.length), (this[t] << 8) | this[t + 1]);
  }),
  (g.prototype.readUInt32LE = function (t, e) {
    return (e || q(t, 4, this.length), (this[t] | (this[t + 1] << 8) | (this[t + 2] << 16)) + 16777216 * this[t + 3]);
  }),
  (g.prototype.readUInt32BE = function (t, e) {
    return (e || q(t, 4, this.length), 16777216 * this[t] + ((this[t + 1] << 16) | (this[t + 2] << 8) | this[t + 3]));
  }),
  (g.prototype.readIntLE = function (t, e, r) {
    ((t |= 0), (e |= 0), r || q(t, e, this.length));
    for (var n = this[t], i = 1, o = 0; ++o < e && (i *= 256); ) n += this[t + o] * i;
    return (n >= (i *= 128) && (n -= Math.pow(2, 8 * e)), n);
  }),
  (g.prototype.readIntBE = function (t, e, r) {
    ((t |= 0), (e |= 0), r || q(t, e, this.length));
    for (var n = e, i = 1, o = this[t + --n]; n > 0 && (i *= 256); ) o += this[t + --n] * i;
    return (o >= (i *= 128) && (o -= Math.pow(2, 8 * e)), o);
  }),
  (g.prototype.readInt8 = function (t, e) {
    return (e || q(t, 1, this.length), 128 & this[t] ? -1 * (255 - this[t] + 1) : this[t]);
  }),
  (g.prototype.readInt16LE = function (t, e) {
    e || q(t, 2, this.length);
    var r = this[t] | (this[t + 1] << 8);
    return 32768 & r ? 4294901760 | r : r;
  }),
  (g.prototype.readInt16BE = function (t, e) {
    e || q(t, 2, this.length);
    var r = this[t + 1] | (this[t] << 8);
    return 32768 & r ? 4294901760 | r : r;
  }),
  (g.prototype.readInt32LE = function (t, e) {
    return (e || q(t, 4, this.length), this[t] | (this[t + 1] << 8) | (this[t + 2] << 16) | (this[t + 3] << 24));
  }),
  (g.prototype.readInt32BE = function (t, e) {
    return (e || q(t, 4, this.length), (this[t] << 24) | (this[t + 1] << 16) | (this[t + 2] << 8) | this[t + 3]);
  }),
  (g.prototype.readFloatLE = function (t, e) {
    return (e || q(t, 4, this.length), h(this, t, !0, 23, 4));
  }),
  (g.prototype.readFloatBE = function (t, e) {
    return (e || q(t, 4, this.length), h(this, t, !1, 23, 4));
  }),
  (g.prototype.readDoubleLE = function (t, e) {
    return (e || q(t, 8, this.length), h(this, t, !0, 52, 8));
  }),
  (g.prototype.readDoubleBE = function (t, e) {
    return (e || q(t, 8, this.length), h(this, t, !1, 52, 8));
  }),
  (g.prototype.writeUIntLE = function (t, e, r, n) {
    ((t = +t), (e |= 0), (r |= 0), n) || U(this, t, e, r, Math.pow(2, 8 * r) - 1, 0);
    var i = 1,
      o = 0;
    for (this[e] = 255 & t; ++o < r && (i *= 256); ) this[e + o] = (t / i) & 255;
    return e + r;
  }),
  (g.prototype.writeUIntBE = function (t, e, r, n) {
    ((t = +t), (e |= 0), (r |= 0), n) || U(this, t, e, r, Math.pow(2, 8 * r) - 1, 0);
    var i = r - 1,
      o = 1;
    for (this[e + i] = 255 & t; --i >= 0 && (o *= 256); ) this[e + i] = (t / o) & 255;
    return e + r;
  }),
  (g.prototype.writeUInt8 = function (t, e, r) {
    return (
      (t = +t),
      (e |= 0),
      r || U(this, t, e, 1, 255, 0),
      g.TYPED_ARRAY_SUPPORT || (t = Math.floor(t)),
      (this[e] = 255 & t),
      e + 1
    );
  }),
  (g.prototype.writeUInt16LE = function (t, e, r) {
    return (
      (t = +t),
      (e |= 0),
      r || U(this, t, e, 2, 65535, 0),
      g.TYPED_ARRAY_SUPPORT ? ((this[e] = 255 & t), (this[e + 1] = t >>> 8)) : j(this, t, e, !0),
      e + 2
    );
  }),
  (g.prototype.writeUInt16BE = function (t, e, r) {
    return (
      (t = +t),
      (e |= 0),
      r || U(this, t, e, 2, 65535, 0),
      g.TYPED_ARRAY_SUPPORT ? ((this[e] = t >>> 8), (this[e + 1] = 255 & t)) : j(this, t, e, !1),
      e + 2
    );
  }),
  (g.prototype.writeUInt32LE = function (t, e, r) {
    return (
      (t = +t),
      (e |= 0),
      r || U(this, t, e, 4, 4294967295, 0),
      g.TYPED_ARRAY_SUPPORT
        ? ((this[e + 3] = t >>> 24), (this[e + 2] = t >>> 16), (this[e + 1] = t >>> 8), (this[e] = 255 & t))
        : N(this, t, e, !0),
      e + 4
    );
  }),
  (g.prototype.writeUInt32BE = function (t, e, r) {
    return (
      (t = +t),
      (e |= 0),
      r || U(this, t, e, 4, 4294967295, 0),
      g.TYPED_ARRAY_SUPPORT
        ? ((this[e] = t >>> 24), (this[e + 1] = t >>> 16), (this[e + 2] = t >>> 8), (this[e + 3] = 255 & t))
        : N(this, t, e, !1),
      e + 4
    );
  }),
  (g.prototype.writeIntLE = function (t, e, r, n) {
    if (((t = +t), (e |= 0), !n)) {
      var i = Math.pow(2, 8 * r - 1);
      U(this, t, e, r, i - 1, -i);
    }
    var o = 0,
      s = 1,
      a = 0;
    for (this[e] = 255 & t; ++o < r && (s *= 256); )
      (t < 0 && 0 === a && 0 !== this[e + o - 1] && (a = 1), (this[e + o] = (((t / s) | 0) - a) & 255));
    return e + r;
  }),
  (g.prototype.writeIntBE = function (t, e, r, n) {
    if (((t = +t), (e |= 0), !n)) {
      var i = Math.pow(2, 8 * r - 1);
      U(this, t, e, r, i - 1, -i);
    }
    var o = r - 1,
      s = 1,
      a = 0;
    for (this[e + o] = 255 & t; --o >= 0 && (s *= 256); )
      (t < 0 && 0 === a && 0 !== this[e + o + 1] && (a = 1), (this[e + o] = (((t / s) | 0) - a) & 255));
    return e + r;
  }),
  (g.prototype.writeInt8 = function (t, e, r) {
    return (
      (t = +t),
      (e |= 0),
      r || U(this, t, e, 1, 127, -128),
      g.TYPED_ARRAY_SUPPORT || (t = Math.floor(t)),
      t < 0 && (t = 255 + t + 1),
      (this[e] = 255 & t),
      e + 1
    );
  }),
  (g.prototype.writeInt16LE = function (t, e, r) {
    return (
      (t = +t),
      (e |= 0),
      r || U(this, t, e, 2, 32767, -32768),
      g.TYPED_ARRAY_SUPPORT ? ((this[e] = 255 & t), (this[e + 1] = t >>> 8)) : j(this, t, e, !0),
      e + 2
    );
  }),
  (g.prototype.writeInt16BE = function (t, e, r) {
    return (
      (t = +t),
      (e |= 0),
      r || U(this, t, e, 2, 32767, -32768),
      g.TYPED_ARRAY_SUPPORT ? ((this[e] = t >>> 8), (this[e + 1] = 255 & t)) : j(this, t, e, !1),
      e + 2
    );
  }),
  (g.prototype.writeInt32LE = function (t, e, r) {
    return (
      (t = +t),
      (e |= 0),
      r || U(this, t, e, 4, 2147483647, -2147483648),
      g.TYPED_ARRAY_SUPPORT
        ? ((this[e] = 255 & t), (this[e + 1] = t >>> 8), (this[e + 2] = t >>> 16), (this[e + 3] = t >>> 24))
        : N(this, t, e, !0),
      e + 4
    );
  }),
  (g.prototype.writeInt32BE = function (t, e, r) {
    return (
      (t = +t),
      (e |= 0),
      r || U(this, t, e, 4, 2147483647, -2147483648),
      t < 0 && (t = 4294967295 + t + 1),
      g.TYPED_ARRAY_SUPPORT
        ? ((this[e] = t >>> 24), (this[e + 1] = t >>> 16), (this[e + 2] = t >>> 8), (this[e + 3] = 255 & t))
        : N(this, t, e, !1),
      e + 4
    );
  }),
  (g.prototype.writeFloatLE = function (t, e, r) {
    return F(this, t, e, !0, r);
  }),
  (g.prototype.writeFloatBE = function (t, e, r) {
    return F(this, t, e, !1, r);
  }),
  (g.prototype.writeDoubleLE = function (t, e, r) {
    return H(this, t, e, !0, r);
  }),
  (g.prototype.writeDoubleBE = function (t, e, r) {
    return H(this, t, e, !1, r);
  }),
  (g.prototype.copy = function (t, e, r, n) {
    if (
      (r || (r = 0),
      n || 0 === n || (n = this.length),
      e >= t.length && (e = t.length),
      e || (e = 0),
      n > 0 && n < r && (n = r),
      n === r)
    )
      return 0;
    if (0 === t.length || 0 === this.length) return 0;
    if (e < 0) throw new RangeError('targetStart out of bounds');
    if (r < 0 || r >= this.length) throw new RangeError('sourceStart out of bounds');
    if (n < 0) throw new RangeError('sourceEnd out of bounds');
    (n > this.length && (n = this.length), t.length - e < n - r && (n = t.length - e + r));
    var i,
      o = n - r;
    if (this === t && r < e && e < n) for (i = o - 1; i >= 0; --i) t[i + e] = this[i + r];
    else if (o < 1e3 || !g.TYPED_ARRAY_SUPPORT) for (i = 0; i < o; ++i) t[i + e] = this[i + r];
    else Uint8Array.prototype.set.call(t, this.subarray(r, r + o), e);
    return o;
  }),
  (g.prototype.fill = function (t, e, r, n) {
    if ('string' == typeof t) {
      if (
        ('string' == typeof e
          ? ((n = e), (e = 0), (r = this.length))
          : 'string' == typeof r && ((n = r), (r = this.length)),
        1 === t.length)
      ) {
        var i = t.charCodeAt(0);
        i < 256 && (t = i);
      }
      if (void 0 !== n && 'string' != typeof n) throw new TypeError('encoding must be a string');
      if ('string' == typeof n && !g.isEncoding(n)) throw new TypeError('Unknown encoding: ' + n);
    } else 'number' == typeof t && (t &= 255);
    if (e < 0 || this.length < e || this.length < r) throw new RangeError('Out of range index');
    if (r <= e) return this;
    var o;
    if (((e >>>= 0), (r = void 0 === r ? this.length : r >>> 0), t || (t = 0), 'number' == typeof t))
      for (o = e; o < r; ++o) this[o] = t;
    else {
      var s = m(t) ? t : G(new g(t, n).toString()),
        a = s.length;
      for (o = 0; o < r - e; ++o) this[o + e] = s[o % a];
    }
    return this;
  }));
var Q = /[^+\/0-9A-Za-z-_]/g;

function X(t) {
  return t < 16 ? '0' + t.toString(16) : t.toString(16);
}

function G(t, e) {
  var r;
  e = e || 1 / 0;
  for (var n = t.length, i = null, o = [], s = 0; s < n; ++s) {
    if ((r = t.charCodeAt(s)) > 55295 && r < 57344) {
      if (!i) {
        if (r > 56319) {
          (e -= 3) > -1 && o.push(239, 191, 189);
          continue;
        }
        if (s + 1 === n) {
          (e -= 3) > -1 && o.push(239, 191, 189);
          continue;
        }
        i = r;
        continue;
      }
      if (r < 56320) {
        ((e -= 3) > -1 && o.push(239, 191, 189), (i = r));
        continue;
      }
      r = 65536 + (((i - 55296) << 10) | (r - 56320));
    } else i && (e -= 3) > -1 && o.push(239, 191, 189);
    if (((i = null), r < 128)) {
      if ((e -= 1) < 0) break;
      o.push(r);
    } else if (r < 2048) {
      if ((e -= 2) < 0) break;
      o.push((r >> 6) | 192, (63 & r) | 128);
    } else if (r < 65536) {
      if ((e -= 3) < 0) break;
      o.push((r >> 12) | 224, ((r >> 6) & 63) | 128, (63 & r) | 128);
    } else {
      if (!(r < 1114112)) throw new Error('Invalid code point');
      if ((e -= 4) < 0) break;
      o.push((r >> 18) | 240, ((r >> 12) & 63) | 128, ((r >> 6) & 63) | 128, (63 & r) | 128);
    }
  }
  return o;
}

function Z(t) {
  return (function (t) {
    var e, s, a, h, u, d;
    i || o();
    var f = t.length;
    if (f % 4 > 0) throw new Error('Invalid string. Length must be a multiple of 4');
    ((u = '=' === t[f - 2] ? 2 : '=' === t[f - 1] ? 1 : 0), (d = new n((3 * f) / 4 - u)), (a = u > 0 ? f - 4 : f));
    var c = 0;
    for (e = 0, s = 0; e < a; e += 4, s += 3)
      ((h =
        (r[t.charCodeAt(e)] << 18) |
        (r[t.charCodeAt(e + 1)] << 12) |
        (r[t.charCodeAt(e + 2)] << 6) |
        r[t.charCodeAt(e + 3)]),
        (d[c++] = (h >> 16) & 255),
        (d[c++] = (h >> 8) & 255),
        (d[c++] = 255 & h));
    return (
      2 === u
        ? ((h = (r[t.charCodeAt(e)] << 2) | (r[t.charCodeAt(e + 1)] >> 4)), (d[c++] = 255 & h))
        : 1 === u &&
          ((h = (r[t.charCodeAt(e)] << 10) | (r[t.charCodeAt(e + 1)] << 4) | (r[t.charCodeAt(e + 2)] >> 2)),
          (d[c++] = (h >> 8) & 255),
          (d[c++] = 255 & h)),
      d
    );
  })(
    (function (t) {
      if (
        (t = (function (t) {
          return t.trim ? t.trim() : t.replace(/^\s+|\s+$/g, '');
        })(t).replace(Q, '')).length < 2
      )
        return '';
      for (; t.length % 4 != 0; ) t += '=';
      return t;
    })(t),
  );
}

function J(t, e, r, n) {
  for (var i = 0; i < n && !(i + r >= e.length || i >= t.length); ++i) e[i + r] = t[i];
  return i;
}

function V(t) {
  return !!t.constructor && 'function' == typeof t.constructor.isBuffer && t.constructor.isBuffer(t);
}

'undefined' != typeof globalThis
  ? globalThis
  : 'undefined' != typeof window
    ? window
    : 'undefined' != typeof global
      ? global
      : 'undefined' != typeof self && self;
var W = { exports: {} },
  K = (W.exports = (() =>
    (() => {
      var t = {
          873: (t, e) => {
            var r,
              n,
              i = (function () {
                var t = function (t, e) {
                  var r = t,
                    n = s[e],
                    i = null,
                    o = 0,
                    h = null,
                    w = [],
                    v = {},
                    y = function (t, e) {
                      ((i = (function (t) {
                        for (var e = new Array(t), r = 0; r < t; r += 1) {
                          e[r] = new Array(t);
                          for (var n = 0; n < t; n += 1) e[r][n] = null;
                        }
                        return e;
                      })((o = 4 * r + 17))),
                        m(0, 0),
                        m(o - 7, 0),
                        m(0, o - 7),
                        A(),
                        b(),
                        x(t, e),
                        r >= 7 && S(t),
                        null == h && (h = E(r, n, w)),
                        C(h, e));
                    },
                    m = function (t, e) {
                      for (var r = -1; r <= 7; r += 1)
                        if (!(t + r <= -1 || o <= t + r))
                          for (var n = -1; n <= 7; n += 1)
                            e + n <= -1 ||
                              o <= e + n ||
                              (i[t + r][e + n] =
                                (0 <= r && r <= 6 && (0 == n || 6 == n)) ||
                                (0 <= n && n <= 6 && (0 == r || 6 == r)) ||
                                (2 <= r && r <= 4 && 2 <= n && n <= 4));
                    },
                    b = function () {
                      for (var t = 8; t < o - 8; t += 1) null == i[t][6] && (i[t][6] = t % 2 == 0);
                      for (var e = 8; e < o - 8; e += 1) null == i[6][e] && (i[6][e] = e % 2 == 0);
                    },
                    A = function () {
                      for (var t = a.getPatternPosition(r), e = 0; e < t.length; e += 1)
                        for (var n = 0; n < t.length; n += 1) {
                          var o = t[e],
                            s = t[n];
                          if (null == i[o][s])
                            for (var h = -2; h <= 2; h += 1)
                              for (var u = -2; u <= 2; u += 1)
                                i[o + h][s + u] = -2 == h || 2 == h || -2 == u || 2 == u || (0 == h && 0 == u);
                        }
                    },
                    S = function (t) {
                      for (var e = a.getBCHTypeNumber(r), n = 0; n < 18; n += 1) {
                        var s = !t && 1 == ((e >> n) & 1);
                        i[Math.floor(n / 3)][(n % 3) + o - 8 - 3] = s;
                      }
                      for (n = 0; n < 18; n += 1)
                        ((s = !t && 1 == ((e >> n) & 1)), (i[(n % 3) + o - 8 - 3][Math.floor(n / 3)] = s));
                    },
                    x = function (t, e) {
                      for (var r = (n << 3) | e, s = a.getBCHTypeInfo(r), h = 0; h < 15; h += 1) {
                        var u = !t && 1 == ((s >> h) & 1);
                        h < 6 ? (i[h][8] = u) : h < 8 ? (i[h + 1][8] = u) : (i[o - 15 + h][8] = u);
                      }
                      for (h = 0; h < 15; h += 1)
                        ((u = !t && 1 == ((s >> h) & 1)),
                          h < 8 ? (i[8][o - h - 1] = u) : h < 9 ? (i[8][15 - h - 1 + 1] = u) : (i[8][15 - h - 1] = u));
                      i[o - 8][8] = !t;
                    },
                    C = function (t, e) {
                      for (var r = -1, n = o - 1, s = 7, h = 0, u = a.getMaskFunction(e), d = o - 1; d > 0; d -= 2)
                        for (6 == d && (d -= 1); ; ) {
                          for (var f = 0; f < 2; f += 1)
                            if (null == i[n][d - f]) {
                              var c = !1;
                              (h < t.length && (c = 1 == ((t[h] >>> s) & 1)),
                                u(n, d - f) && (c = !c),
                                (i[n][d - f] = c),
                                -1 == (s -= 1) && ((h += 1), (s = 7)));
                            }
                          if ((n += r) < 0 || o <= n) {
                            ((n -= r), (r = -r));
                            break;
                          }
                        }
                    },
                    E = function (t, e, r) {
                      for (var n = d.getRSBlocks(t, e), i = f(), o = 0; o < r.length; o += 1) {
                        var s = r[o];
                        (i.put(s.getMode(), 4), i.put(s.getLength(), a.getLengthInBits(s.getMode(), t)), s.write(i));
                      }
                      var h = 0;
                      for (o = 0; o < n.length; o += 1) h += n[o].dataCount;
                      if (i.getLengthInBits() > 8 * h)
                        throw 'code length overflow. (' + i.getLengthInBits() + '>' + 8 * h + ')';
                      for (i.getLengthInBits() + 4 <= 8 * h && i.put(0, 4); i.getLengthInBits() % 8 != 0; )
                        i.putBit(!1);
                      for (; !(i.getLengthInBits() >= 8 * h || (i.put(236, 8), i.getLengthInBits() >= 8 * h)); )
                        i.put(17, 8);
                      return (function (t, e) {
                        for (
                          var r = 0, n = 0, i = 0, o = new Array(e.length), s = new Array(e.length), h = 0;
                          h < e.length;
                          h += 1
                        ) {
                          var d = e[h].dataCount,
                            f = e[h].totalCount - d;
                          ((n = Math.max(n, d)), (i = Math.max(i, f)), (o[h] = new Array(d)));
                          for (var c = 0; c < o[h].length; c += 1) o[h][c] = 255 & t.getBuffer()[c + r];
                          r += d;
                          var l = a.getErrorCorrectPolynomial(f),
                            g = u(o[h], l.getLength() - 1).mod(l);
                          for (s[h] = new Array(l.getLength() - 1), c = 0; c < s[h].length; c += 1) {
                            var p = c + g.getLength() - s[h].length;
                            s[h][c] = p >= 0 ? g.getAt(p) : 0;
                          }
                        }
                        var w = 0;
                        for (c = 0; c < e.length; c += 1) w += e[c].totalCount;
                        var v = new Array(w),
                          _ = 0;
                        for (c = 0; c < n; c += 1)
                          for (h = 0; h < e.length; h += 1) c < o[h].length && ((v[_] = o[h][c]), (_ += 1));
                        for (c = 0; c < i; c += 1)
                          for (h = 0; h < e.length; h += 1) c < s[h].length && ((v[_] = s[h][c]), (_ += 1));
                        return v;
                      })(i, n);
                    };
                  ((v.addData = function (t, e) {
                    var r = null;
                    switch ((e = e || 'Byte')) {
                      case 'Numeric':
                        r = c(t);
                        break;
                      case 'Alphanumeric':
                        r = l(t);
                        break;
                      case 'Byte':
                        r = g(t);
                        break;
                      case 'Kanji':
                        r = p(t);
                        break;
                      default:
                        throw 'mode:' + e;
                    }
                    (w.push(r), (h = null));
                  }),
                    (v.isDark = function (t, e) {
                      if (t < 0 || o <= t || e < 0 || o <= e) throw t + ',' + e;
                      return i[t][e];
                    }),
                    (v.getModuleCount = function () {
                      return o;
                    }),
                    (v.make = function () {
                      if (r < 1) {
                        for (var t = 1; t < 40; t++) {
                          for (var e = d.getRSBlocks(t, n), i = f(), o = 0; o < w.length; o++) {
                            var s = w[o];
                            (i.put(s.getMode(), 4),
                              i.put(s.getLength(), a.getLengthInBits(s.getMode(), t)),
                              s.write(i));
                          }
                          var h = 0;
                          for (o = 0; o < e.length; o++) h += e[o].dataCount;
                          if (i.getLengthInBits() <= 8 * h) break;
                        }
                        r = t;
                      }
                      y(
                        !1,
                        (function () {
                          for (var t = 0, e = 0, r = 0; r < 8; r += 1) {
                            y(!0, r);
                            var n = a.getLostPoint(v);
                            (0 == r || t > n) && ((t = n), (e = r));
                          }
                          return e;
                        })(),
                      );
                    }),
                    (v.createTableTag = function (t, e) {
                      t = t || 2;
                      var r = '';
                      ((r += '<table style="'),
                        (r += ' border-width: 0px; border-style: none;'),
                        (r += ' border-collapse: collapse;'),
                        (r += ' padding: 0px; margin: ' + (e = void 0 === e ? 4 * t : e) + 'px;'),
                        (r += '">'),
                        (r += '<tbody>'));
                      for (var n = 0; n < v.getModuleCount(); n += 1) {
                        r += '<tr>';
                        for (var i = 0; i < v.getModuleCount(); i += 1)
                          ((r += '<td style="'),
                            (r += ' border-width: 0px; border-style: none;'),
                            (r += ' border-collapse: collapse;'),
                            (r += ' padding: 0px; margin: 0px;'),
                            (r += ' width: ' + t + 'px;'),
                            (r += ' height: ' + t + 'px;'),
                            (r += ' background-color: '),
                            (r += v.isDark(n, i) ? '#000000' : '#ffffff'),
                            (r += ';'),
                            (r += '"/>'));
                        r += '</tr>';
                      }
                      return (r += '</tbody>') + '</table>';
                    }),
                    (v.createSvgTag = function (t, e, r, n) {
                      var i = {};
                      ('object' == typeof arguments[0] &&
                        ((t = (i = arguments[0]).cellSize), (e = i.margin), (r = i.alt), (n = i.title)),
                        (t = t || 2),
                        (e = void 0 === e ? 4 * t : e),
                        ((r = 'string' == typeof r ? { text: r } : r || {}).text = r.text || null),
                        (r.id = r.text ? r.id || 'qrcode-description' : null),
                        ((n = 'string' == typeof n ? { text: n } : n || {}).text = n.text || null),
                        (n.id = n.text ? n.id || 'qrcode-title' : null));
                      var o,
                        s,
                        a,
                        h,
                        u = v.getModuleCount() * t + 2 * e,
                        d = '';
                      for (
                        h = 'l' + t + ',0 0,' + t + ' -' + t + ',0 0,-' + t + 'z ',
                          d += '<svg version="1.1" xmlns="http://www.w3.org/2000/svg"',
                          d += i.scalable ? '' : ' width="' + u + 'px" height="' + u + 'px"',
                          d += ' viewBox="0 0 ' + u + ' ' + u + '" ',
                          d += ' preserveAspectRatio="xMinYMin meet"',
                          d +=
                            n.text || r.text
                              ? ' role="img" aria-labelledby="' + M([n.id, r.id].join(' ').trim()) + '"'
                              : '',
                          d += '>',
                          d += n.text ? '<title id="' + M(n.id) + '">' + M(n.text) + '</title>' : '',
                          d += r.text ? '<description id="' + M(r.id) + '">' + M(r.text) + '</description>' : '',
                          d += '<rect width="100%" height="100%" fill="white" cx="0" cy="0"/>',
                          d += '<path d="',
                          s = 0;
                        s < v.getModuleCount();
                        s += 1
                      )
                        for (a = s * t + e, o = 0; o < v.getModuleCount(); o += 1)
                          v.isDark(s, o) && (d += 'M' + (o * t + e) + ',' + a + h);
                      return (d += '" stroke="transparent" fill="black"/>') + '</svg>';
                    }),
                    (v.createDataURL = function (t, e) {
                      ((t = t || 2), (e = void 0 === e ? 4 * t : e));
                      var r = v.getModuleCount() * t + 2 * e,
                        n = e,
                        i = r - e;
                      return _(r, r, function (e, r) {
                        if (n <= e && e < i && n <= r && r < i) {
                          var o = Math.floor((e - n) / t),
                            s = Math.floor((r - n) / t);
                          return v.isDark(s, o) ? 0 : 1;
                        }
                        return 1;
                      });
                    }),
                    (v.createImgTag = function (t, e, r) {
                      ((t = t || 2), (e = void 0 === e ? 4 * t : e));
                      var n = v.getModuleCount() * t + 2 * e,
                        i = '';
                      return (
                        (i += '<img'),
                        (i += ' src="'),
                        (i += v.createDataURL(t, e)),
                        (i += '"'),
                        (i += ' width="'),
                        (i += n),
                        (i += '"'),
                        (i += ' height="'),
                        (i += n),
                        (i += '"'),
                        r && ((i += ' alt="'), (i += M(r)), (i += '"')),
                        i + '/>'
                      );
                    }));
                  var M = function (t) {
                    for (var e = '', r = 0; r < t.length; r += 1) {
                      var n = t.charAt(r);
                      switch (n) {
                        case '<':
                          e += '&lt;';
                          break;
                        case '>':
                          e += '&gt;';
                          break;
                        case '&':
                          e += '&amp;';
                          break;
                        case '"':
                          e += '&quot;';
                          break;
                        default:
                          e += n;
                      }
                    }
                    return e;
                  };
                  return (
                    (v.createASCII = function (t, e) {
                      if ((t = t || 1) < 2)
                        return (function (t) {
                          t = void 0 === t ? 2 : t;
                          var e,
                            r,
                            n,
                            i,
                            o,
                            s = 1 * v.getModuleCount() + 2 * t,
                            a = t,
                            h = s - t,
                            u = { '██': '█', '█ ': '▀', ' █': '▄', '  ': ' ' },
                            d = { '██': '▀', '█ ': '▀', ' █': ' ', '  ': ' ' },
                            f = '';
                          for (e = 0; e < s; e += 2) {
                            for (n = Math.floor((e - a) / 1), i = Math.floor((e + 1 - a) / 1), r = 0; r < s; r += 1)
                              ((o = '█'),
                                a <= r && r < h && a <= e && e < h && v.isDark(n, Math.floor((r - a) / 1)) && (o = ' '),
                                a <= r && r < h && a <= e + 1 && e + 1 < h && v.isDark(i, Math.floor((r - a) / 1))
                                  ? (o += ' ')
                                  : (o += '█'),
                                (f += t < 1 && e + 1 >= h ? d[o] : u[o]));
                            f += '\n';
                          }
                          return s % 2 && t > 0
                            ? f.substring(0, f.length - s - 1) + Array(s + 1).join('▀')
                            : f.substring(0, f.length - 1);
                        })(e);
                      ((t -= 1), (e = void 0 === e ? 2 * t : e));
                      var r,
                        n,
                        i,
                        o,
                        s = v.getModuleCount() * t + 2 * e,
                        a = e,
                        h = s - e,
                        u = Array(t + 1).join('██'),
                        d = Array(t + 1).join('  '),
                        f = '',
                        c = '';
                      for (r = 0; r < s; r += 1) {
                        for (i = Math.floor((r - a) / t), c = '', n = 0; n < s; n += 1)
                          ((o = 1),
                            a <= n && n < h && a <= r && r < h && v.isDark(i, Math.floor((n - a) / t)) && (o = 0),
                            (c += o ? u : d));
                        for (i = 0; i < t; i += 1) f += c + '\n';
                      }
                      return f.substring(0, f.length - 1);
                    }),
                    (v.renderTo2dContext = function (t, e) {
                      e = e || 2;
                      for (var r = v.getModuleCount(), n = 0; n < r; n++)
                        for (var i = 0; i < r; i++)
                          ((t.fillStyle = v.isDark(n, i) ? 'black' : 'white'), t.fillRect(n * e, i * e, e, e));
                    }),
                    v
                  );
                };
                ((t.stringToBytes = (t.stringToBytesFuncs = {
                  default: function (t) {
                    for (var e = [], r = 0; r < t.length; r += 1) {
                      var n = t.charCodeAt(r);
                      e.push(255 & n);
                    }
                    return e;
                  },
                }).default),
                  (t.createStringToBytes = function (t, e) {
                    var r = (function () {
                        for (
                          var r = v(t),
                            n = function () {
                              var t = r.read();
                              if (-1 == t) throw 'eof';
                              return t;
                            },
                            i = 0,
                            o = {};
                          ;

                        ) {
                          var s = r.read();
                          if (-1 == s) break;
                          var a = n(),
                            h = (n() << 8) | n();
                          ((o[String.fromCharCode((s << 8) | a)] = h), (i += 1));
                        }
                        if (i != e) throw i + ' != ' + e;
                        return o;
                      })(),
                      n = '?'.charCodeAt(0);
                    return function (t) {
                      for (var e = [], i = 0; i < t.length; i += 1) {
                        var o = t.charCodeAt(i);
                        if (o < 128) e.push(o);
                        else {
                          var s = r[t.charAt(i)];
                          'number' == typeof s
                            ? (255 & s) == s
                              ? e.push(s)
                              : (e.push(s >>> 8), e.push(255 & s))
                            : e.push(n);
                        }
                      }
                      return e;
                    };
                  }));
                var e,
                  r,
                  n,
                  i,
                  o,
                  s = { L: 1, M: 0, Q: 3, H: 2 },
                  a =
                    ((e = [
                      [],
                      [6, 18],
                      [6, 22],
                      [6, 26],
                      [6, 30],
                      [6, 34],
                      [6, 22, 38],
                      [6, 24, 42],
                      [6, 26, 46],
                      [6, 28, 50],
                      [6, 30, 54],
                      [6, 32, 58],
                      [6, 34, 62],
                      [6, 26, 46, 66],
                      [6, 26, 48, 70],
                      [6, 26, 50, 74],
                      [6, 30, 54, 78],
                      [6, 30, 56, 82],
                      [6, 30, 58, 86],
                      [6, 34, 62, 90],
                      [6, 28, 50, 72, 94],
                      [6, 26, 50, 74, 98],
                      [6, 30, 54, 78, 102],
                      [6, 28, 54, 80, 106],
                      [6, 32, 58, 84, 110],
                      [6, 30, 58, 86, 114],
                      [6, 34, 62, 90, 118],
                      [6, 26, 50, 74, 98, 122],
                      [6, 30, 54, 78, 102, 126],
                      [6, 26, 52, 78, 104, 130],
                      [6, 30, 56, 82, 108, 134],
                      [6, 34, 60, 86, 112, 138],
                      [6, 30, 58, 86, 114, 142],
                      [6, 34, 62, 90, 118, 146],
                      [6, 30, 54, 78, 102, 126, 150],
                      [6, 24, 50, 76, 102, 128, 154],
                      [6, 28, 54, 80, 106, 132, 158],
                      [6, 32, 58, 84, 110, 136, 162],
                      [6, 26, 54, 82, 110, 138, 166],
                      [6, 30, 58, 86, 114, 142, 170],
                    ]),
                    (r = 1335),
                    (n = 7973),
                    (o = function (t) {
                      for (var e = 0; 0 != t; ) ((e += 1), (t >>>= 1));
                      return e;
                    }),
                    ((i = {}).getBCHTypeInfo = function (t) {
                      for (var e = t << 10; o(e) - o(r) >= 0; ) e ^= r << (o(e) - o(r));
                      return 21522 ^ ((t << 10) | e);
                    }),
                    (i.getBCHTypeNumber = function (t) {
                      for (var e = t << 12; o(e) - o(n) >= 0; ) e ^= n << (o(e) - o(n));
                      return (t << 12) | e;
                    }),
                    (i.getPatternPosition = function (t) {
                      return e[t - 1];
                    }),
                    (i.getMaskFunction = function (t) {
                      switch (t) {
                        case 0:
                          return function (t, e) {
                            return (t + e) % 2 == 0;
                          };
                        case 1:
                          return function (t, e) {
                            return t % 2 == 0;
                          };
                        case 2:
                          return function (t, e) {
                            return e % 3 == 0;
                          };
                        case 3:
                          return function (t, e) {
                            return (t + e) % 3 == 0;
                          };
                        case 4:
                          return function (t, e) {
                            return (Math.floor(t / 2) + Math.floor(e / 3)) % 2 == 0;
                          };
                        case 5:
                          return function (t, e) {
                            return ((t * e) % 2) + ((t * e) % 3) == 0;
                          };
                        case 6:
                          return function (t, e) {
                            return (((t * e) % 2) + ((t * e) % 3)) % 2 == 0;
                          };
                        case 7:
                          return function (t, e) {
                            return (((t * e) % 3) + ((t + e) % 2)) % 2 == 0;
                          };
                        default:
                          throw 'bad maskPattern:' + t;
                      }
                    }),
                    (i.getErrorCorrectPolynomial = function (t) {
                      for (var e = u([1], 0), r = 0; r < t; r += 1) e = e.multiply(u([1, h.gexp(r)], 0));
                      return e;
                    }),
                    (i.getLengthInBits = function (t, e) {
                      if (1 <= e && e < 10)
                        switch (t) {
                          case 1:
                            return 10;
                          case 2:
                            return 9;
                          case 4:
                          case 8:
                            return 8;
                          default:
                            throw 'mode:' + t;
                        }
                      else if (e < 27)
                        switch (t) {
                          case 1:
                            return 12;
                          case 2:
                            return 11;
                          case 4:
                            return 16;
                          case 8:
                            return 10;
                          default:
                            throw 'mode:' + t;
                        }
                      else {
                        if (!(e < 41)) throw 'type:' + e;
                        switch (t) {
                          case 1:
                            return 14;
                          case 2:
                            return 13;
                          case 4:
                            return 16;
                          case 8:
                            return 12;
                          default:
                            throw 'mode:' + t;
                        }
                      }
                    }),
                    (i.getLostPoint = function (t) {
                      for (var e = t.getModuleCount(), r = 0, n = 0; n < e; n += 1)
                        for (var i = 0; i < e; i += 1) {
                          for (var o = 0, s = t.isDark(n, i), a = -1; a <= 1; a += 1)
                            if (!(n + a < 0 || e <= n + a))
                              for (var h = -1; h <= 1; h += 1)
                                i + h < 0 ||
                                  e <= i + h ||
                                  (0 == a && 0 == h) ||
                                  (s == t.isDark(n + a, i + h) && (o += 1));
                          o > 5 && (r += 3 + o - 5);
                        }
                      for (n = 0; n < e - 1; n += 1)
                        for (i = 0; i < e - 1; i += 1) {
                          var u = 0;
                          (t.isDark(n, i) && (u += 1),
                            t.isDark(n + 1, i) && (u += 1),
                            t.isDark(n, i + 1) && (u += 1),
                            t.isDark(n + 1, i + 1) && (u += 1),
                            (0 != u && 4 != u) || (r += 3));
                        }
                      for (n = 0; n < e; n += 1)
                        for (i = 0; i < e - 6; i += 1)
                          t.isDark(n, i) &&
                            !t.isDark(n, i + 1) &&
                            t.isDark(n, i + 2) &&
                            t.isDark(n, i + 3) &&
                            t.isDark(n, i + 4) &&
                            !t.isDark(n, i + 5) &&
                            t.isDark(n, i + 6) &&
                            (r += 40);
                      for (i = 0; i < e; i += 1)
                        for (n = 0; n < e - 6; n += 1)
                          t.isDark(n, i) &&
                            !t.isDark(n + 1, i) &&
                            t.isDark(n + 2, i) &&
                            t.isDark(n + 3, i) &&
                            t.isDark(n + 4, i) &&
                            !t.isDark(n + 5, i) &&
                            t.isDark(n + 6, i) &&
                            (r += 40);
                      var d = 0;
                      for (i = 0; i < e; i += 1) for (n = 0; n < e; n += 1) t.isDark(n, i) && (d += 1);
                      return r + (Math.abs((100 * d) / e / e - 50) / 5) * 10;
                    }),
                    i),
                  h = (function () {
                    for (var t = new Array(256), e = new Array(256), r = 0; r < 8; r += 1) t[r] = 1 << r;
                    for (r = 8; r < 256; r += 1) t[r] = t[r - 4] ^ t[r - 5] ^ t[r - 6] ^ t[r - 8];
                    for (r = 0; r < 255; r += 1) e[t[r]] = r;
                    return {
                      glog: function (t) {
                        if (t < 1) throw 'glog(' + t + ')';
                        return e[t];
                      },
                      gexp: function (e) {
                        for (; e < 0; ) e += 255;
                        for (; e >= 256; ) e -= 255;
                        return t[e];
                      },
                    };
                  })();

                function u(t, e) {
                  if (void 0 === t.length) throw t.length + '/' + e;
                  var r = (function () {
                      for (var r = 0; r < t.length && 0 == t[r]; ) r += 1;
                      for (var n = new Array(t.length - r + e), i = 0; i < t.length - r; i += 1) n[i] = t[i + r];
                      return n;
                    })(),
                    n = {
                      getAt: function (t) {
                        return r[t];
                      },
                      getLength: function () {
                        return r.length;
                      },
                      multiply: function (t) {
                        for (var e = new Array(n.getLength() + t.getLength() - 1), r = 0; r < n.getLength(); r += 1)
                          for (var i = 0; i < t.getLength(); i += 1)
                            e[r + i] ^= h.gexp(h.glog(n.getAt(r)) + h.glog(t.getAt(i)));
                        return u(e, 0);
                      },
                      mod: function (t) {
                        if (n.getLength() - t.getLength() < 0) return n;
                        for (
                          var e = h.glog(n.getAt(0)) - h.glog(t.getAt(0)), r = new Array(n.getLength()), i = 0;
                          i < n.getLength();
                          i += 1
                        )
                          r[i] = n.getAt(i);
                        for (i = 0; i < t.getLength(); i += 1) r[i] ^= h.gexp(h.glog(t.getAt(i)) + e);
                        return u(r, 0).mod(t);
                      },
                    };
                  return n;
                }

                var d = (function () {
                    var t = [
                        [1, 26, 19],
                        [1, 26, 16],
                        [1, 26, 13],
                        [1, 26, 9],
                        [1, 44, 34],
                        [1, 44, 28],
                        [1, 44, 22],
                        [1, 44, 16],
                        [1, 70, 55],
                        [1, 70, 44],
                        [2, 35, 17],
                        [2, 35, 13],
                        [1, 100, 80],
                        [2, 50, 32],
                        [2, 50, 24],
                        [4, 25, 9],
                        [1, 134, 108],
                        [2, 67, 43],
                        [2, 33, 15, 2, 34, 16],
                        [2, 33, 11, 2, 34, 12],
                        [2, 86, 68],
                        [4, 43, 27],
                        [4, 43, 19],
                        [4, 43, 15],
                        [2, 98, 78],
                        [4, 49, 31],
                        [2, 32, 14, 4, 33, 15],
                        [4, 39, 13, 1, 40, 14],
                        [2, 121, 97],
                        [2, 60, 38, 2, 61, 39],
                        [4, 40, 18, 2, 41, 19],
                        [4, 40, 14, 2, 41, 15],
                        [2, 146, 116],
                        [3, 58, 36, 2, 59, 37],
                        [4, 36, 16, 4, 37, 17],
                        [4, 36, 12, 4, 37, 13],
                        [2, 86, 68, 2, 87, 69],
                        [4, 69, 43, 1, 70, 44],
                        [6, 43, 19, 2, 44, 20],
                        [6, 43, 15, 2, 44, 16],
                        [4, 101, 81],
                        [1, 80, 50, 4, 81, 51],
                        [4, 50, 22, 4, 51, 23],
                        [3, 36, 12, 8, 37, 13],
                        [2, 116, 92, 2, 117, 93],
                        [6, 58, 36, 2, 59, 37],
                        [4, 46, 20, 6, 47, 21],
                        [7, 42, 14, 4, 43, 15],
                        [4, 133, 107],
                        [8, 59, 37, 1, 60, 38],
                        [8, 44, 20, 4, 45, 21],
                        [12, 33, 11, 4, 34, 12],
                        [3, 145, 115, 1, 146, 116],
                        [4, 64, 40, 5, 65, 41],
                        [11, 36, 16, 5, 37, 17],
                        [11, 36, 12, 5, 37, 13],
                        [5, 109, 87, 1, 110, 88],
                        [5, 65, 41, 5, 66, 42],
                        [5, 54, 24, 7, 55, 25],
                        [11, 36, 12, 7, 37, 13],
                        [5, 122, 98, 1, 123, 99],
                        [7, 73, 45, 3, 74, 46],
                        [15, 43, 19, 2, 44, 20],
                        [3, 45, 15, 13, 46, 16],
                        [1, 135, 107, 5, 136, 108],
                        [10, 74, 46, 1, 75, 47],
                        [1, 50, 22, 15, 51, 23],
                        [2, 42, 14, 17, 43, 15],
                        [5, 150, 120, 1, 151, 121],
                        [9, 69, 43, 4, 70, 44],
                        [17, 50, 22, 1, 51, 23],
                        [2, 42, 14, 19, 43, 15],
                        [3, 141, 113, 4, 142, 114],
                        [3, 70, 44, 11, 71, 45],
                        [17, 47, 21, 4, 48, 22],
                        [9, 39, 13, 16, 40, 14],
                        [3, 135, 107, 5, 136, 108],
                        [3, 67, 41, 13, 68, 42],
                        [15, 54, 24, 5, 55, 25],
                        [15, 43, 15, 10, 44, 16],
                        [4, 144, 116, 4, 145, 117],
                        [17, 68, 42],
                        [17, 50, 22, 6, 51, 23],
                        [19, 46, 16, 6, 47, 17],
                        [2, 139, 111, 7, 140, 112],
                        [17, 74, 46],
                        [7, 54, 24, 16, 55, 25],
                        [34, 37, 13],
                        [4, 151, 121, 5, 152, 122],
                        [4, 75, 47, 14, 76, 48],
                        [11, 54, 24, 14, 55, 25],
                        [16, 45, 15, 14, 46, 16],
                        [6, 147, 117, 4, 148, 118],
                        [6, 73, 45, 14, 74, 46],
                        [11, 54, 24, 16, 55, 25],
                        [30, 46, 16, 2, 47, 17],
                        [8, 132, 106, 4, 133, 107],
                        [8, 75, 47, 13, 76, 48],
                        [7, 54, 24, 22, 55, 25],
                        [22, 45, 15, 13, 46, 16],
                        [10, 142, 114, 2, 143, 115],
                        [19, 74, 46, 4, 75, 47],
                        [28, 50, 22, 6, 51, 23],
                        [33, 46, 16, 4, 47, 17],
                        [8, 152, 122, 4, 153, 123],
                        [22, 73, 45, 3, 74, 46],
                        [8, 53, 23, 26, 54, 24],
                        [12, 45, 15, 28, 46, 16],
                        [3, 147, 117, 10, 148, 118],
                        [3, 73, 45, 23, 74, 46],
                        [4, 54, 24, 31, 55, 25],
                        [11, 45, 15, 31, 46, 16],
                        [7, 146, 116, 7, 147, 117],
                        [21, 73, 45, 7, 74, 46],
                        [1, 53, 23, 37, 54, 24],
                        [19, 45, 15, 26, 46, 16],
                        [5, 145, 115, 10, 146, 116],
                        [19, 75, 47, 10, 76, 48],
                        [15, 54, 24, 25, 55, 25],
                        [23, 45, 15, 25, 46, 16],
                        [13, 145, 115, 3, 146, 116],
                        [2, 74, 46, 29, 75, 47],
                        [42, 54, 24, 1, 55, 25],
                        [23, 45, 15, 28, 46, 16],
                        [17, 145, 115],
                        [10, 74, 46, 23, 75, 47],
                        [10, 54, 24, 35, 55, 25],
                        [19, 45, 15, 35, 46, 16],
                        [17, 145, 115, 1, 146, 116],
                        [14, 74, 46, 21, 75, 47],
                        [29, 54, 24, 19, 55, 25],
                        [11, 45, 15, 46, 46, 16],
                        [13, 145, 115, 6, 146, 116],
                        [14, 74, 46, 23, 75, 47],
                        [44, 54, 24, 7, 55, 25],
                        [59, 46, 16, 1, 47, 17],
                        [12, 151, 121, 7, 152, 122],
                        [12, 75, 47, 26, 76, 48],
                        [39, 54, 24, 14, 55, 25],
                        [22, 45, 15, 41, 46, 16],
                        [6, 151, 121, 14, 152, 122],
                        [6, 75, 47, 34, 76, 48],
                        [46, 54, 24, 10, 55, 25],
                        [2, 45, 15, 64, 46, 16],
                        [17, 152, 122, 4, 153, 123],
                        [29, 74, 46, 14, 75, 47],
                        [49, 54, 24, 10, 55, 25],
                        [24, 45, 15, 46, 46, 16],
                        [4, 152, 122, 18, 153, 123],
                        [13, 74, 46, 32, 75, 47],
                        [48, 54, 24, 14, 55, 25],
                        [42, 45, 15, 32, 46, 16],
                        [20, 147, 117, 4, 148, 118],
                        [40, 75, 47, 7, 76, 48],
                        [43, 54, 24, 22, 55, 25],
                        [10, 45, 15, 67, 46, 16],
                        [19, 148, 118, 6, 149, 119],
                        [18, 75, 47, 31, 76, 48],
                        [34, 54, 24, 34, 55, 25],
                        [20, 45, 15, 61, 46, 16],
                      ],
                      e = function (t, e) {
                        var r = {};
                        return ((r.totalCount = t), (r.dataCount = e), r);
                      },
                      r = {
                        getRSBlocks: function (r, n) {
                          var i = (function (e, r) {
                            switch (r) {
                              case s.L:
                                return t[4 * (e - 1) + 0];
                              case s.M:
                                return t[4 * (e - 1) + 1];
                              case s.Q:
                                return t[4 * (e - 1) + 2];
                              case s.H:
                                return t[4 * (e - 1) + 3];
                              default:
                                return;
                            }
                          })(r, n);
                          if (void 0 === i) throw 'bad rs block @ typeNumber:' + r + '/errorCorrectionLevel:' + n;
                          for (var o = i.length / 3, a = [], h = 0; h < o; h += 1)
                            for (var u = i[3 * h + 0], d = i[3 * h + 1], f = i[3 * h + 2], c = 0; c < u; c += 1)
                              a.push(e(d, f));
                          return a;
                        },
                      };
                    return r;
                  })(),
                  f = function () {
                    var t = [],
                      e = 0,
                      r = {
                        getBuffer: function () {
                          return t;
                        },
                        getAt: function (e) {
                          var r = Math.floor(e / 8);
                          return 1 == ((t[r] >>> (7 - (e % 8))) & 1);
                        },
                        put: function (t, e) {
                          for (var n = 0; n < e; n += 1) r.putBit(1 == ((t >>> (e - n - 1)) & 1));
                        },
                        getLengthInBits: function () {
                          return e;
                        },
                        putBit: function (r) {
                          var n = Math.floor(e / 8);
                          (t.length <= n && t.push(0), r && (t[n] |= 128 >>> e % 8), (e += 1));
                        },
                      };
                    return r;
                  },
                  c = function (t) {
                    var e = t,
                      r = {
                        getMode: function () {
                          return 1;
                        },
                        getLength: function (t) {
                          return e.length;
                        },
                        write: function (t) {
                          for (var r = e, i = 0; i + 2 < r.length; ) (t.put(n(r.substring(i, i + 3)), 10), (i += 3));
                          i < r.length &&
                            (r.length - i == 1
                              ? t.put(n(r.substring(i, i + 1)), 4)
                              : r.length - i == 2 && t.put(n(r.substring(i, i + 2)), 7));
                        },
                      },
                      n = function (t) {
                        for (var e = 0, r = 0; r < t.length; r += 1) e = 10 * e + i(t.charAt(r));
                        return e;
                      },
                      i = function (t) {
                        if ('0' <= t && t <= '9') return t.charCodeAt(0) - '0'.charCodeAt(0);
                        throw 'illegal char :' + t;
                      };
                    return r;
                  },
                  l = function (t) {
                    var e = t,
                      r = {
                        getMode: function () {
                          return 2;
                        },
                        getLength: function (t) {
                          return e.length;
                        },
                        write: function (t) {
                          for (var r = e, i = 0; i + 1 < r.length; )
                            (t.put(45 * n(r.charAt(i)) + n(r.charAt(i + 1)), 11), (i += 2));
                          i < r.length && t.put(n(r.charAt(i)), 6);
                        },
                      },
                      n = function (t) {
                        if ('0' <= t && t <= '9') return t.charCodeAt(0) - '0'.charCodeAt(0);
                        if ('A' <= t && t <= 'Z') return t.charCodeAt(0) - 'A'.charCodeAt(0) + 10;
                        switch (t) {
                          case ' ':
                            return 36;
                          case '$':
                            return 37;
                          case '%':
                            return 38;
                          case '*':
                            return 39;
                          case '+':
                            return 40;
                          case '-':
                            return 41;
                          case '.':
                            return 42;
                          case '/':
                            return 43;
                          case ':':
                            return 44;
                          default:
                            throw 'illegal char :' + t;
                        }
                      };
                    return r;
                  },
                  g = function (e) {
                    var r = t.stringToBytes(e);
                    return {
                      getMode: function () {
                        return 4;
                      },
                      getLength: function (t) {
                        return r.length;
                      },
                      write: function (t) {
                        for (var e = 0; e < r.length; e += 1) t.put(r[e], 8);
                      },
                    };
                  },
                  p = function (e) {
                    var r = t.stringToBytesFuncs.SJIS;
                    if (!r) throw 'sjis not supported.';
                    !(function () {
                      var t = r('友');
                      if (2 != t.length || 38726 != ((t[0] << 8) | t[1])) throw 'sjis not supported.';
                    })();
                    var n = r(e),
                      i = {
                        getMode: function () {
                          return 8;
                        },
                        getLength: function (t) {
                          return ~~(n.length / 2);
                        },
                        write: function (t) {
                          for (var e = n, r = 0; r + 1 < e.length; ) {
                            var i = ((255 & e[r]) << 8) | (255 & e[r + 1]);
                            if (33088 <= i && i <= 40956) i -= 33088;
                            else {
                              if (!(57408 <= i && i <= 60351)) throw 'illegal char at ' + (r + 1) + '/' + i;
                              i -= 49472;
                            }
                            ((i = 192 * ((i >>> 8) & 255) + (255 & i)), t.put(i, 13), (r += 2));
                          }
                          if (r < e.length) throw 'illegal char at ' + (r + 1);
                        },
                      };
                    return i;
                  },
                  w = function () {
                    var t = [],
                      e = {
                        writeByte: function (e) {
                          t.push(255 & e);
                        },
                        writeShort: function (t) {
                          (e.writeByte(t), e.writeByte(t >>> 8));
                        },
                        writeBytes: function (t, r, n) {
                          ((r = r || 0), (n = n || t.length));
                          for (var i = 0; i < n; i += 1) e.writeByte(t[i + r]);
                        },
                        writeString: function (t) {
                          for (var r = 0; r < t.length; r += 1) e.writeByte(t.charCodeAt(r));
                        },
                        toByteArray: function () {
                          return t;
                        },
                        toString: function () {
                          var e = '';
                          e += '[';
                          for (var r = 0; r < t.length; r += 1) (r > 0 && (e += ','), (e += t[r]));
                          return e + ']';
                        },
                      };
                    return e;
                  },
                  v = function (t) {
                    var e = t,
                      r = 0,
                      n = 0,
                      i = 0,
                      o = {
                        read: function () {
                          for (; i < 8; ) {
                            if (r >= e.length) {
                              if (0 == i) return -1;
                              throw 'unexpected end of file./' + i;
                            }
                            var t = e.charAt(r);
                            if (((r += 1), '=' == t)) return ((i = 0), -1);
                            t.match(/^\s$/) || ((n = (n << 6) | s(t.charCodeAt(0))), (i += 6));
                          }
                          var o = (n >>> (i - 8)) & 255;
                          return ((i -= 8), o);
                        },
                      },
                      s = function (t) {
                        if (65 <= t && t <= 90) return t - 65;
                        if (97 <= t && t <= 122) return t - 97 + 26;
                        if (48 <= t && t <= 57) return t - 48 + 52;
                        if (43 == t) return 62;
                        if (47 == t) return 63;
                        throw 'c:' + t;
                      };
                    return o;
                  },
                  _ = function (t, e, r) {
                    for (
                      var n = (function (t, e) {
                          var r = t,
                            n = e,
                            i = new Array(t * e),
                            o = {
                              setPixel: function (t, e, n) {
                                i[e * r + t] = n;
                              },
                              write: function (t) {
                                (t.writeString('GIF87a'),
                                  t.writeShort(r),
                                  t.writeShort(n),
                                  t.writeByte(128),
                                  t.writeByte(0),
                                  t.writeByte(0),
                                  t.writeByte(0),
                                  t.writeByte(0),
                                  t.writeByte(0),
                                  t.writeByte(255),
                                  t.writeByte(255),
                                  t.writeByte(255),
                                  t.writeString(','),
                                  t.writeShort(0),
                                  t.writeShort(0),
                                  t.writeShort(r),
                                  t.writeShort(n),
                                  t.writeByte(0));
                                var e = s(2);
                                t.writeByte(2);
                                for (var i = 0; e.length - i > 255; )
                                  (t.writeByte(255), t.writeBytes(e, i, 255), (i += 255));
                                (t.writeByte(e.length - i),
                                  t.writeBytes(e, i, e.length - i),
                                  t.writeByte(0),
                                  t.writeString(';'));
                              },
                            },
                            s = function (t) {
                              for (var e = 1 << t, r = 1 + (1 << t), n = t + 1, o = a(), s = 0; s < e; s += 1)
                                o.add(String.fromCharCode(s));
                              (o.add(String.fromCharCode(e)), o.add(String.fromCharCode(r)));
                              var h,
                                u,
                                d,
                                f = w(),
                                c =
                                  ((h = f),
                                  (u = 0),
                                  (d = 0),
                                  {
                                    write: function (t, e) {
                                      if (t >>> e != 0) throw 'length over';
                                      for (; u + e >= 8; )
                                        (h.writeByte(255 & ((t << u) | d)),
                                          (e -= 8 - u),
                                          (t >>>= 8 - u),
                                          (d = 0),
                                          (u = 0));
                                      ((d |= t << u), (u += e));
                                    },
                                    flush: function () {
                                      u > 0 && h.writeByte(d);
                                    },
                                  });
                              c.write(e, n);
                              var l = 0,
                                g = String.fromCharCode(i[l]);
                              for (l += 1; l < i.length; ) {
                                var p = String.fromCharCode(i[l]);
                                ((l += 1),
                                  o.contains(g + p)
                                    ? (g += p)
                                    : (c.write(o.indexOf(g), n),
                                      o.size() < 4095 && (o.size() == 1 << n && (n += 1), o.add(g + p)),
                                      (g = p)));
                              }
                              return (c.write(o.indexOf(g), n), c.write(r, n), c.flush(), f.toByteArray());
                            },
                            a = function () {
                              var t = {},
                                e = 0,
                                r = {
                                  add: function (n) {
                                    if (r.contains(n)) throw 'dup key:' + n;
                                    ((t[n] = e), (e += 1));
                                  },
                                  size: function () {
                                    return e;
                                  },
                                  indexOf: function (e) {
                                    return t[e];
                                  },
                                  contains: function (e) {
                                    return void 0 !== t[e];
                                  },
                                };
                              return r;
                            };
                          return o;
                        })(t, e),
                        i = 0;
                      i < e;
                      i += 1
                    )
                      for (var o = 0; o < t; o += 1) n.setPixel(o, i, r(o, i));
                    var s = w();
                    n.write(s);
                    for (
                      var a = (function () {
                          var t = 0,
                            e = 0,
                            r = 0,
                            n = '',
                            i = {},
                            o = function (t) {
                              n += String.fromCharCode(s(63 & t));
                            },
                            s = function (t) {
                              if (t < 0);
                              else {
                                if (t < 26) return 65 + t;
                                if (t < 52) return t - 26 + 97;
                                if (t < 62) return t - 52 + 48;
                                if (62 == t) return 43;
                                if (63 == t) return 47;
                              }
                              throw 'n:' + t;
                            };
                          return (
                            (i.writeByte = function (n) {
                              for (t = (t << 8) | (255 & n), e += 8, r += 1; e >= 6; ) (o(t >>> (e - 6)), (e -= 6));
                            }),
                            (i.flush = function () {
                              if ((e > 0 && (o(t << (6 - e)), (t = 0), (e = 0)), r % 3 != 0))
                                for (var i = 3 - (r % 3), s = 0; s < i; s += 1) n += '=';
                            }),
                            (i.toString = function () {
                              return n;
                            }),
                            i
                          );
                        })(),
                        h = s.toByteArray(),
                        u = 0;
                      u < h.length;
                      u += 1
                    )
                      a.writeByte(h[u]);
                    return (a.flush(), 'data:image/gif;base64,' + a);
                  };
                return t;
              })();
            ((i.stringToBytesFuncs['UTF-8'] = function (t) {
              return (function (t) {
                for (var e = [], r = 0; r < t.length; r++) {
                  var n = t.charCodeAt(r);
                  n < 128
                    ? e.push(n)
                    : n < 2048
                      ? e.push(192 | (n >> 6), 128 | (63 & n))
                      : n < 55296 || n >= 57344
                        ? e.push(224 | (n >> 12), 128 | ((n >> 6) & 63), 128 | (63 & n))
                        : (r++,
                          (n = 65536 + (((1023 & n) << 10) | (1023 & t.charCodeAt(r)))),
                          e.push(240 | (n >> 18), 128 | ((n >> 12) & 63), 128 | ((n >> 6) & 63), 128 | (63 & n)));
                }
                return e;
              })(t);
            }),
              void 0 ===
                (n =
                  'function' ==
                  typeof (r = function () {
                    return i;
                  })
                    ? r.apply(e, [])
                    : r) || (t.exports = n));
          },
        },
        e = {};

      function r(n) {
        var i = e[n];
        if (void 0 !== i) return i.exports;
        var o = (e[n] = { exports: {} });
        return (t[n](o, o.exports, r), o.exports);
      }

      ((r.n = (t) => {
        var e = t && t.__esModule ? () => t.default : () => t;
        return (r.d(e, { a: e }), e);
      }),
        (r.d = (t, e) => {
          for (var n in e) r.o(e, n) && !r.o(t, n) && Object.defineProperty(t, n, { enumerable: !0, get: e[n] });
        }),
        (r.o = (t, e) => Object.prototype.hasOwnProperty.call(t, e)));
      var n = {};
      return (
        (() => {
          r.d(n, { default: () => O });
          const t = (t) => !!t && 'object' == typeof t && !Array.isArray(t);

          function e(r, ...n) {
            if (!n.length) return r;
            const i = n.shift();
            return void 0 !== i && t(r) && t(i)
              ? ((r = Object.assign({}, r)),
                Object.keys(i).forEach((n) => {
                  const o = r[n],
                    s = i[n];
                  Array.isArray(o) && Array.isArray(s)
                    ? (r[n] = s)
                    : t(o) && t(s)
                      ? (r[n] = e(Object.assign({}, o), s))
                      : (r[n] = s);
                }),
                e(r, ...n))
              : r;
          }

          function i(t, e) {
            const r = document.createElement('a');
            ((r.download = e), (r.href = t), document.body.appendChild(r), r.click(), document.body.removeChild(r));
          }

          const o = { L: 0.07, M: 0.15, Q: 0.25, H: 0.3 };

          class s {
            constructor({ svg: t, type: e, window: r }) {
              ((this._svg = t), (this._type = e), (this._window = r));
            }

            draw(t, e, r, n) {
              let i;
              switch (this._type) {
                case 'dots':
                  i = this._drawDot;
                  break;
                case 'classy':
                  i = this._drawClassy;
                  break;
                case 'classy-rounded':
                  i = this._drawClassyRounded;
                  break;
                case 'rounded':
                  i = this._drawRounded;
                  break;
                case 'extra-rounded':
                  i = this._drawExtraRounded;
                  break;
                default:
                  i = this._drawSquare;
              }
              i.call(this, { x: t, y: e, size: r, getNeighbor: n });
            }

            _rotateFigure({ x: t, y: e, size: r, rotation: n = 0, draw: i }) {
              var o;
              const s = t + r / 2,
                a = e + r / 2;
              (i(),
                null === (o = this._element) ||
                  void 0 === o ||
                  o.setAttribute('transform', `rotate(${(180 * n) / Math.PI},${s},${a})`));
            }

            _basicDot(t) {
              const { size: e, x: r, y: n } = t;
              this._rotateFigure(
                Object.assign(Object.assign({}, t), {
                  draw: () => {
                    ((this._element = this._window.document.createElementNS('http://www.w3.org/2000/svg', 'circle')),
                      this._element.setAttribute('cx', String(r + e / 2)),
                      this._element.setAttribute('cy', String(n + e / 2)),
                      this._element.setAttribute('r', String(e / 2)));
                  },
                }),
              );
            }

            _basicSquare(t) {
              const { size: e, x: r, y: n } = t;
              this._rotateFigure(
                Object.assign(Object.assign({}, t), {
                  draw: () => {
                    ((this._element = this._window.document.createElementNS('http://www.w3.org/2000/svg', 'rect')),
                      this._element.setAttribute('x', String(r)),
                      this._element.setAttribute('y', String(n)),
                      this._element.setAttribute('width', String(e)),
                      this._element.setAttribute('height', String(e)));
                  },
                }),
              );
            }

            _basicSideRounded(t) {
              const { size: e, x: r, y: n } = t;
              this._rotateFigure(
                Object.assign(Object.assign({}, t), {
                  draw: () => {
                    ((this._element = this._window.document.createElementNS('http://www.w3.org/2000/svg', 'path')),
                      this._element.setAttribute(
                        'd',
                        `M ${r} ${n}v ${e}h ` + e / 2 + `a ${e / 2} ${e / 2}, 0, 0, 0, 0 ${-e}`,
                      ));
                  },
                }),
              );
            }

            _basicCornerRounded(t) {
              const { size: e, x: r, y: n } = t;
              this._rotateFigure(
                Object.assign(Object.assign({}, t), {
                  draw: () => {
                    ((this._element = this._window.document.createElementNS('http://www.w3.org/2000/svg', 'path')),
                      this._element.setAttribute(
                        'd',
                        `M ${r} ${n}v ${e}h ${e}v ` + -e / 2 + `a ${e / 2} ${e / 2}, 0, 0, 0, ${-e / 2} ${-e / 2}`,
                      ));
                  },
                }),
              );
            }

            _basicCornerExtraRounded(t) {
              const { size: e, x: r, y: n } = t;
              this._rotateFigure(
                Object.assign(Object.assign({}, t), {
                  draw: () => {
                    ((this._element = this._window.document.createElementNS('http://www.w3.org/2000/svg', 'path')),
                      this._element.setAttribute('d', `M ${r} ${n}v ${e}h ${e}a ${e} ${e}, 0, 0, 0, ${-e} ${-e}`));
                  },
                }),
              );
            }

            _basicCornersRounded(t) {
              const { size: e, x: r, y: n } = t;
              this._rotateFigure(
                Object.assign(Object.assign({}, t), {
                  draw: () => {
                    ((this._element = this._window.document.createElementNS('http://www.w3.org/2000/svg', 'path')),
                      this._element.setAttribute(
                        'd',
                        `M ${r} ${n}v ` +
                          e / 2 +
                          `a ${e / 2} ${e / 2}, 0, 0, 0, ${e / 2} ${e / 2}h ` +
                          e / 2 +
                          'v ' +
                          -e / 2 +
                          `a ${e / 2} ${e / 2}, 0, 0, 0, ${-e / 2} ${-e / 2}`,
                      ));
                  },
                }),
              );
            }

            _drawDot({ x: t, y: e, size: r }) {
              this._basicDot({ x: t, y: e, size: r, rotation: 0 });
            }

            _drawSquare({ x: t, y: e, size: r }) {
              this._basicSquare({ x: t, y: e, size: r, rotation: 0 });
            }

            _drawRounded({ x: t, y: e, size: r, getNeighbor: n }) {
              const i = n ? +n(-1, 0) : 0,
                o = n ? +n(1, 0) : 0,
                s = n ? +n(0, -1) : 0,
                a = n ? +n(0, 1) : 0,
                h = i + o + s + a;
              if (0 !== h)
                if (h > 2 || (i && o) || (s && a)) this._basicSquare({ x: t, y: e, size: r, rotation: 0 });
                else {
                  if (2 === h) {
                    let n = 0;
                    return (
                      i && s ? (n = Math.PI / 2) : s && o ? (n = Math.PI) : o && a && (n = -Math.PI / 2),
                      void this._basicCornerRounded({
                        x: t,
                        y: e,
                        size: r,
                        rotation: n,
                      })
                    );
                  }
                  if (1 === h) {
                    let n = 0;
                    return (
                      s ? (n = Math.PI / 2) : o ? (n = Math.PI) : a && (n = -Math.PI / 2),
                      void this._basicSideRounded({
                        x: t,
                        y: e,
                        size: r,
                        rotation: n,
                      })
                    );
                  }
                }
              else this._basicDot({ x: t, y: e, size: r, rotation: 0 });
            }

            _drawExtraRounded({ x: t, y: e, size: r, getNeighbor: n }) {
              const i = n ? +n(-1, 0) : 0,
                o = n ? +n(1, 0) : 0,
                s = n ? +n(0, -1) : 0,
                a = n ? +n(0, 1) : 0,
                h = i + o + s + a;
              if (0 !== h)
                if (h > 2 || (i && o) || (s && a)) this._basicSquare({ x: t, y: e, size: r, rotation: 0 });
                else {
                  if (2 === h) {
                    let n = 0;
                    return (
                      i && s ? (n = Math.PI / 2) : s && o ? (n = Math.PI) : o && a && (n = -Math.PI / 2),
                      void this._basicCornerExtraRounded({
                        x: t,
                        y: e,
                        size: r,
                        rotation: n,
                      })
                    );
                  }
                  if (1 === h) {
                    let n = 0;
                    return (
                      s ? (n = Math.PI / 2) : o ? (n = Math.PI) : a && (n = -Math.PI / 2),
                      void this._basicSideRounded({
                        x: t,
                        y: e,
                        size: r,
                        rotation: n,
                      })
                    );
                  }
                }
              else this._basicDot({ x: t, y: e, size: r, rotation: 0 });
            }

            _drawClassy({ x: t, y: e, size: r, getNeighbor: n }) {
              const i = n ? +n(-1, 0) : 0,
                o = n ? +n(1, 0) : 0,
                s = n ? +n(0, -1) : 0,
                a = n ? +n(0, 1) : 0;
              0 !== i + o + s + a
                ? i || s
                  ? o || a
                    ? this._basicSquare({
                        x: t,
                        y: e,
                        size: r,
                        rotation: 0,
                      })
                    : this._basicCornerRounded({ x: t, y: e, size: r, rotation: Math.PI / 2 })
                  : this._basicCornerRounded({
                      x: t,
                      y: e,
                      size: r,
                      rotation: -Math.PI / 2,
                    })
                : this._basicCornersRounded({ x: t, y: e, size: r, rotation: Math.PI / 2 });
            }

            _drawClassyRounded({ x: t, y: e, size: r, getNeighbor: n }) {
              const i = n ? +n(-1, 0) : 0,
                o = n ? +n(1, 0) : 0,
                s = n ? +n(0, -1) : 0,
                a = n ? +n(0, 1) : 0;
              0 !== i + o + s + a
                ? i || s
                  ? o || a
                    ? this._basicSquare({
                        x: t,
                        y: e,
                        size: r,
                        rotation: 0,
                      })
                    : this._basicCornerExtraRounded({
                        x: t,
                        y: e,
                        size: r,
                        rotation: Math.PI / 2,
                      })
                  : this._basicCornerExtraRounded({
                      x: t,
                      y: e,
                      size: r,
                      rotation: -Math.PI / 2,
                    })
                : this._basicCornersRounded({ x: t, y: e, size: r, rotation: Math.PI / 2 });
            }
          }

          const a = { dot: 'dot', square: 'square', extraRounded: 'extra-rounded' },
            h = Object.values(a);

          class u {
            constructor({ svg: t, type: e, window: r }) {
              ((this._svg = t), (this._type = e), (this._window = r));
            }

            draw(t, e, r, n) {
              let i;
              switch (this._type) {
                case a.square:
                  i = this._drawSquare;
                  break;
                case a.extraRounded:
                  i = this._drawExtraRounded;
                  break;
                default:
                  i = this._drawDot;
              }
              i.call(this, { x: t, y: e, size: r, rotation: n });
            }

            _rotateFigure({ x: t, y: e, size: r, rotation: n = 0, draw: i }) {
              var o;
              const s = t + r / 2,
                a = e + r / 2;
              (i(),
                null === (o = this._element) ||
                  void 0 === o ||
                  o.setAttribute('transform', `rotate(${(180 * n) / Math.PI},${s},${a})`));
            }

            _basicDot(t) {
              const { size: e, x: r, y: n } = t,
                i = e / 7;
              this._rotateFigure(
                Object.assign(Object.assign({}, t), {
                  draw: () => {
                    ((this._element = this._window.document.createElementNS('http://www.w3.org/2000/svg', 'path')),
                      this._element.setAttribute('clip-rule', 'evenodd'),
                      this._element.setAttribute(
                        'd',
                        `M ${r + e / 2} ${n}a ${e / 2} ${e / 2} 0 1 0 0.1 0zm 0 ${i}a ${e / 2 - i} ${e / 2 - i} 0 1 1 -0.1 0Z`,
                      ));
                  },
                }),
              );
            }

            _basicSquare(t) {
              const { size: e, x: r, y: n } = t,
                i = e / 7;
              this._rotateFigure(
                Object.assign(Object.assign({}, t), {
                  draw: () => {
                    ((this._element = this._window.document.createElementNS('http://www.w3.org/2000/svg', 'path')),
                      this._element.setAttribute('clip-rule', 'evenodd'),
                      this._element.setAttribute(
                        'd',
                        `M ${r} ${n}v ${e}h ${e}v ` +
                          -e +
                          'z' +
                          `M ${r + i} ${n + i}h ` +
                          (e - 2 * i) +
                          'v ' +
                          (e - 2 * i) +
                          'h ' +
                          (2 * i - e) +
                          'z',
                      ));
                  },
                }),
              );
            }

            _basicExtraRounded(t) {
              const { size: e, x: r, y: n } = t,
                i = e / 7;
              this._rotateFigure(
                Object.assign(Object.assign({}, t), {
                  draw: () => {
                    ((this._element = this._window.document.createElementNS('http://www.w3.org/2000/svg', 'path')),
                      this._element.setAttribute('clip-rule', 'evenodd'),
                      this._element.setAttribute(
                        'd',
                        `M ${r} ${n + 2.5 * i}v ` +
                          2 * i +
                          `a ${2.5 * i} ${2.5 * i}, 0, 0, 0, ${2.5 * i} ${2.5 * i}h ` +
                          2 * i +
                          `a ${2.5 * i} ${2.5 * i}, 0, 0, 0, ${2.5 * i} ${2.5 * -i}v ` +
                          -2 * i +
                          `a ${2.5 * i} ${2.5 * i}, 0, 0, 0, ${2.5 * -i} ${2.5 * -i}h ` +
                          -2 * i +
                          `a ${2.5 * i} ${2.5 * i}, 0, 0, 0, ${2.5 * -i} ${2.5 * i}` +
                          `M ${r + 2.5 * i} ${n + i}h ` +
                          2 * i +
                          `a ${1.5 * i} ${1.5 * i}, 0, 0, 1, ${1.5 * i} ${1.5 * i}v ` +
                          2 * i +
                          `a ${1.5 * i} ${1.5 * i}, 0, 0, 1, ${1.5 * -i} ${1.5 * i}h ` +
                          -2 * i +
                          `a ${1.5 * i} ${1.5 * i}, 0, 0, 1, ${1.5 * -i} ${1.5 * -i}v ` +
                          -2 * i +
                          `a ${1.5 * i} ${1.5 * i}, 0, 0, 1, ${1.5 * i} ${1.5 * -i}`,
                      ));
                  },
                }),
              );
            }

            _drawDot({ x: t, y: e, size: r, rotation: n }) {
              this._basicDot({ x: t, y: e, size: r, rotation: n });
            }

            _drawSquare({ x: t, y: e, size: r, rotation: n }) {
              this._basicSquare({ x: t, y: e, size: r, rotation: n });
            }

            _drawExtraRounded({ x: t, y: e, size: r, rotation: n }) {
              this._basicExtraRounded({ x: t, y: e, size: r, rotation: n });
            }
          }

          const d = { dot: 'dot', square: 'square' },
            f = Object.values(d);

          class c {
            constructor({ svg: t, type: e, window: r }) {
              ((this._svg = t), (this._type = e), (this._window = r));
            }

            draw(t, e, r, n) {
              let i;
              ((i = this._type === d.square ? this._drawSquare : this._drawDot),
                i.call(this, {
                  x: t,
                  y: e,
                  size: r,
                  rotation: n,
                }));
            }

            _rotateFigure({ x: t, y: e, size: r, rotation: n = 0, draw: i }) {
              var o;
              const s = t + r / 2,
                a = e + r / 2;
              (i(),
                null === (o = this._element) ||
                  void 0 === o ||
                  o.setAttribute('transform', `rotate(${(180 * n) / Math.PI},${s},${a})`));
            }

            _basicDot(t) {
              const { size: e, x: r, y: n } = t;
              this._rotateFigure(
                Object.assign(Object.assign({}, t), {
                  draw: () => {
                    ((this._element = this._window.document.createElementNS('http://www.w3.org/2000/svg', 'circle')),
                      this._element.setAttribute('cx', String(r + e / 2)),
                      this._element.setAttribute('cy', String(n + e / 2)),
                      this._element.setAttribute('r', String(e / 2)));
                  },
                }),
              );
            }

            _basicSquare(t) {
              const { size: e, x: r, y: n } = t;
              this._rotateFigure(
                Object.assign(Object.assign({}, t), {
                  draw: () => {
                    ((this._element = this._window.document.createElementNS('http://www.w3.org/2000/svg', 'rect')),
                      this._element.setAttribute('x', String(r)),
                      this._element.setAttribute('y', String(n)),
                      this._element.setAttribute('width', String(e)),
                      this._element.setAttribute('height', String(e)));
                  },
                }),
              );
            }

            _drawDot({ x: t, y: e, size: r, rotation: n }) {
              this._basicDot({ x: t, y: e, size: r, rotation: n });
            }

            _drawSquare({ x: t, y: e, size: r, rotation: n }) {
              this._basicSquare({ x: t, y: e, size: r, rotation: n });
            }
          }

          const l = 'circle',
            p = [
              [1, 1, 1, 1, 1, 1, 1],
              [1, 0, 0, 0, 0, 0, 1],
              [1, 0, 0, 0, 0, 0, 1],
              [1, 0, 0, 0, 0, 0, 1],
              [1, 0, 0, 0, 0, 0, 1],
              [1, 0, 0, 0, 0, 0, 1],
              [1, 1, 1, 1, 1, 1, 1],
            ],
            w = [
              [0, 0, 0, 0, 0, 0, 0],
              [0, 0, 0, 0, 0, 0, 0],
              [0, 0, 1, 1, 1, 0, 0],
              [0, 0, 1, 1, 1, 0, 0],
              [0, 0, 1, 1, 1, 0, 0],
              [0, 0, 0, 0, 0, 0, 0],
              [0, 0, 0, 0, 0, 0, 0],
            ];

          class v {
            constructor(t, e) {
              ((this._roundSize = (t) => (this._options.dotsOptions.roundSize ? Math.floor(t) : t)),
                (this._window = e),
                (this._element = this._window.document.createElementNS('http://www.w3.org/2000/svg', 'svg')),
                this._element.setAttribute('width', String(t.width)),
                this._element.setAttribute('height', String(t.height)),
                this._element.setAttribute('xmlns:xlink', 'http://www.w3.org/1999/xlink'),
                t.dotsOptions.roundSize || this._element.setAttribute('shape-rendering', 'crispEdges'),
                this._element.setAttribute('viewBox', `0 0 ${t.width} ${t.height}`),
                (this._defs = this._window.document.createElementNS('http://www.w3.org/2000/svg', 'defs')),
                this._element.appendChild(this._defs),
                (this._imageUri = t.image),
                (this._instanceId = v.instanceCount++),
                (this._options = t));
            }

            get width() {
              return this._options.width;
            }

            get height() {
              return this._options.height;
            }

            getElement() {
              return this._element;
            }

            async drawQR(t) {
              const e = t.getModuleCount(),
                r = Math.min(this._options.width, this._options.height) - 2 * this._options.margin,
                n = this._options.shape === l ? r / Math.sqrt(2) : r,
                i = this._roundSize(n / e);
              let s = { hideXDots: 0, hideYDots: 0, width: 0, height: 0 };
              if (((this._qr = t), this._options.image)) {
                if ((await this.loadImage(), !this._image)) return;
                const { imageOptions: t, qrOptions: r } = this._options,
                  n = t.imageSize * o[r.errorCorrectionLevel],
                  a = Math.floor(n * e * e);
                s = (function ({
                  originalHeight: t,
                  originalWidth: e,
                  maxHiddenDots: r,
                  maxHiddenAxisDots: n,
                  dotSize: i,
                }) {
                  const o = { x: 0, y: 0 },
                    s = { x: 0, y: 0 };
                  if (t <= 0 || e <= 0 || r <= 0 || i <= 0) return { height: 0, width: 0, hideYDots: 0, hideXDots: 0 };
                  const a = t / e;
                  return (
                    (o.x = Math.floor(Math.sqrt(r / a))),
                    o.x <= 0 && (o.x = 1),
                    n && n < o.x && (o.x = n),
                    o.x % 2 == 0 && o.x--,
                    (s.x = o.x * i),
                    (o.y = 1 + 2 * Math.ceil((o.x * a - 1) / 2)),
                    (s.y = Math.round(s.x * a)),
                    (o.y * o.x > r || (n && n < o.y)) &&
                      (n && n < o.y ? ((o.y = n), o.y % 2 == 0 && o.x--) : (o.y -= 2),
                      (s.y = o.y * i),
                      (o.x = 1 + 2 * Math.ceil((o.y / a - 1) / 2)),
                      (s.x = Math.round(s.y / a))),
                    {
                      height: s.y,
                      width: s.x,
                      hideYDots: o.y,
                      hideXDots: o.x,
                    }
                  );
                })({
                  originalWidth: this._image.width,
                  originalHeight: this._image.height,
                  maxHiddenDots: a,
                  maxHiddenAxisDots: e - 14,
                  dotSize: i,
                });
              }
              (this.drawBackground(),
                this.drawDots((t, r) => {
                  var n, i, o, a, h, u;
                  return !(
                    (this._options.imageOptions.hideBackgroundDots &&
                      t >= (e - s.hideYDots) / 2 &&
                      t < (e + s.hideYDots) / 2 &&
                      r >= (e - s.hideXDots) / 2 &&
                      r < (e + s.hideXDots) / 2) ||
                    (null === (n = p[t]) || void 0 === n ? void 0 : n[r]) ||
                    (null === (i = p[t - e + 7]) || void 0 === i ? void 0 : i[r]) ||
                    (null === (o = p[t]) || void 0 === o ? void 0 : o[r - e + 7]) ||
                    (null === (a = w[t]) || void 0 === a ? void 0 : a[r]) ||
                    (null === (h = w[t - e + 7]) || void 0 === h ? void 0 : h[r]) ||
                    (null === (u = w[t]) || void 0 === u ? void 0 : u[r - e + 7])
                  );
                }),
                this.drawCorners(),
                this._options.image &&
                  (await this.drawImage({
                    width: s.width,
                    height: s.height,
                    count: e,
                    dotSize: i,
                  })));
            }

            drawBackground() {
              var t, e, r;
              const n = this._element,
                i = this._options;
              if (n) {
                const n = null === (t = i.backgroundOptions) || void 0 === t ? void 0 : t.gradient,
                  o = null === (e = i.backgroundOptions) || void 0 === e ? void 0 : e.color;
                let s = i.height,
                  a = i.width;
                if (n || o) {
                  const t = this._window.document.createElementNS('http://www.w3.org/2000/svg', 'rect');
                  ((this._backgroundClipPath = this._window.document.createElementNS(
                    'http://www.w3.org/2000/svg',
                    'clipPath',
                  )),
                    this._backgroundClipPath.setAttribute('id', `clip-path-background-color-${this._instanceId}`),
                    this._defs.appendChild(this._backgroundClipPath),
                    (null === (r = i.backgroundOptions) || void 0 === r ? void 0 : r.round) &&
                      ((s = a = Math.min(i.width, i.height)),
                      t.setAttribute('rx', String((s / 2) * i.backgroundOptions.round))),
                    t.setAttribute('x', String(this._roundSize((i.width - a) / 2))),
                    t.setAttribute('y', String(this._roundSize((i.height - s) / 2))),
                    t.setAttribute('width', String(a)),
                    t.setAttribute('height', String(s)),
                    this._backgroundClipPath.appendChild(t),
                    this._createColor({
                      options: n,
                      color: o,
                      additionalRotation: 0,
                      x: 0,
                      y: 0,
                      height: i.height,
                      width: i.width,
                      name: `background-color-${this._instanceId}`,
                    }));
                }
              }
            }

            drawDots(t) {
              var e, r;
              if (!this._qr) throw 'QR code is not defined';
              const n = this._options,
                i = this._qr.getModuleCount();
              if (i > n.width || i > n.height) throw 'The canvas is too small.';
              const o = Math.min(n.width, n.height) - 2 * n.margin,
                a = n.shape === l ? o / Math.sqrt(2) : o,
                h = this._roundSize(a / i),
                u = this._roundSize((n.width - i * h) / 2),
                d = this._roundSize((n.height - i * h) / 2),
                f = new s({ svg: this._element, type: n.dotsOptions.type, window: this._window });
              ((this._dotsClipPath = this._window.document.createElementNS('http://www.w3.org/2000/svg', 'clipPath')),
                this._dotsClipPath.setAttribute('id', `clip-path-dot-color-${this._instanceId}`),
                this._defs.appendChild(this._dotsClipPath),
                this._createColor({
                  options: null === (e = n.dotsOptions) || void 0 === e ? void 0 : e.gradient,
                  color: n.dotsOptions.color,
                  additionalRotation: 0,
                  x: 0,
                  y: 0,
                  height: n.height,
                  width: n.width,
                  name: `dot-color-${this._instanceId}`,
                }));
              for (let e = 0; e < i; e++)
                for (let n = 0; n < i; n++)
                  (t && !t(e, n)) ||
                    ((null === (r = this._qr) || void 0 === r ? void 0 : r.isDark(e, n)) &&
                      (f.draw(
                        u + n * h,
                        d + e * h,
                        h,
                        (r, o) =>
                          !(n + r < 0 || e + o < 0 || n + r >= i || e + o >= i) &&
                          !(t && !t(e + o, n + r)) &&
                          !!this._qr &&
                          this._qr.isDark(e + o, n + r),
                      ),
                      f._element && this._dotsClipPath && this._dotsClipPath.appendChild(f._element)));
              if (n.shape === l) {
                const t = this._roundSize((o / h - i) / 2),
                  e = i + 2 * t,
                  r = u - t * h,
                  n = d - t * h,
                  s = [],
                  a = this._roundSize(e / 2);
                for (let r = 0; r < e; r++) {
                  s[r] = [];
                  for (let n = 0; n < e; n++)
                    (r >= t - 1 && r <= e - t && n >= t - 1 && n <= e - t) ||
                    Math.sqrt((r - a) * (r - a) + (n - a) * (n - a)) > a
                      ? (s[r][n] = 0)
                      : (s[r][n] = this._qr.isDark(
                          n - 2 * t < 0 ? n : n >= i ? n - 2 * t : n - t,
                          r - 2 * t < 0 ? r : r >= i ? r - 2 * t : r - t,
                        )
                          ? 1
                          : 0);
                }
                for (let t = 0; t < e; t++)
                  for (let i = 0; i < e; i++)
                    s[t][i] &&
                      (f.draw(r + i * h, n + t * h, h, (e, r) => {
                        var n;
                        return !!(null === (n = s[t + r]) || void 0 === n ? void 0 : n[i + e]);
                      }),
                      f._element && this._dotsClipPath && this._dotsClipPath.appendChild(f._element));
              }
            }

            drawCorners() {
              if (!this._qr) throw 'QR code is not defined';
              const t = this._element,
                e = this._options;
              if (!t) throw 'Element code is not defined';
              const r = this._qr.getModuleCount(),
                n = Math.min(e.width, e.height) - 2 * e.margin,
                i = e.shape === l ? n / Math.sqrt(2) : n,
                o = this._roundSize(i / r),
                a = 7 * o,
                d = 3 * o,
                g = this._roundSize((e.width - r * o) / 2),
                v = this._roundSize((e.height - r * o) / 2);
              [
                [0, 0, 0],
                [1, 0, Math.PI / 2],
                [0, 1, -Math.PI / 2],
              ].forEach(([t, n, i]) => {
                var l, _, y, m, b, A, S, x, C, E, M, O, P, R;
                const B = g + t * o * (r - 7),
                  $ = v + n * o * (r - 7);
                let D = this._dotsClipPath,
                  I = this._dotsClipPath;
                if (
                  (((null === (l = e.cornersSquareOptions) || void 0 === l ? void 0 : l.gradient) ||
                    (null === (_ = e.cornersSquareOptions) || void 0 === _ ? void 0 : _.color)) &&
                    ((D = this._window.document.createElementNS('http://www.w3.org/2000/svg', 'clipPath')),
                    D.setAttribute('id', `clip-path-corners-square-color-${t}-${n}-${this._instanceId}`),
                    this._defs.appendChild(D),
                    (this._cornersSquareClipPath = this._cornersDotClipPath = I = D),
                    this._createColor({
                      options: null === (y = e.cornersSquareOptions) || void 0 === y ? void 0 : y.gradient,
                      color: null === (m = e.cornersSquareOptions) || void 0 === m ? void 0 : m.color,
                      additionalRotation: i,
                      x: B,
                      y: $,
                      height: a,
                      width: a,
                      name: `corners-square-color-${t}-${n}-${this._instanceId}`,
                    })),
                  (null === (b = e.cornersSquareOptions) || void 0 === b ? void 0 : b.type) &&
                    h.includes(e.cornersSquareOptions.type))
                ) {
                  const t = new u({ svg: this._element, type: e.cornersSquareOptions.type, window: this._window });
                  (t.draw(B, $, a, i), t._element && D && D.appendChild(t._element));
                } else {
                  const t = new s({
                    svg: this._element,
                    type:
                      (null === (A = e.cornersSquareOptions) || void 0 === A ? void 0 : A.type) || e.dotsOptions.type,
                    window: this._window,
                  });
                  for (let e = 0; e < p.length; e++)
                    for (let r = 0; r < p[e].length; r++)
                      (null === (S = p[e]) || void 0 === S ? void 0 : S[r]) &&
                        (t.draw(B + r * o, $ + e * o, o, (t, n) => {
                          var i;
                          return !!(null === (i = p[e + n]) || void 0 === i ? void 0 : i[r + t]);
                        }),
                        t._element && D && D.appendChild(t._element));
                }
                if (
                  (((null === (x = e.cornersDotOptions) || void 0 === x ? void 0 : x.gradient) ||
                    (null === (C = e.cornersDotOptions) || void 0 === C ? void 0 : C.color)) &&
                    ((I = this._window.document.createElementNS('http://www.w3.org/2000/svg', 'clipPath')),
                    I.setAttribute('id', `clip-path-corners-dot-color-${t}-${n}-${this._instanceId}`),
                    this._defs.appendChild(I),
                    (this._cornersDotClipPath = I),
                    this._createColor({
                      options: null === (E = e.cornersDotOptions) || void 0 === E ? void 0 : E.gradient,
                      color: null === (M = e.cornersDotOptions) || void 0 === M ? void 0 : M.color,
                      additionalRotation: i,
                      x: B + 2 * o,
                      y: $ + 2 * o,
                      height: d,
                      width: d,
                      name: `corners-dot-color-${t}-${n}-${this._instanceId}`,
                    })),
                  (null === (O = e.cornersDotOptions) || void 0 === O ? void 0 : O.type) &&
                    f.includes(e.cornersDotOptions.type))
                ) {
                  const t = new c({ svg: this._element, type: e.cornersDotOptions.type, window: this._window });
                  (t.draw(B + 2 * o, $ + 2 * o, d, i), t._element && I && I.appendChild(t._element));
                } else {
                  const t = new s({
                    svg: this._element,
                    type: (null === (P = e.cornersDotOptions) || void 0 === P ? void 0 : P.type) || e.dotsOptions.type,
                    window: this._window,
                  });
                  for (let e = 0; e < w.length; e++)
                    for (let r = 0; r < w[e].length; r++)
                      (null === (R = w[e]) || void 0 === R ? void 0 : R[r]) &&
                        (t.draw(B + r * o, $ + e * o, o, (t, n) => {
                          var i;
                          return !!(null === (i = w[e + n]) || void 0 === i ? void 0 : i[r + t]);
                        }),
                        t._element && I && I.appendChild(t._element));
                }
              });
            }

            loadImage() {
              return new Promise((t, e) => {
                var r;
                const n = this._options;
                if (!n.image) return e('Image is not defined');
                if (null === (r = n.nodeCanvas) || void 0 === r ? void 0 : r.loadImage)
                  n.nodeCanvas
                    .loadImage(n.image)
                    .then((e) => {
                      var r, i;
                      if (((this._image = e), this._options.imageOptions.saveAsBlob)) {
                        const t =
                          null === (r = n.nodeCanvas) || void 0 === r
                            ? void 0
                            : r.createCanvas(this._image.width, this._image.height);
                        (null === (i = null == t ? void 0 : t.getContext('2d')) || void 0 === i || i.drawImage(e, 0, 0),
                          (this._imageUri = null == t ? void 0 : t.toDataURL()));
                      }
                      t();
                    })
                    .catch(e);
                else {
                  const e = new this._window.Image();
                  ('string' == typeof n.imageOptions.crossOrigin && (e.crossOrigin = n.imageOptions.crossOrigin),
                    (this._image = e),
                    (e.onload = async () => {
                      (this._options.imageOptions.saveAsBlob &&
                        (this._imageUri = await (async function (t, e) {
                          return new Promise((r) => {
                            const n = new e.XMLHttpRequest();
                            ((n.onload = function () {
                              const t = new e.FileReader();
                              ((t.onloadend = function () {
                                r(t.result);
                              }),
                                t.readAsDataURL(n.response));
                            }),
                              n.open('GET', t),
                              (n.responseType = 'blob'),
                              n.send());
                          });
                        })(n.image || '', this._window)),
                        t());
                    }),
                    (e.src = n.image));
                }
              });
            }

            async drawImage({ width: t, height: e, count: r, dotSize: n }) {
              const i = this._options,
                o = this._roundSize((i.width - r * n) / 2),
                s = this._roundSize((i.height - r * n) / 2),
                a = o + this._roundSize(i.imageOptions.margin + (r * n - t) / 2),
                h = s + this._roundSize(i.imageOptions.margin + (r * n - e) / 2),
                u = t - 2 * i.imageOptions.margin,
                d = e - 2 * i.imageOptions.margin,
                f = this._window.document.createElementNS('http://www.w3.org/2000/svg', 'image');
              (f.setAttribute('href', this._imageUri || ''),
                f.setAttribute('xlink:href', this._imageUri || ''),
                f.setAttribute('x', String(a)),
                f.setAttribute('y', String(h)),
                f.setAttribute('width', `${u}px`),
                f.setAttribute('height', `${d}px`),
                this._element.appendChild(f));
            }

            _createColor({ options: t, color: e, additionalRotation: r, x: n, y: i, height: o, width: s, name: a }) {
              const h = s > o ? s : o,
                u = this._window.document.createElementNS('http://www.w3.org/2000/svg', 'rect');
              if (
                (u.setAttribute('x', String(n)),
                u.setAttribute('y', String(i)),
                u.setAttribute('height', String(o)),
                u.setAttribute('width', String(s)),
                u.setAttribute('clip-path', `url('#clip-path-${a}')`),
                t)
              ) {
                let e;
                if ('radial' === t.type)
                  ((e = this._window.document.createElementNS('http://www.w3.org/2000/svg', 'radialGradient')),
                    e.setAttribute('id', a),
                    e.setAttribute('gradientUnits', 'userSpaceOnUse'),
                    e.setAttribute('fx', String(n + s / 2)),
                    e.setAttribute('fy', String(i + o / 2)),
                    e.setAttribute('cx', String(n + s / 2)),
                    e.setAttribute('cy', String(i + o / 2)),
                    e.setAttribute('r', String(h / 2)));
                else {
                  const h = ((t.rotation || 0) + r) % (2 * Math.PI),
                    u = (h + 2 * Math.PI) % (2 * Math.PI);
                  let d = n + s / 2,
                    f = i + o / 2,
                    c = n + s / 2,
                    l = i + o / 2;
                  ((u >= 0 && u <= 0.25 * Math.PI) || (u > 1.75 * Math.PI && u <= 2 * Math.PI)
                    ? ((d -= s / 2), (f -= (o / 2) * Math.tan(h)), (c += s / 2), (l += (o / 2) * Math.tan(h)))
                    : u > 0.25 * Math.PI && u <= 0.75 * Math.PI
                      ? ((f -= o / 2), (d -= s / 2 / Math.tan(h)), (l += o / 2), (c += s / 2 / Math.tan(h)))
                      : u > 0.75 * Math.PI && u <= 1.25 * Math.PI
                        ? ((d += s / 2), (f += (o / 2) * Math.tan(h)), (c -= s / 2), (l -= (o / 2) * Math.tan(h)))
                        : u > 1.25 * Math.PI &&
                          u <= 1.75 * Math.PI &&
                          ((f += o / 2), (d += s / 2 / Math.tan(h)), (l -= o / 2), (c -= s / 2 / Math.tan(h))),
                    (e = this._window.document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient')),
                    e.setAttribute('id', a),
                    e.setAttribute('gradientUnits', 'userSpaceOnUse'),
                    e.setAttribute('x1', String(Math.round(d))),
                    e.setAttribute('y1', String(Math.round(f))),
                    e.setAttribute('x2', String(Math.round(c))),
                    e.setAttribute('y2', String(Math.round(l))));
                }
                (t.colorStops.forEach(({ offset: t, color: r }) => {
                  const n = this._window.document.createElementNS('http://www.w3.org/2000/svg', 'stop');
                  (n.setAttribute('offset', 100 * t + '%'), n.setAttribute('stop-color', r), e.appendChild(n));
                }),
                  u.setAttribute('fill', `url('#${a}')`),
                  this._defs.appendChild(e));
              } else e && u.setAttribute('fill', e);
              this._element.appendChild(u);
            }
          }

          v.instanceCount = 0;
          const _ = v,
            y = 'canvas',
            m = {};
          for (let t = 0; t <= 40; t++) m[t] = t;
          const b = {
            type: y,
            shape: 'square',
            width: 300,
            height: 300,
            data: '',
            margin: 0,
            qrOptions: { typeNumber: m[0], mode: void 0, errorCorrectionLevel: 'Q' },
            imageOptions: { saveAsBlob: !0, hideBackgroundDots: !0, imageSize: 0.4, crossOrigin: void 0, margin: 0 },
            dotsOptions: { type: 'square', color: '#000', roundSize: !0 },
            backgroundOptions: { round: 0, color: '#fff' },
          };

          function A(t) {
            const e = Object.assign({}, t);
            if (!e.colorStops || !e.colorStops.length) throw "Field 'colorStops' is required in gradient";
            return (
              e.rotation ? (e.rotation = Number(e.rotation)) : (e.rotation = 0),
              (e.colorStops = e.colorStops.map((t) =>
                Object.assign(Object.assign({}, t), { offset: Number(t.offset) }),
              )),
              e
            );
          }

          function S(t) {
            const e = Object.assign({}, t);
            return (
              (e.width = Number(e.width)),
              (e.height = Number(e.height)),
              (e.margin = Number(e.margin)),
              (e.imageOptions = Object.assign(Object.assign({}, e.imageOptions), {
                hideBackgroundDots: Boolean(e.imageOptions.hideBackgroundDots),
                imageSize: Number(e.imageOptions.imageSize),
                margin: Number(e.imageOptions.margin),
              })),
              e.margin > Math.min(e.width, e.height) && (e.margin = Math.min(e.width, e.height)),
              (e.dotsOptions = Object.assign({}, e.dotsOptions)),
              e.dotsOptions.gradient && (e.dotsOptions.gradient = A(e.dotsOptions.gradient)),
              e.cornersSquareOptions &&
                ((e.cornersSquareOptions = Object.assign({}, e.cornersSquareOptions)),
                e.cornersSquareOptions.gradient &&
                  (e.cornersSquareOptions.gradient = A(e.cornersSquareOptions.gradient))),
              e.cornersDotOptions &&
                ((e.cornersDotOptions = Object.assign({}, e.cornersDotOptions)),
                e.cornersDotOptions.gradient && (e.cornersDotOptions.gradient = A(e.cornersDotOptions.gradient))),
              e.backgroundOptions &&
                ((e.backgroundOptions = Object.assign({}, e.backgroundOptions)),
                e.backgroundOptions.gradient && (e.backgroundOptions.gradient = A(e.backgroundOptions.gradient))),
              e
            );
          }

          var x = r(873),
            C = r.n(x);

          function E(t) {
            if (!t) throw new Error('Extension must be defined');
            '.' === t[0] && (t = t.substring(1));
            const e = {
              bmp: 'image/bmp',
              gif: 'image/gif',
              ico: 'image/vnd.microsoft.icon',
              jpeg: 'image/jpeg',
              jpg: 'image/jpeg',
              png: 'image/png',
              svg: 'image/svg+xml',
              tif: 'image/tiff',
              tiff: 'image/tiff',
              webp: 'image/webp',
              pdf: 'application/pdf',
            }[t.toLowerCase()];
            if (!e) throw new Error(`Extension "${t}" is not supported`);
            return e;
          }

          class M {
            constructor(t) {
              ((null == t ? void 0 : t.jsdom)
                ? (this._window = new t.jsdom('', { resources: 'usable' }).window)
                : (this._window = window),
                (this._options = t ? S(e(b, t)) : b),
                this.update());
            }

            static _clearContainer(t) {
              t && (t.innerHTML = '');
            }

            _setupSvg() {
              if (!this._qr) return;
              const t = new _(this._options, this._window);
              ((this._svg = t.getElement()),
                (this._svgDrawingPromise = t.drawQR(this._qr).then(() => {
                  var e;
                  this._svg &&
                    (null === (e = this._extension) || void 0 === e || e.call(this, t.getElement(), this._options));
                })));
            }

            _setupCanvas() {
              var t, e;
              this._qr &&
                ((null === (t = this._options.nodeCanvas) || void 0 === t ? void 0 : t.createCanvas)
                  ? ((this._nodeCanvas = this._options.nodeCanvas.createCanvas(
                      this._options.width,
                      this._options.height,
                    )),
                    (this._nodeCanvas.width = this._options.width),
                    (this._nodeCanvas.height = this._options.height))
                  : ((this._domCanvas = document.createElement('canvas')),
                    (this._domCanvas.width = this._options.width),
                    (this._domCanvas.height = this._options.height)),
                this._setupSvg(),
                (this._canvasDrawingPromise =
                  null === (e = this._svgDrawingPromise) || void 0 === e
                    ? void 0
                    : e.then(() => {
                        var t;
                        if (!this._svg) return;
                        const e = this._svg,
                          r = new this._window.XMLSerializer().serializeToString(e),
                          n = btoa(r),
                          i = `data:${E('svg')};base64,${n}`;
                        if (null === (t = this._options.nodeCanvas) || void 0 === t ? void 0 : t.loadImage)
                          return this._options.nodeCanvas.loadImage(i).then((t) => {
                            var e, r;
                            ((t.width = this._options.width),
                              (t.height = this._options.height),
                              null ===
                                (r = null === (e = this._nodeCanvas) || void 0 === e ? void 0 : e.getContext('2d')) ||
                                void 0 === r ||
                                r.drawImage(t, 0, 0));
                          });
                        {
                          const t = new this._window.Image();
                          return new Promise((e) => {
                            ((t.onload = () => {
                              var r, n;
                              (null ===
                                (n = null === (r = this._domCanvas) || void 0 === r ? void 0 : r.getContext('2d')) ||
                                void 0 === n ||
                                n.drawImage(t, 0, 0),
                                e());
                            }),
                              (t.src = i));
                          });
                        }
                      })));
            }

            async _getElement(t = 'png') {
              if (!this._qr) throw 'QR code is empty';
              return 'svg' === t.toLowerCase()
                ? ((this._svg && this._svgDrawingPromise) || this._setupSvg(), await this._svgDrawingPromise, this._svg)
                : (((this._domCanvas || this._nodeCanvas) && this._canvasDrawingPromise) || this._setupCanvas(),
                  await this._canvasDrawingPromise,
                  this._domCanvas || this._nodeCanvas);
            }

            update(t) {
              (M._clearContainer(this._container),
                (this._options = t ? S(e(this._options, t)) : this._options),
                this._options.data &&
                  ((this._qr = C()(this._options.qrOptions.typeNumber, this._options.qrOptions.errorCorrectionLevel)),
                  this._qr.addData(
                    this._options.data,
                    this._options.qrOptions.mode ||
                      (function (t) {
                        switch (!0) {
                          case /^[0-9]*$/.test(t):
                            return 'Numeric';
                          case /^[0-9A-Z $%*+\-./:]*$/.test(t):
                            return 'Alphanumeric';
                          default:
                            return 'Byte';
                        }
                      })(this._options.data),
                  ),
                  this._qr.make(),
                  this._options.type === y ? this._setupCanvas() : this._setupSvg(),
                  this.append(this._container)));
            }

            append(t) {
              if (t) {
                if ('function' != typeof t.appendChild) throw 'Container should be a single DOM node';
                (this._options.type === y
                  ? this._domCanvas && t.appendChild(this._domCanvas)
                  : this._svg && t.appendChild(this._svg),
                  (this._container = t));
              }
            }

            applyExtension(t) {
              if (!t) throw 'Extension function should be defined.';
              ((this._extension = t), this.update());
            }

            deleteExtension() {
              ((this._extension = void 0), this.update());
            }

            async getRawData(t = 'png') {
              if (!this._qr) throw 'QR code is empty';
              const e = await this._getElement(t),
                r = E(t);
              if (!e) return null;
              if ('svg' === t.toLowerCase()) {
                const t = `<?xml version="1.0" standalone="no"?>\r\n${new this._window.XMLSerializer().serializeToString(e)}`;
                return 'undefined' == typeof Blob || this._options.jsdom ? g.from(t) : new Blob([t], { type: r });
              }
              return new Promise((t) => {
                const n = e;
                if ('toBuffer' in n)
                  if ('image/png' === r) t(n.toBuffer(r));
                  else if ('image/jpeg' === r) t(n.toBuffer(r));
                  else {
                    if ('application/pdf' !== r) throw Error('Unsupported extension');
                    t(n.toBuffer(r));
                  }
                else 'toBlob' in n && n.toBlob(t, r, 1);
              });
            }

            async download(t) {
              if (!this._qr) throw 'QR code is empty';
              if ('undefined' == typeof Blob) throw 'Cannot download in Node.js, call getRawData instead.';
              let e = 'png',
                r = 'qr';
              'string' == typeof t
                ? ((e = t),
                  console.warn(
                    "Extension is deprecated as argument for 'download' method, please pass object { name: '...', extension: '...' } as argument",
                  ))
                : 'object' == typeof t && null !== t && (t.name && (r = t.name), t.extension && (e = t.extension));
              const n = await this._getElement(e);
              if (n)
                if ('svg' === e.toLowerCase()) {
                  let t = new XMLSerializer().serializeToString(n);
                  ((t = '<?xml version="1.0" standalone="no"?>\r\n' + t),
                    i(`data:${E(e)};charset=utf-8,${encodeURIComponent(t)}`, `${r}.svg`));
                } else i(n.toDataURL(E(e)), `${r}.${e}`);
            }
          }

          const O = M;
        })(),
        n.default
      );
    })())());
export { K as default };
