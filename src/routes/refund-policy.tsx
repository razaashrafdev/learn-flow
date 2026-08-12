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
        <h2 className="text-xl font-bold text-foreground">1. Refund Eligibility</h2>
        <p className="mt-3 leading-relaxed">
          We offer refunds for paid courses within 30 days of purchase, provided that you have not completed more than 20% of the course content. Free courses are not subject to refunds as no payment is required.
        </p>
      </section>
      <section>
        <h2 className="text-xl font-bold text-foreground">2. How to Request a Refund</h2>
        <p className="mt-3 leading-relaxed">
          To request a refund, please contact our support team with your account email, course name, and reason for the refund request. We will process your request within 5-7 business days.
        </p>
      </section>
      <section>
        <h2 className="text-xl font-bold text-foreground">3. Refund Processing</h2>
        <p className="mt-3 leading-relaxed">
          Approved refunds will be processed to the original payment method within 5-10 business days. You will receive an email confirmation once the refund has been processed.
        </p>
      </section>
      <section>
        <h2 className="text-xl font-bold text-foreground">4. Non-Refundable Items</h2>
        <ul className="mt-3 space-y-2">
          <li className="flex items-start gap-2">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
            Free courses and enrolled content
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
            Courses completed beyond 20% progress
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
            Requests made after 30 days of purchase
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
            Accounts terminated for violation of Terms of Service
          </li>
        </ul>
      </section>
      <section>
        <h2 className="text-xl font-bold text-foreground">5. Subscription Refunds</h2>
        <p className="mt-3 leading-relaxed">
          If you have an active subscription, you may cancel at any time. Your access will continue until the end of the current billing period. No partial refunds are provided for unused portions of a billing period.
        </p>
      </section>
      <section>
        <h2 className="text-xl font-bold text-foreground">6. Disputed Charges</h2>
        <p className="mt-3 leading-relaxed">
          If you believe you were charged in error, please contact us immediately. We will investigate and resolve any billing disputes promptly. Chargebacks filed without contacting us first may result in account suspension.
        </p>
      </section>
      <section>
        <h2 className="text-xl font-bold text-foreground">7. Changes to This Policy</h2>
        <p className="mt-3 leading-relaxed">
          We reserve the right to update this Refund Policy at any time. Changes will be effective upon posting. The refund policy in effect at the time of your purchase will apply to your transaction.
        </p>
      </section>
      <section>
        <h2 className="text-xl font-bold text-foreground">8. Contact Us</h2>
        <p className="mt-3 leading-relaxed">
          For refund requests or questions about this policy, please contact us through our official channels or email us at support@hamzavisuals.com. We are committed to resolving any issues promptly.
        </p>
      </section>
    </LegalPageLayout>
  );
}
