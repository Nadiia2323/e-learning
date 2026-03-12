import Head from "next/head";
import { useRouter } from "next/router";
import { useState } from "react";
import { useSession } from "next-auth/react";
import dbConnection from "../../lib/dbConnection";
import { LyricModel } from "@/models/Schemas";
import AppBar from "./component/AppBar";
import { Lesson } from "@/types";
import { LessonModel } from "@/models/Lesson";

export async function getServerSideProps() {
  try {
    await dbConnection();
    const data = await LessonModel.find({});

    return {
      props: {
        data: JSON.parse(JSON.stringify(data)),
      },
    };
  } catch (error) {
    console.error(error);
    return {
      props: { data: [] },
    };
  }
}

type SongsProps = {
  data: Lesson[];
};

export default function Songs({ data }: SongsProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const [search, setSearch] = useState("");

  const handleSelect = (id: string) => {
    router.push(`/${id}`);
  };

  const filteredSongs = data.filter((song) =>
    `${song.lyric} ${song.author}`.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <>
      <Head>
        <title>All Songs — SongLMS</title>
      </Head>

      <div className="relative min-h-screen overflow-hidden bg-zinc-950 text-white">
        {/* background glow */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-[-120px] top-[-120px] h-[320px] w-[320px] rounded-full bg-fuchsia-500/10 blur-[120px]" />
          <div className="absolute bottom-[-140px] right-[-80px] h-[340px] w-[340px] rounded-full bg-indigo-500/10 blur-[120px]" />
        </div>

        <AppBar />

        <div className="relative z-10 mx-auto max-w-7xl px-6 py-12">
          {/* header */}
          <div className="mb-10">
            <p className="mb-3 text-sm uppercase tracking-[0.25em] text-zinc-500">
              Song library
            </p>

            <h1 className="text-4xl font-semibold sm:text-5xl">
              Learn English through songs
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-6 text-zinc-400 sm:text-base">
              Choose a song and practice English through interactive lessons.
            </p>

            {/* search */}
            <div className="relative mt-8 max-w-md">
              <input
                type="text"
                placeholder="Search songs or artists..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-white/5 py-3 px-4 text-sm text-white placeholder:text-zinc-500 outline-none backdrop-blur transition focus:border-fuchsia-400"
              />
            </div>
          </div>

          {/* empty state */}
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
                  className="cursor-pointer rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur transition hover:-translate-y-1 hover:border-fuchsia-400/50 hover:bg-white/[0.07]"
                >
                  {/* title */}
                  <p className="line-clamp-2 text-xl font-semibold text-white">
                    {song.lyric || "Untitled song"}
                  </p>

                  {/* author */}
                  <p className="mt-2 text-sm text-zinc-400">
                    by {song.author || "Unknown artist"}
                  </p>

                  {/* open */}
                  <div className="mt-6 flex items-center justify-between">
                    <div className="h-1 w-16 rounded-full bg-gradient-to-r from-pink-500 to-indigo-500" />
                    <span className="text-sm text-zinc-400">Open lesson →</span>
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
