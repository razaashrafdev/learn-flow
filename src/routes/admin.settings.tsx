import { createFileRoute } from "@tanstack/react-router";

import { adminNav } from "@/components/lms/app-shell";
import { ProfileForms } from "./app.profile";

export const Route = createFileRoute("/admin/settings")({
  head: () => ({
    meta: [
      { title: "Settings — Hamza Visuals LMS admin" },
      { name: "description", content: "Update the administrator profile and password for your Hamza Visuals LMS platform." },
      { property: "og:title", content: "Settings — Hamza Visuals LMS admin" },
      { property: "og:description", content: "Administrator profile and password settings." },
    ],
  }),
  component: () => <ProfileForms nav={adminNav} title="Settings" />,
});
