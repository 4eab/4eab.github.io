"use client";

import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme();

  const toggle = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  return (
    <button
      onClick={toggle}
      className="relative group p-2 rounded-full hover:bg-slate-100 dark:hover:bg-white/5 transition-all duration-300"
      aria-label="toggle theme"
    >
      <div className="absolute inset-0 rounded-full bg-blue-500/10 blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
      <Sun className="hidden dark:block w-5 h-5 text-slate-400 group-hover:text-yellow-400 transition-colors relative z-10" />
      <Moon className="block dark:hidden w-5 h-5 text-slate-500 group-hover:text-indigo-600 transition-colors relative z-10" />
    </button>
  );
}
