import Head from "next/head";
import { useRouter } from "next/router";
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

export default function Context({ data }) {
  const router = useRouter();
  const { data: session } = useSession();

  const handleSelect = (id: string) => {
    router.push(`/${id}`);
  };

  return (
    <>
      <Head>
        <title>All Songs — SongLMS</title>
      </Head>

      <div className="min-h-screen bg-zinc-950 text-white">
        <AppBar />

        <div className="mx-auto max-w-7xl px-6 py-12">
          <h1 className="mb-10 text-3xl font-semibold">
            Songs that touch your soul 🎵
          </h1>

          {data.length === 0 ? (
            <p className="text-zinc-400">No songs available.</p>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {data.map((song) => (
                <div
                  key={song._id}
                  onClick={() => handleSelect(song._id)}
                  className="cursor-pointer rounded-2xl border border-white/10 bg-white/5 p-6 transition hover:scale-[1.02] hover:border-indigo-400"
                >
                  <p className="text-lg font-semibold">{song.lyric}</p>
                  <p className="mt-2 text-sm text-zinc-400">by {song.author}</p>

                  <div className="mt-4 h-1 w-12 rounded-full bg-gradient-to-r from-pink-500 to-indigo-500" />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
