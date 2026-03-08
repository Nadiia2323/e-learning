import React, { useMemo, useState } from "react";

type SentenceOptionItem = {
  sentence: string;
  options: string[];
  correctAnswers: string[];
};

type Props = {
  data: SentenceOptionItem[];
};

export default function SentenceOptions({ data }: Props) {
  const item = data?.[0];
  const [selectedOption, setSelectedOption] = useState("");
  const [feedback, setFeedback] = useState<"correct" | "incorrect" | "">("");

  const splitOptions = useMemo(() => {
    if (!item) return [];

    return item.options?.[0]?.includes(",")
      ? item.options[0]
          .split(",")
          .map((option) => option.trim().replace(/^"|"$/g, ""))
      : item.options || [];
  }, [item]);

  if (!item) {
    return (
      <div className="rounded-3xl border border-white/10 bg-white/5 p-5 text-sm text-zinc-400">
        No sentence options available.
      </div>
    );
  }

  const [firstPart, secondPart] = item.sentence.split("___");

  const checkAnswer = () => {
    if (!selectedOption) return;

    if (item.correctAnswers.includes(selectedOption)) {
      setFeedback("correct");
    } else {
      setFeedback("incorrect");
    }
  };

  const resetAnswer = () => {
    setSelectedOption("");
    setFeedback("");
  };

  return (
    <div className="rounded-[28px] border border-white/10 bg-white/5 p-5 shadow-xl backdrop-blur-xl md:p-6">
      <div className="mb-5">
        <p className="text-xs uppercase tracking-[0.25em] text-zinc-500">
          Reading exercise
        </p>
        <h3 className="mt-2 text-xl font-semibold text-white">
          Complete the sentence
        </h3>
        <p className="mt-2 text-sm leading-6 text-zinc-400">
          Choose one option and place it into the sentence.
        </p>
      </div>

      <div className="mb-6">
        <p className="mb-3 text-sm font-medium text-zinc-300">Options</p>

        <div className="flex flex-wrap gap-3">
          {splitOptions.map((option, index) => {
            const isSelected = selectedOption === option;

            return (
              <button
                key={`${option}-${index}`}
                type="button"
                onClick={() => {
                  setSelectedOption(option);
                  setFeedback("");
                }}
                className={`rounded-2xl border px-4 py-2 text-sm font-medium transition ${
                  isSelected
                    ? "border-fuchsia-400 bg-fuchsia-500/15 text-white"
                    : "border-white/10 bg-black/20 text-zinc-300 hover:bg-white/10 hover:text-white"
                }`}
              >
                {option}
              </button>
            );
          })}
        </div>
      </div>

      <div className="rounded-3xl border border-white/10 bg-black/20 p-5 text-base leading-8 text-zinc-200 md:text-lg">
        <span>{firstPart}</span>

        <span
          className={`mx-2 inline-flex min-w-[160px] items-center justify-center rounded-2xl border px-4 py-2 text-sm font-medium md:text-base ${
            feedback === "correct"
              ? "border-emerald-400/60 bg-emerald-400/10 text-emerald-200"
              : feedback === "incorrect"
                ? "border-rose-400/60 bg-rose-400/10 text-rose-200"
                : selectedOption
                  ? "border-fuchsia-400/60 bg-fuchsia-500/10 text-white"
                  : "border-dashed border-white/15 bg-zinc-950 text-zinc-500"
          }`}
        >
          {selectedOption || "Choose an option"}
        </span>

        <span>{secondPart}</span>
      </div>

      {feedback && (
        <div
          className={`mt-5 rounded-3xl border p-4 text-sm ${
            feedback === "correct"
              ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-300"
              : "border-rose-400/20 bg-rose-400/10 text-rose-300"
          }`}
        >
          {feedback === "correct"
            ? "Correct! Nice job."
            : "Incorrect, try again."}
        </div>
      )}

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={checkAnswer}
          className="rounded-2xl bg-gradient-to-r from-pink-500 via-fuchsia-500 to-indigo-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-fuchsia-500/20 transition hover:scale-[1.01]"
        >
          Check answer
        </button>

        <button
          type="button"
          onClick={resetAnswer}
          className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium text-zinc-200 transition hover:bg-white/10"
        >
          Reset
        </button>
      </div>
    </div>
  );
}
