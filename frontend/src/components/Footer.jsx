import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const baseLinks = [
  { to: '/listing', label: 'Explore stays' },
  { to: '/listing/new', label: 'Become a host' },
];

export const Footer = () => {
  const { user } = useAuth();
  const links = user
    ? [...baseLinks, { to: '/wishlist', label: 'Wishlist' }, { to: '/user/profile', label: 'Profile' }]
    : [...baseLinks, { to: '/user/login', label: 'Sign in' }];

  return (
    <footer className="bg-surface-container-low border-t border-outline-variant/40 mt-20">
      <div className="max-w-7xl mx-auto px-margin-mobile md:px-lg py-xxl">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-xl pb-xl border-b border-outline-variant/40">
          <div>
            <Link to="/" className="font-heading font-bold text-primary text-headline-md no-underline">Horizn</Link>
            <p className="text-on-surface-variant text-body-sm mt-xs mb-0 max-w-72">
              Discover unique stays and inspiring experiences worldwide.
            </p>
          </div>

          <nav className="flex flex-wrap gap-x-xl gap-y-sm">
            {links.map(({ to, label }) => (
              <Link key={label} to={to} className="text-on-surface-variant text-body-sm no-underline hover:text-on-surface transition-colors">
                {label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex flex-col-reverse md:flex-row justify-between items-center gap-sm pt-lg">
          <span className="text-body-sm text-on-surface-variant">
            © {new Date().getFullYear()} Horizn, Inc.
          </span>
          <span className="text-body-sm text-on-surface-variant flex items-center gap-1.5">
            <Link to="/privacy" className="text-on-surface-variant no-underline hover:text-on-surface hover:underline">Privacy</Link>
            ·
            <Link to="/terms" className="text-on-surface-variant no-underline hover:text-on-surface hover:underline">Terms</Link>
          </span>
        </div>
      </div>
    </footer>
  );
};
