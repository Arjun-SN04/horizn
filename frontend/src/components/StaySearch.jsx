import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Minus, Plus, Check } from 'lucide-react';
import { CATEGORIES } from '@/lib/categories';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from '@/components/animate-ui/components/radix/dropdown-menu';

// Search state lives in the URL (?search=&category=&guests=) so the header
// and the listings page always agree, and searches can be shared as links.
export const useStayParams = () => {
  const [params, setParams] = useSearchParams();
  const where = params.get('search') || '';
  const category = params.get('category') || '';
  const guests = Number(params.get('guests')) || 0;

  const update = (patch) => {
    const next = new URLSearchParams(params);
    Object.entries(patch).forEach(([key, value]) => {
      if (value === '' || value == null || value === 0) next.delete(key);
      else next.set(key, String(value));
    });
    setParams(next, { replace: true });
  };

  return { where, category, guests, update };
};

const guestLabel = (n) => (n ? `${n} guest${n !== 1 ? 's' : ''}` : '');

const Divider = () => <span aria-hidden="true" className="w-px h-8 bg-outline-variant/70 shrink-0" />;

const segmentClass =
  'h-full min-w-0 flex flex-col justify-center rounded-full px-6 text-left bg-transparent border-0 cursor-pointer ' +
  'hover:bg-surface-container-low focus-visible:bg-surface-container-low outline-none transition-colors';

// Full-size search bar (Where | Type | Who), shown when the header is expanded.
export const StaySearchBar = ({ inputRef }) => {
  const { where, category, guests, update } = useStayParams();
  const [draft, setDraft] = useState(where);

  useEffect(() => { setDraft(where); }, [where]);

  const submit = (e) => {
    e.preventDefault();
    update({ search: draft.trim() });
    inputRef?.current?.blur();
  };

  return (
    <form
      onSubmit={submit}
      role="search"
      className="w-full max-w-[850px] mx-auto h-16 flex items-center rounded-full border border-outline-variant/60 bg-surface-container-lowest shadow-[0_3px_12px_rgba(0,0,0,0.08)]"
    >
      <label className={`${segmentClass} flex-[1.4] cursor-text pl-7`}>
        <span className="text-xs font-semibold text-on-surface">Where</span>
        <input
          ref={inputRef}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Search destinations"
          className="w-full bg-transparent border-0 outline-none p-0 text-sm text-on-surface placeholder:text-on-surface-variant truncate"
        />
      </label>

      <span className="hidden md:block"><Divider /></span>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button type="button" className={`${segmentClass} flex-1 hidden md:flex`}>
            <span className="text-xs font-semibold text-on-surface">Type</span>
            <span className={`text-sm truncate ${category ? 'text-on-surface' : 'text-on-surface-variant'}`}>
              {category || 'Any type'}
            </span>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="center" className="w-56 p-1.5">
          {['', ...CATEGORIES].map((c) => (
            <DropdownMenuItem key={c || 'any'} onSelect={() => update({ category: c })} className="cursor-pointer justify-between">
              {c || 'Any type'}
              {category === c && <Check className="size-4 text-primary" />}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <span className="hidden sm:block"><Divider /></span>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button type="button" className={`${segmentClass} flex-1 hidden sm:flex`}>
            <span className="text-xs font-semibold text-on-surface">Who</span>
            <span className={`text-sm truncate ${guests ? 'text-on-surface' : 'text-on-surface-variant'}`}>
              {guestLabel(guests) || 'Add guests'}
            </span>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-72 p-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-on-surface mb-0.5">Guests</p>
              <p className="text-xs text-on-surface-variant mb-0">Stays that fit everyone</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => update({ guests: Math.max(0, guests - 1) })}
                disabled={guests === 0}
                aria-label="Fewer guests"
                className="size-8 rounded-full border border-outline-variant bg-transparent flex items-center justify-center cursor-pointer text-on-surface hover:border-on-surface disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <Minus className="size-3.5" />
              </button>
              <span className="w-5 text-center font-semibold tabular-nums">{guests}</span>
              <button
                type="button"
                onClick={() => update({ guests: Math.min(16, guests + 1) })}
                aria-label="More guests"
                className="size-8 rounded-full border border-outline-variant bg-transparent flex items-center justify-center cursor-pointer text-on-surface hover:border-on-surface"
              >
                <Plus className="size-3.5" />
              </button>
            </div>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>

      <button
        type="submit"
        aria-label="Search"
        className="shrink-0 mx-2 h-12 min-w-12 px-4 rounded-full border-0 bg-primary text-on-primary flex items-center justify-center gap-2 cursor-pointer hover:brightness-110 transition"
      >
        <Search className="size-4.5" strokeWidth={2.5} />
      </button>
    </form>
  );
};

// Compact pill shown in the header after scrolling. Clicking it reopens the full bar.
export const StaySearchPill = ({ onClick }) => {
  const { where, category, guests } = useStayParams();

  return (
    <button
      type="button"
      onClick={onClick}
      className="h-12 flex items-center pl-6 pr-2 rounded-full border border-outline-variant/60 bg-surface-container-lowest text-sm text-on-surface cursor-pointer shadow-[0_1px_2px_rgba(0,0,0,0.08),0_4px_12px_rgba(0,0,0,0.05)] hover:shadow-[0_2px_4px_rgba(0,0,0,0.18)] transition-shadow"
    >
      <span className="font-semibold truncate max-w-40">{where || 'Anywhere'}</span>
      <span aria-hidden="true" className="w-px h-6 bg-outline-variant/70 mx-4" />
      <span className="font-semibold truncate max-w-32">{category || 'Any type'}</span>
      <span aria-hidden="true" className="w-px h-6 bg-outline-variant/70 mx-4" />
      <span className={guests ? 'font-semibold' : 'text-on-surface-variant'}>{guestLabel(guests) || 'Add guests'}</span>
      <span className="ml-3 size-8 rounded-full bg-primary text-on-primary flex items-center justify-center">
        <Search className="size-3.5" strokeWidth={3} />
      </span>
    </button>
  );
};
