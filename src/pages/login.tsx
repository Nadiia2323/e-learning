import { signIn } from "next-auth/react";
import Head from "next/head";
import React, { useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";

export default function Login() {
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredentials((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const response = await signIn("credentials", {
      email: credentials.email,
      password: credentials.password,
      redirect: false,
      callbackUrl: "/songs",
    });

    setLoading(false);

    if (response?.ok) {
      router.push(response.url || "/songs");
    } else {
      alert("Invalid credentials");
    }
  };

  return (
    <>
      <Head>
        <title>Login — SongLMS</title>
      </Head>

      <main className="relative min-h-screen overflow-hidden bg-[#09090b] text-white">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-[-120px] top-[-120px] h-[320px] w-[320px] rounded-full bg-fuchsia-500/20 blur-[120px]" />
          <div className="absolute bottom-[-140px] right-[-80px] h-[340px] w-[340px] rounded-full bg-indigo-500/20 blur-[120px]" />
          <div className="absolute left-1/2 top-1/3 h-[260px] w-[260px] -translate-x-1/2 rounded-full bg-violet-500/10 blur-[120px]" />
        </div>

        <div className="relative z-10 mx-auto grid min-h-screen max-w-7xl grid-cols-1 lg:grid-cols-2">
          <section className="flex items-center justify-center px-6 py-12 sm:px-10 lg:px-16">
            <div className="w-full max-w-md">
              <div className="mb-8">
                <div className="mb-4 inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-2 backdrop-blur-md">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-pink-500 to-indigo-500 text-sm font-bold shadow-lg shadow-pink-500/20">
                    S
                  </div>
                  <div>
                    <p className="text-sm font-semibold tracking-wide text-white">
                      SongLMS
                    </p>
                    <p className="text-xs text-zinc-400">
                      Learn English through music
                    </p>
                  </div>
                </div>

                <h1 className="text-4xl font-semibold leading-tight sm:text-5xl">
                  Welcome back
                </h1>
                <p className="mt-3 max-w-sm text-sm leading-6 text-zinc-400 sm:text-base">
                  Continue learning with lyrics, listening practice, and
                  interactive exercises built around your favorite songs.
                </p>
              </div>

              <div className="rounded-[28px] border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-xl">
                <form onSubmit={handleSignIn} className="space-y-5">
                  <div>
                    <label
                      htmlFor="email"
                      className="mb-2 block text-sm font-medium text-zinc-300"
                    >
                      Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      name="email"
                      value={credentials.email}
                      onChange={handleChange}
                      required
                      placeholder="you@example.com"
                      className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3.5 text-white placeholder:text-zinc-500 outline-none transition focus:border-fuchsia-400 focus:bg-white/[0.06]"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="password"
                      className="mb-2 block text-sm font-medium text-zinc-300"
                    >
                      Password
                    </label>
                    <input
                      id="password"
                      type="password"
                      name="password"
                      value={credentials.password}
                      onChange={handleChange}
                      required
                      placeholder="••••••••"
                      className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3.5 text-white placeholder:text-zinc-500 outline-none transition focus:border-indigo-400 focus:bg-white/[0.06]"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-2xl bg-gradient-to-r from-pink-500 via-fuchsia-500 to-indigo-500 py-3.5 text-sm font-semibold text-white shadow-lg shadow-fuchsia-500/20 transition duration-200 hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {loading ? "Signing in..." : "Sign in"}
                  </button>
                </form>

                <div className="my-6 flex items-center gap-4">
                  <div className="h-px flex-1 bg-white/10" />
                  <span className="text-xs uppercase tracking-[0.2em] text-zinc-500">
                    or
                  </span>
                  <div className="h-px flex-1 bg-white/10" />
                </div>

                <button
                  onClick={() => signIn("google", { callbackUrl: "/songs" })}
                  className="flex w-full items-center justify-center gap-3 rounded-2xl border border-white/10 bg-white/5 py-3.5 text-sm font-medium text-white transition hover:bg-white/10"
                >
                  <Image
                    src="https://res.cloudinary.com/dqgvmwnpl/image/upload/v1706279633/E-Learning/7123025_logo_google_g_icon_qc3nm3.png"
                    alt="Google"
                    width={20}
                    height={20}
                  />
                  Continue with Google
                </button>

                <button
                  onClick={() => router.push("/songs")}
                  className="mt-5 w-full text-center text-sm text-zinc-400 transition hover:text-white"
                >
                  Browse songs as guest
                </button>
              </div>
            </div>
          </section>

          <section className="hidden items-center justify-center px-8 py-12 lg:flex">
            <div className="relative w-full max-w-xl">
              <div className="absolute -left-10 top-10 h-24 w-24 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md" />
              <div className="absolute right-0 top-0 h-20 w-20 rounded-full bg-pink-500/20 blur-2xl" />
              <div className="absolute bottom-10 left-10 h-20 w-20 rounded-full bg-indigo-500/20 blur-2xl" />

              <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl">
                <div className="mb-8 flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.25em] text-zinc-500">
                      Your learning vibe
                    </p>
                    <h2 className="mt-2 text-3xl font-semibold leading-tight">
                      Listen. Learn.
                      <br />
                      Sing.
                    </h2>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-right">
                    <p className="text-xs text-zinc-500">Daily streak</p>
                    <p className="text-2xl font-semibold">12🔥</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="rounded-3xl border border-white/10 bg-black/20 p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-xs uppercase tracking-[0.2em] text-pink-300">
                          Now learning
                        </p>
                        <h3 className="mt-2 text-xl font-semibold">
                          Someone Like You
                        </h3>
                        <p className="mt-1 text-sm text-zinc-400">
                          Adele · Intermediate
                        </p>
                      </div>

                      <div className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs text-emerald-300">
                        78% done
                      </div>
                    </div>

                    <div className="mt-5">
                      <div className="mb-2 flex items-center justify-between text-xs text-zinc-400">
                        <span>Lesson progress</span>
                        <span>78%</span>
                      </div>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
                        <div className="h-full w-[78%] rounded-full bg-gradient-to-r from-pink-500 to-indigo-500" />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="rounded-3xl border border-white/10 bg-black/20 p-4">
                      <p className="text-xs text-zinc-500">Words learned</p>
                      <p className="mt-2 text-2xl font-semibold">246</p>
                    </div>
                    <div className="rounded-3xl border border-white/10 bg-black/20 p-4">
                      <p className="text-xs text-zinc-500">Songs finished</p>
                      <p className="mt-2 text-2xl font-semibold">18</p>
                    </div>
                    <div className="rounded-3xl border border-white/10 bg-black/20 p-4">
                      <p className="text-xs text-zinc-500">Exercises</p>
                      <p className="mt-2 text-2xl font-semibold">93</p>
                    </div>
                  </div>

                  <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/10 to-white/5 p-5">
                    <p className="text-sm text-zinc-300">
                      Build vocabulary naturally through songs, complete
                      listening tasks, and track your progress like a real
                      learning journey.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
