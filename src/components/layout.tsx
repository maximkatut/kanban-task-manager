import React, { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return <div className="relative bg-grey-light w-screen min-h-screen">{children}</div>;
};

export default Layout;
