class ApiError extends Error {
    constructor(
        statusCode,
        message = "Something went wrong",
        errors = [],
        stack = ""
    ) {
        super(message); // Call the built-in Error constructor

        this.statusCode = statusCode;     // HTTP status code (e.g., 400, 404, 500)
        this.data = null;                 // Any data (null by default)
        this.message = message;          // Error message
        this.success = false;            // API failed, so success is false

        // // 🛑 BUG HERE
        // this.errors = this.errors;       // This is assigning the property to itself

        // ✅ FIX:
        this.errors = errors;

        if (stack) {
            this.stack = stack; // Use provided stack trace
        } else {
            // Automatically capture the stack trace
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

export { ApiError };
