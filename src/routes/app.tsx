import { createFileRoute, Outlet } from "@tanstack/react-router";

import { RoleGate } from "@/components/lms/role-gate";

export const Route = createFileRoute("/app")({
  component: () => (
    <RoleGate role="student">
      <Outlet />
    </RoleGate>
  ),
});
