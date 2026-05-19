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

const ENCRYPTED_REAL_DATA =
  "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";

export default function ResumeClient() {
  const [currentSlides] = useState<SlideData[]>(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      let urlKey = params.get("key");

      const STORAGE_KEY = "my_secret_url_key";

      if (urlKey) {
        sessionStorage.setItem(STORAGE_KEY, urlKey);
      } else {
        urlKey = sessionStorage.getItem(STORAGE_KEY);
      }

      if (urlKey && ENCRYPTED_REAL_DATA) {
        const bytes = CryptoJS.AES.decrypt(ENCRYPTED_REAL_DATA, urlKey);
        const originalText = bytes.toString(CryptoJS.enc.Utf8);

        if (originalText) {
          return JSON.parse(originalText);
        }
      }
    } catch (e) {
      console.warn("Key Verification Failed", e);
    }

    return slides;
  });
  return (
    <div className="w-full h-full">
      <MyPptComponent data={currentSlides} />
    </div>
  );
}
