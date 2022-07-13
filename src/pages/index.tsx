import type { NextPage } from "next";
import Head from "next/head";
import Button from "../components/button";
import Layout from "../components/layout";
import Logo from "../components/logo";

const Home: NextPage = () => {
  return (
    <Layout>
      <Head>
        <title>Kanban - task manager</title>
        <meta name="description" content="Kanban - task manager" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <header className="flex items-center bg-white">
        <div className="py-9 px-6 border-r-[1px] border-lines-light">
          <Logo />
        </div>
        <div className="flex items-center justify-between flex-grow pl-10 pr-6">
          <h2 className="text-2xl font-bold">Platform Launch</h2>
          <div className="flex justify-between text-base">
            <Button>+ Add New Task</Button>
            <button className="px-2">
              <svg width="5" height="20" xmlns="http://www.w3.org/2000/svg">
                <g fill="#828FA3" fillRule="evenodd">
                  <circle cx="2.308" cy="2.308" r="2.308" />
                  <circle cx="2.308" cy="10" r="2.308" />
                  <circle cx="2.308" cy="17.692" r="2.308" />
                </g>
              </svg>
            </button>
          </div>
        </div>
      </header>
      <main></main>
      <footer></footer>
    </Layout>
  );
};

export default Home;
