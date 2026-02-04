import { get, httpDelete, post, put } from '../../lib/jinya-http.js';
import confirm from '../../lib/ui/confirm.js';
import alert from '../../lib/ui/alert.js';
import QRCodeStyling from '../../lib/qrcode-styling.js';

import '../../lib/ui/toolbar-editor.js';

export default function jewelData(name, additionalData = {}) {
  Alpine.data(name, () => ({
    ...additionalData,
    loading: true,
    jewels: [],
    get availableTypes() {
      return [...new Set(this.jewels.map((jewel) => jewel.type) ?? [])];
    },
    get filteredJewels() {
      return this.jewels.filter(
        (jewel) =>
          this.deviceTypeFilter.has(jewel.type) &&
          (jewel.hostname?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
            jewel.model.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
            jewel.manufacturer.toLowerCase().includes(this.searchTerm.toLowerCase())),
      );
    },
    get selectedJewelEol() {
      if (this.selectedJewel?.eol) {
        return new Date(Date.parse(this.selectedJewel.eol)).toLocaleDateString();
      }

      return null;
    },
    searchTerm: '',
    detailsTab: 'device',
    selectedJewel: null,
    deviceTypeFilter: new Set(['phone', 'computer', 'watch', 'other']),
    addJewel: {
      open: false,
      hasError: false,
      mode: 'auto',
      automatic: {
        host: location.origin,
        token: '',
        qrCode: '',
      },
      jewel: {
        type: 'other',
        hostname: '',
        eol: '',
        ram: '',
        model: '',
        manufacturer: '',
        storage: '',
        cpu: {
          model: '',
          manufacturer: '',
          cores: '',
          speed: '',
          threads: '',
        },
        os: {
          name: '',
          version: '',
        },
      },
      async reset() {
        this.automatic.token = crypto.randomUUID();
        const qrCode = new QRCodeStyling({
          dotsOptions: {
            color: '#28aef0',
            type: 'rounded',
          },
          backgroundOptions: {
            color: 'transparent',
          },
          imageOptions: {
            crossOrigin: 'anonymous',
            margin: 0,
            hideBackgroundDots: false,
            imageSize: 0.5,
          },
          width: 450,
          height: 450,
          margin: 0,
          qrOptions: {
            typeNumber: 0,
            mode: 'Byte',
            errorCorrectionLevel: 'H',
          },
          image: `${this.automatic.host}/static/img/qrlogo.svg`,
          data: JSON.stringify({
            host: this.automatic.host,
            token: this.automatic.token,
          }),
        });
        await qrCode._svgDrawingPromise;
        this.automatic.qrCode = qrCode._svg.outerHTML;
        this.jewel = {
          type: 'other',
          hostname: '',
          eol: '',
          ram: 0,
          model: '',
          manufacturer: '',
          storage: 0,
          cpu: {
            model: '',
            manufacturer: '',
            cores: 0,
            speed: 0,
            threads: 0,
          },
          os: {
            name: '',
            version: '',
          },
        };
      },
    },
    editJewel: {
      open: false,
      jewel: null,
      reset() {
        this.jewel = null;
      },
    },
    async loadJewels() {
      this.jewels = await get(`/api/${this.getBaseUrl()}`);
    },
    selectJewel(id) {
      this.selectedJewel = this.jewels.find((jewel) => jewel.id === id) ?? null;
    },
    toggleFilter(type) {
      if (this.deviceTypeFilter.has(type)) {
        this.deviceTypeFilter.delete(type);
      } else {
        this.deviceTypeFilter.add(type);
      }
    },
    openAddJewel() {
      this.addJewel.reset();
      this.addJewel.open = true;
    },
    openEditJewel() {
      this.editJewel.jewel = structuredClone(Alpine.raw(this.selectedJewel));
      this.editJewel.open = true;
    },
    async createJewel() {
      let device;
      if (this.addJewel?.jewel?.type === 'other') {
        device = `${this.addJewel?.jewel?.manufacturer} ${this.addJewel?.jewel?.model}`;
      } else {
        device = this.addJewel?.jewel?.hostname;
      }
      try {
        let eol = this.addJewel.jewel.eol ?? null;
        if (eol === '') {
          eol = null;
        }
        const createdJewel = await post(`/api/${this.getBaseUrl()}`, {
          jewel: {
            ...this.addJewel.jewel,
            eol,
          },
          mode: this.addJewel.mode,
          token: this.addJewel.automatic.token,
        });
        if (createdJewel) {
          await this.loadJewels();
          this.selectJewel(createdJewel.id);
        }
        this.addJewel.open = false;
      } catch (e) {
        console.error(e);
        await alert({
          title: 'Fehler beim Speichern',
          message: `Leider konnte das Gerät ${device} nicht gespeichert werden. Bitte wende dich an deinen Administrator.`,
          closeLabel: 'Schließen',
          negative: true,
        });
      }
    },
    async saveJewel() {
      let device;
      if (this.selectedJewel?.type === 'other') {
        device = `${this.selectedJewel?.manufacturer} ${this.selectedJewel?.model}`;
      } else {
        device = this.selectedJewel?.hostname;
      }
      try {
        await put(`/api/${this.getBaseUrl()}/${this.selectedJewel?.id}`, this.editJewel.jewel);
        await this.loadJewels();
        this.selectJewel(this.selectedJewel?.id);
        this.editJewel.open = false;
      } catch (e) {
        console.error(e);
        await alert({
          title: 'Fehler beim Speichern',
          message: `Leider konnte das Gerät ${device} nicht gespeichert werden. Bitte wende dich an deinen Administrator.`,
          closeLabel: 'Schließen',
          negative: true,
        });
      }
    },
    async deleteJewel() {
      let device;
      if (this.selectedJewel?.type === 'other') {
        device = `${this.selectedJewel?.manufacturer} ${this.selectedJewel?.model}`;
      } else {
        device = this.selectedJewel?.hostname;
      }
      if (
        await confirm({
          title: 'Gerät löschen',
          message: `Soll das Gerät ${device} wirklich gelöscht werden?`,
          declineLabel: 'Gerät behalten',
          approveLabel: 'Gerät löschen',
          negative: true,
        })
      ) {
        try {
          await httpDelete(`/api/${this.getBaseUrl()}/${this.selectedJewel?.id}`);
          this.jewels = this.jewels.filter((jewel) => jewel.id !== this.selectedJewel?.id);
          this.selectJewel(this.jewels[0]?.id ?? null);
        } catch (e) {
          console.error(e);
          await alert({
            title: 'Fehler beim Löschen',
            message: `Leider konnte das Gerät ${device} nicht gelöscht werden. Bitte wende dich an deinen Administrator.`,
            closeLabel: 'Schließen',
            negative: true,
          });
        }
      }
    },
    async saveNotes() {
      let device;
      if (this.selectedJewel?.type === 'other') {
        device = `${this.selectedJewel?.manufacturer} ${this.selectedJewel?.model}`;
      } else {
        device = this.selectedJewel?.hostname;
      }
      try {
        await put(`/api/${this.getBaseUrl()}/${this.selectedJewel?.id}`, this.selectedJewel);
        await this.loadJewels();
        this.selectJewel(this.selectedJewel?.id);
        this.editJewel.open = false;
      } catch (e) {
        console.error(e);
        await alert({
          title: 'Fehler beim Speichern',
          message: `Leider konnten die Notizen für das Gerät ${device} nicht gespeichert werden. Bitte wende dich an deinen Administrator.`,
          closeLabel: 'Schließen',
          negative: true,
        });
      }
    },
  }));
}
