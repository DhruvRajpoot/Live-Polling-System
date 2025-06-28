import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import eyeIcon from "../../assets/eye.svg";
import LogoPill from "../../components/common/LogoPill";
import Button from "../../components/ui/Button";
import { useSocket } from "../../context/SocketContext";
import PollOptions from "../../components/PollOptions";

const TeacherPollPage = () => {
  const { currentPoll, votes, calculatePercentage } = useSocket();
  const navigate = useNavigate();

  useEffect(() => {
    const storedPoll = sessionStorage.getItem("currentPoll");
    if (storedPoll) {
      sessionStorage.removeItem("currentPoll");
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
    <div className="min-h-screen -4 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="flex justify-center mb-6">
          <Button
            onClick={handleViewPollHistory}
            className="absolute top-10 right-10"
          >
            <img src={eyeIcon} alt="View" className="w-5 h-5" />
            View Poll History
          </Button>
        </div>

        {pollQuestion && (
          <div className="max-w-2xl w-full">
            <div className="flex items-center gap-4 mb-6 max-w-2xl w-full text-left">
              <h1 className="text-2xl font-semibold  font-sora">Question</h1>
            </div>

            <PollOptions
              question={pollQuestion}
              pollOptions={pollOptions}
              votes={votes}
              calculatePercentage={calculatePercentage}
              viewOnly={true}
            />

            <div className="flex justify-end mb-8">
              <Button onClick={askNewQuestion}>+ Ask a New Question</Button>
            </div>
          </div>
        )}

        {!pollQuestion && (
          <div className="flex flex-col justify-center items-center mx-auto gap-4">
            <LogoPill />

            <p className="text-gray-600 font-sora mt-2 text-xl">
              Create a new poll to see results here
            </p>

            <Button onClick={askNewQuestion}>Ask a New Question</Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherPollPage;
