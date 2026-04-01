import React, { useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import dbConnect from "../utils/dbConnect";
import { Lesson } from "@/types";
import ReadingSection from "./component/sections/ReadingSection";
import SpeakingSection from "./component/sections/SpeakingSection";
import ListeningSection from "./component/sections/ListeningSection";
import QuizSection from "./component/sections/QuizSection";
import IntroSection from "./component/sections/IntroSection";

export async function getServerSideProps({
  params,
}: {
  params: { songId: string };
}) {
  await dbConnect();
  const { songId } = params;

  await import("@/models");
  const { LessonModel } = await import("@/models/Lesson");

  const song = await LessonModel.findById(songId)
    .populate({
      path: "tasks",
      populate: {
        path: "wordPairs",
      },
    })
    .populate({
      path: "readingtasks",
      populate: ["test", "testOp"],
    })
    .populate({
      path: "listeningtasks",
      populate: ["trueorfalse", "picturematch"],
    })
    .populate("testyourself");

  return {
    props: {
      song: song ? JSON.parse(JSON.stringify(song)) : null,
    },
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

export default function Details({ song }: { song: Lesson | null }) {
  const router = useRouter();

  const [openSections, setOpenSections] = useState<string[]>([]);
  const toggleSection = (section: string) => {
    setOpenSections((prev) =>
      prev.includes(section)
        ? prev.filter((s) => s !== section)
        : [...prev, section],
    );
  };

  if (!song) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950 text-white">
        Song not found.
      </div>
    );
  }

  // const readingCount = song.readingtasks?.length || 0;
  // const listeningCount = song.listeningtasks?.length || 0;
  // const hasSpeaking = !!song.tasks?.wordPairs;
  // const hasQuiz = !!song.testyourself;

  // const totalSections =
  //   (song.video ? 1 : 0) +
  //   (readingCount ? 1 : 0) +
  //   (hasSpeaking ? 1 : 0) +
  //   1 +
  //   (listeningCount ? 1 : 0) +
  //   (hasQuiz ? 1 : 0);

  return (
    <>
      <Head>
        <title>{`${song.lyric} — SongLMS`}</title>
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
                  {song.lyric}
                </h1>

                <p className="mt-3 text-lg text-zinc-300">
                  by {song.author || "Unknown artist"}
                </p>

                <p className="mt-5 max-w-2xl text-sm leading-6 text-zinc-400 sm:text-base">
                  Listen, reflect, practice vocabulary, and improve your English
                  step by step through this song-based lesson.
                </p>
              </div>

              {/* <div className="grid grid-cols-2 gap-4 lg:min-w-[280px]">
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
              </div> */}
            </div>
          </div>

          <IntroSection tasks={song.tasks} />

          {/* SECTIONS */}
          <div className="grid gap-6">
            <SectionCard
              title="Video"
              subtitle="Watch and listen to the original song"
              isOpen={openSections.includes("video")}
              onToggle={() => toggleSection("video")}
            >
              {song.video ? (
                <div className="overflow-hidden rounded-3xl border border-white/10">
                  <iframe
                    src={song.video}
                    title={song.lyric}
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
              isOpen={openSections.includes("reading")}
              onToggle={() => toggleSection("reading")}
            >
              <ReadingSection tasks={song.readingtasks} />
            </SectionCard>

            <SectionCard
              title="Speaking"
              subtitle="Match words and practice active vocabulary"
              isOpen={openSections.includes("speaking")}
              onToggle={() => toggleSection("speaking")}
            >
              <SpeakingSection tasks={song.tasks} />
            </SectionCard>

            <SectionCard
              title="Grammar"
              subtitle="Review grammar connected to the song"
              isOpen={openSections.includes("grammar")}
              onToggle={() => toggleSection("grammar")}
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
              isOpen={openSections.includes("listening")}
              onToggle={() => toggleSection("listening")}
            >
              <ListeningSection tasks={song.listeningtasks} />
            </SectionCard>

            <SectionCard
              title="Test yourself"
              subtitle="Complete the final self-check"
              isOpen={openSections.includes("quiz")}
              onToggle={() => toggleSection("quiz")}
            >
              <QuizSection test={song.testyourself} />
            </SectionCard>
          </div>
        </div>
      </main>
    </>
  );
}
