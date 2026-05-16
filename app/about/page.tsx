import Link from "next/link";

export default function About() {
  return (
    <main className="max-w-4xl mx-auto px-8 py-20">
      <header className="relative space-y-8">
        <div className="space-y-2">
          <h1 className="text-sm font-mono tracking-[0.3em] text-slate-400 dark:text-slate-600 uppercase">
            Subject Profile
          </h1>
          <div className="flex flex-col space-y-1">
            <h2 className="text-4xl md:text-5xl font-black tracking-tight">
              <Link href="/about/cv" className="hover:text-emerald-600 hover:dark:text-blue-400">
              关于我
            </Link>
            </h2>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight opacity-20">
              About Me
            </h2>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight opacity-10 font-light italic">
              Über mich
            </h2>
          </div>
        </div>
      </header>

      <div className="mt-20 grid grid-cols-1 md:grid-cols-12 gap-y-12 md:gap-x-12 border-t border-slate-100 dark:border-white/5 pt-12">
        <div className="md:col-span-4 space-y-8">
          <section className="space-y-4">
            <h3 className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-400">
              MBTI
            </h3>
            <ul className="space-y-2 text-sm text-slate-500">
              <li className="flex gap-2">INTP</li>
            </ul>
          </section>
          <section className="space-y-4">
            <h3 className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-400">
              Language Stack
            </h3>
            <div className="space-y-3 font-mono text-xs">
              <div className="flex justify-between items-bottom border-b border-slate-100 dark:border-white/5 pb-1">
                <a
                  href="https://en.wikipedia.org/wiki/Hokkien"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-500"
                >
                  HOKKIEN
                  <p
                    className="text-[7px] text-black dark:text-white font-medium"
                    style={{
                      fontFamily: 'Inter, "Lucida Sans Unicode", monospace',
                    }}
                  >
                    Ē-mn̂g Tâng-oaⁿ khiuⁿ
                  </p>
                </a>
                <span className="text-black dark:text-white uppercase">
                  Native
                  <p
                    className="text-[7px] text-slate-500 font-medium"
                    style={{
                      fontFamily: 'Inter, "Lucida Sans Unicode", monospace',
                    }}
                  >
                    Heritage
                  </p>
                </span>
              </div>

              <div className="flex justify-between items-center border-b border-slate-100 dark:border-white/5 pb-1">
                <span className="text-slate-500">Mandarin</span>
                <span className="text-black dark:text-white uppercase">
                  Native
                </span>
              </div>
              <div className="flex justify-between items-center border-b border-slate-100 dark:border-white/5 pb-1">
                <span className="text-slate-500">English</span>
                <span className="text-black dark:text-white uppercase">
                  Professional
                </span>
              </div>
              <div className="flex justify-between items-center border-b border-slate-100 dark:border-white/5 pb-1">
                <span className="text-slate-500">Deutsch</span>
                <span className="text-black dark:text-white uppercase">
                  Verhandlungssicher
                </span>
              </div>
            </div>
          </section>
          {/* <section className="space-y-4">
            <h3 className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-400">
              Location
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 font-mono italic">
              Karlsruhe, BW, DE
            </p>
          </section> */}
        </div>

        <div className="md:col-span-8 space-y-10">
          <article className="md:col-span-8 space-y-12 font-mono">
            <div className="space-y-6">
              <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400">
                Evolution
              </h3>

              <div className="relative pl-4">
                {/* Root */}
                <div className="relative pb-10 pl-6 border-l border-slate-200 dark:border-white/10">
                  <div className="absolute left-[-4.5px] top-0 w-2 h-2 border border-black dark:border-white bg-white dark:bg-slate-950 rotate-45" />
                  <p className="text-sm font-bold text-black dark:text-white uppercase tracking-tight">
                    Origin: Literary Studies
                  </p>
                </div>

                {/* The Nested Paths */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-12 relative border-l border-slate-200 dark:border-white/10 pl-6 pb-12">
                  {/* Path Alpha: Deepening of Medium */}
                  <div className="space-y-6">
                    <span className="text-[9px] text-slate-400 uppercase tracking-widest border-b border-slate-100 dark:border-white/5 pb-1 block">
                      α. Medium as Carrier
                    </span>
                    <div className="space-y-4 text-[12px] leading-tight">
                      {/* <div className="text-slate-500">Narratology as research</div> */}
                      <div className="pl-4 border-l border-slate-100 dark:border-white/5 space-y-4">
                        <div className="text-slate-700 dark:text-slate-300 italic">
                          ↳ Game Development: Evolving storytelling into
                          Experience
                        </div>
                        <div className="pl-4 border-l border-slate-100 dark:border-white/5">
                          <div className="text-black dark:text-white font-bold tracking-tighter">
                            ↳ Meta-tooling: Building the engine
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Path Beta: Deepening of Logic */}
                  <div className="space-y-6">
                    <span className="text-[9px] text-slate-400 uppercase tracking-widest border-b border-slate-100 dark:border-white/5 pb-1 block">
                      β. Language as Code
                    </span>
                    <div className="space-y-4 text-[12px] leading-tight">
                      <div className="pl-4 border-l border-slate-100 dark:border-white/5 space-y-4">
                        <div className="text-slate-700 dark:text-slate-300 italic">
                          ↳ Logic & Philosophy: Diving into formal structures
                        </div>

                        <div className="pl-4 border-l border-slate-200 dark:border-white/10">
                          <div className="text-black dark:text-white p-2 bg-slate-50 dark:bg-white/5 rounded-sm">
                            <p className="text-black dark:text-white font-bold tracking-tighter">
                              ↳ Discovering the{" "}
                              <span className="underline decoration-slate-300">
                                aesthetic rigor
                              </span>
                            </p>
                            <p className="text-[9px] text-slate-400 uppercase font-bold tracking-tighter">
                              &quot;|ℕ| = |ℕ \ &#123;1&#125;| ?&quot;
                              <br />
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Convergence */}
                <div className="relative pb-10 pl-6 border-l border-slate-200 dark:border-white/10">

                  <div className="absolute animate-ping left-[-4.5px] top-0 w-2 h-2 bg-black dark:bg-white rotate-45 group-hover:scale-125 transition-transform duration-500" />
                  <div className="absolute left-[-4.5px] top-0 w-2 h-2 bg-black dark:bg-white rotate-45 group-hover:scale-125 transition-transform duration-500" />

                  <div className="space-y-1">
                    <p className="text-sm font-bold text-black dark:text-white uppercase tracking-widest">
                      Convergence: Computer Science
                    </p>
                  </div>

                </div>
              </div>
            </div>
          </article>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {["feminist", "Video_GAME", "Music", "SWIMMING"].map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 text-[10px] font-mono border border-slate-100 dark:border-white/10 text-slate-400 uppercase tracking-tighter hover:border-black dark:hover:border-white hover:text-black dark:hover:text-white transition-colors cursor-default"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      <section className="mt-32 grid grid-cols-1 md:grid-cols-2 gap-16 border-t border-slate-100 dark:border-white/5 pt-16">
        <div className="space-y-4 text-sm leading-relaxed">
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-300 dark:text-slate-700 font-mono">
            Current Status
          </h3>
          <div className="font-mono">
    <p className="text-sm font-bold text-black dark:text-white">
      B.Sc. Informatik, 4. Semester
    </p>
    <p className="text-[11px] text-slate-500">
      Karlsruher Institut für Technologie (KIT)
    </p>
  </div>
        </div>
        <div className="space-y-4 text-sm leading-relaxed text-right md:text-left">
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-300 dark:text-slate-700 font-mono">
            Last Updated
          </h3>
          <p className="text-slate-400 font-mono tracking-tighter">
            2026.05.13
          </p>
        </div>
      </section>


      <footer className="mt-20">
        <div className="text-[10px] font-mono text-slate-300 dark:text-slate-800 uppercase tracking-[0.5em]">
          4EAB / PERSONAL INDEX
        </div>
      </footer>
    </main>
  );
}
