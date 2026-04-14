export default function TermsOfService() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16 text-sm text-gray-800">
      <h1 className="mb-2 text-3xl font-bold">Terms of Service</h1>
      <p className="mb-10 text-gray-500">Last updated: April 14, 2026</p>

      <section className="mb-8">
        <h2 className="mb-3 text-lg font-semibold">1. Introduction</h2>
        <p>
          These Terms of Service ("Terms") govern your access to and use of EZ
          Rest ("we", "us", "our"), a software-as-a-service platform for
          creating and managing restaurant websites. By creating an account or
          using the service, you agree to these Terms in full. If you do not
          agree, do not use the service.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-3 text-lg font-semibold">
          2. Account Registration
        </h2>
        <p className="mb-2">
          You must create an account to use EZ Rest. You are responsible for:
        </p>
        <ul className="list-inside list-disc space-y-2 pl-2">
          <li>Providing accurate and up-to-date account information.</li>
          <li>
            Maintaining the confidentiality of your login credentials.
          </li>
          <li>
            All activity that occurs under your account.
          </li>
        </ul>
        <p className="mt-3">
          You must be at least 18 years old to create an account. Accounts are
          personal and may not be transferred to another person or entity.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-3 text-lg font-semibold">3. Subscription Plans</h2>
        <p className="mb-3">EZ Rest is offered under two plans:</p>
        <ul className="list-inside list-disc space-y-2 pl-2">
          <li>
            <strong>Free plan:</strong> Includes access to menu management, hero
            section editing, opening hours display, and one restaurant site
            domain. Free forever, subject to feature limitations.
          </li>
          <li>
            <strong>Premium plan:</strong> SEK 499 per month. Includes all Free
            features plus gallery management, about section, news articles,
            opening hours editing, custom domain support, and analytics. Billed
            monthly and automatically renewed until cancelled.
          </li>
        </ul>
        <p className="mt-3">
          Prices are stated inclusive of any applicable VAT where required by
          law. We reserve the right to change pricing with at least 30 days'
          notice.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-3 text-lg font-semibold">
          4. Billing and Payment
        </h2>
        <p className="mb-2">
          Payments are processed by Stripe. By subscribing, you authorise us to
          charge your payment method on a recurring monthly basis. You agree to
          Stripe's Terms of Service in addition to ours.
        </p>
        <ul className="list-inside list-disc space-y-2 pl-2">
          <li>
            Subscriptions begin on the date of first successful payment and
            renew on the same day each month.
          </li>
          <li>
            If a payment fails, access to Premium features may be suspended
            until payment is resolved.
          </li>
          <li>
            All fees are non-refundable except as required by applicable law or
            as explicitly stated by us in writing.
          </li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="mb-3 text-lg font-semibold">5. Cancellation</h2>
        <p>
          You may cancel your Premium subscription at any time through the
          Stripe billing portal accessible from your account. Cancellation takes
          effect at the end of the current billing period. You will retain
          access to Premium features until that date. After cancellation, your
          account reverts to the Free plan and Premium-only content (e.g.,
          gallery images, news articles) will no longer be publicly displayed,
          but your data will be retained for 30 days in case you re-subscribe.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-3 text-lg font-semibold">6. User Content</h2>
        <p className="mb-2">
          You retain ownership of all content you upload to EZ Rest (menus,
          images, text, etc.). By uploading content, you grant us a
          non-exclusive, worldwide, royalty-free licence to store, display, and
          deliver that content solely for the purpose of operating the service.
        </p>
        <p>You represent and warrant that your content:</p>
        <ul className="mt-2 list-inside list-disc space-y-2 pl-2">
          <li>
            Does not infringe any third-party intellectual property, privacy, or
            other rights.
          </li>
          <li>
            Is not unlawful, defamatory, obscene, or otherwise objectionable.
          </li>
          <li>Accurately represents your restaurant and its offerings.</li>
        </ul>
        <p className="mt-3">
          We reserve the right to remove content that violates these Terms
          without prior notice.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-3 text-lg font-semibold">
          7. Custom Domains
        </h2>
        <p>
          Premium subscribers may connect a custom domain to their restaurant
          site via our Vercel integration. You are solely responsible for
          registering, owning, and renewing any domain name you connect. We are
          not liable for domain expiry, transfer issues, or conflicts with
          third-party domain registrars. Connecting a domain you do not own or
          are not authorised to use is a violation of these Terms.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-3 text-lg font-semibold">8. Acceptable Use</h2>
        <p className="mb-2">You may not use EZ Rest to:</p>
        <ul className="list-inside list-disc space-y-2 pl-2">
          <li>
            Violate any applicable law or regulation.
          </li>
          <li>
            Upload malicious code, viruses, or any content intended to harm
            users or systems.
          </li>
          <li>
            Impersonate another person or entity or misrepresent your
            affiliation with any business.
          </li>
          <li>
            Attempt to gain unauthorised access to our systems or another user's
            account.
          </li>
          <li>
            Use the service to send unsolicited commercial communications
            (spam).
          </li>
        </ul>
        <p className="mt-3">
          Violation of these rules may result in immediate account suspension or
          termination without refund.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-3 text-lg font-semibold">
          9. Service Availability and Changes
        </h2>
        <p>
          We aim to provide a reliable service but do not guarantee 100% uptime.
          The service is provided "as is" and "as available." We may modify,
          suspend, or discontinue features at any time. If we discontinue the
          service entirely, we will provide at least 30 days' notice and issue a
          pro-rata refund for any prepaid subscription period.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-3 text-lg font-semibold">
          10. Limitation of Liability
        </h2>
        <p>
          To the maximum extent permitted by applicable law, EZ Rest and its
          operators shall not be liable for any indirect, incidental, special,
          consequential, or punitive damages arising from your use of — or
          inability to use — the service. Our total aggregate liability for any
          claim arising out of or relating to these Terms or the service shall
          not exceed the amount you paid us in the 3 months immediately
          preceding the claim.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-3 text-lg font-semibold">11. Indemnification</h2>
        <p>
          You agree to indemnify and hold harmless EZ Rest and its operators
          from any claims, damages, losses, and expenses (including reasonable
          legal fees) arising from your use of the service, your content, or
          your violation of these Terms.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-3 text-lg font-semibold">
          12. Governing Law and Disputes
        </h2>
        <p>
          These Terms are governed by the laws of Sweden. Any disputes arising
          under these Terms shall be subject to the exclusive jurisdiction of
          Swedish courts, unless mandatory consumer protection law in your
          country requires otherwise. If you are a consumer in the EU, you may
          also use the EU Online Dispute Resolution platform at{" "}
          <a
            href="https://ec.europa.eu/consumers/odr"
            className="underline"
          >
            ec.europa.eu/consumers/odr
          </a>
          .
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-3 text-lg font-semibold">
          13. Changes to These Terms
        </h2>
        <p>
          We may update these Terms from time to time. We will notify you by
          email or via a notice in the admin panel at least 14 days before
          material changes take effect. Continued use of the service after the
          effective date constitutes acceptance of the updated Terms.
        </p>
      </section>

      <section>
        <h2 className="mb-3 text-lg font-semibold">14. Contact</h2>
        <p>
          For questions about these Terms, contact us at:{" "}
          <a href="mailto:legal@ezrest.app" className="underline">
            legal@ezrest.app
          </a>
        </p>
      </section>
    </div>
  );
}
