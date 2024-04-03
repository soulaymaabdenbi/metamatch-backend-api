const express = require("express");
const router = express.Router();
const sessionController = require("../controllers/sessionController");
const moment = require("moment");

// Define the route for fetching sessions by month first
router.get("/sessions-by-month", sessionController.getAllSessionsForMonth);

// Define other routes
router.get("/", sessionController.getAllSessions);
router.post("/", sessionController.addSession);
router.put("/:id", sessionController.updateSession);
router.delete("/:id", sessionController.deleteSession);
router.get("/:id", sessionController.getSessionById);

module.exports = router;
