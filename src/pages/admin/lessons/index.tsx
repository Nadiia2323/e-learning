import { LessonModel } from "@/models/Lesson";
import { Lesson } from "@/types";
import dbConnection from "lib/dbConnection";
import { useRouter } from "next/router";
import React from "react";

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

export default function Lessons({ data }: SongsProps) {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-zinc-100 px-4 py-10 text-zinc-900">
      <div className="mx-auto max-w-4xl">
        {/* HEADER */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-indigo-500">
              Admin panel
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight">Lessons</h1>
          </div>

          <button
            onClick={() => router.push("/admin/lessons/new")}
            className="rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-indigo-500"
          >
            + Create lesson
          </button>
        </div>

        {/* CONTENT */}
        <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-md">
          {data.length > 0 ? (
            <div className="space-y-4">
              {data.map((lesson: any) => (
                <div
                  key={lesson._id}
                  className="flex items-center justify-between rounded-2xl border border-zinc-200 p-4 transition hover:bg-zinc-50"
                >
                  <div>
                    <p className="font-semibold">{lesson.lyric}</p>
                    <p className="text-sm text-zinc-500">{lesson.author}</p>
                  </div>

                  <button
                    onClick={() =>
                      router.push(`/admin/lessons/${lesson._id}/edit`)
                    }
                    className="rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-indigo-500"
                  >
                    Edit
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-zinc-300 p-10 text-center text-zinc-500">
              No lessons yet
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
