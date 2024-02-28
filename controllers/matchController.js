const Match = require("../models/Match");

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
    // Check if there's already a match scheduled at the same date
    const existingMatch = await Match.findOne({ date });
    if (existingMatch) {
      return res.status(400).json({
        message: "A match is already scheduled on the same date",
      });
    }

    // If no conflicting match found, create the new match
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

//findBydate
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
