import React, { useState, useRef, useEffect } from "react";
import { useSocket } from "../context/SocketContext";
import chatIcon from "../assets/chat.svg";

const ChatParticipantPopup = ({ showKickOutButton = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("chat");
  const [message, setMessage] = useState("");
  const { participants, chatMessages, sendChatMessage, kickOutStudent } =
    useSocket();
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  const togglePopup = () => {
    setIsOpen(!isOpen);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleSendMessage = () => {
    if (message.trim()) {
      const currentUser = sessionStorage.getItem("username") || "Anonymous";
      const messageData = {
        text: message,
        sender: currentUser,
        timestamp: new Date().toLocaleTimeString(),
      };
      sendChatMessage(messageData);
      setMessage("");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const currentUser = sessionStorage.getItem("username") || "";

  return (
    <>
      <button
        onClick={togglePopup}
        className="fixed bottom-6 right-10 bg-[#6766D5] hover:bg-[#5a59c7] text-white rounded-full p-5 shadow-lg transition-all duration-200 z-50 cursor-pointer"
        title="Chat and Participants"
        aria-label="Open chat and participants"
      >
        <img src={chatIcon} alt="Chat" className="w-8 h-8" />
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 bg-transparent z-40"
          onClick={togglePopup}
        >
          <div
            className="fixed bottom-28 right-10 w-[370px] h-[370px] bg-white rounded-lg border border-[#E5E5E5] shadow-lg z-50 text-sm"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="border-b border-[#E5E5E5] flex">
              <button
                onClick={() => handleTabChange("chat")}
                className={`flex-1 py-2.5 text-sm font-medium transition-colors duration-200 cursor-pointer ${
                  activeTab === "chat"
                    ? "text-black border-b-2 border-[#A084E8]"
                    : "text-gray-500 hover:text-gray-800"
                }`}
              >
                Chat
              </button>
              <button
                onClick={() => handleTabChange("participants")}
                className={`flex-1 py-2.5 text-sm font-medium transition-colors duration-200 cursor-pointer ${
                  activeTab === "participants"
                    ? "text-black border-b-2 border-[#A084E8]"
                    : "text-gray-500 hover:text-gray-800"
                }`}
              >
                Participants
              </button>
            </div>

            <div className="h-[320px] overflow-hidden">
              {activeTab === "chat" ? (
                <div className="h-full flex flex-col">
                  <div className="flex-1 px-4 py-3 overflow-y-auto bg-white">
                    {chatMessages.length === 0 ? (
                      <div className="text-center text-gray-400 mt-10 text-base">
                        No messages yet
                      </div>
                    ) : (
                      <div className="flex flex-col gap-4">
                        {chatMessages.map((msg, idx) => {
                          const isOwn = msg.sender === currentUser;
                          return (
                            <div
                              key={idx}
                              className={`flex flex-col ${
                                isOwn ? "items-end" : "items-start"
                              }`}
                            >
                              <span
                                className={`mb-1 text-xs font-bold ${
                                  isOwn ? "text-[#8F64E1]" : "text-[#3A3A3B]"
                                }`}
                              >
                                {msg.sender}
                              </span>
                              <div
                                className={`max-w-[220px] px-3 py-1.5 rounded-lg text-sm break-words ${
                                  isOwn
                                    ? "bg-[#8F64E1] text-white rounded-tr-none"
                                    : "bg-[#3A3A3B] text-white rounded-tl-none"
                                }`}
                              >
                                {msg.text}
                              </div>
                            </div>
                          );
                        })}
                        <div ref={messagesEndRef} />
                      </div>
                    )}
                  </div>
                  <div className="p-4 border-t border-[#E5E5E5] bg-white">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Type a message..."
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#A084E8] focus:border-transparent text-sm"
                      />
                      <button
                        onClick={handleSendMessage}
                        disabled={!message.trim()}
                        className="px-4 py-2 bg-[#A084E8] text-white rounded-lg hover:bg-[#7c5fe6] disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 text-sm"
                      >
                        Send
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-full bg-white px-6 py-5 overflow-y-auto">
                  <div className="w-full">
                    <div className="flex pb-2 text-[#726F6F]">
                      <div className="flex-1 text-sm font-medium">Name</div>
                      {showKickOutButton && (
                        <div className="w-20 text-sm font-medium text-right">
                          Action
                        </div>
                      )}
                    </div>
                    {participants.length === 0 ? (
                      <div className="text-center text-gray-400 py-8 text-base">
                        No participants
                      </div>
                    ) : (
                      participants
                        .filter(
                          (participant) => participant.username !== currentUser
                        )
                        .map((participant) => (
                          <div
                            key={participant.socketId}
                            className="flex items-center py-2"
                          >
                            <div className="flex-1 text-sm text-black font-semibold">
                              {participant.username}
                            </div>
                            {showKickOutButton && (
                              <div className="w-20 text-right">
                                <button
                                  className="text-[#2D5BD2] underline font-medium text-sm hover:text-[#1d3b8b] cursor-pointer"
                                  onClick={() =>
                                    kickOutStudent(participant.socketId)
                                  }
                                >
                                  Kick out
                                </button>
                              </div>
                            )}
                          </div>
                        ))
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatParticipantPopup;
