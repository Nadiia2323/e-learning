import { ClozeContentItem } from "@/types";
import React, { useState } from "react";

type ClozeTestBuilderProps = {
  value: ClozeContentItem[];
  onChange: React.Dispatch<React.SetStateAction<ClozeContentItem[]>>;
};

export default function ClozeTestBuilder({
  value,
  onChange,
}: ClozeTestBuilderProps) {
  // const [content, setContent] = useState<ClozeContentItem[]>([]);

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

    onChange((prev) => [
      ...prev,
      {
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
  const handleDeleteBlock = (indexToDelete: number) => {
    onChange((prev) => prev.filter((_, index) => index !== indexToDelete));
  };

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4">
      <div className="mb-3">
        <h4 className="text-sm font-semibold text-zinc-900">Cloze Test</h4>
        <p className="text-xs text-zinc-500">
          Add text blocks and mark missing words as blanks.
        </p>
      </div>

      <div className="space-y-3">
        <input
          type="text"
          name="text"
          value={block.text}
          onChange={handleChange}
          placeholder="Text or missing word"
          className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-indigo-500"
        />

        <div className="flex items-center justify-between gap-3">
          <label className="flex items-center gap-2 text-sm text-zinc-700">
            <input
              type="checkbox"
              name="blank"
              checked={block.blank}
              onChange={handleChange}
              className="h-4 w-4 rounded border-zinc-300 text-indigo-600"
            />
            Blank
          </label>

          <button
            type="button"
            onClick={handleAddBlock}
            disabled={!block.text.trim()}
            className="rounded-lg bg-indigo-600 px-3 py-2 text-sm font-semibold text-white disabled:bg-zinc-300"
          >
            Add block
          </button>
        </div>
      </div>

      <div className="mt-4 rounded-lg bg-zinc-50 p-3">
        <p className="mb-2 text-xs font-semibold text-zinc-500">Preview</p>

        {value.length > 0 ? (
          <div className="flex flex-wrap gap-2 text-sm">
            {value.map((item, index) => (
              <span
                key={index}
                className={`flex items-center gap-2 rounded-lg px-2 py-1 ${
                  item.blank
                    ? "border border-indigo-200 bg-indigo-50 text-indigo-700"
                    : "bg-white text-zinc-700"
                }`}
              >
                <span>{item.blank ? `___ (${item.answer})` : item.text}</span>

                <button
                  type="button"
                  onClick={() => handleDeleteBlock(index)}
                  className="text-zinc-400 hover:text-red-500"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        ) : (
          // <div className="flex flex-wrap gap-2 text-sm">
          //   {content.map((item, index) => (
          //     <span
          //       key={index}
          //       className={`rounded-lg px-2 py-1 ${
          //         item.blank
          //           ? "border border-indigo-200 bg-indigo-50 text-indigo-700"
          //           : "bg-white text-zinc-700"
          //       }`}
          //     >
          //       {item.blank ? `___ (${item.answer})` : item.text}
          //     </span>
          //   ))}
          // </div>
          <p className="text-sm text-zinc-400">No blocks yet</p>
        )}
      </div>
    </div>
  );
}
