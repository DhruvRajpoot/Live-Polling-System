import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import LogoPill from "../../components/common/LogoPill";
import Button from "../../components/ui/Button";

const StudentRegistration = () => {
  const [name, setName] = useState("");
  const navigate = useNavigate();

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleContinue = () => {
    if (name.trim()) {
      sessionStorage.setItem("username", name.trim());
      navigate("/student-poll");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8 lg:py-0">
      <div className="w-full max-w-3xl mx-auto">
        <div className="flex justify-center mb-6 lg:mb-8">
          <LogoPill />
        </div>

        <div className="text-center mb-6 lg:mb-8">
          <h1 className="font-sora text-3xl lg:text-4xl xl:text-5xl leading-tight lg:leading-[51px] text-center mb-4 lg:mb-6">
            <span className="font-normal">Let's </span>
            <span className="font-semibold">Get Started</span>
          </h1>
        </div>

        <div className="text-center mb-8 lg:mb-12 px-4 lg:px-0">
          <p className="font-sora text-base lg:text-lg text-center max-w-2xl mx-auto">
            <span className="font-normal text-[#5C5B5B]">
              {" "}
              If you are a student, you will be able to{" "}
            </span>
            <span className="font-semibold ">submit your answers</span>
            <span className="font-normal text-[#5C5B5B]">
              , participate in live polls, and see how your responses compare
              with your classmates
            </span>
          </p>
        </div>

        <div className="mb-8 max-w-lg mx-auto px-4 lg:px-0">
          <label className="block font-sora text-base lg:text-lg font-normal mb-3">
            Enter your Name
          </label>
          <input
            type="text"
            value={name}
            onChange={handleNameChange}
            placeholder="Rahul Bajaj"
            className="w-full h-12 lg:h-15 px-4 py-3 lg:py-4 bg-gray-lightest rounded-sm font-sora text-base lg:text-lg focus:outline-none focus:ring-1 focus:ring-purple focus:border-transparent"
            style={{ backgroundColor: "#f2f2f2" }}
          />
        </div>

        <div className="flex justify-center px-4 lg:px-0">
          <Button disabled={!name} onClick={handleContinue}>
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
};

export default StudentRegistration;
