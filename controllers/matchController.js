// const Match = require("../models/Match");
// const PDFParser = require("pdf-parse");
// const csvParser = require("csv-parser");
// const multer = require("multer");
// const upload = multer({ dest: "uploads/" });
// const axios = require("axios");
// const cheerio = require("cheerio");
// const csv = require("csv-parser");
// const mongoose = require("mongoose");
// const fs = require("fs").promises;

// const moment = require("moment");

// // exports.uploadCSV = async (req, res) => {
// //   try {
// //     if (!req.file) {
// //       return res.status(400).json({ message: "No file uploaded" });
// //     }

// //     const filePath = req.file.path;
// //     const fileStats = fs.statSync(filePath);
// //     const fileLastModified = fileStats.mtime;

// //     console.log("File Last Modified:", fileLastModified);
// //     console.log("Upload Request Timestamp:", uploadRequestTimestamp);

// //     // Check if file was modified after the upload request
// //     const uploadRequestTimestamp = req.file.uploadedAt; // You need to set this when handling the upload request
// //     if (fileLastModified <= uploadRequestTimestamp) {
// //       return res
// //         .status(400)
// //         .json({ message: "File has not been modified since upload" });
// //     }

// //     // Read the CSV file asynchronously
// //     fs.readFile(filePath, "utf-8", async (err, fileContent) => {
// //       if (err) {
// //         console.error("Error reading file:", err);
// //         return res.status(500).json({ message: "Error reading file" });
// //       }

// //       // Parse the file content into rows
// //       const rows = fileContent.trim().split("\n");

// //       for (let i = 1; i < rows.length; i++) {
// //         // Start from index 1 to skip header row
// //         const columns = rows[i].trim().split(";");
// //         const dateParts = columns[0].split("/");
// //         const date = new Date(
// //           `${dateParts[1]}/${dateParts[0]}/${dateParts[2]}`
// //         );

// //         const location = columns[1];
// //         const teamA = columns[2];
// //         const teamB = columns[3];

// //         if (!location || !teamA || !teamB) {
// //           console.error("Missing data in row:", rows[i]);
// //           continue;
// //         }

// //         try {
// //           // Find existing entry in the database
// //           const existingEntry = await Match.findOne({
// //             date,
// //             location,
// //             teamA,
// //             teamB,
// //           });

// //           if (existingEntry) {
// //             // Update existing entry
// //             existingEntry.date = date;
// //             existingEntry.location = location.trim();
// //             existingEntry.teamA = teamA.trim();
// //             existingEntry.teamB = teamB.trim();
// //             await existingEntry.save();
// //             console.log("Entry updated :", existingEntry._id);
// //           } else {
// //             // Create new entry
// //             const newEntry = new Match({
// //               date,
// //               location: location.trim(),
// //               teamA: teamA.trim(),
// //               teamB: teamB.trim(),
// //             });
// //             await newEntry.save();
// //             console.log("New entry created :", newEntry._id);
// //           }
// //         } catch (error) {
// //           console.error("Error processing row:", error);
// //         }
// //       }

// //       // Send response after processing all rows
// //       res.json({
// //         message: "CSV file uploaded and data updated successfully",
// //       });
// //     });
// //   } catch (error) {
// //     console.error("Error:", error);
// //     res.status(500).json({ message: error.message });
// //   }
// // };

// //works
// // exports.uploadCSV = async (req, res) => {
// //   try {
// //     if (!req.file) {
// //       return res.status(400).json({ message: "No file uploaded" });
// //     }

// //     const existingEntries = new Set();
// //     const existingMatches = await Match.find({}, "_id");
// //     existingMatches.forEach((match) => {
// //       existingEntries.add(match._id.toString());
// //     });

// //     const fileContent = fs.readFileSync(req.file.path, "utf-8");
// //     const rows = fileContent.trim().split("\n");

// //     rows.forEach(async (row, index) => {
// //       if (index === 0) return; // Skip header row

// //       const columns = row.trim().split(";");

// //       const dateParts = columns[0].split("/");
// //       const date = new Date(`${dateParts[1]}/${dateParts[0]}/${dateParts[2]}`);

