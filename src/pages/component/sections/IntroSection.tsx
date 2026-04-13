import Image from "next/image";
import React from "react";

type IntroSectionProps = {
  tasks?: {
    questions?: string[];
    funpic?: string;
  };
};

export default function IntroSection({ tasks }: IntroSectionProps) {
  return (
    <div className="mb-8 grid gap-6 lg:grid-cols-[1.4fr_0.9fr]">
      <div className="rounded-[32px] border border-white/10 bg-white/5 p-6 shadow-xl backdrop-blur-xl">
        <p className="text-xs uppercase tracking-[0.25em] text-zinc-500">
          Before you start
        </p>

        <h2 className="mt-3 text-2xl font-semibold text-white">
          Warm-up questions
        </h2>

        <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-400">
          Take a moment to think about these questions before starting the
          lesson. You can answer them silently, discuss them with someone, or
          simply use them to get into the topic of the song.
        </p>

        {tasks?.questions?.length ? (
          <div className="mt-6 space-y-3">
            {tasks.questions.map((question, qIndex) => (
              <div
                key={qIndex}
                className="rounded-2xl border border-white/10 bg-black/20 px-4 py-4 text-sm leading-6 text-zinc-300"
              >
                <span className="mr-2 font-semibold text-white">
                  {qIndex + 1}.
                </span>
                {question}
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-6 text-sm text-zinc-500">
            No warm-up questions for this lesson yet.
          </p>
        )}
      </div>

      <div className="rounded-[32px] border border-white/10 bg-white/5 p-6 shadow-xl backdrop-blur-xl">
        <p className="text-xs uppercase tracking-[0.25em] text-zinc-500">
          Fun moment
        </p>

        <h2 className="mt-3 text-2xl font-semibold text-white">Lesson mood</h2>

        <p className="mt-3 text-sm leading-6 text-zinc-400">
          A small meme to set the mood before you begin.
        </p>

        {tasks?.funpic ? (
          <div className="mt-6 overflow-hidden rounded-3xl border border-white/10 bg-black/20">
            <div className="relative mt-6 h-[340px] overflow-hidden rounded-3xl border border-white/10 bg-black/20">
              <Image
                src={tasks.funpic}
                alt="Lesson meme"
                fill
                className="object-cover"
              />
            </div>
          </div>
        ) : (
          <div className="mt-6 rounded-3xl border border-dashed border-white/10 bg-black/20 p-8 text-sm text-zinc-500">
            No image for this lesson yet.
          </div>
        )}
      </div>
    </div>
  );
}
