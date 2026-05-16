"use client";
import { useState, useEffect, useCallback } from "react";

interface BaseSlide {
  id: number;
  title: string;
  subtitle: string;
}

interface ProjectBullet {
  name: string;
  detail: string;
}

interface SkillBullet {
  name: string;
  level: string;
  link?: string;
}

interface TimelineBullet {
  date: string;
  role: string;
  company: string;
  detail?: string;
}

interface ProjectSlide extends BaseSlide {
  type: "project";
  bullets: ProjectBullet[];
}

interface SkillSlide extends BaseSlide {
  type: "skills";
  bullets: SkillBullet[];
}

interface TimelineSlide extends BaseSlide {
  type: "timeline";
  bullets: TimelineBullet[];
}

interface TextSlide extends BaseSlide {
  type: "text";
  bullets: string[];
}

export type SlideData = ProjectSlide | TextSlide | TimelineSlide | SkillSlide;

interface MyPptComponentProps {
  data: SlideData[];
}

export default function MyPptComponent({ data }: MyPptComponentProps) {
  const [currentSlide, setCurrentSlide] = useState<number>(0);

  const nextSlide = useCallback(() => {
    if (currentSlide < data.length - 1) {
      setCurrentSlide((prev) => prev + 1);
    }
  }, [currentSlide, data.length]);

  const prevSlide = useCallback(() => {
    if (currentSlide > 0) {
      setCurrentSlide((prev) => prev - 1);
    }
  }, [currentSlide]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " ") {
        e.preventDefault();
        nextSlide();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        prevSlide();
      }
    };

    // Mobile swipe support
    let touchStartX = 0;
    let touchEndX = 0;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartX = e.changedTouches[0].screenX;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      touchEndX = e.changedTouches[0].screenX;
      const swipeThreshold = 50;

      if (touchStartX - touchEndX > swipeThreshold) {
        nextSlide();
      } else if (touchEndX - touchStartX > swipeThreshold) {
        prevSlide();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("touchstart", handleTouchStart);
    window.addEventListener("touchend", handleTouchEnd);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [nextSlide, prevSlide]);

  const slide = data[currentSlide];

  return (
    <div className="relative flex-1 min-h-[calc(100vh-5rem)] w-screen flex flex-col justify-between overflow-hidden bg-slate-900 font-sans text-slate-50">
      <div className="fixed top-20 left-0 w-full h-1 z-50">
        <div
          className="h-full bg-gradient-to-r from-emerald-600 to-teal-500 dark:from-blue-400 dark:to-purple-400 transition-all duration-150"
          style={{ width: `${((currentSlide + 1) / data.length) * 100}%` }}
        />
      </div>

      <div className="flex flex-col flex-1 py-5 min-h-[calc(100vh-5rem)] items-center justify-center px-10 transition-colors duration-500 bg-slate-50 text-slate-800 dark:bg-slate-900 dark:text-slate-100">
        <div
          key={currentSlide}
          className="w-full max-w-3xl animate-[fadeIn_0.6s_ease-out_forwards]"
        >
          <h1 className="mb-5 py-2 px-1 -my-2 -mx-1 bg-clip-text text-5xl font-extrabold text-transparent md:text-6xl bg-gradient-to-r from-emerald-600 to-teal-500 dark:from-blue-400 dark:to-purple-400">
            {slide.title}
          </h1>

          <p className="mb-10 text-xl leading-relaxed text-slate-500 dark:text-slate-400 md:text-2xl">
            {slide.subtitle}
          </p>

          {slide.type === "text" && (
            <ul className="space-y-4">
              {slide.bullets.map((bullet, idx) => (
                <li
                  key={idx}
                  className="flex items-start text-lg leading-relaxed text-slate-600 dark:text-slate-300 md:text-xl"
                >
                  <span className="mr-3 font-bold text-emerald-500 dark:text-blue-400">
                    ▹
                  </span>
                  <span
                    dangerouslySetInnerHTML={{
                      __html: bullet.replace(
                        /\*\*(.*?)\*\*/g,
                        (_, p1) =>
                          `<strong class="font-semibold text-slate-900 dark:text-white">${p1}</strong>`,
                      ),
                    }}
                  />
                </li>
              ))}
            </ul>
          )}

          {slide.type === "skills" && (
            <div className="space-y-6">
              {slide.bullets.map((skill, idx) => {
                const linkUrl = skill.link;

                return (
                  <div key={idx} className="space-y-2 group">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-1">
                      <div className="text-base md:text-lg text-slate-700 dark:text-slate-300 leading-relaxed">
                        {linkUrl ? (
                          <a
                            href={linkUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="hover:text-emerald-600 dark:hover:text-blue-400 underline decoration-dotted underline-offset-4 cursor-pointer transition-colors"
                          >
                            <span
                              dangerouslySetInnerHTML={{
                                __html: skill.name.replace(
                                  /\*\*(.*?)\*\*/g,
                                  '<strong class="font-semibold text-slate-950 dark:text-white">$1</strong>',
                                ),
                              }}
                            />
                          </a>
                        ) : (
                          <span
                            dangerouslySetInnerHTML={{
                              __html: skill.name.replace(
                                /\*\*(.*?)\*\*/g,
                                '<strong class="font-semibold text-slate-950 dark:text-white">$1</strong>',
                              ),
                            }}
                          />
                        )}
                      </div>

                      <span className="text-xs font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 self-start md:self-auto">
                        {skill.level}
                      </span>
                    </div>

                    <div className="h-[2px] w-full bg-slate-200 dark:bg-slate-800 relative overflow-hidden">
                      <div className="absolute top-0 left-0 h-full w-24 bg-gradient-to-r from-emerald-500 to-transparent dark:from-blue-500 transform -translate-x-full group-hover:translate-x-[800px] transition-transform duration-1000 ease-out" />
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {slide.type === "timeline" && (
            <div className="relative border-l-2 ml-3 space-y-8 border-emerald-100 dark:border-slate-700">
              {slide.bullets.map((item, idx) => (
                <div key={idx} className="relative pl-6">
                  <div className="absolute -left-[7px] top-2 h-3 w-3 rounded-full border-2 border-emerald-500 bg-white dark:border-blue-400 dark:bg-slate-900" />
                  <span className="text-sm font-mono font-semibold text-emerald-600 dark:text-blue-400">
                    {item.date}
                  </span>
                  <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">
                    {item.role}{" "}
                    <span className="text-sm font-medium text-teal-600 dark:text-purple-400">
                      @ {item.company}
                    </span>
                  </h3>
                  <p className="text-base mt-1 text-slate-500 dark:text-slate-400">
                    {item.detail}
                  </p>
                </div>
              ))}
            </div>
          )}

          {slide.type === "project" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {slide.bullets.map((item, idx) => (
                <div
                  key={idx}
                  className="rounded-xl border p-5 transition-all duration-300 border-slate-200 bg-white shadow-sm hover:border-emerald-400/50 hover:shadow-md dark:border-slate-800 dark:bg-slate-900/50 dark:shadow-none dark:hover:border-blue-500/50"
                >
                  <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded text-emerald-600 bg-emerald-50 dark:text-purple-400 dark:bg-purple-950/40">
                    {item.name}
                  </span>
                  <p className="mt-3 text-base leading-relaxed text-slate-600 dark:text-slate-300">
                    {item.detail}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="absolute bottom-4 left-0 w-full text-center text-xs text-slate-400 pointer-events-none dark:text-slate-500">
        Use the keyboard arrow keys or the spacebar to turn pages.
      </div>
    </div>
  );
}

if (typeof document !== "undefined") {
  const styleSheet = document.createElement("style");
  styleSheet.innerText = `
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `;
  document.head.appendChild(styleSheet);
}
