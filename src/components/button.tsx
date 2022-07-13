import React from "react";

interface ButtonProps {
  children: string;
}

const Button = ({ children }: ButtonProps) => {
  return (
    <button className="mr-4 rounded-full px-6 py-3 text-white bg-purple hover:bg-purple-hover w-44">{children}</button>
  );
};

export default Button;
