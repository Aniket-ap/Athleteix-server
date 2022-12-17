import express from "express";

const router = express.Router();

// middlewares
import { requereSignIn, isAdmin } from "../middlewares/auth.js";

// controllers
import {create} from "../controllers/category.js"

router.post("/category", requereSignIn, isAdmin, create)

export default router