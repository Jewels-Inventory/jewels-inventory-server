<script lang="ts">
	import '@jinyacms/cosmo/cosmo.scss';
	import '../css/variables.css';
	import '../css/typo.css';
	import { page } from '$app/stores';
	import { SignIn } from '@auth/sveltekit/components';
	import { signOut } from '@auth/sveltekit/client';

	let activeRoute = '';
	let activeParams = {};

	page.subscribe((data) => {
		activeRoute = data.route.id as string;
		activeParams = data.params;
	});
</script>

<svelte:head>
	<title>Jewels Inventory</title>
</svelte:head>

{#if $page.data.session}
	<main class="cosmo-page">
		<div class="cosmo-menu is--top">
			{#if $page.data.session.user?.image}
				<img
					src={$page.data.session.user.image}
					class="cosmo-profile-picture"
					alt={$page.data.session.user.name}
				/>
			{:else}
				<div class="cosmo-profile-picture"></div>
			{/if}
			<a class="cosmo-menu__item is--right" on:click={() => signOut()}>Abmelden</a>
		</div>
		<div class="cosmo-menu">
			<button class="cosmo-back-button" on:click={history.back} type="button"></button>
			<nav class="cosmo-menu__collection">
				<div class="cosmo-menu__row is--main">
					<a
						class="cosmo-menu__item is--main"
						class:is--active={activeRoute === '/my-jewels/[[type]]'}
						href="/my-jewels">Meine Jewels</a
					>
					{#if $page.data.owner?.roles?.includes('admin')}
						<a
							class="cosmo-menu__item is--main"
							class:is--active={activeRoute === '/devices/[[type]]'}
							href="/devices">Geräte</a
						>
						<a
							class="cosmo-menu__item is--main"
							class:is--active={activeRoute === '/owners'}
							href="/owners">Besitzer</a
						>
					{/if}
				</div>
				<div class="cosmo-menu__row is--sub">
					{#if $page.data.owner?.roles?.includes('admin') && activeRoute === '/devices/[[type]]'}
						<a
							class="cosmo-menu__item"
							class:is--active={!activeParams.type || activeParams.type === 'phones'}
							href="/devices/phones">Smartphones & Tablets</a
						>
						<a
							class="cosmo-menu__item"
							class:is--active={activeParams.type === 'computer'}
							href="/devices/computer">Computer & Laptops</a
						>
						<a
							class="cosmo-menu__item"
							class:is--active={activeParams.type === 'watches'}
							href="/devices/watches">Smartwatches</a
						>
						<a
							class="cosmo-menu__item"
							class:is--active={activeParams.type === 'other'}
							href="/devices/other">Sonstige</a
						>
					{/if}
				</div>
			</nav>
		</div>
		<div class="cosmo-page__body">
			<slot />
		</div>
	</main>
{:else}
	<main class="login-container">
		<div class="login-content">
			<span class="cosmo-title">Login</span>
			<SignIn provider="zitadel" className="jewels-signin cosmo-button is--primary">
				<span slot="submitButton">Bei Jewels anmelden</span>
			</SignIn>
		</div>
	</main>
{/if}

<style>
	.cosmo-page {
		backdrop-filter: var(--modal-backdrop);
		background: rgba(var(--white-base) var(--white-base) var(--white-base) / 90%);
	}

	.login-container {
		position: fixed;
		left: 0;
		right: 0;
		top: 0;
		bottom: 0;
		display: flex;
		justify-content: center;
		align-items: center;
		height: 100vh;
		width: 100vw;
		background: var(--background);
		background-size: cover;
		background-position-y: bottom;
	}

	.login-content {
		background: hsla(
			var(--primary-hue),
			var(--primary-saturation),
			var(--primary-lightness-base),
			0.25
		);
		padding: 2rem 4rem;
		backdrop-filter: blur(24px) saturate(90%);
		box-sizing: border-box;
		margin-top: 1.25rem;
		max-width: 40rem;
		border-radius: var(--border-radius);
		display: flex;
		flex-flow: column;
		gap: 1rem;
	}

	:global(.signInButton > button) {
		background: none;
		border: none;
		color: var(--button-color);
		font-size: var(--font-size);
		cursor: pointer;
		font-family: var(--font-family);
	}

	.cosmo-title {
		color: var(--white);
	}
</style>
