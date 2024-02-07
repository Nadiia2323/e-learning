import MatchGame from "./component/MatchGame";
import ClozeTest from "./component/ClozeTest";
import React from "react";
import dbConnect from "../utils/dbConnect";
import { LyricModel } from "@/models/Schemas";
import SentenceOptions from "./component/SentenceOptions";
import TrueOrFalse from "./component/TrueOrFalse";

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
  if (!song) {
    return <div>Song not found.</div>;
  }

  return (
    <div>
      <h1>
        {song.lyric} - {song.author}
      </h1>
      <iframe
        src={song.video}
        title={song.lyric}
        width="560"
        height="315"
        allowFullScreen
      ></iframe>
      //? google slides //
      {/* <iframe
        src="https://docs.google.com/presentation/d/e/2PACX-1vTfWZ-vpRsU-bVPLeKWj5031c79BtF4654JEzA5nF9zNusHMxdFsBQktYszaoVMu5Z3q1-6WaGiI4hU/embed?start=false&loop=false&delayms=3000"
        width="560"
        height="315"
        allowFullScreen
      ></iframe> */}
      <div>
        <h2>Speaking Questions</h2>
        <div>
          <h2>Speaking Questions</h2>
          {song.tasks && (
            <div>
              <h3>Task: {song.tasks.wordPairs.name}</h3>
              {song.tasks.questions.map((question, qIndex) => (
                <p key={qIndex}>{question}</p>
              ))}

              <h4>Match Words with Their Description</h4>
              <MatchGame pairs={song.tasks.wordPairs.pairs} />
            </div>
          )}
        </div>
        <div>
          {song.readingtasks &&
            song.readingtasks.map((task, index) => (
              <div key={index}>
                <h2>{task.name}</h2>

                {task.test && task.name === "cloze-test" && (
                  <ClozeTest clozeT={task.test.content} />
                )}

                {task.testOp && task.name === "sentence with options" && (
                  <SentenceOptions data={task.testOp.task} />
                )}
              </div>
            ))}
        </div>
        <div>
          {song.listeningtasks && (
            <div>
              <h2>{song.listeningtasks.name}</h2>
              <TrueOrFalse test={song.listeningtasks.trueorfalse.task} />
              {/* <ul>
                {song.listeningtasks.task.map((item, index) => (
                  <li key={index}>
                    {item.statement} - {item.isTrue ? "True" : "False"}
                  </li>
                ))}
              </ul> */}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
