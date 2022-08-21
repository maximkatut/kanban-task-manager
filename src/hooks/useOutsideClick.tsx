import { RefObject, useEffect } from "react";
import { useStore } from "../store";
import { MD_WIDTH } from "../utils/const";

interface useOutsideClickProps {
  setIsMenuOpen: (x: boolean) => void;
  ref: RefObject<HTMLElement>;
}

const useOutsideClick = ({ setIsMenuOpen, ref }: useOutsideClickProps) => {
  const width = useStore((state) => state.width);
  const isMediaMd = width > MD_WIDTH;
  useEffect(() => {
    if (!isMediaMd) {
      const handleOutsideClick = (e: any) => {
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
