const API_URL = import.meta.env.VITE_API_URL;
import { useEffect, useState } from "react";
import IntakeForm from "./components/IntakeForm";
import ScorePanel from "./components/ScorePanel";
import SkillLedger from "./components/SkillLedger";
import Roadmap from "./components/Roadmap";

const FALLBACK_ROLES = [
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Developer",
  "Data Analyst",
  "Data Scientist",
  "DevOps Engineer",
  "Mobile App Developer",
  "UI/UX Designer",
];

export default function App() {
  const [roles, setRoles] = useState(FALLBACK_ROLES);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`{API_URL}/api/roles`)
      .then((r) => r.json())
      .then((d) => d.roles?.length && setRoles(d.roles))
      .catch(() => { });
  }, []);

  async function handleSubmit(file, role) {
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const formData = new FormData();
      formData.append("resume", file);
      formData.append("targetRole", role);

      const res = await fetch(`${API_URL}/api/analyze`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Analysis failed");
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-full bg-slate-50">
      {/* Top navigation */}
      <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-5 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-600 text-sm font-bold text-white shadow-card">
              RA
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-brand-600">
                Skill-Gap Recommendation System
              </p>
              <h1 className="text-lg font-bold leading-tight tracking-tight text-slate-900 sm:text-xl">
                Resume Analyzer
              </h1>
            </div>
          </div>

          {/*<div className="inline-flex w-fit items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-500">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Keyword matching engine · v1.0
          </div>*/}
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
        <IntakeForm roles={roles} onSubmit={handleSubmit} loading={loading} error={error} />

        {loading && (
          <div className="mt-6 flex animate-fade-in items-center gap-3 rounded-xl border border-slate-200 bg-white px-5 py-4 shadow-card">
            <span className="h-4 w-4 shrink-0 animate-spin rounded-full border-2 border-brand-200 border-t-brand-600" />
            <p className="text-sm font-medium text-slate-600">
              Parsing resume and scoring against role requirements…
            </p>
          </div>
        )}

        {result && (
          <div className="mt-8 animate-fade-in space-y-10 sm:mt-10">
            <ScorePanel result={result} />

            <section>
              <SectionDivider label="Skill ledger" />
              <SkillLedger matched={result.matched} missing={result.missing} />
            </section>

            <section>
              <SectionDivider label="Personalized learning roadmap" />
              <Roadmap roadmap={result.roadmap} />
            </section>
          </div>
        )}

        {!result && !loading && (
          <div className="mt-8 flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white/60 px-6 py-16 text-center sm:mt-10">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-brand-50 text-brand-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <p className="max-w-sm text-sm font-medium text-slate-500">
              Upload a resume and select a role to generate a skill-gap report.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}

function SectionDivider({ label }) {
  return (
    <div className="mb-5 flex items-center gap-4">
      <h2 className="whitespace-nowrap text-xs font-semibold uppercase tracking-wider text-slate-400">
        {label}
      </h2>
      <div className="h-px flex-1 bg-slate-200" />
    </div>
  );
}
