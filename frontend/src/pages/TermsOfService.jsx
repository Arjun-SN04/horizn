import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { LegalSection, LegalTOC } from '../components/LegalSection';

const SECTIONS = [
  { id: 'acceptance', number: 1, title: 'Acceptance of Terms' },
  { id: 'eligibility', number: 2, title: 'Eligibility & Account Registration' },
  { id: 'platform-role', number: 3, title: 'The Horizn Platform' },
  { id: 'listings', number: 4, title: 'Listings & Hosting Responsibilities' },
  { id: 'bookings', number: 5, title: 'Bookings, Cancellations & Pricing' },
  { id: 'conduct', number: 6, title: 'User Conduct' },
  { id: 'content', number: 7, title: 'Reviews & User Content' },
  { id: 'reporting', number: 8, title: 'Reporting & Enforcement' },
  { id: 'ip', number: 9, title: 'Intellectual Property' },
  { id: 'disclaimers', number: 10, title: 'Disclaimers & Limitation of Liability' },
  { id: 'indemnification', number: 11, title: 'Indemnification' },
  { id: 'termination', number: 12, title: 'Termination' },
  { id: 'governing-law', number: 13, title: 'Governing Law & Disputes' },
  { id: 'changes', number: 14, title: 'Changes to These Terms' },
  { id: 'contact', number: 15, title: 'Contact Us' },
];

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-surface">
      <main className="max-w-4xl mx-auto px-margin-mobile md:px-lg py-xl">
        <Link to="/" className="inline-flex items-center gap-1.5 text-body-sm text-on-surface-variant no-underline mb-lg hover:text-on-surface transition-colors">
          <ArrowLeft className="size-3.5" /> Back to home
        </Link>

        <h1 className="font-heading text-headline-lg text-on-surface mb-2">Terms of Service</h1>
        <p className="text-on-surface-variant text-body-sm mb-0">Last updated: July 19, 2026</p>

        <LegalTOC sections={SECTIONS} />

        <LegalSection id="acceptance" number={1} title="Acceptance of Terms">
          <p>
            These Terms of Service ("Terms") govern your access to and use of Horizn, Inc.'s ("Horizn," "we," "us")
            website and services (the "Platform"). By creating an account, browsing listings, making a booking, or
            otherwise using the Platform, you agree to be bound by these Terms and our Privacy Policy. If you do
            not agree, you may not use the Platform.
          </p>
        </LegalSection>

        <LegalSection id="eligibility" number={2} title="Eligibility & Account Registration">
          <p>
            You must be at least 18 years old and capable of forming a binding contract to create an account. You
            agree to provide accurate, current information during registration and to keep it up to date. You are
            responsible for all activity that occurs under your account and for keeping your password
            confidential. Notify us immediately if you suspect unauthorized use of your account.
          </p>
          <p>
            You may not create more than one account for fraudulent or abusive purposes, impersonate another
            person, or create an account on behalf of someone else without authorization.
          </p>
        </LegalSection>

        <LegalSection id="platform-role" number={3} title="The Horizn Platform">
          <p>
            Horizn provides a marketplace that allows Hosts to publish listings for places to stay, and allows
            Guests to discover and reserve those listings. <strong>Horizn is not the owner or operator of any
            listing</strong>, is not a party to the agreement between Host and Guest, and does not guarantee the
            accuracy of any listing, the conduct of any user, or the outcome of any stay. Hosts are solely
            responsible for the accuracy of their listings and for complying with applicable laws (including
            zoning, tax, and short-term rental regulations in their jurisdiction).
          </p>
        </LegalSection>

        <LegalSection id="listings" number={4} title="Listings & Hosting Responsibilities">
          <p>By publishing a listing, you represent and warrant that:</p>
          <ul>
            <li>You have the legal right to offer the space for short-term stays;</li>
            <li>All information in the listing (description, photos, price, capacity, amenities, and location) is
            accurate and not misleading;</li>
            <li>The space meets applicable health, safety, and building requirements; and</li>
            <li>You will honor confirmed bookings except where cancellation is reasonably necessary.</li>
          </ul>
          <p>
            We may remove any listing, at our discretion, that violates these Terms, is reported and found to
            violate our content standards, or that we reasonably believe poses a risk to users or the Platform.
          </p>
        </LegalSection>

        <LegalSection id="bookings" number={5} title="Bookings, Cancellations & Pricing">
          <p>
            A booking is confirmed once the Platform accepts your reservation request for the selected dates and
            guest count, subject to availability. The price shown at the time of booking is the total price for
            the stay, calculated as the nightly rate multiplied by the number of nights.
          </p>
          <p>
            <strong>Payment.</strong> The current version of the Platform confirms bookings without collecting
            payment at the time of reservation. If and when online payment processing is introduced, it will be
            handled by a dedicated third-party payment processor, and additional payment terms will apply.
          </p>
          <p>
            <strong>Cancellations.</strong> Either the Guest or the Host may cancel a confirmed booking from their
            account. Cancelling a booking notifies the other party. Repeated last-minute cancellations by a Host
            may result in enforcement action under Section 8.
          </p>
        </LegalSection>

        <LegalSection id="conduct" number={6} title="User Conduct">
          <p>When using the Platform, you agree not to:</p>
          <ul>
            <li>Violate any applicable law or the rights of others;</li>
            <li>Post false, misleading, or fraudulent listings, reviews, or reports;</li>
            <li>Harass, threaten, or discriminate against any other user;</li>
            <li>Attempt to gain unauthorized access to another user's account or to the Platform's systems;</li>
            <li>Use automated means (scraping, bots) to access or collect data from the Platform without our
            written permission; or</li>
            <li>Upload content that is unlawful, obscene, infringing, or that you do not have the right to
            share.</li>
          </ul>
        </LegalSection>

        <LegalSection id="content" number={7} title="Reviews & User Content">
          <p>
            You retain ownership of the content you submit (listing photos and descriptions, reviews, profile
            information). By submitting content, you grant Horizn a non-exclusive, worldwide, royalty-free license
            to host, display, and distribute that content solely for the purpose of operating and promoting the
            Platform. Reviews must reflect a genuine experience and comply with Section 6; we reserve the right to
            remove reviews that don't.
          </p>
        </LegalSection>

        <LegalSection id="reporting" number={8} title="Reporting & Enforcement">
          <p>
            If you believe a listing violates these Terms, you can report it directly from the listing page. Our
            team reviews reports and may warn a Host, remove a listing, or suspend an account depending on the
            severity and history of the issue. Submitting a report in bad faith, or repeatedly filing unfounded
            reports, is itself a violation of these Terms.
          </p>
        </LegalSection>

        <LegalSection id="ip" number={9} title="Intellectual Property">
          <p>
            The Platform's name, logo, design, and underlying software are the property of Horizn, Inc. and its
            licensors and are protected by intellectual property laws. Except for the limited license granted to
            use the Platform as intended, nothing in these Terms transfers any Horizn intellectual property to
            you.
          </p>
        </LegalSection>

        <LegalSection id="disclaimers" number={10} title="Disclaimers & Limitation of Liability">
          <p>
            The Platform is provided "as is" and "as available," without warranties of any kind, whether express
            or implied. We do not warrant that listings are accurate, that the Platform will be uninterrupted or
            error-free, or that any stay will meet your expectations.
          </p>
          <p>
            To the fullest extent permitted by law, Horizn will not be liable for any indirect, incidental,
            special, consequential, or punitive damages, or any loss of profits or data, arising out of or in
            connection with your use of the Platform, even if we have been advised of the possibility of such
            damages. Our total liability for any claim arising out of these Terms will not exceed the greater of
            the amount you paid us in the twelve months before the claim, or one hundred U.S. dollars.
          </p>
        </LegalSection>

        <LegalSection id="indemnification" number={11} title="Indemnification">
          <p>
            You agree to indemnify and hold harmless Horizn, its officers, employees, and agents from any claims,
            damages, losses, or expenses (including reasonable legal fees) arising out of your use of the
            Platform, your content, your listings, or your violation of these Terms or applicable law.
          </p>
        </LegalSection>

        <LegalSection id="termination" number={12} title="Termination">
          <p>
            You may stop using the Platform and delete your account at any time. We may suspend or terminate your
            account, with or without notice, if we reasonably believe you have violated these Terms, created risk
            or legal exposure for us or other users, or if required by law. Sections that by their nature should
            survive termination (including Sections 9, 10, 11, and 13) will continue to apply.
          </p>
        </LegalSection>

        <LegalSection id="governing-law" number={13} title="Governing Law & Disputes">
          <p>
            These Terms are governed by the laws of the jurisdiction in which Horizn, Inc. is established, without
            regard to conflict-of-law principles. Any dispute arising out of these Terms or your use of the
            Platform will first be attempted to be resolved informally by contacting us; if that fails, the
            dispute will be resolved in the courts of competent jurisdiction in that location, unless applicable
            law requires otherwise.
          </p>
        </LegalSection>

        <LegalSection id="changes" number={14} title="Changes to These Terms">
          <p>
            We may modify these Terms from time to time. If we make material changes, we will update the "Last
            updated" date above and, where appropriate, notify you through the Platform. Continuing to use the
            Platform after changes take effect constitutes acceptance of the revised Terms.
          </p>
        </LegalSection>

        <LegalSection id="contact" number={15} title="Contact Us">
          <p>
            Questions about these Terms can be sent to{' '}
            <a href="mailto:legal@horizn.example">legal@horizn.example</a>.
          </p>
          <p className="text-body-sm !text-on-surface-variant/70 italic mt-lg">
            This document is a general template intended to describe how the Horizn Platform actually functions.
            It is not a substitute for legal advice — have it reviewed by qualified counsel before relying on it
            for a live commercial product.
          </p>
        </LegalSection>
      </main>
    </div>
  );
}
