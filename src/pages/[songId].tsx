import React, { useMemo, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import dbConnect from "../utils/dbConnect";
import { Lesson, SectionKey } from "@/types";
import IntroSection from "./component/sections/IntroSection";
import SectionCard from "./component/sections/SectionCard";
import { SectionRenderer } from "./component/sections/SectionRenderer";

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

export default function Details({ song }: { song: Lesson | null }) {
  const router = useRouter();
  const { from } = router.query;
  const isAdmin = from === "admin";

  const [openSections, setOpenSections] = useState<SectionKey[]>([]);
  const toggleSection = (section: SectionKey) => {
    setOpenSections((prev) =>
      prev.includes(section)
        ? prev.filter((s) => s !== section)
        : [...prev, section],
    );
  };
  const sectionsConfig = useMemo(() => {
    if (!song?.sections?.length) return [];

    return [...song.sections]
      .filter((s) => s.enabled)
      .sort((a, b) => a.order - b.order);
  }, [song]);

  if (!song) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950 text-white">
        Song not found.
      </div>
    );
  }

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
            onClick={() => router.push(isAdmin ? "/admin/lessons" : "/songs")}
            className="mb-6 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-zinc-300 backdrop-blur transition hover:bg-white/10 hover:text-white"
          >
            {isAdmin ? "← Back to admin" : " ← Back to songs"}
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
            </div>
          </div>

          <IntroSection tasks={song.tasks} />

          {/* SECTIONS */}
          <div className="grid gap-6">
            {sectionsConfig.map((section) => {
              const isOpen = openSections.includes(section.key);

              return (
                <SectionCard
                  key={section.key}
                  title={section.title}
                  subtitle={section.subtitle}
                  isOpen={isOpen}
                  onToggle={() => toggleSection(section.key)}
                >
                  <SectionRenderer section={section} song={song} />
                </SectionCard>
              );
            })}
          </div>
        </div>
      </main>
    </>
  );
}
