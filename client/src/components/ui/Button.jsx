import React from "react";

const Button = ({
  children,
  onClick,
  disabled = false,
  type = "button",
  variant = "primary",
  className = "",
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
      disabled={disabled}
      className={buttonClasses}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
