import { LessonModel } from "@/models/Lesson";
import LessonStructureEditor from "@/pages/component/admin/LessonStructureEditor";
import { Lesson, LessonSectionForm } from "@/types";
import dbConnection from "lib/dbConnection";
import { useRouter } from "next/router";
import React, { useState } from "react";

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

export default function EditLessonPage({ song }: { song: Lesson | null }) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    lyric: song?.lyric || "",
    video: song?.video || "",
    author: song?.author || "",
    sections: song?.sections || [],
  });
  console.log("song.sections :>> ", song?.readingtasks);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch(`/api/admin/lessons/${song!._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        router.push("/admin/lessons");
      } else {
        console.log("failed to update :>> ");
      }
    } catch (error) {
      console.log("error :>> ", error);
    }
  };
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
          <form onSubmit={handleSubmit} className="space-y-6">
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
                value={formData.lyric}
                onChange={handleChange}
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
                value={formData.author}
                onChange={handleChange}
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
                value={formData.video}
                onChange={handleChange}
                className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>

            <LessonStructureEditor
              lessonId={song._id}
              readingtasks={song?.readingtasks}
              sections={formData.sections}
              onChange={(updatedSections) =>
                setFormData((prev) => ({
                  ...prev,
                  sections: updatedSections,
                }))
              }
            />

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
