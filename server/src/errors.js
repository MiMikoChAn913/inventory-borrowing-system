export class AppError extends Error {
  constructor(status, code, message) {
    super(message);
    this.name = "AppError";
    this.status = status;
    this.code = code;
  }
}

export const notFound = (message) => new AppError(404, "NOT_FOUND", message);
export const forbidden = (message) => new AppError(403, "FORBIDDEN", message);
export const conflict = (message) => new AppError(409, "CONFLICT", message);
export const badRequest = (message) => new AppError(400, "BAD_REQUEST", message);
