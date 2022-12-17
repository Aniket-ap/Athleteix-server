import express from "express";

const router = express.Router();

// middlewares
import { requereSignIn, isAdmin } from "../middlewares/auth.js";

// controllers
import {create, update, remove, list, read} from "../controllers/category.js"

router.post("/category", requereSignIn, isAdmin, create)
router.put("/category/:categoryId", requereSignIn, isAdmin, update)
router.delete("/category/:categoryId", requereSignIn, isAdmin, remove)
router.get("/categories", list)
router.get("/category/:slug", read)

export default router