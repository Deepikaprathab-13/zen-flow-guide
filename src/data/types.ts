export type Difficulty = "Beginner" | "Intermediate" | "Advanced";

export type Category = "Beginner" | "Weight Loss" | "Stress Relief" | "Flexibility" | "Meditation";

export interface YogaPose {
  id: string;
  name: string;
  sanskritName: string;
  image: string;
  category: Category[];
  difficulty: Difficulty;
  duration: number; // seconds
  steps: string[];
  benefits: string[];
  youtubeId?: string;
}

export interface Routine {
  id: string;
  name: string;
  category: Category;
  difficulty: Difficulty;
  warmup: string[];
  main: string[];
  cooldown: string[];
}

export interface UserProgress {
  date: string;
  posesCompleted: string[];
}
