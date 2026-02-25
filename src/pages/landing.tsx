import Head from "next/head";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";

export default function LandingPage() {
  const router = useRouter();
  const { data: session } = useSession();

  const primaryAction = () => {
    if (session) router.push("/dashboard");
    else router.push("/login");
  };

  return (
    <>
      <Head>
        <title>SongLMS — Learn English through music</title>
        <meta
          name="description"
          content="Interactive song-based lessons. Cloze tests, listening tasks, vocabulary training and progress tracking."
        />
      </Head>

      <div className="relative min-h-screen overflow-hidden bg-zinc-950 text-white">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-40 left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-fuchsia-500/20 blur-[120px]" />
          <div className="absolute top-20 -left-40 h-[500px] w-[500px] rounded-full bg-indigo-500/20 blur-[120px]" />
          <div className="absolute bottom-[-200px] right-[-120px] h-[500px] w-[500px] rounded-full bg-rose-500/20 blur-[120px]" />
        </div>

        <header className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 ring-1 ring-white/10">
              🎵
            </div>
            <div className="leading-tight">
              <p className="text-sm font-semibold">SongLMS</p>
              <p className="text-xs text-zinc-400">English by songs</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {session ? (
              <button
                onClick={() => router.push("/context")}
                className="rounded-xl border border-white/20 px-4 py-2 text-sm hover:bg-white/5"
              >
                Dashboard
              </button>
            ) : (
              <button
                onClick={() => router.push("/login")}
                className="rounded-xl border border-white/20 px-4 py-2 text-sm hover:bg-white/5"
              >
                Log in
              </button>
            )}
          </div>
        </header>

        <section className="relative z-10 mx-auto max-w-7xl px-6 py-16">
          <div className="grid items-center gap-16 md:grid-cols-2">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1 text-xs text-zinc-300 ring-1 ring-white/10">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                New: Cloze + Listening + Vocabulary
              </div>

              <h1 className="mt-5 text-4xl font-bold leading-tight md:text-5xl">
                Learn English{" "}
                <span className="bg-gradient-to-r from-pink-500 to-indigo-400 bg-clip-text text-transparent">
                  through music
                </span>
              </h1>

              <p className="mt-6 text-lg text-zinc-400">
                Interactive lessons with real songs. Train listening, vocabulary
                and pronunciation with tasks that feel like a game.
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <button
                  onClick={primaryAction}
                  className="rounded-xl bg-gradient-to-r from-pink-500 to-indigo-500 px-6 py-3 font-semibold shadow-lg shadow-pink-500/20 transition hover:scale-[1.02]"
                >
                  {session ? "Go to dashboard" : "Start learning"}
                </button>

                <button
                  onClick={() => router.push("/songs")}
                  className="rounded-xl border border-white/20 px-6 py-3 text-white transition hover:bg-white/5"
                >
                  Explore lessons
                </button>
              </div>

              {session ? (
                <p className="mt-5 text-sm text-zinc-400">
                  Welcome back,{" "}
                  <span className="text-zinc-200">{session.user?.name}</span> 👋
                </p>
              ) : (
                <p className="mt-5 text-sm text-zinc-400">
                  No boring textbooks. Just songs you love.
                </p>
              )}
            </div>

            <div className="relative">
              <div className="absolute -inset-6 rounded-3xl bg-gradient-to-r from-pink-500/20 to-indigo-500/20 blur-3xl" />

              <div className="relative rounded-3xl border border-white/10 bg-zinc-900/50 p-6 shadow-2xl backdrop-blur">
                <div className="mb-4 flex gap-2">
                  <span className="h-3 w-3 rounded-full bg-red-400" />
                  <span className="h-3 w-3 rounded-full bg-yellow-400" />
                  <span className="h-3 w-3 rounded-full bg-green-400" />
                </div>

                <div className="space-y-4">
                  <div className="rounded-xl bg-white/5 p-4">
                    <p className="text-sm text-zinc-400">Current lesson</p>
                    <p className="mt-1 font-semibold">
                      Someone Like You — Adele
                    </p>
                  </div>

                  <div className="rounded-xl bg-white/5 p-4">
                    <p className="text-sm text-zinc-400">Cloze test</p>
                    <div className="mt-2 flex flex-wrap gap-2 text-sm">
                      <span className="rounded-lg bg-white/5 px-3 py-1 ring-1 ring-white/10">
                        heart
                      </span>
                      <span className="rounded-lg bg-white/5 px-3 py-1 ring-1 ring-white/10">
                        regret
                      </span>
                      <span className="rounded-lg bg-white/5 px-3 py-1 ring-1 ring-white/10">
                        memories
                      </span>
                    </div>
                  </div>

                  <div className="rounded-xl bg-white/5 p-4">
                    <p className="text-sm text-zinc-400">Progress</p>
                    <div className="mt-2 h-2 w-full rounded-full bg-zinc-700">
                      <div className="h-2 w-2/3 rounded-full bg-gradient-to-r from-pink-500 to-indigo-500" />
                    </div>
                    <p className="mt-2 text-xs text-zinc-400">12 min • B1</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <footer className="relative z-10 mx-auto max-w-7xl px-6 pb-10 text-sm text-zinc-500">
          © {new Date().getFullYear()} SongLMS — built with Next.js
        </footer>
      </div>
    </>
  );
}
