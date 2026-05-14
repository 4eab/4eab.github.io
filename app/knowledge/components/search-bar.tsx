"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/knowledge/search?q=${encodeURIComponent(query)}`);
  };

  return (
    <form onSubmit={handleSearch} className="relative w-full max-w-md mb-12">
      <input
        type="text"
        placeholder="Knowledge Search..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full px-4 py-2 bg-transparent border-b border-black/20 dark:border-white/20 focus:border-black dark:focus:border-white outline-none transition-all"
      />
      <button type="submit" className="absolute right-2 top-2 opacity-50 hover:opacity-100">
        ↵
      </button>
    </form>
  );
}