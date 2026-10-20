import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUp, Heart } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const GITHUB_URL = 'https://github.com/Arjun-SN04';
const LINKEDIN_URL = 'https://www.linkedin.com/in/arjun-s-nair-845a63244';

const GithubIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
    <path d="M12 .5a11.5 11.5 0 0 0-3.64 22.41c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.52-1.33-1.28-1.69-1.28-1.69-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.19 1.76 1.19 1.03 1.76 2.69 1.25 3.35.96.1-.75.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.8 1.19 1.83 1.19 3.09 0 4.42-2.69 5.39-5.26 5.68.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .5Z" />
  </svg>
);

const LinkedinIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
    <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05a3.74 3.74 0 0 1 3.37-1.85c3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.07 2.07 0 1 1 0-4.13 2.07 2.07 0 0 1 0 4.13ZM7.12 20.45H3.56V9h3.56v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0Z" />
  </svg>
);

const explore = (label) => ({ to: `/listing?search=${encodeURIComponent(label)}`, label });

export const Footer = () => {
  const { user } = useAuth();

  const columns = [
    {
      title: 'Explore',
      links: [
        { to: '/listing', label: 'All stays' },
        explore('Trending'),
        explore('Iconic City'),
        explore('Mountains'),
        explore('Amazing Pools'),
        explore('Camping'),
      ],
    },
    {
      title: 'Hosting',
      links: [
        { to: '/listing/new', label: 'Become a host' },
        { to: '/listing/mine', label: 'Your listings' },
        { to: '/terms', label: 'Hosting terms' },
      ],
    },
    {
      title: 'Account',
      links: user
        ? [
            { to: '/user/profile', label: 'Profile & trips' },
            { to: '/wishlist', label: 'Wishlist' },
            { to: '/listing/mine', label: 'Manage listings' },
            ...(user.isAdmin ? [{ to: '/admin/bookings', label: 'Admin dashboard' }] : []),
          ]
        : [
            { to: '/user/login', label: 'Log in' },
            { to: '/user/signup', label: 'Sign up' },
            { to: '/wishlist', label: 'Wishlist' },
          ],
    },
    {
      title: 'Company',
      links: [
        { to: '/', label: 'Home' },
        { to: '/privacy', label: 'Privacy policy' },
        { to: '/terms', label: 'Terms of service' },
        { href: GITHUB_URL, label: 'Source code' },
      ],
    },
  ];

  const linkClass = 'text-sm text-on-surface-variant no-underline hover:text-on-surface transition-colors';

  return (
    <footer className="bg-surface-container-low border-t border-outline-variant/40 mt-20">
      <div className="max-w-[1880px] mx-auto px-6 md:px-10 xl:px-12">
        {/* Top: brand + link columns */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-[1.4fr_repeat(4,1fr)] gap-x-8 gap-y-10 py-14">
          <div className="col-span-2 md:col-span-4 lg:col-span-1 flex flex-col gap-4 max-w-96">
            <Link to="/" className="font-heading font-bold text-primary text-2xl no-underline w-fit">Horizn</Link>
            <p className="text-sm text-on-surface-variant leading-relaxed mb-0">
              Discover unique stays and inspiring experiences worldwide, from city lofts to castles and cabins.
            </p>
            <div className="flex items-center gap-2">
              <a href={GITHUB_URL} target="_blank" rel="noreferrer" aria-label="GitHub"
                className="size-9 rounded-full border border-outline-variant/60 flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:border-on-surface transition-colors">
                <GithubIcon className="size-4" />
              </a>
              <a href={LINKEDIN_URL} target="_blank" rel="noreferrer" aria-label="LinkedIn"
                className="size-9 rounded-full border border-outline-variant/60 flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:border-on-surface transition-colors">
                <LinkedinIcon className="size-4" />
              </a>
            </div>
          </div>

          {columns.map((col) => (
            <nav key={col.title} aria-label={col.title}>
              <p className="text-xs font-bold uppercase tracking-widest text-on-surface mb-4">{col.title}</p>
              <ul className="list-none p-0 m-0 flex flex-col gap-3">
                {col.links.map((l) => (
                  <li key={l.label}>
                    {l.href ? (
                      <a href={l.href} target="_blank" rel="noreferrer" className={linkClass}>{l.label}</a>
                    ) : (
                      <Link to={l.to} className={linkClass}>{l.label}</Link>
                    )}
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-6 border-t border-outline-variant/40">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-on-surface-variant">
            <span>© {new Date().getFullYear()} Horizn</span>
            <span aria-hidden="true" className="hidden sm:inline">·</span>
            <Link to="/privacy" className={linkClass}>Privacy</Link>
            <span aria-hidden="true">·</span>
            <Link to="/terms" className={linkClass}>Terms</Link>
          </div>

          <div className="flex items-center justify-between md:justify-end gap-6">
            <p className="text-sm text-on-surface-variant mb-0 inline-flex items-center gap-1.5">
              Made with <Heart className="size-3.5 fill-primary text-primary" aria-label="love" /> by
              <a href={GITHUB_URL} target="_blank" rel="noreferrer" className="font-semibold text-on-surface no-underline hover:text-primary transition-colors">
                Arjun S Nair
              </a>
            </p>
            <button
              type="button"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-full border border-outline-variant/60 bg-transparent text-sm font-semibold text-on-surface cursor-pointer hover:border-on-surface transition-colors"
            >
              <ArrowUp className="size-3.5" /> Top
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
