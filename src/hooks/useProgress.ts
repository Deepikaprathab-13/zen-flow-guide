import { useState, useEffect } from "react";
import { UserProgress } from "@/data/types";

export function useProgress() {
  const [progress, setProgress] = useState<UserProgress[]>(() => {
    const stored = localStorage.getItem("yoga-progress");
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem("yoga-progress", JSON.stringify(progress));
  }, [progress]);

  const markComplete = (poseId: string) => {
    const today = new Date().toISOString().split("T")[0];
    setProgress((prev) => {
      const existing = prev.find((p) => p.date === today);
      if (existing) {
        if (existing.posesCompleted.includes(poseId)) return prev;
        return prev.map((p) =>
          p.date === today
            ? { ...p, posesCompleted: [...p.posesCompleted, poseId] }
            : p
        );
      }
      return [...prev, { date: today, posesCompleted: [poseId] }];
    });
  };

  const getStreak = (): number => {
    if (progress.length === 0) return 0;
    const sorted = [...progress].sort((a, b) => b.date.localeCompare(a.date));
    let streak = 0;
    const today = new Date();

    for (let i = 0; i < 365; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(checkDate.getDate() - i);
      const dateStr = checkDate.toISOString().split("T")[0];
      if (sorted.find((p) => p.date === dateStr)) {
        streak++;
      } else if (i > 0) {
        break;
      }
    }
    return streak;
  };

  const getTotalCompleted = (): number => {
    return progress.reduce((sum, p) => sum + p.posesCompleted.length, 0);
  };

  const getTodayCompleted = (): string[] => {
    const today = new Date().toISOString().split("T")[0];
    return progress.find((p) => p.date === today)?.posesCompleted || [];
  };

  return { progress, markComplete, getStreak, getTotalCompleted, getTodayCompleted };
}
