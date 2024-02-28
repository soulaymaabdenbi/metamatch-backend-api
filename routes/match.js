const express = require("express");
const router = express.Router();
const matchController = require("../controllers/matchController");

router.get("/", matchController.getAllMatches);
router.post("/", matchController.addMatch);
router.put("/:id", matchController.updateMatch);
router.delete("/:id", matchController.deleteMatch);
router.get("/:id", matchController.getMatchById);
router.get("/:id", matchController.getByDate);

module.exports = router;
