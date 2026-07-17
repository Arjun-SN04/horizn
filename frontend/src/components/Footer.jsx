import React from 'react';
import { Link } from 'react-router-dom';
import { Globe } from 'lucide-react';

const columns = [
  {
    title: 'Support',
    links: [
      { to: '/listing', label: 'Explore Listings' },
      { to: '/user/login', label: 'Help Center' },
      { to: '/user/login', label: 'Safety information' },
    ],
  },
  {
    title: 'Hosting',
    links: [
      { to: '/listing/new', label: 'Horizn your home' },
      { to: '/user/signup', label: 'Hosting resources' },
      { to: '/listing', label: 'Community forum' },
    ],
  },
  {
    title: 'Horizn',
    links: [
      { to: '/', label: 'Newsroom' },
      { to: '/', label: 'New features' },
      { to: '/', label: 'Careers' },
    ],
  },
];

export const Footer = () => (
  <footer className="bg-surface-container-low border-t border-outline-variant/40 mt-20">
    <div className="max-w-7xl mx-auto px-margin-mobile md:px-lg">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-xl py-xxl">
        {columns.map((col) => (
          <div key={col.title}>
            <h4 className="text-label-md text-on-surface mb-md">{col.title}</h4>
            <ul className="space-y-sm">
              {col.links.map(({ to, label }) => (
                <li key={label}>
                  <Link to={to} className="text-on-surface-variant text-body-sm no-underline hover:underline">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="flex flex-col md:flex-row justify-between items-center py-md border-t border-outline-variant/40 gap-md">
        <div className="flex flex-col md:flex-row items-center gap-sm text-body-sm text-on-surface-variant">
          <p className="font-heading font-bold text-primary mb-0">Horizn</p>
          <span>© 2024 Horizn, Inc. · Privacy · Terms</span>
        </div>
        <div className="flex items-center gap-xl">
          <div className="flex items-center gap-xs text-on-surface-variant">
            <Globe className="size-4" />
            <span className="text-body-sm font-semibold">English (US)</span>
          </div>
          <span className="text-body-sm font-semibold text-on-surface-variant">$ USD</span>
        </div>
      </div>
    </div>
  </footer>
);
