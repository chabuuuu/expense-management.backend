class BaseError extends Error {
    public statusCode: number;
    public status: string;
    public message: string;
    constructor(statusCode: number, status: string, message: any) {
        super(message);
        Object.setPrototypeOf(this, new.target.prototype);
        this.status = status;
        this.statusCode = statusCode;
        this.message = message;
        Error.captureStackTrace(this);
    }
}
export default BaseError;
