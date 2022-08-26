import { RefObject, useEffect } from "react";
import { useStore } from "../store";
import { MD_WIDTH } from "../utils/const";

interface useOutsideClickProps {
  setIsMenuOpen: (x: boolean) => void;
  ref: RefObject<HTMLElement>;
  isDotsMenu?: boolean;
  refMenuButton: RefObject<HTMLElement | undefined>;
}

const useOutsideClick = ({ setIsMenuOpen, ref, refMenuButton, isDotsMenu }: useOutsideClickProps) => {
  const width = useStore((state) => state.width);
  const isMediaMd = isDotsMenu ? false : width > MD_WIDTH;
  useEffect(() => {
    if (!isMediaMd) {
      const handleOutsideClick = (e: any) => {
        if (refMenuButton.current && refMenuButton.current.contains(e.target)) {
          return;
        }
        if (ref.current && !ref.current.contains(e.target)) {
          document.body.style.overflow = "auto";
          setIsMenuOpen(false);
        }
      };
      document.addEventListener("mousedown", handleOutsideClick);
      return () => {
        document.removeEventListener("mousedown", handleOutsideClick);
      };
    }
  });
  return {};
};

export default useOutsideClick;
