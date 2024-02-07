import MatchGame from "./component/MatchGame";
import ClozeTest from "./component/ClozeTest";
import React from "react";
import dbConnect from "../utils/dbConnect";
import { LyricModel, WordPairsModel } from "@/models/speakingSchema";

export async function getServerSideProps({ params }) {
  await dbConnect();
  const task = await WordPairsModel.findById("65c361dcda28d40097aa8c1d");
  console.log("task :>> ", task);
  const song = await LyricModel.findById("65c353f69d4bfe27a25f9fc6").populate({
    path: "tasks",
    strictPopulate: false,
    populate: {
      path: "wordPairs",
      model: "wordPair",
    },
  });

  console.log("song server :>> ", song);

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
      <iframe
        src="https://docs.google.com/presentation/d/e/2PACX-1vTfWZ-vpRsU-bVPLeKWj5031c79BtF4654JEzA5nF9zNusHMxdFsBQktYszaoVMu5Z3q1-6WaGiI4hU/embed?start=false&loop=false&delayms=3000"
        width="560"
        height="315"
        allowFullScreen
      ></iframe>
      {/* <div>
        <h2>Speaking Questions</h2>
        <div>
          <h2>Speaking Questions</h2>
          {song.speaking && (
            <div>
              <h3>Task: {song.speaking.wordPairs[0].name}</h3>
              {song.speaking.questions.map((question, qIndex) => (
                <p key={qIndex}>{question}</p>
              ))}

              <h4>Match Words with Their Description</h4>
              <MatchGame pairs={song.speaking.wordPairs[0].pairs} />
            </div>
          )}
        </div> */}
      {/* <div>
          {song.reading && (
            <>
              <h2>{song.reading.clozeTest[0].name}</h2>
              <ClozeTest clozeT={song.reading.clozeTest[0].content} />
            </>
          )}
        </div> */}
      {/* </div> */}
    </div>
  );
}
