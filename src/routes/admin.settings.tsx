import { createFileRoute } from "@tanstack/react-router";

import { adminNav } from "@/components/lms/app-shell";
import { ProfileForms } from "./app.profile";

export const Route = createFileRoute("/admin/settings")({
  head: () => ({
    meta: [
      { title: "Settings — Lumen LMS admin" },
      { name: "description", content: "Update the administrator profile and password for your Lumen LMS platform." },
      { property: "og:title", content: "Settings — Lumen LMS admin" },
      { property: "og:description", content: "Administrator profile and password settings." },
    ],
  }),
  component: () => <ProfileForms nav={adminNav} title="Settings" />,
});
