import React, { useState } from "react";
import Button from "../../components/ui/Button";
import EditText from "../../components/ui/EditText";
import Dropdown from "../../components/ui/Dropdown";
import RadioButton from "../../components/ui/RadioButton";
import LogoPill from "../../components/common/LogoPill";

const PollCreation = () => {
  const [question, setQuestion] = useState("");
  const [timeLimit, setTimeLimit] = useState("60 seconds");
  const [options, setOptions] = useState([""]);
  const [correctAnswers, setCorrectAnswers] = useState({
    option1: "Yes",
    option2: "No",
  });

  const timeLimitOptions = [
    "30 seconds",
    "60 seconds",
    "90 seconds",
    "120 seconds",
  ];

  const handleQuestionChange = (e) => {
    setQuestion(e.target.value);
  };

  const handleTimeLimitChange = (value) => {
    setTimeLimit(value);
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleCorrectAnswerChange = (optionKey, value) => {
    setCorrectAnswers((prev) => ({
      ...prev,
      [optionKey]: value,
    }));
  };

  const addMoreOption = () => {
    setOptions([...options, ""]);
  };

  const handleAskQuestion = () => {
    alert("Question has been asked successfully!");
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
                0/100
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
                    value={option}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                    className="rounded-sm"
                    placeholder={`Enter option ${index + 1}`}
                  />
                </div>
                <div className="flex items-center gap-3">
                  <RadioButton
                    name={`option${index + 1}`}
                    value="Yes"
                    checked={correctAnswers[`option${index + 1}`] === "Yes"}
                    onChange={(e) =>
                      handleCorrectAnswerChange(
                        `option${index + 1}`,
                        e.target.value
                      )
                    }
                    label="Yes"
                  />
                </div>
                <div className="flex items-center gap-3">
                  <RadioButton
                    name={`option${index + 1}`}
                    value="No"
                    checked={correctAnswers[`option${index + 1}`] === "No"}
                    onChange={(e) =>
                      handleCorrectAnswerChange(
                        `option${index + 1}`,
                        e.target.value
                      )
                    }
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
