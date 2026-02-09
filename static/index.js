import { getRedirect, setup } from './lib/jinya-alpine-tools.js';

document.addEventListener('DOMContentLoaded', async () => {
  await setup({
    defaultArea: 'my-jewels',
    defaultPage: 'index',
    baseScriptPath: '/static/js/',
    storagePrefix: '/jewels',
    routerBasePath: '/',
    openIdConfig: jewelsOpenIdConfig,
  });
});
