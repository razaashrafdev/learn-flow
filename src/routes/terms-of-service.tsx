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
        <p className="leading-relaxed text-justify">
          By accessing or using <strong>Hamza Visuals</strong>, you agree to these Terms of Service. These terms apply to our website, courses, learning platform, downloadable resources, student dashboard, community features, and related services.
        </p>
      </section>
      <section>
        <h2 className="mt-8 text-xl font-bold text-foreground">Using Hamza Visuals</h2>
        <p className="mt-3 leading-relaxed text-justify">
          Hamza Visuals provides practical courses and educational resources focused on graphic design, video editing, AI, and related creative skills. You may use the website and its services for personal learning and legitimate educational purposes.
        </p>
        <p className="mt-3 leading-relaxed text-justify">
          When you create an account, you are responsible for providing accurate information and keeping your login details secure. You are also responsible for all activity carried out through your account.
        </p>
        <p className="mt-3 leading-relaxed text-justify">
          Course access, lessons, downloads, and other learning materials are provided according to the terms of the specific course you enroll in. Where lifetime access is offered, it applies to the applicable course and its available materials.
        </p>
        <p className="mt-3 leading-relaxed text-justify">
          You may not copy, redistribute, resell, reproduce, or publicly share paid courses, lessons, downloads, templates, prompt packs, project files, or other protected materials without permission from Hamza Visuals.
        </p>
      </section>
      <section>
        <h2 className="mt-8 text-xl font-bold text-foreground">Courses, Payments and Content</h2>
        <p className="mt-3 leading-relaxed text-justify">
          Some courses and resources are free, while others may require payment. Course pricing, access, and included materials may vary by course and will be presented before enrollment.
        </p>
        <p className="mt-3 leading-relaxed text-justify">
          All course content, including videos, written materials, designs, resources, templates, and other educational material provided by Hamza Visuals, remains the property of Hamza Visuals or its respective rights holders unless stated otherwise.
        </p>
        <p className="mt-3 leading-relaxed text-justify">
          The skills and information provided through our courses are intended for educational purposes. We do not guarantee a specific income, freelance opportunity, employment outcome, or professional result. Your results depend on how you apply the skills you learn.
        </p>
        <p className="mt-3 leading-relaxed text-justify">
          Community discussions and Q&A sessions are intended to support learning. Users are expected to communicate respectfully and must not use these features for harmful, abusive, misleading, or unauthorized activities.
        </p>
      </section>
      <section>
        <h2 className="mt-8 text-xl font-bold text-foreground">Changes and Contact</h2>
        <p className="mt-3 leading-relaxed text-justify">
          We may update, modify, suspend, or discontinue parts of the website, courses, resources, or services when necessary. We may also update these Terms from time to time, and the latest version will be published on this page with an updated <strong>Last Updated</strong> date.
        </p>
        <p className="mt-3 leading-relaxed text-justify">
          If you have questions about these Terms of Service, your course access, or any of our services, please contact <strong>Hamza Visuals</strong> at <strong>hamzaa.visuals@gmail.com</strong>.
        </p>
        <p className="mt-3 leading-relaxed text-justify">
          By continuing to use Hamza Visuals after changes to these terms are published, you agree to the updated Terms of Service.
        </p>
      </section>
    </LegalPageLayout>
  );
}
