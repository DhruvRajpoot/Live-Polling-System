import React, { useState } from "react";
import downArrow from "../../assets/downarrow.svg";

const Dropdown = ({
  options = [],
  value,
  onChange,
  placeholder = "Select an option",
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (option) => {
    onChange(option);
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className} bg-[#F2F2F2]`}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center justify-between
          w-full bg-[#F2F2F2] px-6 py-2 text-left border rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent
          border-gray-300
        `}
      >
        <span className={value ? "text-primary" : "text-gray-400"}>
          {value || placeholder}
        </span>

        <img
          src={downArrow}
          alt="dropdown"
          className={`w-4 h-4 ${isOpen ? "rotate-180" : ""} transition-all duration-500`}
        />
      </button>

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-[#F2F2F2] border border-gray-300 rounded-lg shadow-lg">
          {options.map((option, index) => (
            <button
              key={index}
              type="button"
              onClick={() => handleSelect(option)}
              className="w-full px-3 py-2 text-left hover:bg-white focus:outline-none focus:bg-white first:rounded-t-lg last:rounded-b-lg"
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dropdown;
