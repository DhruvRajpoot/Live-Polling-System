import React from "react";

const RadioButton = ({
  name,
  value,
  checked,
  onChange,
  label,
  disabled = false,
  className = "",
}) => {
  return (
    <label
      htmlFor={name}
      className={`flex items-center cursor-pointer ${className} ${
        disabled ? "cursor-not-allowed opacity-50" : ""
      }`}
      onClick={() => !disabled && onChange({ target: { value } })}
    >
      <div className="relative">
        <input
          type="radio"
          name={name}
          value={value}
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          className="sr-only"
        />
        <div
          className={`
            w-6 h-6 rounded-full border-2 flex items-center justify-center
            ${
              checked
                ? "border-[#8F64E1] bg-white"
                : "border-gray-400 bg-gray-medium"
            }
          `}
        >
          {checked && (
            <div className="w-3.5 h-3.5 rounded-full bg-[#8F64E1]"></div>
          )}
        </div>
      </div>
      {label && <span className="ml-2 text-base font-semibold">{label}</span>}
    </label>
  );
};

export default RadioButton;
