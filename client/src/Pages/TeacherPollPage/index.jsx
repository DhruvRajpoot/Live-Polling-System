import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import eyeIcon from "../../assets/eye.svg";
import LogoPill from "../../components/common/LogoPill";
import Button from "../../components/ui/Button";
import { useSocket } from "../../context/SocketContext";
import PollOptions from "../../components/PollOptions";
import ChatParticipantPopup from "../../components/ChatParticipantPopup";

const TeacherPollPage = () => {
  const {
    socket,
    currentPoll,
    votes,
    calculatePercentage,
    pollStatus,
    timerExpired,
  } = useSocket();
  const navigate = useNavigate();

  useEffect(() => {
    const storedPoll = sessionStorage.getItem("currentPoll");
    if (storedPoll) {
      sessionStorage.removeItem("currentPoll");
    }
  }, []);

  useEffect(() => {
    const username = sessionStorage.getItem("username");
    if (socket && username) {
      socket.emit("joinChat", { username });
    }
  }, [socket]);

  const askNewQuestion = () => {
    navigate("/poll-creation");
  };

  const handleViewPollHistory = () => {
    navigate("/teacher-poll-history");
  };

  const pollQuestion = currentPoll?.question || "";
  const pollOptions = currentPoll?.options || [];

  const canAskNewQuestion = !pollQuestion || pollStatus.allAnswered;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="flex justify-center mb-6">
          <Button
            onClick={handleViewPollHistory}
            className="max-w-[91%] lg:max-w-none absolute top-4 lg:top-10 lg:right-10 text-sm lg:text-base"
          >
            <img src={eyeIcon} alt="View" className="w-4 h-4 lg:w-5 lg:h-5" />
            <span className="hidden lg:inline">View Poll History</span>
            <span className="lg:hidden">History</span>
          </Button>
        </div>

        {pollQuestion && (
          <div className="max-w-2xl w-full">
            <div className="flex items-center gap-4 mb-6 max-w-2xl w-full text-left">
              <h1 className="text-xl lg:text-2xl font-semibold font-sora">
                Question
              </h1>
            </div>

            <div className="mb-6 p-3 lg:p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-2 lg:gap-0">
                <div className="text-xs lg:text-sm text-gray-600 font-sora">
                  <span className="font-semibold">Students Progress:</span>
                </div>
                <div className="text-xs lg:text-sm font-sora">
                  <span className="font-semibold text-[#6766D5]">
                    {pollStatus.answeredStudents}
                  </span>
                  <span className="text-gray-600"> / </span>
                  <span className="font-semibold text-gray-800">
                    {pollStatus.totalStudents}
                  </span>
                  <span className="text-gray-600"> answered</span>
                </div>
              </div>

              <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-[#6766D5] h-2 rounded-full transition-all duration-300"
                  style={{
                    width: `${
                      pollStatus.totalStudents > 0
                        ? (pollStatus.answeredStudents /
                            pollStatus.totalStudents) *
                          100
                        : 0
                    }%`,
                  }}
                ></div>
              </div>

              {pollStatus.totalStudents > 0 && pollStatus.allAnswered && (
                <div className="mt-2 text-xs lg:text-sm text-green-600 font-semibold font-sora">
                  {timerExpired
                    ? "⏰ Time's up! All students marked as answered."
                    : "✓ All students have answered!"}
                </div>
              )}
            </div>

            <PollOptions
              question={pollQuestion}
              pollOptions={pollOptions}
              votes={votes}
              calculatePercentage={calculatePercentage}
              viewOnly={true}
            />

            <div className="flex justify-end mb-6 lg:mb-8">
              <Button onClick={askNewQuestion} disabled={!canAskNewQuestion}>
                + Ask a New Question
              </Button>
            </div>

            {!canAskNewQuestion && (
              <div className="text-center text-xs lg:text-sm text-gray-500 font-sora mb-4 px-4 lg:px-0">
                {timerExpired
                  ? "Timer has expired. You can now ask a new question."
                  : "Wait for all students to answer before asking a new question"}
              </div>
            )}
          </div>
        )}

        {!pollQuestion && (
          <div className="flex flex-col justify-center items-center mx-auto gap-4 px-4 lg:px-0">
            <LogoPill />

            <p className="text-gray-600 font-sora mt-2 text-lg lg:text-xl text-center">
              Create a new poll to see results here
            </p>

            <Button onClick={askNewQuestion}>+ Ask a New Question</Button>
          </div>
        )}
      </div>

      <ChatParticipantPopup showKickOutButton={true} />
    </div>
  );
};

export default TeacherPollPage;
