class ApiError extends Error{
    constructor(statusCode, message){
        super(message) || "Internal Server Error";

        this.statusCode = statusCode  || 500;
        Error.captureStackTrace(this, this.constructor);
    }
}

export default ApiError;