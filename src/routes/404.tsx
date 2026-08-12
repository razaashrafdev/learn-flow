import { createFileRoute } from "@tanstack/react-router";

import { NotFoundPage } from "@/components/not-found";

export const Route = createFileRoute("/404")({
  head: () => ({
    meta: [
      { title: "Page Not Found — Hamza Visuals" },
      { name: "description", content: "This page could not be found on Hamza Visuals." },
    ],
  }),
  component: NotFoundPage,
});