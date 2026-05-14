import fs from "fs";
import path from "path";
import { getAllKnowledgePostsMeta } from "../utils/post";
import Link from "next/link";

export async function generateStaticParams() {
  const postsDirectory = path.join(process.cwd(), 'content/knowledge')

  const categories = fs.readdirSync(postsDirectory)

  const paths = categories.flatMap((category) => {
    const categoryPath = path.join(postsDirectory, category)
    
    const files = fs.readdirSync(categoryPath)
    
    return files.map(() => ({
      category: category,
    }))
  })

  return paths
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const allPostsData = await getAllKnowledgePostsMeta(category);

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">{category}</h1>
      
      <div className="flex flex-col gap-4">
        {allPostsData.map((post) => (
          <div key={post.id} className="border-b pb-4">
            <Link 
              href={`/knowledge/${category}/${post.id}`}
              className="text-xl hover:text-blue-500 transition-colors"
            >
              {post.title}
            </Link>
            
            <div className="flex gap-2 mt-2">
              {post.tags?.map((tag: string) => (
                <span 
                  key={tag}
                  className="px-2 py-0.5 border text-[10px] uppercase tracking-widest opacity-60"
                >
                  {tag}
                </span>
              ))}
                {post.level && (
                  <span 
                    className="px-2 py-0.5 border text-[10px] uppercase tracking-widest opacity-60"
                  >
                    {post.level}
                  </span>
                )}
              <span className="text-xs opacity-40 ml-auto">{post.date}</span>
            </div>
            
          </div>
        ))}
      </div>
    </div>
  );
}