// //       if (isNaN(date.getTime())) {
// //         console.error("Invalid date format in row:", row);
// //         return;
// //       }

// //       const location = columns[1];
// //       const teamA = columns[2];
// //       const teamB = columns[3];

// //       if (!location || !teamA || !teamB) {
// //         console.error("Missing data in row:", row);
// //         return;
// //       }

// //       const _id = new mongoose.Types.ObjectId(); // Generate a new ObjectId

// //       const matchData = {
// //         _id: _id,
// //         date: date,
// //         location: location.trim(),
// //         teamA: teamA.trim(),
// //         teamB: teamB.trim(),
// //       };

// //       if (existingEntries.has(_id.toString())) {
// //         // Use _id.toString() for comparison
// //         await Match.findOneAndUpdate({ _id: _id }, matchData);
// //         console.log("Entry updated :", _id);
// //       } else {
// //         await Match.create(matchData);
// //         console.log("New entry created :", _id);
// //       }
// //     });

// //     res.json({
// //       message: "CSV file uploaded and data updated successfully",
// //     });
// //   } catch (error) {
// //     console.error("Error:", error);
// //     res.status(500).json({ message: error.message });
// //   }
// // };

// // function monitorAndSyncCSV(filePath) {
// //   fs.watchFile(filePath, (curr, prev) => {
// //     if (curr.mtime !== prev.mtime) {
// //       console.log(`File ${filePath} has been modified.`);
// //       updateDatabaseFromCSV(filePath);
// //     }
// //   });
// // }

// // async function updateDatabaseFromCSV(filePath) {
// //   const matches = [];

// //   fs.createReadStream(filePath)
// //     .pipe(csvParser({ separator: ";" }))
// //     .on("data", async (row) => {
// //       const headerPrefix = row[Object.keys(row)[0]];
// //       if (headerPrefix.startsWith("h")) {
// //         console.log("Skipping header row:", row);
// //         return;
// //       }

// //       try {
// //         const dateString = row.date;
// //         if (!dateString) {
// //           console.error("Date is undefined in CSV row:", row);
// //           return;
// //         }

// //         const dateParts = dateString.split("/");
// //         if (dateParts.length !== 3) {
// //           console.error("Invalid date format:", dateString);
// //           return;
// //         }

// //         const day = parseInt(dateParts[0], 10);
// //         const month = parseInt(dateParts[1], 10);
// //         const year = parseInt(dateParts[2], 10);

// //         if (isNaN(day) || isNaN(month) || isNaN(year)) {
// //           console.error("Invalid date format:", dateString);
// //           return;
// //         }

// //         const parsedDate = new Date(Date.UTC(year, month - 1, day));
// //         if (isNaN(parsedDate.getTime())) {
// //           console.error("Invalid date:", dateString);
// //           return;
// //         }

// //         const matchData = {
// //           date: parsedDate,
// //           teamA: row.TeamA,
// //           teamB: row.TeamB,
// //           location: row.location,
// //         };
// //         matches.push(matchData);
// //       } catch (error) {
// //         console.error("Error processing row:", error);
// //       }
// //     })
// //     .on("end", async () => {
// //       try {
// //         // Update or insert matches into the database
// //         for (const match of matches) {
// //           const existingMatch = await Match.findOne({ date: match.date });
// //           if (existingMatch) {
// //             // Update existing match
// //             await Match.findByIdAndUpdate(existingMatch._id, match);
// //             console.log(`Match updated for date: ${match.date}`);
// //           } else {
// //             // Insert new match
// //             const newMatch = new Match(match);
// //             await newMatch.save();
// //             console.log(`New match inserted for date: ${match.date}`);
// //           }
// //         }
// //         console.log("Database updated with changes from CSV.");
// //       } catch (error) {
// //         console.error("Error updating database:", error);
// //       }
// //     })
// //     .on("error", (error) => {
// //       console.error("Error parsing CSV:", error);
// //     });
// // }

// // async function updateDatabaseFromCSV(filePath) {
// //   const matches = [];

