import MatchGame from "./component/MatchGame";
import ClozeTest from "./component/ClozeTest";
import React, { useState } from "react";
import dbConnect from "../utils/dbConnect";
import { LyricModel } from "@/models/Schemas";
import SentenceOptions from "./component/SentenceOptions";
import TrueOrFalse from "./component/TrueOrFalse";
import styles from "@/styles/Details.module.css";
import PictureMatchGame from "./component/PictureMatchGame";
import TestYouSelf from "./component/TestYouSelf";

export async function getServerSideProps({ params }) {
  await dbConnect();
  const { songId } = params;
  // const task = await testyourselfModel.find();
  // console.log("task :>> ", task);
  const song = await LyricModel.findById(songId)
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
      populate: [
        {
          path: "trueorfalse",
          model: "trueorfalse",
        },
        {
          path: "picturematch",
          model: "picturematchgame",
        },
      ],
    })
    .populate({
      path: "testyourself",
      model: "testyourself",
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
  const [testYourself, setTestYourself] = useState(false);

  if (!song) {
    return <div>Song not found.</div>;
  }
  const toggleVideo = () => setShowVideo((prev) => !prev);
  const toggleSpeakingTasks = () => setShowSpeakingTasks((prev) => !prev);

  const toggleGrammaTasks = () => setShowGrammaTasks((prev) => !prev);
  const toggleReadingTasks = () => setShowReadingTasks((prev) => !prev);
  const toggleListeningTasks = () => setShowListeningTasks((prev) => !prev);
  const toggleTestYourself = () => setTestYourself((prev) => !prev);

  return (
    <div className={styles.container}>
      <div>
        <h2 className={styles.heading}>
          {song.lyric} by {song.author}
        </h2>
      </div>
      <div className={styles.questions}>
        {song.tasks?.questions?.map((question, qIndex) => (
          <p key={qIndex} className={styles.question}>
            {question}
          </p>
        ))}
      </div>
      <div>
        <img
          src={song.tasks?.funpic}
          alt="Meme Sticker"
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
      <br />
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
                  <div className={styles.taskDescription}>
                    <h3 className={styles.task}>{task.test.name}</h3>
                  </div>

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
          Speaking
        </h2>
        {showSpeakingTasks && song.tasks && (
          <div>
            <div className={styles.taskDescription}>
              <h3 className={styles.task}> {song.tasks.wordPairs.name}</h3>
            </div>
            <MatchGame pairs={song.tasks.wordPairs.pairs} />
          </div>
        )}
        <br />

        <div className={styles.section}>
          <h2
            onClick={toggleGrammaTasks}
            style={{ cursor: "pointer" }}
            className={styles.toggleButton}
          >
            GrammaPart
          </h2>
          <br />
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
          {showListeningTasks &&
            song.listeningtasks.map((task, index) =>
              task.trueorfalse ? (
                <div key={index}>
                  <div className={styles.taskDescription}>
                    <h3 className={styles.task}>{task.name}</h3>
                  </div>
                  <TrueOrFalse test={task.trueorfalse.task} />
                </div>
              ) : task.picturematch ? (
                <div key={index}>
                  <br />
                  <div className={styles.taskDescription}>
                    <h3 className={styles.task}>{task.name}</h3>
                  </div>

                  <PictureMatchGame pairs={task.picturematch.pairs} />
                </div>
              ) : null
            )}
        </div>
        <div className={styles.section}>
          <h2
            onClick={toggleTestYourself}
            style={{ cursor: "pointer" }}
            className={styles.toggleButton}
          >
            Test yourself
          </h2>
          {testYourself && <TestYouSelf test={song.testyourself} />}
        </div>
      </div>
    </div>
  );
}
