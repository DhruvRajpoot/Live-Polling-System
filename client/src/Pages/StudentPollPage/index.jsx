import React, { useState, useEffect, useRef } from "react";
import stopwatch from "../../assets/stopwatch.svg";
import chat from "../../assets/chat.svg";
import io from "socket.io-client";
import LogoPill from "../../components/common/LogoPill";
import { API_URL } from "../../config/axiosInstance";

const socket = io(API_URL);

const StudentPollPage = () => {
  const [votes, setVotes] = useState({});
  const [selectedOption, setSelectedOption] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [pollQuestion, setPollQuestion] = useState("");
  const [pollOptions, setPollOptions] = useState([]);
  const [pollId, setPollId] = useState("");
  const timerRef = useRef(null);

  const totalVotes = Object.values(votes).reduce((a, b) => a + b, 0);

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
  };

  const handleSubmit = () => {
    if (selectedOption) {
      const username = sessionStorage.getItem("username");
      if (username) {
        socket.emit("submitAnswer", {
          username: username,
          option: selectedOption,
          pollId: pollId,
        });
        setSubmitted(true);
      } else {
        console.error("No username found in session storage!");
      }
    }
  };

  useEffect(() => {
    socket.on("pollCreated", (pollData) => {
      setPollQuestion(pollData.question);
      setPollOptions(pollData.options);
      setVotes({});
      setSubmitted(false);
      setSelectedOption(null);
      setTimeLeft(pollData.timer);
      setPollId(pollData._id);
    });

    socket.on("pollResults", (updatedVotes) => {
      setVotes(updatedVotes);
    });

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (timeLeft > 0 && !submitted) {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }

      timerRef.current = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timerRef.current);
            setSubmitted(true);
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [timeLeft, submitted]);

  const calculatePercentage = (count) => {
    if (totalVotes === 0) return 0;
    return (count / totalVotes) * 100;
  };

  return (
    <div className="min-h-screen bg-primary-4 flex flex-col items-center justify-center p-4">
      {pollQuestion === "" && timeLeft === 0 && (
        <div className="flex justify-center items-center mx-auto">
          <div className="flex flex-col items-center justify-center text-center">
            <LogoPill />

            <div role="status" className="my-8">
              <svg
                aria-hidden="true"
                class="w-12 h-12 text-[#500ECE] animate-spin dark:text-[#500ECE] fill-white"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="currentColor"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentFill"
                />
              </svg>
              <span class="sr-only">Loading...</span>
            </div>

            <h3 className="text-2xl font-medium font-sora">
              <b>Wait for the teacher to ask questions..</b>
            </h3>
          </div>
        </div>
      )}

      {pollQuestion !== "" && (
        <div className="w-full max-w-2xl bg-white rounded-lg border border-purple-200 overflow-hidden mb-8">
          <div className="flex max-w-2xl w-full gap-8 mb-6">
            <h1 className="text-2xl font-semibold font-sora text-left">
              {pollQuestion}
            </h1>
            <div className="flex items-center gap-2">
              <img src={stopwatch} alt="Timer" className="w-6 h-6" />
              <span className="text-lg font-semibold text-red-500 font-sora">
                {timeLeft}
              </span>
            </div>
          </div>

          <div className="p-4 space-y-3">
            {pollOptions.map((option) => (
              <div
                key={option.id}
                className={`flex items-center justify-between p-3 bg-primary-2 rounded-md border border-purple-300 ${
                  selectedOption === option.text ? "border option-border" : ""
                }`}
                style={{
                  cursor:
                    submitted || timeLeft === 0 ? "not-allowed" : "pointer",
                }}
                onClick={() => {
                  if (!submitted && timeLeft > 0) {
                    handleOptionSelect(option.text);
                  }
                }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                    <span className="text-xs font-semibold text-accent font-sora">
                      {option.id}
                    </span>
                  </div>
                  <span className="text-white font-semibold font-sora">
                    {option.text}
                  </span>
                </div>
                {submitted && (
                  <span className="text-primary font-semibold font-sora">
                    {Math.round(calculatePercentage(votes[option.text] || 0))}%
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {!submitted && selectedOption && timeLeft > 0 && (
        <div className="d-flex justify-content-end align-items-center">
          <button
            type="submit"
            className="btn continue-btn my-3 w-25"
            onClick={handleSubmit}
          >
            Submit
          </button>
        </div>
      )}

      {submitted && (
        <div className="mt-5">
          <h6 className="text-center">
            Wait for the teacher to ask a new question...
          </h6>
        </div>
      )}

      <div className="fixed bottom-8 right-8">
        <button className="w-18 h-18 bg-[#5A66D1] rounded-full flex items-center justify-center shadow-lg hover:bg-opacity-90 transition-colors">
          <img src={chat} alt="Chat" className="w-8 h-8" />
        </button>
      </div>
    </div>
  );
};

export default StudentPollPage;
