import { LessonSectionForm, ReadingTask } from "@/types";
import ReadingTasksManager from "./ReadingTasksManager";

type LessonStructureEditorProps = {
  lessonId: string;
  readingtasks?: ReadingTask[];
  sections: LessonSectionForm[];
  onChange: (sections: LessonSectionForm[]) => void;
};

type SectionField = "order" | "enabled";

export default function LessonStructureEditor({
  lessonId,
  readingtasks,
  sections,
  onChange,
}: LessonStructureEditorProps) {
  const handleSectionChange = (
    key: LessonSectionForm["key"],
    field: SectionField,
    value: number | boolean,
  ) => {
    const updatedSections = sections.map((section) =>
      section.key === key ? { ...section, [field]: value } : section,
    );

    onChange(updatedSections);
  };

  return (
    <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-5">
      <div className="mb-5">
        <h2 className="text-lg font-semibold text-zinc-900">
          Lesson structure
        </h2>
        <p className="mt-1 text-sm text-zinc-500">
          Enable, disable and order lesson sections.
        </p>
      </div>

      <div className="space-y-4">
        {sections
          .slice()
          .sort((a, b) => a.order - b.order)
          .map((section) => (
            <div
              key={section.key}
              className="rounded-2xl border border-zinc-200 bg-white p-5"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-500">
                    {section.key}
                  </p>

                  <h3 className="mt-2 text-xl font-semibold text-zinc-900">
                    {section.title}
                  </h3>

                  <p className="mt-1 text-sm leading-6 text-zinc-500">
                    {section.subtitle || "No subtitle"}
                  </p>
                </div>

                <label className="flex items-center gap-2 text-sm font-medium text-zinc-700">
                  <input
                    type="checkbox"
                    checked={section.enabled}
                    onChange={(e) =>
                      handleSectionChange(
                        section.key,
                        "enabled",
                        e.target.checked,
                      )
                    }
                    className="h-4 w-4 rounded border-zinc-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  Enabled
                </label>
              </div>

              <div className="mt-5 max-w-[120px]">
                <label className="mb-2 block text-sm font-medium text-zinc-700">
                  Order
                </label>

                <input
                  type="number"
                  value={section.order}
                  onChange={(e) => {
                    const value = e.target.value;

                    if (value === "") return;

                    handleSectionChange(section.key, "order", Number(value));
                  }}
                  className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-3 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              {section.key === "reading" ? (
                <ReadingTasksManager
                  lessonId={lessonId}
                  readingtasks={readingtasks || []}
                />
              ) : (
                <div className="mt-5 rounded-xl border border-dashed border-zinc-200 bg-zinc-50 p-4 text-sm text-zinc-500">
                  Tasks for this section will be managed here later.
                </div>
              )}
            </div>
          ))}
      </div>
    </div>
  );
}
