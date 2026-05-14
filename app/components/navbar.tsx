import Link from "next/link";
import ThemeToggle from "./theme-toggle";


export default function Navbar() {
  const navLinks = [
    { id: '01', name: 'Knowledge', href: '/knowledge' },
    { id: '02', name: 'Thoughts', href: '/thoughts' },
    { id: '03', name: 'About', href: '/about' },
  ];
  return (
    <><div className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-6 px-6 py-3 bg-white/80 dark:bg-black/80 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-full shadow-lg z-50">
  {navLinks.map(link => (
    <Link key={link.id} href={link.href} className="w-20 border-l pl-2 text-[10px] font-mono font-bold uppercase tracking-widest text-slate-500">
      {link.name}
    </Link>
  ))}
</div>
<nav className="fixed top-0 z-40 w-full bg-white/90 dark:bg-[#0c0c0c]/70 backdrop-blur-2xl">
  <div className="absolute bottom-0 w-full h-[1px] bg-gradient-to-r from-transparent via-slate-200/50 dark:via-white/5 to-transparent" />
  
  <div className="absolute inset-0 z-[-1] shadow-[0_1px_10px_rgba(0,0,0,0.02)] dark:shadow-[0_1px_20px_rgba(0,0,0,0.5)]" />      
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <div className="flex items-center">
          <Link
            href="/"
            className="text-sm font-black tracking-[0.3em] text-black dark:text-white hover:opacity-50 transition-opacity"
          >
            4eab
          </Link>
        </div>

        <div className="flex items-center gap-10">
          <div className="hidden md:flex items-center gap-10 text-[11px] font-mono uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
            <Link 
              href={`/knowledge`}
              className="group flex items-center gap-2 hover:text-black dark:hover:text-white transition-colors"
            >
              <span className="text-[9px] opacity-50 group-hover:opacity-100">01</span>
              <span>Knowledge</span>
            </Link>
            <Link
              href={`/thoughts`}
              className="group flex items-center gap-2 hover:text-black dark:hover:text-white transition-colors"
            >
              <span className="text-[9px] opacity-50 group-hover:opacity-100">02</span>
              <span>Thoughts</span>
            </Link>
            <a
              href="https://github.com/4eab"
              className="group flex items-center gap-2 hover:text-black dark:hover:text-white transition-colors"
            >
              <span className="text-[9px] opacity-50 group-hover:opacity-100">03</span>
              <span>Projects</span>
            </a>
            <Link
              href="/about"
              className="group flex items-center gap-2 hover:text-black dark:hover:text-white transition-colors"
            >
              <span className="text-[9px] opacity-50 group-hover:opacity-100">04</span>
              <span>About</span>
            </Link>
          </div>

          <div className="h-3 w-[1px] bg-slate-200 dark:bg-white/10 hidden md:block" />
          
          <div className="flex items-center group">
            <ThemeToggle />
          </div>
        </div>
      </div>

    </nav>
    </>
  );
}

