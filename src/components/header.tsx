import Button from "./button";
import DotsButton from "./dotsButton";
import Logo from "./svg/logo";

interface HeaderProps {
  isMenuOpen?: boolean;
}

const Header = ({ isMenuOpen }: HeaderProps) => {
  return (
    <header className="flex items-center bg-white dark:bg-grey-dark fixed w-full top-0 left-0">
      <div
        className={`transition-all py-9 ${
          isMenuOpen ? "pl-7 pr-[119px]" : "px-7"
        } border-r-[1px] border-lines-light dark:border-x-lines-dark`}
      >
        <Logo />
      </div>
      <div className="flex items-center justify-between flex-grow pl-10 pr-6">
        <h2 className="text-2xl font-bold">Platform Launch</h2>
        <div className="flex justify-between text-base">
          <Button>+ Add New Task</Button>
          <DotsButton
            onClick={() => {
              console.log("dots");
            }}
          />
        </div>
      </div>
    </header>
  );
};

export default Header;
