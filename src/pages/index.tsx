import { Board } from "@prisma/client";
import type { NextPage } from "next";
import Head from "next/head";
import { useState } from "react";
import BoardComponent from "../components/boardComponent";
import Header from "../components/header";
import Layout from "../components/layout";
import Sidebar from "../components/sidebar";
import { trpc } from "../utils/trpc";

const Home: NextPage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(true);
  const [activeBoard, setActiveBoard] = useState<undefined | Board>();
  const { data: boards } = trpc.useQuery(["board.getAll"]);

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
      <Header isMenuOpen={isMenuOpen} />
      <div className="inline-flex mt-[98px]">
        {boards && <Sidebar {...{ setIsMenuOpen, isMenuOpen, boards, setActiveBoard, activeBoard }} />}
        <main
          className={`${
            isMenuOpen ? "ml-[calc(75rem/4)]" : ""
          } transition-all bg-grey-light dark:bg-grey-very-dark min-h-[calc(100vh-98px)] min-w-[calc(100vw-75rem/4)]`}
        >
          <h1 className="visually-hidden">Kanban - Task Manager</h1>
          {activeBoard && <BoardComponent board={activeBoard} />}
        </main>
      </div>
    </Layout>
  );
};

export default Home;
