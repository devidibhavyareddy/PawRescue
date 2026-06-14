import express from "express";

import {
  createAdoptionRequest,
  getMyRequests,
  getAllRequests,
  updateRequestStatus,
  addMessageToRequest,
} from "../controllers/adoptionController.js";

import protect from "../middleware/authMiddleware.js";
import adminOnly from "../middleware/adminMiddleware.js";

const router = express.Router();


// USER ROUTES
router.post(
  "/",
  protect,
  createAdoptionRequest
);

router.get(
  "/my",
  protect,
  getMyRequests
);


// ADMIN ROUTES
router.get(
  "/",
  protect,
  adminOnly,
  getAllRequests
);

router.put(
  "/:id",
  protect,
  adminOnly,
  updateRequestStatus
);

router.post(
  "/:id/messages",
  protect,
  addMessageToRequest
);

export default router;