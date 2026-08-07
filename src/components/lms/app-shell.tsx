import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import {
  BookOpen,
  GraduationCap,
  LayoutGrid,
  LogOut,
  Menu,
  Settings,
  Tags,
  Users,
  ClipboardList,
  TrendingUp,
  Compass,
  CheckCircle2,
  UserRound,
  X,
} from "lucide-react";
import { toast } from "sonner";

import { useLms } from "@/lib/lms/store";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export type NavItem = { label: string; to: string; icon: typeof BookOpen; exact?: boolean };

export const studentNav: NavItem[] = [
  { label: "Dashboard", to: "/app/dashboard", icon: LayoutGrid },
  { label: "My Courses", to: "/app/my-courses", icon: BookOpen },
  { label: "Browse Courses", to: "/app/courses", icon: Compass },
  { label: "Completed", to: "/app/completed", icon: CheckCircle2 },
  { label: "Profile", to: "/app/profile", icon: UserRound },
];

export const adminNav: NavItem[] = [
  { label: "Dashboard", to: "/admin/dashboard", icon: LayoutGrid },
  { label: "Courses", to: "/admin/courses", icon: BookOpen },
  { label: "Categories", to: "/admin/categories", icon: Tags },
  { label: "Students", to: "/admin/students", icon: Users },
  { label: "Enrollments", to: "/admin/enrollments", icon: ClipboardList },
  { label: "Progress", to: "/admin/progress", icon: TrendingUp },
  { label: "Settings", to: "/admin/settings", icon: Settings },
];

export function initials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function AppShell({
  nav,
  title,
  subtitle,
  actions,
  children,
}: {
  nav: NavItem[];
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  children: ReactNode;
}) {
  const { currentUser, signOut } = useLms();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const handleSignOut = () => {
    signOut();
    toast.success("Signed out");
    navigate({ to: "/", replace: true });
  };

  const sidebar = (
    <div className="flex h-full w-64 shrink-0 flex-col border-r border-sidebar-border bg-sidebar">
      <div className="flex items-center gap-2.5 px-5 py-5">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground">
          <GraduationCap className="h-5 w-5" />
        </span>
        <span className="text-lg font-extrabold tracking-tight">Lumen</span>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="ml-auto rounded-md p-1.5 text-muted-foreground hover:bg-muted lg:hidden"
          aria-label="Close navigation"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 pb-4">
        {nav.map((item) => {
          const active = pathname === item.to || pathname.startsWith(item.to + "/");
          return (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              <item.icon className="h-[18px] w-[18px] shrink-0" />
              <span className="truncate">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-sidebar-border p-3">
        <div className="mb-2 flex min-w-0 items-center gap-3 rounded-lg px-2 py-2">
          <Avatar className="h-9 w-9 shrink-0">
            {currentUser?.avatar ? <AvatarImage src={currentUser.avatar} alt="" /> : null}
            <AvatarFallback className="bg-primary-soft text-xs font-bold text-accent-foreground">
              {initials(currentUser?.name ?? "?")}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">{currentUser?.name}</p>
            <p className="truncate text-xs capitalize text-muted-foreground">{currentUser?.role}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={handleSignOut}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <LogOut className="h-[18px] w-[18px]" />
          Logout
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen w-full bg-background">
      <aside className="sticky top-0 hidden h-screen lg:block">{sidebar}</aside>

      {open ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-foreground/40"
            onClick={() => setOpen(false)}
            aria-hidden
          />
          <div className="absolute inset-y-0 left-0 h-full">{sidebar}</div>
        </div>
      ) : null}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 border-b border-border bg-background/85 backdrop-blur">
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-4 py-4 sm:px-6">
            <div className="flex min-w-0 items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                onClick={() => setOpen(true)}
                aria-label="Open navigation"
              >
                <Menu className="h-5 w-5" />
              </Button>
              <div className="min-w-0">
                <h1 className="truncate text-lg font-bold sm:text-xl">{title}</h1>
                {subtitle ? (
                  <p className="truncate text-sm text-muted-foreground">{subtitle}</p>
                ) : null}
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-2">{actions}</div>
          </div>
        </header>

        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
