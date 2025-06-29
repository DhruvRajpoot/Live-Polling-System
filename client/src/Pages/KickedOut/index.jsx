import React from "react";
import LogoPill from "../../components/common/LogoPill";

const KickedOut = () => {
  return (
    <div className="min-h-screen flex flex-col gap-4 lg:gap-5 items-center justify-center text-center px-4 lg:px-0">
      <LogoPill />
      <h1 className="text-2xl lg:text-4xl xl:text-5xl font-normal leading-tight lg:leading-[60px] font-sora mt-1">
        You've been Kicked out !
      </h1>
      <p className="text-base lg:text-lg xl:text-xl text-[#6F6F6F] font-sora max-w-3xl">
        Looks like the teacher had removed you from the poll system. Please Try
        again sometime.
      </p>
    </div>
  );
};

export default KickedOut;
