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

const url =
  "https://www.transfermarkt.com/ligue-professionelle-1-playoff/startseite/wettbewerb/TUNM";
const urlArticle = "https://www.transfermarkt.com/interview/rubrik/aktuell/1";
const matchData = {};
const articleData = {};

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

async function getHtmll() {
  try {
    const response = await axios.get(urlArticle, {
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
    // Add more User-Agent strings as needed
  ];
  return userAgents[Math.floor(Math.random() * userAgents.length)];
}

// async function scrapeMatches() {
//   try {
//     const html = await getHtml();
//     const $ = cheerio.load(html);

//     // Initialize matchData as an empty array
//     const matchData = [];

//     $(".begegnungZeile").each((i, match) => {
//       const dateAndTime = $(match)
//         .find(".hide-for-small.zeit.al")
//         .text()
//         .trim();
//       const homeTeamName = $(match)
//         .find(".verein-heim .vereinsname a")
//         .text()
//         .trim();
//       const awayTeamName = $(match)
//         .find(".verein-gast .vereinsname a")
//         .text()
//         .trim();
//       const matchResult = $(match).find(".ergebnis .matchresult").text().trim();

//       const matchDataItem = {
//         dateAndTime,
//         homeTeamName,
//         awayTeamName,
//         matchResult,
//       };
//       matchData.push(matchDataItem);
//     });

//     // Save match data to a file
//     await saveMatchData(matchData);

//     console.log("Match data saved successfully.");
//   } catch (error) {
//     console.error("Error scraping matches:", error);
//     throw error;
//   }
// }

// async function saveMatchData(matchData) {
//   try {
//     await fs.writeFile("matchData.json", JSON.stringify(matchData, null, 2));
//   } catch (error) {
//     console.error("Error saving match data:", error);
//     throw error;
//   }
// }

// // Function to add delay between requests
// function delay(ms) {
//   return new Promise((resolve) => setTimeout(resolve, ms));
// }

// exports.startScraping = async () => {
//   try {
//     while (true) {
//       await scrapeMatches(); // Perform the scraping operation

//       // Add a delay between scraping requests (e.g., 5 seconds)
//       await delay(5000); // Delay for 5 seconds before making the next request
//     }
//   } catch (error) {
//     console.error("Error during scraping:", error);
//     // If an error occurs, log it and continue scraping
//     // You may want to implement more sophisticated error handling based on your requirements
//   }
// };
async function scrapeMatches() {
  try {
    const html = await getHtml();
    const $ = cheerio.load(html);

    // Initialize matchData as an empty array
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

    // Save match data to a file
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

// Function to add delay between requests
function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

exports.startScraping = async () => {
  try {
    while (true) {
      await scrapeMatches(); // Perform the scraping operation

      // Add a delay between scraping requests (e.g., 5 seconds)
      await delay(5000); // Delay for 5 seconds before making the next request
    }
  } catch (error) {
    console.error("Error during scraping:", error);
    // If an error occurs, log it and continue scraping
    // You may want to implement more sophisticated error handling based on your requirements
  }
};

// async function scrapeArticles() {
//   try {
//     const html = await getHtmll();
//     const $ = cheerio.load(html);

//     // Initialize matchData as an empty array
//     const articleData = [];

//     $(".newsticker__box-big").each((index, element) => {
//       const publicationDate = $(element)
//         .find(".newsticker__boxheader-big")
//         .text()
//         .trim();
//       const headline = $(element)
//         .find(".newsticker__headline-big")
//         .text()
//         .trim();
//       const teaserText = $(element)
//         .find(".newsticker__teasertext")
//         .text()
//         .trim();

//       const article = {
//         publicationDate,
//         headline,
//         teaserText,
//       };
//       articleData.push(article);
//     });

//     await saveArticles(articleData);

//     console.log("article data saved successfully.");
//   } catch (error) {
//     console.error("Error scraping articles:", error);
//     throw error;
//   }
// }
async function saveArticles(articles) {
  try {
    await fs.writeFile("articleData.json", JSON.stringify(articles, null, 2));
  } catch (error) {
    console.error("Error saving articles:", error);
    throw error;
  }
}

//zouz tsawer kifkif
// async function scrapeArticles() {
//   try {
//     const html = await getHtmll();
//     const $ = cheerio.load(html);

//     // Initialize articleData as an empty array
//     const articleData = [];

//     $(".newsticker__box-big").each((index, element) => {
//       const publicationDate = $(element)
//         .find(".newsticker__boxheader-big")
//         .text()
//         .trim();
//       const headline = $(element)
//         .find(".newsticker__headline-big")
//         .text()
//         .trim();
//       const teaserText = $(element)
//         .find(".newsticker__teasertext")
//         .text()
//         .trim();
//       // Extract image URL
//       const imageElement = $(".foto");
//       const imageUrl = imageElement.attr("src");

//       const article = {
//         publicationDate,
//         headline,
//         teaserText,
//         imageUrl, // Add imageUrl to the article object
//       };
//       articleData.push(article);
//     });

//     await saveArticles(articleData);

//     console.log("Article data saved successfully.");
//   } catch (error) {
//     console.error("Error scraping articles:", error);
//     throw error;
//   }
// }

// Function to add delay between requests
function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
exports.startScrapingArticles = async () => {
  try {
    while (true) {
      await scrapeArticles(); // Perform the scraping operation

      // Add a delay between scraping requests (e.g., 5 seconds)
      await delay(5000); // Delay for 5 seconds before making the next request
    }
  } catch (error) {
    console.error("Error during scraping:", error);
    // If an error occurs, log it and continue scraping
    // You may want to implement more sophisticated error handling based on your requirements
  }
};
