import { useEffect, useState } from "react";
import Button from "../../components/ui/Button";
import io from "socket.io-client";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../../config/axiosInstance";
import LogoPill from "../../components/common/LogoPill";
import { toast } from "react-hot-toast";
import downArrow from "../../assets/downarrow.svg";

const PollCreation = () => {
  const [socket, setSocket] = useState(null);
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState([{ id: 1, text: "", correct: null }]);
  const [timer, setTimer] = useState("60");
  const [isTimerDropdownOpen, setIsTimerDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const timerOptions = [
    { value: "30", label: "30 seconds" },
    { value: "60", label: "60 seconds" },
    { value: "90", label: "90 seconds" },
  ];

  useEffect(() => {
    const newSocket = io(API_URL);
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const handleQuestionChange = (e) => {
    setQuestion(e.target.value);
  };

  const handleTimerChange = (selectedOption) => {
    setTimer(selectedOption.value);
    setIsTimerDropdownOpen(false);
  };

  const handleOptionChange = (index, value) => {
    const updatedOptions = [...options];
    updatedOptions[index].text = value;
    setOptions(updatedOptions);
  };

  const handleCorrectToggle = (index, isCorrect) => {
    const updatedOptions = [...options];
    updatedOptions[index].correct = isCorrect;
    setOptions(updatedOptions);
  };

  const addOption = () => {
    setOptions([
      ...options,
      { id: options.length + 1, text: "", correct: null },
    ]);
  };

  const validateForm = () => {
    if (question.trim() === "") {
      toast.error("Question cannot be empty");
      return false;
    }

    if (options.length < 2) {
      toast.error("At least two options are required");
      return false;
    }

    const optionTexts = options.map((option) => option.text.trim());
    if (optionTexts.some((text) => text === "")) {
      toast.error("All options must have text");
      return false;
    }

    const correctOptionExists = options.some(
      (option) => option.correct === true
    );
    if (!correctOptionExists) {
      toast.error("At least one correct option must be selected");
      return false;
    }

    return true;
  };

  const askQuestion = () => {
    if (validateForm()) {
      let teacherUsername = sessionStorage.getItem("username");
      let pollData = { question, options, timer, teacherUsername };
      if (socket) {
        socket.emit("createPoll", pollData);
        navigate("/teacher-poll");
      }
    }
  };

  return (
    <div className="min-h-screen p-0">
      <div className="max-w-4xl ml-[8%]">
        <div className="pt-20 pb-8 px-8">
          <div className="mb-4">
            <LogoPill />
          </div>

          <div className="mb-6">
            <h1 className="text-4xl font-sora leading-tight text-primary mb-4">
              <span className="font-normal">Let's </span>
              <span className="font-semibold">Get Started</span>
            </h1>
            <p className="text-lg font-sora text-gray-600 leading-6 max-w-2xl">
              You'll have the ability to create and manage polls, ask questions,
              and monitor your students' responses in real-time.
            </p>
          </div>

          <div>
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-sora font-semibold text-primary">
                Enter your question
              </h2>
              <div className="relative w-44 bg-[#F2F2F2]">
                <button
                  type="button"
                  onClick={() => setIsTimerDropdownOpen(!isTimerDropdownOpen)}
                  className={`flex items-center justify-between
                    w-full bg-[#F2F2F2] px-6 py-2 text-left border rounded-lg focus:outline-none focus:ring-1 focus:border-transparent
                    border-gray-300 font-sora text-primary
                  `}
                >
                  <span>
                    {timerOptions.find((option) => option.value === timer)
                      ?.label || "60 seconds"}
                  </span>
                  <img
                    src={downArrow}
                    alt="dropdown"
                    className={`w-4 h-4 ${
                      isTimerDropdownOpen ? "rotate-180" : ""
                    } transition-all duration-500`}
                  />
                </button>

                {isTimerDropdownOpen && (
                  <div className="absolute z-10 w-full mt-1 bg-[#F2F2F2] border border-gray-300 rounded-lg shadow-lg">
                    {timerOptions.map((option, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => handleTimerChange(option)}
                        className="w-full px-3 py-2 text-left hover:bg-white focus:outline-none focus:bg-white first:rounded-t-lg last:rounded-b-lg font-sora text-primary"
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="mb-8">
              <div className="bg-gray-100 rounded-sm relative">
                <textarea
                  value={question}
                  onChange={handleQuestionChange}
                  className="w-full min-h-44 p-4 text-lg font-sora text-primary resize-none border-none outline-none bg-[#F2F2F2]"
                  placeholder="Enter your question here..."
                  maxLength={100}
                />
                <div className="absolute bottom-4 right-4 text-sm font-sora text-primary">
                  {question.length}/100
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-6 max-w-4xl">
              <div className="flex justify-between">
                <h3 className="text-lg font-sora font-semibold text-primary">
                  Edit Options
                </h3>
                <h3 className="text-lg font-sora font-semibold text-primary">
                  Is It Correct?
                </h3>
              </div>
              {options.map((option, index) => (
                <div key={option.id} className="flex items-center gap-3">
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-sora font-semibold text-white"
                    style={{
                      background:
                        "linear-gradient(243deg, #8f64e1 0%, #4e367b 100%)",
                    }}
                  >
                    {index + 1}
                  </div>
                  <input
                    type="text"
                    className="flex-1 p-2 border border-gray-300 rounded-sm font-sora text-primary"
                    placeholder={`Enter option ${index + 1}`}
                    value={option.text}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                  />
                  <div className="flex items-center gap-3">
                    <label
                      htmlFor={`correct-yes-${index}`}
                      className={`flex items-center cursor-pointer gap-2`}
                      onClick={() => handleCorrectToggle(index, true)}
                    >
                      <div className="relative">
                        <input
                          type="radio"
                          name={`correct-${index}`}
                          id={`correct-yes-${index}`}
                          checked={option.correct === true}
                          onChange={() => handleCorrectToggle(index, true)}
                          className="sr-only"
                        />
                        <div
                          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                            option.correct === true
                              ? "border-[#8F64E1] bg-white"
                              : "border-gray-400 bg-gray-medium"
                          }`}
                        >
                          {option.correct === true && (
                            <div className="w-3.5 h-3.5 rounded-full bg-[#8F64E1]"></div>
                          )}
                        </div>
                      </div>
                      Yes
                    </label>
                    <label
                      htmlFor={`correct-no-${index}`}
                      className={`flex items-center cursor-pointer gap-2`}
                      onClick={() => handleCorrectToggle(index, false)}
                    >
                      <div className="relative">
                        <input
                          type="radio"
                          name={`correct-${index}`}
                          id={`correct-no-${index}`}
                          checked={option.correct === false}
                          onChange={() => handleCorrectToggle(index, false)}
                          className="sr-only"
                        />
                        <div
                          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                            option.correct === false
                              ? "border-[#8F64E1] bg-white"
                              : "border-gray-400 bg-gray-medium"
                          }`}
                        >
                          {option.correct === false && (
                            <div className="w-3.5 h-3.5 rounded-full bg-[#8F64E1]"></div>
                          )}
                        </div>
                      </div>
                      No
                    </label>
                  </div>
                </div>
              ))}
              <div className="ml-10">
                <Button
                  variant="outline"
                  size="medium"
                  onClick={addOption}
                  className="!w-40 !h-11 !text-sm !rounded-md"
                >
                  + Add More option
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full min-h-px bg-[#F2F2F2] mt-2"></div>

      <div className="flex justify-end max-w-[calc(100%-200px)] mx-auto my-8">
        <Button onClick={askQuestion}>Ask Question</Button>
      </div>
    </div>
  );
};

export default PollCreation;
