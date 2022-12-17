import express from "express";
import formidable from "express-formidable"

const router = express.Router();

// middlewares
import { requereSignIn, isAdmin } from "../middlewares/auth.js";

// controllers
import {create, list, read, photo, remove, update} from "../controllers/product.js"

router.post("/product", requereSignIn, isAdmin, formidable(), create)
router.get("/products", list)
router.get("/product/:slug", read)
router.get("/product/photo/:productId", photo)
router.delete("/product/:productId", requereSignIn, isAdmin, remove)
router.put("/product/:productId", requereSignIn, isAdmin, formidable(), update)

export default router