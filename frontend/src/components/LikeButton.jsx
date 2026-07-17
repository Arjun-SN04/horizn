import React from 'react';
import { motion } from 'motion/react';
import { Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useFavorites } from '../context/FavoritesContext';

export const LikeButton = ({ listingId, className = '', iconClassName = 'size-5' }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { isFavorited, toggleFavorite } = useFavorites();
  const liked = isFavorited(listingId);

  const handleClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) { navigate('/user/login'); return; }
    await toggleFavorite(listingId);
  };

  return (
    <button type="button" onClick={handleClick} aria-label={liked ? 'Remove from wishlist' : 'Add to wishlist'} className={className}>
      <motion.span
        key={liked ? 'liked' : 'unliked'}
        initial={{ scale: 0.5 }}
        animate={{ scale: 1 }}
        whileTap={{ scale: 0.8 }}
        transition={{ type: 'spring', stiffness: 500, damping: 14 }}
        className="inline-flex"
      >
        <Heart className={`${iconClassName} transition-colors ${liked ? 'fill-primary text-primary' : ''}`} />
      </motion.span>
    </button>
  );
};
