import { createFileRoute } from "@tanstack/react-router";
import { LegalPageLayout } from "@/components/lms/ui-bits";

export const Route = createFileRoute("/terms-of-service")({
  head: () => ({
    meta: [
      { title: "Terms of Service — Hamza Visuals" },
      { name: "description", content: "Terms of Service for Hamza Visuals learning platform." },
    ],
  }),
  component: TermsOfService,
});

function TermsOfService() {
  return (
    <LegalPageLayout title="Terms of Service" lastUpdated="August 11, 2026">
      <section>
        <h2 className="text-xl font-bold text-foreground">1. Acceptance of Terms</h2>
        <p className="mt-3 leading-relaxed">
          By accessing and using Hamza Visuals, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our platform.
        </p>
      </section>
      <section>
        <h2 className="text-xl font-bold text-foreground">2. User Accounts</h2>
        <p className="mt-3 leading-relaxed">
          You are responsible for maintaining the confidentiality of your account credentials. You agree to notify us immediately of any unauthorized use of your account. You must be at least 13 years old to create an account.
        </p>
      </section>
      <section>
        <h2 className="text-xl font-bold text-foreground">3. Course Access</h2>
        <p className="mt-3 leading-relaxed">
          Free courses are available immediately upon enrollment. Paid courses require payment and administrative approval before access is granted. Course content is for personal learning only and may not be redistributed.
        </p>
      </section>
      <section>
        <h2 className="text-xl font-bold text-foreground">4. User Conduct</h2>
        <p className="mt-3 leading-relaxed">
          You agree not to misuse the platform, attempt to access other users' accounts, distribute malware, or engage in any activity that could harm the platform or its users. Automated access is prohibited without prior written consent.
        </p>
      </section>
      <section>
        <h2 className="text-xl font-bold text-foreground">5. Intellectual Property</h2>
        <p className="mt-3 leading-relaxed">
          All course content, including videos, materials, and course structure, is owned by Hamza Visuals or its content creators. You are granted a limited, non-exclusive license to access and view the content for personal learning purposes.
        </p>
      </section>
      <section>
        <h2 className="text-xl font-bold text-foreground">6. Payments</h2>
        <p className="mt-3 leading-relaxed">
          Paid courses are subject to the pricing displayed at the time of purchase. All payments are processed securely. Refund requests are handled according to our Refund Policy.
        </p>
      </section>
      <section>
        <h2 className="text-xl font-bold text-foreground">7. Limitation of Liability</h2>
        <p className="mt-3 leading-relaxed">
          Hamza Visuals is provided "as is" without warranties of any kind. We are not liable for any damages arising from your use of the platform, including but not limited to loss of data or learning progress.
        </p>
      </section>
      <section>
        <h2 className="text-xl font-bold text-foreground">8. Changes to Terms</h2>
        <p className="mt-3 leading-relaxed">
          We reserve the right to modify these terms at any time. Changes will be effective upon posting. Continued use of the platform after changes constitutes acceptance of the new terms.
        </p>
      </section>
      <section>
        <h2 className="text-xl font-bold text-foreground">9. Contact</h2>
        <p className="mt-3 leading-relaxed">
          For questions about these Terms of Service, please contact us through our official channels or email us at support@hamzavisuals.com.
        </p>
      </section>
    </LegalPageLayout>
  );
}
