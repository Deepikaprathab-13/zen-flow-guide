import { Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { YogaPose } from "@/data/types";

interface PoseCardProps {
  pose: YogaPose;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  index?: number;
}

export default function PoseCard({ pose, isFavorite, onToggleFavorite, index = 0 }: PoseCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      className="group relative overflow-hidden rounded-xl bg-card shadow-soft transition-shadow hover:shadow-card"
    >
      <Link to={`/pose/${pose.id}`}>
        <div className="aspect-[4/3] overflow-hidden">
          <img
            src={pose.image}
            alt={pose.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        </div>
        <div className="p-4">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {pose.sanskritName}
          </p>
          <h3 className="mt-1 font-display text-lg font-semibold text-foreground">
            {pose.name}
          </h3>
          <div className="mt-2 flex items-center gap-2">
            <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
              pose.difficulty === "Beginner" ? "bg-primary/10 text-primary" :
              pose.difficulty === "Intermediate" ? "bg-secondary/20 text-secondary" :
              "bg-destructive/10 text-destructive"
            }`}>
              {pose.difficulty}
            </span>
            <span className="text-xs text-muted-foreground">{pose.duration}s</span>
          </div>
        </div>
      </Link>
      <button
        onClick={(e) => {
          e.preventDefault();
          onToggleFavorite(pose.id);
        }}
        className="absolute right-3 top-3 rounded-full bg-card/80 p-2 backdrop-blur-sm transition-colors hover:bg-card"
        aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
      >
        <Heart
          className={`h-4 w-4 transition-colors ${
            isFavorite ? "fill-secondary text-secondary" : "text-muted-foreground"
          }`}
        />
      </button>
    </motion.div>
  );
}
