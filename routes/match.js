const express = require("express");
const router = express.Router();
const matchController = require("../controllers/matchController");

const multer = require("multer");
const upload = multer({ dest: "uploads/" });

router.get("/", matchController.getAllMatches);
router.post("/", matchController.addMatch);
// router.post(
//   "/addFromPDF",
//   upload.single("pdf"),
//   matchController.addMatchFromPDF
// );
router.put("/:id", matchController.updateMatch);
router.delete("/:id", matchController.deleteMatch);
router.get("/:id", matchController.getMatchById);
router.get("/:id", matchController.getByDate);

router.post("/upload-csv", upload.single("csvFile"), matchController.uploadCSV);

module.exports = router;
