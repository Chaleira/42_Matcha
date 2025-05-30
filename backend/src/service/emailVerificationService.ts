import { emailVerificationModel, IEmailVerification } from "../model/emailVerificationModel";
import mapDbError from "../utils/mapDbError";
import crypto from "crypto";
import nodemailer from "nodemailer";
import { EMAIL_PASS, EMAIL_USER, URL_FRONTEND } from "../config/config";

export const emailVerificationService = {
	async createEmailVerification(userId: number, token: string): Promise<IEmailVerification> {
		try {
			const emailVerification = {
				user_id: userId,
				token,
				created_at: new Date(),
				expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 day expiration
			};

			return await emailVerificationModel.create(emailVerification);
		} catch (error: any) {
			throw mapDbError.emailVerification(error);
		}
	},

	async generateEmailVerificationToken(): Promise<string> {
		return crypto.randomBytes(32).toString("hex");
	},

	async findByToken(token: string): Promise<IEmailVerification | null> {
		try {
			return await emailVerificationModel.findByToken(token);
		} catch (error: any) {
			throw mapDbError.emailVerification(error);
		}
	},

	async findByUserId(userId: number): Promise<IEmailVerification | null> {
		try {
			return await emailVerificationModel.findByUserId(userId);
		} catch (error: any) {
			throw mapDbError.emailVerification(error);
		}
	},

	async updateEmailVerification(id: number, updates: Partial<IEmailVerification>): Promise<IEmailVerification> {
		try {
			return await emailVerificationModel.update(id, updates);
		} catch (error: any) {
			throw mapDbError.emailVerification(error);
		}
	},

	async deleteEmailVerification(id: number): Promise<void> {
		try {
			await emailVerificationModel.delete(id);
		} catch (error: any) {
			throw mapDbError.emailVerification(error);
		}
	},

	async sendVerificationEmail(email: string, token: string, emailVars: {text: string, subject: string, url: string}): Promise<void> {
		try {
			const transporter = nodemailer.createTransport({
				service: "gmail", // or use a real SMTP service like Mailgun/SendGrid
				auth: {
					user: EMAIL_USER,
					pass: EMAIL_PASS,
				},
			});

			await transporter.sendMail({
				from: '"Your App" <noreply@yourapp.com>',
				to: email,
				subject: emailVars.subject,
				html: `<p>Click <a href="https://${URL_FRONTEND}/${emailVars.url}?token=${token}">here</a>${emailVars.text}</p>`,
			});
		} catch (error: any) {
			throw mapDbError.emailVerification(error);
		}
	},
};
