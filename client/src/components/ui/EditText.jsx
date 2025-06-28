import React from "react";

const EditText = ({
  value,
  onChange,
  placeholder = "",
  type = "text",
  disabled = false,
  error = "",
  label = "",
  className = "",
}) => {
  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-primary mb-1">
          {label}
        </label>
      )}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        className={`
          w-full px-4 py-3 bg-[#F2F2F2] focus:outline-none focus:ring-1 focus:ring-[#4F0DCE] focus:border-transparent
          ${error ? "border border-red-500" : "border-none"}
          ${disabled ? "bg-gray-100 cursor-not-allowed" : ""}
        `}
      />
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default EditText;
