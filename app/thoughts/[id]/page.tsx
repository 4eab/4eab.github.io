import fs from "fs";
import path from "path";
import Link from "next/link";
import { notFound } from "next/navigation";
import matter from "gray-matter";
import { MDXRemote } from "next-mdx-remote/rsc";
import ReadingProgress from "@/app/components/ReadingProgress";
import Copyright from "@/app/components/copyright";

export async function generateStaticParams() {
  const postsDirectory = path.join(process.cwd(), "content/writing");

  const files = fs.readdirSync(postsDirectory);

  return files.map((filename) => ({
    id: filename.replace(".md", ""),
  }));
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const filePath = path.join(process.cwd(), `content/writing`, `${id}.md`);

  if (!fs.existsSync(filePath)) {
    notFound();
  }

  const rawFileContent = fs.readFileSync(filePath, "utf8");

  const { data: frontmatter, content } = matter(rawFileContent);

  const post = {
    title: frontmatter.title,
    date: frontmatter.date,
    tags: frontmatter.tags || [],
  };

  return (
    <main className="min-h-screen py-12 px-6 font-mono">
      <ReadingProgress />
      <div className="max-w-2xl mx-auto">
        <Link
          href="/thoughts"
          className="text-slate-400 hover:text-black dark:hover:text-white text-xs mb-12 inline-block"
        >
          &lt; BACK_TO_COLLECTION
        </Link>

        <div className="relative bg-[#f4f4f2] dark:bg-[#121212] p-8 md:p-12 shadow-[0_10px_30px_rgba(0,0,0,0.05)] dark:shadow-none border border-slate-200 dark:border-white/5">
          <div className="flex justify-between items-center border-b border-dashed border-slate-400 dark:border-white/10 pb-4 mb-8 text-[10px] text-slate-400">
            <div>{post.date}</div>
            <div className="flex gap-4 mt-2">
              {post.tags?.map((tag: string) => (
                <span
                  key={tag}
                  className="text-[9px] font-mono text-slate-400 uppercase tracking-widest border border-slate-100 dark:border-white/5 px-2 py-1"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          <header className="mb-10">
            <h1 className="text-xl font-bold text-black dark:text-white decoration-1 decoration-slate-300">
              {post.title}
            </h1>
          </header>

          {/* Decoration: Holes along the paper's edge*/}
          <div
            className="absolute right-2 top-0 bottom-0 w-1.5 opacity-10"
            style={{
              backgroundImage: `radial-gradient(circle, currentColor 2px, transparent 2px)`,
              backgroundSize: "100% 32px",
              backgroundRepeat: "y",
            }}
          />

          <article
            className="
            relative
            text-[14px] leading-[1.8] text-slate-800 dark:text-slate-300
            whitespace-pre-wrap /* 保持 Markdown 的换行习惯 */
          "
          >
            <article
              className="
                  font-mono text-[14px] leading-[1.8] text-slate-800 dark:text-slate-300
                  
                  [&_blockquote]:border-l-2 [&_blockquote]:border-slate-300 [&_blockquote]:pl-4 [&_blockquote]:my-6 [&_blockquote]:italic
                  
                  [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:my-4
                  [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:my-4
                  
                  [&_h1]:text-lg [&_h1]:font-bold [&_h1]:mt-8 [&_h1]:mb-4 [&_h1]:underline
                  [&_h2]:text-base [&_h2]:font-bold [&_h2]:mt-6 [&_h2]:mb-3

                  /* 物理撕裂感分割线 */
                  [&_hr]:my-16 
                  [&_hr]:border-t-2 [&_hr]:border-dashed [&_hr]:border-slate-200 dark:[&_hr]:border-white/10
                  [&_hr]:overflow-visible
                  "
            >
              <MDXRemote source={content} />
              {/* Simulating a typing cursor */}
              ...
              <span className="inline-block w-2 h-4 bg-emerald-500 ml-1 animate-pulse align-middle" />
            </article>
          </article>
        </div>

        <Copyright />
      </div>
    </main>
  );
}
