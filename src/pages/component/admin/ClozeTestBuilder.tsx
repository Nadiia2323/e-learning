import React, { useState } from "react";

type ClozeContentItem = {
  id: string;
  text: string;
  blank: boolean;
  answer?: string;
};

export default function ClozeTestBuilder() {
  const [content, setContent] = useState<ClozeContentItem[]>([]);

  const [block, setBlock] = useState({
    text: "",
    blank: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked, type } = e.target;

    setBlock((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleAddBlock = () => {
    if (!block.text.trim()) return;

    setContent((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        text: block.text,
        blank: block.blank,
        answer: block.blank ? block.text : undefined,
      },
    ]);

    setBlock({
      text: "",
      blank: false,
    });
  };

  return (
    <div className="mt-4 space-y-4 rounded-2xl border border-zinc-200 bg-zinc-50 p-5">
      <div className="space-y-3 rounded-xl border border-zinc-200 bg-white p-4">
        <input
          type="text"
          name="text"
          value={block.text}
          onChange={handleChange}
          placeholder="Enter text or blank answer"
          className="w-full rounded-xl border border-zinc-300 px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
        />

        <label className="flex items-center gap-2 text-sm text-zinc-700">
          <input
            type="checkbox"
            name="blank"
            checked={block.blank}
            onChange={handleChange}
            className="h-4 w-4 rounded border-zinc-300 text-indigo-600 focus:ring-indigo-500"
          />
          This block is a blank
        </label>

        <button
          type="button"
          onClick={handleAddBlock}
          className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-500"
        >
          Add block
        </button>
      </div>

      <div className="space-y-3">
        {content.map((item) => (
          <div
            key={item.id}
            className="rounded-xl border border-zinc-200 bg-white p-4"
          >
            <p className="font-medium text-zinc-800">{item.text}</p>

            <p className="mt-2 text-sm text-zinc-500">
              {item.blank ? "Blank block" : "Text block"}
            </p>

            {item.answer && (
              <p className="mt-1 text-xs text-zinc-400">
                Answer: {item.answer}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
