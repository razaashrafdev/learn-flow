import { useNavigate } from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";
import { Loader2 } from "lucide-react";

import { useLms } from "@/lib/lms/store";
import type { Role } from "@/lib/lms/types";

/**
 * Frontend-only route protection. When a real backend is added this should be
 * paired with server-side authorization.
 */
export function RoleGate({ role, children }: { role: Role; children: ReactNode }) {
  const { ready, currentUser } = useLms();
  const navigate = useNavigate();

  useEffect(() => {
    if (!ready) return;
    if (!currentUser) {
      navigate({ to: "/", replace: true });
    } else if (currentUser.role !== role) {
      navigate({ to: currentUser.role === "admin" ? "/admin/dashboard" : "/app/dashboard", replace: true });
    }
  }, [ready, currentUser, role, navigate]);

  if (!ready || !currentUser || currentUser.role !== role) {
    return (
      <div className="grid min-h-screen place-items-center bg-background">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return <>{children}</>;
}
