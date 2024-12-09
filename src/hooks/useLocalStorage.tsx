import { Dispatch, SetStateAction, useEffect, useState } from "react";

type SetValue<T> = Dispatch<SetStateAction<T>>;

export function useLocalStorage<T>(
  key: string,
  fallbackValue: T,
): [T | undefined, SetValue<T | undefined>] {
  const [value, setValue] = useState<T | undefined>(undefined);
  useEffect(() => {
    const stored = localStorage.getItem(key);
    if (!stored) {
      return;
    }
    setValue(stored ? JSON.parse(stored) : fallbackValue);
  }, [fallbackValue, key]);

  useEffect(() => {
    if (!value) {
      return;
    }
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
}
