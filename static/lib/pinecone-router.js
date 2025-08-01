var k = class {
    params = {};
    path;
    handlers = [];
    constructor(t, c = {}) {
      ((this.path = t),
        Object.keys(c).forEach((u) => {
          this[u] = c[u];
        }),
        c.templates && (this.programmaticTemplates = !0));
    }
    templates = [];
    templateTargetId = '';
    programmaticTemplates = !1;
    handlersDone = !1;
    preload = !1;
    cancelHandlers;
  },
  M = k;
function S(s) {
  return s.replace(/(^\/+|\/+$)/g, '').split('/');
}
function W(s, t) {
  let c = /(?:\?([^#]*))?(#.*)?$/,
    u = s.match(c),
    m = {},
    _;
  if (u && u[1]) {
    let f = u[1].split('&');
    for (let h = 0; h < f.length; h++) {
      let x = f[h].split('=');
      m[decodeURIComponent(x[0])] = decodeURIComponent(x.slice(1).join('='));
    }
  }
  let P = S(s.replace(c, '')),
    p = S(t || ''),
    T = Math.max(P.length, p.length);
  for (let f = 0; f < T; f++)
    if (p[f] && p[f].charAt(0) === ':') {
      let h = p[f].replace(/(^:|[+*?]+$)/g, ''),
        x = (p[f].match(/[+*?]+$/) || {}).toString()[0],
        E = ~x.indexOf('+'),
        v = ~x.indexOf('*'),
        y = P[f] || '';
      if (!y && !v && (x.indexOf('?') < 0 || E)) {
        _ = !1;
        break;
      }
      if (((m[h] = decodeURIComponent(y)), E || v)) {
        m[h] = P.slice(f).map(decodeURIComponent).join('/');
        break;
      }
    } else if (p[f] !== P[f]) {
      _ = !1;
      break;
    }
  return _ === !1 ? !1 : m;
}
function b(s, ...t) {
  if (window.PineconeRouterMiddlewares)
    for (let c in window.PineconeRouterMiddlewares) {
      let u = window.PineconeRouterMiddlewares[c];
      if (u[s] == null) return;
      if (u[s](...t) == 'stop') return 'stop';
    }
}
function D(s) {
  let t = s.reactive({
    version: '5.5.0',
    name: 'pinecone-router',
    settings: { hash: !1, basePath: '/', templateTargetId: null, interceptLinks: !0, includeQuery: !0 },
    notfound: new M('notfound'),
    routes: [],
    globalHandlers: [],
    context: {
      route: '',
      path: '',
      params: {},
      query: window.location.search.substring(1),
      hash: window.location.hash.substring(1),
      navigationStack: [],
      navigationIndex: 0,
      redirect(e, n = !0) {
        return (this.navigate(e, n), 'stop');
      },
      navigate(e, n = !0) {
        w(e, !1, !1, null, n);
      },
      canGoBack() {
        return this.navigationIndex > 0;
      },
      back(e = !0) {
        w(this.navigationStack[this.navigationIndex - 1], !1, !1, this.navigationIndex - 1, e);
      },
      canGoForward() {
        return this.navigationIndex < this.navigationStack.length - 1;
      },
      forward(e = !0) {
        w(this.navigationStack[this.navigationIndex + 1], !1, !1, this.navigationIndex + 1, e);
      },
    },
    add(e, n) {
      if (this.routes.find((r) => r.path == e) != null) throw new Error('Pinecone Router: route already exist');
      return (n?.templates && n?.preload && T(null, n.templates, !0), this.routes.push(new M(e, n)) - 1);
    },
    remove(e) {
      this.routes = this.routes.filter((n) => n.path != e);
    },
    loadStart: new Event('pinecone-start'),
    loadEnd: new Event('pinecone-end'),
  });
  window.PineconeRouter = t;
  var c = {},
    u = {};
  let m = new Set(),
    _ = (e, n, r) => {
      if (m.has(n)) return;
      m.add(n);
      let o = e.content.cloneNode(!0).firstElementChild;
      o &&
        (s.addScopeToNode(o, {}, e),
        s.mutateDom(() => {
          (r != null ? r.replaceChildren(o) : e.after(o), s.initTree(o));
        }),
        (e._x_PineconeRouter_CurrentTemplate = o),
        (e._x_PineconeRouter_undoTemplate = () => {
          (o.remove(), delete e._x_PineconeRouter_CurrentTemplate);
        }),
        s.nextTick(() => m.delete(n)));
    };
  function P(e) {
    e._x_PineconeRouter_undoTemplate && (e._x_PineconeRouter_undoTemplate(), delete e._x_PineconeRouter_undoTemplate);
  }
  function p(e, n, r, o) {
    if (e._x_PineconeRouter_CurrentTemplate) return e._x_PineconeRouter_CurrentTemplate;
    e.content.firstElementChild
      ? (_(e, n, o), h())
      : r &&
        (r.every((i) => u[i])
          ? (r.length > 1 && (e.innerHTML = '<templates-wrapper>'),
            r.forEach((i) => {
              e.innerHTML += u[i];
            }),
            r.length > 1 && (e.innerHTML = '</templates-wrapper>'),
            _(e, n, o),
            h())
          : T(e, r)
              .then(() => _(e, n, o))
              .finally(() => h()));
  }
  let T = (e, n, r = !1) => {
      let o = n.map((i) =>
        c[i]
          ? c[i]
          : u[i]
            ? new Promise((a) => {
                a(u[i]);
              })
            : ((c[i] = fetch(i)
                .then((a) => (a.ok ? a.text() : (x(a.statusText), null)))
                .then((a) => (a == null ? ((u[i] = null), (c[i] = null), null) : ((u[i] = a), (c[i] = null), a)))),
              c[i]),
      );
      return Promise.all(o).then((i) => {
        let a = i.filter((l) => l !== null).join('');
        return e
          ? (n.length > 1 && !r
              ? (e.innerHTML = '<templates-wrapper>' + a + '</templates-wrapper>')
              : (e.innerHTML = a),
            e.innerHTML)
          : a;
      });
    },
    f = () => {
      document.dispatchEvent(t.loadStart);
    },
    h = () => {
      document.dispatchEvent(t.loadEnd);
    };
  function x(e) {
    document.dispatchEvent(new CustomEvent('fetch-error', { detail: e }));
  }
  let E = (e) => (!t.settings.hash && t.settings.basePath != '/' ? t.settings.basePath + e : e),
    v = (e) => t.routes.findIndex((n) => n.path == e);
  (s.directive('template', (e, { modifiers: n, expression: r }, { Alpine: o, effect: i, evaluate: a, cleanup: l }) => {
    if (!e._x_PineconeRouter_route)
      throw new Error('Pinecone Router: x-template must be used on the same element as x-route.');
    if (e.content.firstElementChild != null)
      throw new Error(
        'Pinecone Router: x-template cannot be used alongside an inline template (template element should not have a child).',
      );
    !(r.startsWith('[') && r.endsWith(']')) && !(r.startsWith('Array(') && r.endsWith(')')) && (r = `['${r}']`);
    let d = a(r),
      g;
    if (typeof d == 'object') g = d;
    else throw new Error(`Pinecone Router: Invalid template type: ${typeof d}.`);
    let R = L(n, 'target', null) ?? window.PineconeRouter.settings.templateTargetId,
      H = document.getElementById(R);
    if (R && !H) throw new Error("Pinecone Router: Can't find an element with the suplied target ID: " + R);
    n.includes('preload') && T(e, g, !1);
    let C = e._x_PineconeRouter_route,
      I = C == 'notfound' ? t.notfound : t.routes[v(C)];
    ((I.templates = g),
      o.nextTick(() => {
        i(() => {
          I.handlersDone && t.context.route == I.path ? p(e, r, g, H) : P(e);
        });
      }),
      l(() => {
        e._x_PineconeRouter_undoTemplate && e._x_PineconeRouter_undoTemplate();
      }));
  }),
    s
      .directive('handler', (e, { expression: n, modifiers: r }, { evaluate: o, cleanup: i }) => {
        if (!r.includes('global') && !e._x_PineconeRouter_route)
          throw new Error(
            'Pinecone Router: x-handler must be set on the same element as x-route, or on the router element with the modifier .global.',
          );
        let a;
        !(n.startsWith('[') && n.endsWith(']')) && !(n.startsWith('Array(') && n.endsWith(')')) && (n = `[${n}]`);
        let l = o(n);
        if (typeof l == 'object') a = l;
        else throw new Error(`Pinecone Router: Invalid handler type: ${typeof l}.`);
        for (let g = 0; g < a.length; g++) a[g] = a[g].bind(s.$data(e));
        let d;
        if (r.includes('global')) t.globalHandlers = a;
        else {
          let g = e._x_PineconeRouter_route;
          ((d = g == 'notfound' ? t.notfound : t.routes[v(g)]), (d.handlers = a));
        }
        i(() => {
          r.includes('global')
            ? (t.globalHandlers = [])
            : ((d.handlers = []), (d.handlersDone = !0), (d.cancelHandlers = !1));
        });
      })
      .before('template'),
    s
      .directive('route', (e, { expression: n, modifiers: r }, { effect: o, cleanup: i }) => {
        let a = n;
        if ((b('onBeforeRouteProcessed', e, a), a.indexOf('#') > -1))
          throw new Error("Pinecone Router: A route's path may not have a hash character.");
        let l = L(r, 'target', null) ?? window.PineconeRouter.settings.templateTargetId,
          d = document.getElementById(l);
        if (l && !d) throw new Error("Pinecone Router: Can't find an element with the suplied target ID: " + l);
        let g = null;
        a != 'notfound' && ((a = E(a)), (g = t.add(a)));
        let R = t.routes[g] ?? t.notfound;
        ((e._x_PineconeRouter_route = a),
          e.content.firstElementChild != null &&
            s.nextTick(() => {
              o(() => {
                R.handlersDone && t.context.route == a ? p(e, n, null, d) : P(e);
              });
            }),
          i(() => {
            (e._x_PineconeRouter_undoTemplate && e._x_PineconeRouter_undoTemplate(),
              t.remove(a),
              delete e._x_PineconeRouter_route);
          }),
          b('onAfterRouteProcessed', e, a));
      })
      .before('handler'),
    (s.$router = t.context),
    s.magic('router', () => t.context),
    document.addEventListener('alpine:initialized', () => {
      (b('init'), t.settings.hash == !1 ? w(location.pathname, !1, !0) : w(location.hash.substring(1), !1, !0));
    }),
    window.addEventListener('popstate', () => {
      t.settings.hash
        ? window.location.hash != '' && w(window.location.hash.substring(1), !0)
        : w(window.location.pathname, !0);
    }),
    y());
  function y() {
    function e(n) {
      if (!n || !n.getAttribute) return;
      let r = n.getAttribute('href'),
        o = n.getAttribute('target');
      if (!(!r || !r.match(/^\//g) || (o && !o.match(/^_?self$/i))))
        return (typeof r != 'string' && r.url && (r = r.url), r);
    }
    window.document.body.addEventListener('click', function (n) {
      if (n.ctrlKey || n.metaKey || n.altKey || n.shiftKey || n.button || n.defaultPrevented) return;
      let r = t.routes[v(t.context.route)] ?? t.notfound;
      r.handlersDone || ((r.cancelHandlers = !0), h());
      let o = n.target;
      do
        if (o.localName === 'a' && o.getAttribute('href')) {
          if (
            (window.PineconeRouter.settings.interceptLinks == !1 && !o.hasAttribute('x-link')) ||
            o.hasAttribute('data-native') ||
            o.hasAttribute('native')
          )
            return;
          let i = e(o);
          i &&
            (w(i),
            n.stopImmediatePropagation && n.stopImmediatePropagation(),
            n.stopPropagation && n.stopPropagation(),
            n.preventDefault());
          break;
        }
      while ((o = o.parentNode));
    });
  }
  async function w(e, n = !1, r = !1, o = null, i = !0) {
    (e || (e = '/'),
      t.settings.hash ||
        (t.settings.basePath != '/' && !e.startsWith(t.settings.basePath) && (e = t.settings.basePath + e),
        e == t.settings.basePath && !e.endsWith('/') && (e += '/')),
      o != null
        ? (t.context.navigationIndex = o)
        : e != t.context.path &&
          (t.context.navigationIndex !== t.context.navigationStack.length - 1
            ? ((t.context.navigationStack = t.context.navigationStack.slice(0, t.context.navigationIndex + 1)),
              t.context.navigationStack.push(e),
              (t.context.navigationIndex = t.context.navigationStack.length - 1))
            : (t.context.navigationStack.push(e), (t.context.navigationIndex = t.context.navigationStack.length - 1))));
    let a =
      t.routes.find((l) => {
        let d = W(e, l.path);
        return ((l.params = d != !1 ? d : {}), d != !1);
      }) ?? t.notfound;
    if (
      ((a.handlersDone = !a.handlers.length && !t.globalHandlers.length),
      (a.handlers.length || t.globalHandlers.length || a.templates.length) && f(),
      $(a.path, e, a.params),
      b('onBeforeHandlersExecuted', a, e, r) == 'stop')
    ) {
      h();
      return;
    }
    if (!n) {
      let l = '';
      if (
        (t.settings.hash
          ? ((l = '#'), i && t.settings.includeQuery && (l += window.location.search), (l += e))
          : ((l = e), i && t.settings.includeQuery && (l += window.location.search), (l += window.location.hash)),
        !r)
      )
        history.pushState({ path: l }, '', l);
      else if (t.settings.hash && e == '/') return w('/', !1, !1);
    }
    if (a && (a.handlers.length || t.globalHandlers.length)) {
      if (((a.cancelHandlers = !1), !(await B(t.globalHandlers.concat(a.handlers), t.context)))) {
        h();
        return;
      }
      ((a.handlersDone = !0), a.templates || h());
    }
    if (a.templates.length && a.programmaticTemplates) {
      let l = a.templateTargetId
        ? document.getElementById(a.templateTargetId)
        : document.getElementById(t.settings.templateTargetId);
      T(l, a.templates, a.programmaticTemplates).then(() => {
        h();
      });
    }
    b('onHandlersExecuted', a, e, r);
  }
  function $(e, n, r) {
    ((t.context.route = e),
      (t.context.path = n),
      (t.context.params = r),
      (t.context.query = window.location.search.substring(1)),
      (t.context.hash = window.location.hash.substring(1)));
  }
  function L(e, n, r) {
    if (e.indexOf(n) === -1) return r;
    let o = e[e.indexOf(n) + 1];
    if (!o) return r;
    if (n === 'target') {
      let i = o.match(/([a-z0-9_-]+)/);
      if (i) return i[1];
    }
    return o;
  }
  async function B(e, n) {
    for (let r = 0; r < e.length; r++)
      if (typeof e[r] == 'function') {
        let o = t.routes[v(n.route)] ?? t.notfound;
        if (o.cancelHandlers) return ((o.cancelHandlers = !1), !1);
        let i;
        if ((e[r].constructor.name === 'AsyncFunction' ? (i = await e[r](n)) : (i = e[r](n)), i == 'stop')) return !1;
      }
    return !0;
  }
}
var F = D;
export { F as default };
