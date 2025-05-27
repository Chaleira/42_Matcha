export class AppError extends Error {
	public statusCode: number;

	constructor(message: string, statusCode = 500) {
		super(message);
		this.name = this.constructor.name;
		this.statusCode = statusCode;
		Error.captureStackTrace(this, this.constructor);
	}
}

export class NotFoundError extends AppError {
	constructor(message = "Not Found") {
		super(message, 404);
	}
}

export class ValidationError extends AppError {
	constructor(message = "Validation Error") {
		super(message, 400);
	}
}

export class UnauthorizedError extends AppError {
	constructor(message = "Unauthorized") {
		super(message, 401);
	}
}
