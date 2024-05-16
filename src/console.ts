#!/usr/bin/env node
// noinspection ES6PreferShortImport
import { getAdmins, getOwners } from './lib/database/client';
import { sendMail } from '../lib/mailer';
import type { Device, Owner } from '$lib/database/models';

const allAdmins = await getAdmins();
const adminNames = allAdmins.map(admin => admin.name);
const lastEntry = adminNames.pop();
let adminNamesAsString = adminNames.join(', ');
if (adminNamesAsString === '') {
	adminNamesAsString = lastEntry as string;
} else {
	adminNamesAsString = adminNamesAsString + ' oder ' + lastEntry;
}

function getOwnerText(owner: Owner, device: Device) {
	return `Hallo ${owner.name},\n
\n
dein ${device.manufacturer} ${device.model} bekommt am ${(device.eol as Date).toLocaleDateString('de', { dateStyle: 'long' })} das letzte Update.\n
\n
Damit dein neues Gerät wieder möglichst lange hält und dir viel Freude bereitet wende dich an ${adminNamesAsString}, um ein neues Gerät für die zu finden 🙂\n
\n
Alles Gute und vergiss es nicht,\n
Dein Jewly der Jewels Bot`;
}

function getOwnerHtml(owner: Owner, device: Device) {
	return `
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
		<link href="https://fonts.jinya.de/css?family=Albert+Sans" rel="stylesheet" type="text/css">
		<style type="text/css">
			@import url(https://fonts.jinya.de/css?family=Albert+Sans);
		</style>
  </head>
  <body style="word-spacing:normal;background-color:#FFFFFF;font-family:'Albert Sans',sans-serif;color:#333333;">
  	<p>
			Hey ${owner.name},<br><br>
			dein ${device.manufacturer} ${device.model} bekommt am ${(device.eol as Date).toLocaleDateString('de', { dateStyle: 'long' })} das letzte Update.
		</p>
		<p>
			Damit dein neues Gerät wieder möglichst lange hält und dir viel Freude bereitet wende dich an ${adminNamesAsString}, um ein neues Gerät für dich zu finden 🙂
 		</p>
		<p>
			Alles Gute und vergiss es nicht,<br>
			Dein Jewly der Jewels Bot
		</p>
	</body>
</html>`;
}

function getAdminText(admin: Owner, owner: Owner, device: Device) {
	return `Hallo ${admin.name},\n
\n
das ${device.manufacturer} ${device.model} von ${owner.name} bekommt am ${(device.eol as Date).toLocaleDateString('de', { dateStyle: 'long' })} das letzte Update.\n
\n
Bitte setze dich mit ${owner.name} in Verbindung um ein neues Gerät zu besorgen.
\n
Alles Gute und vergiss es nicht,\n
Dein Jewly der Jewels Bot`;
}

function getAdminHtml(admin: Owner, owner: Owner, device: Device) {
	return `
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
		<link href="https://fonts.jinya.de/css?family=Albert+Sans" rel="stylesheet" type="text/css">
		<style type="text/css">
			@import url(https://fonts.jinya.de/css?family=Albert+Sans);
		</style>
  </head>
  <body style="word-spacing:normal;background-color:#FFFFFF;font-family:'Albert Sans',sans-serif;color:#333333;">
  	<p>
			Hey ${admin.name},<br><br>
			das ${device.manufacturer} ${device.model} von ${owner.name} bekommt am ${(device.eol as Date).toLocaleDateString('de', { dateStyle: 'long' })} das letzte Update.
		</p>
		<p>
			Bitte setze dich mit ${owner.name} in Verbindung um ein neues Gerät zu besorgen.
 		</p>
		<p>
			Alles Gute und vergiss es nicht,<br>
			Dein Jewly der Jewels Bot
		</p>
	</body>
</html>`;
}

console.log('Check for eol');

const owners = await getOwners();
for (const owner of owners) {
	console.log(`Checking devices of ${owner.name}`);
	for (const device of owner.devices.filter(d => d.eol)) {
		console.log(`Checking device ${device.manufacturer} ${device.model} with eol ${(device.eol as Date).toISOString()}`);
		const oneMonthBeforeEol = device.eol as Date;
		oneMonthBeforeEol.setMonth(oneMonthBeforeEol.getMonth() - 1);
		oneMonthBeforeEol.setHours(0, 0, 0, 0);
		const today = new Date();
		today.setHours(0, 0, 0, 0);
		if (oneMonthBeforeEol.getTime() === today.getTime()) {
			await sendMail(owner.email, `Dein ${device.model} hat bald keinen Support mehr`, getOwnerText(owner, device), getOwnerHtml(owner, device));
			for (const admin of allAdmins) {
				await sendMail(owner.email, `Das ${device.model} von ${owner.name} hat bald keinen Support mehr`, getAdminText(admin, owner, device), getAdminHtml(admin, owner, device));
			}
		}
	}
}

console.log('Checked for eol');