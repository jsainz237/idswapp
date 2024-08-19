import { useState } from "react";
import { Check, Copy } from "lucide-react";

import { Button, ButtonProps } from "./ui/button";
import { useToast } from "./ui/use-toast";

interface Props extends ButtonProps {
  text: string;
}

export function CopyButton({ text, ...props }: Props) {
  const { toast } = useToast();
  const [copied, setCopied] = useState<boolean>(false);

  const copyText = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);

    toast({ description: "Copied address to clipboard" });
    setTimeout(() => setCopied(false), 1500);
  };

  const Icon = copied ? Check : Copy;

  return (
    <Button onClick={copyText} {...props}>
      <Icon className="size-4" />
    </Button>
  );
}
