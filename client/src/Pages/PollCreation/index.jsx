import { useState, useRef, useEffect } from "react";
import Button from "../../components/ui/Button";
import { useNavigate } from "react-router-dom";
import LogoPill from "../../components/common/LogoPill";
import { toast } from "react-hot-toast";
import downArrow from "../../assets/downarrow.svg";
import { useSocket } from "../../context/SocketContext";
import eyeIcon from "../../assets/eye.svg";
import axiosInstance from "../../config/axiosInstance";

const PollCreation = () => {
  const { createPoll } = useSocket();
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState([{ id: 1, text: "", correct: null }]);
  const [timer, setTimer] = useState("60");
  const [isTimerDropdownOpen, setIsTimerDropdownOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const timerOptions = [
    { value: "30", label: "30 seconds" },
    { value: "60", label: "60 seconds" },
    { value: "90", label: "90 seconds" },
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsTimerDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
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

  const askQuestion = async () => {
    if (validateForm()) {
      setIsCreating(true);

      try {
        let teacherUsername = sessionStorage.getItem("username");
        let pollData = { question, options, timer, teacherUsername };

        const response = await axiosInstance.post("/polls", pollData);

        if (response.data.status === "success") {
          createPoll(response.data.data);
          navigate("/teacher-poll");
        } else {
          toast.error("Failed to create poll");
        }
      } catch {
        toast.error("Failed to create poll. Please try again.");
      } finally {
        setIsCreating(false);
      }
    }
  };

  const handleViewPollHistory = () => {
    navigate("/teacher-poll-history");
  };

  return (
    <div className="min-h-screen p-0">
      <div className="flex justify-center mb-6">
        <Button
          onClick={handleViewPollHistory}
          className="max-w-[91%] lg:max-w-none absolute top-4 lg:top-10 lg:right-10 text-sm lg:text-base"
        >
          <img src={eyeIcon} alt="View" className="w-4 h-4 lg:w-5 lg:h-5" />
          <span>View Poll History</span>
        </Button>
      </div>
      <div className="max-w-4xl mx-auto px-4 lg:ml-[8%] lg:px-8">
        <div className="pt-16 lg:pt-20 pb-8">
          <div className="mb-4">
            <LogoPill />
          </div>

          <div className="mb-8 lg:mb-12">
            <h1 className="text-3xl lg:text-4xl xl:text-5xl font-sora leading-tight mb-4">
              <span className="font-normal">Let's </span>
              <span className="font-semibold">Get Started</span>
            </h1>
            <p className="text-base lg:text-lg xl:text-xl font-sora text-[#00000088] leading-6 max-w-2xl">
              You'll have the ability to create and manage polls, ask questions,
              and monitor your students' responses in real-time.
            </p>
          </div>

          <div>
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4">
              <h2 className="text-lg lg:text-xl font-sora font-semibold">
                Enter your question
              </h2>
              <div
                className="relative w-full lg:w-44 bg-[#F2F2F2]"
                ref={dropdownRef}
              >
                <button
                  type="button"
                  onClick={() => setIsTimerDropdownOpen(!isTimerDropdownOpen)}
                  className={`flex items-center justify-between
                    w-full bg-[#F2F2F2] px-4 lg:px-6 py-2 text-left border rounded-lg focus:outline-none focus:ring-1 focus:border-transparent
                    border-gray-300 font-sora text-sm lg:text-base
                  `}
                >
                  <span>
                    {timerOptions.find((option) => option.value === timer)
                      ?.label || "60 seconds"}
                  </span>
                  <img
                    src={downArrow}
                    alt="dropdown"
                    className={`w-3 h-3 lg:w-4 lg:h-4 ${
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
                        className="w-full px-3 py-2 text-left hover:bg-white focus:outline-none focus:bg-white first:rounded-t-lg last:rounded-b-lg font-sora text-sm lg:text-base"
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="mb-6 lg:mb-8">
              <div className="bg-gray-100 rounded-sm relative">
                <textarea
                  value={question}
                  onChange={handleQuestionChange}
                  className="w-full min-h-32 lg:min-h-44 p-3 lg:p-4 text-base lg:text-lg font-sora resize-none border-none outline-none bg-[#F2F2F2]"
                  placeholder="Enter your question here..."
                  maxLength={100}
                />
                <div className="absolute bottom-3 lg:bottom-4 right-3 lg:right-4 text-xs lg:text-sm font-sora">
                  {question.length}/100
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4 lg:gap-6 w-full lg:max-w-[650px]">
              <div className="flex flex-col lg:flex-row lg:justify-between gap-2 lg:gap-0">
                <h3 className="text-base lg:text-lg font-sora font-semibold">
                  Edit Options
                </h3>
                <h3 className="hidden lg:block text-base lg:text-lg font-sora font-semibold">
                  Is It Correct?
                </h3>
              </div>
              {options.map((option, index) => (
                <div
                  key={option.id}
                  className="flex flex-col lg:flex-row lg:items-center gap-3"
                >
                  <div className="flex items-center gap-2 w-full">
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
                      className="flex-1 px-3 lg:px-5 py-3 lg:py-4 font-sora outline-none bg-[#F2F2F2] text-sm lg:text-base"
                      placeholder={`Enter option ${index + 1}`}
                      value={option.text}
                      onChange={(e) =>
                        handleOptionChange(index, e.target.value)
                      }
                    />
                  </div>
                  <div className="flex justify-end items-center gap-3 lg:ml-4">
                    <label
                      htmlFor={`correct-yes-${index}`}
                      className={`flex items-center cursor-pointer gap-2 text-base`}
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
                          className={`w-5 h-5 lg:w-6 lg:h-6 rounded-full border-2 flex items-center justify-center ${
                            option.correct === true
                              ? "border-[#8F64E1] bg-white"
                              : "border-gray-400 bg-gray-medium"
                          }`}
                        >
                          {option.correct === true && (
                            <div className="w-2.5 h-2.5 lg:w-3.5 lg:h-3.5 rounded-full bg-[#8F64E1]"></div>
                          )}
                        </div>
                      </div>
                      Yes
                    </label>
                    <label
                      htmlFor={`correct-no-${index}`}
                      className={`flex items-center cursor-pointer gap-2 text-base`}
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
                          className={`w-5 h-5 lg:w-6 lg:h-6 rounded-full border-2 flex items-center justify-center ${
                            option.correct === false
                              ? "border-[#8F64E1] bg-white"
                              : "border-gray-400 bg-gray-medium"
                          }`}
                        >
                          {option.correct === false && (
                            <div className="w-2.5 h-2.5 lg:w-3.5 lg:h-3.5 rounded-full bg-[#8F64E1]"></div>
                          )}
                        </div>
                      </div>
                      No
                    </label>
                  </div>
                </div>
              ))}
              <div className="ml-0 lg:ml-10">
                <Button
                  variant="outline"
                  size="medium"
                  onClick={addOption}
                  className="w-full !h-10 lg:!h-11 !text-sm !rounded-xl"
                >
                  + Add More option
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full min-h-px bg-[#B6B6B6] mt-2"></div>

      <div className="flex justify-end max-w-[calc(100%-32px)] lg:max-w-[calc(100%-200px)] mx-auto my-6 lg:my-8 px-4 lg:px-0">
        <Button onClick={askQuestion} disabled={isCreating}>
          {isCreating ? "Creating Poll..." : "Ask Question"}
        </Button>
      </div>
    </div>
  );
};

export default PollCreation;
