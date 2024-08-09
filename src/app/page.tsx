import { DecodeText } from "@/components/Decode-Text";
import Image from "next/image";

export default function Home() {
  return (
    <main className="flex flex-col items-center">
      <Image className="mt-40" src="/logo.svg" width={500} height={200} alt="IDSwapp Logo" />
      <DecodeText className="mt-8" size={26}>DECENTRALIZED EMAIL ACCOUNTS</DecodeText>
    </main>
  );
}
