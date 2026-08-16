import { Link } from "@tanstack/react-router";
import { Compass, House, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { PublicFooter } from "@/components/lms/ui-bits";

export function NotFoundPage() {
  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto flex min-h-[68vh] max-w-3xl flex-col items-center justify-center px-4 py-20 text-center sm:px-6">
        {/* Giant watermark number */}
        <div className="pointer-events-none select-none" aria-hidden="true">
          <span className="bg-gradient-to-b from-foreground/10 to-transparent bg-clip-text text-[10rem] font-extrabold leading-none tracking-tighter text-transparent sm:text-[13rem]">
            404
          </span>
        </div>

        <span className="mt-2 inline-flex items-center gap-2 rounded-full border border-border bg-muted/60 px-3 py-1 text-xs font-semibold text-muted-foreground">
          <Search className="h-3.5 w-3.5" /> Error — Page Not Found
        </span>

        <h1 className="mt-5 text-3xl font-extrabold tracking-tight sm:text-4xl">
          Lost in the learning maze?
        </h1>

        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
          <Button asChild size="lg" className="px-8">
            <Link to="/">
              <House className="h-4 w-4" /> Back to Home
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link to="/courses">
              <Compass className="h-4 w-4" /> Browse Courses
            </Link>
          </Button>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
