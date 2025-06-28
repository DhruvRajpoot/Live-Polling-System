import React, { createContext, useContext, useEffect, useState } from "react";
import io from "socket.io-client";
import { API_URL } from "../config/axiosInstance";

const SocketContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [currentPoll, setCurrentPoll] = useState(null);
  const [votes, setVotes] = useState({});

  useEffect(() => {
    const newSocket = io(API_URL);
    setSocket(newSocket);

    newSocket.on("connect", () => {
      setIsConnected(true);
    });

    newSocket.on("disconnect", () => {
      setIsConnected(false);
    });

    newSocket.on("connect_error", () => {
      setIsConnected(false);
    });

    newSocket.on("pollCreated", (pollData) => {
      setCurrentPoll(pollData);
      setVotes({});
    });

    newSocket.on("pollResults", (updatedVotes) => {
      setVotes(updatedVotes);
    });

    newSocket.on("kickedOut", () => {
      sessionStorage.removeItem("username");
      window.location.href = "/kicked-out";
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const createPoll = (pollData) => {
    if (socket) {
      socket.emit("createPoll", pollData);
    }
  };

  const submitAnswer = (answerData) => {
    if (socket) {
      socket.emit("submitAnswer", answerData);
    }
  };

  const calculatePercentage = (count) => {
    const totalVotes = Object.values(votes).reduce((a, b) => a + b, 0);

    if (totalVotes === 0) return 0;
    return (count / totalVotes) * 100;
  };

  const value = {
    socket,
    isConnected,
    currentPoll,
    votes,
    createPoll,
    submitAnswer,
    calculatePercentage,
  };

  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  );
};
