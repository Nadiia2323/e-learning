import React from "react";
import { useSession, signOut } from "next-auth/react";
import SignInButton from "./SignInButton";
import { useRouter } from "next/router";

export default function AppBar() {
  const { data: session } = useSession();
  const router = useRouter();

  return (
    <header className="relative z-20 border-b border-white/5 bg-zinc-950/60 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* Logo */}
        <div
          onClick={() => router.push("/")}
          className="flex cursor-pointer items-center gap-3"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/5 ring-1 ring-white/10">
            🎵
          </div>
          <span className="text-sm font-semibold tracking-tight">SongLMS</span>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {session ? (
            <>
              <span className="text-sm text-zinc-300">
                {session.user?.name}
              </span>

              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="rounded-xl border border-white/20 px-4 py-2 text-sm text-white transition hover:bg-white/5"
              >
                Logout
              </button>
            </>
          ) : (
            <SignInButton />
          )}
        </div>
      </div>
    </header>
  );
}
