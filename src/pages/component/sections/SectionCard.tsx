import React from "react";

export default function SectionCard({
  title,
  subtitle,
  isOpen,
  onToggle,
  children,
}: {
  title: string;
  subtitle?: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl transition">
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-4 text-left"
      >
        <div>
          <h2 className="text-xl font-semibold text-white">{title}</h2>
          {subtitle && <p className="mt-1 text-sm text-zinc-400">{subtitle}</p>}
        </div>

        <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm text-zinc-300">
          {isOpen ? "Hide" : "Open"}
        </span>
      </button>

      {isOpen && <div className="mt-5">{children}</div>}
    </div>
  );
}
