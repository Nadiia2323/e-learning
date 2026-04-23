import { LessonModel } from "@/models/Lesson";
import dbConnection from "lib/dbConnection";
import { useRouter } from "next/router";
import React from "react";

export async function getServerSideProps({
  params,
}: {
  params: { id: string };
}) {
  await dbConnection();
  const { id } = params;
  const song = await LessonModel.findById(id)
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

export default function EditLessonPage({ song }) {
  const router = useRouter();

  if (!song) {
    return (
      <div className="min-h-screen bg-zinc-100 px-4 py-10 text-zinc-900">
        <div className="mx-auto max-w-3xl rounded-3xl border border-zinc-200 bg-white p-8 shadow-lg">
          <h1 className="text-2xl font-bold">Lesson not found</h1>
          <p className="mt-3 text-zinc-600">We couldn’t find this lesson.</p>
          <button
            onClick={() => router.push("/admin/lessons")}
            className="mt-6 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-indigo-500"
          >
            Back to lessons
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-100 px-4 py-10 text-zinc-900">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-indigo-500">
              Admin panel
            </p>
            <h1 className="mt-2 text-4xl font-bold tracking-tight">
              Edit lesson
            </h1>
            <p className="mt-3 text-zinc-600">
              Update the basic lesson information.
            </p>
          </div>

          <button
            onClick={() => router.push("/admin/lessons")}
            className="rounded-xl border border-zinc-300 bg-white px-5 py-3 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100"
          >
            Back
          </button>
        </div>

        <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-lg md:p-8">
          <form className="space-y-6">
            <div>
              <label
                htmlFor="lyric"
                className="mb-2 block text-sm font-medium text-zinc-700"
              >
                Song title
              </label>
              <input
                id="lyric"
                name="lyric"
                defaultValue={song.lyric}
                className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>

            <div>
              <label
                htmlFor="author"
                className="mb-2 block text-sm font-medium text-zinc-700"
              >
                Author
              </label>
              <input
                id="author"
                name="author"
                defaultValue={song.author}
                className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>

            <div>
              <label
                htmlFor="video"
                className="mb-2 block text-sm font-medium text-zinc-700"
              >
                Video URL
              </label>
              <input
                id="video"
                name="video"
                defaultValue={song.video}
                className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>

            <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
              <p className="text-sm font-medium text-zinc-700">Lesson ID</p>
              <p className="mt-1 break-all text-sm text-zinc-500">{song._id}</p>
            </div>

            <div className="flex flex-col gap-3 pt-4 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => router.push("/admin/lessons")}
                className="rounded-xl border border-zinc-300 bg-white px-5 py-3 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-indigo-500"
              >
                Save changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
