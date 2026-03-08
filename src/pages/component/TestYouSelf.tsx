import React, { useContext, useState } from "react";
import ModalTest from "./ModalTest";
import { updateProgress } from "@/utils/updateProgress";
import { useRouter } from "next/router";
import { UserContext } from "@/hooks/UserContext";

type TestOption = {
  _id: string;
  optionText: string;
  isCorrect: boolean;
};

type TestQuestion = {
  _id: string;
  questionText: string;
  options: TestOption[];
};

type TestData = {
  name: string;
  test: TestQuestion[];
};

type SelectedAnswer = {
  optionId: string;
  userAnswer: string;
  isCorrect: boolean;
};

type Props = {
  test: TestData;
};

export default function TestYourself({ test }: Props) {
  const [answers, setAnswers] = useState<Record<string, SelectedAnswer>>({});
  const [newProgress, setNewProgress] = useState(0);
  const [result, setResult] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();
  const { songId } = router.query;
  const lessonId = songId as string;

  const { user } = useContext(UserContext);
  const userEmail = user?.data?.email || "";

  const handleReset = () => {
    setAnswers({});
    setResult(null);
    setNewProgress(0);
    setShowModal(false);
  };

  const handleOptionChange = (
    questionId: string,
    optionId: string,
    isCorrect: boolean,
    optionText: string,
  ) => {
    if (showModal) return;

    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionId]: { optionId, userAnswer: optionText, isCorrect },
    }));
  };

  const handleSubmit = async () => {
    const correctAnswers = Object.values(answers).filter(
      (answer) => answer.isCorrect,
    );

    const progress = test.test.length
      ? (correctAnswers.length / test.test.length) * 100
      : 0;

    const completed = progress === 100;
    const resultMessage = `You got ${correctAnswers.length} out of ${test.test.length} correct.`;

    setResult(resultMessage);
    setNewProgress(progress);
    setShowModal(true);

    const answerDetails = Object.entries(answers).map(
      ([questionId, answer]) => ({
        taskId: questionId,
        answerType: "test yourself",
        answerDetails: {
          userAnswer: answer.userAnswer,
          isCorrect: answer.isCorrect,
        },
      }),
    );

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
      console.error("Failed to update final test progress:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="rounded-[28px] border border-white/10 bg-white/5 p-5 shadow-xl backdrop-blur-xl md:p-6">
      <div className="mb-6 flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-zinc-500">
            Final quiz
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-white">
            {test.name}
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-400">
            Answer the questions below to check how well you understood the
            lesson.
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
          <p className="text-xs text-zinc-500">Answered</p>
          <p className="mt-1 text-lg font-semibold text-white">
            {Object.keys(answers).length} / {test.test.length}
          </p>
        </div>
      </div>

      <div className="space-y-5">
        {test.test.map((question, index) => (
          <div
            key={question._id}
            className="rounded-3xl border border-white/10 bg-black/20 p-5"
          >
            <div className="mb-4 flex items-start gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 text-sm font-semibold text-white">
                {index + 1}
              </div>

              <p className="pt-1 text-sm leading-6 text-zinc-200 md:text-base">
                {question.questionText}
              </p>
            </div>

            <div className="space-y-3">
              {question.options.map((option) => {
                const isAnswerChecked = showModal;
                const selected = answers[question._id];
                const isSelectedOption = selected?.optionId === option._id;
                const isCorrectAnswer = selected?.isCorrect;

                let optionClass =
                  "w-full rounded-2xl border px-4 py-3 text-left text-sm transition";

                if (!isAnswerChecked) {
                  optionClass += isSelectedOption
                    ? " border-fuchsia-400 bg-fuchsia-500/15 text-white"
                    : " border-white/10 bg-white/5 text-zinc-300 hover:bg-white/10 hover:text-white";
                } else if (isSelectedOption) {
                  optionClass += isCorrectAnswer
                    ? " border-emerald-400/50 bg-emerald-400/10 text-emerald-200"
                    : " border-rose-400/50 bg-rose-400/10 text-rose-200";
                } else {
                  optionClass += " border-white/10 bg-white/5 text-zinc-500";
                }

                return (
                  <label key={option._id} className={optionClass}>
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name={question._id}
                        value={option.optionText}
                        checked={isSelectedOption}
                        onChange={() =>
                          handleOptionChange(
                            question._id,
                            option._id,
                            option.isCorrect,
                            option.optionText,
                          )
                        }
                        disabled={showModal}
                        className="h-4 w-4 accent-fuchsia-500"
                      />
                      <span>{option.optionText}</span>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={isSubmitting || test.test.length === 0}
          className="rounded-2xl bg-gradient-to-r from-pink-500 via-fuchsia-500 to-indigo-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-fuchsia-500/20 transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Saving..." : "Submit"}
        </button>

        <button
          type="button"
          onClick={handleReset}
          className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium text-zinc-200 transition hover:bg-white/10"
        >
          Reset
        </button>
      </div>

      {showModal && (
        <ModalTest
          result={result}
          score={newProgress}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}
