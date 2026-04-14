/* eslint-disable react/no-unescaped-entities */
export default function PrivacyPolicy() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16 text-sm text-gray-800">
      <h1 className="mb-2 text-3xl font-bold">Privacy Policy</h1>
      <p className="mb-10 text-gray-500">Last updated: April 14, 2026</p>

      <section className="mb-8">
        <h2 className="mb-3 text-lg font-semibold">1. Who We Are</h2>
        <p>
          EZ Rest ("we", "us", "our") is a software-as-a-service platform that
          lets restaurant owners create and manage their own public-facing
          website. This Privacy Policy explains what personal data we collect,
          why we collect it, and your rights regarding that data.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-3 text-lg font-semibold">2. Data We Collect</h2>
        <p className="mb-3">
          We collect the following categories of personal data:
        </p>
        <ul className="list-inside list-disc space-y-2 pl-2">
          <li>
            <strong>Account information:</strong> Your name and email address,
            collected when you sign up via Clerk (our authentication provider).
          </li>
          <li>
            <strong>Billing information:</strong> Payment method details and
            billing history, processed and stored by Stripe. We never store your
            raw card details on our own servers.
          </li>
          <li>
            <strong>User-generated content:</strong> Menu items, images, news
            articles, opening hours, and other content you upload to your
            restaurant site.
          </li>
          <li>
            <strong>Technical data:</strong> IP address, browser type, and
            request logs generated when you use the service.
          </li>
          <li>
            <strong>Custom domain data:</strong> Domain names you register or
            connect through our integration with Vercel.
          </li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="mb-3 text-lg font-semibold">3. How We Use Your Data</h2>
        <ul className="list-inside list-disc space-y-2 pl-2">
          <li>To create and maintain your account.</li>
          <li>
            To process subscription payments and manage your billing status.
          </li>
          <li>
            To operate and deliver the EZ Rest service, including hosting your
            restaurant website.
          </li>
          <li>
            To send transactional emails (e.g., contact form submissions
            forwarded from your restaurant site).
          </li>
          <li>
            To detect and prevent fraud, abuse, or violations of our Terms of
            Service.
          </li>
          <li>To comply with applicable laws and legal obligations.</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="mb-3 text-lg font-semibold">
          4. Third-Party Service Providers
        </h2>
        <p className="mb-3">
          We share data with the following sub-processors to operate the
          service:
        </p>
        <ul className="list-inside list-disc space-y-2 pl-2">
          <li>
            <strong>Clerk (clerk.com):</strong> Authentication and user identity
            management. Stores your email address and user profile.
          </li>
          <li>
            <strong>Stripe (stripe.com):</strong> Payment processing and
            subscription management. Subject to Stripe's own Privacy Policy and
            PCI-DSS compliance.
          </li>
          <li>
            <strong>Vercel (vercel.com):</strong> Hosting infrastructure and
            custom domain provisioning for your restaurant site.
          </li>
        </ul>
        <p className="mt-3">
          Each of these providers processes data under their own privacy
          policies. We encourage you to review them.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-3 text-lg font-semibold">5. Data Retention</h2>
        <p>
          We retain your personal data for as long as your account is active. If
          you delete your account or request deletion, we will remove your
          personal data within 30 days, except where we are required to retain
          it for legal or accounting purposes (e.g., payment records, which may
          be retained for up to 7 years under Swedish bookkeeping law).
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-3 text-lg font-semibold">
          6. Your Rights Under GDPR
        </h2>
        <p className="mb-3">
          As a resident of the European Economic Area, you have the following
          rights:
        </p>
        <ul className="list-inside list-disc space-y-2 pl-2">
          <li>
            <strong>Access:</strong> Request a copy of the personal data we hold
            about you.
          </li>
          <li>
            <strong>Rectification:</strong> Ask us to correct inaccurate data.
          </li>
          <li>
            <strong>Erasure:</strong> Request deletion of your personal data
            ("right to be forgotten").
          </li>
          <li>
            <strong>Restriction:</strong> Ask us to limit how we process your
            data.
          </li>
          <li>
            <strong>Portability:</strong> Receive your data in a structured,
            machine-readable format.
          </li>
          <li>
            <strong>Objection:</strong> Object to processing based on legitimate
            interests.
          </li>
        </ul>
        <p className="mt-3">
          To exercise any of these rights, contact us at the email address
          below. You also have the right to lodge a complaint with the Swedish
          Authority for Privacy Protection (Integritetsskyddsmyndigheten, IMY)
          at{" "}
          <a href="https://www.imy.se" className="underline">
            imy.se
          </a>
          .
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-3 text-lg font-semibold">7. Cookies</h2>
        <p>
          We use strictly necessary cookies for authentication session
          management (provided by Clerk). We do not use advertising or tracking
          cookies. No consent banner is required for strictly necessary cookies
          under ePrivacy rules.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-3 text-lg font-semibold">8. Data Security</h2>
        <p>
          We use industry-standard security measures including encrypted
          connections (HTTPS/TLS), access controls, and trusted third-party
          infrastructure. However, no system is completely secure, and we cannot
          guarantee absolute security.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-3 text-lg font-semibold">
          9. Changes to This Policy
        </h2>
        <p>
          We may update this Privacy Policy from time to time. We will notify
          you of material changes by email or by posting a notice in the admin
          panel. Continued use of the service after changes constitutes
          acceptance of the updated policy.
        </p>
      </section>

      <section>
        <h2 className="mb-3 text-lg font-semibold">10. Contact</h2>
        <p>
          For privacy-related requests or questions, please contact us at:{" "}
          <a href="mailto:privacy@ezrest.app" className="underline">
            privacy@ezrest.app
          </a>
        </p>
      </section>
    </div>
  );
}
