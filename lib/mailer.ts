import { createTransport, type SendMailOptions } from 'nodemailer';

export async function sendMail(to: string, subject: string, text: string, html: string) {
	const transportOptions = {
		host: process.env.MAILER_SERVER as string,
		port: parseInt(process.env.MAILER_PORT as string, 10),
		secure: false,
		auth: {
			user: process.env.MAILER_USER as string,
			pass: process.env.MAILER_PASSWORD as string
		}
	};
	const transport = createTransport(transportOptions);
	const mail: SendMailOptions = {
		from: {
			name: 'Jewels',
			address: process.env.MAILER_FROM as string
		},
		to,
		subject,
		text,
		html
	};
	await transport.sendMail(mail);
}
