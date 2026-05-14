import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const knowledgeDir = path.join(process.cwd(), 'content/knowledge');


export function getCategories() {
  const directories = fs.readdirSync(knowledgeDir, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);
  
  return directories;
}

function getAllPostsMeta(filePath: string) {
  if (!fs.existsSync(filePath)) return [];
  const fileNames = fs.readdirSync(filePath);
  
  const allPostsData = fileNames.map((fileName) => {
    const id = fileName.replace(/\.md$/, '');

    const fullPath = path.join(filePath, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');

    const { data } = matter(fileContents);

    return {
      id,
      title: data.title,
      date: data.date,
      tags: data.tags,
      level: data.level,
      ...data,
    };
  });

  return allPostsData.sort((a, b) => (a.date < b.date ? 1 : -1));

}

export async function getAllKnowledgePostsMeta(category: string) {
  const categoryDir = path.join(process.cwd(), "content/knowledge", category);
  
  return getAllPostsMeta(categoryDir);
}


export async function getAllWritingPostsMeta() {
  const dir = path.join(process.cwd(), "content/writing");
  
  return getAllPostsMeta(dir);
}