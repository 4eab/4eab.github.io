"use client";

import dynamic from 'next/dynamic';

const ResumeClient = dynamic(
  () => import('../components/resume-client'),
  {
    ssr: false,
  }
);

export default function Page() {
  return <ResumeClient />;
}