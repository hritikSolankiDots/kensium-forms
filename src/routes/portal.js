import express from "express";
import {
  bdrFormShow,
  bdrFormSubmit,
  salesDiscoveryFormShow,
  salesDiscoveryFormSubmit,
} from "../controllers/portalController.js";

const router = express.Router();

// GET /portal?data=… – decodes payload and renders portal_view.ejs
router.get("/", (req, res) => {
  res.render("home");
});

router.get("/bdr-form", bdrFormShow);
router.post("/bdr-form", bdrFormSubmit);

router.get("/sales-discovery-form", salesDiscoveryFormShow);
router.post("/sales-discovery-form", salesDiscoveryFormSubmit);
export default router;
