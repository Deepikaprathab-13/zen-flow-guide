import { useState, useEffect } from "react";

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>(() => {
    const stored = localStorage.getItem("yoga-favorites");
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem("yoga-favorites", JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (poseId: string) => {
    setFavorites((prev) =>
      prev.includes(poseId)
        ? prev.filter((id) => id !== poseId)
        : [...prev, poseId]
    );
  };

  const isFavorite = (poseId: string) => favorites.includes(poseId);

  return { favorites, toggleFavorite, isFavorite };
}
