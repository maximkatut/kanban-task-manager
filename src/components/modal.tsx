import { Dispatch, SetStateAction, useEffect } from "react";
import ReactModal from "react-modal";
import { useStore } from "../store";
import { MD_WIDTH } from "../utils/const";

interface ModalProps {
  children?: React.ReactNode;
  isModalOpen: boolean;
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
}

const Modal = ({ children, isModalOpen, setIsModalOpen }: ModalProps) => {
  const width = useStore((state) => state.width);
  useEffect(() => {
    ReactModal.setAppElement(document.getElementById("layout") as HTMLElement);
  }, []);

  return (
    <ReactModal
      style={{
        content: {
          top: "0",
          bottom: "0",
          left: "0",
          right: "0",
          margin: "auto",
          width: width > MD_WIDTH ? "480px" : "343px",
          maxHeight: "90vh",
          height: "min-content",
          padding: "0",
          border: "none",
        },
        overlay: { zIndex: "10", backgroundColor: "rgba(0,0,0,0.5)" },
      }}
      isOpen={isModalOpen}
      onRequestClose={() => {
        setIsModalOpen((prev) => !prev);
      }}
    >
      {children}
    </ReactModal>
  );
};

export default Modal;
