var rt = !1,
  nt = !1,
  U = [],
  it = -1;
function Vt(e) {
  On(e);
}
function On(e) {
  (U.includes(e) || U.push(e), Cn());
}
function Ee(e) {
  let t = U.indexOf(e);
  t !== -1 && t > it && U.splice(t, 1);
}
function Cn() {
  !nt && !rt && ((rt = !0), queueMicrotask(Tn));
}
function Tn() {
  ((rt = !1), (nt = !0));
  for (let e = 0; e < U.length; e++) (U[e](), (it = e));
  ((U.length = 0), (it = -1), (nt = !1));
}
var R,
  D,
  L,
  st,
  ot = !0;
function qt(e) {
  ((ot = !1), e(), (ot = !0));
}
function Ut(e) {
  ((R = e.reactive),
    (L = e.release),
    (D = (t) =>
      e.effect(t, {
        scheduler: (r) => {
          ot ? Vt(r) : r();
        },
      })),
    (st = e.raw));
}
function at(e) {
  D = e;
}
function Wt(e) {
  let t = () => {};
  return [
    (n) => {
      let i = D(n);
      return (
        e._x_effects ||
          ((e._x_effects = new Set()),
          (e._x_runEffects = () => {
            e._x_effects.forEach((o) => o());
          })),
        e._x_effects.add(i),
        (t = () => {
          i !== void 0 && (e._x_effects.delete(i), L(i));
        }),
        i
      );
    },
    () => {
      t();
    },
  ];
}
function Se(e, t) {
  let r = !0,
    n,
    i = D(() => {
      let o = e();
      (JSON.stringify(o),
        r
          ? (n = o)
          : queueMicrotask(() => {
              (t(o, n), (n = o));
            }),
        (r = !1));
    });
  return () => L(i);
}
var Gt = [],
  Jt = [],
  Yt = [];
function Xt(e) {
  Yt.push(e);
}
function ee(e, t) {
  typeof t == 'function' ? (e._x_cleanups || (e._x_cleanups = []), e._x_cleanups.push(t)) : ((t = e), Jt.push(t));
}
function Ae(e) {
  Gt.push(e);
}
function Oe(e, t, r) {
  (e._x_attributeCleanups || (e._x_attributeCleanups = {}),
    e._x_attributeCleanups[t] || (e._x_attributeCleanups[t] = []),
    e._x_attributeCleanups[t].push(r));
}
function ct(e, t) {
  e._x_attributeCleanups &&
    Object.entries(e._x_attributeCleanups).forEach(([r, n]) => {
      (t === void 0 || t.includes(r)) && (n.forEach((i) => i()), delete e._x_attributeCleanups[r]);
    });
}
function Zt(e) {
  if (e._x_cleanups) for (; e._x_cleanups.length; ) e._x_cleanups.pop()();
}
var lt = new MutationObserver(pt),
  ut = !1;
function le() {
  (lt.observe(document, { subtree: !0, childList: !0, attributes: !0, attributeOldValue: !0 }), (ut = !0));
}
function ft() {
  (Rn(), lt.disconnect(), (ut = !1));
}
var ce = [];
function Rn() {
  let e = lt.takeRecords();
  ce.push(() => e.length > 0 && pt(e));
  let t = ce.length;
  queueMicrotask(() => {
    if (ce.length === t) for (; ce.length > 0; ) ce.shift()();
  });
}
function _(e) {
  if (!ut) return e();
  ft();
  let t = e();
  return (le(), t);
}
var dt = !1,
  ve = [];
function Qt() {
  dt = !0;
}
function er() {
  ((dt = !1), pt(ve), (ve = []));
}
function pt(e) {
  if (dt) {
    ve = ve.concat(e);
    return;
  }
  let t = new Set(),
    r = new Set(),
    n = new Map(),
    i = new Map();
  for (let o = 0; o < e.length; o++)
    if (
      !e[o].target._x_ignoreMutationObserver &&
      (e[o].type === 'childList' &&
        (e[o].addedNodes.forEach((s) => s.nodeType === 1 && t.add(s)),
        e[o].removedNodes.forEach((s) => s.nodeType === 1 && r.add(s))),
      e[o].type === 'attributes')
    ) {
      let s = e[o].target,
        a = e[o].attributeName,
        c = e[o].oldValue,
        l = () => {
          (n.has(s) || n.set(s, []), n.get(s).push({ name: a, value: s.getAttribute(a) }));
        },
        u = () => {
          (i.has(s) || i.set(s, []), i.get(s).push(a));
        };
      s.hasAttribute(a) && c === null ? l() : s.hasAttribute(a) ? (u(), l()) : u();
    }
  (i.forEach((o, s) => {
    ct(s, o);
  }),
    n.forEach((o, s) => {
      Gt.forEach((a) => a(s, o));
    }));
  for (let o of r) t.has(o) || Jt.forEach((s) => s(o));
  t.forEach((o) => {
    ((o._x_ignoreSelf = !0), (o._x_ignore = !0));
  });
  for (let o of t)
    r.has(o) ||
      (o.isConnected &&
        (delete o._x_ignoreSelf,
        delete o._x_ignore,
        Yt.forEach((s) => s(o)),
        (o._x_ignore = !0),
        (o._x_ignoreSelf = !0)));
  (t.forEach((o) => {
    (delete o._x_ignoreSelf, delete o._x_ignore);
  }),
    (t = null),
    (r = null),
    (n = null),
    (i = null));
}
function Ce(e) {
  return F(j(e));
}
function P(e, t, r) {
  return (
    (e._x_dataStack = [t, ...j(r || e)]),
    () => {
      e._x_dataStack = e._x_dataStack.filter((n) => n !== t);
    }
  );
}
function j(e) {
  return e._x_dataStack
    ? e._x_dataStack
    : typeof ShadowRoot == 'function' && e instanceof ShadowRoot
      ? j(e.host)
      : e.parentNode
        ? j(e.parentNode)
        : [];
}
function F(e) {
  return new Proxy({ objects: e }, Mn);
}
var Mn = {
  ownKeys({ objects: e }) {
    return Array.from(new Set(e.flatMap((t) => Object.keys(t))));
  },
  has({ objects: e }, t) {
    return t == Symbol.unscopables
      ? !1
      : e.some((r) => Object.prototype.hasOwnProperty.call(r, t) || Reflect.has(r, t));
  },
  get({ objects: e }, t, r) {
    return t == 'toJSON' ? Nn : Reflect.get(e.find((n) => Reflect.has(n, t)) || {}, t, r);
  },
  set({ objects: e }, t, r, n) {
    let i = e.find((s) => Object.prototype.hasOwnProperty.call(s, t)) || e[e.length - 1],
      o = Object.getOwnPropertyDescriptor(i, t);
    return o?.set && o?.get ? Reflect.set(i, t, r, n) : Reflect.set(i, t, r);
  },
};
function Nn() {
  return Reflect.ownKeys(this).reduce((t, r) => ((t[r] = Reflect.get(this, r)), t), {});
}
function Te(e) {
  let t = (n) => typeof n == 'object' && !Array.isArray(n) && n !== null,
    r = (n, i = '') => {
      Object.entries(Object.getOwnPropertyDescriptors(n)).forEach(([o, { value: s, enumerable: a }]) => {
        if (a === !1 || s === void 0 || (typeof s == 'object' && s !== null && s.__v_skip)) return;
        let c = i === '' ? o : `${i}.${o}`;
        typeof s == 'object' && s !== null && s._x_interceptor
          ? (n[o] = s.initialize(e, c, o))
          : t(s) && s !== n && !(s instanceof Element) && r(s, c);
      });
    };
  return r(e);
}
function Re(e, t = () => {}) {
  let r = {
    initialValue: void 0,
    _x_interceptor: !0,
    initialize(n, i, o) {
      return e(
        this.initialValue,
        () => Dn(n, i),
        (s) => mt(n, i, s),
        i,
        o,
      );
    },
  };
  return (
    t(r),
    (n) => {
      if (typeof n == 'object' && n !== null && n._x_interceptor) {
        let i = r.initialize.bind(r);
        r.initialize = (o, s, a) => {
          let c = n.initialize(o, s, a);
          return ((r.initialValue = c), i(o, s, a));
        };
      } else r.initialValue = n;
      return r;
    }
  );
}
function Dn(e, t) {
  return t.split('.').reduce((r, n) => r[n], e);
}
function mt(e, t, r) {
  if ((typeof t == 'string' && (t = t.split('.')), t.length === 1)) e[t[0]] = r;
  else {
    if (t.length === 0) throw error;
    return (e[t[0]] || (e[t[0]] = {}), mt(e[t[0]], t.slice(1), r));
  }
}
var tr = {};
function y(e, t) {
  tr[e] = t;
}
function ue(e, t) {
  return (
    Object.entries(tr).forEach(([r, n]) => {
      let i = null;
      function o() {
        if (i) return i;
        {
          let [s, a] = _t(t);
          return ((i = { interceptor: Re, ...s }), ee(t, a), i);
        }
      }
      Object.defineProperty(e, `$${r}`, {
        get() {
          return n(t, o());
        },
        enumerable: !1,
      });
    }),
    e
  );
}
function rr(e, t, r, ...n) {
  try {
    return r(...n);
  } catch (i) {
    te(i, e, t);
  }
}
function te(e, t, r = void 0) {
  ((e = Object.assign(e ?? { message: 'No error message given.' }, { el: t, expression: r })),
    console.warn(
      `Alpine Expression Error: ${e.message}

${
  r
    ? 'Expression: "' +
      r +
      `"

`
    : ''
}`,
      t,
    ),
    setTimeout(() => {
      throw e;
    }, 0));
}
var Me = !0;
function De(e) {
  let t = Me;
  Me = !1;
  let r = e();
  return ((Me = t), r);
}
function M(e, t, r = {}) {
  let n;
  return (x(e, t)((i) => (n = i), r), n);
}
function x(...e) {
  return nr(...e);
}
var nr = gt;
function ir(e) {
  nr = e;
}
function gt(e, t) {
  let r = {};
  ue(r, e);
  let n = [r, ...j(e)],
    i = typeof t == 'function' ? Pn(n, t) : kn(n, t, e);
  return rr.bind(null, e, t, i);
}
function Pn(e, t) {
  return (r = () => {}, { scope: n = {}, params: i = [] } = {}) => {
    let o = t.apply(F([n, ...e]), i);
    Ne(r, o);
  };
}
var ht = {};
function In(e, t) {
  if (ht[e]) return ht[e];
  let r = Object.getPrototypeOf(async function () {}).constructor,
    n = /^[\n\s]*if.*\(.*\)/.test(e.trim()) || /^(let|const)\s/.test(e.trim()) ? `(async()=>{ ${e} })()` : e,
    o = (() => {
      try {
        let s = new r(
          ['__self', 'scope'],
          `with (scope) { __self.result = ${n} }; __self.finished = true; return __self.result;`,
        );
        return (Object.defineProperty(s, 'name', { value: `[Alpine] ${e}` }), s);
      } catch (s) {
        return (te(s, t, e), Promise.resolve());
      }
    })();
  return ((ht[e] = o), o);
}
function kn(e, t, r) {
  let n = In(t, r);
  return (i = () => {}, { scope: o = {}, params: s = [] } = {}) => {
    ((n.result = void 0), (n.finished = !1));
    let a = F([o, ...e]);
    if (typeof n == 'function') {
      let c = n(n, a).catch((l) => te(l, r, t));
      n.finished
        ? (Ne(i, n.result, a, s, r), (n.result = void 0))
        : c
            .then((l) => {
              Ne(i, l, a, s, r);
            })
            .catch((l) => te(l, r, t))
            .finally(() => (n.result = void 0));
    }
  };
}
function Ne(e, t, r, n, i) {
  if (Me && typeof t == 'function') {
    let o = t.apply(r, n);
    o instanceof Promise ? o.then((s) => Ne(e, s, r, n)).catch((s) => te(s, i, t)) : e(o);
  } else typeof t == 'object' && t instanceof Promise ? t.then((o) => e(o)) : e(t);
}
var bt = 'x-';
function C(e = '') {
  return bt + e;
}
function or(e) {
  bt = e;
}
var Pe = {};
function d(e, t) {
  return (
    (Pe[e] = t),
    {
      before(r) {
        if (!Pe[r]) {
          console.warn(String.raw`Cannot find directive \`${r}\`. \`${e}\` will use the default order of execution`);
          return;
        }
        let n = W.indexOf(r);
        W.splice(n >= 0 ? n : W.indexOf('DEFAULT'), 0, e);
      },
    }
  );
}
function sr(e) {
  return Object.keys(Pe).includes(e);
}
function de(e, t, r) {
  if (((t = Array.from(t)), e._x_virtualDirectives)) {
    let o = Object.entries(e._x_virtualDirectives).map(([a, c]) => ({ name: a, value: c })),
      s = wt(o);
    ((o = o.map((a) => (s.find((c) => c.name === a.name) ? { name: `x-bind:${a.name}`, value: `"${a.value}"` } : a))),
      (t = t.concat(o)));
  }
  let n = {};
  return t
    .map(lr((o, s) => (n[o] = s)))
    .filter(fr)
    .map($n(n, r))
    .sort(jn)
    .map((o) => Ln(e, o));
}
function wt(e) {
  return Array.from(e)
    .map(lr())
    .filter((t) => !fr(t));
}
var xt = !1,
  fe = new Map(),
  ar = Symbol();
