import express from "express";

const router = express.Router();
// middlewares
import { requereSignIn, isAdmin } from "../middlewares/auth.js";

// controllers
import { register, login } from "../controllers/auth.js";

router.post("/register", register);
router.post("/login", requereSignIn, login);

export default router;
