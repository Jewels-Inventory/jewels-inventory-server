<script lang="ts">
	import { type Device, Type } from '$lib/database/models';
	import { enhance } from '$app/forms';
	import { qr } from '@svelte-put/qr/img';

	export let data;
	export let form;

	let deleteOpen = false;
	let newOpen = false;
	let editOpen = false;
	let newTab = 'code';
	let newDeviceType = Type.PhoneOrTablet;
	let newToken = crypto.randomUUID();

	let selectedDevice: Device | null;

	$: selectedDeviceType = selectedDevice?.type as Type;

	$: if (data?.devices) {
		if (data.devices.length > 0) {
			selectedDevice = data.devices[0];
		} else {
			selectedDevice = null;
		}
	}

	function openNew() {
		if (data?.deviceType === '-1') {
			newDeviceType = Type.PhoneOrTablet;
		} else {
			newDeviceType = data.deviceType as Type;
		}

		newOpen = true;
		newToken = crypto.randomUUID();
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

<div class="cosmo-side-list">
	<nav class="cosmo-side-list__items">
		<a href="/my-jewels" class="cosmo-side-list__item" class:is--active={data.deviceType === '-1'}
		>Alle Geräte</a
		>
		<a
			href="/my-jewels/phone"
			class="cosmo-side-list__item"
			class:is--active={data.deviceType === Type.PhoneOrTablet}>Smartphones & Tablets</a
		>
		<a
			href="/my-jewels/computer"
			class="cosmo-side-list__item"
			class:is--active={data.deviceType === Type.Computer}>Computer & Laptops</a
		>
		<a
			href="/my-jewels/watch"
			class="cosmo-side-list__item"
			class:is--active={data.deviceType === Type.Smartwatch}>Smartwatches</a
		>
		<a
			href="/my-jewels/other"
			class="cosmo-side-list__item"
			class:is--active={data.deviceType === Type.Other}>Sonstiges</a
		>
		<button class="cosmo-button is--full-width" on:click={openNew}>Gerät hinzufügen</button>
	</nav>
	<div class="cosmo-side-list__content">
		<div class="cosmo-tab">
			<div class="cosmo-tab__links">
				{#each data?.devices ?? [] as device}
					<a
						class="cosmo-tab__link"
						class:is--active={selectedDevice?.id === device.id}
						on:click={() => (selectedDevice = device)}
					>
						{#if device.type === Type.Computer}
							{device.hostname}
						{:else}
							{device.manufacturer} {device.model}
						{/if}
					</a>
				{/each}
			</div>
			{#if selectedDevice}
				<div class="cosmo-tab__content">
					<span class="cosmo-title">
						{#if selectedDevice.type === Type.Computer}
							{selectedDevice.hostname}
						{:else}
							{selectedDevice.manufacturer} {selectedDevice.model}
						{/if}
						{#if selectedDevice.os}
							<small>{selectedDevice.os.name ?? ''} {selectedDevice.os.version ?? ''}</small>
						{/if}
					</span>
					<div class="cosmo-toolbar">
						<div class="cosmo-toolbar__group">
							<button class="cosmo-button" on:click={() => (editOpen = true)}>Bearbeiten</button>
							<button class="cosmo-button is--negative" on:click={() => (deleteOpen = true)}
							>Löschen
							</button
							>
						</div>
					</div>
					<h2>Gerät</h2>
					<dl class="cosmo-list is--key-value">
						{#if selectedDevice.hostname}
							<dt>Name</dt>
							<dd>{selectedDevice.hostname}</dd>
						{/if}
						<dt>Hersteller</dt>
						<dd>{selectedDevice.manufacturer}</dd>
						<dt>Model</dt>
						<dd>{selectedDevice.model}</dd>
					</dl>
					{#if selectedDevice.os || selectedDevice.kernel}
						<h2>Software</h2>
						{#if selectedDevice.os}
							<h3>Betriebssystem</h3>
							<dl class="cosmo-list is--key-value">
								<dt>Name</dt>
								<dd>{selectedDevice.os.name}</dd>
								<dt>Version</dt>
								<dd>{selectedDevice.os.version ?? ''}</dd>
							</dl>
						{/if}
						{#if selectedDevice.kernel}
							<h3>Kernel</h3>
							<dl class="cosmo-list is--key-value">
								<dt>Version</dt>
								<dd>{selectedDevice.kernel.version}</dd>
								<dt>Release</dt>
								<dd>{selectedDevice.kernel.release}</dd>
								<dt>Architektur</dt>
								<dd>{selectedDevice.kernel.architecture}</dd>
							</dl>
						{/if}
					{/if}
					{#if selectedDevice.cpu || selectedDevice.storage || selectedDevice.ram || selectedDevice.mainboard || selectedDevice.bios}
						<h2>Hardware</h2>
						{#if selectedDevice.cpu}
							<h3>Prozessor</h3>
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
						{#if selectedDevice.storage || selectedDevice.ram}
							<h3>Speicher</h3>
							<dl class="cosmo-list is--key-value">
								{#if selectedDevice.storage}
									<dt>Speicherplatz</dt>
									<dd>{selectedDevice.storage} GB</dd>
								{/if}
								{#if selectedDevice.ram}
									<dt>Arbeitsspeicher</dt>
									<dd>{selectedDevice.ram} GB</dd>
								{/if}
							</dl>
						{/if}
						{#if selectedDevice.drives}
							<h3>Festplatten</h3>
							{#each selectedDevice.drives as drive}
								<h4>{drive.name}</h4>
								<dl class="cosmo-list is--key-value">
									<dt>Hersteller</dt>
									<dd>{drive.manufacturer}</dd>
									<dt>Model</dt>
									<dd>{drive.model}</dd>
									<dt>Treiber</dt>
									<dd>{drive.driver}</dd>
									<dt>Größe</dt>
									<dd>{drive.size} GB</dd>
								</dl>
							{/each}
						{/if}
						{#if selectedDevice.mainboard}
							<h3>Mainboard</h3>
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
							<h3>BIOS/UEFI</h3>
							<dl class="cosmo-list is--key-value">
								<dt>Hersteller</dt>
								<dd>{selectedDevice.bios.manufacturer}</dd>
								<dt>Version</dt>
								<dd>{selectedDevice.bios.version}</dd>
							</dl>
						{/if}
					{/if}
				</div>
			{:else}
				<div class="cosmo-message is--information">
					<span class="cosmo-message__header">Keine Geräte</span>
					<p class="cosmo-message__message">
						Du hast noch keine Geräte erstellt.
					</p>
				</div>
			{/if}
		</div>
	</div>
</div>
{#if deleteOpen}
	<div class="cosmo-modal__container">
		<form class="cosmo-modal is--negative" method="post" action="?/deleteDevice" use:enhance>
			<input type="hidden" value={selectedDevice?.id} name="selectedDevice" />
			<h1 class="cosmo-modal__title">Gerät löschen</h1>
			<div class="cosmo-modal__content">
				<p>
					Soll das Gerät {selectedDevice?.model} wirklich gelöscht werden?
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
				<div class="cosmo-tab">
					<div class="cosmo-tab__links">
						<a
							class="cosmo-tab__link"
							class:is--active={newTab === 'code'}
							on:click={() => (newTab = 'code')}>Automatisch</a
						>
						<a
							class="cosmo-tab__link"
							class:is--active={newTab === 'manual'}
							on:click={() => (newTab = 'manual')}>Von Hand</a
						>
					</div>
					<div class="cosmo-tab__content">
						<input type="hidden" value={newTab} name="registryType" />
						{#if newTab === 'code'}
							<div class="cosmo-message is--information">
								<h3 class="cosmo-message__header">Wozu ist das Token da?</h3>
								<p class="cosmo-message__message">
									Das Token ist für die Jewels App oder den Jewels Linux Client,<br />
									um automatisiert Informationen über dein Gerät in Jewels zu speichern.<br />
									Um die Verwendung möglichst einfach zu machen,<br />
									kannst du den unten angezeigten QR Code einfach mit der Jewels App scannen.<br />
									Wenn du den Linux Client benutzt, musst du die Infos unter dem QR Code eintragen.
								</p>
							</div>
							<div class="cosmo-message is--warning">
								<h3 class="cosmo-message__header">Speicher dir das Token</h3>
								<p class="cosmo-message__message">
									Das Token ist nach dem Speichern nicht mehr verfügbar, bitte speicher es dir ab.
								</p>
							</div>
							<div class="token">
								<img
									use:qr={{
										data: JSON.stringify({
											token: newToken,
											host: location.origin
										}),
										logo: `${location.origin}/favicon.svg`,
										shape: 'circle',
										anchorInnerFill: '#28aef0',
										anchorOuterFill: '#28aef0',
										moduleFill: '#28aef0',
										backgroundFill: 'transparent',
										width: 500,
										height: 500
									}}
									alt={newToken}
								/>
							</div>
							<div class="cosmo-input__group">
								<label class="cosmo-label" for="createTokenUrl">Url</label>
								<input
									class="cosmo-input"
									type="text"
									readonly
									id="createTokenUrl"
									value={location.origin}
								/>
								<label class="cosmo-label" for="createTokenToken">Token</label>
								<input
									class="cosmo-input"
									type="text"
									readonly
									id="createTokenToken"
									name="token"
									value={newToken}
								/>
							</div>
						{:else if newTab === 'manual'}
							<div class="cosmo-input__group">
								<label for="createType" class="cosmo-label">Gerätetyp</label>
								<select
									id="createType"
									class="cosmo-select"
									name="deviceType"
									required
									bind:value={newDeviceType}
								>
									<option value={Type.PhoneOrTablet}>Smartphone oder Tablet</option>
									<option value={Type.Computer}>Computer oder Laptop</option>
									<option value={Type.Smartwatch}>Smartwatch</option>
									<option value={Type.Other}>Sonstiges</option>
								</select>
								{#if newDeviceType === Type.Computer}
									<label for="createHostname" class="cosmo-label">Name</label>
									<input
										id="createHostname"
										class="cosmo-input"
										type="text"
										name="hostname"
										required
									/>
								{/if}
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
								{#if [Type.Computer, Type.PhoneOrTablet].includes(newDeviceType)}
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
								{/if}
								{#if [Type.Computer, Type.PhoneOrTablet, Type.Smartwatch].includes(newDeviceType)}
									<label for="createStorage" class="cosmo-label">Speicherplatz in GB</label>
									<input
										id="createStorage"
										class="cosmo-input"
										type="number"
										name="storage"
										required={newDeviceType === Type.Computer}
									/>
									<label for="createRam" class="cosmo-label">Arbeitsspeicher in GB</label>
									<input
										id="createRam"
										class="cosmo-input"
										type="number"
										name="ram"
										required={newDeviceType === Type.Computer}
									/>
								{/if}
								{#if newDeviceType === Type.Computer}
									<span class="cosmo-input__header">Prozessor</span>
									<label for="createCpuManufacturer" class="cosmo-label">Hersteller</label>
									<select
										id="createCpuManufacturer"
										class="cosmo-select"
										name="cpu.manufacturer"
										required
									>
										<option value="GenuineIntel">Intel</option>
										<option value="AuthenticAMD">AMD</option>
									</select>
									<label for="createCpuModel" class="cosmo-label">Model</label>
									<input
										id="createCpuModel"
										class="cosmo-input"
										type="text"
										name="cpu.model"
										required
									/>
									<label for="createCpuSpeed" class="cosmo-label">Geschwindigkeit in GHz</label>
									<input
										id="createCpuSpeed"
										class="cosmo-input"
										type="number"
										name="cpu.speed"
										required
									/>
									<label for="createCpuCores" class="cosmo-label">Kerne</label>
									<input
										id="createCpuCores"
										class="cosmo-input"
										type="number"
										name="cpu.cores"
										required
									/>
									<label for="createCpuThreads" class="cosmo-label">Threads</label>
									<input
										id="createCpuThreads"
										class="cosmo-input"
										type="number"
										name="cpu.threads"
										required
									/>
								{/if}
								{#if [Type.PhoneOrTablet, Type.Other, Type.Smartwatch].includes(newDeviceType)}
									<label for="createEol" class="cosmo-label">Supportende</label>
									<input id="createEol" class="cosmo-input" type="date" name="eol" />
								{/if}
							</div>
						{/if}
					</div>
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
					<input type="hidden" name="deviceId" value={selectedDevice?.id} />
					{#if data.deviceType === Type.Computer}
						<label for="editHostname" class="cosmo-label">Name</label>
						<input
							id="editHostname"
							class="cosmo-input"
							type="text"
							name="hostname"
							required
							value={selectedDevice?.hostname}
						/>
					{/if}
					<label for="editModel" class="cosmo-label">Model</label>
					<input
						id="editModel"
						class="cosmo-input"
						type="text"
						name="model"
						required
						value={selectedDevice?.model}
					/>
					<label for="editManufacturer" class="cosmo-label">Hersteller</label>
					<input
						id="editManufacturer"
						class="cosmo-input"
						type="text"
						name="manufacturer"
						required
						value={selectedDevice?.manufacturer}
					/>
					{#if [Type.Computer, Type.PhoneOrTablet].includes(selectedDeviceType)}
						<label for="editOperatingSystem" class="cosmo-label">Betriebssystem</label>
						<input
							id="editOperatingSystem"
							class="cosmo-input"
							type="text"
							name="os.name"
							required
							value={selectedDevice?.os?.name}
						/>
						<label for="editOperatingSystemVersion" class="cosmo-label"
						>Betriebssystem Version</label
						>
						<input
							id="editOperatingSystemVersion"
							class="cosmo-input"
							type="text"
							name="os.version"
							value={selectedDevice?.os?.version}
						/>
					{/if}
					{#if [Type.Computer, Type.PhoneOrTablet, Type.Smartwatch].includes(selectedDeviceType)}
						<label for="editStorage" class="cosmo-label">Speicherplatz in GB</label>
						<input
							id="editStorage"
							class="cosmo-input"
							type="number"
							name="storage"
							required={selectedDeviceType === Type.Computer}
							value={selectedDevice?.storage}
						/>
						<label for="editRam" class="cosmo-label">Arbeitsspeicher in GB</label>
						<input
							id="editRam"
							class="cosmo-input"
							type="number"
							name="ram"
							required={selectedDeviceType === Type.Computer}
							value={selectedDevice?.ram}
						/>
					{/if}
					{#if selectedDeviceType === Type.Computer}
						<span class="cosmo-input__header">Prozessor</span>
						<label for="editCpuManufacturer" class="cosmo-label">Hersteller</label>
						<select
							id="editCpuManufacturer"
							class="cosmo-select"
							name="cpu.manufacturer"
							required
							value={selectedDevice?.cpu?.manufacturer}
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
							value={selectedDevice?.cpu?.model}
						/>
						<label for="editCpuSpeed" class="cosmo-label">Geschwindigkeit in GHz</label>
						<input
							id="editCpuSpeed"
							class="cosmo-input"
							type="number"
							name="cpu.speed"
							required
							value={selectedDevice?.cpu?.speed}
						/>
						<label for="editCpuCores" class="cosmo-label">Kerne</label>
						<input
							id="editCpuCores"
							class="cosmo-input"
							type="number"
							name="cpu.cores"
							required
							value={selectedDevice?.cpu?.cores}
						/>
						<label for="editCpuThreads" class="cosmo-label">Threads</label>
						<input
							id="editCpuThreads"
							class="cosmo-input"
							type="number"
							name="cpu.threads"
							required
							value={selectedDevice?.cpu?.threads}
						/>
					{/if}
					{#if [Type.PhoneOrTablet, Type.Other, Type.Smartwatch].includes(selectedDeviceType)}
						<label for="editEol" class="cosmo-label">Supportende</label>
						<input
							id="editEol"
							class="cosmo-input"
							type="date"
							name="eol"
							value={selectedDevice?.eol?.toISOString().substring(0, 10)}
						/>
					{/if}
				</div>
			</div>
			<div class="cosmo-modal__button-bar">
				<button class="cosmo-button" on:click={() => (editOpen = false)}>Verwerfen</button>
				<button class="cosmo-button" type="submit">Gerät speichern</button>
			</div>
		</form>
	</div>
{/if}

<style>
    .token {
        display: flex;
        justify-content: center;
    }
</style>
