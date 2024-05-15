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

<h1 class="cosmo-title">Sonstige Geräte <small>Drucker, 3D Drucker, Router etc.</small></h1>
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
			<th>Supportende</th>
			<th>Aktionen</th>
		</tr>
	</thead>
	<tbody>
		{#each data.owners as owner}
			{#each owner.devices.filter((d) => d.type === Type.Smartwatch) as device}
				<tr>
					<td>{owner.name}</td>
					<td>{device.model}</td>
					<td>{device.manufacturer}</td>
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
			<h1 class="cosmo-modal__title">Smartwatch erstellen</h1>
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
			<h1 class="cosmo-modal__title">Smartwatch bearbeiten</h1>
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
					{#if selectedDevice.eol}
						<dt>Supportende</dt>
						<dd>{selectedDevice.eol?.toLocaleDateString()}</dd>
					{/if}
				</dl>
			</div>
			<div class="cosmo-modal__button-bar">
				<button class="cosmo-button" on:click={() => (detailsOpen = false)}>Schließen</button>
			</div>
		</div>
	</div>
{/if}
