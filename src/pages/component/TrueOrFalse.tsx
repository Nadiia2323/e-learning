import React, { useContext, useState } from "react";
import { useRouter } from "next/router";
import { updateProgress } from "@/utils/updateProgress";
import { UserContext } from "@/hooks/UserContext";

type TrueOrFalseItem = {
  _id: string;
  statement: string;
  isTrue: boolean;
};

type Props = {
  test: TrueOrFalseItem[];
};

export default function TrueOrFalse({ test }: Props) {
  const [answers, setAnswers] = useState<Record<string, boolean>>({});
  const [checked, setChecked] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<{
    correct: number;
    total: number;
  } | null>(null);

  const { user } = useContext(UserContext);
  const userEmail = user?.data?.email || "";

  const router = useRouter();
  const { songId } = router.query;
  const lessonId = songId as string;

  const handleAnswerChange = (questionId: string, answer: boolean) => {
    if (checked) return;

    setAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }));
  };

  const handleSubmit = async () => {
    let correctCount = 0;

    const answerDetails = test.map((question) => {
      const userAnswer = answers[question._id];
      const isCorrect = userAnswer === question.isTrue;

      if (isCorrect) correctCount++;

      return {
        taskId: question._id,
        answerType: "trueOrFalse",
        answerDetails: {
          userAnswer,
          isCorrect,
        },
      };
    });

    const progress = test.length ? (correctCount / test.length) * 100 : 0;
    const completed = progress === 100;

    setResult({
      correct: correctCount,
      total: test.length,
    });

    setChecked(true);

    if (!lessonId || !userEmail) {
      console.warn("Missing lessonId or user email");
      return;
    }

    try {
      setIsSubmitting(true);
      await updateProgress(
        userEmail,
        lessonId,
        progress,
        completed,
        answerDetails,
      );
    } catch (error) {
      console.error("Failed to update true/false progress:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setAnswers({});
    setChecked(false);
    setResult(null);
  };

  const getButtonClass = (task: TrueOrFalseItem, value: boolean) => {
    const isSelected = answers[task._id] === value;

    if (!checked) {
      return isSelected
        ? "border-fuchsia-400 bg-fuchsia-500/15 text-white"
        : "border-white/10 bg-white/5 text-zinc-300 hover:bg-white/10 hover:text-white";
    }

    if (!isSelected) {
      return "border-white/10 bg-white/5 text-zinc-500";
    }

    const isCorrect = value === task.isTrue;

    return isCorrect
      ? "border-emerald-400/50 bg-emerald-400/10 text-emerald-200"
      : "border-rose-400/50 bg-rose-400/10 text-rose-200";
  };

  return (
    <div className="rounded-[28px] border border-white/10 bg-white/5 p-5 shadow-xl backdrop-blur-xl md:p-6">
      <div className="mb-6">
        <p className="text-xs uppercase tracking-[0.25em] text-zinc-500">
          Listening exercise
        </p>
        <h3 className="mt-2 text-xl font-semibold text-white">True or false</h3>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-400">
          Read each statement and decide whether it is true or false.
        </p>
      </div>

      <div className="space-y-4">
        {test.map((task, index) => (
          <div
            key={task._id}
            className="rounded-3xl border border-white/10 bg-black/20 p-5"
          >
            <div className="mb-4 flex items-start gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 text-sm font-semibold text-white">
                {index + 1}
              </div>

              <p className="pt-1 text-sm leading-6 text-zinc-200 md:text-base">
                {task.statement}
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => handleAnswerChange(task._id, true)}
                disabled={checked}
                className={`rounded-2xl border px-5 py-3 text-sm font-medium transition ${getButtonClass(
                  task,
                  true,
                )}`}
              >
                True
              </button>

              <button
                type="button"
                onClick={() => handleAnswerChange(task._id, false)}
                disabled={checked}
                className={`rounded-2xl border px-5 py-3 text-sm font-medium transition ${getButtonClass(
                  task,
                  false,
                )}`}
              >
                False
              </button>
            </div>
          </div>
        ))}
      </div>

      {result && (
        <div
          className={`mt-6 rounded-3xl border p-4 ${
            result.correct === result.total
              ? "border-emerald-400/20 bg-emerald-400/10"
              : "border-white/10 bg-white/5"
          }`}
        >
          <p className="text-sm text-zinc-300">
            Result:{" "}
            <span className="font-semibold text-white">
              {result.correct} / {result.total}
            </span>
          </p>

          <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-pink-500 to-indigo-500 transition-all duration-500"
              style={{
                width: `${result.total ? (result.correct / result.total) * 100 : 0}%`,
              }}
            />
          </div>
        </div>
      )}

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={checked || isSubmitting || test.length === 0}
          className="rounded-2xl bg-gradient-to-r from-pink-500 via-fuchsia-500 to-indigo-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-fuchsia-500/20 transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Saving..." : "Submit answers"}
        </button>

        <button
          type="button"
          onClick={handleReset}
          className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium text-zinc-200 transition hover:bg-white/10"
        >
          Reset
        </button>
      </div>
    </div>
  );
}
