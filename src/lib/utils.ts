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

export const isEven = (num: number) => num % 2 === 0;

export const isEmail = (str: string) =>
  new RegExp(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g).test(str);
