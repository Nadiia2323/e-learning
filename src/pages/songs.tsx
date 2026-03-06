import Head from "next/head";
import { useRouter } from "next/router";
import { useState } from "react";
import { useSession } from "next-auth/react";
import dbConnection from "../../lib/dbConnection";
import { LyricModel } from "@/models/Schemas";
import AppBar from "./component/AppBar";

export async function getServerSideProps() {
  try {
    await dbConnection();
    const data = await LyricModel.find({});
    return {
      props: { data: JSON.parse(JSON.stringify(data)) },
    };
  } catch (error) {
    console.error(error);
    return { props: { data: [] } };
  }
}

type Song = {
  _id: string;
  title?: string;
  lyric?: string;
  author?: string;
  level?: string;
  tasksCount?: number;
};

type SongsProps = {
  data: Song[];
};

export default function Songs({ data }: SongsProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const [search, setSearch] = useState("");

  const handleSelect = (id: string) => {
    router.push(`/${id}`);
  };

  const filteredSongs = data.filter((song) =>
    `${song.title || song.lyric || ""} ${song.author || ""}`
      .toLowerCase()
      .includes(search.toLowerCase()),
  );

  return (
    <>
      <Head>
        <title>All Songs — SongLMS</title>
      </Head>

      <div className="relative min-h-screen overflow-hidden bg-zinc-950 text-white">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-[-120px] top-[-120px] h-[320px] w-[320px] rounded-full bg-fuchsia-500/10 blur-[120px]" />
          <div className="absolute bottom-[-140px] right-[-80px] h-[340px] w-[340px] rounded-full bg-indigo-500/10 blur-[120px]" />
          <div className="absolute left-1/2 top-1/3 h-[260px] w-[260px] -translate-x-1/2 rounded-full bg-violet-500/10 blur-[120px]" />
        </div>

        <AppBar />

        <div className="relative z-10 mx-auto max-w-7xl px-6 py-12">
          <div className="mb-10">
            <p className="mb-3 text-sm uppercase tracking-[0.25em] text-zinc-500">
              Song library
            </p>

            <h1 className="text-4xl font-semibold sm:text-5xl">
              Learn English through songs
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-6 text-zinc-400 sm:text-base">
              Choose a song, practice listening, learn vocabulary, and improve
              your English with interactive music-based lessons.
            </p>

            <div className="relative mt-8 max-w-md">
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500">
                🔍
              </span>
              <input
                type="text"
                placeholder="Search songs or artists..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-white/5 py-3 pl-11 pr-4 text-sm text-white placeholder:text-zinc-500 outline-none backdrop-blur transition focus:border-fuchsia-400 focus:bg-white/[0.07]"
              />
            </div>
          </div>

          {data.length === 0 ? (
            <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-center text-zinc-400 backdrop-blur">
              No songs available yet.
            </div>
          ) : filteredSongs.length === 0 ? (
            <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-center text-zinc-400 backdrop-blur">
              No songs found for{" "}
              <span className="font-medium text-white">{search}</span>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredSongs.map((song) => (
                <div
                  key={song._id}
                  onClick={() => handleSelect(song._id)}
                  className="group cursor-pointer rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur transition duration-200 hover:-translate-y-1 hover:border-fuchsia-400/50 hover:bg-white/[0.07]"
                >
                  <div className="mb-4 flex items-center justify-between">
                    <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-zinc-300">
                      {song.level || "Intermediate"}
                    </span>
                    <span className="text-xs text-zinc-500">
                      {song.tasksCount ?? 12} tasks
                    </span>
                  </div>

                  <p className="line-clamp-2 text-xl font-semibold text-white">
                    {song.title || song.lyric || "Untitled song"}
                  </p>

                  <p className="mt-2 text-sm text-zinc-400">
                    by {song.author || "Unknown artist"}
                  </p>

                  <div className="mt-6 flex items-center justify-between">
                    <div className="h-1 w-16 rounded-full bg-gradient-to-r from-pink-500 to-indigo-500" />
                    <span className="text-sm text-zinc-400 transition group-hover:text-white">
                      Open lesson →
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
