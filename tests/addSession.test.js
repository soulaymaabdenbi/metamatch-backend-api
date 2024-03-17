const {
  addSession,
  getAllSessions,
  deleteSession,
  updateSession,
} = require("../controllers/sessionController");
const Session = require("../models/Session");

describe("Session Controller", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("addSession", () => {
    test("should return 400 if required fields are missing", async () => {
      const mockSessionData = {
        time: "10:00",
        location: "Room 101",
        topics: ["Topic 1", "Topic 2"],
      };

      const mockRequest = {
        body: mockSessionData,
      };

      const mockResponse = {
        status: jest.fn(() => mockResponse),
        json: jest.fn(),
      };

      await addSession(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(400);

      expect(mockResponse.json).toHaveBeenCalledWith({
        error: "Missing required fields: date, time, location, topics",
      });
    });
  });

  describe("getAllSessions", () => {
    test("should return all sessions", async () => {
      const mockSessions = [
        {
          _id: "1",
          date: "2024-03-14",
          location: "Room 101",
          time: "10:00",
          topics: ["Topic 1", "Topic 2"],
        },
        {
          _id: "2",
          date: "2024-03-15",
          location: "Room 102",
          time: "11:00",
          topics: ["Topic 3", "Topic 4"],
        },
      ];

      const mockResponse = {
        json: jest.fn(),
      };

      Session.find = jest.fn().mockResolvedValue(mockSessions);

      await getAllSessions({}, mockResponse);

      expect(mockResponse.json).toHaveBeenCalledWith({
        sessions: mockSessions,
        sessionsPerWeek: {
          "2024-03-11 to 2024-03-17": 2,
        },
      });
    });
  });

  describe("deleteSession", () => {
    test("should delete a session by ID", async () => {
      const sessionId = "1";

      const deletedSession = {
        _id: sessionId,
        date: "2024-03-14",
        time: "10:00",
        location: "Room 101",
        topics: ["Topic 1", "Topic 2"],
      };

      Session.findByIdAndDelete = jest.fn().mockResolvedValue(deletedSession);

      const mockRequest = { params: { id: sessionId } };
      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };

      await deleteSession(mockRequest, mockResponse);

      expect(Session.findByIdAndDelete).toHaveBeenCalledWith(sessionId);

      expect(mockResponse.status).toHaveBeenCalledWith(200);

      expect(mockResponse.send).toHaveBeenCalled();
    });
  });

  describe("updateSession", () => {
    test("should update a session by ID", async () => {
      const sessionId = "1";

      const updatedSessionData = {
        date: "2024-03-15",
        time: "11:00",
        location: "Room 102",
        topics: ["Topic 3", "Topic 4"],
      };

      const updatedSession = {
        _id: sessionId,
        ...updatedSessionData,
      };

      Session.findByIdAndUpdate = jest.fn().mockResolvedValue(updatedSession);

      const mockRequest = {
        params: { id: sessionId },
        body: updatedSessionData,
      };
      const mockResponse = { json: jest.fn() };

      await updateSession(mockRequest, mockResponse);

      expect(Session.findByIdAndUpdate).toHaveBeenCalledWith(
        sessionId,
        updatedSessionData,
        { new: true }
      );

      expect(mockResponse.json).toHaveBeenCalledWith(updatedSession);
    });
  });
});
