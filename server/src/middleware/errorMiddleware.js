import mongoose from "mongoose";

const errorHandler = (err, req, res, next) => {

    let statusCode = err.statusCode || 500;
    let message = err.message || "Internal Server Error";


    // ========================================
    // MONGOOSE VALIDATION ERROR
    // ========================================

    if (err instanceof mongoose.Error.ValidationError) {

        statusCode = 400;

        const messages = Object.values(err.errors)
            .map(error => error.message);

        message = messages.join(", ");
    }


    // ========================================
    // MONGOOSE DUPLICATE KEY ERROR
    // ========================================

    if (err.code === 11000) {

        statusCode = 409;

        const field = Object.keys(err.keyValue)[0];

        message = `${field} already exists`;
    }


    // ========================================
    // MONGOOSE INVALID OBJECT ID
    // ========================================

    if (err instanceof mongoose.Error.CastError) {

        statusCode = 400;

        message = `Invalid ${err.path}`;
    }


    // ========================================
    // RESPONSE
    // ========================================

    return res.status(statusCode).json({
        success: false,
        message
    });
};

export default errorHandler;
