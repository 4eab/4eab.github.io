export default function Page() {
  return (
    <main className="max-w-4xl mx-auto px-8 py-1">
      <header className="relative space-y-8">
        <div className="flex flex-col space-y-4">
          <div className="flex flex-col items-start md:flex-row gap-4 md:items-baseline">
            <h1 className="text-7xl md:text-9xl font-black tracking-tighter text-black dark:text-white">
              U+4EAB
            </h1>
            <a
              href="https://util.unicode.org/UnicodeJsps/character.jsp?a=4EAB"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-mono uppercase tracking-widest text-slate-400 hover:text-black dark:hover:text-white transition-all duration-300 flex items-center gap-2 group"
            >
              <span>Unicode Index</span>
              <span className="opacity-0 group-hover:opacity-100 transition-opacity">
                →
              </span>
            </a>
          </div>
        </div>

        <div className="max-w-2xl space-y-10">
          <div className="space-y-6 pt-10">
            <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-[0.3em] text-slate-400 dark:text-slate-600">
              <span>Pronunciation</span>
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <span
                className="text-lg md:text-xl font-mono text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-white/5 px-4 py-1.5 rounded-sm border border-slate-100 dark:border-white/10"
                style={{
                  fontFamily:
                    'Inter, "Lucida Sans Unicode", "Arial Unicode MS", monospace',
                }}
              >
                IPA [ɕi̯ɑŋ]
              </span>
            </div>
          </div>

          <div className="space-y-6 pt-10">
            <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-[0.3em] text-slate-400 dark:text-slate-600">
              <span>Definition</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              <div className="md:col-span-1 text-slate-300 dark:text-slate-700 font-mono text-xl">
                01
              </div>
              <div className="md:col-span-11 space-y-4">
                <p className="text-2xl font-medium tracking-tight">To enjoy.</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <footer className="mt-20">
        <div className="text-[10px] font-mono text-slate-300 dark:text-slate-800 uppercase tracking-[0.5em]">
          4EAB / ALL RIGHTS RESERVED
        </div>
      </footer>
    </main>
  );
}
