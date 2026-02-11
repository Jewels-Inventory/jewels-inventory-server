import { get, httpDelete, post, put } from '../../lib/jinya-http.js';
import confirm from '../../lib/ui/confirm.js';

Alpine.data('twoFactorData', () => ({
  loading: true,
  twoFactorCodes: {},
  currentTimer: 0,
  otpGenerationInterval: null,
  copiedTotp: null,
  edit: {
    open: false,
    accountName: '',
    id: 0,
  },
  share: {
    open: false,
    id: 0,
    sharedWith: [],
  },
  allOwners: [],
  get owners() {
    return this.allOwners.filter((owner) => owner.email !== this.$store.authentication.user.email);
  },
  get groupedSharedOtp() {
    return Object.values(this.twoFactorCodes.sharedOneTimePasswords).reduce((acc, otp) => {
      const group = acc.find((group) => group.id === otp.sharedBy.id);
      if (group) {
        group.otpCodes.push(otp);
      } else {
        acc.push({ id: otp.sharedBy.id, name: otp.sharedBy.name, otpCodes: [otp] });
      }
      return acc;
    }, []);
  },
  async init() {
    this.currentTimer = Date.now();
    await this.loadTwoFactorCodes(true);
    setInterval(async () => {
      this.currentTimer = Date.now();
    }, 1000);
    this.allOwners = await get('/api/owner');
  },
  destroy() {
    clearInterval(this.otpGenerationInterval);
  },
  getOtpIcon(otp) {
    const bi = `/api/icons/${otp.brandIcon}`;
    const si = `/api/icons/${otp.simpleIcon}`;
    if (otp.brandIcon && otp.simpleIcon) {
      if (otp.brandIconSimilarity < otp.simpleIconSimilarity) {
        return si;
      } else {
        return bi;
      }
    }
    if (otp.brandIcon) {
      return bi;
    }
    if (otp.simpleIcon) {
      return si;
    }

    return '/static/img/default.svg';
  },
  async loadTwoFactorCodes(loading) {
    this.loading = loading;
    this.twoFactorCodes = await get('/api/one-time-password');
    this.loading = false;
  },
  async copyCodeToClipboard(secret) {
    const totp = await this.$totp(secret, this.currentTimer);
    await navigator.clipboard.writeText(totp);
    this.copiedTotp = secret;
    const timeOut = (30 - (Math.floor(Date.now() / 1000) % 30)) * 1000;
    setTimeout(() => {
      this.copiedTotp = null;
    }, timeOut);
  },
  async saveTwoFactorCode() {
    await put(`/api/one-time-password/${this.edit.id}`, { accountName: this.edit.accountName });
    this.edit.open = false;
    const otpIdx = this.twoFactorCodes.myOneTimePasswords.findIndex((otp) => otp.id === this.edit.id);
    this.twoFactorCodes.myOneTimePasswords[otpIdx].accountName = this.edit.accountName;
  },
  async saveTwoFactorCodeShares() {
    await post(`/api/one-time-password/${this.share.id}/share`, { sharedWith: this.share.sharedWith });
    this.share.open = false;
    await this.loadTwoFactorCodes(false);
  },
  editOtp(otp) {
    this.edit.open = true;
    this.edit.accountName = otp.accountName;
    this.edit.id = otp.id;
  },
  shareOtp(otp) {
    this.share.open = true;
    this.share.id = otp.id;
    this.share.sharedWith = otp.sharedWith?.map((o) => o.id) ?? [];
  },
  async deleteOtp(otp) {
    if (
      await confirm({
        title: 'Zwei-Faktor Code löschen',
        message: `Soll der Zwei-Faktor Code für ${otp.accountName} wirklich gelöscht werden?`,
        negative: true,
        declineLabel: 'Nicht löschen',
        approveLabel: 'Zwei-Faktor Code löschen',
      })
    ) {
      await httpDelete(`/api/one-time-password/${otp.id}`);
      const myOneTimePasswords = this.twoFactorCodes.myOneTimePasswords.filter((c) => c.id !== otp.id);
      this.twoFactorCodes = { myOneTimePasswords, sharedOneTimePasswords: this.twoFactorCodes.sharedOneTimePasswords };
    }
  },
}));
