"use client";

import {
  addFavorite,
  isFavorite,
  getAllFavorites,
  removeFavorite,
} from "@/toggleFavorites/checkFavorites/lib/db";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";

const FavoritesContext = createContext();

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState([]);
  const [favoriteIds, setFavoriteIds] = useState(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllFavorites()
      .then((data) => {
        setFavorites(data);
        setFavoriteIds(new Set(data.map((c) => c.id)));
      })
      .finally(() => setLoading(false));
  }, []);

  const toggleFavorite = useCallback(
    async (channel) => {
      const exists = favoriteIds.has(channel.id);
      if (exists) {
        await removeFavorite(channel.id);
        setFavorites((prev) => prev.filter((c) => c.id !== channel.id));
        setFavoriteIds((prev) => {
          const next = new Set(prev);
          next.delete(channel.id);
          return next;
        });
      } else {
        await addFavorite(channel);
        setFavorites((prev) => [...prev, channel]);
        setFavoriteIds((prev) => new Set([...prev, channel.id]));
      }
    },
    [favoriteIds],
  );

  const checkFavorite = useCallback(
    (channelId) => favoriteIds.has(channelId),
    [favoriteIds],
  );

  return (
    <FavoritesContext.Provider
      value={{ favorites, toggleFavorite, checkFavorite, loading }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  return useContext(FavoritesContext);
}

export default FavoritesContext;
