import { useEffect } from "react";

// Hook to synchronize typed state with localStorage
// Example usage:
// useLocalStorageSync<SkillNode>("nodes", nodes, setNodes);
export const useLocalStorageSync = <T>(
  key: string,
  value: T[],
  setValue: (value: T[]) => void
) => {
  useEffect(() => {
    const savedValue = localStorage.getItem(key);
    if (savedValue) {
      setValue(JSON.parse(savedValue));
    }
  }, []);

  useEffect(() => {
    if (Array.isArray(value) && value.length > 0) {
      localStorage.setItem(key, JSON.stringify(value));
    }
  }, [key, value, setValue]);
};
