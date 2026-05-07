import { ReadingTask } from "@/types";
type ReadingTasksManagerProps = {
  readingtasks: ReadingTask[];
};

export default function ReadingTasksManager({
  readingtasks,
}: ReadingTasksManagerProps) {
  console.log("readingtasks :>> ", readingtasks);
  return (
    <div className="mt-4 rounded-xl border border-dashed border-zinc-200 bg-zinc-50 p-4 text-sm text-zinc-500">
      {readingtasks.length > 0
        ? readingtasks.map((task) => <div key={task._id}>{task.name}</div>)
        : "No reading tasks yet"}
    </div>
  );
}
