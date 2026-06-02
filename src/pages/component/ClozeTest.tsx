import { shuffleArray } from "@/utils/shuffleArray";
import React, { useMemo, useState } from "react";
import { useRouter } from "next/router";
import { updateProgress } from "@/utils/updateProgress";
import { useUser } from "@/hooks/UserContext";
import { AnswerPayload, ClozeTestType } from "@/types";

export default function ClozeTest({ clozeTest }: { clozeTest: ClozeTestType }) {
  console.log("clozeTest :>> ", clozeTest);
  const [userAnswers, setUserAnswers] = useState<string[]>(
    clozeTest.content.map(() => ""),
  );
  const [isCheckPerformed, setIsCheckPerformed] = useState(false);
  const [score, setScore] = useState<{ correct: number; total: number } | null>(
    null,
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { user } = useUser();
  const userEmail = user?.email || "";
  const router = useRouter();
  const { songId } = router.query;
  const lessonId = songId as string;

  const totalBlanks = useMemo(
    () => clozeTest.content.filter((item) => item.blank).length,
    [clozeTest],
  );

  const allAnswers = useMemo(() => {
    const answers = clozeTest.content
      .filter((item) => item.blank && item.answer)
      .map((item) => item.answer as string);

    return shuffleArray([...new Set(answers)]);
  }, [clozeTest]);

  const availableAnswers = useMemo(() => {
    return allAnswers.filter((answer: string) => !userAnswers.includes(answer));
  }, [allAnswers, userAnswers]);

  const handleSelectChange = (
    index: number,
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const newAnswers = [...userAnswers];
    newAnswers[index] = event.target.value;
    setUserAnswers(newAnswers);
  };

  const checkAnswers = async () => {
    let correctCount = 0;
    const answers: AnswerPayload[] = [];

    clozeTest.content.forEach((item, index) => {
      const userAnswer = userAnswers[index]?.toLowerCase() || "";
      const isCorrect =
        !!item.blank && (item.answer?.toLowerCase() || "") === userAnswer;

      if (isCorrect) {
        correctCount++;
      }

      answers.push({
        taskId: clozeTest._id,
        answerId: item._id,
        answerType: "cloze-test",
        userAnswer,
        isCorrect,
      });
    });

    setScore({
      correct: correctCount,
      total: totalBlanks,
    });

    setIsCheckPerformed(true);

    if (lessonId && userEmail && totalBlanks > 0) {
      const progress = (correctCount / totalBlanks) * 100;
      const completed = progress === 100;

      try {
        setIsSubmitting(true);
        await updateProgress(userEmail, lessonId, progress, completed, answers);
      } catch (error) {
        console.error("Failed to update progress:", error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const resetAnswers = () => {
    setUserAnswers(clozeTest.content.map(() => ""));
    setIsCheckPerformed(false);
    setScore(null);
  };

  return (
    <div className="rounded-[28px] border border-white/10 bg-white/5 p-5 shadow-xl backdrop-blur-xl md:p-6">
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-zinc-500">
            Reading exercise
          </p>
          <h3 className="mt-2 text-xl font-semibold text-white">
            Fill in the blanks
          </h3>
          <p className="mt-2 text-sm leading-6 text-zinc-400">
            Choose the correct words to complete the lyrics.
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
          <p className="text-xs text-zinc-500">Blanks</p>
          <p className="mt-1 text-lg font-semibold text-white">{totalBlanks}</p>
        </div>
      </div>

      <div className="mb-6">
        <p className="mb-3 text-sm font-medium text-zinc-300">
          Available words
        </p>

        <div className="flex flex-wrap gap-2">
          {availableAnswers.length > 0 ? (
            availableAnswers.map((answer: string, index: number) => (
              <span
                key={`${answer}-${index}`}
                className="rounded-full border border-white/10 bg-black/20 px-3 py-1.5 text-sm text-zinc-200"
              >
                {answer}
              </span>
            ))
          ) : (
            <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1.5 text-sm text-emerald-300">
              All words are placed
            </span>
          )}
        </div>
      </div>

      <div className="rounded-3xl border border-white/10 bg-black/20 p-4 text-base leading-8 text-zinc-200 md:p-5 md:text-lg">
        {clozeTest.content.map((item, index) => {
          const currentValue = userAnswers[index] || "";

          const isCorrect =
            isCheckPerformed &&
            currentValue.toLowerCase() === (item.answer?.toLowerCase() || "");

          const isIncorrect =
            isCheckPerformed && item.blank && currentValue && !isCorrect;

          if (item.blank) {
            const selectOptions = currentValue
              ? [...availableAnswers, currentValue].sort()
              : [...availableAnswers].sort();

            return (
              <span key={item._id} className="inline-block px-1 align-middle">
                <select
                  value={currentValue}
                  onChange={(event) => handleSelectChange(index, event)}
                  disabled={isCheckPerformed}
                  className={[
                    "min-w-[140px] rounded-2xl border px-3 py-2 text-sm outline-none transition md:min-w-[170px] md:text-base",
                    "bg-zinc-950 text-white",
                    isCorrect
                      ? "border-emerald-400/60 bg-emerald-400/10 text-emerald-200"
                      : "",
                    isIncorrect
                      ? "border-rose-400/60 bg-rose-400/10 text-rose-200"
                      : "",
                    !isCheckPerformed
                      ? "border-white/10 focus:border-fuchsia-400"
                      : "cursor-not-allowed",
                  ].join(" ")}
                >
                  <option value="">Select</option>
                  {selectOptions.map((option, optionIndex) => (
                    <option key={`${option}-${optionIndex}`} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </span>
            );
          }

          return (
            <span key={item._id} className="whitespace-pre-wrap">
              {item.text}{" "}
            </span>
          );
        })}
      </div>

      {score && (
        <div
          className={`mt-5 rounded-3xl border p-4 ${
            score.correct === score.total
              ? "border-emerald-400/20 bg-emerald-400/10"
              : "border-white/10 bg-white/5"
          }`}
        >
          <p className="text-sm text-zinc-300">
            Result:{" "}
            <span className="font-semibold text-white">
              {score.correct} / {score.total}
            </span>
          </p>
          <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-pink-500 to-indigo-500 transition-all duration-500"
              style={{
                width: `${score.total ? (score.correct / score.total) * 100 : 0}%`,
              }}
            />
          </div>
        </div>
      )}

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <button
          onClick={checkAnswers}
          disabled={isCheckPerformed || isSubmitting}
          className="rounded-2xl bg-gradient-to-r from-pink-500 via-fuchsia-500 to-indigo-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-fuchsia-500/20 transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Saving..." : "Check answers"}
        </button>

        <button
          onClick={resetAnswers}
          className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium text-zinc-200 transition hover:bg-white/10"
        >
          Reset
        </button>
      </div>
    </div>
  );
}
