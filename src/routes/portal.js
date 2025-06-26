import express from "express";
import { bdrFormShow, bdrFormSubmit } from "../controllers/portalController.js";

const router = express.Router();

// GET /portal?data=… – decodes payload and renders portal_view.ejs
router.get("/", (req, res) => {
  res.render("home");
});

router.get("/bdr-form", bdrFormShow);
router.post("/bdr-form", bdrFormSubmit);
export default router;
