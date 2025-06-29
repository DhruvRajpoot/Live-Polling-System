import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import eyeIcon from "../../assets/eye.svg";
import LogoPill from "../../components/common/LogoPill";
import Button from "../../components/ui/Button";
import { useSocket } from "../../context/SocketContext";
import PollOptions from "../../components/PollOptions";
import ChatParticipantPopup from "../../components/ChatParticipantPopup";

const TeacherPollPage = () => {
  const { socket, currentPoll, votes, calculatePercentage, setCurrentPoll } =
    useSocket();
  const navigate = useNavigate();

  useEffect(() => {
    const username = sessionStorage.getItem("username");
    const storedPoll = sessionStorage.getItem("currentPoll");
    if (storedPoll) {
      const pollData = JSON.parse(storedPoll);
      sessionStorage.removeItem("currentPoll");
      setCurrentPoll(pollData);
      if (socket && username) {
        socket.emit("joinChat", { username });
      }
    }
  }, []);

  const askNewQuestion = () => {
    navigate("/poll-creation");
  };

  const handleViewPollHistory = () => {
    navigate("/teacher-poll-history");
  };

  const pollQuestion = currentPoll?.question || "";
  const pollOptions = currentPoll?.options || [];

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

            <PollOptions
              question={pollQuestion}
              pollOptions={pollOptions}
              votes={votes}
              calculatePercentage={calculatePercentage}
              viewOnly={true}
            />

            <div className="flex justify-end mb-6 lg:mb-8">
              <Button onClick={askNewQuestion}>+ Ask a New Question</Button>
            </div>
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
