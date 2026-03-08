import { shuffleArray } from "@/utils/shuffleArray";
import React, { useContext, useEffect, useMemo, useState } from "react";
import { updateProgress } from "@/utils/updateProgress";
import { useRouter } from "next/router";
import { UserContext } from "@/hooks/UserContext";

type Pair = {
  _id: string;
  word: string;
  description: string;
};

type Props = {
  pairs: Pair[];
};

export default function MatchGame({ pairs }: Props) {
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [matches, setMatches] = useState<Record<string, string>>({});
  const [shuffledDescriptions, setShuffledDescriptions] = useState<string[]>(
    [],
  );
  const [checked, setChecked] = useState(false);
  const [result, setResult] = useState<{
    correct: number;
    total: number;
  } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { user } = useContext(UserContext);
  const userEmail = user?.data?.email || "";

  const router = useRouter();
  const { songId } = router.query;
  const lessonId = songId as string;

  useEffect(() => {
    setShuffledDescriptions(
      shuffleArray(pairs.map((pair) => pair.description)),
    );
    setMatches({});
    setSelectedWord(null);
    setChecked(false);
    setResult(null);
  }, [pairs]);

  const matchedWords = useMemo(() => Object.keys(matches), [matches]);

  const unmatchedWords = useMemo(
    () =>
      pairs
        .map((pair) => pair.word)
        .filter((word) => !matchedWords.includes(word)),
    [pairs, matchedWords],
  );

  const unmatchedDescriptions = useMemo(
    () =>
      shuffledDescriptions.filter(
        (desc) => !Object.values(matches).includes(desc),
      ),
    [shuffledDescriptions, matches],
  );

  const isMatchCorrect = (word: string, description: string) => {
    return pairs.some(
      (pair) => pair.word === word && pair.description === description,
    );
  };

  const handleWordSelection = (word: string) => {
    setSelectedWord(word);
  };

  const handleDescriptionSelection = (description: string) => {
    if (!selectedWord) return;

    setMatches((prev) => ({
      ...prev,
      [selectedWord]: description,
    }));

    setShuffledDescriptions((prev) =>
      prev.filter((desc) => desc !== description),
    );
    setSelectedWord(null);
    setChecked(false);
    setResult(null);
  };

  const handleResetMatch = (word: string) => {
    const description = matches[word];
    if (!description) return;

    setShuffledDescriptions((prev) => [...prev, description]);
    setMatches((prev) => {
      const updated = { ...prev };
      delete updated[word];
      return updated;
    });

    if (selectedWord === word) {
      setSelectedWord(null);
    }

    setChecked(false);
    setResult(null);
  };

  const resetGame = () => {
    setSelectedWord(null);
    setMatches({});
    setChecked(false);
    setResult(null);
    setShuffledDescriptions(
      shuffleArray(pairs.map((pair) => pair.description)),
    );
  };

  async function sendGameProgress(
    currentUserEmail: string,
    currentLessonId: string,
    currentMatches: Record<string, string>,
    currentPairs: Pair[],
  ) {
    const answers = Object.keys(currentMatches).map((word) => {
      const description = currentMatches[word];
      const pair = currentPairs.find((item) => item.word === word);
      const isCorrect = pair?.description === description;

      return {
        taskId: pair?._id,
        answerType: "matchGame",
        answerDetails: {
          userAnswer: description,
          isCorrect,
        },
      };
    });

    const progress =
      (answers.filter((answer) => answer.answerDetails.isCorrect).length /
        currentPairs.length) *
      100;

    const completed = progress === 100;

    await updateProgress(
      currentUserEmail,
      currentLessonId,
      progress,
      completed,
      answers,
    );
  }

  const checkMatches = async () => {
    let correctCount = 0;

    for (const [word, description] of Object.entries(matches)) {
      if (
        pairs.some(
          (pair) => pair.word === word && pair.description === description,
        )
      ) {
        correctCount++;
      }
    }

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
      await sendGameProgress(userEmail, lessonId, matches, pairs);
    } catch (error) {
      console.error("Failed to update match game progress:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="rounded-[28px] border border-white/10 bg-white/5 p-5 shadow-xl backdrop-blur-xl md:p-6">
      <div className="mb-6">
        <p className="text-xs uppercase tracking-[0.25em] text-zinc-500">
          Speaking exercise
        </p>
        <h3 className="mt-2 text-xl font-semibold text-white">
          Match words and meanings
        </h3>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-400">
          First choose a word in the left column, then click the matching
          description in the right column.
        </p>
      </div>

      <div className="mb-6 rounded-3xl border border-white/10 bg-black/20 p-4">
        <p className="text-sm text-zinc-300">
          {selectedWord ? (
            <>
              Selected word:{" "}
              <span className="font-semibold text-white">{selectedWord}</span>
            </>
          ) : (
            "Choose a word from the left column to start."
          )}
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl border border-white/10 bg-black/20 p-4">
          <h4 className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-zinc-500">
            Words
          </h4>

          <div className="space-y-3">
            {matchedWords.map((word) => {
              const correct = checked && isMatchCorrect(word, matches[word]);
              const incorrect = checked && !isMatchCorrect(word, matches[word]);

              return (
                <button
                  key={word}
                  type="button"
                  className={[
                    "w-full rounded-2xl border px-4 py-3 text-left text-sm font-medium transition",
                    correct
                      ? "border-emerald-400/50 bg-emerald-400/10 text-emerald-200"
                      : "",
                    incorrect
                      ? "border-rose-400/50 bg-rose-400/10 text-rose-200"
                      : "",
                    !checked ? "border-white/10 bg-white/5 text-zinc-300" : "",
                  ].join(" ")}
                >
                  {word}
                </button>
              );
            })}

            {unmatchedWords.map((word) => {
              const isSelected = selectedWord === word;

              return (
                <button
                  key={word}
                  type="button"
                  onClick={() => handleWordSelection(word)}
                  className={`w-full rounded-2xl border px-4 py-3 text-left text-sm font-medium transition ${
                    isSelected
                      ? "border-fuchsia-400 bg-fuchsia-500/15 text-white"
                      : "border-white/10 bg-white/5 text-zinc-300 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {word}
                </button>
              );
            })}
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-black/20 p-4">
          <h4 className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-zinc-500">
            Descriptions
          </h4>

          <div className="space-y-3">
            {matchedWords.map((word) =>
              matches[word] ? (
                <div
                  key={`${word}-${matches[word]}`}
                  className="flex items-center gap-2"
                >
                  <div
                    className={`flex-1 rounded-2xl border px-4 py-3 text-sm transition ${
                      checked && isMatchCorrect(word, matches[word])
                        ? "border-emerald-400/50 bg-emerald-400/10 text-emerald-200"
                        : checked && !isMatchCorrect(word, matches[word])
                          ? "border-rose-400/50 bg-rose-400/10 text-rose-200"
                          : "border-white/10 bg-white/5 text-zinc-300"
                    }`}
                  >
                    {matches[word]}
                  </div>

                  <button
                    type="button"
                    onClick={() => handleResetMatch(word)}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-zinc-400 transition hover:bg-white/10 hover:text-white"
                    aria-label={`Reset ${word}`}
                  >
                    ×
                  </button>
                </div>
              ) : null,
            )}

            {unmatchedDescriptions.map((description, index) => (
              <button
                key={`${description}-${index}`}
                type="button"
                onClick={() => handleDescriptionSelection(description)}
                disabled={!selectedWord}
                className={`w-full rounded-2xl border px-4 py-3 text-left text-sm transition ${
                  selectedWord
                    ? "border-white/10 bg-white/5 text-zinc-300 hover:bg-white/10 hover:text-white"
                    : "cursor-not-allowed border-white/5 bg-white/[0.03] text-zinc-600"
                }`}
              >
                {description}
              </button>
            ))}
          </div>
        </div>
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
          onClick={checkMatches}
          disabled={isSubmitting || Object.keys(matches).length === 0}
          className="rounded-2xl bg-gradient-to-r from-pink-500 via-fuchsia-500 to-indigo-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-fuchsia-500/20 transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Saving..." : "Check matches"}
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
