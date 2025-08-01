import jewelData from '../base/jewel.js';
import { get } from '../../lib/jinya-http.js';

jewelData('ownersData', {
  owners: [],
  selectedOwner: null,
  getBaseUrl() {
    return `admin/owner/${this.selectedOwner?.id ?? '0'}/device`;
  },
  async selectOwner(owner) {
    this.selectedOwner = owner;
    await this.loadJewels();
    this.selectJewel(this.jewels[0]?.id ?? null);
  },
  async init() {
    this.loading = true;
    this.owners = await get('/api/admin/owner');
    await this.selectOwner(this.owners[0] ?? null);
    this.loading = false;
  },
});
