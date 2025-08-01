import jewelData from '../base/jewel.js';

jewelData('myJewelsData', {
  async init() {
    this.loading = true;
    await this.loadJewels();
    this.selectJewel(this.jewels[0]?.id ?? null);
    this.loading = false;
  },
  getBaseUrl() {
    return 'my-jewels';
  },
});
