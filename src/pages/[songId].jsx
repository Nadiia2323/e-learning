import clientPromise from "@/utils/mongodb";
import { ObjectId } from "mongodb";
import MatchGame from "./component/MatchGame";

export async function getServerSideProps(context) {
  const songId = context.params.songId;
  console.log("songId :>> ", songId);

  const client = await clientPromise;
  const db = client.db("e-learning");

  const objectId = new ObjectId(songId);
  const song = await db
    .collection("lyrics")
    .aggregate([
      {
        $match: { _id: objectId },
      },
      {
        $unwind: "$speaking",
      },
      {
        $lookup: {
          from: "speaking",
          localField: "speaking",
          foreignField: "_id",
          as: "speakingDetails",
        },
      },
      {
        $unwind: "$speakingDetails",
      },
      {
        $lookup: {
          from: "wordPairs",
          localField: "speakingDetails.wordPairs",
          foreignField: "_id",
          as: "speakingDetails.wordPairs",
        },
      },
      {
        $group: {
          _id: "$_id",
          lyric: { $first: "$lyric" },
          author: { $first: "$author" },
          video: { $first: "$video" },
          speaking: { $push: "$speakingDetails" },
        },
      },
    ])
    .toArray();

  return {
    props: { song: song[0] ? JSON.parse(JSON.stringify(song[0])) : null },
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

      <div>
        <h2>Speaking Questions</h2>
        {song.speaking.map((speakingItem, index) => (
          <div key={index}>
            <h3>Task: {speakingItem.wordPairs[0].name}</h3>
            {speakingItem.questions.map((question, qIndex) => (
              <p key={qIndex}>{question}</p>
            ))}

            <h4>Match Words with Their Description</h4>

            <MatchGame pairs={speakingItem.wordPairs[0].pairs} />
          </div>
        ))}
      </div>
    </div>
  );
}
