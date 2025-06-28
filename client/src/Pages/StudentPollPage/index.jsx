import { useState, useEffect, useRef } from "react";
import stopwatch from "../../assets/stopwatch.svg";
import LogoPill from "../../components/common/LogoPill";
import { useSocket } from "../../context/SocketContext";
import Button from "../../components/ui/Button";
import PollOptions from "../../components/PollOptions";

const StudentPollPage = () => {
  const {
    socket,
    currentPoll,
    votes,
    submitAnswer,
    calculatePercentage,
    timerExpired,
  } = useSocket();
  const [selectedOption, setSelectedOption] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [questionCount, setQuestionCount] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
    const username = sessionStorage.getItem("username");
    if (socket && username) {
      socket.emit("joinChat", { username });
    }
  }, [socket]);

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
  };

  const handleSubmit = () => {
    if (selectedOption && currentPoll) {
      const username = sessionStorage.getItem("username");
      if (username) {
        submitAnswer({
          username: username,
          option: selectedOption.text,
          pollId: currentPoll._id,
        });
        setSubmitted(true);
      } else {
        console.error("No username found in session storage!");
      }
    }
  };

  useEffect(() => {
    if (currentPoll && currentPoll.question !== "") {
      setTimeLeft(parseInt(currentPoll.timer));
      setSubmitted(false);
      setSelectedOption(null);
      setQuestionCount((prev) => prev + 1);
    }
  }, [currentPoll]);

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

  useEffect(() => {
    if (timerExpired && !submitted) {
      setSubmitted(true);
      setTimeLeft(0);
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
  }, [timerExpired, submitted]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const pollQuestion = currentPoll?.question || "";
  const pollOptions = currentPoll?.options || [];

  return (
    <div className="min-h-screen -4 flex flex-col items-center justify-center p-4">
      {pollQuestion === "" && timeLeft === 0 && (
        <div className="flex justify-center items-center mx-auto">
          <div className="flex flex-col items-center justify-center text-center">
            <LogoPill />

            <div role="status" className="my-8">
              <svg
                aria-hidden="true"
                className="w-12 h-12 text-[#500ECE] animate-spin dark:text-[#500ECE] fill-white"
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
              <span className="sr-only">Loading...</span>
            </div>

            <h3 className="text-2xl font-medium font-sora ">
              <span className="font-semibold">
                Wait for the teacher to ask questions..
              </span>
            </h3>
          </div>
        </div>
      )}

      {pollQuestion !== "" && (
        <div className="max-w-2xl w-full">
          <div className="flex items-center gap-4 mb-8 w-full text-left">
            <h1 className="text-2xl font-semibold  font-sora">
              Question {questionCount}
            </h1>
            <div className="flex items-center gap-2">
              <img src={stopwatch} alt="Timer" className="w-6 h-6" />
              <span className="text-lg font-semibold text-red-500 font-sora">
                {formatTime(timeLeft)}
              </span>
            </div>
          </div>

          <PollOptions
            question={pollQuestion}
            pollOptions={pollOptions}
            selectedOption={selectedOption}
            submitted={submitted}
            timeLeft={timeLeft}
            votes={votes}
            calculatePercentage={calculatePercentage}
            onOptionSelect={handleOptionSelect}
          />

          <div className="flex justify-end mb-8">
            <Button
              onClick={handleSubmit}
              disabled={!selectedOption || submitted || timeLeft === 0}
            >
              Submit Answer
            </Button>
          </div>
        </div>
      )}

      {submitted && (
        <div className="text-center mb-8">
          <p className="text-2xl font-semibold  font-sora">
            Wait for the teacher to ask a new question..
          </p>
        </div>
      )}
    </div>
  );
};

export default StudentPollPage;
