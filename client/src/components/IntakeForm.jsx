import { useState, useRef } from "react";

export default function IntakeForm({ roles, onSubmit, loading, error }) {
  const [file, setFile] = useState(null);
  const [role, setRole] = useState(roles[0] || "");
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef(null);

  function handleFile(f) {
    if (!f) return;
    setFile(f);
  }

  function handleDrop(e) {
    e.preventDefault();
    setDragActive(false);
    handleFile(e.dataTransfer.files?.[0]);
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!file || !role) return;
    onSubmit(file, role);
  }

  return (
    <form
      className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card sm:p-8"
      onSubmit={handleSubmit}
    >
      <div className="grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-500">
            Resume file
          </label>
          <div
            role="button"
            tabIndex={0}
            aria-label="Upload resume file"
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                inputRef.current?.click();
              }
            }}
            className={`group flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-4 py-8 text-center transition-colors duration-150 ${
              dragActive
                ? "border-brand-500 bg-brand-50"
                : "border-slate-300 bg-slate-50 hover:border-brand-400 hover:bg-brand-50/50"
            }`}
            onClick={() => inputRef.current?.click()}
            onDragOver={(e) => {
              e.preventDefault();
              setDragActive(true);
            }}
            onDragLeave={() => setDragActive(false)}
            onDrop={handleDrop}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`mb-2 h-8 w-8 transition-colors ${dragActive ? "text-brand-600" : "text-slate-400 group-hover:text-brand-500"}`}
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.6}
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9m0 0l-3 3m3-3l3 3M6 20.25h12a2.25 2.25 0 002.25-2.25v-6a2.25 2.25 0 00-.659-1.591l-4.5-4.5A2.25 2.25 0 0013.5 5.25H6A2.25 2.25 0 003.75 7.5v10.5A2.25 2.25 0 006 20.25z" />
            </svg>
            <strong className="mb-1 block text-sm font-semibold text-slate-800">
              {file ? "Replace file" : "Drop resume here, or click to browse"}
            </strong>
            <span className="text-xs text-slate-500">Accepts .pdf, .docx, .txt — up to 5MB</span>
            {file && (
              <div className="mt-3 max-w-full truncate rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                {file.name}
              </div>
            )}
            <input
              ref={inputRef}
              type="file"
              accept=".pdf,.docx,.txt"
              className="hidden"
              onChange={(e) => handleFile(e.target.files?.[0])}
            />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-500" htmlFor="role-select">
            Target role
          </label>
          <div className="relative">
            <select
              id="role-select"
              className="w-full appearance-none rounded-xl border border-slate-300 bg-white px-4 py-3.5 text-sm font-medium text-slate-800 shadow-sm transition-colors focus:border-brand-500 focus:outline-none"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              {roles.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
            </svg>
          </div>

          <p className="mt-4 text-xs leading-relaxed text-slate-400">
            We match keywords in your resume against the core, intermediate, and advanced skills
            typically expected for this role.
          </p>
        </div>
      </div>

      <div className="mt-7 flex flex-col items-start gap-3 border-t border-slate-100 pt-6 sm:flex-row sm:items-center">
        <button
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-600 px-6 py-3 text-sm font-semibold text-white shadow-card transition-all duration-150 hover:bg-brand-700 hover:shadow-card-hover active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500 disabled:shadow-none"
          type="submit"
          disabled={!file || loading}
        >
          {loading && (
            <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
          )}
          {loading ? "Analyzing…" : "Run skill-gap analysis"}
        </button>
        {error && (
          <span className="rounded-lg bg-rose-50 px-3 py-1.5 text-xs font-medium text-rose-600">
            {error}
          </span>
        )}
      </div>
    </form>
  );
}
