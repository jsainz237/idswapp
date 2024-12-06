import Image from "next/image";
import Link from "next/link";

import config from "@/../config";

const LOGO_HEIGHT = 16;

const calculateLogoWidth = (height: number) => {
  const ORIGINAL_ASPECT_RATIO = 173 / 128.09;
  return height * ORIGINAL_ASPECT_RATIO;
};

export function Footer() {
  return (
    <div className="flex items-center justify-between border-t border-border px-4 py-6 sm:px-8">
      <p className="type-p font-mono text-xs text-muted-foreground">
        Built by{" "}
        <Link href={config.NEXT_PUBLIC_PORTFOLIO_URL!} target="_blank">
          <span className="font-bold underline">yours truly</span>
        </Link>
      </p>
      <Link href={config.NEXT_PUBLIC_PORTFOLIO_URL!} target="_blank">
        <Image
          src="/js-logo.svg"
          alt="JSAINZ"
          height={LOGO_HEIGHT}
          width={calculateLogoWidth(LOGO_HEIGHT)}
        />
      </Link>
    </div>
  );
}
