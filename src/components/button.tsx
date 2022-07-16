interface ButtonProps {
  children: string;
  styles?: string;
  type?: "button" | "submit" | "reset" | undefined;
  onClick?: () => void;
}

const Button = ({ children, styles, type, onClick }: ButtonProps) => {
  return (
    <button
      onClick={onClick}
      type={type}
      className={styles || "mr-4 rounded-full px-6 py-3 text-white bg-purple hover:bg-purple-hover w-44"}
    >
      {children}
    </button>
  );
};

export default Button;
