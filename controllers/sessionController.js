const Session = require("../models/Session");
const moment = require("moment");

// exports.getAllSessions = async (req, res) => {
//   try {
//     const sessions = await Session.find();
//     res.json(sessions);
//   } catch (error) {
//     console.log("Error fetching sessions:", error);
//     res.status(500).json({ error: "Could not fetch sessions" });
//   }
// };

exports.addSession = async (req, res) => {
  const { date, time, location, topics } = req.body;

  try {
    const existingSession = await Session.findOne({ date: date, time: time });

    if (existingSession) {
      return res
        .status(409)
        .json({ error: "Conflict: A session already exists at this time." });
    }
  } catch (error) {
    console.error("Error checking for conflicts:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }

  try {
    const newSession = await Session.create({
      date,
      time,
      location,
      topics,
    });
    res.status(201).json(newSession);
  } catch (error) {
    console.error("Error saving session:", error);
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
    res.status(200).send();
  } catch (error) {
    console.log("Error deleting session:", error);
    res.status(500).json({ error: "Could not delete session" });
  }
};

exports.getSessionById = async (req, res) => {
  const sessionId = req.params.id;

  try {
    const session = await Session.findById(sessionId);

    if (!session) {
      return res.status(404).json({ error: "Session not found" });
    }

    res.status(200).json(session);
  } catch (error) {
    console.error("Error retrieving session:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getAllSessions = async (req, res) => {
  try {
    const sessions = await Session.find();

    // Calculate the number of sessions per week
    const sessionsPerWeek = calculateSessionsPerWeek(sessions);

    res.json({ sessions, sessionsPerWeek });
  } catch (error) {
    console.log("Error fetching sessions:", error);
    res.status(500).json({ error: "Could not fetch sessions" });
  }
};

function calculateSessionsPerWeek(sessions) {
  const sessionsPerWeek = {};
  sessions.forEach((session) => {
    const weekStart = moment(session.date).startOf("isoWeek");
    const weekEnd = moment(session.date).endOf("isoWeek");
    const week = `${weekStart.format("YYYY-MM-DD")} to ${weekEnd.format(
      "YYYY-MM-DD"
    )}`;

    if (!sessionsPerWeek[week]) {
      sessionsPerWeek[week] = 1;
    } else {
      sessionsPerWeek[week]++;
    }
  });
  return sessionsPerWeek;
}
