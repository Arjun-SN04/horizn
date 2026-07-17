import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authAPI } from '../api';
import { useAuth } from './AuthContext';

const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
  const { user } = useAuth();
  const [favoriteIds, setFavoriteIds] = useState(new Set());
  const [favorites, setFavorites] = useState([]);

  const fetchFavorites = useCallback(async () => {
    if (!user) { setFavoriteIds(new Set()); setFavorites([]); return; }
    try {
      const res = await authAPI.getFavorites();
      setFavorites(res.data.favorites);
      setFavoriteIds(new Set(res.data.favorites.map((l) => l._id)));
    } catch { /* non-critical */ }
  }, [user]);

  useEffect(() => { fetchFavorites(); }, [fetchFavorites]);

  const isFavorited = (listingId) => favoriteIds.has(listingId);

  const toggleFavorite = async (listingId) => {
    if (!user) return false;
    // optimistic update
    setFavoriteIds((prev) => {
      const next = new Set(prev);
      next.has(listingId) ? next.delete(listingId) : next.add(listingId);
      return next;
    });
    try {
      const res = await authAPI.toggleFavorite(listingId);
      fetchFavorites(); // refresh the fully-populated list for the wishlist view
      return res.data.favorited;
    } catch {
      // revert on failure
      setFavoriteIds((prev) => {
        const next = new Set(prev);
        next.has(listingId) ? next.delete(listingId) : next.add(listingId);
        return next;
      });
      return null;
    }
  };

  return (
    <FavoritesContext.Provider value={{ favorites, favoriteIds, isFavorited, toggleFavorite, refetchFavorites: fetchFavorites }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within FavoritesProvider');
  }
  return context;
};
