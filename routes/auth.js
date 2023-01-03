import express from "express";

const router = express.Router();
// middlewares
import { requereSignIn, isAdmin } from "../middlewares/auth.js";

// controllers
import { register, login, updateProfile, getOrders, allOrders } from "../controllers/auth.js";

router.post("/register", register);
router.post("/login", login);
router.get("/auth-check", requereSignIn, (req, res) => {
    res.json({ok: true})
});
router.get("/admin-check", requereSignIn, isAdmin, (req, res) => {
    res.json({ok: true})
});
router.put("/profile", requereSignIn, updateProfile);

router.get("/orders", requereSignIn, getOrders);
router.get("/all-orders", requereSignIn, isAdmin, allOrders);

export default router;
