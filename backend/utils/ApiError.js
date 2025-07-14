class ApiError extends Error {
    constructor(statusCode, message) {
        super(message);
        this.statusCode = statusCode;
        this.data = null; // Optional data field for additional information
        this.message = message;
        this.success = false; // Indicates that this is an error response
        this.errors = []; // Array to hold validation or other errors
        this.stack = (new Error()).stack; // Capture the stack trace for debugging
    }

    static badRequest(message) {
        return new ApiError(400, message || "Bad Request");
    }

    static unauthorized(message) {
        return new ApiError(401, message || "Unauthorized");
    }

    static forbidden(message) {
        return new ApiError(403, message || "Forbidden");
    }

    static notFound(message) {
        return new ApiError(404, message || "Not Found");
    }

    static internalServerError(message) {
        return new ApiError(500, message || "Internal Server Error");
    }
}


export { ApiError };