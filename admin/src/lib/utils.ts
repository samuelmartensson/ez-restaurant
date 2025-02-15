import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function containsOnlyLetters(str: string) {
  const regex = /^[a-zA-Z\d-]+$/;
  return regex.test(str);
}
