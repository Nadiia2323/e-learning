import { useState } from "react";

type SentenceOption = {
  test: string;
  sentence: string;
  option: string;
  correctAnswer: string;
};
type SentenceTask = {
  id: string;
  sentence: string;
  options: string[];
  correctAnswers: string[];
};

export default function SentenceOptionsBuilder() {
  const [formData, setFormData] = useState<SentenceOption>({
    test: "",
    sentence: "",
    option: "",
    correctAnswer: "",
  });
  const [currentOptions, setCurrentOptions] = useState<string[]>([]);
  const [tasks, setTasks] = useState<SentenceTask[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    console.log("formData :>> ", formData);
  };
  const handleAddOption = () => {
    if (!formData.option.trim()) return;
    setCurrentOptions((prev) => [...prev, formData.option]);
    console.log("currentOptions :>> ", currentOptions);
    setFormData((prev) => ({ ...prev, option: "" }));
  };

  return (
    <div className="mt-4 space-y-4 rounded-2xl border border-zinc-200 bg-zinc-50 p-5">
      <div>
        <h4 className="font-semibold text-zinc-900">
          Sentence options builder
        </h4>
        <p className="mt-1 text-sm text-zinc-500">
          Create a sentence task with answer options.
        </p>
      </div>

      <div className="space-y-3 rounded-xl border border-zinc-200 bg-white p-4">
        <input
          value={formData.sentence}
          onChange={handleChange}
          type="text"
          name="sentence"
          placeholder="Enter sentence or question"
          className="w-full rounded-xl border border-zinc-300 px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
        />

        <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
          <input
            value={formData.option}
            onChange={handleChange}
            type="text"
            name="option"
            placeholder="Add option"
            className="rounded-xl border border-zinc-300 px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
          />

          <button
            onClick={handleAddOption}
            type="button"
            className="rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-500"
          >
            Add option
          </button>
        </div>

        <input
          onChange={handleChange}
          type="text"
          value={formData.correctAnswer}
          name="correctAnswer"
          placeholder="Correct answer"
          className="w-full rounded-xl border border-zinc-300 px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
        />
      </div>

      <div className="space-y-3">
        <p className="text-sm font-medium text-zinc-700">Preview</p>

        <div className="space-y-2 rounded-xl border border-zinc-200 bg-white p-4 text-sm text-zinc-500">
          {currentOptions.length > 0 ? (
            currentOptions.map((option) => (
              <div
                key={option}
                className="rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2"
              >
                {option}
              </div>
            ))
          ) : (
            <p>No options yet</p>
          )}
        </div>
      </div>
    </div>
  );
}
