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
        <p className="leading-relaxed text-justify">
          At <strong>Hamza Visuals</strong>, your privacy matters to us. This Privacy Policy explains how we collect, use, and protect your information when you use our website, create an account, enroll in courses, or access our learning platform.
        </p>
      </section>
      <section>
        <h2 className="mt-8 text-xl font-bold text-foreground">Information We Collect</h2>
        <p className="mt-3 leading-relaxed text-justify">
          When you create an account, enroll in a course, contact us, or use our learning platform, we may collect information such as your name, email address, account details, course enrollment, learning progress, and information you choose to provide.
        </p>
        <p className="mt-3 leading-relaxed text-justify">
          We use this information to manage your account, provide access to courses and resources, track your learning progress, provide support, and improve our website, courses, and overall learning experience.
        </p>
        <p className="mt-3 leading-relaxed text-justify">
          Our website may also use cookies and similar technologies to remember preferences, maintain sessions, and understand how visitors use the website. We may use trusted third-party services for payments, hosting, analytics, communications, and other services needed to operate the platform.
        </p>
      </section>
      <section>
        <h2 className="mt-8 text-xl font-bold text-foreground">Your Privacy</h2>
        <p className="mt-3 leading-relaxed text-justify">
          We take reasonable steps to protect your personal information from unauthorized access, misuse, or disclosure. We retain information only when necessary to provide our services, maintain your account, or meet legal and business requirements.
        </p>
        <p className="mt-3 leading-relaxed text-justify">
          Depending on applicable law, you may request access to, correction of, or deletion of certain personal information. If you have questions about how your information is handled, you can contact us.
        </p>
        <p className="mt-3 leading-relaxed text-justify">
          We may update this Privacy Policy from time to time. Any changes will be published on this page with an updated <strong>Last Updated</strong> date.
        </p>
        <p className="mt-3 leading-relaxed text-justify">
          For privacy-related questions or requests, contact <strong>Hamza Visuals</strong> at <strong>support@hamzavisual.com</strong>.
        </p>
      </section>
    </LegalPageLayout>
  );
}
