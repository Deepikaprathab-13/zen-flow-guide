import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { yogaPoses } from "@/data/poses";
import { useFavorites } from "@/hooks/useFavorites";
import PoseCard from "@/components/PoseCard";

export default function FavoritesPage() {
  const { favorites, isFavorite, toggleFavorite } = useFavorites();
  const favoritePoses = yogaPoses.filter((p) => favorites.includes(p.id));

  return (
    <div className="min-h-screen pb-24 md:pt-20">
      <div className="container mx-auto max-w-5xl px-4 pt-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-display text-3xl font-bold text-foreground">Favorites</h1>
          <p className="mt-2 text-muted-foreground">Your saved yoga poses</p>
        </motion.div>

        {favoritePoses.length > 0 ? (
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {favoritePoses.map((pose, i) => (
              <PoseCard
                key={pose.id}
                pose={pose}
                isFavorite={isFavorite(pose.id)}
                onToggleFavorite={toggleFavorite}
                index={i}
              />
            ))}
          </div>
        ) : (
          <div className="mt-16 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
              <Heart className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-lg font-medium text-foreground">No favorites yet</p>
            <p className="mt-1 text-muted-foreground">
              Tap the heart icon on any pose to save it here
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