// //   // Read the CSV file and parse its content
// //   fs.createReadStream(filePath)
// //     .pipe(csvParser({ separator: "\t" }))
// //     .on("data", async (row) => {
// //       try {
// //         // Parse date from the row
// //         const dateString = row.date;
// //         const dateParts = dateString.split("/");
// //         const day = parseInt(dateParts[0], 10);
// //         const month = parseInt(dateParts[1], 10) - 1;
// //         const year = parseInt(dateParts[2], 10);
// //         const parsedDate = new Date(year, month, day);

// //         // Check if the parsed date is valid
// //         if (isNaN(parsedDate.getTime())) {
// //           console.error("Invalid date format:", dateString);
// //           return;
// //         }

// //         // Construct match data
// //         const matchData = {
// //           date: parsedDate,
// //           teamA: row.TeamA,
// //           teamB: row.TeamB,
// //           location: row.location,
// //         };

// //         // Add the match data to the array
// //         matches.push(matchData);
// //       } catch (error) {
// //         console.error("Error processing row:", error);
// //       }
// //     })
// //     .on("end", async () => {
// //       try {
// //         // Iterate through matches and update/insert into the database
// //         for (const match of matches) {
// //           // Find match in the database by date
// //           const existingMatch = await Match.findOne({ date: match.date });
// //           if (existingMatch) {
// //             // Update existing match
// //             await Match.findByIdAndUpdate(existingMatch._id, match);
// //             console.log(`Match updated for date: ${match.date}`);
// //           } else {
// //             // Insert new match
// //             const newMatch = new Match(match);
// //             await newMatch.save();
// //             console.log(`New match inserted for date: ${match.date}`);
// //           }
// //         }
// //         console.log("Database updated with changes from CSV.");
// //       } catch (error) {
// //         console.error("Error updating database:", error);
// //       }
// //     })
// //     .on("error", (error) => {
// //       console.error("Error parsing CSV:", error);
// //     });
// // }

// // exports.uploadCSV = async (req, res) => {
// //   try {
// //     if (!req.file) {
// //       return res.status(400).json({ message: "No file uploaded" });
// //     }

// //     const matches = [];
// //     fs.createReadStream(req.file.path)
// //       .pipe(csvParser({ separator: ";" }))
// //       .on("data", (data) => {
// //         console.log("Row data:", data);

// //         const date = data["date"] ? data["date"].trim() : null;
// //         console.log("Date:", date);

// //         if (!date || typeof date !== "string" || !date.trim()) {
// //           console.error("Date column missing or empty in row:", data);
// //           return;
// //         }

// //         const dateParts = date.split("/");
// //         const day = parseInt(dateParts[0], 10);
// //         const month = parseInt(dateParts[1], 10) - 1;
// //         const year = parseInt(dateParts[2], 10);

// //         const parsedDate = new Date(year, month, day);
// //         console.log("Parsed date:", parsedDate);

// //         if (isNaN(parsedDate.getTime())) {
// //           throw new Error("Invalid date format");
// //         }

// //         const matchData = {
// //           date: parsedDate,
// //           teamA: data.TeamA,
// //           teamB: data.TeamB,
// //           location: data.location,
// //         };
// //         matches.push(matchData);
// //       })
// //       .on("end", async () => {
// //         await Match.insertMany(matches);
// //         res.json({
// //           message: "CSV file uploaded and data inserted successfully",
// //         });

// //         // Call file watcher after uploading the CSV file
// //         monitorAndSyncCSV(req.file.path);
// //       });
// //   } catch (error) {
// //     console.error("Error:", error);
// //     res.status(500).json({ message: error.message });
// //   }
// // };

// // Controller function to fetch all matches
// exports.getAllMatches = async (req, res) => {
//   try {
//     const matches = await Match.find();
//     res.json(matches);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // Controller function to create a new match
// exports.addMatch = async (req, res) => {
//   const { date } = req.body;
//   try {
//     const existingMatch = await Match.findOne({ date });
//     if (existingMatch) {
//       return res.status(400).json({
//         message: "A match is already scheduled on the same date",
//       });
//     }
//     const match = new Match(req.body);
//     const newMatch = await match.save();
//     res.status(201).json(newMatch);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };

// // Controller function to update a match by ID
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

