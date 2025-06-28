import { Server } from "socket.io";
import { createPoll, voteOnOption } from "./controllers/poll.js";

const setupSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  let votes = {};
  let connectedUsers = {};
  let answeredStudents = new Set();
  let currentPollId = null;
  let pollTimer = null;

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("createPoll", async (pollData) => {
      votes = {};
      answeredStudents.clear();
      const poll = await createPoll(pollData);
      currentPollId = poll._id;
      io.emit("pollCreated", poll);

      if (pollTimer) {
        clearTimeout(pollTimer);
      }

      const timerDuration = parseInt(pollData.timer) * 1000;
      pollTimer = setTimeout(() => {
        const connectedSocketIds = Object.keys(connectedUsers);
        connectedSocketIds.forEach((socketId) => {
          answeredStudents.add(socketId);
        });

        const totalStudents = Object.keys(connectedUsers).length;
        const allAnswered =
          totalStudents === 0 || answeredStudents.size === totalStudents;

        io.emit("pollStatusUpdate", {
          totalStudents,
          answeredStudents: answeredStudents.size,
          allAnswered,
        });

        io.emit("timerExpired");
      }, timerDuration);

      const totalStudents = Object.keys(connectedUsers).length;
      const allAnswered =
        totalStudents === 0 || answeredStudents.size === totalStudents;

      io.emit("pollStatusUpdate", {
        totalStudents,
        answeredStudents: answeredStudents.size,
        allAnswered,
      });
    });

    socket.on("kickOut", (socketIdToKick) => {
      if (connectedUsers[socketIdToKick]) {
        answeredStudents.delete(socketIdToKick);
        delete connectedUsers[socketIdToKick];
        io.to(socketIdToKick).emit("kickedOut");
        const userSocket = io.sockets.sockets.get(socketIdToKick);
        if (userSocket) {
          userSocket.disconnect(true);
        }

        const participantsList = Object.entries(connectedUsers).map(
          ([socketId, user]) => ({
            socketId,
            username: user.name,
          })
        );
        io.emit("participantsUpdate", participantsList);

        if (currentPollId) {
          const totalStudents = Object.keys(connectedUsers).length;
          const allAnswered =
            totalStudents === 0 || answeredStudents.size === totalStudents;
          io.emit("pollStatusUpdate", {
            totalStudents,
            answeredStudents: answeredStudents.size,
            allAnswered,
          });
        }
      }
    });

    socket.on("joinChat", ({ username }) => {
      connectedUsers[socket.id] = {
        name: username,
        socketId: socket.id,
      };

      const participantsList = Object.entries(connectedUsers).map(
        ([socketId, user]) => ({
          socketId,
          username: user.name,
        })
      );
      io.emit("participantsUpdate", participantsList);

      socket.on("disconnect", () => {
        answeredStudents.delete(socket.id);
        delete connectedUsers[socket.id];

        const participantsList = Object.entries(connectedUsers).map(
          ([socketId, user]) => ({
            socketId,
            username: user.name,
          })
        );
        io.emit("participantsUpdate", participantsList);

        if (currentPollId) {
          const totalStudents = Object.keys(connectedUsers).length;
          const allAnswered =
            totalStudents === 0 || answeredStudents.size === totalStudents;
          io.emit("pollStatusUpdate", {
            totalStudents,
            answeredStudents: answeredStudents.size,
            allAnswered,
          });
        }
      });
    });

    socket.on("studentLogin", (name) => {
      socket.emit("loginSuccess", { message: "Login successful", name });
    });

    socket.on("chatMessage", (message) => {
      io.emit("chatMessage", message);
    });

    socket.on("submitAnswer", (answerData) => {
      votes[answerData.option] = (votes[answerData.option] || 0) + 1;
      answeredStudents.add(socket.id);
      voteOnOption(answerData.pollId, answerData.option);
      io.emit("pollResults", votes);

      const totalStudents = Object.keys(connectedUsers).length;

      const connectedSocketIds = Object.keys(connectedUsers);
      for (const answeredId of answeredStudents) {
        if (!connectedSocketIds.includes(answeredId)) {
          answeredStudents.delete(answeredId);
        }
      }

      const allAnswered =
        totalStudents === 0 || answeredStudents.size === totalStudents;
      io.emit("pollStatusUpdate", {
        totalStudents,
        answeredStudents: answeredStudents.size,
        allAnswered,
      });
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });
};

export default setupSocket;
