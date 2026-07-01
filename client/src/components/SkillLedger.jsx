const TIER_STYLES = {
  core: "border-rose-200 bg-rose-50 text-rose-600",
  intermediate: "border-amber-200 bg-amber-50 text-amber-600",
  advanced: "border-teal-200 bg-teal-50 text-teal-600",
};

function TierTag({ level }) {
  const cls = TIER_STYLES[level] || "border-slate-200 bg-slate-50 text-slate-500";
  return (
    <span
      className={`ml-2 whitespace-nowrap rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${cls}`}
    >
      {level}
    </span>
  );
}

function SkillRow({ item, status }) {
  const isMatched = status === "matched";
  return (
    <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-4 py-3 last:border-b-0 sm:px-5">
      <span className="flex min-w-0 flex-wrap items-center">
        <span className="truncate text-sm font-medium capitalize text-slate-800">{item.skill}</span>
        <TierTag level={item.level} />
      </span>
      <span
        className={`shrink-0 whitespace-nowrap text-xs font-bold uppercase tracking-wide ${
          isMatched ? "text-emerald-600" : "text-rose-600"
        }`}
      >
        {isMatched ? "✓ matched" : "✕ gap"}
      </span>
    </div>
  );
}

function LedgerCard({ title, count, items, status, emptyMessage }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-card">
      <div className="flex items-center gap-2 border-b border-slate-100 px-4 py-3.5 sm:px-5">
        <h3 className="text-sm font-bold text-slate-900">{title}</h3>
        <span className="text-xs font-medium text-slate-400">({count})</span>
      </div>
      {items.length === 0 ? (
        <div className="px-5 py-8 text-center text-xs font-medium text-slate-400">{emptyMessage}</div>
      ) : (
        <div className="max-h-80 overflow-y-auto scrollbar-thin">
          {items.map((item, i) => (
            <SkillRow key={i} item={item} status={status} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function SkillLedger({ matched, missing }) {
  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
      <LedgerCard
        title="Matched skills"
        count={matched.length}
        items={matched}
        status="matched"
        emptyMessage="No overlapping skills detected yet."
      />
      <LedgerCard
        title="Skill gaps"
        count={missing.length}
        items={missing}
        status="missing"
        emptyMessage="No gaps found — full coverage for this role."
      />
    </div>
  );
}
