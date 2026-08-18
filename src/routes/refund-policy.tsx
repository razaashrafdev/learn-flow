import { createFileRoute } from "@tanstack/react-router";
import { LegalPageLayout } from "@/components/lms/ui-bits";

export const Route = createFileRoute("/refund-policy")({
  head: () => ({
    meta: [
      { title: "Refund Policy — Hamza Visuals" },
      { name: "description", content: "Refund Policy for Hamza Visuals learning platform." },
    ],
  }),
  component: RefundPolicy,
});

function RefundPolicy() {
  return (
    <LegalPageLayout title="Refund Policy" lastUpdated="August 11, 2026">
      <section>
        <p className="leading-relaxed text-justify">
          At <strong>Hamza Visuals</strong>, we want you to have a positive learning experience with our courses. This Refund Policy explains how refunds are handled for paid courses and services purchased through our website.
        </p>
      </section>
      <section>
        <h2 className="mt-8 text-xl font-bold text-foreground">Refund Eligibility</h2>
        <p className="mt-3 leading-relaxed text-justify">
          Refunds are available only where a refund is permitted under the terms presented at the time of purchase. Because our courses provide immediate access to digital lessons, resources, downloads, templates, and other learning materials, access to course content may affect refund eligibility.
        </p>
        <p className="mt-3 leading-relaxed text-justify">
          If you believe you have a valid reason for requesting a refund, please contact us with your order details and reason for the request. Each request will be reviewed according to the applicable course terms.
        </p>
      </section>
      <section>
        <h2 className="mt-8 text-xl font-bold text-foreground">Refund Process</h2>
        <p className="mt-3 leading-relaxed text-justify">
          Approved refunds will be processed through the original payment method where possible. The time required for the refund to appear in your account may depend on the payment provider or financial institution.
        </p>
        <p className="mt-3 leading-relaxed text-justify">
          Once a refund is approved, access to the relevant course, lessons, downloads, and other associated resources may be removed. Hamza Visuals reserves the right to update this Refund Policy when necessary, and any changes will be published on this page with an updated <strong>Last Updated</strong> date.
        </p>
        <p className="mt-3 leading-relaxed text-justify">
          For refund-related questions or requests, please contact <strong>Hamza Visuals</strong> at <strong>hamzaa.visuals@gmail.com</strong>.
        </p>
      </section>
    </LegalPageLayout>
  );
}
