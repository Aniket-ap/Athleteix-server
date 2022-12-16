import express from "express"

const router = express.Router();

// controllers
import {register} from "../controllers/auth.js";

router.post('/register', register)

export default router;