import React from "react";
import MatchGame from "../MatchGame";

// type Props = {
//   tasks: any[];
// };

export default function SpeakingSection({ tasks }) {
  return (
    <div>
      {tasks?.wordPairs ? (
        <div className="rounded-3xl border border-white/10 bg-black/20 p-5">
          <h3 className="mb-4 text-lg font-semibold text-white">
            {tasks.wordPairs.name}
          </h3>
          <MatchGame pairs={tasks.wordPairs.pairs} />
        </div>
      ) : (
        <p className="text-zinc-400">No speaking tasks yet.</p>
      )}
    </div>
  );
}
