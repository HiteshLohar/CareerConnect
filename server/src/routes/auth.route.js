import express from "express";
import { register, login } from "../controllers/auth.controllers.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post('/register', register);
router.post('/login', login);


//demo
router.get("/profile", verifyToken, (req, res) => {
    return res.status(200).json({
        success: true,
        message: "Protected Route Accessed",
        user: req.user
    });
});

export default router;