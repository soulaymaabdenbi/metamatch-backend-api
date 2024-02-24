const Session = require("../models/Session");

exports.getAllSessions = async (req, res) => {
  try {
    const sessions = await Session.find();
    res.json(sessions);
  } catch (error) {
    console.log("Error fetching sessions:", error);
    res.status(500).json({ error: "Could not fetch sessions" });
  }
};

exports.addSession = async (req, res) => {
  const { date, time, location, topics } = req.body;
  try {
    const newSession = await Session.create({
      date,
      time,
      location,
      topics,
    });
    res.status(201).json(newSession);
  } catch (error) {
    console.log("Error saving session:", error);
    res.status(400).json({ error: error.message });
  }
};

exports.updateSession = async (req, res) => {
  const { id } = req.params;
  const { date, time, location, topics } = req.body;
  try {
    const updatedSession = await Session.findByIdAndUpdate(
      id,
      { date, time, location, topics },
      { new: true }
    );
    if (!updatedSession) {
      return res.status(404).json({ error: "Session not found" });
    }
    res.json(updatedSession);
  } catch (error) {
    console.log("Error updating session:", error);
    res.status(400).json({ error: error.message });
  }
};

exports.deleteSession = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedSession = await Session.findByIdAndDelete(id);
    if (!deletedSession) {
      return res.status(404).json({ error: "Session not found" });
    }
    res.status(204).send();
  } catch (error) {
    console.log("Error deleting session:", error);
    res.status(500).json({ error: "Could not delete session" });
  }
};
