const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:4000", "http://frontend:4000"],
    methods: ["GET", "POST"],
  },
});

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI || "mongodb://mongodb:27017/collab_sessions")
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Socket.IO handlers
io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on("join_session", (sessionId) => {
    socket.join(sessionId);
    console.log(`User joined session ${sessionId}`);
  });

  socket.on("code_update", ({ sessionId, code }) => {
    socket.to(sessionId).emit("code_update", code);
  });

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

server.listen(5003, () => {
  console.log("Collaboration service running on port 5003");
});
