import express from "express";
import {
  requestToBuy,
  negotiateRequest,
  acceptRequestByHolder, // Use the correct function name
  acceptRequestByBuyer, // Use the correct function name
  denyRequest,
  getUserRequests,
} from "../controllers/requestController.js";

const router = express.Router();

router.post("/:id/request", requestToBuy);
router.put("/:id/negotiate", negotiateRequest);
router.put("/:id/accept", acceptRequestByHolder); // Replace acceptRequest with the appropriate function
router.put("/:id/buyer-accept", acceptRequestByBuyer); // Add a new route for buyer acceptance
router.put("/:id/deny", denyRequest);
router.get("/users/:id/requests", getUserRequests);

export default router;
