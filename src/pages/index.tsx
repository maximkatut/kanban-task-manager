import type { NextPage } from "next";
import Head from "next/head";
import { useState } from "react";
import Board from "../components/board";
import Button from "../components/button";
import DotsButton from "../components/dotsButton";
import Layout from "../components/layout";
import Sidebar from "../components/sidebar";
import Logo from "../components/svg/logo";

const Home: NextPage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(true);
  return (
    <Layout>
      <Head>
        <title>Kanban - Task Manager</title>
        <meta name="description" content="Kanban - task manager" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
      </Head>
      <header className="flex items-center bg-white dark:bg-grey-dark fixed w-full top-0 left-0 z-10">
        <div
          className={`transition-all py-9 ${
            isMenuOpen ? "pl-7 pr-[119px]" : "px-7"
          } border-r-[1px] border-lines-light dark:border-x-lines-dark`}
        >
          <Logo />
        </div>
        <div className="flex items-center justify-between flex-grow pl-10 pr-6">
          <h1 className="text-2xl font-bold">Platform Launch</h1>
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
      <div className="inline-flex mt-[98px]">
        <Sidebar {...{ setIsMenuOpen, isMenuOpen }} />
        <main
          className={`${
            isMenuOpen ? "ml-[calc(75rem/4)]" : ""
          } transition-all bg-grey-light dark:bg-grey-very-dark min-h-[calc(100vh-98px)] min-w-[calc(100vw-75rem/4)]`}
        >
          <Board />
        </main>
      </div>
    </Layout>
  );
};

export default Home;
