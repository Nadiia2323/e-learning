import React from "react";
import TrueOrFalse from "../TrueOrFalse";
import PictureMatchGame from "../PictureMatchGame";

export default function ListeningSection({ tasks }) {
  return (
    <div>
      {tasks?.length ? (
        <div className="space-y-6">
          {tasks.map((task, index) =>
            task.trueorfalse ? (
              <div
                key={index}
                className="rounded-3xl border border-white/10 bg-black/20 p-5"
              >
                <h3 className="mb-4 text-lg font-semibold text-white">
                  {task.name}
                </h3>
                <TrueOrFalse test={task.trueorfalse.task} />
              </div>
            ) : task.picturematch ? (
              <div
                key={index}
                className="rounded-3xl border border-white/10 bg-black/20 p-5"
              >
                <h3 className="mb-4 text-lg font-semibold text-white">
                  {task.name}
                </h3>
                <PictureMatchGame pairs={task.picturematch.pairs} />
              </div>
            ) : null,
          )}
        </div>
      ) : (
        <p className="text-zinc-400">No listening tasks yet.</p>
      )}
    </div>
  );
}
