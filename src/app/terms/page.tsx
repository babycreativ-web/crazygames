import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms & Conditions - CrazyArcade",
  description: "Read the terms and conditions for using CrazyArcade, the free online gaming platform.",
};

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 md:py-16">
      <h1 className="text-3xl font-bold text-slate-100 md:text-4xl tracking-tight mb-2">
        Terms &amp; Conditions
      </h1>
      <p className="text-xs text-slate-500 mb-8">Last updated: June 2026</p>

      <div className="flex flex-col gap-6 text-sm text-slate-400 leading-relaxed">
        <section>
          <h2 className="text-lg font-bold text-slate-200 mb-2">1. Acceptance of Terms</h2>
          <p>
            By accessing and using CrazyArcade (&quot;the Website&quot;), you accept and agree to be bound by these 
            Terms and Conditions. If you do not agree to these terms, please do not use the Website.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-slate-200 mb-2">2. Use of the Service</h2>
          <p>
            CrazyArcade provides free online HTML5 games for entertainment purposes. You agree to use the 
            Website only for lawful purposes and in a way that does not infringe on the rights of others or 
            restrict their use and enjoyment of the Website.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-slate-200 mb-2">3. User Accounts</h2>
          <p>
            Some features may require creating an account. You are responsible for maintaining the 
            confidentiality of your account credentials and for all activities that occur under your account. 
            You must notify us immediately of any unauthorized use of your account.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-slate-200 mb-2">4. Intellectual Property</h2>
          <p>
            All content on CrazyArcade, including but not limited to text, graphics, logos, and software, 
            is the property of CrazyArcade or its content suppliers and is protected by international 
            copyright laws. Games hosted on the platform remain the property of their respective developers.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-slate-200 mb-2">5. Third-Party Content</h2>
          <p>
            Games available on CrazyArcade are provided by third-party developers. We do not guarantee 
            the quality, accuracy, or appropriateness of third-party content. We are not liable for any 
            issues arising from the use of third-party games.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-slate-200 mb-2">6. Advertising</h2>
          <p>
            The Website may display advertisements. By using CrazyArcade, you agree that we may show 
            advertisements during your use of the service. We strive to ensure ads are appropriate and 
            non-intrusive.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-slate-200 mb-2">7. Limitation of Liability</h2>
          <p>
            CrazyArcade is provided &quot;as is&quot; without warranties of any kind. We shall not be liable for 
            any damages arising from the use or inability to use the Website, including but not limited to 
            direct, indirect, incidental, or consequential damages.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-slate-200 mb-2">8. Changes to Terms</h2>
          <p>
            We reserve the right to modify these terms at any time. Changes will be effective immediately 
            upon posting to the Website. Your continued use of the Website after changes are posted 
            constitutes your acceptance of the updated terms.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-slate-200 mb-2">9. Contact</h2>
          <p>
            If you have any questions about these Terms and Conditions, please contact us at{" "}
            <a href="mailto:babycreativ@gmail.com" className="text-violet-400 hover:text-pink-400 transition-colors font-medium">
              babycreativ@gmail.com
            </a>
          </p>
        </section>
      </div>
    </div>
  );
}
