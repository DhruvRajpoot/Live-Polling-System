import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import eyeIcon from "../../assets/eye.svg";
import LogoPill from "../../components/common/LogoPill";
import Button from "../../components/ui/Button";
import { useSocket } from "../../context/SocketContext";

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
              <h1 className="text-2xl font-semibold  font-sora">
                Question
              </h1>
            </div>

            <div className="w-full bg-white rounded-lg border border-purple-200 overflow-hidden mb-8">
              <div className="bg-gradient-to-r from-gray-800 to-gray-600 px-4 py-3 rounded-t-lg">
                <h2 className="text-white font-semibold font-sora">
                  {pollQuestion}
                </h2>
              </div>

              <div className="p-4 space-y-3">
                {pollOptions.map((option) => (
                  <div
                    key={option.id}
                    className="flex items-center justify-between p-3 bg-[#F6F6F6] rounded-md border border-[#8d8d8d23] relative overflow-hidden"
                  >
                    <div
                      className="absolute left-0 top-0 h-full bg-[#6766D5] transition-all duration-500 ease-out"
                      style={{
                        width: `${Math.round(
                          calculatePercentage(votes[option.text] || 0)
                        )}%`,
                        zIndex: 1,
                      }}
                    />

                    <div className="flex items-center gap-3 relative w-full z-10">
                      <div
                        className={`w-6 h-6 text-white rounded-full flex items-center justify-center ${
                          Math.round(
                            calculatePercentage(votes[option.text] || 0)
                          ) < 10
                            ? "bg-[#8D8D8D]"
                            : "bg-white"
                        }`}
                      >
                        <span
                          className={`text-xs font-semibold font-sora ${
                            Math.round(
                              calculatePercentage(votes[option.text] || 0)
                            ) < 10
                              ? "text-white"
                              : "text-[#8F64E1]"
                          }`}
                        >
                          {option.id}
                        </span>
                      </div>

                      <span
                        className={`font-sora ${
                          Math.round(
                            calculatePercentage(votes[option.text] || 0)
                          ) > 30
                            ? "text-white"
                            : "text-black"
                        }`}
                      >
                        {option.text}
                      </span>
                    </div>

                    <span
                      className={`font-semibold font-sora z-10 relative ${
                        Math.round(
                          calculatePercentage(votes[option.text] || 0)
                        ) > 90
                          ? "text-white"
                          : "text-black"
                      }`}
                    >
                      {Math.round(calculatePercentage(votes[option.text] || 0))}
                      %
                    </span>
                  </div>
                ))}
              </div>
            </div>

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
