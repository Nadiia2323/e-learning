import { useState } from "react";

type SentenceOption = {
  test: string;
  sentence: string;
  option: string;
  correctAnswer: string;
};
type SentenceTask = {
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
    const option = formData.option.trim();

    if (!option) return;

    if (currentOptions.includes(option)) return;

    setCurrentOptions((prev) => [...prev, option]);

    setFormData((prev) => ({
      ...prev,
      option: "",
    }));
  };
  const handleSelectCorrectAnswer = (option: string) => {
    setFormData((prev) => ({
      ...prev,
      correctAnswer: option,
    }));
  };
  const handleAddTask = () => {
    if (!formData.sentence.trim()) return;
    if (currentOptions.length < 2) return;
    if (!formData.correctAnswer.trim()) return;

    const newTask: SentenceTask = {
      sentence: formData.sentence,
      options: currentOptions,
      correctAnswers: [formData.correctAnswer],
    };

    setTasks((prev) => [...prev, newTask]);

    setFormData((prev) => ({
      ...prev,
      sentence: "",
      option: "",
      correctAnswer: "",
    }));

    setCurrentOptions([]);
  };
  const handleDeleteOption = (optionToDelete: string) => {
    setCurrentOptions((prev) =>
      prev.filter((option) => option !== optionToDelete),
    );
    if (optionToDelete === formData.correctAnswer) {
      setFormData((prev) => ({ ...prev, correctAnswer: "" }));
    }
  };
  return (
    <div className="mt-4 max-w-2xl rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
      <div className="mb-4">
        <h3 className="text-base font-semibold text-zinc-900">
          Sentence Options
        </h3>
        <p className="text-sm text-zinc-500">
          Create tasks and save them to this lesson.
        </p>
      </div>

      <div className="space-y-3">
        <input
          value={formData.sentence}
          onChange={handleChange}
          type="text"
          name="sentence"
          placeholder="Sentence: I ___ happy."
          className="w-full rounded-xl border border-zinc-300 px-3 py-2 text-sm"
        />

        <div className="flex gap-2">
          <input
            value={formData.option}
            onChange={handleChange}
            type="text"
            name="option"
            placeholder="Option"
            className="flex-1 rounded-xl border border-zinc-300 px-3 py-2 text-sm"
          />

          <button
            onClick={handleAddOption}
            type="button"
            className="rounded-xl bg-zinc-900 px-4 py-2 text-sm font-medium text-white"
          >
            Add
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {currentOptions.map((option, index) => (
            <div
              key={`${option}-${index}`}
              className={`flex items-center gap-2 rounded-full border px-3 py-1 text-sm ${
                formData.correctAnswer === option
                  ? "border-green-500 bg-green-50 text-green-700"
                  : "border-zinc-300 bg-zinc-50 text-zinc-700"
              }`}
            >
              <button
                type="button"
                onClick={() => handleSelectCorrectAnswer(option)}
              >
                {option}
              </button>

              <button
                type="button"
                onClick={() => handleDeleteOption(option)}
                className="text-zinc-400 hover:text-red-500"
              >
                ×
              </button>
            </div>
          ))}
        </div>
        {/* <div className="flex flex-wrap gap-2">
          {currentOptions.map((option, index) => {
            const isCorrect = formData.correctAnswer === option;

            return (
              <button
                key={`${option}-${index}`}
                type="button"
                onClick={() => handleSelectCorrectAnswer(option)}
                className={`rounded-full border px-3 py-1 text-sm transition ${
                  isCorrect
                    ? "border-green-500 bg-green-100 text-green-700"
                    : "border-zinc-300 bg-zinc-50 text-zinc-700 hover:border-indigo-400"
                }`}
              >
                {option}
              </button>
            );
          })}
        </div> */}

        <div className="flex gap-2 pt-2">
          <button
            type="button"
            onClick={handleAddTask}
            disabled={
              !formData.sentence ||
              currentOptions.length < 2 ||
              !formData.correctAnswer
            }
            className="flex-1 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white disabled:bg-zinc-300"
          >
            Add task
          </button>

          {/* <button
            type="button"
            onClick={handleSave}
            disabled={tasks.length === 0}
            className="flex-1 rounded-xl bg-green-600 px-4 py-2 text-sm font-semibold text-white disabled:bg-zinc-300"
          >
            Save
          </button> */}
        </div>
      </div>

      <div className="mt-5 border-t border-zinc-200 pt-4">
        <p className="mb-2 text-sm font-medium text-zinc-700">
          Added tasks: {tasks.length}
        </p>

        <div className="space-y-2">
          {tasks.map((task, index) => (
            <div
              key={index}
              className="rounded-xl bg-zinc-50 px-3 py-2 text-sm"
            >
              <p className="font-medium text-zinc-900">
                {index + 1}. {task.sentence}
              </p>
              <p className="text-zinc-500">{task.options.join(" / ")}</p>
              <p className="text-green-600">
                Correct: {task.correctAnswers[0]}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