function cr(e) {
  xt = !0;
  let t = Symbol();
  ((ar = t), fe.set(t, []));
  let r = () => {
      for (; fe.get(t).length; ) fe.get(t).shift()();
      fe.delete(t);
    },
    n = () => {
      ((xt = !1), r());
    };
  (e(r), n());
}
function _t(e) {
  let t = [],
    r = (a) => t.push(a),
    [n, i] = Wt(e);
  return (
    t.push(i),
    [
      { Alpine: B, effect: n, cleanup: r, evaluateLater: x.bind(x, e), evaluate: M.bind(M, e) },
      () => t.forEach((a) => a()),
    ]
  );
}
function Ln(e, t) {
  let r = () => {},
    n = Pe[t.type] || r,
    [i, o] = _t(e);
  Oe(e, t.original, o);
  let s = () => {
    e._x_ignore ||
      e._x_ignoreSelf ||
      (n.inline && n.inline(e, t, i), (n = n.bind(n, e, t, i)), xt ? fe.get(ar).push(n) : n());
  };
  return ((s.runCleanups = o), s);
}
var Ie =
    (e, t) =>
    ({ name: r, value: n }) => (r.startsWith(e) && (r = r.replace(e, t)), { name: r, value: n }),
  ke = (e) => e;
function lr(e = () => {}) {
  return ({ name: t, value: r }) => {
    let { name: n, value: i } = ur.reduce((o, s) => s(o), { name: t, value: r });
    return (n !== t && e(n, t), { name: n, value: i });
  };
}
var ur = [];
function re(e) {
  ur.push(e);
}
function fr({ name: e }) {
  return dr().test(e);
}
var dr = () => new RegExp(`^${bt}([^:^.]+)\\b`);
function $n(e, t) {
  return ({ name: r, value: n }) => {
    let i = r.match(dr()),
      o = r.match(/:([a-zA-Z0-9\-_:]+)/),
      s = r.match(/\.[^.\]]+(?=[^\]]*$)/g) || [],
      a = t || e[r] || r;
    return {
      type: i ? i[1] : null,
      value: o ? o[1] : null,
      modifiers: s.map((c) => c.replace('.', '')),
      expression: n,
      original: a,
    };
  };
}
var yt = 'DEFAULT',
  W = [
    'ignore',
    'ref',
    'data',
    'id',
    'anchor',
    'bind',
    'init',
    'for',
    'model',
    'modelable',
    'transition',
    'show',
    'if',
    yt,
    'teleport',
  ];
function jn(e, t) {
  let r = W.indexOf(e.type) === -1 ? yt : e.type,
    n = W.indexOf(t.type) === -1 ? yt : t.type;
  return W.indexOf(r) - W.indexOf(n);
}
function G(e, t, r = {}) {
  e.dispatchEvent(new CustomEvent(t, { detail: r, bubbles: !0, composed: !0, cancelable: !0 }));
}
function T(e, t) {
  if (typeof ShadowRoot == 'function' && e instanceof ShadowRoot) {
    Array.from(e.children).forEach((i) => T(i, t));
    return;
  }
  let r = !1;
  if ((t(e, () => (r = !0)), r)) return;
  let n = e.firstElementChild;
  for (; n; ) (T(n, t, !1), (n = n.nextElementSibling));
}
function E(e, ...t) {
  console.warn(`Alpine Warning: ${e}`, ...t);
}
var pr = !1;
function mr() {
  (pr &&
    E('Alpine has already been initialized on this page. Calling Alpine.start() more than once can cause problems.'),
    (pr = !0),
    document.body ||
      E(
        "Unable to initialize. Trying to load Alpine before `<body>` is available. Did you forget to add `defer` in Alpine's `<script>` tag?",
      ),
    G(document, 'alpine:init'),
    G(document, 'alpine:initializing'),
    le(),
    Xt((t) => v(t, T)),
    ee((t) => St(t)),
    Ae((t, r) => {
      de(t, r).forEach((n) => n());
    }));
  let e = (t) => !J(t.parentElement, !0);
  (Array.from(document.querySelectorAll(gr().join(',')))
    .filter(e)
    .forEach((t) => {
      v(t);
    }),
    G(document, 'alpine:initialized'),
    setTimeout(() => {
      Fn();
    }));
}
var Et = [],
  _r = [];
function hr() {
  return Et.map((e) => e());
}
function gr() {
  return Et.concat(_r).map((e) => e());
}
function Le(e) {
  Et.push(e);
}
function $e(e) {
  _r.push(e);
}
function J(e, t = !1) {
  return z(e, (r) => {
    if ((t ? gr() : hr()).some((i) => r.matches(i))) return !0;
  });
}
function z(e, t) {
  if (e) {
    if (t(e)) return e;
    if ((e._x_teleportBack && (e = e._x_teleportBack), !!e.parentElement)) return z(e.parentElement, t);
  }
}
function xr(e) {
  return hr().some((t) => e.matches(t));
}
var yr = [];
function br(e) {
  yr.push(e);
}
function v(e, t = T, r = () => {}) {
  cr(() => {
    t(e, (n, i) => {
      (r(n, i), yr.forEach((o) => o(n, i)), de(n, n.attributes).forEach((o) => o()), n._x_ignore && i());
    });
  });
}
function St(e, t = T) {
  t(e, (r) => {
    (ct(r), Zt(r));
  });
}
function Fn() {
  [
    ['ui', 'dialog', ['[x-dialog], [x-popover]']],
    ['anchor', 'anchor', ['[x-anchor]']],
    ['sort', 'sort', ['[x-sort]']],
  ].forEach(([t, r, n]) => {
    sr(r) ||
      n.some((i) => {
        if (document.querySelector(i)) return (E(`found "${i}", but missing ${t} plugin`), !0);
      });
  });
}
var vt = [],
  At = !1;