// // Controller function to delete a match by ID
// exports.deleteMatch = async (req, res) => {
//   const { id } = req.params;
//   try {
//     const deletedMatch = await Match.findByIdAndDelete(id);
//     if (!deletedMatch) {
//       return res.status(404).json({ message: "Match not found" });
//     }
//     res.json({ message: "Match deleted successfully" });
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };

// // Controller function to get a match by ID
// exports.getMatchById = async (req, res) => {
//   const { id } = req.params;
//   try {
//     const match = await Match.findById(id);
//     if (!match) {
//       return res.status(404).json({ message: "Match not found" });
//     }
//     res.json(match);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };

// // Controller function to get matches by date
// exports.getByDate = async (req, res) => {
//   const { date } = req.params;
//   try {
//     const matches = await Match.find({ date });
//     if (matches.length === 0) {
//       return res
//         .status(404)
//         .json({ message: "No matches found for the specified date" });
//     }
//     res.json(matches);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };

// const url =
//   "https://www.transfermarkt.com/ligue-professionelle-1-playoff/startseite/wettbewerb/TUNM";
// const matchData = {};

// async function getHtml() {
//   try {
//     const response = await axios.get(url, {
//       headers: {
//         "User-Agent": generateRandomUserAgent(),
//         // Add other headers if necessary
//       },
//     });
//     return response.data;
//   } catch (error) {
//     console.error("Error fetching HTML:", error);
//     throw error;
//   }
// }

// function generateRandomUserAgent() {
//   const userAgents = [
//     "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36",
//     // Add more User-Agent strings as needed
//   ];
//   return userAgents[Math.floor(Math.random() * userAgents.length)];
// }

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

//       const matchDetails = {
//         dateAndTime,
//         homeTeamName,
//         awayTeamName,
//         matchResult,
//       };

//       matchData.push(matchDetails);
//     });

//     if (matchData.length === 0) {
//       console.log("No matches found.");
//       return;
//     }

//     await fs.writeFile("matchData.json", JSON.stringify(matchData, null, 2));
//     console.log("File saved with match details.");
//   } catch (error) {
//     console.error("Error scraping matches:", error);
//     throw error;
//   }
// }
// function delay(ms) {
//   return new Promise((resolve) => setTimeout(resolve, ms));
// }

// async function startScraping() {
//   try {
//     while (true) {
//       await scrapeMatches();
//       // Insert delay between requests
//       await delay(5000); // Delay for 5 seconds before making the next request
//     }
//   } catch (error) {
//     console.error("Error during scraping:", error);
//   }
// }

// // Start scraping
// //startScraping();

// // exports.uploadCSV = async (req, res) => {
// //   try {
// //     if (!req.file) {
// //       return res.status(400).json({ message: "No file uploaded" });
// //     }

// //     // Read the CSV file asynchronously
// //     fs.readFile(req.file.path, "utf-8", async (err, fileContent) => {
// //       if (err) {
// //         console.error("Error reading file:", err);
// //         return res.status(500).json({ message: "Error reading file" });
// //       }

// //       // Parse the file content into rows
// //       const rows = fileContent.trim().split("\n");

// //       for (let i = 1; i < rows.length; i++) {
// //         // Start from index 1 to skip header row
// //         const columns = rows[i].trim().split(";");
// //         const dateParts = columns[0].split("/");
// //         const date = new Date(
// //           `${dateParts[1]}/${dateParts[0]}/${dateParts[2]}`
// //         );

// //         const location = columns[1];
// //         const teamA = columns[2];
// //         const teamB = columns[3];

// //         if (!location || !teamA || !teamB) {
// //           console.error("Missing data in row:", rows[i]);
// //           continue;
// //         }

// //         try {
// //           // Find existing entry in the database
// //           const existingEntry = await Match.findOne({
// //             date,
// //             location,
// //             teamA,
// //             teamB,
// //           });

