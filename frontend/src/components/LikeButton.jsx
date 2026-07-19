import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useFavorites } from '../context/FavoritesContext';

const PARTICLE_COUNT = 8;

const makeBurst = () => Array.from({ length: PARTICLE_COUNT }, (_, i) => {
  const angle = (i / PARTICLE_COUNT) * Math.PI * 2 + (Math.random() - 0.5) * 0.6;
  const distance = 20 + Math.random() * 20;
  return {
    id: `${Date.now()}-${i}`,
    x: Math.cos(angle) * distance,
    y: Math.sin(angle) * distance,
    scale: 0.45 + Math.random() * 0.5,
    rotate: (Math.random() - 0.5) * 90,
    delay: i * 0.015,
  };
});

export const LikeButton = ({ listingId, className = '', iconClassName = 'size-5' }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { isFavorited, toggleFavorite } = useFavorites();
  const liked = isFavorited(listingId);
  const [burst, setBurst] = useState(null);
  const burstIdRef = useRef(0);

  useEffect(() => {
    if (!burst) return;
    const t = setTimeout(() => setBurst(null), 750);
    return () => clearTimeout(t);
  }, [burst]);

  const handleClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) { navigate('/user/login'); return; }
    const nowFavorited = await toggleFavorite(listingId);
    if (nowFavorited) {
      burstIdRef.current += 1;
      setBurst({ key: burstIdRef.current, particles: makeBurst() });
    }
  };

  return (
    <button type="button" onClick={handleClick} aria-label={liked ? 'Remove from wishlist' : 'Add to wishlist'} className={className}>
      <span className="relative inline-flex">
        <motion.span
          key={liked ? 'liked' : 'unliked'}
          initial={{ scale: 0.5 }}
          animate={liked ? { scale: [0.6, 1.35, 1] } : { scale: 1 }}
          whileTap={{ scale: 0.8 }}
          transition={liked ? { duration: 0.45, times: [0, 0.5, 1], ease: 'easeOut' } : { type: 'spring', stiffness: 500, damping: 14 }}
          className="inline-flex"
        >
          <Heart className={`${iconClassName} transition-colors ${liked ? 'fill-primary text-primary' : ''}`} />
        </motion.span>

        <AnimatePresence>
          {burst && (
            <span key={burst.key} className="pointer-events-none absolute inset-0 flex items-center justify-center">
              {burst.particles.map((p) => (
                <motion.span
                  key={p.id}
                  className="absolute"
                  initial={{ opacity: 1, x: 0, y: 0, scale: 0 }}
                  animate={{ opacity: 0, x: p.x, y: p.y, scale: p.scale, rotate: p.rotate }}
                  transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1], delay: p.delay }}
                >
                  <Heart className="size-3 fill-primary text-primary" />
                </motion.span>
              ))}
            </span>
          )}
        </AnimatePresence>
      </span>
    </button>
  );
};
