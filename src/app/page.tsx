"use client";

import { HomeSections } from "@/components/home-sections";

export default function Home() {
  return (
    <main>
      <HomeSections.Intro />
      <HomeSections.About />
      <HomeSections.Resources />
    </main>
  );
}
