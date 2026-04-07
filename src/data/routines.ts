import { Category, Difficulty, Routine } from "./types";
import { yogaPoses } from "./poses";

// Generate a routine based on category and difficulty
export function generateRoutine(category: Category, difficulty: Difficulty): Routine {
  const eligible = yogaPoses.filter(
    (p) => p.category.includes(category)
  );

  // Sort by difficulty for ordering
  const diffOrder: Record<Difficulty, number> = { Beginner: 0, Intermediate: 1, Advanced: 2 };
  const sorted = [...eligible].sort((a, b) => diffOrder[a.difficulty] - diffOrder[b.difficulty]);

  // Always include some beginner poses for warmup/cooldown
  const beginnerPoses = yogaPoses.filter(p => p.difficulty === "Beginner");
  
  const warmup = [
    beginnerPoses.find(p => p.id === "mountain")?.id || sorted[0]?.id,
  ].filter(Boolean) as string[];

  const cooldown = [
    beginnerPoses.find(p => p.id === "childs-pose")?.id || sorted[sorted.length - 1]?.id,
  ].filter(Boolean) as string[];

  const mainPoses = sorted
    .filter(p => !warmup.includes(p.id) && !cooldown.includes(p.id))
    .slice(0, difficulty === "Beginner" ? 3 : difficulty === "Intermediate" ? 4 : 5)
    .map(p => p.id);

  return {
    id: `${category}-${difficulty}-${Date.now()}`,
    name: `${category} ${difficulty} Routine`,
    category,
    difficulty,
    warmup,
    main: mainPoses,
    cooldown,
  };
}