function ne(e = () => {}) {
  return (
    queueMicrotask(() => {
      At ||
        setTimeout(() => {
          je();
        });
    }),
    new Promise((t) => {
      vt.push(() => {
        (e(), t());
      });
    })
  );
}
function je() {
  for (At = !1; vt.length; ) vt.shift()();
}
function wr() {
  At = !0;
}
function pe(e, t) {
  return Array.isArray(t)
    ? Er(e, t.join(' '))
    : typeof t == 'object' && t !== null
      ? Bn(e, t)
      : typeof t == 'function'
        ? pe(e, t())
        : Er(e, t);
}
function Er(e, t) {
  let r = (o) => o.split(' ').filter(Boolean),
    n = (o) =>
      o
        .split(' ')
        .filter((s) => !e.classList.contains(s))
        .filter(Boolean),
    i = (o) => (
      e.classList.add(...o),
      () => {
        e.classList.remove(...o);
      }
    );
  return ((t = t === !0 ? (t = '') : t || ''), i(n(t)));
}
function Bn(e, t) {
  let r = (a) => a.split(' ').filter(Boolean),
    n = Object.entries(t)
      .flatMap(([a, c]) => (c ? r(a) : !1))
      .filter(Boolean),
    i = Object.entries(t)
      .flatMap(([a, c]) => (c ? !1 : r(a)))
      .filter(Boolean),
    o = [],
    s = [];
  return (
    i.forEach((a) => {
      e.classList.contains(a) && (e.classList.remove(a), s.push(a));
    }),
    n.forEach((a) => {
      e.classList.contains(a) || (e.classList.add(a), o.push(a));
    }),
    () => {
      (s.forEach((a) => e.classList.add(a)), o.forEach((a) => e.classList.remove(a)));
    }
  );
}
function Y(e, t) {
  return typeof t == 'object' && t !== null ? zn(e, t) : Kn(e, t);
}
function zn(e, t) {
  let r = {};
  return (
    Object.entries(t).forEach(([n, i]) => {
      ((r[n] = e.style[n]), n.startsWith('--') || (n = Hn(n)), e.style.setProperty(n, i));
    }),
    setTimeout(() => {
      e.style.length === 0 && e.removeAttribute('style');
    }),
    () => {
      Y(e, r);
    }
  );
}
function Kn(e, t) {
  let r = e.getAttribute('style', t);
  return (
    e.setAttribute('style', t),
    () => {
      e.setAttribute('style', r || '');
    }
  );
}
function Hn(e) {
  return e.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
}
function me(e, t = () => {}) {
  let r = !1;
  return function () {
    r ? t.apply(this, arguments) : ((r = !0), e.apply(this, arguments));
  };
}
d('transition', (e, { value: t, modifiers: r, expression: n }, { evaluate: i }) => {
  (typeof n == 'function' && (n = i(n)), n !== !1 && (!n || typeof n == 'boolean' ? qn(e, r, t) : Vn(e, n, t)));
});
function Vn(e, t, r) {
  (Sr(e, pe, ''),
    {
      enter: (i) => {
        e._x_transition.enter.during = i;
      },
      'enter-start': (i) => {
        e._x_transition.enter.start = i;
      },
      'enter-end': (i) => {
        e._x_transition.enter.end = i;
      },
      leave: (i) => {
        e._x_transition.leave.during = i;
      },
      'leave-start': (i) => {
        e._x_transition.leave.start = i;
      },
      'leave-end': (i) => {
        e._x_transition.leave.end = i;
      },
    }[r](t));
}
function qn(e, t, r) {
  Sr(e, Y);
  let n = !t.includes('in') && !t.includes('out') && !r,
    i = n || t.includes('in') || ['enter'].includes(r),
    o = n || t.includes('out') || ['leave'].includes(r);
  (t.includes('in') && !n && (t = t.filter((g, b) => b < t.indexOf('out'))),
    t.includes('out') && !n && (t = t.filter((g, b) => b > t.indexOf('out'))));
  let s = !t.includes('opacity') && !t.includes('scale'),
    a = s || t.includes('opacity'),
    c = s || t.includes('scale'),
    l = a ? 0 : 1,
    u = c ? _e(t, 'scale', 95) / 100 : 1,
    p = _e(t, 'delay', 0) / 1e3,
    m = _e(t, 'origin', 'center'),
    w = 'opacity, transform',
    $ = _e(t, 'duration', 150) / 1e3,
    we = _e(t, 'duration', 75) / 1e3,
    f = 'cubic-bezier(0.4, 0.0, 0.2, 1)';
  (i &&
    ((e._x_transition.enter.during = {
      transformOrigin: m,
      transitionDelay: `${p}s`,
      transitionProperty: w,
      transitionDuration: `${$}s`,
      transitionTimingFunction: f,
    }),
    (e._x_transition.enter.start = { opacity: l, transform: `scale(${u})` }),
    (e._x_transition.enter.end = { opacity: 1, transform: 'scale(1)' })),
    o &&
      ((e._x_transition.leave.during = {
        transformOrigin: m,
        transitionDelay: `${p}s`,
        transitionProperty: w,
        transitionDuration: `${we}s`,
        transitionTimingFunction: f,
      }),
      (e._x_transition.leave.start = { opacity: 1, transform: 'scale(1)' }),
      (e._x_transition.leave.end = { opacity: l, transform: `scale(${u})` })));
}
function Sr(e, t, r = {}) {
  e._x_transition ||
    (e._x_transition = {
      enter: { during: r, start: r, end: r },
      leave: { during: r, start: r, end: r },
      in(n = () => {}, i = () => {}) {
        Fe(e, t, { during: this.enter.during, start: this.enter.start, end: this.enter.end }, n, i);
      },
      out(n = () => {}, i = () => {}) {
        Fe(e, t, { during: this.leave.during, start: this.leave.start, end: this.leave.end }, n, i);
      },
    });
}
window.Element.prototype._x_toggleAndCascadeWithTransitions = function (e, t, r, n) {
  let i = document.visibilityState === 'visible' ? requestAnimationFrame : setTimeout,
    o = () => i(r);
  if (t) {
    e._x_transition && (e._x_transition.enter || e._x_transition.leave)
      ? e._x_transition.enter &&
        (Object.entries(e._x_transition.enter.during).length ||
          Object.entries(e._x_transition.enter.start).length ||
          Object.entries(e._x_transition.enter.end).length)
        ? e._x_transition.in(r)
        : o()
      : e._x_transition
        ? e._x_transition.in(r)
        : o();
    return;
  }
  ((e._x_hidePromise = e._x_transition
    ? new Promise((s, a) => {
        (e._x_transition.out(
          () => {},
          () => s(n),
        ),
          e._x_transitioning && e._x_transitioning.beforeCancel(() => a({ isFromCancelledTransition: !0 })));
      })
    : Promise.resolve(n)),
    queueMicrotask(() => {
      let s = vr(e);
      s
        ? (s._x_hideChildren || (s._x_hideChildren = []), s._x_hideChildren.push(e))
        : i(() => {
            let a = (c) => {
              let l = Promise.all([c._x_hidePromise, ...(c._x_hideChildren || []).map(a)]).then(([u]) => u());
              return (delete c._x_hidePromise, delete c._x_hideChildren, l);
            };
            a(e).catch((c) => {
              if (!c.isFromCancelledTransition) throw c;
            });
          });
    }));
};
function vr(e) {
  let t = e.parentNode;
  if (t) return t._x_hidePromise ? t : vr(t);
}
function Fe(e, t, { during: r, start: n, end: i } = {}, o = () => {}, s = () => {}) {
  if (
    (e._x_transitioning && e._x_transitioning.cancel(),
    Object.keys(r).length === 0 && Object.keys(n).length === 0 && Object.keys(i).length === 0)
  ) {
    (o(), s());
    return;
  }
  let a, c, l;
  Un(e, {
    start() {
      a = t(e, n);
    },
    during() {
      c = t(e, r);
    },
    before: o,
    end() {
      (a(), (l = t(e, i)));
    },
    after: s,
    cleanup() {
      (c(), l());
    },
  });
}
function Un(e, t) {
  let r,
    n,
    i,
    o = me(() => {
      _(() => {
        ((r = !0),
          n || t.before(),
          i || (t.end(), je()),
          t.after(),
          e.isConnected && t.cleanup(),
          delete e._x_transitioning);
      });
    });
  ((e._x_transitioning = {
    beforeCancels: [],
    beforeCancel(s) {
      this.beforeCancels.push(s);
    },
    cancel: me(function () {
      for (; this.beforeCancels.length; ) this.beforeCancels.shift()();
      o();
    }),
    finish: o,
  }),
    _(() => {
      (t.start(), t.during());
    }),
    wr(),
    requestAnimationFrame(() => {
      if (r) return;
      let s = Number(getComputedStyle(e).transitionDuration.replace(/,.*/, '').replace('s', '')) * 1e3,
        a = Number(getComputedStyle(e).transitionDelay.replace(/,.*/, '').replace('s', '')) * 1e3;
      (s === 0 && (s = Number(getComputedStyle(e).animationDuration.replace('s', '')) * 1e3),
        _(() => {
          t.before();
        }),
        (n = !0),
        requestAnimationFrame(() => {
          r ||
            (_(() => {
              t.end();
            }),
            je(),
            setTimeout(e._x_transitioning.finish, s + a),
            (i = !0));
        }));
    }));
}
function _e(e, t, r) {
  if (e.indexOf(t) === -1) return r;
  let n = e[e.indexOf(t) + 1];
  if (!n || (t === 'scale' && isNaN(n))) return r;
  if (t === 'duration' || t === 'delay') {
    let i = n.match(/([0-9]+)ms/);
    if (i) return i[1];
  }
  return t === 'origin' && ['top', 'right', 'left', 'center', 'bottom'].includes(e[e.indexOf(t) + 2])
    ? [n, e[e.indexOf(t) + 2]].join(' ')
    : n;
}
var I = !1;
function A(e, t = () => {}) {
  return (...r) => (I ? t(...r) : e(...r));
}
function Ar(e) {
  return (...t) => I && e(...t);
}
var Or = [];
function K(e) {
  Or.push(e);
}
function Cr(e, t) {
  (Or.forEach((r) => r(e, t)),
    (I = !0),
    Rr(() => {
      v(t, (r, n) => {
        n(r, () => {});
      });
    }),
    (I = !1));
}
var Be = !1;
function Tr(e, t) {
  (t._x_dataStack || (t._x_dataStack = e._x_dataStack),
    (I = !0),
    (Be = !0),
    Rr(() => {
      Wn(t);
    }),
    (I = !1),
    (Be = !1));
}
function Wn(e) {
  let t = !1;
  v(e, (n, i) => {
    T(n, (o, s) => {
      if (t && xr(o)) return s();
      ((t = !0), i(o, s));
    });
  });
}
function Rr(e) {
  let t = D;
  (at((r, n) => {
    let i = t(r);
    return (L(i), () => {});
  }),
    e(),
    at(t));
}
function he(e, t, r, n = []) {
  switch (
    (e._x_bindings || (e._x_bindings = R({})), (e._x_bindings[t] = r), (t = n.includes('camel') ? ti(t) : t), t)
  ) {
    case 'value':
      Gn(e, r);
      break;
    case 'style':
      Yn(e, r);
      break;
    case 'class':
      Jn(e, r);
      break;
    case 'selected':
    case 'checked':
      Xn(e, t, r);
      break;
    default:
      Nr(e, t, r);
      break;
  }
}
function Gn(e, t) {
  if (e.type === 'radio')
    (e.attributes.value === void 0 && (e.value = t),
      window.fromModel && (typeof t == 'boolean' ? (e.checked = ge(e.value) === t) : (e.checked = Mr(e.value, t))));
  else if (e.type === 'checkbox')
    Number.isInteger(t)
      ? (e.value = t)
      : !Array.isArray(t) && typeof t != 'boolean' && ![null, void 0].includes(t)
        ? (e.value = String(t))
        : Array.isArray(t)
          ? (e.checked = t.some((r) => Mr(r, e.value)))
          : (e.checked = !!t);
  else if (e.tagName === 'SELECT') ei(e, t);
  else {
    if (e.value === t) return;
    e.value = t === void 0 ? '' : t;
  }
}
function Jn(e, t) {
  (e._x_undoAddedClasses && e._x_undoAddedClasses(), (e._x_undoAddedClasses = pe(e, t)));
}
function Yn(e, t) {
  (e._x_undoAddedStyles && e._x_undoAddedStyles(), (e._x_undoAddedStyles = Y(e, t)));
}
function Xn(e, t, r) {
  (Nr(e, t, r), Qn(e, t, r));
}
function Nr(e, t, r) {
  [null, void 0, !1].includes(r) && ri(t) ? e.removeAttribute(t) : (Dr(t) && (r = t), Zn(e, t, r));
}
function Zn(e, t, r) {
  e.getAttribute(t) != r && e.setAttribute(t, r);
}
function Qn(e, t, r) {
  e[t] !== r && (e[t] = r);
}
function ei(e, t) {
  let r = [].concat(t).map((n) => n + '');
  Array.from(e.options).forEach((n) => {
    n.selected = r.includes(n.value);
  });
}
function ti(e) {
  return e.toLowerCase().replace(/-(\w)/g, (t, r) => r.toUpperCase());
}
function Mr(e, t) {
  return e == t;
}
function ge(e) {
  return [1, '1', 'true', 'on', 'yes', !0].includes(e)
    ? !0
    : [0, '0', 'false', 'off', 'no', !1].includes(e)
      ? !1
      : e
        ? Boolean(e)
        : null;
}
function Dr(e) {
  return [
    'disabled',
    'checked',
    'required',
    'readonly',
    'open',
    'selected',
    'autofocus',
    'itemscope',
    'multiple',
    'novalidate',
    'allowfullscreen',
    'allowpaymentrequest',
    'formnovalidate',
    'autoplay',
    'controls',
    'loop',
    'muted',
    'playsinline',
    'default',
    'ismap',
    'reversed',
    'async',
    'defer',
    'nomodule',
  ].includes(e);
}
function ri(e) {
  return !['aria-pressed', 'aria-checked', 'aria-expanded', 'aria-selected'].includes(e);
}
function Pr(e, t, r) {
  return e._x_bindings && e._x_bindings[t] !== void 0 ? e._x_bindings[t] : kr(e, t, r);
}
function Ir(e, t, r, n = !0) {
  if (e._x_bindings && e._x_bindings[t] !== void 0) return e._x_bindings[t];
  if (e._x_inlineBindings && e._x_inlineBindings[t] !== void 0) {
    let i = e._x_inlineBindings[t];
    return ((i.extract = n), De(() => M(e, i.expression)));
  }
  return kr(e, t, r);
}
function kr(e, t, r) {
  let n = e.getAttribute(t);
  return n === null ? (typeof r == 'function' ? r() : r) : n === '' ? !0 : Dr(t) ? !![t, 'true'].includes(n) : n;
}
function ze(e, t) {
  var r;
  return function () {
    var n = this,
      i = arguments,
      o = function () {
        ((r = null), e.apply(n, i));
      };
    (clearTimeout(r), (r = setTimeout(o, t)));
  };
}
function Ke(e, t) {
  let r;
  return function () {
    let n = this,
      i = arguments;
    r || (e.apply(n, i), (r = !0), setTimeout(() => (r = !1), t));
  };
}
function He({ get: e, set: t }, { get: r, set: n }) {
  let i = !0,
    o,
    s,
    a = D(() => {
      let c = e(),
        l = r();
      if (i) (n(Ot(c)), (i = !1));
      else {
        let u = JSON.stringify(c),
          p = JSON.stringify(l);
        u !== o ? n(Ot(c)) : u !== p && t(Ot(l));
      }
      ((o = JSON.stringify(e())), (s = JSON.stringify(r())));
    });
  return () => {
    L(a);
  };
}
function Ot(e) {
  return typeof e == 'object' ? JSON.parse(JSON.stringify(e)) : e;
}
function Lr(e) {
  (Array.isArray(e) ? e : [e]).forEach((r) => r(B));
}
var X = {},
  $r = !1;
