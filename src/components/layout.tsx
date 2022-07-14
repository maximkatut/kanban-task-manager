import { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return <div className="relative bg-grey-light dark:bg-grey-very-dark w-screen min-h-screen">{children}</div>;
};

export default Layout;
