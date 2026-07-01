function colorForScore(score) {
  if (score >= 75) return "#10b981"; // emerald
  if (score >= 45) return "#f59e0b"; // amber
  return "#e11d48"; // rose
}

function verdictCopy(score, role) {
  if (score >= 75)
    return `Strong alignment with ${role}. Most core and intermediate expectations are already covered — focus remaining effort on the advanced layer.`;
  if (score >= 45)
    return `Partial alignment with ${role}. The foundation is there, but several core or intermediate skills still need to be closed before this resume reads as role-ready.`;
  return `Early-stage alignment with ${role}. A meaningful number of core skills are missing — the roadmap below prioritizes those first.`;
}

export default function ScorePanel({ result }) {
  const { score, role, matched, missing } = result;
  const radius = 86;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color = colorForScore(score);

  return (
    <section className="grid grid-cols-1 items-center gap-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-card sm:p-8 md:grid-cols-[200px_1fr] md:gap-10">
      <div className="relative mx-auto h-[180px] w-[180px] sm:h-[200px] sm:w-[200px]">
        <svg width="100%" height="100%" viewBox="0 0 200 200" className="-rotate-90">
          <circle cx="100" cy="100" r={radius} fill="none" stroke="#e2e8f0" strokeWidth="10" />
          <circle
            cx="100"
            cy="100"
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="transition-[stroke-dashoffset] duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl font-extrabold tracking-tight sm:text-5xl" style={{ color }}>
            {score}
          </span>
          <span className="mt-1 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Role-fit score
          </span>
        </div>
      </div>

      <div className="text-center md:text-left">
        <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-brand-600">
          Verdict — file no. {Math.floor(1000 + Math.random() * 9000)}
        </p>
        <h2 className="mb-3 text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
          Candidacy review for {role}
        </h2>
        <p className="text-sm leading-relaxed text-slate-600 sm:text-[15px]">
          {verdictCopy(score, role)}
        </p>

        <div className="mt-5 flex justify-center gap-8 md:justify-start">
          <div>
            <div className="text-xl font-bold text-emerald-600">{matched.length}</div>
            <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Skills matched
            </div>
          </div>
          <div>
            <div className="text-xl font-bold text-rose-600">{missing.length}</div>
            <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Skills missing
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