function jr(e, t) {
  if (($r || ((X = R(X)), ($r = !0)), t === void 0)) return X[e];
  ((X[e] = t),
    typeof t == 'object' && t !== null && t.hasOwnProperty('init') && typeof t.init == 'function' && X[e].init(),
    Te(X[e]));
}
function Fr() {
  return X;
}
var Br = {};
function zr(e, t) {
  let r = typeof t != 'function' ? () => t : t;
  return e instanceof Element ? Ct(e, r()) : ((Br[e] = r), () => {});
}
function Kr(e) {
  return (
    Object.entries(Br).forEach(([t, r]) => {
      Object.defineProperty(e, t, {
        get() {
          return (...n) => r(...n);
        },
      });
    }),
    e
  );
}
function Ct(e, t, r) {
  let n = [];
  for (; n.length; ) n.pop()();
  let i = Object.entries(t).map(([s, a]) => ({ name: s, value: a })),
    o = wt(i);
  return (
    (i = i.map((s) => (o.find((a) => a.name === s.name) ? { name: `x-bind:${s.name}`, value: `"${s.value}"` } : s))),
    de(e, i, r).map((s) => {
      (n.push(s.runCleanups), s());
    }),
    () => {
      for (; n.length; ) n.pop()();
    }
  );
}
var Hr = {};
function Vr(e, t) {
  Hr[e] = t;
}
function qr(e, t) {
  return (
    Object.entries(Hr).forEach(([r, n]) => {
      Object.defineProperty(e, r, {
        get() {
          return (...i) => n.bind(t)(...i);
        },
        enumerable: !1,
      });
    }),
    e
  );
}
var ni = {
    get reactive() {
      return R;
    },
    get release() {
      return L;
    },
    get effect() {
      return D;
    },
    get raw() {
      return st;
    },
    version: '3.13.10',
    flushAndStopDeferringMutations: er,
    dontAutoEvaluateFunctions: De,
    disableEffectScheduling: qt,
    startObservingMutations: le,
    stopObservingMutations: ft,
    setReactivityEngine: Ut,
    onAttributeRemoved: Oe,
    onAttributesAdded: Ae,
    closestDataStack: j,
    skipDuringClone: A,
    onlyDuringClone: Ar,
    addRootSelector: Le,
    addInitSelector: $e,
    interceptClone: K,
    addScopeToNode: P,
    deferMutations: Qt,
    mapAttributes: re,
    evaluateLater: x,
    interceptInit: br,
    setEvaluator: ir,
    mergeProxies: F,
    extractProp: Ir,
    findClosest: z,
    onElRemoved: ee,
    closestRoot: J,
    destroyTree: St,
    interceptor: Re,
    transition: Fe,
    setStyles: Y,
    mutateDom: _,
    directive: d,
    entangle: He,
    throttle: Ke,
    debounce: ze,
    evaluate: M,
    initTree: v,
    nextTick: ne,
    prefixed: C,
    prefix: or,
    plugin: Lr,
    magic: y,
    store: jr,
    start: mr,
    clone: Tr,
    cloneNode: Cr,
    bound: Pr,
    $data: Ce,
    watch: Se,
    walk: T,
    data: Vr,
    bind: zr,
  },
  B = ni;
function Tt(e, t) {
  let r = Object.create(null),
    n = e.split(',');
  for (let i = 0; i < n.length; i++) r[n[i]] = !0;
  return t ? (i) => !!r[i.toLowerCase()] : (i) => !!r[i];
}
var ii = 'itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,readonly';
var Rs = Tt(
  ii +
    ',async,autofocus,autoplay,controls,default,defer,disabled,hidden,loop,open,required,reversed,scoped,seamless,checked,muted,multiple,selected',
);
var Ur = Object.freeze({}),
  Ms = Object.freeze([]);
