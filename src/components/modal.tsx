import { Dispatch, SetStateAction, useEffect } from "react";
import ReactModal from "react-modal";

interface ModalProps {
  children?: React.ReactNode;
  isModalOpen: boolean;
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
}

const Modal = ({ children, isModalOpen, setIsModalOpen }: ModalProps) => {
  useEffect(() => {
    ReactModal.setAppElement(document.getElementById("layout") as HTMLElement);
  }, []);
  return (
    <ReactModal
      style={{
        content: {
          top: "140px",
          left: "0",
          right: "0",
          margin: "0 auto",
          width: "480px",
          maxHeight: "500px",
          height: "min-content",
          padding: "0",
          border: "none",
          overflow: "scroll",
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
