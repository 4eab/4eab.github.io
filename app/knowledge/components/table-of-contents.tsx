"use client";

import React, { useEffect, useState } from "react";

export default function TableOfContents({
  headings,
}: {
  headings: { id: string; text: string; level: number }[];
}) {
  const [activeId, setActiveId] = useState<string>("");

  const handleClick = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -100;
      const y =
        element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        if (visibleEntries.length > 0) {
          setActiveId(visibleEntries[0].target.id);
        }
      },
      { rootMargin: "-10% 0% -70% 0%" },
    );

    headings.forEach((heading) => {
      const el = document.getElementById(heading.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [headings]);

  return (
    <section className="space-y-4">
      <div className="flex items-center gap-2 px-3">
        <div className="h-3 w-[2px] bg-blue-600 dark:bg-blue-500" />
        <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400">
          On This Page
        </h3>
      </div>

      <nav className="flex flex-col relative">

        <div className="absolute left-[13px] top-0 bottom-0 w-[1px] bg-slate-100 dark:bg-white/5" />

        {headings.map((heading) => (
          <a
            key={heading.id}
            href={`#${heading.id}`}
            onClick={handleClick(heading.id)}
            className={`
              group relative flex items-center py-2 px-6 text-xs transition-all duration-300
              ${heading.level === 3 ? "pl-10" : "pl-6"}
              ${
                activeId === heading.id
                  ? "text-blue-600 dark:text-blue-400 font-medium"
                  : "text-slate-500 hover:text-slate-900 dark:hover:text-slate-200"
              }
            `}
          >
            {/* 当前激活的小圆点指示器 */}
            {activeId === heading.id && (
              <div className="absolute left-[11px] w-[5px] h-[5px] rounded-full bg-blue-600 dark:bg-blue-400 z-10 shadow-[0_0_8px_rgba(37,99,235,0.6)]" />
            )}
            <span className="truncate">{heading.text}</span>
          </a>
        ))}
      </nav>
      <div className="relative group overflow-hidden p-5 rounded-2xl border border-slate-100 dark:border-white/[0.06] bg-white/50 dark:bg-slate-900/40 backdrop-blur-sm">
        <div className="absolute top-0 right-0 w-20 h-20 bg-blue-500/5 rounded-full -mr-10 -mt-10 blur-2xl" />

        <h4 className="text-xs font-medium text-slate-900 dark:text-slate-200 mb-2 flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
          </span>
          Status
        </h4>
        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
          Still under construction...
        </p>

        {/* <div className="mt-4 pt-4 border-t border-slate-100 dark:border-white/5 flex justify-between items-center text-[10px] font-mono text-slate-400">
          <span>LOG: v1.0.0</span>
          <span className="hover:text-blue-500 cursor-help">DETAILS</span>
        </div> */}
      </div>
    </section>
  );
}
