import { ReactNode } from "react";
interface ButtonProps {
  children: string | ReactNode;
  styles?: string;
  type?: "button" | "submit" | "reset" | undefined;
  onClick?: () => void;
  isLoading?: boolean;
}

const Button = ({ children, styles, type, onClick, isLoading }: ButtonProps) => {
  return (
    <button
      disabled={isLoading}
      onClick={onClick}
      type={type}
      className={styles || "mr-4 rounded-full px-6 py-3 text-white bg-purple hover:bg-purple-hover w-44"}
    >
      {children}
    </button>
  );
};

export default Button;
