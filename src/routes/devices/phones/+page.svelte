<script lang="ts">
	import { type Device, type Owner, Type } from '$lib/database/models';
	import { enhance } from '$app/forms';

	export let data;
	export let form;

	let selectedOwner: Owner;

	let deleteOpen = false;
	let newOpen = false;
	let editOpen = false;
	let detailsOpen = false;

	let selectedDevice: Device;
	let selectedDeviceOwner: Owner;

	function openDeleteDevice(device: Device, owner: Owner) {
		deleteOpen = true;
		selectedDevice = device;
		selectedDeviceOwner = owner;
	}

	function openEditDevice(device: Device, owner: Owner) {
		editOpen = true;
		selectedDevice = device;
		selectedDeviceOwner = owner;
	}

	function openDetailsDevice(device: Device, owner: Owner) {
		detailsOpen = true;
		selectedDevice = device;
		selectedDeviceOwner = owner;
	}

	$: if (form?.deleteSuccess) {
		deleteOpen = false;
	}

	$: if (form?.newSuccess) {
		newOpen = false;
	}

	$: if (form?.editSuccess) {
		editOpen = false;
	}
</script>

<h1 class="cosmo-title">Smartphones & Tablets</h1>
<div class="cosmo-toolbar">
	<div class="cosmo-toolbar__group">
		<button class="cosmo-button" on:click={() => (newOpen = true)}>Neues Gerät</button>
	</div>
