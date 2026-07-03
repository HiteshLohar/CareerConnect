import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
    try{
        const authHeader = req.headers.authorization;

        if(!authHeader || !authHeader.startsWith("Bearer ")){
            return res.status(401).json({
                success : false,
                message : "Access denied. No token provided."
            });
        }

        const token = authHeader.split(" ")[1];

        const decode = jwt.verify(token, process.env.JWT_SECRET);

        req.user = decode;

        next();
    }
    catch(error){
        return res.status(401).json({
            success : false,
            message : "Invalid or expired token."
        });
    }
}

export const authorizeRoles = (...roles) => {
    return (req, res, next) => {

        if(!roles.includes(req.user.role)){
            return res.status(403).json({
                success : false,
                message : "Access denied. You do not have permission."
            });
        }

        next();
    };
};