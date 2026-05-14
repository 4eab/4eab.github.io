import Link from "next/link";
import { getAllWritingPostsMeta } from "../knowledge/utils/post";
import WritingActivity from "./components/writing-activity";

export default async function WritingPage() {
  const allPostsData = await getAllWritingPostsMeta();

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <header className="mb-16 space-y-8">
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-black tracking-tighter">
              Fragmentierte Gedanken
            </h1>
            <p className="text-[10px] text-slate-400 uppercase tracking-[0.3em] mt-2">
              German Writing Archive
            </p>
          </div>
        
        </div>

        <WritingActivity posts={allPostsData} />
      </header>
      
      <div className="space-y-0 font-mono">
        {allPostsData.map((post) => (
          <Link
            key={post.id}
            href={`/thoughts/${post.id}`}
            className="group flex items-center gap-6 py-4 border-b border-slate-100 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-all px-2"
          >
            <span className="text-[11px] text-slate-400 tabular-nums w-20">
              {post.date}
            </span>

            <div className="flex-1 flex items-baseline gap-4">
              <h2 className="text-sm font-bold text-slate-700 dark:text-slate-200 group-hover:text-black dark:group-hover:text-white transition-colors">
                {post.title}
              </h2>
              {post.level && (
                <span className="text-[9px] px-1.5 py-0.5 bg-slate-100 dark:bg-white/10 text-slate-500 rounded-sm font-black italic uppercase">
                  {post.level}
                </span>
              )}
            </div>

            <div className="hidden md:flex gap-2">
              {post.tags?.slice(0, 2).map((tag: string) => (
                <span
                  key={tag}
                  className="text-[9px] text-slate-300 uppercase tracking-tighter"
                >
                  #{tag}
                </span>
              ))}
            </div>

            <span className="text-slate-200 dark:text-slate-800 group-hover:translate-x-1 transition-transform">
              →
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
