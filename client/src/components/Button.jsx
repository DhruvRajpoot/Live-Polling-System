import React from "react";

const Button = ({ text, logo = null, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="px-12 py-4 rounded-full text-white text-lg font-semibold leading-6 font-sora transition-all duration-200 hover:opacity-90 cursor-pointer"
      style={{
        background: "linear-gradient(159deg, #8f64e1 0%, #1d68bd 100%)",
      }}
    >
      {logo && <img src={logo} alt="logo" className="w-4 h-4 mr-2" />}
      {text}
    </button>
  );
};

export default Button;
