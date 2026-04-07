import { useState, useEffect, useCallback } from "react";
import { Play, Pause, SkipForward, RotateCcw } from "lucide-react";
import { motion } from "framer-motion";

interface PoseTimerProps {
  duration: number; // in seconds
  poseName: string;
  onComplete: () => void;
  autoStart?: boolean;
}

export default function PoseTimer({ duration, poseName, onComplete, autoStart = false }: PoseTimerProps) {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [isRunning, setIsRunning] = useState(autoStart);

  const progress = ((duration - timeLeft) / duration) * 100;

  useEffect(() => {
    setTimeLeft(duration);
    setIsRunning(autoStart);
  }, [duration, autoStart]);

  useEffect(() => {
    if (!isRunning || timeLeft <= 0) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setIsRunning(false);
          onComplete();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, timeLeft, onComplete]);

  const reset = useCallback(() => {
    setTimeLeft(duration);
    setIsRunning(false);
  }, [duration]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Circle dimensions
  const size = 200;
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-6">
      <p className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
        {poseName}
      </p>

      {/* Circular Timer */}
      <div className="relative">
        <svg width={size} height={size} className="-rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="hsl(var(--muted))"
            strokeWidth={strokeWidth}
          />
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="hsl(var(--primary))"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            animate={{ strokeDashoffset }}
            transition={{ duration: 0.5 }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-display text-4xl font-bold text-foreground">
            {formatTime(timeLeft)}
          </span>
          <span className="text-xs text-muted-foreground">remaining</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-3">
        <button
          onClick={reset}
          className="rounded-full bg-muted p-3 text-muted-foreground transition-colors hover:bg-accent"
          aria-label="Reset timer"
        >
          <RotateCcw className="h-5 w-5" />
        </button>
        <button
          onClick={() => setIsRunning(!isRunning)}
          className="gradient-hero rounded-full p-4 text-primary-foreground shadow-soft transition-transform hover:scale-105"
          aria-label={isRunning ? "Pause" : "Play"}
        >
          {isRunning ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6 ml-0.5" />}
        </button>
        <button
          onClick={onComplete}
          className="rounded-full bg-muted p-3 text-muted-foreground transition-colors hover:bg-accent"
          aria-label="Skip to next"
        >
          <SkipForward className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
