import React from 'react';

export const LegalSection = ({ id, number, title, children }) => (
  <section id={id} className="scroll-mt-28 mb-xxl">
    <h2 className="font-heading text-headline-md text-on-surface mb-md flex items-baseline gap-3">
      <span className="text-primary">{number}.</span> {title}
    </h2>
    <div className="text-on-surface-variant text-body-md leading-relaxed space-y-md [&_strong]:text-on-surface [&_strong]:font-semibold [&_ul]:list-disc [&_ul]:pl-lg [&_ul]:space-y-xs [&_a]:text-primary [&_a]:no-underline hover:[&_a]:underline">
      {children}
    </div>
  </section>
);

export const LegalTOC = ({ sections }) => (
  <nav className="rounded-2xl border border-outline-variant/40 bg-surface-container-lowest p-lg my-xl">
    <p className="text-label-sm font-bold text-on-surface uppercase tracking-wider mb-md">On this page</p>
    <ol className="grid sm:grid-cols-2 gap-x-xl gap-y-xs">
      {sections.map((s) => (
        <li key={s.id}>
          <a href={`#${s.id}`} className="text-body-sm text-primary no-underline hover:underline">
            {s.number}. {s.title}
          </a>
        </li>
      ))}
    </ol>
  </nav>
);
