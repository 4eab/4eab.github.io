import SearchBar from "./components/search-bar";
import { getCategories } from "./utils/post";
import Link from "next/link";

export default async function KnowledgeHub() {
  const categories = getCategories();

  return (
    <div className="max-w-4xl mx-auto py-10 px-6">
      <h1 className="text-4xl font-medium tracking-tighter mb-4">My Continuous Learning Lab</h1>

      {/* <SearchBar /> */}

      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {categories.map((category) => (
          <Link 
            key={category}
            href={`/knowledge/${category}`}
            className="group p-6 border border-black/5 dark:border-white/5 bg-gray-50/50 dark:bg-zinc-900/50 hover:bg-white dark:hover:bg-zinc-800 transition-all duration-300"
          >
            <div className="flex justify-between items-start">
              <h2 className="text-lg font-medium uppercase tracking-widest">
                {category}
              </h2>
              <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
            </div>
          </Link>
        ))}
      </section>
    </div>
  );
}