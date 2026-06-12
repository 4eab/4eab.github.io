import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import Navbar from "./components/navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "4eab",
  description:
    "Logs from the present, capturing the past, left for the future.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased bg-white dark:bg-[#050505]`}
      suppressHydrationWarning
    >
      <body className="h-full flex flex-col">
        <Providers>
          <Navbar />
          <div className="pt-20 flex-1 text-slate-900 dark:text-slate-100 transition-colors duration-500 font-sans tracking-tight">
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}
