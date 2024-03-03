const Match = require("../models/Match");
const PDFParser = require("pdf-parse");
const csvParser = require("csv-parser");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

const fs = require("fs");

const moment = require("moment");

exports.uploadCSV = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const matches = [];
    fs.createReadStream(req.file.path)
      .pipe(csvParser({ separator: ";" }))
      .on("data", (data) => {
        console.log("Row data:", data);

        const date = data["date"] ? data["date"].trim() : null;
        console.log("Date:", date);

        if (!date || typeof date !== "string" || !date.trim()) {
          console.error("Date column missing or empty in row:", data);
          return;
        }

        const dateParts = date.split("/");
        const day = parseInt(dateParts[0], 10);
        const month = parseInt(dateParts[1], 10) - 1;
        const year = parseInt(dateParts[2], 10);

        const parsedDate = new Date(year, month, day);
        console.log("Parsed date:", parsedDate);

        if (isNaN(parsedDate.getTime())) {
          throw new Error("Invalid date format");
        }

        const matchData = {
          date: parsedDate,
          teamA: data.TeamA,
          teamB: data.TeamB,
          location: data.location,
        };
        matches.push(matchData);
      })
      .on("end", async () => {
        await Match.insertMany(matches);
        res.json({
          message: "CSV file uploaded and data inserted successfully",
        });
      });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: error.message });
  }
};

// Controller function to fetch all matches
exports.getAllMatches = async (req, res) => {
  try {
    const matches = await Match.find();
    res.json(matches);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Controller function to create a new match
exports.addMatch = async (req, res) => {
  const { date } = req.body;
  try {
    const existingMatch = await Match.findOne({ date });
    if (existingMatch) {
      return res.status(400).json({
        message: "A match is already scheduled on the same date",
      });
    }
    const match = new Match(req.body);
    const newMatch = await match.save();
    res.status(201).json(newMatch);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Controller function to update a match by ID
exports.updateMatch = async (req, res) => {
  const { id } = req.params;
  try {
    const updatedMatch = await Match.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!updatedMatch) {
      return res.status(404).json({ message: "Match not found" });
    }
    res.json(updatedMatch);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Controller function to delete a match by ID
exports.deleteMatch = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedMatch = await Match.findByIdAndDelete(id);
    if (!deletedMatch) {
      return res.status(404).json({ message: "Match not found" });
    }
    res.json({ message: "Match deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Controller function to get a match by ID
exports.getMatchById = async (req, res) => {
  const { id } = req.params;
  try {
    const match = await Match.findById(id);
    if (!match) {
      return res.status(404).json({ message: "Match not found" });
    }
    res.json(match);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Controller function to get matches by date
exports.getByDate = async (req, res) => {
  const { date } = req.params;
  try {
    const matches = await Match.find({ date });
    if (matches.length === 0) {
      return res
        .status(404)
        .json({ message: "No matches found for the specified date" });
    }
    res.json(matches);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