var oi = Object.prototype.hasOwnProperty,
  xe = (e, t) => oi.call(e, t),
  H = Array.isArray,
  ie = (e) => Wr(e) === '[object Map]';
var si = (e) => typeof e == 'string',
  Ve = (e) => typeof e == 'symbol',
  ye = (e) => e !== null && typeof e == 'object';
var ai = Object.prototype.toString,
  Wr = (e) => ai.call(e),
  Rt = (e) => Wr(e).slice(8, -1);
var qe = (e) => si(e) && e !== 'NaN' && e[0] !== '-' && '' + parseInt(e, 10) === e;
var Ue = (e) => {
    let t = Object.create(null);
    return (r) => t[r] || (t[r] = e(r));
  },
  ci = /-(\w)/g,
  Ns = Ue((e) => e.replace(ci, (t, r) => (r ? r.toUpperCase() : ''))),
  li = /\B([A-Z])/g,
  Ds = Ue((e) => e.replace(li, '-$1').toLowerCase()),
  Mt = Ue((e) => e.charAt(0).toUpperCase() + e.slice(1)),
  Ps = Ue((e) => (e ? `on${Mt(e)}` : '')),
  Nt = (e, t) => e !== t && (e === e || t === t);
var Dt = new WeakMap(),
  be = [],
  k,
  Z = Symbol('iterate'),
  Pt = Symbol('Map key iterate');
function ui(e) {
  return e && e._isEffect === !0;
}
function Qr(e, t = Ur) {
  ui(e) && (e = e.raw);
  let r = di(e, t);
  return (t.lazy || r(), r);
}
function en(e) {
  e.active && (tn(e), e.options.onStop && e.options.onStop(), (e.active = !1));
}
var fi = 0;
function di(e, t) {
  let r = function () {
    if (!r.active) return e();
    if (!be.includes(r)) {
      tn(r);
      try {
        return (mi(), be.push(r), (k = r), e());
      } finally {
        (be.pop(), rn(), (k = be[be.length - 1]));
      }
    }
  };
  return (
    (r.id = fi++),
    (r.allowRecurse = !!t.allowRecurse),
    (r._isEffect = !0),
    (r.active = !0),
    (r.raw = e),
    (r.deps = []),
    (r.options = t),
    r
  );
}
function tn(e) {
  let { deps: t } = e;
  if (t.length) {
    for (let r = 0; r < t.length; r++) t[r].delete(e);
    t.length = 0;
  }
}
var oe = !0,
  kt = [];
function pi() {
  (kt.push(oe), (oe = !1));
}
function mi() {
  (kt.push(oe), (oe = !0));
}
function rn() {
  let e = kt.pop();
  oe = e === void 0 ? !0 : e;
}
function N(e, t, r) {
  if (!oe || k === void 0) return;
  let n = Dt.get(e);
  n || Dt.set(e, (n = new Map()));
  let i = n.get(r);
  (i || n.set(r, (i = new Set())),
    i.has(k) ||
      (i.add(k), k.deps.push(i), k.options.onTrack && k.options.onTrack({ effect: k, target: e, type: t, key: r })));
}
function q(e, t, r, n, i, o) {
  let s = Dt.get(e);
  if (!s) return;
  let a = new Set(),
    c = (u) => {
      u &&
        u.forEach((p) => {
          (p !== k || p.allowRecurse) && a.add(p);
        });
    };
  if (t === 'clear') s.forEach(c);
  else if (r === 'length' && H(e))
    s.forEach((u, p) => {
      (p === 'length' || p >= n) && c(u);
    });
  else
    switch ((r !== void 0 && c(s.get(r)), t)) {
      case 'add':
        H(e) ? qe(r) && c(s.get('length')) : (c(s.get(Z)), ie(e) && c(s.get(Pt)));
        break;
      case 'delete':
        H(e) || (c(s.get(Z)), ie(e) && c(s.get(Pt)));
        break;
      case 'set':
        ie(e) && c(s.get(Z));
        break;
    }
  let l = (u) => {
    (u.options.onTrigger &&
      u.options.onTrigger({ effect: u, target: e, key: r, type: t, newValue: n, oldValue: i, oldTarget: o }),
      u.options.scheduler ? u.options.scheduler(u) : u());
  };
  a.forEach(l);
}
var _i = Tt('__proto__,__v_isRef,__isVue'),
  nn = new Set(
    Object.getOwnPropertyNames(Symbol)
      .map((e) => Symbol[e])
      .filter(Ve),
  ),
  hi = on();
var gi = on(!0);
var Gr = xi();
function xi() {
  let e = {};
  return (
    ['includes', 'indexOf', 'lastIndexOf'].forEach((t) => {
      e[t] = function (...r) {
        let n = h(this);
        for (let o = 0, s = this.length; o < s; o++) N(n, 'get', o + '');
        let i = n[t](...r);
        return i === -1 || i === !1 ? n[t](...r.map(h)) : i;
      };
    }),
    ['push', 'pop', 'shift', 'unshift', 'splice'].forEach((t) => {
      e[t] = function (...r) {
        pi();
        let n = h(this)[t].apply(this, r);
        return (rn(), n);
      };
    }),
    e
  );
}
function on(e = !1, t = !1) {
  return function (n, i, o) {
    if (i === '__v_isReactive') return !e;
    if (i === '__v_isReadonly') return e;
    if (i === '__v_raw' && o === (e ? (t ? Ii : ln) : t ? Pi : cn).get(n)) return n;
    let s = H(n);
    if (!e && s && xe(Gr, i)) return Reflect.get(Gr, i, o);
    let a = Reflect.get(n, i, o);
    return (Ve(i) ? nn.has(i) : _i(i)) || (e || N(n, 'get', i), t)
      ? a
      : It(a)
        ? !s || !qe(i)
          ? a.value
          : a
        : ye(a)
          ? e
            ? un(a)
            : Qe(a)
          : a;
  };
}
var yi = bi();
function bi(e = !1) {
  return function (r, n, i, o) {
    let s = r[n];
    if (!e && ((i = h(i)), (s = h(s)), !H(r) && It(s) && !It(i))) return ((s.value = i), !0);
    let a = H(r) && qe(n) ? Number(n) < r.length : xe(r, n),
      c = Reflect.set(r, n, i, o);
    return (r === h(o) && (a ? Nt(i, s) && q(r, 'set', n, i, s) : q(r, 'add', n, i)), c);
  };
}
function wi(e, t) {
  let r = xe(e, t),
    n = e[t],
    i = Reflect.deleteProperty(e, t);
  return (i && r && q(e, 'delete', t, void 0, n), i);
}
function Ei(e, t) {
  let r = Reflect.has(e, t);
  return ((!Ve(t) || !nn.has(t)) && N(e, 'has', t), r);
}
function Si(e) {
  return (N(e, 'iterate', H(e) ? 'length' : Z), Reflect.ownKeys(e));
}
var vi = { get: hi, set: yi, deleteProperty: wi, has: Ei, ownKeys: Si },
  Ai = {
    get: gi,
    set(e, t) {
      return (console.warn(`Set operation on key "${String(t)}" failed: target is readonly.`, e), !0);
    },
    deleteProperty(e, t) {
      return (console.warn(`Delete operation on key "${String(t)}" failed: target is readonly.`, e), !0);
    },
  };
var Lt = (e) => (ye(e) ? Qe(e) : e),
  $t = (e) => (ye(e) ? un(e) : e),
  jt = (e) => e,
  Ze = (e) => Reflect.getPrototypeOf(e);
