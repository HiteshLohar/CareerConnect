import express from "express";
import { register, login } from "../controllers/auth.controllers.js";
import { verifyToken, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post('/register', register);
router.post('/login', login);


// this is test to check the role based access control
router.get("/student", verifyToken, authorizeRoles("student"), (req, res) => {
    return res.status(200).json({
        success: true,
        message: "Welcome Student"
    });
}
);

router.get(
    "/recruiter",
    verifyToken,
    authorizeRoles("recruiter"),
    (req, res) => {
        return res.status(200).json({
            success: true,
            message: "Welcome Recruiter"
        });
    }
);

router.get(
    "/admin",
    verifyToken,
    authorizeRoles("admin"),
    (req, res) => {
        return res.status(200).json({
            success: true,
            message: "Welcome Admin"
        });
    }
);



//this is route only work on recruiter
// router.post('/create-job', verifyToken, authorizeRoles("recruiter"), createJob);

//this is route only work on recruiter and admin
// router.get('/all-jobs', verifyToken, authorizeRoles("admin", "recruiter"), getAllJobs);

//demo
router.get("/profile", verifyToken, (req, res) => {
    return res.status(200).json({
        success: true,
        message: "Protected Route Accessed",
        user: req.user
    });
});

export default router;