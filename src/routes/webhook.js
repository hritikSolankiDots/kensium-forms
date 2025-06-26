import express from "express";
import { handleWebhook } from "../controllers/webhookController.js";

const router = express.Router();
router.post("/form-link", handleWebhook);
export default router;
