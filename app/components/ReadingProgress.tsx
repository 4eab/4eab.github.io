"use client";
import { useEffect, useState } from 'react';

export default function ReadingProgress() {
  const [completion, setCompletion] = useState(0);

  useEffect(() => {
    const updateScroll = () => {
      const scrollProgress = window.scrollY;
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollHeight) {
        setCompletion(Number((scrollProgress / scrollHeight).toFixed(2)) * 100);
      }
    };
    window.addEventListener('scroll', updateScroll);
    return () => window.removeEventListener('scroll', updateScroll);
  }, []);

  return (
    <div className="fixed top-20 left-0 w-full h-1 z-50">
      <div 
        className="h-full bg-slate-600 dark:bg-slate-100 transition-all duration-150" 
        style={{ width: `${completion}%` }} 
      />
    </div>
  );
}