import { motion } from "framer-motion";
import { Flame, Target, Calendar, TrendingUp } from "lucide-react";
import { useProgress } from "@/hooks/useProgress";

export default function ProgressPage() {
  const { progress, getStreak, getTotalCompleted, getTodayCompleted } = useProgress();

  const streak = getStreak();
  const totalCompleted = getTotalCompleted();
  const todayCompleted = getTodayCompleted();

  // Last 7 days data for chart
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    const dateStr = date.toISOString().split("T")[0];
    const dayProgress = progress.find((p) => p.date === dateStr);
    return {
      day: date.toLocaleDateString("en", { weekday: "short" }),
      count: dayProgress?.posesCompleted.length || 0,
    };
  });

  const maxCount = Math.max(...last7Days.map((d) => d.count), 1);

  return (
    <div className="min-h-screen pb-24 md:pt-20">
      <div className="container mx-auto max-w-3xl px-4 pt-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-display text-3xl font-bold text-foreground">Your Progress</h1>
          <p className="mt-2 text-muted-foreground">Track your yoga journey</p>
        </motion.div>

        {/* Stats Grid */}
        <div className="mt-8 grid grid-cols-2 gap-4">
          {[
            { icon: Flame, label: "Day Streak", value: streak, color: "text-secondary" },
            { icon: Target, label: "Total Poses", value: totalCompleted, color: "text-primary" },
            { icon: Calendar, label: "Days Active", value: progress.length, color: "text-primary" },
            { icon: TrendingUp, label: "Today", value: todayCompleted.length, color: "text-secondary" },
          ].map(({ icon: Icon, label, value, color }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="rounded-xl bg-card p-5 shadow-soft"
            >
              <Icon className={`h-5 w-5 ${color}`} />
              <p className="mt-3 font-display text-2xl font-bold text-foreground">{value}</p>
              <p className="text-sm text-muted-foreground">{label}</p>
            </motion.div>
          ))}
        </div>

        {/* Weekly Chart */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-8 rounded-2xl bg-card p-6 shadow-soft"
        >
          <h2 className="font-display text-lg font-semibold text-foreground">This Week</h2>
          <div className="mt-6 flex items-end justify-between gap-2" style={{ height: 120 }}>
            {last7Days.map((day, i) => (
              <div key={i} className="flex flex-1 flex-col items-center gap-2">
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: day.count > 0 ? (day.count / maxCount) * 80 + 8 : 4 }}
                  transition={{ delay: 0.4 + i * 0.05, duration: 0.4 }}
                  className={`w-full max-w-[32px] rounded-t-md ${
                    day.count > 0 ? "gradient-hero" : "bg-muted"
                  }`}
                />
                <span className="text-xs text-muted-foreground">{day.day}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {totalCompleted === 0 && (
          <div className="mt-8 rounded-xl border-2 border-dashed border-border p-8 text-center">
            <p className="text-muted-foreground">
              Complete your first yoga pose to start tracking progress!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
