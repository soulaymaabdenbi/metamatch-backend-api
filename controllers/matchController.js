const Match = require("../models/Match");
const PDFParser = require("pdf-parse");
const csvParser = require("csv-parser");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const axios = require("axios");
const cheerio = require("cheerio");
const csv = require("csv-parser");
const mongoose = require("mongoose");
const fs = require("fs").promises;

const moment = require("moment");

exports.getAllMatches = async (req, res) => {
  try {
    const matches = await Match.find();
    res.json(matches);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

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

// exports.updateMatch = async (req, res) => {
//   const { id } = req.params;
//   try {
//     const updatedMatch = await Match.findByIdAndUpdate(id, req.body, {
//       new: true,
//     });
//     if (!updatedMatch) {
//       return res.status(404).json({ message: "Match not found" });
//     }
//     res.json(updatedMatch);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };

exports.updateMatch = async (req, res) => {
  const { id } = req.params;
  const { date } = req.body;

  try {
    // Check if there is another match scheduled on the same date
    const existingMatch = await Match.findOne({
      date,
      _id: { $ne: id }, // Exclude the match being updated from this check
    });

    if (existingMatch) {
      return res.status(400).json({
        message: "Conflict",
      });
    }

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

const url =
  "https://www.transfermarkt.com/ligue-professionelle-1-playoff/startseite/wettbewerb/TUNM";

async function getHtml() {
  try {
    const response = await axios.get(url, {
      headers: {
        "User-Agent": generateRandomUserAgent(),
        // Add other headers if necessary
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching HTML:", error);
    throw error;
  }
}

function generateRandomUserAgent() {
  const userAgents = [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36",
  ];
  return userAgents[Math.floor(Math.random() * userAgents.length)];
}

async function scrapeMatches() {
  try {
    const html = await getHtml();
    const $ = cheerio.load(html);

    const matchData = [];

    $(".begegnungZeile").each((i, match) => {
      const dateAndTime = $(match)
        .find(".hide-for-small.zeit.al")
        .text()
        .trim();
      const homeTeamName = $(match)
        .find(".verein-heim .vereinsname a")
        .text()
        .trim();
      const awayTeamName = $(match)
        .find(".verein-gast .vereinsname a")
        .text()
        .trim();
      const matchResult = $(match).find(".ergebnis .matchresult").text().trim();

      const matchDataItem = {
        dateAndTime,
        homeTeamName,
        awayTeamName,
        matchResult,
      };
      matchData.push(matchDataItem);
    });

    await saveMatchData(matchData);

    console.log("Match data saved successfully.");
  } catch (error) {
    console.error("Error scraping matches:", error);
    throw error;
  }
}

async function saveMatchData(matchData) {
  try {
    await fs.writeFile("matchData.json", JSON.stringify(matchData, null, 2));
  } catch (error) {
    console.error("Error saving match data:", error);
    throw error;
  }
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
