"use client";

import { useState } from "react";
// @ts-expect-error: crypto-js has no types but it works
import CryptoJS from "crypto-js";
import MyPptComponent, { SlideData } from "./my-ppt";

const slides: SlideData[] = [
  {
    id: 1,
    title: "Hi, This is Protected",
    subtitle:
      'Please unlock directly using the exclusive link found in the resume (which includes a "key" parameter), or contact the author to obtain the key required to access the actual content.',
    type: "text",
    bullets: ["First", "Second", "Third"],
  },
  {
    id: 2,
    title: "Hi, This is Protected",
    subtitle:
      'Please unlock directly using the exclusive link found in the resume (which includes a "key" parameter), or contact the author to obtain the key required to access the actual content.',
    type: "timeline",
    bullets: [
      {
        date: "10/2024 - 10/2025",
        role: "M.A.",
        company: "Uni",
        detail: "GPA",
      },
      {
        date: "10/2023 - 10/2024",
        role: "B.A.",
        company: "Uni",
      },
    ],
  },
  {
    id: 3,
    title: "Hi, This is Protected",
    subtitle:
      'Please unlock directly using the exclusive link found in the resume (which includes a "key" parameter), or contact the author to obtain the key required to access the actual content.',
    type: "skills",
    bullets: [
      {
        name: "Skill 1 [👉 Link for display]",
        level: "Expert",
        link: "#",
      },
      {
        name: "Skill 2",
        level: "Intermediate",
      },
    ],
  },
  {
    id: 4,
    title: "Hi, This is Protected",
    subtitle:
      'Please unlock directly using the exclusive link found in the resume (which includes a "key" parameter), or contact the author to obtain the key required to access the actual content.',
    type: "project",
    bullets: [
      {
        name: "Keypoint 1",
        detail: "Detail for keypoint 1",
      },
      {
        name: "Keypoint 2",
        detail: "Detail for keypoint 2",
      },
    ],
  },
];

const ENCRYPTED_REAL_DATA = "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";

export default function ResumeClient() {
  const [currentSlides] = useState<SlideData[]>(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const urlKey = params.get('key');

      if (urlKey && ENCRYPTED_REAL_DATA) {
        const bytes = CryptoJS.AES.decrypt(
          ENCRYPTED_REAL_DATA,
          urlKey
        );

        const originalText = bytes.toString(CryptoJS.enc.Utf8);

        if (originalText) {
          return JSON.parse(originalText);
        }
      }
    } catch (e) {
      console.warn("Key Verfication Failed");
    }

    return slides;
  });

  return (
    <div className="w-full h-full">
      <MyPptComponent data={currentSlides} />
    </div>
  );
}