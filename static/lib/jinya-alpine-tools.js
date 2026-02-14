import Alpine from './alpine.js';
import PineconeRouter from './plugins/pinecone-router.js';
import Collapse from './plugins/collapse.js';
import Anchor from './plugins/anchor.js';
import { UserManager } from './openid-client/index.js';

let authenticationConfiguration = {};
/** @type UserManager */
let userManager = null;
let scriptBasePath = '/static/js/';
let baseRouterPath = '';
let localStoragePrefix = '';
let languages = {};

export function setRedirect(redirect) {
  sessionStorage.setItem(`${localStoragePrefix}/login/redirect`, redirect);
}

export function getRedirect() {
  return sessionStorage.getItem(`${localStoragePrefix}/login/redirect`);
}

export function deleteRedirect() {
  sessionStorage.removeItem(`${localStoragePrefix}/login/redirect`);
}

export function hasAccessToken() {
  return !!localStorage.getItem(`${localStoragePrefix}/api/access-token`);
}

export function getAccessToken() {
  return localStorage.getItem(`${localStoragePrefix}/api/access-token`);
}

export function setAccessToken(code) {
  localStorage.setItem(`${localStoragePrefix}/api/access-token`, code);
}

export function deleteAccessToken() {
  localStorage.removeItem(`${localStoragePrefix}/api/access-token`);
}

export async function needsLogin(context) {
  if (await checkLogin()) {
    return null;
  }

  const redirect = context.path.substring(baseRouterPath.length);
  setRedirect(redirect);

  return context.redirect('/login');
}

export async function needsLogout(context) {
  if (await checkLogin()) {
    return context.redirect('/');
  }

  return null;
}

function getUserManager() {
  return new UserManager(authenticationConfiguration);
}

export async function openIdLogin() {
  await userManager.signinRedirect();
}

export async function performLogin(context) {
  const user = await userManager.signinCallback();
  setAccessToken(user.access_token);
  Alpine.store('authentication').login();
  context.redirect(getRedirect() ?? '/');
}

async function getUser() {
  return (await userManager.getUser())?.profile;
}

export async function checkLogin() {
  if (!hasAccessToken()) {
    return false;
  }

  try {
    return !!(await getUser());
  } catch (error) {
    console.error(error);
    return false;
  }
}

export async function fetchScript({ route }) {
  let [page, area] = route.split('/').reverse();

  if (!area) {
    area = page;
    page = 'index';
  }

  if (area) {
    await import(`${scriptBasePath}${area}/${page?.replaceAll(':', '') ?? 'index'}.js`);
    Alpine.store('navigation').navigate({
      area,
      page: page ?? 'index',
    });
  }
}

export function getLanguage() {
  if (navigator.language.startsWith('de')) {
    return 'de';
  }

  return 'en';
}

/**
 * Localizes the given key and returns the matching string
 * @param key {string}
 * @param values {Object}
 * @return string
 */
export function localize({ key, values = {} }) {
  let transformed = languages[getLanguage()][key];
  for (const valueKey of Object.keys(values)) {
    transformed = transformed.replaceAll(`{${valueKey}}`, values[valueKey]);
  }

  return transformed;
}

export function setupLocalization(Alpine, langs) {
  languages = langs;

  Alpine.directive('localize', (el, { value, expression, modifiers }, { evaluateLater, effect }) => {
    const getValues = expression ? evaluateLater(expression) : (load) => load();
    effect(() => {
      getValues((values) => {
        const localized = localize({
          key: value,
          values,
        });

        if (modifiers.includes('html')) {
          el.innerHTML = localized;
        } else if (modifiers.includes('title')) {
          el.setAttribute('title', localized);
        } else {
          el.textContent = localized;
        }
      });
    });
  });
}

async function setupAuthentication(openIdConfig) {
  authenticationConfiguration = {
    redirect_uri: `${location.origin}${baseRouterPath}/login/callback`,
    post_logout_redirect_uri: location.origin,
    scope: `openid profile email offline_access ${openIdConfig.additionalScopes}`,
    code_challenge_method: 'S256',
    ...openIdConfig,
  };
  userManager = await getUserManager();
}

function setupRouting(baseScriptPath, routerBasePath = '') {
  scriptBasePath = baseScriptPath;

  document.addEventListener('alpine:init', () => {
    window.PineconeRouter.settings.basePath = routerBasePath;
    window.PineconeRouter.settings.templateTargetId = 'app';
    window.PineconeRouter.settings.includeQuery = false;
  });
}

async function setupAlpine(alpine, defaultArea, defaultPage) {
  Alpine.directive('active-route', (el, { expression, modifiers }, { Alpine, effect }) => {
    effect(() => {
      const { page, area } = Alpine.store('navigation');
      if ((modifiers.includes('area') && area === expression) || (!modifiers.includes('area') && page === expression)) {
        el.classList.add('is--active');
      } else {
        el.classList.remove('is--active');
      }
    });
  });
  Alpine.directive('active', (el, { expression }, { Alpine, effect }) => {
    effect(() => {
      if (Alpine.evaluate(el, expression)) {
        el.classList.add('is--active');
      } else {
        el.classList.remove('is--active');
      }
    });
  });

  Alpine.store('loaded', false);
  Alpine.store('authentication', {
    needsLogin,
    needsLogout,
    performLogin,
    user: await getUser(),
    loggedIn: await checkLogin(),
    async login() {
      this.loggedIn = true;
      this.user = await getUser();
      window.PineconeRouter.context.navigate(getRedirect() ?? '/');
    },
    logout() {
      deleteAccessToken();
      setRedirect(location.pathname.substring(0, 6));
      window.PineconeRouter.context.navigate('/login');
      this.loggedIn = false;
      this.roles = [];
    },
    async desktopLogin() {
      const data = {
        token: crypto.randomUUID(),
        host: location.origin,
      };
      try {
        await post('/api/my-jewels', {
          mode: 'auto',
          token: data.token,
        });
        await fetch('http://localhost:10523', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
          mode: 'cors',
        });
      } finally {
        window.close();
        setTimeout(() => {
          if (!window.closed) {
            window.PineconeRouter.context.navigate('/');
          }
        }, 200);
      }
    },
  });
  Alpine.store('navigation', {
    fetchScript,
    area: defaultArea,
    page: defaultPage,
    navigate({ area, page }) {
      this.area = area;
      this.page = page;
    },
  });
}

export async function setup({
  defaultArea,
  defaultPage,
  baseScriptPath,
  storagePrefix,
  routerBasePath = '',
  openIdConfig = undefined,
  languages = [],
  afterSetup = () => {},
}) {
  if (openIdConfig) {
    await setupAuthentication(openIdConfig);
  }
  baseRouterPath = routerBasePath;
  localStoragePrefix = storagePrefix || '';
  window.Alpine = Alpine;

  Alpine.plugin(PineconeRouter);
  Alpine.plugin(Collapse);
  Alpine.plugin(Anchor);

  if (Object.keys(languages ?? {}).length > 0) {
    setupLocalization(Alpine, languages);
  }
  await setupAlpine(Alpine, defaultArea, defaultPage);

  setupRouting(baseScriptPath, routerBasePath);

  await afterSetup();

  Alpine.start();

  Alpine.store('loaded', true);
}
