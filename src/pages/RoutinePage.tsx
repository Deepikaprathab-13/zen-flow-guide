import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";
import { Category, Difficulty } from "@/data/types";
import { generateRoutine } from "@/data/routines";
import { yogaPoses } from "@/data/poses";
import PoseTimer from "@/components/PoseTimer";
import { useProgress } from "@/hooks/useProgress";

const categories: Category[] = ["Beginner", "Weight Loss", "Stress Relief", "Flexibility", "Meditation"];
const difficulties: Difficulty[] = ["Beginner", "Intermediate", "Advanced"];

export default function RoutinePage() {
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>("Beginner");
  const [routine, setRoutine] = useState<ReturnType<typeof generateRoutine> | null>(null);
  const [activePhase, setActivePhase] = useState<"warmup" | "main" | "cooldown">("warmup");
  const [activePoseIndex, setActivePoseIndex] = useState(0);
  const [isWorkoutStarted, setIsWorkoutStarted] = useState(false);
  const [completedPoses, setCompletedPoses] = useState<string[]>([]);
  const { markComplete } = useProgress();

  const generate = () => {
    if (!selectedCategory) return;
    const r = generateRoutine(selectedCategory, selectedDifficulty);
    setRoutine(r);
    setIsWorkoutStarted(false);
    setActivePhase("warmup");
    setActivePoseIndex(0);
    setCompletedPoses([]);
  };

  const getCurrentPoses = () => {
    if (!routine) return [];
    return routine[activePhase];
  };

  const currentPoseId = getCurrentPoses()[activePoseIndex];
  const currentPose = yogaPoses.find((p) => p.id === currentPoseId);

  const handlePoseComplete = useCallback(() => {
    if (!currentPoseId) return;
    setCompletedPoses((prev) => [...prev, currentPoseId]);
    markComplete(currentPoseId);

    const poses = getCurrentPoses();
    if (activePoseIndex < poses.length - 1) {
      setActivePoseIndex((prev) => prev + 1);
    } else if (activePhase === "warmup") {
      setActivePhase("main");
      setActivePoseIndex(0);
    } else if (activePhase === "main") {
      setActivePhase("cooldown");
      setActivePoseIndex(0);
    } else {
      setIsWorkoutStarted(false); // workout done
    }
  }, [currentPoseId, activePoseIndex, activePhase]);

  const allPoseIds = routine ? [...routine.warmup, ...routine.main, ...routine.cooldown] : [];
  const isWorkoutDone = routine && !isWorkoutStarted && completedPoses.length === allPoseIds.length && completedPoses.length > 0;

  return (
    <div className="min-h-screen pb-24 md:pt-20">
      <div className="container mx-auto max-w-3xl px-4 pt-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-display text-3xl font-bold text-foreground">
            Workout Routine
          </h1>
          <p className="mt-2 text-muted-foreground">
            Generate a personalized yoga routine based on your goals
          </p>
        </motion.div>

        {!isWorkoutStarted && !isWorkoutDone && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-8 space-y-6">
            {/* Category Selection */}
            <div>
              <label className="text-sm font-medium text-foreground">Choose your goal</label>
              <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`rounded-xl border-2 px-4 py-3 text-sm font-medium transition-all ${
                      selectedCategory === cat
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border bg-card text-foreground hover:border-primary/30"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Difficulty Selection */}
            <div>
              <label className="text-sm font-medium text-foreground">Your level</label>
              <div className="mt-2 flex gap-2">
                {difficulties.map((diff) => (
                  <button
                    key={diff}
                    onClick={() => setSelectedDifficulty(diff)}
                    className={`flex-1 rounded-xl border-2 px-4 py-3 text-sm font-medium transition-all ${
                      selectedDifficulty === diff
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border bg-card text-foreground hover:border-primary/30"
                    }`}
                  >
                    {diff}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={generate}
              disabled={!selectedCategory}
              className="gradient-hero w-full rounded-xl px-6 py-3.5 font-medium text-primary-foreground shadow-soft transition-transform hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100"
            >
              Generate Routine
            </button>

            {/* Routine Preview */}
            {routine && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                <h2 className="font-display text-xl font-semibold text-foreground">{routine.name}</h2>

                {(["warmup", "main", "cooldown"] as const).map((phase) => (
                  <div key={phase} className="rounded-xl bg-card p-4 shadow-soft">
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                      {phase === "warmup" ? "🔆 Warmup" : phase === "main" ? "🔥 Main Poses" : "🌙 Cool Down"}
                    </h3>
                    <ul className="mt-2 space-y-2">
                      {routine[phase].map((poseId) => {
                        const p = yogaPoses.find((x) => x.id === poseId);
                        return p ? (
                          <li key={poseId} className="flex items-center justify-between text-sm">
                            <span className="text-foreground">{p.name}</span>
                            <span className="text-muted-foreground">{p.duration}s</span>
                          </li>
                        ) : null;
                      })}
                    </ul>
                  </div>
                ))}

                <button
                  onClick={() => setIsWorkoutStarted(true)}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 font-medium text-primary-foreground transition-transform hover:scale-[1.02]"
                >
                  Start Workout <ArrowRight className="h-4 w-4" />
                </button>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* Active Workout */}
        <AnimatePresence mode="wait">
          {isWorkoutStarted && currentPose && (
            <motion.div
              key={currentPoseId}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="mt-8"
            >
              <div className="mb-4 flex items-center justify-between text-sm text-muted-foreground">
                <span className="uppercase tracking-wider">
                  {activePhase === "warmup" ? "🔆 Warmup" : activePhase === "main" ? "🔥 Main" : "🌙 Cool Down"}
                </span>
                <span>{completedPoses.length + 1} / {allPoseIds.length}</span>
              </div>

              {/* Progress bar */}
              <div className="mb-6 h-1.5 rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary transition-all"
                  style={{ width: `${((completedPoses.length) / allPoseIds.length) * 100}%` }}
                />
              </div>

              <div className="rounded-2xl bg-card p-6 shadow-card">
                <img
                  src={currentPose.image}
                  alt={currentPose.name}
                  className="mb-6 h-48 w-full rounded-xl object-cover"
                />
                <PoseTimer
                  duration={currentPose.duration}
                  poseName={currentPose.name}
                  onComplete={handlePoseComplete}
                  autoStart
                />
              </div>

              {/* Steps */}
              <div className="mt-4 rounded-xl bg-card p-4 shadow-soft">
                <ol className="space-y-2">
                  {currentPose.steps.map((step, i) => (
                    <li key={i} className="flex gap-2 text-sm text-foreground">
                      <span className="shrink-0 font-bold text-primary">{i + 1}.</span>
                      {step}
                    </li>
                  ))}
                </ol>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Workout Complete */}
        {isWorkoutDone && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-12 text-center"
          >
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
              <Check className="h-10 w-10 text-primary" />
            </div>
            <h2 className="font-display text-2xl font-bold text-foreground">Workout Complete! 🎉</h2>
            <p className="mt-2 text-muted-foreground">
              You completed {completedPoses.length} poses. Great job!
            </p>
            <button
              onClick={() => {
                setRoutine(null);
                setCompletedPoses([]);
              }}
              className="mt-6 rounded-xl bg-primary px-8 py-3 font-medium text-primary-foreground"
            >
              Start New Routine
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
