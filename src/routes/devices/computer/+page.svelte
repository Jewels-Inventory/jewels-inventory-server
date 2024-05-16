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

<h1 class="cosmo-title">Computer & Laptops</h1>
<div class="cosmo-toolbar">
	<div class="cosmo-toolbar__group">
		<button class="cosmo-button" on:click={() => (newOpen = true)}>Neues Gerät</button>
	</div>
</div>
<table class="cosmo-table">
	<thead>
	<tr>
		<th>Besitzer</th>
		<th>Name</th>
		<th>Model</th>
		<th>Hersteller</th>
		<th>Betriebssystem</th>
		<th>Prozessor</th>
		<th>Speicherplatz</th>
		<th>Arbeitsspeicher</th>
		<th>Aktionen</th>
	</tr>
	</thead>
	<tbody>
	{#each data.owners as owner}
		{#each owner.devices.filter((d) => d.type === Type.Computer) as device}
			<tr>
				<td>{owner.name}</td>
				<td>{device.hostname}</td>
				<td>{device.model}</td>
				<td>{device.manufacturer}</td>
				<td>{device.os?.name} {device.os?.version ?? ''}</td>
				<td>
					{#if device.cpu}
						{device.cpu.model}
					{/if}
				</td>
				<td>
					{#if device.storage}
						{device.storage} GB
					{/if}
				</td>
				<td>
					{#if device.ram}
						{device.ram} GB
					{/if}
				</td>
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
					<select id="createOwner" class="cosmo-select" name="ownerId" required>
						{#each data.owners as owner}
							<option selected={owner._id === selectedOwner?._id} value={owner._id}
							>{owner.name}</option
							>
						{/each}
					</select>
					<label for="createHostname" class="cosmo-label">Hostname</label>
					<input id="createHostname" class="cosmo-input" type="text" name="hostname" required />
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
					<input id="createStorage" class="cosmo-input" type="number" name="storage" required />
					<label for="createRam" class="cosmo-label">Arbeitsspeicher in GB</label>
					<input id="createRam" class="cosmo-input" type="number" name="ram" required />
					<span class="cosmo-input__header">Prozessor</span>
					<label for="createCpuManufacturer" class="cosmo-label">Hersteller</label>
					<select id="createCpuManufacturer" class="cosmo-select" name="cpu.manufacturer" required>
						<option value="GenuineIntel">Intel</option>
						<option value="AuthenticAMD">AMD</option>
					</select>
					<label for="createCpuModel" class="cosmo-label">Model</label>
					<input id="createCpuModel" class="cosmo-input" type="text" name="cpu.model" required />
					<label for="createCpuSpeed" class="cosmo-label">Geschwindigkeit in GHz</label>
					<input id="createCpuSpeed" class="cosmo-input" type="number" name="cpu.speed" required />
					<label for="createCpuCores" class="cosmo-label">Kerne</label>
					<input id="createCpuCores" class="cosmo-input" type="number" name="cpu.cores" required />
					<label for="createCpuThreads" class="cosmo-label">Threads</label>
					<input
						id="createCpuThreads"
						class="cosmo-input"
						type="number"
						name="cpu.threads"
						required
					/>
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
					<input type="hidden" name="ownerId" value={selectedDeviceOwner._id} />
					<input type="hidden" name="deviceId" value={selectedDevice.id} />
					<label for="editHostname" class="cosmo-label">Hostname</label>
					<input
						id="editHostname"
						class="cosmo-input"
						type="text"
						name="hostname"
						required
						value={selectedDevice.hostname}
					/>
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
						value={selectedDevice.os?.name}
					/>
					<label for="editOperatingSystemVersion" class="cosmo-label">Betriebssystem Version</label>
					<input
						id="editOperatingSystemVersion"
						class="cosmo-input"
						type="text"
						name="os.version"
						value={selectedDevice.os?.version}
					/>
					<label for="editStorage" class="cosmo-label">Speicherplatz in GB</label>
					<input
						id="editStorage"
						class="cosmo-input"
						type="number"
						name="storage"
						required
						value={selectedDevice.storage}
					/>
					<label for="editRam" class="cosmo-label">Arbeitsspeicher in GB</label>
					<input
						id="editRam"
						class="cosmo-input"
						type="number"
						name="ram"
						required
						value={selectedDevice.ram}
					/>
					<span class="cosmo-input__header">Prozessor</span>
					<label for="editCpuManufacturer" class="cosmo-label">Hersteller</label>
					<select
						id="editCpuManufacturer"
						class="cosmo-select"
						name="cpu.manufacturer"
						required
						value={selectedDevice.cpu?.manufacturer}
					>
						<option value="GenuineIntel">Intel</option>
						<option value="AuthenticAMD">AMD</option>
					</select>
					<label for="editCpuModel" class="cosmo-label">Model</label>
					<input
						id="editCpuModel"
						class="cosmo-input"
						type="text"
						name="cpu.model"
						required
						value={selectedDevice.cpu?.model}
					/>
					<label for="editCpuSpeed" class="cosmo-label">Geschwindigkeit in GHz</label>
					<input
						id="editCpuSpeed"
						class="cosmo-input"
						type="number"
						name="cpu.speed"
						required
						value={selectedDevice.cpu?.speed}
					/>
					<label for="editCpuCores" class="cosmo-label">Kerne</label>
					<input
						id="editCpuCores"
						class="cosmo-input"
						type="number"
						name="cpu.cores"
						required
						value={selectedDevice.cpu?.cores}
					/>
					<label for="editCpuThreads" class="cosmo-label">Threads</label>
					<input
						id="editCpuThreads"
						class="cosmo-input"
						type="number"
						name="cpu.threads"
						required
						value={selectedDevice.cpu?.threads}
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
			<h1 class="cosmo-modal__title">{selectedDevice.hostname} von {selectedDeviceOwner.name}</h1>
			<div class="cosmo-modal__content">
				<h3>Gerät</h3>
				<dl class="cosmo-list is--key-value">
					<dt>Name</dt>
					<dd>{selectedDevice.hostname}</dd>
					<dt>Hersteller</dt>
					<dd>{selectedDevice.manufacturer}</dd>
					<dt>Model</dt>
					<dd>{selectedDevice.model}</dd>
				</dl>
				<h3>Software</h3>
				{#if selectedDevice.os}
					<h4>Betriebssystem</h4>
					<dl class="cosmo-list is--key-value">
						<dt>Name</dt>
						<dd>{selectedDevice.os.name}</dd>
						<dt>Version</dt>
						<dd>{selectedDevice.os.version ?? ''}</dd>
					</dl>
				{/if}
				{#if selectedDevice.kernel}
					<h4>Kernel</h4>
					<dl class="cosmo-list is--key-value">
						<dt>Version</dt>
						<dd>{selectedDevice.kernel.version}</dd>
						<dt>Release</dt>
						<dd>{selectedDevice.kernel.release}</dd>
						<dt>Architektur</dt>
						<dd>{selectedDevice.kernel.architecture}</dd>
					</dl>
				{/if}
				<h3>Hardware</h3>
				{#if selectedDevice.cpu}
					<h4>Prozessor</h4>
					<dl class="cosmo-list is--key-value">
						<dt>Hersteller</dt>
						<dd>{selectedDevice.cpu.manufacturer}</dd>
						<dt>Model</dt>
						<dd>{selectedDevice.cpu.model}</dd>
						<dt>Kerne</dt>
						<dd>{selectedDevice.cpu.cores}</dd>
						<dt>Threads</dt>
						<dd>{selectedDevice.cpu.threads}</dd>
						<dt>Geschwindigkeit</dt>
						<dd>{selectedDevice.cpu.speed} GHz</dd>
					</dl>
				{/if}
				<h4>Speicher</h4>
				<dl class="cosmo-list is--key-value">
					<dt>Speicherplatz</dt>
					<dd>{selectedDevice.storage} GB</dd>
					<dt>Arbeitsspeicher</dt>
					<dd>{selectedDevice.ram} GB</dd>
				</dl>
				{#if selectedDevice.mainboard}
					<h4>Mainboard</h4>
					<dl class="cosmo-list is--key-value">
						<dt>Hersteller</dt>
						<dd>{selectedDevice.mainboard.manufacturer}</dd>
						<dt>Model</dt>
						<dd>{selectedDevice.mainboard.model}</dd>
						<dt>Version</dt>
						<dd>{selectedDevice.mainboard.version}</dd>
						<dt>Seriennummer</dt>
						<dd>{selectedDevice.mainboard.serial}</dd>
					</dl>
				{/if}
				{#if selectedDevice.bios}
					<h4>BIOS/UEFI</h4>
					<dl class="cosmo-list is--key-value">
						<dt>Hersteller</dt>
						<dd>{selectedDevice.bios.manufacturer}</dd>
						<dt>Version</dt>
						<dd>{selectedDevice.bios.version}</dd>
					</dl>
				{/if}
			</div>
			<div class="cosmo-modal__button-bar">
				<button class="cosmo-button" on:click={() => (detailsOpen = false)}>Schließen</button>
			</div>
		</div>
	</div>
{/if}
