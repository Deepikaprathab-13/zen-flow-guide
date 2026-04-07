import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { yogaPoses } from "@/data/poses";
import { Category } from "@/data/types";
import PoseCard from "@/components/PoseCard";
import { useFavorites } from "@/hooks/useFavorites";

const categories: (Category | "All")[] = ["All", "Beginner", "Weight Loss", "Stress Relief", "Flexibility", "Meditation"];

export default function PosesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get("category") || "All";
  const [activeCategory, setActiveCategory] = useState<string>(initialCategory);
  const [search, setSearch] = useState("");
  const { isFavorite, toggleFavorite } = useFavorites();

  const filtered = useMemo(() => {
    return yogaPoses.filter((pose) => {
      const matchesCategory = activeCategory === "All" || pose.category.includes(activeCategory as Category);
      const matchesSearch = pose.name.toLowerCase().includes(search.toLowerCase()) ||
        pose.sanskritName.toLowerCase().includes(search.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, search]);

  return (
    <div className="min-h-screen pb-24 md:pt-20">
      <div className="container mx-auto max-w-6xl px-4 pt-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-display text-3xl font-bold text-foreground md:text-4xl">
            Yoga Poses
          </h1>
          <p className="mt-2 text-muted-foreground">
            Explore our collection of yoga poses with detailed instructions
          </p>
        </motion.div>

        {/* Search */}
        <div className="relative mt-6">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search poses..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-border bg-card py-3 pl-11 pr-4 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>

        {/* Category Filter */}
        <div className="mt-4 flex gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setActiveCategory(cat);
                if (cat === "All") {
                  setSearchParams({});
                } else {
                  setSearchParams({ category: cat });
                }
              }}
              className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                activeCategory === cat
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-accent"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Pose Grid */}
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((pose, i) => (
            <PoseCard
              key={pose.id}
              pose={pose}
              isFavorite={isFavorite(pose.id)}
              onToggleFavorite={toggleFavorite}
              index={i}
            />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="mt-12 text-center">
            <p className="text-lg text-muted-foreground">No poses found</p>
          </div>
        )}
      </div>
    </div>
  );
}
