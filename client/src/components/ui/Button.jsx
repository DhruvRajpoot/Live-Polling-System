import React from "react";

const Button = ({
  children,
  onClick,
  disabled = false,
  type = "button",
  variant = "primary",
  className = "",
  loading = false,
  ...props
}) => {
  const variants = {
    primary:
      "bg-gradient-to-r from-[#8f64e1] to-[#1d68bd] text-white hover:bg-purple/90 focus:ring-purple/50",
    outline:
      "bg-transparent border border-[#8F64E1] !text-[#8F64E1] hover:bg-[#8F64E1] hover:!text-white focus:ring-[#8F64E1]/50",
  };

  const baseClasses =
    "flex justify-center items-center gap-2 w-full lg:w-60 h-10 lg:h-13 rounded-full text-white text-base lg:text-lg font-semibold leading-6 font-sora transition-all duration-200 hover:opacity-90 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed";

  const buttonClasses = `${baseClasses} ${variants[variant]} ${className}`;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={buttonClasses}
      {...props}
    >
      {loading && (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      )}
      {children}
    </button>
  );
};

export default Button;
