import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {

    try {

        const token = req.cookies?.token;

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized. Please login."
            });
        }

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        if (!decoded?.userId || !decoded?.role) {
            return res.status(401).json({
                success: false,
                message: "Invalid authentication token."
            });
        }

        req.user = decoded;

        next();

    } catch (error) {

        return res.status(401).json({
            success: false,
            message: "Invalid or expired token."
        });

    }

};


export const authorizeRoles = (...roles) => {

    return (req, res, next) => {

        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized. Please login."
            });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: "Access denied. You do not have permission."
            });
        }

        next();

    };

};