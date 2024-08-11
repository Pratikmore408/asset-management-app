import express from "express";
import {
  createAsset,
  updateAsset,
  publishAsset,
  getAssetDetails,
  getUserAssets,
} from "../controllers/assetController.js";

const router = express.Router();

router.post("/", createAsset);
router.post("/:id", updateAsset);
router.put("/:id/publish", publishAsset);
router.get("/:id", getAssetDetails);
router.get("/users/:id/assets", getUserAssets);

export default router;
