const Session = require("../models/Session");
const moment = require("moment");

exports.addSession = async (req, res) => {
  const { date, time, location, topics } = req.body;

  if (!date || !time || !location || !topics) {
    return res
      .status(400)
      .json({ error: "Missing required fields: date, time, location, topics" });
  }

  try {
    const existingSession = await Session.findOne({ date: date });

    if (existingSession) {
      return res.status(409).json({
        error: "Conflict: A session already exists at this date and time.",
      });
    }

    const newSession = await Session.create({
      date,
      time,
      location,
      topics,
    });

    return res.status(201).json(newSession);
  } catch (error) {
    console.error("Error saving session:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// exports.updateSession = async (req, res) => {
//   const { id } = req.params;
//   const { date } = req.body;
//   try {
//     const existingSession = await Session.findOne({
//       date: date,
//       _id: { $ne: id },
//     });

//     if (existingSession) {
//       return res.status(400).json({
//         message: "Conflict",
//       });
//     }

//     const updatedSession = await Session.findByIdAndUpdate(id, req.body, {
//       new: true,
//     });
//     if (!updatedSession) {
//       return res.status(404).json({ error: "Session not found" });
//     }

//     // Ensure res object exists before calling methods on it
//     if (res) {
//       res.json(updatedSession);
//     } else {
//       console.error("Response object is undefined");
//     }
//   } catch (error) {
//     console.log("Error updating session:", error);
//     // Ensure res object exists before calling methods on it
//     if (res) {
//       res.status(400).json({ error: error.message });
//     } else {
//       console.error("Response object is undefined");
//     }
//   }
// };

exports.updateSession = async (req, res) => {
  const { id } = req.params;
  const { date } = req.body;
  try {
    const existingSession = await Session.findOne({
      date: date,
      _id: { $ne: id },
    });

    if (existingSession) {
      return res.status(400).json({
        message: "Conflict",
      });
    }

    const updatedSession = await Session.findByIdAndUpdate(id, req.body, {
      new: true,
    });
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
    const weekNumber = moment(session.date).isoWeek();
    if (!sessionsPerWeek[weekNumber]) {
      sessionsPerWeek[weekNumber] = 1;
    } else {
      sessionsPerWeek[weekNumber]++;
    }
  });

  return sessionsPerWeek;
}

exports.getAllSessionsForMonth = async (req, res) => {
  const { month } = req.query;

  try {
    const sessions = await Session.find();

    // Filter sessions for the specified month
    const sessionsForMonth = sessions.filter((session) => {
      return moment(session.date).month() === parseInt(month) - 1; // Subtract 1 from month because moment.js months are zero-indexed
    });

    // Calculate sessions per week for the filtered sessions
    const sessionsPerMonth = calculateSessionsPerMonth(
      sessionsForMonth,
      parseInt(month)
    );

    res.json({ sessionsPerMonth });
  } catch (error) {
    console.error("Error fetching sessions:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

function calculateSessionsPerMonth(sessions, month) {
  let totalSessions = 0;

  sessions.forEach((session) => {
    // Check if the session's month matches the specified month
    if (moment(session.date).month() === month - 1) {
      // Subtract 1 from month because moment.js months are zero-indexed
      totalSessions++;
    }
  });

  return totalSessions;
}
