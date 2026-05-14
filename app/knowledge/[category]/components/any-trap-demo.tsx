"use client";
import { useState } from "react";
import { Play, Terminal, Database, Code2, AlertCircle } from "lucide-react";

export default function AnyTrapDemo() {
  const [scenario, setScenario] = useState<"success" | "error" | "idle">(
    "idle",
  );
  const [loading, setLoading] = useState(false);

  const mockData = {
    success: { user: { name: "A_VALID_USER" } },
    error: { user: { username: "A_VALID_USER" } },
  };

  const runSimulation = (type: "success" | "error") => {
    setLoading(true);
    setScenario("idle");
    setTimeout(() => {
      setLoading(false);
      setScenario(type);
    }, 600);
  };

  return (
    <div className="my-8 border border-slate-200 dark:border-white/10 rounded-xl overflow-hidden bg-[#0d1117] shadow-2xl">
      <div className="bg-slate-900/80 px-4 py-3 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5 mr-2">
            <div className="w-3 h-3 rounded-full bg-red-500/20" />
            <div className="w-3 h-3 rounded-full bg-amber-500/20" />
            <div className="w-3 h-3 rounded-full bg-green-500/20" />
          </div>
          <span className="text-xs font-mono text-slate-400">
            TypeScript Runtime Demo
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 border-b border-white/5">
        <div className="p-5 border-r border-white/5 bg-slate-900/30">
          <div className="flex items-center gap-2 mb-4 text-slate-400 text-xs font-bold uppercase tracking-wider">
            <Database size={14} /> Simulated Backend API Response (JSON)
          </div>
          <div className="bg-black/40 rounded-lg p-4 font-mono text-sm min-h-[120px] flex flex-col justify-center">
            {scenario === "idle" ? (
              <span className="text-slate-600 italic">Waiting...</span>
            ) : (
              <pre className="text-blue-300">
                {JSON.stringify(
                  mockData[scenario === "success" ? "success" : "error"],
                  null,
                  2,
                )}
              </pre>
            )}
          </div>
        </div>

        <div className="p-5 bg-slate-900/10">
          <div className="flex items-center gap-2 mb-4 text-slate-400 text-xs font-bold uppercase tracking-wider">
            <Code2 size={14} /> Frontend Logic (TypeScript)
          </div>
          <pre className="font-mono text-sm leading-relaxed text-slate-300">
            <div>
              <span className="text-purple-400">const</span> data:{" "}
              <span className="text-amber-400">any</span> ={" "}
              <span className="text-purple-400">await</span> res;
            </div>

            <div className="bg-blue-500/10 border-l-2 border-blue-500 pl-2">
              <span className="text-blue-400">console</span>.log(data.
              <span className="text-yellow-200">user</span>.
              <span className="text-yellow-200 underline decoration-rose-500/50">
                name
              </span>
              );
            </div>
          </pre>
        </div>
      </div>

      <div className="p-6 bg-slate-900/50">
        <div className="flex flex-wrap gap-3 mb-6">
          <button
            onClick={() => runSimulation("success")}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-sm transition-all disabled:opacity-50"
          >
            <Play size={14} /> Simulate Normal Return
          </button>
          <button
            onClick={() => runSimulation("error")}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-sm transition-all disabled:opacity-50"
          >
            <AlertCircle size={14} /> Simulate Field Change (Bug)
          </button>
        </div>

        <div
          className={`p-4 rounded-lg font-mono text-xs flex items-start gap-3 transition-all duration-300 ${
            scenario === "error"
              ? "bg-rose-500/10 text-rose-400 border border-rose-500/20"
              : scenario === "success"
              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
              : "bg-black text-slate-500 border border-white/5"
          }`}
        >
          <Terminal size={16} className="mt-0.5 shrink-0 opacity-50" />
          <div className="flex-1">
            {loading ? (
              <span className="animate-pulse">Executing...</span>
            ) : scenario === "idle" ? (
              <span>
                Ready. Click the button above to observe the behavior of `any`.
              </span>
            ) : scenario === "success" ? (
              <div>
                <div>$ tsc api_test.ts && node api_test.js</div>
                <div className="mt-1 text-emerald-500">A_VALID_USER</div>
              </div>
            ) : (
              <div>
                <div className="mt-1 text-rose-500 font-bold">
                  Uncaught TypeError: Cannot read properties of undefined
                  (reading &apos;name&apos;)
                </div>
                <div className="mt-2 text-slate-400 border-t border-rose-500/20 pt-2 italic">
                  Root Cause Analysis: The backend returns `username`, but the
                  code attempts to access `name`. Since `any` was used,
                  TypeScript remained silent during the compilation phase.
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
