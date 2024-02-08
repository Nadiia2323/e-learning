import MatchGame from "./component/MatchGame";
import ClozeTest from "./component/ClozeTest";
import React, { useState } from "react";
import dbConnect from "../utils/dbConnect";
import { LyricModel } from "@/models/Schemas";
import SentenceOptions from "./component/SentenceOptions";
import TrueOrFalse from "./component/TrueOrFalse";
import styles from "@/styles/Details.module.css";

export async function getServerSideProps({ params }) {
  await dbConnect();
  // const task = await trueorfalseModel.find();
  // console.log("task :>> ", task);
  const song = await LyricModel.findById("65c353f69d4bfe27a25f9fc6")
    .populate({
      path: "tasks",
      strictPopulate: false,
      populate: {
        path: "wordPairs",
        model: "wordPair",
      },
    })
    .populate({
      path: "readingtasks",
      populate: [
        {
          path: "test",
          model: "clozetest",
        },
        {
          path: "testOp",
          model: "sentenceoption",
        },
      ],
    })
    .populate({
      path: "listeningtasks",
      populate: {
        path: "trueorfalse",
        model: "trueorfalse",
      },
    });

  // console.log("song server :>> ", song);

  return {
    props: { song: song ? JSON.parse(JSON.stringify(song)) : {} },
  };
}

export default function Details({ song }) {
  console.log("song :>> ", song);
  const [showSpeakingTasks, setShowSpeakingTasks] = useState(false);
  const [showReadingTasks, setShowReadingTasks] = useState(false);
  const [showListeningTasks, setShowListeningTasks] = useState(false);
  const [showGrammaTasks, setShowGrammaTasks] = useState(false);
  const [showVideo, setShowVideo] = useState(false);

  if (!song) {
    return <div>Song not found.</div>;
  }
  const toggleVideo = () => setShowVideo((prev) => !prev);
  const toggleSpeakingTasks = () => setShowSpeakingTasks((prev) => !prev);

  const toggleGrammaTasks = () => setShowGrammaTasks((prev) => !prev);
  const toggleReadingTasks = () => setShowReadingTasks((prev) => !prev);
  const toggleListeningTasks = () => setShowListeningTasks((prev) => !prev);

  return (
    <div className={styles.container}>
      <div>
        <h2 className={styles.heading}>
          {song.lyric} by {song.author}
        </h2>
      </div>
      <div className={styles.questions}>
        {song.tasks.questions.map((question, qIndex) => (
          <p key={qIndex} className={styles.question}>
            {question}
          </p>
        ))}
      </div>
      <div>
        <img
          src="https://res.cloudinary.com/dqgvmwnpl/image/upload/v1707392022/dog-meme_bdcmlj.gif"
          alt="Dog Meme Sticker"
          className={styles.sticker}
        />
      </div>

      <h2
        onClick={toggleVideo}
        style={{ cursor: "pointer" }}
        className={styles.toggleButton}
      >
        Video
      </h2>
      {showVideo && (
        <div className={styles.iframeContainer}>
          <iframe
            src={song.video}
            title={song.lyric}
            width="560"
            height="315"
            allowFullScreen
          ></iframe>
        </div>
      )}
      <div className={styles.section}>
        <h2
          onClick={toggleReadingTasks}
          style={{ cursor: "pointer" }}
          className={styles.toggleButton}
        >
          Lyric
        </h2>
        {showReadingTasks &&
          song.readingtasks &&
          song.readingtasks.map((task, index) => (
            <div key={index}>
              {task.test && task.name === "cloze-test" && (
                <>
                  <h3>{task.test.name}</h3>
                  <ClozeTest clozeTest={task.test.content} />
                </>
              )}

              {/* {task.testOp && task.name === "sentence with options" && (
                <SentenceOptions data={task.testOp.task} />
              )} */}
            </div>
          ))}
      </div>
      <div className={styles.section}>
        <h2
          onClick={toggleSpeakingTasks}
          style={{ cursor: "pointer" }}
          className={styles.toggleButton}
        >
          Speaking Questions
        </h2>
        {showSpeakingTasks && song.tasks && (
          <div>
            <h3>Task: {song.tasks.wordPairs.name}</h3>
            <MatchGame pairs={song.tasks.wordPairs.pairs} />
          </div>
        )}

        <div className={styles.section}>
          <h2
            onClick={toggleGrammaTasks}
            style={{ cursor: "pointer" }}
            className={styles.toggleButton}
          >
            GrammaPart
          </h2>
          {showGrammaTasks && (
            <iframe
              src="https://docs.google.com/presentation/d/e/2PACX-1vQIVw7pIP8sVjc_zI89BcbkjPXczY_PqHSsxTrCIxeyQViaFbY3KbKO7ivjkFusY3A8FAQgaHLWXpza/embed?start=false&loop=false&delayms=3000"
              width="560"
              height="315"
            ></iframe>
          )}
        </div>
        <div className={styles.section}>
          <h2
            onClick={toggleListeningTasks}
            style={{ cursor: "pointer" }}
            className={styles.toggleButton}
          >
            Listening Tasks
          </h2>
          {showListeningTasks && song.listeningtasks && (
            <div>
              <h3>{song.listeningtasks.name}</h3>
              <TrueOrFalse test={song.listeningtasks.trueorfalse.task} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
