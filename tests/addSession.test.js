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
        // Omitting the date field to simulate a missing required field
        const mockSessionData = {
          // date: "2024-03-14", // Omitted intentionally
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
  
        // Call addSession function
        await addSession(mockRequest, mockResponse);
  
        // Assert that the response status is 400 (Bad Request)
        expect(mockResponse.status).toHaveBeenCalledWith(400);
  
        // Assert that the response json method is called with the correct error message
        expect(mockResponse.json).toHaveBeenCalledWith({
          error: "Missing required fields: date, time, location, topics",
        });
      });
    });
  
    describe("getAllSessions", () => {
      test("should return all sessions", async () => {
        // Mock sessions data
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
  
        // Mock response object
        const mockResponse = {
          json: jest.fn(),
        };
  
        // Mock Session.find to return mockSessions
        Session.find = jest.fn().mockResolvedValue(mockSessions);
  
        // Call the function
        await getAllSessions({}, mockResponse);
  
        // Assert that the response json method is called with the sample sessions
        expect(mockResponse.json).toHaveBeenCalledWith({
          sessions: mockSessions,
          sessionsPerWeek: {
            "2024-03-11 to 2024-03-17": 2, // This depends on your sample sessions
          },
        });
      });
    });
  
    describe("deleteSession", () => {
      test("should delete a session by ID", async () => {
        // Mock the session ID
        const sessionId = "1";
  
        // Mock the deleted session
        const deletedSession = {
          _id: sessionId,
          date: "2024-03-14",
          time: "10:00",
          location: "Room 101",
          topics: ["Topic 1", "Topic 2"],
        };
  
        // Mock the Session.findByIdAndDelete method to resolve with the deleted session
        Session.findByIdAndDelete = jest.fn().mockResolvedValue(deletedSession);
  
        // Mock request and response objects
        const mockRequest = { params: { id: sessionId } };
        const mockResponse = {
          status: jest.fn().mockReturnThis(),
          send: jest.fn(),
        };
  
        // Call deleteSession function
        await deleteSession(mockRequest, mockResponse);
  
        // Assert that the Session.findByIdAndDelete method is called with the correct ID
        expect(Session.findByIdAndDelete).toHaveBeenCalledWith(sessionId);
  
        // Assert that the response status is 200 (OK)
        expect(mockResponse.status).toHaveBeenCalledWith(200);
  
        // Assert that the response send method is called
        expect(mockResponse.send).toHaveBeenCalled();
      });
    });
  
    describe("updateSession", () => {
      test("should update a session by ID", async () => {
        // Mock the session ID
        const sessionId = "1";
  
        // Mock the updated session data
        const updatedSessionData = {
          date: "2024-03-15",
          time: "11:00",
          location: "Room 102",
          topics: ["Topic 3", "Topic 4"],
        };
  
        // Mock the updated session
        const updatedSession = {
          _id: sessionId,
          ...updatedSessionData,
        };
  
        // Mock the Session.findByIdAndUpdate method to resolve with the updated session
        Session.findByIdAndUpdate = jest.fn().mockResolvedValue(updatedSession);
  
        // Mock request and response objects
        const mockRequest = {
          params: { id: sessionId },
          body: updatedSessionData,
        };
        const mockResponse = { json: jest.fn() };
  
        // Call updateSession function
        await updateSession(mockRequest, mockResponse);
  
        // Assert that the Session.findByIdAndUpdate method is called with the correct arguments
        expect(Session.findByIdAndUpdate).toHaveBeenCalledWith(
          sessionId,
          updatedSessionData,
          { new: true }
        );
  
        // Assert that the response json method is called with the updated session
        expect(mockResponse.json).toHaveBeenCalledWith(updatedSession);
      });
    });
  });