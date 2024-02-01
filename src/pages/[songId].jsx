// import clientPromise from "@/utils/mongodb";
// import { ObjectId } from "mongodb";
import MatchGame from "./component/MatchGame";
import ClozeTest from "./component/ClozeTest";

// export async function getServerSideProps(context) {
//   const songId = context.params.songId;
//   const client = await clientPromise;
//   const db = client.db("e-learning");
//   const test = await db
//     .collection("sentenceOptions")
//     .findOne({ _id: new ObjectId("65ba4e6312a1c760cffdb42f") });
//   console.log("test", test);

//   //?FINF ANOTHER WAY TO POPULATE
//   // const songs = await db
//   //   .collection("lyrics")
//   //   .findOne({ lyric: "Believer" })
//   //   .populate({ path: "reading" });
//   // console.log("songs", songs);

//   const objectId = new ObjectId(songId);
//   const song = await db
//     .collection("lyrics")
//     .aggregate([
//       {
//         $match: { _id: objectId },
//       },
//       {
//         $lookup: {
//           from: "speaking",
//           localField: "speaking",
//           foreignField: "_id",
//           as: "speaking",
//           pipeline: [
//             {
//               $lookup: {
//                 from: "wordPairs",
//                 localField: "wordPairs",
//                 foreignField: "_id",
//                 as: "wordPairs",
//               },
//             },
//           ],
//         },
//       },
//       {
//         $unwind: {
//           path: "$speaking",
//           preserveNullAndEmptyArrays: true,
//         },
//       },
//       {
//         $lookup: {
//           from: "reading",
//           localField: "reading",
//           foreignField: "_id",
//           as: "reading",
//           pipeline: [
//             {
//               $lookup: {
//                 from: "clozeTest",
//                 localField: "test",
//                 foreignField: "_id",
//                 as: "clozeTest",
//               },
//             },
//             {
//               $lookup: {
//                 from: "sentenceOptions",
//                 localField: "testOp",
//                 foreignField: "_id",
//                 as: "sentenceOptions",
//               },
//             },
//           ],
//         },
//       },
//       {
//         $unwind: {
//           path: "$reading",
//           preserveNullAndEmptyArrays: true,
//         },
//       },
//       {
//         $group: {
//           _id: "$_id",
//           lyric: { $first: "$lyric" },
//           author: { $first: "$author" },
//           video: { $first: "$video" },
//           speaking: { $first: "$speaking" },
//           reading: { $first: "$reading" },
//         },
//       },
//     ])
//     .toArray();

//   return {
//     props: { song: song[0] ? JSON.parse(JSON.stringify(song[0])) : null },
//   };
// }

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
        </div>

        <div>
          {song.reading && (
            <>
              <h2>{song.reading.clozeTest[0].name}</h2>
              <ClozeTest clozeT={song.reading.clozeTest[0].content} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
