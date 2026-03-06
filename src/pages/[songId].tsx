import React, { useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import dbConnect from "../utils/dbConnect";
import { LyricModel } from "@/models/Schemas";

import MatchGame from "./component/MatchGame";
import ClozeTest from "./component/ClozeTest";
import SentenceOptions from "./component/SentenceOptions";
import TrueOrFalse from "./component/TrueOrFalse";
import PictureMatchGame from "./component/PictureMatchGame";
import TestYouSelf from "./component/TestYouSelf";

export async function getServerSideProps({ params }) {
  await dbConnect();
  const { songId } = params;

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

  return {
    props: { song: song ? JSON.parse(JSON.stringify(song)) : null },
  };
}

function SectionCard({
  title,
  subtitle,
  isOpen,
  onToggle,
  children,
}: {
  title: string;
  subtitle?: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl transition">
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-4 text-left"
      >
        <div>
          <h2 className="text-xl font-semibold text-white">{title}</h2>
          {subtitle && <p className="mt-1 text-sm text-zinc-400">{subtitle}</p>}
        </div>

        <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm text-zinc-300">
          {isOpen ? "Hide" : "Open"}
        </span>
      </button>

      {isOpen && <div className="mt-5">{children}</div>}
    </div>
  );
}

export default function Details({ song }) {
  const router = useRouter();

  const [showSpeakingTasks, setShowSpeakingTasks] = useState(false);
  const [showReadingTasks, setShowReadingTasks] = useState(false);
  const [showListeningTasks, setShowListeningTasks] = useState(false);
  const [showGrammarTasks, setShowGrammarTasks] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [showTestYourself, setShowTestYourself] = useState(false);

  if (!song) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950 text-white">
        Song not found.
      </div>
    );
  }

  const readingCount = song.readingtasks?.length || 0;
  const listeningCount = song.listeningtasks?.length || 0;
  const hasSpeaking = !!song.tasks?.wordPairs;
  const hasQuiz = !!song.testyourself;

  const totalSections =
    (song.video ? 1 : 0) +
    (readingCount ? 1 : 0) +
    (hasSpeaking ? 1 : 0) +
    1 +
    (listeningCount ? 1 : 0) +
    (hasQuiz ? 1 : 0);

  return (
    <>
      <Head>
        <title>{`${song.title || song.lyric} — SongLMS`}</title>
      </Head>

      <main className="relative min-h-screen overflow-hidden bg-zinc-950 text-white">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-[-120px] top-[-120px] h-[320px] w-[320px] rounded-full bg-fuchsia-500/10 blur-[120px]" />
          <div className="absolute bottom-[-140px] right-[-80px] h-[340px] w-[340px] rounded-full bg-indigo-500/10 blur-[120px]" />
          <div className="absolute left-1/2 top-1/3 h-[260px] w-[260px] -translate-x-1/2 rounded-full bg-violet-500/10 blur-[120px]" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-6 py-10">
          <button
            onClick={() => router.push("/songs")}
            className="mb-6 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-zinc-300 backdrop-blur transition hover:bg-white/10 hover:text-white"
          >
            ← Back to songs
          </button>

          {/* HERO */}
          <div className="mb-8 rounded-[32px] border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl">
            <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
              <div className="max-w-3xl">
                <p className="mb-3 text-sm uppercase tracking-[0.25em] text-zinc-500">
                  Song lesson
                </p>

                <h1 className="text-4xl font-semibold sm:text-5xl">
                  {song.title || song.lyric}
                </h1>

                <p className="mt-3 text-lg text-zinc-300">
                  by {song.author || "Unknown artist"}
                </p>

                <p className="mt-5 max-w-2xl text-sm leading-6 text-zinc-400 sm:text-base">
                  Listen, reflect, practice vocabulary, and improve your English
                  step by step through this song-based lesson.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 lg:min-w-[280px]">
                <div className="rounded-3xl border border-white/10 bg-black/20 p-4">
                  <p className="text-xs text-zinc-500">Sections</p>
                  <p className="mt-2 text-2xl font-semibold">{totalSections}</p>
                </div>

                <div className="rounded-3xl border border-white/10 bg-black/20 p-4">
                  <p className="text-xs text-zinc-500">Reading tasks</p>
                  <p className="mt-2 text-2xl font-semibold">{readingCount}</p>
                </div>

                <div className="rounded-3xl border border-white/10 bg-black/20 p-4">
                  <p className="text-xs text-zinc-500">Listening tasks</p>
                  <p className="mt-2 text-2xl font-semibold">
                    {listeningCount}
                  </p>
                </div>

                <div className="rounded-3xl border border-white/10 bg-black/20 p-4">
                  <p className="text-xs text-zinc-500">Final quiz</p>
                  <p className="mt-2 text-2xl font-semibold">
                    {hasQuiz ? "Yes" : "No"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* INTRO BLOCKS */}
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
                lesson. You can answer them silently, discuss them with someone,
                or simply use them to get into the topic of the song.
              </p>

              {song.tasks?.questions?.length ? (
                <div className="mt-6 space-y-3">
                  {song.tasks.questions.map((question, qIndex) => (
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

              <h2 className="mt-3 text-2xl font-semibold text-white">
                Lesson mood
              </h2>

              <p className="mt-3 text-sm leading-6 text-zinc-400">
                A small meme to set the mood before you begin.
              </p>

              {song.tasks?.funpic ? (
                <div className="mt-6 overflow-hidden rounded-3xl border border-white/10 bg-black/20">
                  <img
                    src={song.tasks.funpic}
                    alt="Lesson meme"
                    className="h-full max-h-[340px] w-full object-cover"
                  />
                </div>
              ) : (
                <div className="mt-6 rounded-3xl border border-dashed border-white/10 bg-black/20 p-8 text-sm text-zinc-500">
                  No image for this lesson yet.
                </div>
              )}
            </div>
          </div>

          {/* SECTIONS */}
          <div className="grid gap-6">
            <SectionCard
              title="Video"
              subtitle="Watch and listen to the original song"
              isOpen={showVideo}
              onToggle={() => setShowVideo((prev) => !prev)}
            >
              {song.video ? (
                <div className="overflow-hidden rounded-3xl border border-white/10">
                  <iframe
                    src={song.video}
                    title={song.title || song.lyric}
                    className="h-[240px] w-full md:h-[420px]"
                    allowFullScreen
                  />
                </div>
              ) : (
                <p className="text-zinc-400">No video available.</p>
              )}
            </SectionCard>

            <SectionCard
              title="Reading"
              subtitle="Practice lyrics and reading tasks"
              isOpen={showReadingTasks}
              onToggle={() => setShowReadingTasks((prev) => !prev)}
            >
              {song.readingtasks?.length ? (
                <div className="space-y-6">
                  {song.readingtasks.map((task, index) => (
                    <div
                      key={index}
                      className="rounded-3xl border border-white/10 bg-black/20 p-5"
                    >
                      {task.test && task.name === "cloze-test" && (
                        <>
                          <h3 className="mb-4 text-lg font-semibold text-white">
                            {task.test.name}
                          </h3>
                          <ClozeTest clozeTest={task.test} />
                        </>
                      )}

                      {task.testOp && task.name === "sentence with options" && (
                        <>
                          <h3 className="mb-4 text-lg font-semibold text-white">
                            {task.name}
                          </h3>
                          <SentenceOptions data={task.testOp.task} />
                        </>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-zinc-400">No reading tasks yet.</p>
              )}
            </SectionCard>

            <SectionCard
              title="Speaking"
              subtitle="Match words and practice active vocabulary"
              isOpen={showSpeakingTasks}
              onToggle={() => setShowSpeakingTasks((prev) => !prev)}
            >
              {song.tasks?.wordPairs ? (
                <div className="rounded-3xl border border-white/10 bg-black/20 p-5">
                  <h3 className="mb-4 text-lg font-semibold text-white">
                    {song.tasks.wordPairs.name}
                  </h3>
                  <MatchGame pairs={song.tasks.wordPairs.pairs} />
                </div>
              ) : (
                <p className="text-zinc-400">No speaking tasks yet.</p>
              )}
            </SectionCard>

            <SectionCard
              title="Grammar"
              subtitle="Review grammar connected to the song"
              isOpen={showGrammarTasks}
              onToggle={() => setShowGrammarTasks((prev) => !prev)}
            >
              <div className="overflow-hidden rounded-3xl border border-white/10">
                <iframe
                  src="https://docs.google.com/presentation/d/e/2PACX-1vQIVw7pIP8sVjc_zI89BcbkjPXczY_PqHSsxTrCIxeyQViaFbY3KbKO7ivjkFusY3A8FAQgaHLWXpza/embed?start=false&loop=false&delayms=3000"
                  className="h-[280px] w-full md:h-[480px]"
                />
              </div>
            </SectionCard>

            <SectionCard
              title="Listening"
              subtitle="Train understanding with listening exercises"
              isOpen={showListeningTasks}
              onToggle={() => setShowListeningTasks((prev) => !prev)}
            >
              {song.listeningtasks?.length ? (
                <div className="space-y-6">
                  {song.listeningtasks.map((task, index) =>
                    task.trueorfalse ? (
                      <div
                        key={index}
                        className="rounded-3xl border border-white/10 bg-black/20 p-5"
                      >
                        <h3 className="mb-4 text-lg font-semibold text-white">
                          {task.name}
                        </h3>
                        <TrueOrFalse test={task.trueorfalse.task} />
                      </div>
                    ) : task.picturematch ? (
                      <div
                        key={index}
                        className="rounded-3xl border border-white/10 bg-black/20 p-5"
                      >
                        <h3 className="mb-4 text-lg font-semibold text-white">
                          {task.name}
                        </h3>
                        <PictureMatchGame pairs={task.picturematch.pairs} />
                      </div>
                    ) : null,
                  )}
                </div>
              ) : (
                <p className="text-zinc-400">No listening tasks yet.</p>
              )}
            </SectionCard>

            <SectionCard
              title="Test yourself"
              subtitle="Complete the final self-check"
              isOpen={showTestYourself}
              onToggle={() => setShowTestYourself((prev) => !prev)}
            >
              {song.testyourself ? (
                <div className="rounded-3xl border border-white/10 bg-black/20 p-5">
                  <TestYouSelf test={song.testyourself} />
                </div>
              ) : (
                <p className="text-zinc-400">No final test yet.</p>
              )}
            </SectionCard>
          </div>
        </div>
      </main>
    </>
  );
}
