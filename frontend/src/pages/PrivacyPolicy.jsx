import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { LegalSection, LegalTOC } from '../components/LegalSection';

const SECTIONS = [
  { id: 'introduction', number: 1, title: 'Introduction' },
  { id: 'information-we-collect', number: 2, title: 'Information We Collect' },
  { id: 'how-we-use-information', number: 3, title: 'How We Use Your Information' },
  { id: 'cookies', number: 4, title: 'Cookies & Similar Technologies' },
  { id: 'how-we-share', number: 5, title: 'How We Share Information' },
  { id: 'data-retention', number: 6, title: 'Data Retention' },
  { id: 'your-rights', number: 7, title: 'Your Rights & Choices' },
  { id: 'security', number: 8, title: 'Data Security' },
  { id: 'children', number: 9, title: "Children's Privacy" },
  { id: 'international', number: 10, title: 'International Data Transfers' },
  { id: 'changes', number: 11, title: 'Changes to This Policy' },
  { id: 'contact', number: 12, title: 'Contact Us' },
];

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-surface">
      <main className="max-w-4xl mx-auto px-margin-mobile md:px-lg py-xl">
        <Link to="/" className="inline-flex items-center gap-1.5 text-body-sm text-on-surface-variant no-underline mb-lg hover:text-on-surface transition-colors">
          <ArrowLeft className="size-3.5" /> Back to home
        </Link>

        <h1 className="font-heading text-headline-lg text-on-surface mb-2">Privacy Policy</h1>
        <p className="text-on-surface-variant text-body-sm mb-0">Last updated: July 19, 2026</p>

        <LegalTOC sections={SECTIONS} />

        <LegalSection id="introduction" number={1} title="Introduction">
          <p>
            Horizn, Inc. ("Horizn," "we," "us," or "our") operates a platform that connects travelers ("Guests")
            with people who list places to stay ("Hosts"). This Privacy Policy explains what personal information
            we collect when you use our website and services (collectively, the "Platform"), how we use and share
            that information, and the choices you have.
          </p>
          <p>
            By creating an account or otherwise using the Platform, you agree to the collection and use of
            information in accordance with this policy. If you do not agree, please do not use the Platform.
          </p>
        </LegalSection>

        <LegalSection id="information-we-collect" number={2} title="Information We Collect">
          <p><strong>Account information.</strong> When you sign up, we collect your username, email address, and a
          password (stored only as a salted cryptographic hash — we never store or can retrieve your plain-text
          password). You may optionally add a first and last name, phone number, address, city, country, and
          profile picture.</p>
          <p><strong>Listing content.</strong> If you host a place, we collect the information you provide about
          it — title, description, address/location, photos, price, amenities, and capacity. Photos you upload are
          stored with our image hosting provider (see Section 5).</p>
          <p><strong>Booking information.</strong> When you reserve a stay, we collect the check-in and check-out
          dates, number of guests, and the resulting price. The Platform does not currently collect or store
          payment card details — bookings are confirmed without an upfront charge.</p>
          <p><strong>Reviews and communications.</strong> We store reviews and ratings you leave on listings, and
          any reports you submit about a listing (including the reason and any details you provide).</p>
          <p><strong>Location data.</strong> Listing addresses are converted to map coordinates using a third-party
          geocoding service (see Section 5). If you use an on-map feature such as "Show my location" or
          "Get directions," your device's GPS coordinates are requested by your browser only after you explicitly
          click that button, are used to draw your position and a route on the map, and are <strong>not</strong>
          sent to or stored on our servers.</p>
          <p><strong>Usage and device data.</strong> We use a session cookie to keep you signed in, and our servers
          log standard technical data (such as IP address, browser type, and request timestamps) for security and
          debugging purposes.</p>
        </LegalSection>

        <LegalSection id="how-we-use-information" number={3} title="How We Use Your Information">
          <p>We use the information we collect to:</p>
          <ul>
            <li>Create and maintain your account, and authenticate you when you sign in;</li>
            <li>Operate core features such as listings, bookings, reviews, wishlists, and notifications;</li>
            <li>Show hosts and guests the information they need to complete a booking (e.g., a guest's username
            and reservation dates are visible to the host of that listing);</li>
            <li>Respond to support requests and investigate reports of policy violations;</li>
            <li>Detect, prevent, and address fraud, abuse, security incidents, and technical issues; and</li>
            <li>Improve and maintain the reliability of the Platform.</li>
          </ul>
          <p>We do not sell your personal information, and we do not use your data to serve third-party
          advertising.</p>
        </LegalSection>

        <LegalSection id="cookies" number={4} title="Cookies & Similar Technologies">
          <p>
            We use a single essential session cookie to keep you logged in between requests. This cookie is
            required for the Platform to function and is not used for advertising or cross-site tracking. We do
            not currently use third-party analytics or advertising cookies. If that changes, we will update this
            policy.
          </p>
        </LegalSection>

        <LegalSection id="how-we-share" number={5} title="How We Share Information">
          <p>We share limited information with the following categories of service providers, solely to operate
          the Platform:</p>
          <ul>
            <li><strong>Image hosting.</strong> Photos you upload for a listing are stored and served by our
            cloud image hosting provider (Cloudinary).</li>
            <li><strong>Maps, geocoding, and routing.</strong> Listing addresses are converted to coordinates, and
            map tiles, directions, and travel-time estimates are provided by OpenStreetMap-based services
            (including Nominatim for geocoding and OSRM for routing). Coordinates and route requests you trigger
            are sent to these services to render the map and calculate a route.</li>
            <li><strong>Database and infrastructure hosting.</strong> Your data is stored in a managed database
            and application hosting environment operated by our infrastructure providers, under contractual
            confidentiality obligations.</li>
          </ul>
          <p>
            We may also disclose information if required to do so by law, or in a good-faith belief that such
            action is necessary to comply with a legal obligation, protect the safety of users, or investigate
            potential violations of our Terms of Service.
          </p>
          <p>We do not sell or rent your personal information to third parties for their own marketing purposes.</p>
        </LegalSection>

        <LegalSection id="data-retention" number={6} title="Data Retention">
          <p>
            We retain account information for as long as your account is active. If you delete your account, we
            will delete or anonymize your personal information within a reasonable period, except where we are
            required to retain certain records (for example, to resolve disputes, enforce our agreements, or
            comply with legal obligations). Content you contributed that is inherently linked to other users'
            experience — such as a review you left on a listing — may be retained in an anonymized form.
          </p>
        </LegalSection>

        <LegalSection id="your-rights" number={7} title="Your Rights & Choices">
          <p>Depending on where you live, you may have the right to:</p>
          <ul>
            <li>Access the personal information we hold about you;</li>
            <li>Correct inaccurate or incomplete information (most profile fields can be edited directly from
            your account settings);</li>
            <li>Request deletion of your account and associated personal information;</li>
            <li>Object to or restrict certain processing of your information; and</li>
            <li>Request a copy of your data in a portable format.</li>
          </ul>
          <p>
            To exercise any of these rights, contact us using the details in Section 12. We will respond within a
            reasonable timeframe and may need to verify your identity before fulfilling certain requests.
          </p>
        </LegalSection>

        <LegalSection id="security" number={8} title="Data Security">
          <p>
            We use reasonable technical and organizational measures to protect your information, including
            password hashing with per-user salts, session-based authentication, and access controls on our
            infrastructure. However, no method of transmission or storage is 100% secure, and we cannot guarantee
            absolute security. You are responsible for keeping your account password confidential.
          </p>
        </LegalSection>

        <LegalSection id="children" number={9} title="Children's Privacy">
          <p>
            The Platform is not directed to, and is not intended for use by, anyone under the age of 18. We do not
            knowingly collect personal information from children. If you believe a child has provided us with
            personal information, please contact us and we will take steps to delete it.
          </p>
        </LegalSection>

        <LegalSection id="international" number={10} title="International Data Transfers">
          <p>
            We may process and store information in countries other than the one in which you reside. Where
            required, we take steps intended to ensure that appropriate safeguards are in place to protect your
            information in accordance with this Privacy Policy, regardless of where it is processed.
          </p>
        </LegalSection>

        <LegalSection id="changes" number={11} title="Changes to This Policy">
          <p>
            We may update this Privacy Policy from time to time to reflect changes in our practices or for legal,
            operational, or regulatory reasons. We will update the "Last updated" date at the top of this page
            when we do. Material changes will be communicated through the Platform before they take effect.
          </p>
        </LegalSection>

        <LegalSection id="contact" number={12} title="Contact Us">
          <p>
            If you have questions about this Privacy Policy or how we handle your information, please reach out
            through your account support channel, or write to us at{' '}
            <a href="mailto:privacy@horizn.example">privacy@horizn.example</a>.
          </p>
          <p className="text-body-sm !text-on-surface-variant/70 italic mt-lg">
            This document is a general template intended to describe how the Horizn Platform actually functions.
            It is not a substitute for legal advice — if you plan to operate this Platform commercially or in a
            jurisdiction with specific data-protection requirements (such as GDPR or CCPA), have it reviewed by
            qualified counsel before publishing.
          </p>
        </LegalSection>
      </main>
    </div>
  );
}
