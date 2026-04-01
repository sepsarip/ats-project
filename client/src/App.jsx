const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

function App() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-emerald-50 p-6">
      <div className="mx-auto max-w-3xl rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-bold text-slate-900">ATS Monorepo Scaffold</h1>
        <p className="mt-3 text-slate-600">
          Frontend React + Tailwind aktif. Backend API default URL: <strong>{apiBaseUrl}</strong>
        </p>
      </div>
    </main>
  );
}

export default App;