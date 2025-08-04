import { get, put } from '../../lib/jinya-http.js';
import alert from '../../lib/ui/alert.js';

Alpine.data('relayVpnData', () => ({
  loading: true,
  devices: [],
  relayClients: [],
  relayConfigs: {},
  selectedDevice: null,
  async loadDevices() {
    this.devices = await get('/api/admin/relay-vpn/device');
    for (const device of this.devices) {
      this.relayConfigs[device.id] = `${device.relayClientId}-${device.relayServerId}`;
    }
  },
  async loadRelayClients() {
    this.relayClients = await get('/api/admin/relay-vpn/client');
  },
  async init() {
    await Promise.all([this.loadDevices(), this.loadRelayClients()]);
  },
  async saveRelay(device) {
    try {
      let [relayServerId, relayClientId] = this.relayConfigs[device.id].split('-');
      relayServerId = parseInt(relayServerId, 10);
      relayClientId = parseInt(relayClientId, 10);
      await put(`/api/admin/relay-vpn/device/${device.id}`, {
        relayServerId,
        relayClientId,
      });
      const relayClient = this.relayClients.find(
        (client) => client.id === relayClientId && client.relayServerId === relayServerId,
      );
      await alert({
        title: 'Relay gespeichert',
        message: `Die Relay Konfiguration ${relayClient.name} wurde erfolgreich dem Gerät ${device.hostname} zugewiesen`,
        closeLabel: 'Schließen',
        positive: true,
      });
    } catch (e) {
      console.error(e);
      await alert({
        title: 'Speichern fehlgeschlagen',
        message: 'Leider konnte die Relay Konfiguration nicht gespeichert werden.',
        closeLabel: 'Schließen',
        negative: true,
      });
    }
  },
}));
