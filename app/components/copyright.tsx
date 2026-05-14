export default function Copyright() {
  return (
    <div className="text-sm border-t border-zinc-200 pt-6 mt-10">
      <p className="font-semibold text-zinc-900 dark:text-zinc-100">
        © {new Date().getFullYear()} 4eab
      </p>
      <p className="mt-2 text-zinc-600 dark:text-zinc-400">
        This work is licensed under
        <a
          href="https://creativecommons.org/licenses/by-nc/4.0/"
          className="text-blue-500 hover:underline mx-1"
          target="_blank"
          rel="noopener noreferrer"
        >
          CC BY-NC 4.0
        </a>
        .
      </p>
      <p className="mt-1 text-zinc-500 italic">
        Please credit the original source when re-posting.
      </p>
    </div>
  );
}
