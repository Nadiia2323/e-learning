import LessonStructureEditor from "@/pages/component/admin/LessonStructureEditor";
import { LessonSectionForm } from "@/types";
import { useRouter } from "next/router";
import React, { useState } from "react";

type LessonType = {
  lyric: string;
  author: string;
  video: string;
  sections: LessonSectionForm[];
};
const defaultSections: LessonSectionForm[] = [
  {
    key: "video",
    title: "Video",
    subtitle: "Watch the video and get familiar with the song.",
    order: 1,
    enabled: true,
  },
  {
    key: "reading",
    title: "Reading",
    subtitle: "Read the text and complete the exercises.",
    order: 2,
    enabled: true,
  },
  {
    key: "speaking",
    title: "Speaking",
    subtitle: "Practice vocabulary and speaking tasks.",
    order: 3,
    enabled: true,
  },
  {
    key: "listening",
    title: "Listening",
    subtitle: "Train your listening comprehension.",
    order: 4,
    enabled: true,
  },
  {
    key: "quiz",
    title: "Test yourself",
    subtitle: "Check what you have learned in this lesson.",
    order: 5,
    enabled: true,
  },
];

export default function NewLessonPage() {
  const [lesson, setLesson] = useState<LessonType>({
    lyric: "",
    author: "",
    video: "",
    sections: defaultSections,
  });
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setLesson((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (!lesson.author || !lesson.lyric || !lesson.video) return;
      setIsSubmitting(true);
      const response = await fetch("/api/admin/lessons", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(lesson),
      });
      console.log("lesson:", lesson);
      if (response.ok) {
        router.push("/admin/lessons");
      } else {
        console.log("failed to create a lesson ");
      }
    } catch (error) {
      console.log("error :>> ", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-100 px-4 py-10 text-zinc-900">
      <div className="mx-auto max-w-3xl">
        {/* HEADER */}
        <div className="mb-8">
          <p className="text-sm uppercase tracking-[0.25em] text-indigo-500">
            Admin panel
          </p>
          <h1 className="mt-2 text-4xl font-bold tracking-tight">
            Create new lesson
          </h1>
          <p className="mt-3 text-zinc-600">
            Fill in the details to create a new lesson.
          </p>
        </div>

        {/* CARD */}
        <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-lg md:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* SONG */}
            <div>
              <label
                htmlFor="lyric"
                className="mb-2 block text-sm font-medium text-zinc-700"
              >
                Song title
              </label>
              <input
                required
                id="lyric"
                name="lyric"
                value={lesson.lyric}
                onChange={handleChange}
                placeholder="Believer"
                className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>

            {/* AUTHOR */}
            <div>
              <label
                htmlFor="author"
                className="mb-2 block text-sm font-medium text-zinc-700"
              >
                Author
              </label>
              <input
                required
                id="author"
                name="author"
                value={lesson.author}
                onChange={handleChange}
                placeholder="Imagine Dragons"
                className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>

            {/* VIDEO */}
            <div>
              <label
                htmlFor="video"
                className="mb-2 block text-sm font-medium text-zinc-700"
              >
                Video URL
              </label>
              <input
                required
                id="video"
                name="video"
                value={lesson.video}
                onChange={handleChange}
                placeholder="https://www.youtube.com/embed/..."
                className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>
            <LessonStructureEditor
              sections={lesson.sections}
              onChange={(updatedSections) =>
                setLesson((prev) => ({
                  ...prev,
                  sections: updatedSections,
                }))
              }
            />

            {/* BUTTONS */}
            <div className="flex flex-col gap-3 pt-4 sm:flex-row sm:justify-end">
              <button
                onClick={() => router.push("/admin/lessons")}
                type="button"
                className="rounded-xl border border-zinc-300 bg-white px-5 py-3 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100"
              >
                Cancel
              </button>

              <button
                disabled={isSubmitting}
                type="submit"
                className="rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Creating... " : "Create lesson"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
