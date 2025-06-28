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

    socket.on("kickOut", (userToKick) => {
      for (let id in connectedUsers) {
        if (connectedUsers[id].name === userToKick) {
          io.to(id).emit("kickedOut", { message: "You have been kicked out." });
          const userSocket = io.sockets.sockets.get(id);
          if (userSocket) {
            userSocket.disconnect(true);
          }
          delete connectedUsers[id];
          answeredStudents.delete(id);
          break;
        }
      }
      io.emit(
        "participantsUpdate",
        Object.values(connectedUsers).map((user) => user.name)
      );

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

    socket.on("joinChat", ({ username }) => {
      connectedUsers[socket.id] = {
        name: username,
        socketId: socket.id,
      };
      io.emit(
        "participantsUpdate",
        Object.values(connectedUsers).map((user) => user.name)
      );

      socket.on("disconnect", () => {
        answeredStudents.delete(socket.id);
        delete connectedUsers[socket.id];
        io.emit(
          "participantsUpdate",
          Object.values(connectedUsers).map((user) => user.name)
        );

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
