import BoardNameImage from "./svg/boardname";

interface AsideButtonProps {
  children: string;
  active?: boolean;
  newBoard?: boolean;
  isTextHidden?: boolean;
  isMenuOpen?: boolean;
}

const AsideButton = ({ children, newBoard, active = false, isTextHidden, isMenuOpen = true }: AsideButtonProps) => {
  return (
    <button
      disabled={active}
      className={`transition-all ${
        !isMenuOpen ? "ml-80 bg-purple p-4" : "w-[275px] px-8 py-3"
      } group   rounded-r-full font-bold ${
        active
          ? "bg-purple text-white"
          : isMenuOpen
          ? "text-grey-medium hover:text-purple hover:bg-purple-10"
          : "hover:bg-purple-hover"
      } text-base flex items-center`}
    >
      <span>
        <BoardNameImage {...{ active, newBoard, isTextHidden, isMenuOpen }} />
      </span>
      {isMenuOpen && <span className={`${newBoard ? "text-purple" : ""} ml-4`}>{children}</span>}
    </button>
  );
};

export default AsideButton;
