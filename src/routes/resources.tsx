import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, useMemo } from "react";
import { Download, Search, X, ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FadeInSection, PublicFooter } from "@/components/lms/ui-bits";
import { apiFetchResources } from "@/lib/api";
import type { Resource } from "@/lib/lms/types";

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

let _resourcesCache: { data: Resource[]; ts: number } | null = null;
const RESOURCES_CACHE_MS = 15_000;

function ResourceModal({
  resource,
  onClose,
}: {
  resource: Resource;
  onClose: () => void;
}) {
  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div
        className="relative mx-4 w-full max-w-lg max-h-[85vh] overflow-y-auto [border-radius:5px] border border-border bg-background shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-3 top-3 z-10 [border-radius:5px] bg-background/80 p-1.5 text-muted-foreground backdrop-blur transition-colors hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>

        {resource.image ? (
          <img
            src={resource.image}
            alt={resource.title}
            className="h-48 w-full object-cover"
          />
        ) : (
          <div className="flex h-48 w-full items-center justify-center bg-muted">
            <Download className="h-12 w-12 text-muted-foreground/40" />
          </div>
        )}

        <div className="p-5">
          <span className="inline-block rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary backdrop-blur-sm">
            {resource.type}
          </span>
          <h2 className="mt-2 text-lg font-bold">{resource.title}</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            {resource.description}
          </p>
          <div className="mt-5">
            <Button asChild className="w-full">
              <a href={resource.downloadUrl} target="_blank" rel="noopener noreferrer">
                <Download className="mr-1.5 h-4 w-4" /> Download
              </a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ResourcesPage() {
  const [resources, setResources] = useState<Resource[]>(() =>
    _resourcesCache && Date.now() - _resourcesCache.ts < RESOURCES_CACHE_MS
      ? _resourcesCache.data
      : [],
  );
  const [loading, setLoading] = useState(resources.length === 0);
  const [query, setQuery] = useState("");
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
  const [page, setPage] = useState(1);

  const DESKTOP_PAGE_SIZE = 24;
  const MOBILE_PAGE_SIZE = 10;

  useEffect(() => {
    if (_resourcesCache && Date.now() - _resourcesCache.ts < RESOURCES_CACHE_MS) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    apiFetchResources().then((r) => {
      if (cancelled) return;
      _resourcesCache = { data: r, ts: Date.now() };
      setResources(r);
      setLoading(false);
    });
    return () => { cancelled = true; };
  }, []);

  const filteredResources = useMemo(() => resources.filter(
    (r) =>
      r.title.toLowerCase().includes(query.toLowerCase()) ||
      r.description.toLowerCase().includes(query.toLowerCase()) ||
      r.type.toLowerCase().includes(query.toLowerCase()),
  ), [resources, query]);

  const totalPagesDesktop = Math.ceil(filteredResources.length / DESKTOP_PAGE_SIZE);
  const totalPagesMobile = Math.ceil(filteredResources.length / MOBILE_PAGE_SIZE);

  const paginatedResourcesDesktop = useMemo(() => {
    const start = (page - 1) * DESKTOP_PAGE_SIZE;
    return filteredResources.slice(start, start + DESKTOP_PAGE_SIZE);
  }, [filteredResources, page]);

  const paginatedResourcesMobile = useMemo(() => {
    const start = (page - 1) * MOBILE_PAGE_SIZE;
    return filteredResources.slice(start, start + MOBILE_PAGE_SIZE);
  }, [filteredResources, page]);

  const getPageNumbers = (currentPage: number, total: number) => {
    if (total <= 3) return Array.from({ length: total }, (_, i) => i + 1);
    if (currentPage <= 2) return [1, 2, 3];
    if (currentPage >= total - 1) return [total - 2, total - 1, total];
    return [currentPage - 1, currentPage, currentPage + 1];
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-background">
      <section className="relative bg-background py-10 sm:py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FadeInSection>
            <div className="max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setPage(1);
                  }}
                  placeholder="Search resources..."
                  className="pl-10"
                  maxLength={120}
                />
              </div>
            </div>
          </FadeInSection>

          {loading ? (
            <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="card-surface animate-pulse overflow-hidden">
                  <div className="aspect-video bg-muted" />
                  <div className="p-5 space-y-3">
                    <div className="h-5 w-3/4 rounded bg-muted" />
                    <div className="h-4 w-full rounded bg-muted" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredResources.length === 0 ? (
            <div className="mt-14 text-center">
              <Search className="mx-auto h-12 w-12 text-muted-foreground/50" />
              <p className="mt-4 text-lg font-semibold">No resources found</p>
              <p className="mt-1 text-sm text-muted-foreground">Try a different search term.</p>
            </div>
          ) : (
            <>
              {/* Desktop grid */}
              <div className="mt-8 hidden gap-6 sm:grid sm:grid-cols-2 lg:grid-cols-4">
                {paginatedResourcesDesktop.map((resource) => (
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
                      <span className="absolute right-2 top-2 rounded-full bg-primary/80 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary-foreground backdrop-blur-sm">
                        {resource.type}
                      </span>
                    </div>
                    <div className="p-5">
                      <h3 className="text-base font-bold leading-snug">{resource.title}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-muted-foreground line-clamp-2">
                        {resource.description}
                      </p>
                      <div className="mt-4">
                        <Button
                          variant="outline"
                          className="w-full text-xs"
                          onClick={() => setSelectedResource(resource)}
                        >
                          Click Here to Explore
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Mobile grid */}
              <div className="mt-8 grid gap-6 sm:hidden">
                {paginatedResourcesMobile.map((resource) => (
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
                      <span className="absolute right-2 top-2 rounded-full bg-primary/80 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary-foreground backdrop-blur-sm">
                        {resource.type}
                      </span>
                    </div>
                    <div className="p-5">
                      <h3 className="text-base font-bold leading-snug">{resource.title}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-muted-foreground line-clamp-2">
                        {resource.description}
                      </p>
                      <div className="mt-4">
                        <Button
                          variant="outline"
                          className="w-full text-xs"
                          onClick={() => setSelectedResource(resource)}
                        >
                          Click Here to Explore
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop pagination */}
              {totalPagesDesktop > 1 && (
                <div className="mt-10 hidden items-center justify-between sm:flex">
                  <p className="text-sm text-muted-foreground">
                    Total Resources: {filteredResources.length}
                  </p>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={page === 1}
                      onClick={() => handlePageChange(page - 1)}
                    >
                      Previous
                    </Button>
                    {getPageNumbers(page, totalPagesDesktop).map((p) => (
                      <Button
                        key={p}
                        variant={p === page ? "default" : "outline"}
                        size="sm"
                        onClick={() => handlePageChange(p)}
                      >
                        {p}
                      </Button>
                    ))}
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={page === totalPagesDesktop}
                      onClick={() => handlePageChange(page + 1)}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}

              {/* Mobile pagination */}
              {totalPagesMobile > 1 && (
                <div className="mt-8 flex items-center justify-center gap-2 sm:hidden">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page === 1}
                    onClick={() => handlePageChange(page - 1)}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  {getPageNumbers(page, totalPagesMobile).map((p) => (
                    <Button
                      key={p}
                      variant={p === page ? "default" : "outline"}
                      size="sm"
                      onClick={() => handlePageChange(p)}
                    >
                      {p}
                    </Button>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page === totalPagesMobile}
                    onClick={() => handlePageChange(page + 1)}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </>
          )}
        </div>

        {selectedResource && (
          <ResourceModal
            resource={selectedResource}
            onClose={() => setSelectedResource(null)}
          />
        )}
      </section>

      <PublicFooter />
    </div>
  );
}
