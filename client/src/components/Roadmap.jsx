const TIER_STYLES = {
  core: "border-rose-200 bg-rose-50 text-rose-600",
  intermediate: "border-amber-200 bg-amber-50 text-amber-600",
  advanced: "border-teal-200 bg-teal-50 text-teal-600",
};

export default function Roadmap({ roadmap }) {
  if (!roadmap.length) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-white/60 px-6 py-10 text-center text-xs font-medium text-slate-400">
        No roadmap needed — every required skill is already covered.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {roadmap.map((item, i) => {
        const tierCls = TIER_STYLES[item.priority] || "border-slate-200 bg-slate-50 text-slate-500";
        return (
          <div
            key={i}
            className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-card transition-shadow duration-150 hover:shadow-card-hover sm:flex-row sm:items-start sm:justify-between sm:gap-6"
          >
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-base font-semibold capitalize text-slate-900">{item.skill}</span>
              <span
                className={`whitespace-nowrap rounded-full border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${tierCls}`}
              >
                {item.priority}
              </span>
            </div>

            <div className="space-y-1 text-left sm:text-right">
              {item.resources.map((r, j) => (
                <div key={j} className="text-sm text-slate-600">
                  {r.title}{" "}
                  <span className="font-mono text-xs font-medium text-brand-600">— {r.provider}</span>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
