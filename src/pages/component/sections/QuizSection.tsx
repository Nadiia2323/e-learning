import React from "react";
import TestYourself from "../TestYouSelf";
import { Lesson } from "@/types";
type QuizSectionProps = {
  test?: Lesson["testyourself"];
};

export default function QuizSection({ test }: QuizSectionProps) {
  return (
    <div>
      {test ? (
        <div className="rounded-3xl border border-white/10 bg-black/20 p-5">
          <TestYourself test={test} />
        </div>
      ) : (
        <p className="text-zinc-400">No final test yet.</p>
      )}
    </div>
  );
}
