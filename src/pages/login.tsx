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
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value,
    });
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();

    const response = await signIn("credentials", {
      email: credentials.email,
      password: credentials.password,
      redirect: false,
    });

    if (response?.ok) {
      router.push("/dashboard");
    } else {
      alert("Invalid credentials");
    }
  };

  return (
    <>
      <Head>
        <title>Login — SongLMS</title>
      </Head>

      <div className="relative flex min-h-screen items-center justify-center bg-zinc-950 text-white">
        {/* Glow background */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-40 left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-fuchsia-500/20 blur-[120px]" />
          <div className="absolute bottom-[-200px] right-[-120px] h-[500px] w-[500px] rounded-full bg-indigo-500/20 blur-[120px]" />
        </div>

        {/* Card */}
        <div className="relative z-10 w-full max-w-md rounded-3xl border border-white/10 bg-zinc-900/50 p-8 shadow-2xl backdrop-blur">
          <h2 className="text-2xl font-semibold">Welcome Back 👋</h2>
          <p className="mt-2 text-sm text-zinc-400">
            Continue your English journey through music.
          </p>

          <form onSubmit={handleSignIn} className="mt-6 space-y-4">
            <div>
              <label className="text-sm text-zinc-400">Email</label>
              <input
                type="email"
                name="email"
                value={credentials.email}
                onChange={handleChange}
                required
                className="mt-1 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-zinc-500 outline-none focus:border-indigo-400"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="text-sm text-zinc-400">Password</label>
              <input
                type="password"
                name="password"
                value={credentials.password}
                onChange={handleChange}
                required
                className="mt-1 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-zinc-500 outline-none focus:border-indigo-400"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-xl bg-gradient-to-r from-pink-500 to-indigo-500 py-3 font-semibold shadow-lg shadow-pink-500/20 transition hover:scale-[1.02]"
            >
              Sign in
            </button>
          </form>

          <div className="my-6 flex items-center gap-4">
            <div className="h-px flex-1 bg-white/10" />
            <span className="text-xs text-zinc-400">or</span>
            <div className="h-px flex-1 bg-white/10" />
          </div>

          <button
            onClick={() => signIn("google")}
            className="flex w-full items-center justify-center gap-3 rounded-xl border border-white/10 bg-white/5 py-3 transition hover:bg-white/10"
          >
            <Image
              src="https://res.cloudinary.com/dqgvmwnpl/image/upload/v1706279633/E-Learning/7123025_logo_google_g_icon_qc3nm3.png"
              alt="Google"
              width={20}
              height={20}
            />
            Continue with Google
          </button>

          <p
            onClick={() => router.push("/")}
            className="mt-6 cursor-pointer text-center text-sm text-zinc-400 hover:text-white"
          >
            ← Back to homepage
          </p>
        </div>
      </div>
    </>
  );
}
