// backend/src/routes/healthRoutes.js
import express from "express";

const router = express.Router();

// Route de health check
router.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});

export default router;
