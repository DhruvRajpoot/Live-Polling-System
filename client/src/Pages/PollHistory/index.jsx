import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../config/axiosInstance";
import PollOptions from "../../components/PollOptions";
import Button from "../../components/ui/Button";

const PollHistoryPage = () => {
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const getPolls = async () => {
      const username = sessionStorage.getItem("username");
      try {
        const response = await axiosInstance.get(`/polls/${username}`);
        setPolls(response.data.data);
      } catch (error) {
        console.error("Error fetching polls:", error);
      } finally {
        setLoading(false);
      }
    };
    getPolls();
  }, []);

  const calculatePercentage = (count, totalVotes) => {
    if (totalVotes === 0) return 0;
    return (count / totalVotes) * 100;
  };

  return (
    <div className="min-h-screen flex flex-col items-center p-4">
      <div className="w-full max-w-4xl">
        <div className="flex items-center gap-4 my-10">
          <h1 className="text-5xl font-normal leading-[60px] font-sora">
            <span className="font-normal">View </span>
            <span className="font-semibold">Poll History</span>
          </h1>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <svg
              className="animate-spin h-10 w-10 text-[#6766D5] mb-4"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
              />
              <path
                className="opacity-75"
                fill="#6766D5"
                d="M4 12a8 8 0 018-8v8z"
              />
            </svg>
            <span className="text-gray-500 font-sora">
              Loading poll history...
            </span>
          </div>
        ) : polls.length > 0 ? (
          <div className="space-y-12">
            {polls.map((poll, index) => {
              const totalVotes = poll.options.reduce(
                (sum, option) => sum + option.votes,
                0
              );

              const pollOptions = poll.options.map((option, optionIndex) => ({
                id: String.fromCharCode(65 + optionIndex),
                text: option.text,
                votes: option.votes,
              }));

              const votes = {};
              poll.options.forEach((option) => {
                votes[option.text] = option.votes;
              });

              return (
                <div key={poll._id} className="max-w-2xl w-full">
                  <div className="flex items-center gap-4 mb-8 w-full text-left">
                    <h1 className="text-2xl font-semibold font-sora">
                      Question {index + 1}
                    </h1>
                  </div>

                  <PollOptions
                    question={poll.question}
                    pollOptions={pollOptions}
                    votes={votes}
                    calculatePercentage={(count) =>
                      calculatePercentage(count, totalVotes)
                    }
                    viewOnly={true}
                  />
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-5 text-gray-500 font-sora py-10">
            <div>
              <svg
                className="w-16 h-16 mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold font-sora">No Polls Found</h3>
            <p>
              You haven't created any polls yet. Start by creating your first
              poll!
            </p>
            <Button onClick={() => navigate("/poll-creation")}>
              Create Your First Poll
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PollHistoryPage;
