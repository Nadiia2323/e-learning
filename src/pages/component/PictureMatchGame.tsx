import React, { useContext, useEffect, useMemo, useState } from "react";
import { shuffleArray } from "@/utils/shuffleArray";
import { updateProgress } from "@/utils/updateProgress";
import { useRouter } from "next/router";
import { UserContext } from "@/hooks/UserContext";

type PicturePair = {
  _id: string;
  picture: string;
  description: string;
};

type Props = {
  pairs: PicturePair[];
};

export default function PictureMatchGame({ pairs }: Props) {
  const [options, setOptions] = useState<string[]>([]);
  const [selectedOptions, setSelectedOptions] = useState<
    Record<string, string>
  >({});
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

  useEffect(() => {
    const shuffledDescriptions = shuffleArray(
      pairs.map((pair) => pair.description),
    );
    setOptions(shuffledDescriptions);
    setSelectedOptions({});
    setChecked(false);
    setResult(null);
  }, [pairs]);

  const completedCount = useMemo(() => {
    return Object.values(selectedOptions).filter(Boolean).length;
  }, [selectedOptions]);

  const handleSelectOption = (pictureId: string, description: string) => {
    if (checked) return;

    setSelectedOptions((prev) => ({
      ...prev,
      [pictureId]: description,
    }));
  };

  const resetGame = () => {
    setSelectedOptions({});
    setChecked(false);
    setResult(null);
    setOptions(shuffleArray(pairs.map((pair) => pair.description)));
  };

  const handleSubmit = async () => {
    let correctCount = 0;

    const answers = pairs.map((pair) => {
      const isCorrect = selectedOptions[pair._id] === pair.description;
      if (isCorrect) {
        correctCount++;
      }

      return {
        taskId: pair._id,
        answerType: "pictureMatch",
        userAnswer: selectedOptions[pair._id] || "",
        isCorrect,
      };
    });

    const progress = pairs.length ? (correctCount / pairs.length) * 100 : 0;
    const completed = progress === 100;

    setResult({
      correct: correctCount,
      total: pairs.length,
    });

    setChecked(true);

    if (!lessonId || !userEmail) {
      console.warn("Missing lessonId or user email");
      return;
    }

    try {
      setIsSubmitting(true);
      await updateProgress(userEmail, lessonId, progress, completed, answers);
    } catch (error) {
      console.error("Failed to update picture match progress:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="rounded-[28px] border border-white/10 bg-white/5 p-5 shadow-xl backdrop-blur-xl md:p-6">
      <div className="mb-6 flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-zinc-500">
            Listening exercise
          </p>
          <h3 className="mt-2 text-xl font-semibold text-white">
            Match pictures and descriptions
          </h3>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-400">
            Choose the correct description for each picture.
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
          <p className="text-xs text-zinc-500">Completed</p>
          <p className="mt-1 text-lg font-semibold text-white">
            {completedCount} / {pairs.length}
          </p>
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        {pairs.map((pair, index) => {
          const isCorrect =
            checked && selectedOptions[pair._id] === pair.description;
          const isIncorrect =
            checked &&
            selectedOptions[pair._id] &&
            selectedOptions[pair._id] !== pair.description;

          return (
            <div
              key={pair._id}
              className="rounded-3xl border border-white/10 bg-black/20 p-4"
            >
              <div className="mb-4 flex items-center justify-between">
                <div className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/5 text-sm font-semibold text-white">
                  {index + 1}
                </div>

                {checked && (
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                      isCorrect
                        ? "border border-emerald-400/20 bg-emerald-400/10 text-emerald-300"
                        : isIncorrect
                          ? "border border-rose-400/20 bg-rose-400/10 text-rose-300"
                          : "border border-white/10 bg-white/5 text-zinc-400"
                    }`}
                  >
                    {isCorrect
                      ? "Correct"
                      : isIncorrect
                        ? "Incorrect"
                        : "No answer"}
                  </span>
                )}
              </div>

              <div className="overflow-hidden rounded-3xl border border-white/10 bg-zinc-950">
                <img
                  src={pair.picture}
                  alt={`Picture match ${index + 1}`}
                  className="h-56 w-full object-cover"
                />
              </div>

              <div className="mt-4">
                <label className="mb-2 block text-sm font-medium text-zinc-300">
                  Select description
                </label>

                <select
                  value={selectedOptions[pair._id] || ""}
                  onChange={(e) => handleSelectOption(pair._id, e.target.value)}
                  disabled={checked}
                  className={[
                    "w-full rounded-2xl border px-4 py-3 text-sm outline-none transition",
                    "bg-zinc-950 text-white",
                    isCorrect
                      ? "border-emerald-400/60 bg-emerald-400/10 text-emerald-200"
                      : "",
                    isIncorrect
                      ? "border-rose-400/60 bg-rose-400/10 text-rose-200"
                      : "",
                    !checked
                      ? "border-white/10 focus:border-fuchsia-400"
                      : "cursor-not-allowed",
                  ].join(" ")}
                >
                  <option value="">Select description</option>
                  {options.map((option, optionIndex) => (
                    <option key={`${option}-${optionIndex}`} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              {checked && isIncorrect && (
                <div className="mt-3 rounded-2xl border border-white/10 bg-white/5 p-3 text-sm text-zinc-300">
                  Correct answer:{" "}
                  <span className="font-medium text-white">
                    {pair.description}
                  </span>
                </div>
              )}
            </div>
          );
        })}
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
          disabled={checked || isSubmitting || pairs.length === 0}
          className="rounded-2xl bg-gradient-to-r from-pink-500 via-fuchsia-500 to-indigo-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-fuchsia-500/20 transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Saving..." : "Check answers"}
        </button>

        <button
          type="button"
          onClick={resetGame}
          className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium text-zinc-200 transition hover:bg-white/10"
        >
          Reset game
        </button>
      </div>
    </div>
  );
}