function We(e, t, r = !1, n = !1) {
  e = e.__v_raw;
  let i = h(e),
    o = h(t);
  (t !== o && !r && N(i, 'get', t), !r && N(i, 'get', o));
  let { has: s } = Ze(i),
    a = n ? jt : r ? $t : Lt;
  if (s.call(i, t)) return a(e.get(t));
  if (s.call(i, o)) return a(e.get(o));
  e !== i && e.get(t);
}
function Ge(e, t = !1) {
  let r = this.__v_raw,
    n = h(r),
    i = h(e);
  return (e !== i && !t && N(n, 'has', e), !t && N(n, 'has', i), e === i ? r.has(e) : r.has(e) || r.has(i));
}
function Je(e, t = !1) {
  return ((e = e.__v_raw), !t && N(h(e), 'iterate', Z), Reflect.get(e, 'size', e));
}
function Jr(e) {
  e = h(e);
  let t = h(this);
  return (Ze(t).has.call(t, e) || (t.add(e), q(t, 'add', e, e)), this);
}
function Yr(e, t) {
  t = h(t);
  let r = h(this),
    { has: n, get: i } = Ze(r),
    o = n.call(r, e);
  o ? an(r, n, e) : ((e = h(e)), (o = n.call(r, e)));
  let s = i.call(r, e);
  return (r.set(e, t), o ? Nt(t, s) && q(r, 'set', e, t, s) : q(r, 'add', e, t), this);
}
function Xr(e) {
  let t = h(this),
    { has: r, get: n } = Ze(t),
    i = r.call(t, e);
  i ? an(t, r, e) : ((e = h(e)), (i = r.call(t, e)));
  let o = n ? n.call(t, e) : void 0,
    s = t.delete(e);
  return (i && q(t, 'delete', e, void 0, o), s);
}
function Zr() {
  let e = h(this),
    t = e.size !== 0,
    r = ie(e) ? new Map(e) : new Set(e),
    n = e.clear();
  return (t && q(e, 'clear', void 0, void 0, r), n);
}
function Ye(e, t) {
  return function (n, i) {
    let o = this,
      s = o.__v_raw,
      a = h(s),
      c = t ? jt : e ? $t : Lt;
    return (!e && N(a, 'iterate', Z), s.forEach((l, u) => n.call(i, c(l), c(u), o)));
  };
}
function Xe(e, t, r) {
  return function (...n) {
    let i = this.__v_raw,
      o = h(i),
      s = ie(o),
      a = e === 'entries' || (e === Symbol.iterator && s),
      c = e === 'keys' && s,
      l = i[e](...n),
      u = r ? jt : t ? $t : Lt;
    return (
      !t && N(o, 'iterate', c ? Pt : Z),
      {
        next() {
          let { value: p, done: m } = l.next();
          return m ? { value: p, done: m } : { value: a ? [u(p[0]), u(p[1])] : u(p), done: m };
        },
        [Symbol.iterator]() {
          return this;
        },
      }
    );
  };
}
function V(e) {
  return function (...t) {
    {
      let r = t[0] ? `on key "${t[0]}" ` : '';
      console.warn(`${Mt(e)} operation ${r}failed: target is readonly.`, h(this));
    }
    return e === 'delete' ? !1 : this;
  };
}
function Oi() {
  let e = {
      get(o) {
        return We(this, o);
      },
      get size() {
        return Je(this);
      },
      has: Ge,
      add: Jr,
      set: Yr,
      delete: Xr,
      clear: Zr,
      forEach: Ye(!1, !1),
    },
    t = {
      get(o) {
        return We(this, o, !1, !0);
      },
      get size() {
        return Je(this);
      },
      has: Ge,
      add: Jr,
      set: Yr,
      delete: Xr,
      clear: Zr,
      forEach: Ye(!1, !0),
    },
    r = {
      get(o) {
        return We(this, o, !0);
      },
      get size() {
        return Je(this, !0);
      },
      has(o) {
        return Ge.call(this, o, !0);
      },
      add: V('add'),
      set: V('set'),
      delete: V('delete'),
      clear: V('clear'),
      forEach: Ye(!0, !1),
    },
    n = {
      get(o) {
        return We(this, o, !0, !0);
      },
      get size() {
        return Je(this, !0);
      },
      has(o) {
        return Ge.call(this, o, !0);
      },
      add: V('add'),
      set: V('set'),
      delete: V('delete'),
      clear: V('clear'),
      forEach: Ye(!0, !0),
    };
  return (
    ['keys', 'values', 'entries', Symbol.iterator].forEach((o) => {
      ((e[o] = Xe(o, !1, !1)), (r[o] = Xe(o, !0, !1)), (t[o] = Xe(o, !1, !0)), (n[o] = Xe(o, !0, !0)));
    }),
    [e, r, t, n]
  );
}
var [Ci, Ti, Ri, Mi] = Oi();
function sn(e, t) {
  let r = t ? (e ? Mi : Ri) : e ? Ti : Ci;
  return (n, i, o) =>
    i === '__v_isReactive'
      ? !e
      : i === '__v_isReadonly'
        ? e
        : i === '__v_raw'
          ? n
          : Reflect.get(xe(r, i) && i in n ? r : n, i, o);
}
var Ni = { get: sn(!1, !1) };
var Di = { get: sn(!0, !1) };
function an(e, t, r) {
  let n = h(r);
  if (n !== r && t.call(e, n)) {
    let i = Rt(e);
    console.warn(
      `Reactive ${i} contains both the raw and reactive versions of the same object${i === 'Map' ? ' as keys' : ''}, which can lead to inconsistencies. Avoid differentiating between the raw and reactive versions of an object and only use the reactive version if possible.`,
    );
  }
}
var cn = new WeakMap(),
  Pi = new WeakMap(),
  ln = new WeakMap(),
  Ii = new WeakMap();
