import { match } from "assert";
import { NotFoundError, ValidationError } from "./errors";

const mapDbError = {
	auth(error: any): Error {
		if (error.code === "23505") {
			if (error.detail.includes("username")) {
				return new ValidationError("Username already exists.");
			} else if (error.detail.includes("email")) {
				return new ValidationError("Email already exists.");
			}
		} else if (error.code === "23502") {
			if (error.column.includes("username")) {
				return new ValidationError("Username is required.");
			} else if (error.column.includes("email")) {
				return new ValidationError("Email is required.");
			} else if (error.column.includes("first_name")) {
				return new ValidationError("First name is required.");
			} else if (error.column.includes("last_name")) {
				return new ValidationError("Last name is required.");
			} else if (error.column.includes("password")) {
				return new ValidationError("Password is required.");
			}
		}
		return error;
	},

	user(error: any): Error {
		if (error.code === "23505") {
			if (error.detail.includes("username")) {
				return new ValidationError("Username already exists.");
			} else if (error.detail.includes("email")) {
				return new ValidationError("Email already exists.");
			}
		} else if (error.code === "23502") {
			if (error.column.includes("username")) {
				return new ValidationError("Username is required.");
			} else if (error.column.includes("email")) {
				return new ValidationError("Email is required.");
			} else if (error.column.includes("first_name")) {
				return new ValidationError("First name is required.");
			} else if (error.column.includes("last_name")) {
				return new ValidationError("Last name is required.");
			} else if (error.column.includes("password")) {
				return new ValidationError("Password is required.");
			}
		}
		return error;
	},

	like(error: any): Error {
		if (error.code === "23514") return new ValidationError("Liker ID and liked ID cannot be the same.");
		else if (error.code === "23503") return new ValidationError("Liker ID or liked ID does not exist.");
		else if (error.code === "23505") return new ValidationError("Like already exists.");
		return error;
	},

	match(error: any): Error {
		return error;
	},

	block(error: any): Error {
		if (error.code === "23514") return new ValidationError("Blocker ID and blocked ID cannot be the same.");
		else if (error.code === "23503") return new ValidationError("Blocker ID or blocked ID does not exist.");
		else if (error.code === "23505") return new ValidationError("Block already exists.");
		return error;
	},
	chat(error: any): Error {
		if (error.code === "23503") {
			if (error.detail.includes("user1_id")) return new NotFoundError("User1 does not exist.");
			if (error.detail.includes("sender_id")) return new NotFoundError("Sender does not exist.");
			if (error.detail.includes("chat_id")) return new NotFoundError("Chat does not exist.");
		}
		if (error.code === "23505") return new NotFoundError("Chat already exists.");
		return error;
	},

	emailVerification(error: any): Error {
		return error;
	},
};

export default mapDbError;
