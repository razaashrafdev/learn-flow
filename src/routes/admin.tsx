import { createFileRoute, Outlet } from "@tanstack/react-router";

import { RoleGate } from "@/components/lms/role-gate";

export const Route = createFileRoute("/admin")({
  component: () => (
    <RoleGate role="admin">
      <Outlet />
    </RoleGate>
  ),
});
