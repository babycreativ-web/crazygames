import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy - CrazyArcade",
  description: "Read the privacy policy for CrazyArcade. Learn how we collect, use, and protect your data.",
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 md:py-16">
      <h1 className="text-3xl font-bold text-slate-100 md:text-4xl tracking-tight mb-2">
        Privacy Policy
      </h1>
      <p className="text-xs text-slate-500 mb-8">Last updated: June 2026</p>

      <div className="flex flex-col gap-6 text-sm text-slate-400 leading-relaxed">
        <section>
          <h2 className="text-lg font-bold text-slate-200 mb-2">1. Information We Collect</h2>
          <p className="mb-2">When you use CrazyArcade, we may collect the following information:</p>
          <ul className="list-disc list-inside flex flex-col gap-1 text-slate-500">
            <li>Account information (email, display name) if you create an account</li>
            <li>Usage data (games played, pages visited, time spent)</li>
            <li>Device information (browser type, operating system, screen size)</li>
            <li>Cookies and similar tracking technologies</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-slate-200 mb-2">2. How We Use Your Information</h2>
          <p className="mb-2">We use the collected information to:</p>
          <ul className="list-disc list-inside flex flex-col gap-1 text-slate-500">
            <li>Provide and improve our gaming service</li>
            <li>Personalize your gaming experience</li>
            <li>Save your favorites and preferences</li>
            <li>Display relevant advertisements</li>
            <li>Analyze usage patterns and optimize performance</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-slate-200 mb-2">3. Cookies</h2>
          <p>
            CrazyArcade uses cookies to enhance your browsing experience, remember your preferences, 
            and provide analytics. You can control cookie settings through your browser. Note that 
            disabling cookies may affect some website functionality.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-slate-200 mb-2">4. Third-Party Services</h2>
          <p>
            We use third-party services for analytics, advertising, and game hosting. These services 
            may collect data according to their own privacy policies. We encourage you to review the 
            privacy policies of any third-party services accessed through our platform.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-slate-200 mb-2">5. Data Security</h2>
          <p>
            We take reasonable measures to protect your personal information from unauthorized access, 
            alteration, or destruction. However, no method of internet transmission is 100% secure, 
            and we cannot guarantee absolute security.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-slate-200 mb-2">6. Children&apos;s Privacy</h2>
          <p>
            CrazyArcade is designed to be family-friendly. We do not knowingly collect personal 
            information from children under 13 without parental consent. If you believe a child has 
            provided us with personal information, please contact us so we can remove it.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-slate-200 mb-2">7. Your Rights</h2>
          <p className="mb-2">You have the right to:</p>
          <ul className="list-disc list-inside flex flex-col gap-1 text-slate-500">
            <li>Access and receive a copy of your personal data</li>
            <li>Rectify or update your personal information</li>
            <li>Request deletion of your personal data</li>
            <li>Object to or restrict processing of your data</li>
            <li>Withdraw consent at any time</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-slate-200 mb-2">8. Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. We will notify you of any changes by 
            posting the new policy on this page with an updated revision date.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-slate-200 mb-2">9. Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact us at{" "}
            <a href="mailto:babycreativ@gmail.com" className="text-violet-400 hover:text-pink-400 transition-colors font-medium">
              babycreativ@gmail.com
            </a>
          </p>
        </section>
      </div>
    </div>
  );
}
