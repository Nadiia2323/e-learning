import React, { useState } from "react";

type LessonType = {
  lyric: string;
  author: string;
  video: string;
};

export default function NewLessonPage() {
  const [lesson, setLesson] = useState<LessonType>({
    lyric: "",
    author: "",
    video: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setLesson((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    fetch("api/admin/lessons", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(lesson),
    });
    console.log("lesson:", lesson);
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
              <label className="mb-2 block text-sm font-medium text-zinc-700">
                Song title
              </label>
              <input
                name="lyric"
                value={lesson.lyric}
                onChange={handleChange}
                placeholder="Believer"
                className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>

            {/* AUTHOR */}
            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-700">
                Author
              </label>
              <input
                name="author"
                value={lesson.author}
                onChange={handleChange}
                placeholder="Imagine Dragons"
                className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>

            {/* VIDEO */}
            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-700">
                Video URL
              </label>
              <input
                name="video"
                value={lesson.video}
                onChange={handleChange}
                placeholder="https://www.youtube.com/embed/..."
                className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>

            {/* BUTTONS */}
            <div className="flex flex-col gap-3 pt-4 sm:flex-row sm:justify-end">
              <button
                type="button"
                className="rounded-xl border border-zinc-300 bg-white px-5 py-3 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-indigo-500"
              >
                Create lesson
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