// //           if (existingEntry) {
// //             // Update existing entry
// //             existingEntry.date = date;
// //             existingEntry.location = location.trim();
// //             existingEntry.teamA = teamA.trim();
// //             existingEntry.teamB = teamB.trim();
// //             await existingEntry.save();
// //             console.log("Entry updated :", existingEntry._id);
// //           } else {
// //             // Create new entry
// //             const newEntry = new Match({
// //               date,
// //               location: location.trim(),
// //               teamA: teamA.trim(),
// //               teamB: teamB.trim(),
// //             });
// //             await newEntry.save();
// //             console.log("New entry created :", newEntry._id);
// //           }
// //         } catch (error) {
// //           console.error("Error processing row:", error);
// //         }
// //       }

// //       // Send response after processing all rows
// //       res.json({
// //         message: "CSV file uploaded and data updated successfully",
// //       });
// //     });
// //   } catch (error) {
// //     console.error("Error:", error);
// //     res.status(500).json({ message: error.message });
// //   }
// // };

// async function processCSVContent(fileContent) {
//   const rows = fileContent.trim().split("\n");

//   for (let i = 1; i < rows.length; i++) {
//     const columns = rows[i].trim().split(";");
//     const dateParts = columns[0].split("/");
//     const date = new Date(`${dateParts[1]}/${dateParts[0]}/${dateParts[2]}`);
//     const location = columns[1];
//     const teamA = columns[2];
//     const teamB = columns[3];

//     if (!date || !location || !teamA || !teamB) {
//       console.error("Missing data in row:", rows[i]);
//       continue;
//     }

//     try {
//       // Check if a match with the same date, location, teamA, and teamB exists
//       const existingEntry = await Match.findOne({
//         date,
//         location,
//         teamA,
//         teamB,
//       });

//       if (existingEntry) {
//         // Update existing entry
//         existingEntry.date = date;
//         existingEntry.location = location.trim();
//         existingEntry.teamA = teamA.trim();
//         existingEntry.teamB = teamB.trim();
//         await existingEntry.save();
//         console.log("Entry updated:", existingEntry._id);
//       } else {
//         // Create new entry
//         const newEntry = new Match({
//           date,
//           location: location.trim(),
//           teamA: teamA.trim(),
//           teamB: teamB.trim(),
//         });
//         await newEntry.save();
//         console.log("New entry created:", newEntry._id);
//       }
//     } catch (error) {
//       console.error("Error processing row:", error);
//     }
//   }
// }

// // Function to monitor changes to the uploaded CSV file
// // Function to monitor changes to the uploaded CSV file with debounce
// function watchCSVFile(filePath) {
//   let timeout;

//   fs.watch(filePath, async (event, filename) => {
//     if (event === "change") {
//       console.log(`File ${filename} has been changed`);

//       // If a timeout is already set, clear it
//       if (timeout) {
//         clearTimeout(timeout);
//       }

//       // Set a new timeout to debounce the processing function
//       timeout = setTimeout(async () => {
//         // Read the updated CSV file content
//         fs.readFile(filePath, "utf-8", async (err, fileContent) => {
//           if (err) {
//             console.error("Error reading file:", err);
//             return;
//           }

//           // Process the updated CSV content and update the database
//           await processCSVContent(fileContent);
//         });
//       }, 1000); // Adjust the debounce delay as needed (e.g., 1000 ms)
//     }
//   });
// }

// // Function to handle CSV file upload
// exports.uploadCSV = async (req, res) => {
//   try {
//     if (!req.file) {
//       return res.status(400).json({ message: "No file uploaded" });
//     }

//     // Read the uploaded CSV file content
//     fs.readFile(req.file.path, "utf-8", async (err, fileContent) => {
//       if (err) {
//         console.error("Error reading file:", err);
//         return res.status(500).json({ message: "Error reading file" });
//       }

//       // Process the CSV content and update the database
//       await processCSVContent(fileContent);

//       // Start monitoring the uploaded CSV file for changes
//       watchCSVFile(req.file.path);

//       // Send response
//       res.json({ message: "CSV file uploaded and data updated successfully" });
//     });
//   } catch (error) {
//     console.error("Error:", error);
//     res.status(500).json({ message: error.message });
//   }
// };

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
const matchData = {};

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
    // Add more User-Agent strings as needed
  ];
  return userAgents[Math.floor(Math.random() * userAgents.length)];
}

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
      const matchDataItem = {
        dateAndTime,
        homeTeamName,
        awayTeamName,
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
