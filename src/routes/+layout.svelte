<script lang="ts">
	import '@jinyacms/cosmo/cosmo.scss';
	import { page } from '$app/stores';

	let activeRoute = '';

	page.subscribe((data) => {
		activeRoute = data.url.pathname;
	});
</script>

<svelte:head>
	<title>Jewels Inventory</title>
</svelte:head>

<main class="cosmo-page">
	<div class="cosmo-menu is--top">
		<div class="cosmo-profile-picture"></div>
	</div>
	<div class="cosmo-menu">
		<button class="cosmo-back-button" on:click={history.back} type="button"></button>
		<nav class="cosmo-menu__collection">
			<div class="cosmo-menu__row is--main">
				<a
					class="cosmo-menu__item is--main"
					class:is--active={activeRoute.startsWith('/devices/')}
					href="/">Geräte</a
				>
				<a
					class="cosmo-menu__item is--main"
					class:is--active={activeRoute === '/owners'}
					href="/owners">Besitzer</a
				>
				<a
					class="cosmo-menu__item is--main"
					class:is--active={activeRoute === '/settings'}
					href="/settings">Einstellungen</a
				>
			</div>
			<div class="cosmo-menu__row is--sub">
				{#if activeRoute.startsWith('/devices/')}
					<a
						class="cosmo-menu__item is--sub"
						class:is--active={activeRoute === '/devices/phones'}
						href="/devices/phones">Smartphones & Tablets</a
					>
					<a
						class="cosmo-menu__item is--sub"
						class:is--active={activeRoute === '/devices/computer'}
						href="/devices/computer">Computer & Laptops</a
					>
					<a
						class="cosmo-menu__item is--sub"
						class:is--active={activeRoute === '/devices/watches'}
						href="/devices/watches">Smartwatches</a
					>
					<a
						class="cosmo-menu__item is--sub"
						class:is--active={activeRoute === '/devices/other'}
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

<style>
	:root {
		--primary-hue: 200;
		--primary-lightness-base: 55;
		--primary-saturation: 87;
	}
</style>
