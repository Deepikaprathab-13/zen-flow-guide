import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Heart, Clock, BarChart, CheckCircle2 } from "lucide-react";
import { yogaPoses } from "@/data/poses";
import { useFavorites } from "@/hooks/useFavorites";
import { useProgress } from "@/hooks/useProgress";
import PoseTimer from "@/components/PoseTimer";

export default function PoseDetailPage() {
  const { id } = useParams<{ id: string }>();
  const pose = yogaPoses.find((p) => p.id === id);
  const { isFavorite, toggleFavorite } = useFavorites();
  const { markComplete, getTodayCompleted } = useProgress();

  if (!pose) {
    return (
      <div className="flex min-h-screen items-center justify-center pb-24 md:pt-20">
        <div className="text-center">
          <p className="text-lg text-muted-foreground">Pose not found</p>
          <Link to="/poses" className="mt-4 inline-block text-primary underline">
            Back to poses
          </Link>
        </div>
      </div>
    );
  }

  const isCompleted = getTodayCompleted().includes(pose.id);

  return (
    <div className="min-h-screen pb-24 md:pt-20">
      {/* Hero Image */}
      <div className="relative h-64 overflow-hidden md:h-80">
        <img src={pose.image} alt={pose.name} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
        <div className="absolute left-4 top-4 flex gap-2 md:top-20">
          <Link
            to="/poses"
            className="rounded-full bg-card/80 p-2.5 backdrop-blur-sm transition-colors hover:bg-card"
          >
            <ArrowLeft className="h-5 w-5 text-foreground" />
          </Link>
        </div>
        <button
          onClick={() => toggleFavorite(pose.id)}
          className="absolute right-4 top-4 rounded-full bg-card/80 p-2.5 backdrop-blur-sm transition-colors hover:bg-card md:top-20"
        >
          <Heart className={`h-5 w-5 ${isFavorite(pose.id) ? "fill-secondary text-secondary" : "text-foreground"}`} />
        </button>
      </div>

      <div className="container mx-auto max-w-3xl px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="-mt-8 relative">
          {/* Header */}
          <div className="rounded-2xl bg-card p-6 shadow-card">
            <p className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
              {pose.sanskritName}
            </p>
            <h1 className="mt-1 font-display text-3xl font-bold text-foreground">{pose.name}</h1>
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <span className={`rounded-full px-3 py-1 text-xs font-medium ${
                pose.difficulty === "Beginner" ? "bg-primary/10 text-primary" :
                pose.difficulty === "Intermediate" ? "bg-secondary/20 text-secondary" :
                "bg-destructive/10 text-destructive"
              }`}>
                <BarChart className="mr-1 inline h-3 w-3" />
                {pose.difficulty}
              </span>
              <span className="flex items-center gap-1 text-sm text-muted-foreground">
                <Clock className="h-3.5 w-3.5" /> {pose.duration}s
              </span>
              {pose.category.map((cat) => (
                <span key={cat} className="rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground">
                  {cat}
                </span>
              ))}
            </div>
          </div>

          {/* Timer */}
          <div className="mt-6 rounded-2xl bg-card p-6 shadow-soft">
            <h2 className="mb-4 text-center font-display text-lg font-semibold text-foreground">
              Practice Timer
            </h2>
            <PoseTimer
              duration={pose.duration}
              poseName={pose.name}
              onComplete={() => markComplete(pose.id)}
            />
            {isCompleted && (
              <div className="mt-4 flex items-center justify-center gap-2 text-sm font-medium text-primary">
                <CheckCircle2 className="h-4 w-4" /> Completed today!
              </div>
            )}
          </div>

          {/* Steps */}
          <div className="mt-6 rounded-2xl bg-card p-6 shadow-soft">
            <h2 className="font-display text-lg font-semibold text-foreground">
              Step-by-Step Instructions
            </h2>
            <ol className="mt-4 space-y-3">
              {pose.steps.map((step, i) => (
                <li key={i} className="flex gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                    {i + 1}
                  </span>
                  <p className="pt-0.5 text-sm leading-relaxed text-foreground">{step}</p>
                </li>
              ))}
            </ol>
          </div>

          {/* Benefits */}
          <div className="mt-6 rounded-2xl bg-card p-6 shadow-soft">
            <h2 className="font-display text-lg font-semibold text-foreground">Benefits</h2>
            <ul className="mt-3 space-y-2">
              {pose.benefits.map((benefit, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-foreground">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  {benefit}
                </li>
              ))}
            </ul>
          </div>

          {/* YouTube */}
          {pose.youtubeId && (
            <div className="mt-6 rounded-2xl bg-card p-6 shadow-soft">
              <h2 className="font-display text-lg font-semibold text-foreground">Video Tutorial</h2>
              <div className="mt-4 aspect-video overflow-hidden rounded-xl">
                <iframe
                  src={`https://www.youtube.com/embed/${pose.youtubeId}`}
                  title={`${pose.name} tutorial`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="h-full w-full"
                  loading="lazy"
                />
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
