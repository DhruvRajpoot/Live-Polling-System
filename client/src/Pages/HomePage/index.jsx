import React, { useState } from "react";
import LogoPill from "../../components/common/LogoPill";
import Button from "../../components/ui/Button";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../config/axiosInstance";
import { toast } from "react-hot-toast";

const HomePage = () => {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
  };

  const handleContinue = async () => {
    if (selectedRole === "student") {
      navigate("/student-registration");
    } else {
      setIsLoading(true);
      try {
        const teacherlogin = await axiosInstance.post(`/teacher-login`);
        sessionStorage.setItem("username", teacherlogin.data.username);
        navigate("/poll-creation");
      } catch {
        toast.error("Teacher login failed");
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8 lg:py-0">
      <div className="w-full max-w-4xl">
        <div className="flex justify-center mb-6 lg:mb-7">
          <LogoPill />
        </div>

        <div className="text-center mb-12 lg:mb-16">
          <h1 className="text-2xl lg:text-4xl font-normal leading-tight lg:leading-[51px] mb-4 font-sora">
            <span className="font-normal">Welcome to the </span>
            <span className="font-semibold">Live Polling System</span>
          </h1>

          <p className="text-base lg:text-xl leading-6 text-[#00000083] font-sora max-w-2xl mx-auto px-4 lg:px-0">
            Please select the role that best describes you to begin using the
            live polling system
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-4 lg:gap-8 justify-center mb-12 lg:mb-16 px-4 lg:px-0">
          <div
            className={`w-full lg:w-96 h-32 lg:h-36 p-4 lg:p-6 cursor-pointer transition-all duration-200 rounded-xl ${
              selectedRole === "student"
                ? "border-3 border-[#6f42c1]"
                : "border border-gray-300"
            } hover:shadow-lg`}
            onClick={() => handleRoleSelect("student")}
          >
            <h3 className="text-lg lg:text-xl xl:text-2xl font-semibold leading-tight lg:leading-7 mb-2 font-sora">
              I'm a Student
            </h3>
            <p className="text-sm lg:text-base text-[#454545] font-sora">
              Lorem Ipsum is simply dummy txt of the printing and typesetting
              industry
            </p>
          </div>

          <div
            className={`w-full lg:w-96 h-32 lg:h-36 p-4 lg:p-6 cursor-pointer transition-all duration-200 rounded-xl ${
              selectedRole === "teacher"
                ? "border-3 border-[#6f42c1]"
                : "border border-gray-300"
            } hover:shadow-lg`}
            onClick={() => handleRoleSelect("teacher")}
          >
            <h3 className="text-lg lg:text-xl xl:text-2xl font-semibold leading-tight lg:leading-7 mb-2 font-sora">
              I'm a Teacher
            </h3>
            <p className="text-sm lg:text-base text-[#454545] font-sora">
              Submit answers and view live poll results in real-time.
            </p>
          </div>
        </div>

        <div className="flex justify-center px-4 lg:px-0">
          <Button
            disabled={!selectedRole || isLoading}
            onClick={handleContinue}
            loading={isLoading}
          >
            {isLoading ? "Loading..." : "Continue"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
