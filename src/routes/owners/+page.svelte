<script lang="ts">
	import type { Owner } from '$lib/database/models';
	import { enhance } from '$app/forms';
	import { qr } from '@svelte-put/qr/img';

	export let data;
	export let form;

	let createToken = false;
	let deleteOpen = false;
	let newToken = crypto.randomUUID();

	let selectedOwner: Owner;

	$: if (form?.deleteSuccess) {
		deleteOpen = false;
	}

	$: if (form?.createSuccess) {
		createToken = false;
	}

	function openDelete(owner: Owner) {
		if (owner._id !== data.me._id) {
			deleteOpen = true;
			selectedOwner = owner;
		}
	}

	function openCreateToken(owner: Owner) {
		createToken = true;
		selectedOwner = owner;
		newToken = crypto.randomUUID();
	}
</script>

<h1 class="cosmo-title">Besitzer</h1>
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
					<button
						class="cosmo-button is--small is--primary"
						on:click={() => openCreateToken(owner)}
					>
						Token erstellen
					</button>
					<button
						class="cosmo-button is--small is--negative"
						on:click={() => openDelete(owner)}
						disabled={owner._id === data.me._id}
					>
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
{#if createToken}
	<div class="cosmo-modal__container">
		<form class="cosmo-modal" method="post" action="?/createToken" use:enhance>
			<h1 class="cosmo-modal__title">Token erstellen</h1>
			<div class="cosmo-modal__content">
				<div class="jewels-new">
					<div>
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
									width: 450,
									height: 450
								}}
								alt={newToken}
							/>
						</div>
					</div>
					<div>
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

	.jewels-new {
		display: grid;
		grid-template-columns: 1fr 1fr;
	}
</style>
