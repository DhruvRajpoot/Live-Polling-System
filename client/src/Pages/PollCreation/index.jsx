import React, { useState, useEffect } from "react";
import Button from "../../components/ui/Button";
import EditText from "../../components/ui/EditText";
import Dropdown from "../../components/ui/Dropdown";
import RadioButton from "../../components/ui/RadioButton";
import LogoPill from "../../components/common/LogoPill";
import io from "socket.io-client";
import { API_URL } from "../../config/axiosInstance";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const PollCreation = () => {
  const [socket, setSocket] = useState(null);
  const [question, setQuestion] = useState("");
  const [timeLimit, setTimeLimit] = useState("60");
  const [options, setOptions] = useState([{ id: 1, text: "", correct: null }]);
  const teacherUsername = sessionStorage.getItem("username");
  const navigate = useNavigate();

  const timeLimitOptions = ["30", "60", "90", "120"];

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

  const handleTimeLimitChange = (value) => {
    setTimeLimit(value);
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index].text = value;
    setOptions(newOptions);
  };

  const handleCorrectAnswerChange = (index, isCorrect) => {
    const newOptions = [...options];
    newOptions[index].correct = isCorrect;
    setOptions(newOptions);
  };

  const addMoreOption = () => {
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

  const handleAskQuestion = () => {
    if (validateForm()) {
      const pollData = {
        teacherUsername,
        question,
        options,
        timer: parseInt(timeLimit),
      };
      socket.emit("createPoll", pollData);
      navigate("/teacher-poll");
    }
  };

  return (
    <div className="min-h-screen bg-primary p-0">
      <div className="max-w-4xl ml-[10%]">
        <div className="pt-20 pb-8 px-8">
          <div className="mb-10">
            <LogoPill />
          </div>

          <div className="mb-6">
            <h1 className="text-4xl font-sora leading-tight text-primary mb-4">
              <span className="font-normal">Let's </span>
              <span className="font-semibold">Get Started</span>
            </h1>
            <p className="text-lg font-sora text-secondary leading-6 max-w-2xl">
              you'll have the ability to create and manage polls, ask questions,
              and monitor your students' responses in real-time.
            </p>
          </div>
        </div>

        <div className="px-8 pb-8">
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <h2 className="text-xl font-sora font-semibold text-primary mb-4">
                Enter your question
              </h2>
            </div>
            <div className="ml-8">
              <Dropdown
                options={timeLimitOptions}
                value={timeLimit}
                onChange={handleTimeLimitChange}
                className="w-44"
              />
            </div>
          </div>

          <div className="mb-8">
            <div className="bg-gray-lightest rounded-sm relative">
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
              <div key={index} className="flex items-center gap-6">
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-sora font-semibold text-white"
                  style={{
                    background:
                      "linear-gradient(243deg, #8f64e1 0%, #4e367b 100%)",
                  }}
                >
                  {index + 1}
                </div>
                <div className="flex-1">
                  <EditText
                    value={option.text}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                    className="rounded-sm"
                    placeholder={`Enter option ${index + 1}`}
                  />
                </div>
                <div className="flex items-center gap-3">
                  <RadioButton
                    name={`option${index + 1}`}
                    value="Yes"
                    checked={option.correct === true}
                    onChange={() => handleCorrectAnswerChange(index, true)}
                    label="Yes"
                  />
                </div>
                <div className="flex items-center gap-3">
                  <RadioButton
                    name={`option${index + 1}`}
                    value="No"
                    checked={option.correct === false}
                    onChange={() => handleCorrectAnswerChange(index, false)}
                    label="No"
                  />
                </div>
              </div>
            ))}
            <div className="ml-10">
              <Button
                variant="outline"
                size="medium"
                onClick={addMoreOption}
                className="!w-40 !h-11 !text-sm !rounded-md"
              >
                + Add More option
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full min-h-px bg-[#F2F2F2] mt-2"></div>

      <div className="flex justify-end max-w-[calc(100%-200px)] mx-auto my-8">
        <Button variant="primary" onClick={handleAskQuestion}>
          Ask Question
        </Button>
      </div>
    </div>
  );
};

export default PollCreation;