</div>
<table class="cosmo-table">
	<thead>
		<tr>
			<th>Besitzer</th>
			<th>Model</th>
			<th>Hersteller</th>
			<th>Betriebssystem</th>
			<th>Speicherplatz</th>
			<th>Arbeitsspeicher</th>
			<th>Supportende</th>
			<th>Aktionen</th>
		</tr>
	</thead>
	<tbody>
		{#each data.owners as owner}
			{#each owner.devices.filter((d) => d.type === Type.PhoneOrTablet) as device}
				<tr>
					<td>{owner.name}</td>
					<td>{device.model}</td>
					<td>{device.manufacturer}</td>
					<td>{device.os?.name ?? ''} {device.os?.version ?? ''}</td>
					<td>{device.storage} GB</td>
					<td>{device.ram} GB</td>
					<td>{device.eol?.toLocaleDateString() ?? ''}</td>
					<td>
						<button
							class="cosmo-button is--small"
							on:click={() => openDetailsDevice(device, owner)}
						>
							Details
						</button>
						<button class="cosmo-button is--small" on:click={() => openEditDevice(device, owner)}>
							Bearbeiten
						</button>
						<button
							class="cosmo-button is--small is--negative"
							on:click={() => openDeleteDevice(device, owner)}
						>
							Löschen
						</button>
					</td>
				</tr>
			{/each}
		{/each}
	</tbody>
</table>
{#if deleteOpen}
	<div class="cosmo-modal__container">
		<form class="cosmo-modal is--negative" method="post" action="?/deleteDevice" use:enhance>
			<input type="hidden" value={selectedDevice.id} name="selectedDevice" />
			<input type="hidden" value={selectedDeviceOwner._id} name="selectedOwner" />
			<h1 class="cosmo-modal__title">Gerät löschen</h1>
			<div class="cosmo-modal__content">
				<p>
					Soll das Gerät {selectedDevice.model} von {selectedDeviceOwner.name} wirklich gelöscht werden?
				</p>
			</div>
			<div class="cosmo-modal__button-bar">
				<button class="cosmo-button" on:click={() => (deleteOpen = false)}>Nicht löschen</button>
				<button class="cosmo-button" type="submit">Löschen</button>
			</div>
		</form>
	</div>
{/if}
{#if newOpen}
	<div class="cosmo-modal__container">
		<form class="cosmo-modal" method="post" action="?/createDevice" use:enhance>
			<h1 class="cosmo-modal__title">Gerät erstellen</h1>
			<div class="cosmo-modal__content">
				<div class="cosmo-input__group">
					<label for="createOwner" class="cosmo-label">Besitzer</label>
					<select id="createOwner" class="cosmo-select" name="owner" required>
						{#each data.owners as owner}
							<option selected={owner._id === selectedOwner?._id} value={owner._id}
								>{owner.name}</option
							>
						{/each}
					</select>
					<label for="createModel" class="cosmo-label">Model</label>
					<input id="createModel" class="cosmo-input" type="text" name="model" required />
					<label for="createManufacturer" class="cosmo-label">Hersteller</label>
					<input
						id="createManufacturer"
						class="cosmo-input"
						type="text"
						name="manufacturer"
						required
					/>
					<label for="createOperatingSystem" class="cosmo-label">Betriebssystem</label>
					<input
						id="createOperatingSystem"
						class="cosmo-input"
						type="text"
						name="os.name"
						required
					/>
					<label for="createOperatingSystemVersion" class="cosmo-label"
						>Betriebssystem Version</label
					>
					<input
						id="createOperatingSystemVersion"
						class="cosmo-input"
						type="text"
						name="os.version"
					/>
					<label for="createStorage" class="cosmo-label">Speicherplatz in GB</label>
					<input id="createStorage" class="cosmo-input" type="number" name="storage" />
					<label for="createRam" class="cosmo-label">Arbeitsspeicher in GB</label>
					<input id="createRam" class="cosmo-input" type="number" name="ram" />
					<label for="createEol" class="cosmo-label">Supportende</label>
					<input id="createEol" class="cosmo-input" type="date" name="eol" />
				</div>
			</div>
			<div class="cosmo-modal__button-bar">
				<button class="cosmo-button" on:click={() => (newOpen = false)}>Verwerfen</button>
				<button class="cosmo-button" type="submit">Gerät erstellen</button>
			</div>
		</form>
	</div>
{/if}
{#if editOpen}
	<div class="cosmo-modal__container">
		<form class="cosmo-modal" method="post" action="?/editDevice" use:enhance>
			<h1 class="cosmo-modal__title">Gerät bearbeiten</h1>
			<div class="cosmo-modal__content">
				<div class="cosmo-input__group">
					<input type="hidden" value={selectedDevice.id} name="id" />
					<input type="hidden" value={selectedDeviceOwner._id} name="owner" />
					<label for="editModel" class="cosmo-label">Model</label>
					<input
						id="editModel"
						class="cosmo-input"
						type="text"
						name="model"
						required
						value={selectedDevice.model}
					/>
					<label for="editManufacturer" class="cosmo-label">Hersteller</label>
					<input
						id="editManufacturer"
						class="cosmo-input"
						type="text"
						name="manufacturer"
						required
						value={selectedDevice.manufacturer}
					/>
					<label for="editOperatingSystem" class="cosmo-label">Betriebssystem</label>
					<input
						id="editOperatingSystem"
						class="cosmo-input"
						type="text"
						name="os.name"
						required
						value={selectedDevice.os?.name ?? ''}
					/>
					<label for="editOperatingSystemVersion" class="cosmo-label">Betriebssystem Version</label>
					<input
						id="editOperatingSystemVersion"
						class="cosmo-input"
						type="text"
						name="os.version"
						value={selectedDevice.os?.version ?? ''}
					/>
					<label for="editStorage" class="cosmo-label">Speicherplatz in GB</label>
					<input
						id="editStorage"
						class="cosmo-input"
						type="number"
						name="storage"
						value={selectedDevice.storage}
					/>
					<label for="editRam" class="cosmo-label">Arbeitsspeicher in GB</label>
					<input
						id="editRam"
						class="cosmo-input"
						type="number"
						name="ram"
						value={selectedDevice.ram}
					/>
					<label for="editEol" class="cosmo-label">Supportende</label>
					<input
						id="editEol"
						class="cosmo-input"
						type="date"
						name="eol"
						value={selectedDevice.eol?.toISOString().substring(0, 10)}
					/>
				</div>
			</div>
			<div class="cosmo-modal__button-bar">
				<button class="cosmo-button" on:click={() => (editOpen = false)}>Verwerfen</button>
				<button class="cosmo-button" type="submit">Gerät speichern</button>
			</div>
		</form>
	</div>
{/if}
{#if detailsOpen}
	<div class="cosmo-modal__container">
		<div class="cosmo-modal">
			<h1 class="cosmo-modal__title">{selectedDevice.model} von {selectedDeviceOwner.name}</h1>
			<div class="cosmo-modal__content">
				<h3>Gerät</h3>
				<dl class="cosmo-list is--key-value">
					<dt>Hersteller</dt>
					<dd>{selectedDevice.manufacturer}</dd>
					<dt>Model</dt>
					<dd>{selectedDevice.model}</dd>
				</dl>
				<h3>Software</h3>
				<dl class="cosmo-list is--key-value">
					{#if selectedDevice.hostname}
						<dt>Gerätename</dt>
						<dd>{selectedDevice.hostname}</dd>
					{/if}
					{#if selectedDevice.os}
						<dt>Betriebssystem</dt>
						<dd>{selectedDevice.os.name} {selectedDevice.os.version ?? ''}</dd>
					{/if}
					{#if selectedDevice.eol}
						<dt>Supportende</dt>
						<dd>{selectedDevice.eol?.toLocaleDateString()}</dd>
					{/if}
				</dl>
				<h3>Hardware</h3>
				<dl class="cosmo-list is--key-value">
					{#if selectedDevice.cpu}
						<dt>Prozessor</dt>
						<dd>
							{selectedDevice.cpu.manufacturer}
							{selectedDevice.cpu.model}
							{selectedDevice.cpu.cores}
							x {selectedDevice.cpu.speed} GHz
						</dd>
					{/if}
					<dt>Speicherplatz</dt>
					<dd>{selectedDevice.storage} GB</dd>
					<dt>Arbeitsspeicher</dt>
					<dd>{selectedDevice.ram} GB</dd>
				</dl>
			</div>
			<div class="cosmo-modal__button-bar">
				<button class="cosmo-button" on:click={() => (detailsOpen = false)}>Schließen</button>
			</div>
		</div>
	</div>
{/if}
