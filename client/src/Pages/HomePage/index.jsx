import React, { useState } from "react";
import LogoPill from "../../components/common/LogoPill";
import Button from "../../components/ui/Button";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../config/axiosInstance";

const HomePage = () => {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState("student");
  const handleRoleSelect = (role) => {
    setSelectedRole(role);
  };

  const handleContinue = async () => {
    if (selectedRole === "student") {
      navigate("/student-registration");
    } else {
      const teacherlogin = await axiosInstance.post(`/teacher-login`);
      sessionStorage.setItem("username", teacherlogin.data.username);
      navigate("/poll-creation");
    }
  };

  return (
    <div className="min-h-screen bg-primary flex items-center justify-center px-4">
      <div className="w-full max-w-4xl">
        <div className="flex justify-center mb-10">
          <LogoPill />
        </div>

        <div className="text-center mb-16">
          <h1 className="text-4xl font-normal leading-[51px] text-primary mb-4 font-sora">
            <span className="font-normal">Welcome to the </span>
            <span className="font-semibold">Live Polling System</span>
          </h1>

          <p className="text-lg leading-6 text-secondary font-sora max-w-2xl mx-auto">
            Please select the role that best describes you to begin using the
            live polling system
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-8 justify-center mb-16">
          <div
            className={`w-full md:w-96 h-36 p-6 cursor-pointer transition-all duration-200 rounded-xl ${
              selectedRole === "student"
                ? "border-3 border-[#6f42c1]"
                : "border border-gray-300"
            } hover:shadow-lg`}
            onClick={() => handleRoleSelect("student")}
          >
            <h3 className="text-xl font-semibold leading-7 text-primary mb-3 font-sora">
              I'm a Student
            </h3>
            <p className="text-base leading-5 text-tertiary font-sora">
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry
            </p>
          </div>

          <div
            className={`w-full md:w-96 h-36 p-6 cursor-pointer transition-all duration-200 rounded-xl ${
              selectedRole === "teacher"
                ? "border-3 border-[#6f42c1]"
                : "border border-gray-300"
            } hover:shadow-lg`}
            onClick={() => handleRoleSelect("teacher")}
          >
            <h3 className="text-xl font-semibold leading-7 text-primary mb-3 font-sora">
              I'm a Teacher
            </h3>
            <p className="text-base leading-5 text-tertiary font-sora">
              Submit answers and view live poll results in real-time.
            </p>
          </div>
        </div>

        <div className="flex justify-center">
          <Button disabled={!selectedRole} onClick={handleContinue}>
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
