<script lang="ts">
	import type { Owner } from '$lib/database/models';
	import { enhance } from '$app/forms';
	import { qr } from '@svelte-put/qr/img';

	export let data;
	export let form;

	let deleteOpen = false;
	let newOpen = false;
	let editOpen = false;
	let createToken = false;
	let newToken = crypto.randomUUID();

	let selectedOwner: Owner;

	$: if (form?.deleteSuccess) {
		deleteOpen = false;
	}

	$: if (form?.newSuccess) {
		newOpen = false;
	}

	$: if (form?.editSuccess) {
		editOpen = false;
	}

	$: if (form?.createSuccess) {
		createToken = false;
	}

	function openEdit(owner: Owner) {
		editOpen = true;
		selectedOwner = owner;
	}

	function openDelete(owner: Owner) {
		deleteOpen = true;
		selectedOwner = owner;
	}

	function openCreateToken(owner: Owner) {
		createToken = true;
		selectedOwner = owner;
		newToken = crypto.randomUUID();
	}
</script>

<h1 class="cosmo-title">Besitzer</h1>
<div class="cosmo-toolbar">
	<div class="cosmo-toolbar__group">
		<button class="cosmo-button" on:click={() => (newOpen = true)}>Neuer Besitzer</button>
	</div>
</div>
<table class="cosmo-table">
	<thead>
		<tr>
			<th>Name</th>
			<th>Email</th>
			<th>Geräteanzahl</th>
			<th>Aktionen</th>
		</tr>
	</thead>
	<tbody>
		{#each data.owners as owner}
			<tr>
				<td>{owner.name}</td>
				<td>{owner.email}</td>
				<td>{owner.devices.length}</td>
				<td>
					<button class="cosmo-button is--small" on:click={() => openCreateToken(owner)}>
						Token erstellen
					</button>
					<button class="cosmo-button is--small" on:click={() => openEdit(owner)}>
						Bearbeiten
					</button>
					<button class="cosmo-button is--small is--negative" on:click={() => openDelete(owner)}>
						Löschen
					</button>
				</td>
			</tr>
		{/each}
	</tbody>
</table>
{#if deleteOpen}
	<div class="cosmo-modal__container">
		<form class="cosmo-modal is--negative" method="post" action="?/deleteOwner" use:enhance>
			<input type="hidden" value={selectedOwner._id} name="id" />
			<h1 class="cosmo-modal__title">Besitzer löschen</h1>
			<div class="cosmo-modal__content">
				<p>
					Soll der Besitzer {selectedOwner.name} wirklich gelöscht werden? Es werden auch alle Geräte
					gelöscht.
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
		<form class="cosmo-modal" method="post" action="?/createOwner" use:enhance>
			<h1 class="cosmo-modal__title">Besitzer erstellen</h1>
			<div class="cosmo-modal__content">
				<div class="cosmo-input__group">
					<label for="createName" class="cosmo-label">Name</label>
					<input id="createName" class="cosmo-input" type="text" name="name" required />
					<label for="createEmail" class="cosmo-label">Email</label>
					<input id="createEmail" class="cosmo-input" type="email" name="email" />
				</div>
			</div>
			<div class="cosmo-modal__button-bar">
				<button class="cosmo-button" on:click={() => (newOpen = false)}>Verwerfen</button>
				<button class="cosmo-button" type="submit">Besitzer erstellen</button>
			</div>
		</form>
	</div>
{/if}
{#if editOpen}
	<div class="cosmo-modal__container">
		<form class="cosmo-modal" method="post" action="?/editOwner" use:enhance>
			<h1 class="cosmo-modal__title">Besitzer bearbeiten</h1>
			<div class="cosmo-modal__content">
				<div class="cosmo-input__group">
					<input type="hidden" name="id" value={selectedOwner._id} />
					<label for="editName" class="cosmo-label">Name</label>
					<input
						id="editName"
						class="cosmo-input"
						type="text"
						name="name"
						required
						value={selectedOwner.name}
					/>
					<label for="editEmail" class="cosmo-label">Email</label>
					<input
						id="editEmail"
						class="cosmo-input"
						type="email"
						name="email"
						value={selectedOwner.email}
					/>
				</div>
			</div>
			<div class="cosmo-modal__button-bar">
				<button class="cosmo-button" on:click={() => (editOpen = false)}>Verwerfen</button>
				<button class="cosmo-button" type="submit">Besitzer speichern</button>
			</div>
		</form>
	</div>
{/if}
{#if createToken}
	<div class="cosmo-modal__container">
		<form class="cosmo-modal" method="post" action="?/createToken" use:enhance>
			<h1 class="cosmo-modal__title">Token erstellen</h1>
			<div class="cosmo-modal__content">
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
							backgroundFill: '#fff',
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
					<input type="hidden" value={selectedOwner._id} name="ownerId" />
				</div>
			</div>
			<div class="cosmo-modal__button-bar">
				<button class="cosmo-button" on:click={() => (createToken = false)}>Verwerfen</button>
				<button class="cosmo-button" type="submit">Token hinzufügen</button>
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
