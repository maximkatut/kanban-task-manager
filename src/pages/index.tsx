import type { NextPage } from "next";
import Head from "next/head";
import { useEffect, useRef, useState } from "react";
import BoardComponent from "../components/boardComponent";
import Header from "../components/header";
import Layout from "../components/layout";
import Loader from "../components/loader";
import Sidebar from "../components/sidebar";
import { useStore } from "../store";
import { useBoardStore } from "../store/boards";
import { MD_WIDTH } from "../utils/const";
import { trpc } from "../utils/trpc";

const Home: NextPage = () => {
  const ref = useRef(true);
  const refMenuHeaderButton = useRef<HTMLHeadingElement | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const { data: boards, isLoading } = trpc.useQuery(["board.getAll"]);
  const activeBoard = useBoardStore((state) => state.activeBoard);
  const setActiveBoard = useBoardStore((state) => state.setActiveBoard);
  const width = useStore((state) => state.width);
  const setWidth = useStore((state) => state.setWidth);

  const isMediaMd = width > MD_WIDTH;

  useEffect(() => {
    if (ref.current) {
      setWidth(window.innerWidth);
      ref.current = false;
    }
    if (!activeBoard && boards) {
      setActiveBoard(boards[0]);
    }
  });

  return (
    <Layout>
      <Head>
        <title>{`Kanban - Task Manager ${activeBoard ? "- " + activeBoard.name : ""}`}</title>
        <meta name="description" content="Kanban - task manager" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
      </Head>
      <Header {...{ isMenuOpen, setIsMenuOpen, refMenuHeaderButton }} />
      <div className="inline-flex mt-[82px] lg:mt-[98px]">
        {boards && <Sidebar {...{ setIsMenuOpen, isMenuOpen, boards, refMenuHeaderButton }} />}
        <main
          className={`${
            isMenuOpen && isMediaMd && "ml-[calc(65rem/4)] lg:ml-[calc(75rem/4)]"
          } transition-all bg-grey-light dark:bg-grey-very-dark min-h-[calc(100vh-98px)] min-w-[calc(100vw-75rem/4)]`}
        >
          {isMenuOpen && !isMediaMd && <div className="absolute w-[200%] h-full -mt-4 bg-[rgba(0,0,0,0.3)] z-10"></div>}
          <h1 className="visually-hidden">Kanban - Task Manager</h1>
          {isLoading ? <Loader /> : activeBoard && <BoardComponent board={activeBoard} />}
        </main>
      </div>
    </Layout>
  );
};

export default Home;
