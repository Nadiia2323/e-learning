import { ClozeContentItem, ReadingTask } from "@/types";
import { useState } from "react";
import ClozeTestBuilder from "./ClozeTestBuilder";
import SentenceOptionsBuilder from "./SentenceOptionsBuilder";
type ReadingTasksManagerProps = {
  readingtasks: ReadingTask[];
};
type ReadingTaskType = "cloze" | "options";

type ReadingTaskForm = {
  name: string;
  type: ReadingTaskType;
};
export default function ReadingTasksManager({
  readingtasks,
}: ReadingTasksManagerProps) {
  const [content, setContent] = useState<ClozeContentItem[]>([]);
  const [tasks, setTasks] = useState(readingtasks);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState<ReadingTaskForm>({
    name: "",
    type: "cloze",
  });
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    console.log("value :>> ", name, value);
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const handleCreateTask = (e: React.FormEvent) => {
    if (!formData.name.trim()) return;
    setTasks((prev) => [
      ...prev,
      {
        _id: crypto.randomUUID(),
        name: formData.name,
        type: formData.type,
      },
    ]);
    resetForm();
  };
  const resetForm = () => {
    setFormData({
      name: "",
      type: "cloze",
    });
    setIsCreating(false);
  };

  return (
    <div className="mt-4 max-w-3xl rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold text-zinc-900">
            Reading Tasks
          </h3>
          <p className="text-xs text-zinc-500">
            Add cloze tests or sentence option exercises.
          </p>
        </div>

        {!isCreating && (
          <button
            type="button"
            onClick={() => setIsCreating(true)}
            className="rounded-xl bg-indigo-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-indigo-500"
          >
            + Add
          </button>
        )}
      </div>

      {isCreating && (
        <div className="mb-4 rounded-xl border border-zinc-200 bg-zinc-50 p-3">
          <div className="grid gap-2 sm:grid-cols-[1fr_160px_auto_auto]">
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Task name"
              className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-500"
            />

            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-500"
            >
              <option value="cloze">Cloze test</option>
              <option value="options">Sentence options</option>
            </select>

            <button
              type="button"
              onClick={handleCreateTask}
              disabled={!formData.name.trim()}
              className="rounded-lg bg-zinc-900 px-3 py-2 text-sm font-semibold text-white transition hover:bg-zinc-700 disabled:bg-zinc-300"
            >
              Create
            </button>

            <button
              onClick={resetForm}
              type="button"
              className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {tasks.length > 0 ? (
          tasks.map((task, index) => (
            <details
              key={task._id}
              className="group rounded-xl border border-zinc-200 bg-zinc-50"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-zinc-900">
                    {index + 1}. {task.name}
                  </p>
                  <p className="text-xs text-zinc-500">
                    {task.type === "cloze" ? "Cloze test" : "Sentence options"}
                  </p>
                </div>

                <span className="text-xs font-medium text-zinc-400 group-open:hidden">
                  Open
                </span>
                <span className="hidden text-xs font-medium text-zinc-400 group-open:inline">
                  Close
                </span>
              </summary>

              <div className="border-t border-zinc-200 bg-white p-3">
                {task.type === "cloze" ? (
                  <ClozeTestBuilder value={content} onChange={setContent} />
                ) : (
                  <SentenceOptionsBuilder />
                )}
              </div>
            </details>
          ))
        ) : (
          <div className="rounded-xl border border-dashed border-zinc-300 bg-zinc-50 p-4 text-center text-sm text-zinc-400">
            No reading tasks yet
          </div>
        )}
      </div>
    </div>
  );
}
