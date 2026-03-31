import ClozeTest from "../ClozeTest";
import SentenceOptions from "../SentenceOptions";

type Props = {
  tasks: any[];
};

export default function ReadingSection({ tasks }: Props) {
  if (!tasks?.length) {
    return <p className="text-zinc-400">No reading tasks yet.</p>;
  }

  return (
    <div className="space-y-6">
      {tasks.map((task, index) => (
        <div
          key={index}
          className="rounded-3xl border border-white/10 bg-black/20 p-5"
        >
          {task.test && task.name === "cloze-test" && (
            <>
              <h3 className="mb-4 text-lg font-semibold text-white">
                {task.test.name}
              </h3>
              <ClozeTest clozeTest={task.test} />
            </>
          )}

          {task.testOp && task.name === "sentence with options" && (
            <>
              <h3 className="mb-4 text-lg font-semibold text-white">
                {task.name}
              </h3>
              <SentenceOptions data={task.testOp.task} />
            </>
          )}
        </div>
      ))}
    </div>
  );
}
