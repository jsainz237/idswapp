import { type ClassValue, clsx } from "clsx";
import { BigNumberish, formatEther } from "ethers";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatAddress(address: string) {
  return `${address.slice(0, 4)}...${address.slice(-4)}`;
}

export function formatPrice(price: BigNumberish) {
  return parseFloat(formatEther(price)).toFixed(5);
}