function ki(e) {
  switch (e) {
    case 'Object':
    case 'Array':
      return 1;
    case 'Map':
    case 'Set':
    case 'WeakMap':
    case 'WeakSet':
      return 2;
    default:
      return 0;
  }
}
function Li(e) {
  return e.__v_skip || !Object.isExtensible(e) ? 0 : ki(Rt(e));
}
function Qe(e) {
  return e && e.__v_isReadonly ? e : fn(e, !1, vi, Ni, cn);
}
function un(e) {
  return fn(e, !0, Ai, Di, ln);
}
function fn(e, t, r, n, i) {
  if (!ye(e)) return (console.warn(`value cannot be made reactive: ${String(e)}`), e);
  if (e.__v_raw && !(t && e.__v_isReactive)) return e;
  let o = i.get(e);
  if (o) return o;
  let s = Li(e);
  if (s === 0) return e;
  let a = new Proxy(e, s === 2 ? n : r);
  return (i.set(e, a), a);
}
function h(e) {
  return (e && h(e.__v_raw)) || e;
}
function It(e) {
  return Boolean(e && e.__v_isRef === !0);
}
y('nextTick', () => ne);
y('dispatch', (e) => G.bind(G, e));
y('watch', (e, { evaluateLater: t, cleanup: r }) => (n, i) => {
  let o = t(n),
    a = Se(() => {
      let c;
      return (o((l) => (c = l)), c);
    }, i);
  r(a);
});
y('store', Fr);
y('data', (e) => Ce(e));
y('root', (e) => J(e));
y('refs', (e) => (e._x_refs_proxy || (e._x_refs_proxy = F($i(e))), e._x_refs_proxy));
function $i(e) {
  let t = [];
  return (
    z(e, (r) => {
      r._x_refs && t.push(r._x_refs);
    }),
    t
  );
}
var Ft = {};
function Bt(e) {
  return (Ft[e] || (Ft[e] = 0), ++Ft[e]);
}
function dn(e, t) {
  return z(e, (r) => {
    if (r._x_ids && r._x_ids[t]) return !0;
  });
}
function pn(e, t) {
  (e._x_ids || (e._x_ids = {}), e._x_ids[t] || (e._x_ids[t] = Bt(t)));
}
y('id', (e, { cleanup: t }) => (r, n = null) => {
  let i = `${r}${n ? `-${n}` : ''}`;
  return ji(e, i, t, () => {
    let o = dn(e, r),
      s = o ? o._x_ids[r] : Bt(r);
    return n ? `${r}-${s}-${n}` : `${r}-${s}`;
  });
});
K((e, t) => {
  e._x_id && (t._x_id = e._x_id);
});
function ji(e, t, r, n) {
  if ((e._x_id || (e._x_id = {}), e._x_id[t])) return e._x_id[t];
  let i = n();
  return (
    (e._x_id[t] = i),
    r(() => {
      delete e._x_id[t];
    }),
    i
  );
}
y('el', (e) => e);
mn('Focus', 'focus', 'focus');
mn('Persist', 'persist', 'persist');
function mn(e, t, r) {
  y(t, (n) =>
    E(`You can't use [$${t}] without first installing the "${e}" plugin here: https://alpinejs.dev/plugins/${r}`, n),
  );
}
d('modelable', (e, { expression: t }, { effect: r, evaluateLater: n, cleanup: i }) => {
  let o = n(t),
    s = () => {
      let u;
      return (o((p) => (u = p)), u);
    },
    a = n(`${t} = __placeholder`),
    c = (u) => a(() => {}, { scope: { __placeholder: u } }),
    l = s();
  (c(l),
    queueMicrotask(() => {
      if (!e._x_model) return;
      e._x_removeModelListeners.default();
      let u = e._x_model.get,
        p = e._x_model.set,
        m = He(
          {
            get() {
              return u();
            },
            set(w) {
              p(w);
            },
          },
          {
            get() {
              return s();
            },
            set(w) {
              c(w);
            },
          },
        );
      i(m);
    }));
});
d('teleport', (e, { modifiers: t, expression: r }, { cleanup: n }) => {
  e.tagName.toLowerCase() !== 'template' && E('x-teleport can only be used on a <template> tag', e);
  let i = _n(r),
    o = e.content.cloneNode(!0).firstElementChild;
  ((e._x_teleport = o),
    (o._x_teleportBack = e),
    e.setAttribute('data-teleport-template', !0),
    o.setAttribute('data-teleport-target', !0),
    e._x_forwardEvents &&
      e._x_forwardEvents.forEach((a) => {
        o.addEventListener(a, (c) => {
          (c.stopPropagation(), e.dispatchEvent(new c.constructor(c.type, c)));
        });
      }),
    P(o, {}, e));
  let s = (a, c, l) => {
    l.includes('prepend')
      ? c.parentNode.insertBefore(a, c)
      : l.includes('append')
        ? c.parentNode.insertBefore(a, c.nextSibling)
        : c.appendChild(a);
  };
  (_(() => {
    (s(o, i, t),
      A(() => {
        (v(o), (o._x_ignore = !0));
      })());
  }),
    (e._x_teleportPutBack = () => {
      let a = _n(r);
      _(() => {
        s(e._x_teleport, a, t);
      });
    }),
    n(() => o.remove()));
});
var Fi = document.createElement('div');
function _n(e) {
  let t = A(
    () => document.querySelector(e),
    () => Fi,
  )();
  return (t || E(`Cannot find x-teleport element for selector: "${e}"`), t);
}
var hn = () => {};
hn.inline = (e, { modifiers: t }, { cleanup: r }) => {
  (t.includes('self') ? (e._x_ignoreSelf = !0) : (e._x_ignore = !0),
    r(() => {
      t.includes('self') ? delete e._x_ignoreSelf : delete e._x_ignore;
    }));
};
d('ignore', hn);
d(
  'effect',
  A((e, { expression: t }, { effect: r }) => {
    r(x(e, t));
  }),
);
function se(e, t, r, n) {
  let i = e,
    o = (c) => n(c),
    s = {},
    a = (c, l) => (u) => l(c, u);
  if (
    (r.includes('dot') && (t = Bi(t)),
    r.includes('camel') && (t = zi(t)),
    r.includes('passive') && (s.passive = !0),
    r.includes('capture') && (s.capture = !0),
    r.includes('window') && (i = window),
    r.includes('document') && (i = document),
    r.includes('debounce'))
  ) {
    let c = r[r.indexOf('debounce') + 1] || 'invalid-wait',
      l = et(c.split('ms')[0]) ? Number(c.split('ms')[0]) : 250;
    o = ze(o, l);
  }
  if (r.includes('throttle')) {
    let c = r[r.indexOf('throttle') + 1] || 'invalid-wait',
      l = et(c.split('ms')[0]) ? Number(c.split('ms')[0]) : 250;
    o = Ke(o, l);
  }
  return (
    r.includes('prevent') &&
      (o = a(o, (c, l) => {
        (l.preventDefault(), c(l));
      })),
    r.includes('stop') &&
      (o = a(o, (c, l) => {
        (l.stopPropagation(), c(l));
      })),
    r.includes('once') &&
      (o = a(o, (c, l) => {
        (c(l), i.removeEventListener(t, o, s));
      })),
    (r.includes('away') || r.includes('outside')) &&
      ((i = document),
      (o = a(o, (c, l) => {
        e.contains(l.target) ||
          (l.target.isConnected !== !1 && ((e.offsetWidth < 1 && e.offsetHeight < 1) || (e._x_isShown !== !1 && c(l))));
      }))),
    r.includes('self') &&
      (o = a(o, (c, l) => {
        l.target === e && c(l);
      })),
    (o = a(o, (c, l) => {
      (Hi(t) && Vi(l, r)) || c(l);
    })),
    i.addEventListener(t, o, s),
    () => {
      i.removeEventListener(t, o, s);
    }
  );
}
function Bi(e) {
  return e.replace(/-/g, '.');
}
function zi(e) {
  return e.toLowerCase().replace(/-(\w)/g, (t, r) => r.toUpperCase());
}
function et(e) {
  return !Array.isArray(e) && !isNaN(e);
}
function Ki(e) {
  return [' ', '_'].includes(e)
    ? e
    : e
        .replace(/([a-z])([A-Z])/g, '$1-$2')
        .replace(/[_\s]/, '-')
        .toLowerCase();
}
function Hi(e) {
  return ['keydown', 'keyup'].includes(e);
}
function Vi(e, t) {
  let r = t.filter((o) => !['window', 'document', 'prevent', 'stop', 'once', 'capture'].includes(o));
  if (r.includes('debounce')) {
    let o = r.indexOf('debounce');
    r.splice(o, et((r[o + 1] || 'invalid-wait').split('ms')[0]) ? 2 : 1);
  }
  if (r.includes('throttle')) {
    let o = r.indexOf('throttle');
    r.splice(o, et((r[o + 1] || 'invalid-wait').split('ms')[0]) ? 2 : 1);
  }
  if (r.length === 0 || (r.length === 1 && gn(e.key).includes(r[0]))) return !1;
  let i = ['ctrl', 'shift', 'alt', 'meta', 'cmd', 'super'].filter((o) => r.includes(o));
  return (
    (r = r.filter((o) => !i.includes(o))),
    !(
      i.length > 0 &&
      i.filter((s) => ((s === 'cmd' || s === 'super') && (s = 'meta'), e[`${s}Key`])).length === i.length &&
      gn(e.key).includes(r[0])
    )
  );
}
function gn(e) {
  if (!e) return [];
  e = Ki(e);
  let t = {
    ctrl: 'control',
    slash: '/',
    space: ' ',
    spacebar: ' ',
    cmd: 'meta',
    esc: 'escape',
    up: 'arrow-up',
    down: 'arrow-down',
    left: 'arrow-left',
    right: 'arrow-right',
    period: '.',
    comma: ',',
    equal: '=',
    minus: '-',
    underscore: '_',
  };
  return (
    (t[e] = e),
    Object.keys(t)
      .map((r) => {
        if (t[r] === e) return r;
      })
      .filter((r) => r)
  );
}
d('model', (e, { modifiers: t, expression: r }, { effect: n, cleanup: i }) => {
  let o = e;
  t.includes('parent') && (o = e.parentNode);
  let s = x(o, r),
    a;
  typeof r == 'string'
    ? (a = x(o, `${r} = __placeholder`))
    : typeof r == 'function' && typeof r() == 'string'
      ? (a = x(o, `${r()} = __placeholder`))
      : (a = () => {});
  let c = () => {
      let m;
      return (s((w) => (m = w)), xn(m) ? m.get() : m);
    },
    l = (m) => {
      let w;
      (s(($) => (w = $)), xn(w) ? w.set(m) : a(() => {}, { scope: { __placeholder: m } }));
    };
  typeof r == 'string' &&
    e.type === 'radio' &&
    _(() => {
      e.hasAttribute('name') || e.setAttribute('name', r);
    });
  var u =
    e.tagName.toLowerCase() === 'select' || ['checkbox', 'radio'].includes(e.type) || t.includes('lazy')
      ? 'change'
      : 'input';
  let p = I
    ? () => {}
    : se(e, u, t, (m) => {
        l(zt(e, t, m, c()));
      });
  if (
    (t.includes('fill') &&
      ([void 0, null, ''].includes(c()) ||
        (e.type === 'checkbox' && Array.isArray(c())) ||
        (e.tagName.toLowerCase() === 'select' && e.multiple)) &&
      l(zt(e, t, { target: e }, c())),
    e._x_removeModelListeners || (e._x_removeModelListeners = {}),
    (e._x_removeModelListeners.default = p),
    i(() => e._x_removeModelListeners.default()),
    e.form)
  ) {
    let m = se(e.form, 'reset', [], (w) => {
      ne(() => e._x_model && e._x_model.set(zt(e, t, { target: e }, c())));
    });
    i(() => m());
  }
  ((e._x_model = {
    get() {
      return c();
    },
    set(m) {
      l(m);
    },
  }),
    (e._x_forceModelUpdate = (m) => {
      (m === void 0 && typeof r == 'string' && r.match(/\./) && (m = ''),
        (window.fromModel = !0),
        _(() => he(e, 'value', m)),
        delete window.fromModel);
    }),
    n(() => {
      let m = c();
      (t.includes('unintrusive') && document.activeElement.isSameNode(e)) || e._x_forceModelUpdate(m);
    }));
});
function zt(e, t, r, n) {
  return _(() => {
    if (r instanceof CustomEvent && r.detail !== void 0)
      return r.detail !== null && r.detail !== void 0 ? r.detail : r.target.value;
    if (e.type === 'checkbox')
      if (Array.isArray(n)) {
        let i = null;
        return (
          t.includes('number')
            ? (i = Kt(r.target.value))
            : t.includes('boolean')
              ? (i = ge(r.target.value))
              : (i = r.target.value),
          r.target.checked ? (n.includes(i) ? n : n.concat([i])) : n.filter((o) => !qi(o, i))
        );
      } else return r.target.checked;
    else {
      if (e.tagName.toLowerCase() === 'select' && e.multiple)
        return t.includes('number')
          ? Array.from(r.target.selectedOptions).map((i) => {
              let o = i.value || i.text;
              return Kt(o);
            })
          : t.includes('boolean')
            ? Array.from(r.target.selectedOptions).map((i) => {
                let o = i.value || i.text;
                return ge(o);
              })
            : Array.from(r.target.selectedOptions).map((i) => i.value || i.text);
      {
        let i;
        return (
          e.type === 'radio' ? (r.target.checked ? (i = r.target.value) : (i = n)) : (i = r.target.value),
          t.includes('number') ? Kt(i) : t.includes('boolean') ? ge(i) : t.includes('trim') ? i.trim() : i
        );
      }
    }
  });
}
function Kt(e) {
  let t = e ? parseFloat(e) : null;
  return Ui(t) ? t : e;
}
function qi(e, t) {
  return e == t;
}
function Ui(e) {
  return !Array.isArray(e) && !isNaN(e);
}
function xn(e) {
  return e !== null && typeof e == 'object' && typeof e.get == 'function' && typeof e.set == 'function';
}
d('cloak', (e) => queueMicrotask(() => _(() => e.removeAttribute(C('cloak')))));
$e(() => `[${C('init')}]`);
d(
  'init',
  A((e, { expression: t }, { evaluate: r }) => (typeof t == 'string' ? !!t.trim() && r(t, {}, !1) : r(t, {}, !1))),
);
d('text', (e, { expression: t }, { effect: r, evaluateLater: n }) => {
  let i = n(t);
  r(() => {
    i((o) => {
      _(() => {
        e.textContent = o;
      });
    });
  });
});
d('html', (e, { expression: t }, { effect: r, evaluateLater: n }) => {
  let i = n(t);
  r(() => {
    i((o) => {
      _(() => {
        ((e.innerHTML = o), (e._x_ignoreSelf = !0), v(e), delete e._x_ignoreSelf);
      });
    });
  });
});
re(Ie(':', ke(C('bind:'))));
var yn = (e, { value: t, modifiers: r, expression: n, original: i }, { effect: o, cleanup: s }) => {
  if (!t) {
    let c = {};
    (Kr(c),
      x(e, n)(
        (u) => {
          Ct(e, u, i);
        },
        { scope: c },
      ));
    return;
  }
  if (t === 'key') return Wi(e, n);
  if (e._x_inlineBindings && e._x_inlineBindings[t] && e._x_inlineBindings[t].extract) return;
  let a = x(e, n);
  (o(() =>
    a((c) => {
      (c === void 0 && typeof n == 'string' && n.match(/\./) && (c = ''), _(() => he(e, t, c, r)));
    }),
  ),
    s(() => {
      (e._x_undoAddedClasses && e._x_undoAddedClasses(), e._x_undoAddedStyles && e._x_undoAddedStyles());
    }));
};
yn.inline = (e, { value: t, modifiers: r, expression: n }) => {
  t && (e._x_inlineBindings || (e._x_inlineBindings = {}), (e._x_inlineBindings[t] = { expression: n, extract: !1 }));
};
d('bind', yn);
function Wi(e, t) {
  e._x_keyExpression = t;
}
Le(() => `[${C('data')}]`);
d('data', (e, { expression: t }, { cleanup: r }) => {
  if (Gi(e)) return;
  t = t === '' ? '{}' : t;
  let n = {};
  ue(n, e);
  let i = {};
  qr(i, n);
  let o = M(e, t, { scope: i });
  ((o === void 0 || o === !0) && (o = {}), ue(o, e));
  let s = R(o);
  Te(s);
  let a = P(e, s);
  (s.init && M(e, s.init),
    r(() => {
      (s.destroy && M(e, s.destroy), a());
    }));
});
K((e, t) => {
  e._x_dataStack && ((t._x_dataStack = e._x_dataStack), t.setAttribute('data-has-alpine-state', !0));
});
function Gi(e) {
  return I ? (Be ? !0 : e.hasAttribute('data-has-alpine-state')) : !1;
}
d('show', (e, { modifiers: t, expression: r }, { effect: n }) => {
  let i = x(e, r);
  (e._x_doHide ||
    (e._x_doHide = () => {
      _(() => {
        e.style.setProperty('display', 'none', t.includes('important') ? 'important' : void 0);
      });
    }),
    e._x_doShow ||
      (e._x_doShow = () => {
        _(() => {
          e.style.length === 1 && e.style.display === 'none'
            ? e.removeAttribute('style')
            : e.style.removeProperty('display');
        });
      }));
  let o = () => {
      (e._x_doHide(), (e._x_isShown = !1));
    },
    s = () => {
      (e._x_doShow(), (e._x_isShown = !0));
    },
    a = () => setTimeout(s),
    c = me(
      (p) => (p ? s() : o()),
      (p) => {
        typeof e._x_toggleAndCascadeWithTransitions == 'function'
          ? e._x_toggleAndCascadeWithTransitions(e, p, s, o)
          : p
            ? a()
            : o();
      },
    ),
    l,
    u = !0;
  n(() =>
    i((p) => {
      (!u && p === l) || (t.includes('immediate') && (p ? a() : o()), c(p), (l = p), (u = !1));
    }),
  );
});
d('for', (e, { expression: t }, { effect: r, cleanup: n }) => {
  let i = Yi(t),
    o = x(e, i.items),
    s = x(e, e._x_keyExpression || 'index');
  ((e._x_prevKeys = []),
    (e._x_lookup = {}),
    r(() => Ji(e, i, o, s)),
    n(() => {
      (Object.values(e._x_lookup).forEach((a) => a.remove()), delete e._x_prevKeys, delete e._x_lookup);
    }));
});
function Ji(e, t, r, n) {
  let i = (s) => typeof s == 'object' && !Array.isArray(s),
    o = e;
  r((s) => {
    (Xi(s) && s >= 0 && (s = Array.from(Array(s).keys(), (f) => f + 1)), s === void 0 && (s = []));
    let a = e._x_lookup,
      c = e._x_prevKeys,
      l = [],
      u = [];
    if (i(s))
      s = Object.entries(s).map(([f, g]) => {
        let b = bn(t, g, f, s);
        (n(
          (S) => {
            (u.includes(S) && E('Duplicate key on x-for', e), u.push(S));
          },
          { scope: { index: f, ...b } },
        ),
          l.push(b));
      });
    else
      for (let f = 0; f < s.length; f++) {
        let g = bn(t, s[f], f, s);
        (n(
          (b) => {
            (u.includes(b) && E('Duplicate key on x-for', e), u.push(b));
          },
          { scope: { index: f, ...g } },
        ),
          l.push(g));
      }
    let p = [],
      m = [],
      w = [],
      $ = [];
    for (let f = 0; f < c.length; f++) {
      let g = c[f];
      u.indexOf(g) === -1 && w.push(g);
    }
    c = c.filter((f) => !w.includes(f));
    let we = 'template';
    for (let f = 0; f < u.length; f++) {
      let g = u[f],
        b = c.indexOf(g);
      if (b === -1) (c.splice(f, 0, g), p.push([we, f]));
      else if (b !== f) {
        let S = c.splice(f, 1)[0],
          O = c.splice(b - 1, 1)[0];
        (c.splice(f, 0, O), c.splice(b, 0, S), m.push([S, O]));
      } else $.push(g);
      we = g;
    }
    for (let f = 0; f < w.length; f++) {
      let g = w[f];
      (a[g]._x_effects && a[g]._x_effects.forEach(Ee), a[g].remove(), (a[g] = null), delete a[g]);
    }
    for (let f = 0; f < m.length; f++) {
      let [g, b] = m[f],
        S = a[g],
        O = a[b],
        Q = document.createElement('div');
      (_(() => {
        (O || E('x-for ":key" is undefined or invalid', o, b, a),
          O.after(Q),
          S.after(O),
          O._x_currentIfEl && O.after(O._x_currentIfEl),
          Q.before(S),
          S._x_currentIfEl && S.after(S._x_currentIfEl),
          Q.remove());
      }),
        O._x_refreshXForScope(l[u.indexOf(b)]));
    }
    for (let f = 0; f < p.length; f++) {
      let [g, b] = p[f],
        S = g === 'template' ? o : a[g];
      S._x_currentIfEl && (S = S._x_currentIfEl);
      let O = l[b],
        Q = u[b],
        ae = document.importNode(o.content, !0).firstElementChild,
        Ht = R(O);
      (P(ae, Ht, o),
        (ae._x_refreshXForScope = (Sn) => {
          Object.entries(Sn).forEach(([vn, An]) => {
            Ht[vn] = An;
          });
        }),
        _(() => {
          (S.after(ae), A(() => v(ae))());
        }),
        typeof Q == 'object' && E('x-for key cannot be an object, it must be a string or an integer', o),
        (a[Q] = ae));
    }
    for (let f = 0; f < $.length; f++) a[$[f]]._x_refreshXForScope(l[u.indexOf($[f])]);
    o._x_prevKeys = u;
  });
}
function Yi(e) {
  let t = /,([^,\}\]]*)(?:,([^,\}\]]*))?$/,
    r = /^\s*\(|\)\s*$/g,
    n = /([\s\S]*?)\s+(?:in|of)\s+([\s\S]*)/,
    i = e.match(n);
  if (!i) return;
  let o = {};
  o.items = i[2].trim();
  let s = i[1].replace(r, '').trim(),
    a = s.match(t);
  return (
    a
      ? ((o.item = s.replace(t, '').trim()), (o.index = a[1].trim()), a[2] && (o.collection = a[2].trim()))
      : (o.item = s),
    o
  );
}
function bn(e, t, r, n) {
  let i = {};
  return (
    /^\[.*\]$/.test(e.item) && Array.isArray(t)
      ? e.item
          .replace('[', '')
          .replace(']', '')
          .split(',')
          .map((s) => s.trim())
          .forEach((s, a) => {
            i[s] = t[a];
          })
      : /^\{.*\}$/.test(e.item) && !Array.isArray(t) && typeof t == 'object'
        ? e.item
            .replace('{', '')
            .replace('}', '')
            .split(',')
            .map((s) => s.trim())
            .forEach((s) => {
              i[s] = t[s];
            })
        : (i[e.item] = t),
    e.index && (i[e.index] = r),
    e.collection && (i[e.collection] = n),
    i
  );
}
function Xi(e) {
  return !Array.isArray(e) && !isNaN(e);
}
function wn() {}
wn.inline = (e, { expression: t }, { cleanup: r }) => {
  let n = J(e);
  (n._x_refs || (n._x_refs = {}), (n._x_refs[t] = e), r(() => delete n._x_refs[t]));
};
d('ref', wn);
d('if', (e, { expression: t }, { effect: r, cleanup: n }) => {
  e.tagName.toLowerCase() !== 'template' && E('x-if can only be used on a <template> tag', e);
  let i = x(e, t),
    o = () => {
      if (e._x_currentIfEl) return e._x_currentIfEl;
      let a = e.content.cloneNode(!0).firstElementChild;
      return (
        P(a, {}, e),
        _(() => {
          (e.after(a), A(() => v(a))());
        }),
        (e._x_currentIfEl = a),
        (e._x_undoIf = () => {
          (T(a, (c) => {
            c._x_effects && c._x_effects.forEach(Ee);
          }),
            a.remove(),
            delete e._x_currentIfEl);
        }),
        a
      );
    },
    s = () => {
      e._x_undoIf && (e._x_undoIf(), delete e._x_undoIf);
    };
  (r(() =>
    i((a) => {
      a ? o() : s();
    }),
  ),
    n(() => e._x_undoIf && e._x_undoIf()));
});
d('id', (e, { expression: t }, { evaluate: r }) => {
  r(t).forEach((i) => pn(e, i));
});
K((e, t) => {
  e._x_ids && (t._x_ids = e._x_ids);
});
re(Ie('@', ke(C('on:'))));
d(
  'on',
  A((e, { value: t, modifiers: r, expression: n }, { cleanup: i }) => {
    let o = n ? x(e, n) : () => {};
    e.tagName.toLowerCase() === 'template' &&
      (e._x_forwardEvents || (e._x_forwardEvents = []), e._x_forwardEvents.includes(t) || e._x_forwardEvents.push(t));
    let s = se(e, t, r, (a) => {
      o(() => {}, { scope: { $event: a }, params: [a] });
    });
    i(() => s());
  }),
);
tt('Collapse', 'collapse', 'collapse');
tt('Intersect', 'intersect', 'intersect');
tt('Focus', 'trap', 'focus');
tt('Mask', 'mask', 'mask');
function tt(e, t, r) {
  d(t, (n) =>
    E(`You can't use [x-${t}] without first installing the "${e}" plugin here: https://alpinejs.dev/plugins/${r}`, n),
  );
}
B.setEvaluator(gt);
B.setReactivityEngine({ reactive: Qe, effect: Qr, release: en, raw: h });
var En = B;
var xl = En;
export { En as Alpine, xl as default };
