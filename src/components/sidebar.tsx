import AsideButton from "./asideButtton";
import Toggle from "./toggle";

interface SidebarProps {
  setIsMenuOpen: (x: boolean) => void;
  isMenuOpen: boolean;
}

const Sidebar = ({ setIsMenuOpen, isMenuOpen }: SidebarProps) => {
  return (
    <aside
      className={`transition-all pb-8 w-[calc(75rem/4)] h-[calc(100vh-98px)] bg-white dark:bg-grey-dark fixed top-[98px] ${
        isMenuOpen ? "left-0" : "-left-80"
      } flex flex-col justify-between`}
    >
      <div>
        <p className="px-7 py-3 tracking-[0.15rem] uppercase">All boards (3)</p>
        <ul className="">
          <li className="">
            <AsideButton active>Platform Launch</AsideButton>
          </li>
          <li className="">
            <AsideButton>Marketing Plan</AsideButton>
          </li>
          <li className="">
            <AsideButton>Roadmap</AsideButton>
          </li>
          <li className="">
            <AsideButton newBoard>+ Create New Board</AsideButton>
          </li>
        </ul>
      </div>
      <div>
        <Toggle />
        <div
          onClick={() => {
            setIsMenuOpen(!isMenuOpen);
          }}
        >
          <AsideButton isTextHidden {...{ isMenuOpen }}>
            Hide Sidebar
          </AsideButton>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
