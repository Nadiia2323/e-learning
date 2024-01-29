import clientPromise from "@/utils/mongodb";
import { ObjectId } from "mongodb";

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
        $lookup: {
          from: "speaking",
          localField: "speaking",
          foreignField: "_id",
          as: "speaking",
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
    <>
      <h1>{song.lyric}</h1>
      <iframe src={song.video}></iframe>
      <div>
        {song.speaking[0].questions.map((question) => (
          <li key={question}>{question}</li>
        ))}
      </div>
    </>
  );
}
