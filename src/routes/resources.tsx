import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Download, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PublicFooter } from "@/components/lms/ui-bits";
import { useLms } from "@/lib/lms/store";

export const Route = createFileRoute("/resources")({
  head: () => ({
    meta: [
      { title: "Resources — Hamza Visuals LMS" },
      {
        name: "description",
        content:
          "Download free resources including UI kits, templates, guides, and more from Hamza Visuals.",
      },
      { property: "og:title", content: "Resources — Hamza Visuals LMS" },
      {
        property: "og:description",
        content: "Download free resources including UI kits, templates, guides, and more.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ResourcesPage,
});

function ResourcesPage() {
  const { data, syncCatalog } = useLms();
  const [query, setQuery] = useState("");

  useEffect(() => {
    void syncCatalog();
  }, [syncCatalog]);

  const filteredResources = data.resources.filter(
    (r) =>
      r.title.toLowerCase().includes(query.toLowerCase()) ||
      r.description.toLowerCase().includes(query.toLowerCase()) ||
      r.type.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-background">
      <section className="bg-background py-10 sm:py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search resources..."
                className="pl-10"
                maxLength={120}
              />
            </div>
          </div>

          {filteredResources.length === 0 ? (
            <div className="mt-14 text-center">
              <Search className="mx-auto h-12 w-12 text-muted-foreground/50" />
              <p className="mt-4 text-lg font-semibold">No resources found</p>
              <p className="mt-1 text-sm text-muted-foreground">Try a different search term.</p>
            </div>
          ) : (
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {filteredResources.map((resource) => (
                <div
                  key={resource.id}
                  className="group card-surface overflow-hidden transition-shadow hover:shadow-lg"
                >
                  <div className="relative aspect-video overflow-hidden">
                    {resource.image ? (
                      <img
                        src={resource.image}
                        alt={resource.title}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        loading="lazy"
                      />
                    ) : (
                      <div className="grid h-full w-full place-items-center bg-muted">
                        <Download className="h-10 w-10 text-muted-foreground/40" />
                      </div>
                    )}
                    <span className="absolute right-2 top-2 rounded-full bg-primary px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary-foreground">
                      {resource.type}
                    </span>
                  </div>
                  <div className="p-5">
                    <h3 className="text-base font-bold leading-snug">{resource.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground line-clamp-2">
                      {resource.description}
                    </p>
                    <div className="mt-4">
                      <Button asChild className="w-full text-base">
                        <a href={resource.downloadUrl} download>
                          Click Here to Explore
                        </a>
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
