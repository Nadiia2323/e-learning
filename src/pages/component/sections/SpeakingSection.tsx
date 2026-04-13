import React from "react";
import MatchGame from "../MatchGame";
import { WordPairs } from "@/types";

type Props = {
  tasks?: {
    _id: string;
    wordPairs?: WordPairs;
  };
};

export default function SpeakingSection({ tasks }: Props) {
  if (!tasks?.wordPairs) {
    return <p className="text-zinc-400">No speaking tasks yet.</p>;
  }

  const { name, pairs } = tasks.wordPairs;

  return (
    <div className="rounded-3xl border border-white/10 bg-black/20 p-5">
      <h3 className="mb-4 text-lg font-semibold text-white">{name}</h3>
      <MatchGame pairs={pairs} />
    </div>
  );
}
