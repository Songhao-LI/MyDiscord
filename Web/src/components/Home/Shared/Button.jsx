import React from "react";

const Button = ({ text, bgColor, textColor, handler = () => {} }) => {
  return (
    <button
      onClick={handler}
      className={`${bgColor} ${textColor} opacity-80 cursor-pointer hover:scale-105 duration-300 pb-2 pt-1 px-6 rounded-full relative z-10`}
    >
      {text}
    </button>
  );
};

export default Button;
