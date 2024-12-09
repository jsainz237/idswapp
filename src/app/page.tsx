"use client";

import { HomeSections } from "@/components/home-sections";
import { TermsOfServiceWarning } from "@/components/Terms-Warning";

export default function Home() {
  return (
    <>
      <TermsOfServiceWarning />
      <HomeSections.Intro />
      <HomeSections.About />
      <HomeSections.Resources />
      <HomeSections.Generate />
    </>
  );
}
