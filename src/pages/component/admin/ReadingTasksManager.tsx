import { ReadingTask } from "@/types";
import { useState } from "react";
import ClozeTestBuilder from "./ClozeTestBuilder";
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
    <div className="mt-4 space-y-4 rounded-xl border border-dashed border-zinc-200 bg-zinc-50 p-4 text-sm text-zinc-500">
      <button
        type="button"
        onClick={() => setIsCreating(true)}
        className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-500"
      >
        + Add Reading Task
      </button>

      {isCreating && (
        <div className="rounded-xl border border-zinc-200 bg-white p-4">
          <div className="grid gap-3 sm:grid-cols-[1fr_180px_auto_auto]">
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Task name"
              className="rounded-xl border border-zinc-300 px-4 py-2 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
            />

            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="rounded-xl border border-zinc-300 px-4 py-2 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
            >
              <option value="cloze">Cloze test</option>
              <option value="options">Sentence options</option>
            </select>

            <button
              type="button"
              onClick={handleCreateTask}
              className="rounded-xl bg-zinc-900 px-4 py-2 font-semibold text-white transition hover:bg-zinc-700"
            >
              Create
            </button>

            <button
              onClick={resetForm}
              type="button"
              className="rounded-xl border border-zinc-300 px-4 py-2 font-medium text-zinc-700 transition hover:bg-zinc-100"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {tasks.length > 0 ? (
          tasks.map((task) => (
            <div
              key={task._id}
              className="space-y-2 rounded-xl border border-zinc-200 bg-white p-4"
            >
              <p className="font-medium text-zinc-800">{task.name}</p>

              <div className="text-zinc-500">
                {task.type === "cloze" && <ClozeTestBuilder />}
                {/* {task.test ? "Cloze test connected" : "No cloze test"} */}
              </div>

              <div className="text-zinc-500">
                {task.testOp
                  ? "Sentence options connected"
                  : "No sentence options"}
              </div>
            </div>
          ))
        ) : (
          <p>No reading tasks yet</p>
        )}
      </div>
    </div>
  );
}
