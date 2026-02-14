import { setup } from './lib/jinya-alpine-tools.js';
import { generateTOTP } from './js/base/otp-tools.js';

document.addEventListener('DOMContentLoaded', async () => {
  await setup({
    defaultArea: 'my-jewels',
    defaultPage: 'index',
    baseScriptPath: '/static/js/',
    storagePrefix: '/jewels',
    routerBasePath: '/',
    openIdConfig: jewelsOpenIdConfig,
    afterSetup() {
      Alpine.magic('totp', () => {
        return (key, time) => generateTOTP({ key, now: time });
      });
      Alpine.magic('totpWidth', () => {
        return (now) => (now / 1000) % 30;
      });
      Alpine.directive('totp-width', (el, { value, modifiers, expression }, { Alpine, effect, cleanup }) => {
        const interval = setInterval(() => {
          el.style.width = `${(Math.floor(Date.now() / 1000) % 30) * (10 / 3)}%`;
        }, 100);
        cleanup(() => {
          clearInterval(interval);
        });
      });
    },
  });
});
