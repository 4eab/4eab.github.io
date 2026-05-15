import fs from "fs";
import path from "path";
import { MDXRemote, MDXRemoteProps } from "next-mdx-remote/rsc";
import rehypeSlug from "rehype-slug";
import rehypePrettyCode from "rehype-pretty-code";
import { notFound } from "next/navigation";
import TableOfContents from "../../components/table-of-contents";
import { fromMarkdown } from "mdast-util-from-markdown";
import { toString } from "mdast-util-to-string";
import Slugger from "github-slugger";
import AnyTrapDemo from "../components/any-trap-demo";
import matter from "gray-matter";
import Link from "next/link";
import Copyright from "@/app/components/copyright";
import GoChannelTrapDemo from "../components/go-channel-trap-demo";

const components = {
  AnyTrapDemo,
  GoChannelTrapDemo,
};

export async function generateStaticParams() {
  const postsDirectory = path.join(process.cwd(), 'content/knowledge')

  const categories = fs.readdirSync(postsDirectory)

  const paths = categories.flatMap((category) => {
    const categoryPath = path.join(postsDirectory, category)
    
    const files = fs.readdirSync(categoryPath)
    
    return files.map((filename) => ({
      category: category,
      slug: filename.replace('.md', ''), 
    }))
  })

  return paths
}

export function getTableOfContents(content: string) {
  const tree = fromMarkdown(content);
  const slugger = new Slugger();
  const toc: { id: string; text: string; level: number }[] = [];

  tree.children.forEach((node) => {
    if (node.type === "heading" && [1].includes(node.depth)) {
      const text = toString(node);
      const id = slugger.slug(text);

      toc.push({
        id,
        text,
        level: node.depth,
      });
    }
  });

  return toc;
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string ; category: string}>;
}) {
  const { slug, category } = await params;

  const filePath = path.join(process.cwd(), `content/knowledge/${category}`, `${slug}.md`);

  if (!fs.existsSync(filePath)) {
    notFound();
  }

  const rawFileContent = fs.readFileSync(filePath, "utf8");

  const { data: frontmatter, content } = matter(rawFileContent);

  const headings = getTableOfContents(content);
  const options: MDXRemoteProps["options"] = {
    mdxOptions: {
      rehypePlugins: [
        rehypeSlug,
        [
          rehypePrettyCode,
          {
            theme: {
              dark: "tokyo-night",
              light: "github-light",
            },
            keepBackground: true,
            defaultLang: "plaintext",
          },
        ],
      ],
    },
  };

  return (
    <main>
      <div className="hidden md:block fixed left-0 top-0 -z-10 h-full w-[400px] bg-blue-500/5 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 py-10 lg:py-16">
        <div className="flex flex-col lg:flex-row gap-16">
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-28">
              <TableOfContents headings={headings} />
            </div>
          </aside>

          <main className="flex-1 min-w-0">
            <div className="flex items-center gap-4 mb-8 text-[11px] font-mono text-slate-400">
              <Link href={"/knowledge"}>KNOWLEDGE</Link> /{" "}
              <Link href={`/knowledge/${category}`} className="text-slate-900 dark:text-slate-100 font-bold">
                {category.toUpperCase()}
              </Link>
            </div>

            <article className="prose prose-slate dark:prose-invert max-w-none fade-in duration-500">
              <header className="mb-10 not-prose">
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 dark:text-white mb-4">
                  {slug.replace(/-/g, " ").toUpperCase()}
                </h1>
                <div className="flex items-center gap-3 text-sm text-slate-500 font-mono">
                  <time>{frontmatter.date}</time>

                  {frontmatter.tags?.map((tag: string) => (
                    <span
                      key={tag}
                      className="
                        px-2 py-1 
                        text-[10px] uppercase tracking-widest
                        border border-black/10 dark:border-white/20 
                        hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black
                        transition-colors duration-200
                        rounded-sm
                      "
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </header>

              <MDXRemote
                source={content}
                options={options}
                components={components}
              />
            </article>
            <Copyright />
          </main>
        </div>
      </div>
    </main>
  );
}
