import { createFileRoute } from "@tanstack/react-router";
import { LegalPageLayout } from "@/components/lms/ui-bits";

export const Route = createFileRoute("/privacy-policy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — Hamza Visuals" },
      { name: "description", content: "Privacy Policy for Hamza Visuals learning platform." },
    ],
  }),
  component: PrivacyPolicy,
});

function PrivacyPolicy() {
  return (
    <LegalPageLayout title="Privacy Policy" lastUpdated="August 11, 2026">
      <section>
        <h2 className="text-xl font-bold text-foreground">1. Information We Collect</h2>
        <p className="mt-3 leading-relaxed">
          When you use Hamza Visuals, we collect information that you provide directly, such as your name, email address, and password when you create an account. We also collect usage data including courses accessed, progress, and interaction with the platform.
        </p>
      </section>
      <section>
        <h2 className="text-xl font-bold text-foreground">2. How We Use Your Information</h2>
        <p className="mt-3 leading-relaxed">
          We use the information we collect to provide, maintain, and improve our services, including to track your learning progress, personalize your experience, communicate with you about updates and offers, and ensure the security of our platform.
        </p>
      </section>
      <section>
        <h2 className="text-xl font-bold text-foreground">3. Data Sharing</h2>
        <p className="mt-3 leading-relaxed">
          We do not sell your personal information. We may share your information with service providers who assist us in operating our platform, or when required by law. Your learning progress and course data are only visible to you and platform administrators.
        </p>
      </section>
      <section>
        <h2 className="text-xl font-bold text-foreground">4. Data Security</h2>
        <p className="mt-3 leading-relaxed">
          We implement appropriate security measures to protect your personal information. However, no method of transmission over the Internet is 100% secure, and we cannot guarantee absolute security.
        </p>
      </section>
      <section>
        <h2 className="text-xl font-bold text-foreground">5. Cookies</h2>
        <p className="mt-3 leading-relaxed">
          We use cookies and similar technologies to maintain your session, remember your preferences, and analyze usage patterns. You can control cookies through your browser settings.
        </p>
      </section>
      <section>
        <h2 className="text-xl font-bold text-foreground">6. Your Rights</h2>
        <p className="mt-3 leading-relaxed">
          You have the right to access, correct, or delete your personal information. You can manage your profile information through your account settings or contact us for assistance.
        </p>
      </section>
      <section>
        <h2 className="text-xl font-bold text-foreground">7. Changes to This Policy</h2>
        <p className="mt-3 leading-relaxed">
          We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last updated" date.
        </p>
      </section>
      <section>
        <h2 className="text-xl font-bold text-foreground">8. Contact Us</h2>
        <p className="mt-3 leading-relaxed">
          If you have any questions about this Privacy Policy, please contact us through our official channels or email us at support@hamzavisuals.com.
        </p>
      </section>
    </LegalPageLayout>
  );
}
