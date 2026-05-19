"use client";

import { useTheme } from "next-themes";
import { ActivityCalendar } from "react-activity-calendar";

export default function GermanWritingCalendar({
  posts,
}: {
  posts: {
    id: string;
    date: string;
  }[];
}) {
  const data = posts.map((post) => ({
    date: post.date,
    count: 1,
    level: 1,
  }));

  const { resolvedTheme } = useTheme();

  return (
    <div className="p-4 border border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/[0.02] font-mono">
      <div className="flex justify-between items-center mb-6">
        <span className="text-[9px] uppercase tracking-[0.2em] text-slate-400 font-bold">
          Writing_Activity
        </span>
        <div className="flex gap-2">
          <span className="w-2 h-2 bg-slate-100 dark:bg-white/5"></span>
          <span className="w-2 h-2 bg-slate-400"></span>
          <span className="w-2 h-2 bg-black dark:bg-white"></span>
        </div>
      </div>

      <ActivityCalendar
        data={data}
        colorScheme={resolvedTheme === "dark" ? "dark" : "light"}
        theme={{
          light: ["#f1f5f9", "#cbd5e1", "#94a3b8", "#475569", "#0f172a"],
          dark: ["#ffffff05", "#1e293b", "#334155", "#94a3b8", "#f8fafc"],
        }}
        fontSize={10}
        blockSize={10}
        blockMargin={4}
        blockRadius={0}
        showMonthLabels={true}
        showColorLegend={true}
      />
    </div>
  );
}
