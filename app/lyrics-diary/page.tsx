"use client";

import { Languages } from "lucide-react";
import { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import { supabase } from "./lib/supabase";

export interface Lyric {
  id: string | number;
  created_at: string;
  lyric_text: string;
  song_name: string;
  artist_name: string;
  cover_url: string;
  raw_url: string;
}

async function fetchLyricsByMonth(year: number, month: number) {
  const startOfMonth = `${year}-${String(month).padStart(
    2,
    "0",
  )}-01T00:00:00.000Z`;
  const endOfMonth = `${year}-${String(month).padStart(
    2,
    "0",
  )}-31T23:59:59.999Z`;

  const { data, error } = await supabase
    .from("lyrics")
    .select("*")
    .gte("created_at", startOfMonth)
    .lte("created_at", endOfMonth)
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error.message);
    return [];
  }

  return data || [];
}

export default function HomePage() {
  const [earliestDate, setEarliestDate] = useState<Date | null>(null);

  const [currentYear, setCurrentYear] = useState(() => {
    if (typeof window !== "undefined") return new Date().getFullYear();
    return 2026;
  });

  const [currentMonth, setCurrentMonth] = useState(() => {
    if (typeof window !== "undefined") return new Date().getMonth() + 1;
    return 1;
  });

  const [selectedDate, setSelectedDate] = useState(() => {
    if (typeof window !== "undefined") {
      const today = new Date();
      const y = today.getFullYear();
      const m = String(today.getMonth() + 1).padStart(2, "0");
      const d = String(today.getDate()).padStart(2, "0");
      return `${y}-${m}-${d}`;
    }
    return "2026-01-01";
  });

  const [lyrics, setLyrics] = useState<Lyric[]>([]);
  const [selectedLyric, setSelectedLyric] = useState<Lyric | null>(null);

  useEffect(() => {
    async function fetchLyrics() {
      // Cache-first
      if (typeof window !== "undefined") {
        try {
          const cached = localStorage.getItem("lyrics_cache");
          const cachedEarliest = localStorage.getItem("lyrics_earliest_date");

          if (cached) {
            const parsed = JSON.parse(cached);
            if (
              parsed &&
              Array.isArray(parsed.data) &&
              parsed.data.length > 0
            ) {
              setLyrics(parsed.data);
              setSelectedLyric(parsed.data[0]);
            }
          }
          if (cachedEarliest) {
            setEarliestDate(new Date(cachedEarliest));
          }
        } catch (e) {
          console.error("Fetch Cache Error:", e);
        }
      }

      // Promise.all: parallelize the two requests
      const [latestResult, earliestResult] = await Promise.all([
        supabase
          .from("lyrics")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(31),

        supabase
          .from("lyrics")
          .select("created_at")
          .order("created_at", { ascending: true })
          .limit(1)
          .single(),
      ]);

      if (latestResult.error) {
        console.error(latestResult.error.message);
      } else if (latestResult.data) {
        setLyrics(latestResult.data);
        if (latestResult.data.length > 0)
          setSelectedLyric(latestResult.data[0]);

        if (typeof window !== "undefined") {
          localStorage.setItem(
            "lyrics_cache",
            JSON.stringify({ data: latestResult.data, timestamp: Date.now() }),
          );
        }
      }

      if (earliestResult.error) {
        console.error(earliestResult.error.message);
      } else if (earliestResult.data) {
        const eDate = new Date(earliestResult.data.created_at);
        setEarliestDate(eDate);

        if (typeof window !== "undefined") {
          localStorage.setItem(
            "lyrics_earliest_date",
            earliestResult.data.created_at,
          );
        }
      }
    }
    fetchLyrics();
  }, []);

  const lyricsByDate = useMemo(() => {
    const groups: { [key: string]: Lyric[] } = {};
    lyrics.forEach((item) => {
      // 从 created_at (如 2026-06-11T08:00:00) 截取出 YYYY-MM-DD
      const dateStr = item.created_at.split("T")[0];
      if (!groups[dateStr]) groups[dateStr] = [];
      groups[dateStr].push({ ...item, created_at: dateStr }); // 揉进一个 date 方便和之前逻辑对接
    });
    return groups;
  }, [lyrics]);

  const daysInMonthGrid = useMemo(() => {
    const totalDays = new Date(currentYear, currentMonth, 0).getDate();
    let startDayOfWeek = new Date(currentYear, currentMonth - 1, 1).getDay();
    if (startDayOfWeek === 0) startDayOfWeek = 7;

    const grid = [];
    for (let i = 1; i < startDayOfWeek; i++) {
      grid.push(null);
    }
    for (let day = 1; day <= totalDays; day++) {
      const dateString = `${currentYear}-${currentMonth
        .toString()
        .padStart(2, "0")}-${day.toString().padStart(2, "0")}`;
      grid.push({ day, dateString });
    }
    return grid;
  }, [currentYear, currentMonth]);

  const handleGoToToday = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1;
    const dateString = `${year}-${month.toString().padStart(2, "0")}-${today
      .getDate()
      .toString()
      .padStart(2, "0")}`;

    setCurrentYear(year);
    setCurrentMonth(month);
    setSelectedDate(dateString);
  };

  const handlePrevMonth = async () => {
    let nextMonth = currentMonth - 1;
    let nextYear = currentYear;

    if (nextMonth < 1) {
      nextMonth = 12;
      nextYear = currentYear - 1;
    }

    if (earliestDate) {
      const targetDate = new Date(nextYear, nextMonth - 1, 1);
      const limitDate = new Date(
        earliestDate.getFullYear(),
        earliestDate.getMonth(),
        1,
      );

      if (targetDate < limitDate) {
        return;
      }
    }

    setCurrentMonth(nextMonth);
    setCurrentYear(nextYear);

    const hasDataForMonth = lyrics.some((item) => {
      const d = new Date(item.created_at);
      return d.getFullYear() === nextYear && d.getMonth() + 1 === nextMonth;
    });

    if (!hasDataForMonth) {
      const monthlyData = await fetchLyricsByMonth(nextYear, nextMonth);

      if (monthlyData.length > 0) {
        setLyrics((prev) => {
          const rawCombined = [...prev, ...monthlyData];

          const uniqueMap = new Map();
          rawCombined.forEach((item) => {
            uniqueMap.set(item.id, item);
          });

          const cleanCombined = Array.from(uniqueMap.values());

          localStorage.setItem(
            "lyrics_cache",
            JSON.stringify({ data: cleanCombined, timestamp: Date.now() }),
          );

          return cleanCombined;
        });

        setSelectedLyric(monthlyData[0]);
      }
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 12) {
      setCurrentMonth(1);
      setCurrentYear((prev) => prev + 1);
    } else {
      setCurrentMonth((prev) => prev + 1);
    }
  };

  const [isArchiveOpen, setIsArchiveOpen] = useState(false);

  const [showTranslation, setShowTranslation] = useState(false);
  const [translatedText, setTranslatedText] = useState("");
  const [isTranslating, setIsTranslating] = useState(false);

  const handleTranslate = async (text: string) => {
    if (showTranslation) {
      setShowTranslation(false);
      return;
    }

    if (translatedText && !isTranslating) {
      setShowTranslation(true);
      return;
    }

    setIsTranslating(true);
    try {
      const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=zh-CN&dt=t&q=${encodeURIComponent(
        text,
      )}`;
      const res = await fetch(url);
      const json = await res.json();

      const translatedLines = json[0].map((line: string) => line[0]).join("");
      setTranslatedText(translatedLines);
      setShowTranslation(true);
    } catch (err) {
      console.error(err);
    } finally {
      setIsTranslating(false);
    }
  };

  const currentDayLyrics = lyricsByDate[selectedDate] || [];

  if (!selectedLyric)
    return (
      <div className="fixed inset-0 w-screen h-screen z-[9999] bg-neutral-950 overflow-hidden flex flex-col md:flex-row text-white font-sans antialiased selection:bg-rose-500/30"></div>
    );

  return (
    <div className="fixed inset-0 w-screen h-screen z-[9999] bg-neutral-950 overflow-hidden flex flex-col md:flex-row text-white font-sans antialiased selection:bg-rose-500/30">
      <main className="relative w-full h-screen flex flex-col">
        {/* Full Screen Backgroud */}
        <div className="absolute inset-0 z-0">
          {/* Dark Filter Layer */}
          <div className="absolute inset-0 bg-black/75 md:bg-black/70 z-10" />

          <div className="relative w-full h-full">
            <Image
              src={selectedLyric.cover_url}
              alt="Background"
              fill
              style={{ objectFit: "cover" }}
              className="blur-3xl scale-110 transition-all duration-1000"
              priority
            />
          </div>
        </div>

        {/* Nav Bar */}
        <header className="relative z-20 flex items-center justify-between px-6 py-6 md:px-16 md:py-8">
          <div className="text-base font-black tracking-widest text-neutral-300">
            LYRICS DIARY<span className="text-rose-500">.</span>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => handleTranslate(selectedLyric.lyric_text)}
              disabled={isTranslating}
              className={`px-4 py-2 rounded-full border flex items-center justify-center text-sm transition-all duration-300 active:scale-95
                ${
                  showTranslation
                    ? "bg-rose-500 border-rose-500 shadow-lg shadow-rose-500/20"
                    : "bg-white/5 border-white/10 hover:bg-white/10"
                }
              `}
              title="Toggle Translation"
            >
              {isTranslating ? (
                <span className="text-[10px] tracking-widest animate-pulse">
                  ⏳...
                </span>
              ) : (
                <Languages className="w-4 h-4" />
              )}
            </button>

            <button
              onClick={() => setIsArchiveOpen(true)}
              className="px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold tracking-wider transition"
            >
              📅 ARCHIVE
            </button>
          </div>
        </header>

        {/* Lyrics Content */}
        <div className="relative z-20 flex flex-col md:flex-row flex-1 min-h-0 px-6 pb-8 md:px-16 lg:px-32 md:pb-16 gap-8 md:gap-16 lg:gap-32 items-center">
          <a
            href={selectedLyric.raw_url}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative w-full aspect-square max-w-[280px] md:max-w-[400px] rounded-3xl overflow-hidden shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] border border-white/10 hover:border-white/20 transition-all duration-500 hover:scale-[1.03] shrink-0 block"
            title="OPEN IN APPLE MUSIC"
          >
            <Image
              src={selectedLyric.cover_url}
              alt={selectedLyric.song_name}
              fill
              style={{ objectFit: "cover" }}
              priority
            />

            {/* Hover Hint */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-2">
              <p className="text-xs font-bold tracking-widest text-white/90 bg-[#FF0436] px-4 py-2 rounded-full backdrop-blur-sm border border-white/10">
                OPEN IN APPLE MUSIC
              </p>
            </div>
          </a>

          <section className="flex-1 flex flex-col justify-between md:justify-center text-center md:text-left w-full h-full min-h-0">
            <div className="mb-4 md:mb-6">
              <h2 className="text-lg md:text-2xl font-black text-[#FF4E6B] truncate">
                {selectedLyric.song_name}
              </h2>
              <p className="text-xs md:text-sm text-neutral-400 font-medium mt-1 truncate">
                {selectedLyric.artist_name}
              </p>
            </div>

            <div className="overflow-y-auto max-h-[70%] scrollbar-none pr-2 transition-all duration-500">
              <h1
                className={`font-black tracking-tight leading-snug text-neutral-100 transition-all duration-500 whitespace-pre-line ${
                  showTranslation
                    ? "text-xl md:text-2xl lg:text-3xl opacity-50 mb-6"
                    : "text-2xl md:text-4xl lg:text-5xl"
                }`}
              >
                {selectedLyric.lyric_text}
              </h1>

              {showTranslation && translatedText && (
                <p className="text-2xl md:text-4xl lg:text-5xl font-black tracking-tight leading-snug text-white whitespace-pre-line border-t border-white/10 pt-6 animate-fade-in animate-duration-300">
                  {translatedText}
                </p>
              )}
            </div>

            <p className="text-xs md:text-sm font-bold tracking-widest text-[#FF4E6B] mt-6 md:mt-8 uppercase">
              {selectedLyric.created_at
                ? selectedLyric.created_at.split("T")[0].replace(/-/g, " . ")
                : " .  . "}
            </p>
          </section>
        </div>

        {/* Archive */}
        <div
          onClick={() => setIsArchiveOpen(false)}
          className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-500
          ${
            isArchiveOpen
              ? "opacity-100 pointer-events-auto"
              : "opacity-0 pointer-events-none"
          }
        `}
        />

        {/* Mobile: the panel slides out from the bottom; Desktop: from the right. */}
        <aside
          className={`fixed z-50 bg-neutral-900/95 backdrop-blur-2xl border-white/10 flex flex-col transition-all duration-500 ease-in-out
          bottom-0 left-0 right-0 h-[80vh] rounded-t-[32px] border-t px-6 py-6 md:p-8
          md:top-0 md:right-0 md:left-auto md:w-[420px] md:h-full md:rounded-none md:border-l md:border-t-0
          ${
            isArchiveOpen
              ? "translate-y-0 md:translate-x-0"
              : "translate-y-full md:translate-y-0 md:translate-x-full"
          }
        `}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-[10px] font-black tracking-widest text-neutral-500 uppercase">
                Archive Timeline
              </h3>
              <p className="text-lg font-black text-white">
                {currentYear} 年 {currentMonth} 月
              </p>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={handleGoToToday}
                className="h-7 px-2.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/5 text-[9px] font-black tracking-widest text-neutral-400 hover:text-rose-400 transition active:scale-95 uppercase"
              >
                Today
              </button>

              <div className="flex gap-0.5 bg-white/5 p-0.5 rounded-full border border-white/5">
                <button
                  disabled={
                    earliestDate
                      ? currentYear < earliestDate.getFullYear() ||
                        (currentYear === earliestDate.getFullYear() &&
                          currentMonth <= earliestDate.getMonth() + 1)
                      : false
                  }
                  onClick={handlePrevMonth}
                  className="w-7 h-7 rounded-full flex items-center justify-center text-xs text-neutral-400 transition disabled:opacity-15 disabled:cursor-not-allowed enabled:hover:bg-white/10 enabled:hover:text-white enabled:active:scale-90"
                >
                  ◀
                </button>

                <button
                  disabled={
                    currentYear > new Date().getFullYear() ||
                    (currentYear === new Date().getFullYear() &&
                      currentMonth >= new Date().getMonth() + 1)
                  }
                  onClick={handleNextMonth}
                  className="w-7 h-7 rounded-full flex items-center justify-center text-xs text-neutral-400 transition disabled:opacity-15 disabled:cursor-not-allowed enabled:hover:bg-white/10 enabled:hover:text-white enabled:active:scale-90"
                >
                  ▶
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-1.5 text-center text-[10px] font-bold text-neutral-600 mb-2">
            <span>一</span>
            <span>二</span>
            <span>三</span>
            <span>四</span>
            <span>五</span>
            <span>六</span>
            <span>日</span>
          </div>

          <div className="grid grid-cols-7 gap-1.5 bg-white/5 p-3 rounded-2xl border border-white/5 mb-6">
            {daysInMonthGrid.map((item, idx) => {
              if (!item) return <div key={`empty-${idx}`} />; // Blank placeholder

              const { day, dateString } = item;
              const hasLyrics = !!lyricsByDate[dateString];
              const isSelected = dateString === selectedDate;

              return (
                <button
                  key={dateString}
                  onClick={() => setSelectedDate(dateString)}
                  className={`aspect-square rounded-xl flex flex-col items-center justify-center text-xs font-bold transition-all relative
                ${
                  isSelected
                    ? "bg-rose-500 text-white shadow-md scale-105 z-10"
                    : hasLyrics
                    ? "bg-rose-500/20 text-rose-400 hover:bg-rose-500/30"
                    : "text-neutral-500 hover:bg-white/5"
                }
              `}
                >
                  {day}
                  {hasLyrics && !isSelected && (
                    <span className="absolute bottom-1 w-1 h-1 rounded-full bg-rose-400" />
                  )}
                </button>
              );
            })}
          </div>

          <div className="border-t border-white/10 pt-4">
            <p className="text-[10px] font-bold text-neutral-500 tracking-wider mb-2 uppercase">
              {selectedDate} 记录 ({currentDayLyrics.length})
            </p>
            <div className="space-y-2">
              {currentDayLyrics.length > 0 ? (
                currentDayLyrics.map((lyric) => (
                  <div
                    key={lyric.id}
                    onClick={() => {
                      setShowTranslation(false);
                      setTranslatedText("");
                      setSelectedLyric(lyric);
                    }}
                    className={`p-2 rounded-xl border flex items-center gap-3 cursor-pointer text-left ${
                      lyric.id === selectedLyric.id
                        ? "bg-white/10 border-white/10"
                        : "bg-transparent border-transparent"
                    }`}
                  >
                    <Image
                      src={lyric.cover_url.replace(
                        /\/\d+x\d+([^/]*)\.jpg$/,
                        `/100x100$1.jpg`,
                      )}
                      alt={lyric.song_name}
                      width={32}
                      height={32}
                      className="rounded-lg object-cover aspect-square"
                    />
                    <div className="min-w-0 flex-1">
                      <h4 className="text-xs font-bold truncate text-neutral-200">
                        {lyric.song_name}
                      </h4>
                      <p className="text-[10px] text-neutral-400 truncate">
                        {lyric.artist_name}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs italic text-neutral-600 py-4">无记录</p>
              )}
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
}
