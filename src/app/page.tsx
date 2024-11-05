"use client";

import { HomeSections } from "@/components/home-sections";

export default function Home() {
  return (
    <>
      <HomeSections.Intro />
      <HomeSections.About />
      <HomeSections.Resources />
      <HomeSections.Generate />
    </>
  );
}
