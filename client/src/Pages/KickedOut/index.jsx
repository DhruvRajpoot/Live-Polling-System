import React from "react";
import LogoPill from "../../components/common/LogoPill";

const KickedOut = () => {
  return (
    <div className="min-h-screen flex flex-col gap-5 items-center justify-center text-center">
      <LogoPill />
      <h1 className="text-5xl font-normal leading-[60px] font-sora mt-1">
        You've been Kicked out !
      </h1>
      <p className="text-[#6F6F6F] font-sora text-xl  max-w-3xl">
        Looks like the teacher had removed you from the poll system. Please Try
        again sometime.
      </p>
    </div>
  );
};

export default KickedOut;
