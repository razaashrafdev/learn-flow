import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import {
  BookOpen,
  LayoutGrid,
  LogOut,
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
  Settings,
  Users,
  ClipboardList,
  CheckCircle2,
  User,
  UserRound,
  X,
} from "lucide-react";
import { toast } from "sonner";

import { useLms } from "@/lib/lms/store";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ThemeToggle } from "@/components/theme-toggle";

export type NavItem = { label: string; mobileLabel?: string; to: string; icon: typeof BookOpen; exact?: boolean };

export const studentNav: NavItem[] = [
  { label: "Dashboard", to: "/app/dashboard", icon: LayoutGrid },
  { label: "My Courses", to: "/app/my-courses", icon: BookOpen },
  { label: "Completed", to: "/app/completed", icon: CheckCircle2 },
  { label: "Profile", to: "/app/profile", icon: UserRound },
];

export const adminNav: NavItem[] = [
  { label: "Dashboard", to: "/admin/dashboard", icon: LayoutGrid },
  { label: "Courses", to: "/admin/courses", icon: BookOpen },
  { label: "Students", to: "/admin/students", icon: Users },
  { label: "Enrollments", to: "/admin/enrollments", icon: ClipboardList },
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
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const handleSignOut = () => {
    signOut();
    toast.success("Signed Out");
    navigate({ to: "/login", replace: true });
  };

  const sidebar = (
    <div className={cn(
      "flex h-full shrink-0 flex-col border-r border-sidebar-border bg-sidebar transition-all duration-300 ease-in-out",
      collapsed ? "w-[68px]" : "w-64"
    )}>
      <div className={cn("flex items-center gap-2.5 px-5 py-5", collapsed && "justify-center px-0")}>
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground">
          <UserRound className="h-5 w-5" />
        </span>
        {!collapsed && <span className="text-lg font-extrabold tracking-tight">Hamza Visuals</span>}
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="ml-auto rounded-md p-1.5 text-muted-foreground hover:bg-muted lg:hidden"
          aria-label="Close Navigation"
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
              title={collapsed ? item.label : undefined}
              className={cn(
                "flex items-center gap-3 rounded-lg py-2.5 text-sm font-medium transition-colors",
                collapsed ? "justify-center px-2" : "px-3",
                active
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              <item.icon className="h-[18px] w-[18px] shrink-0" />
              {!collapsed && <span className="truncate">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-sidebar-border p-3">
        <button
          type="button"
          onClick={handleSignOut}
          title={collapsed ? "Logout" : undefined}
          className={cn(
            "flex w-full items-center gap-3 rounded-lg py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
            collapsed ? "justify-center px-2" : "px-3"
          )}
        >
          <LogOut className="h-[18px] w-[18px]" />
          {!collapsed && "Logout"}
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
                className="hidden lg:flex"
                onClick={() => setCollapsed(!collapsed)}
                aria-label={collapsed ? "Expand Sidebar" : "Collapse Sidebar"}
              >
                {collapsed ? <PanelLeftOpen className="h-5 w-5" /> : <PanelLeftClose className="h-5 w-5" />}
              </Button>
              <div className="min-w-0">
                <h1 className="truncate text-lg font-bold sm:text-xl">{title}</h1>
                {subtitle ? (
                  <p className="truncate text-sm text-muted-foreground">{subtitle}</p>
                ) : null}
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              {actions}
              <ThemeToggle />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button type="button" className="cursor-pointer">
                    <Avatar className="h-8 w-8 shrink-0">
                      {currentUser?.avatar ? <AvatarImage src={currentUser.avatar} alt="" /> : null}
                      <AvatarFallback className="bg-primary-soft">
                        <User className="h-4 w-4 text-accent-foreground" />
                      </AvatarFallback>
                    </Avatar>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        <main className="flex-1 px-4 pb-24 pt-6 sm:px-6 sm:pb-6 lg:px-8 lg:pb-8">
          {children}
        </main>
      </div>

      <nav className="fixed bottom-4 left-4 right-4 z-40 flex rounded-2xl border border-border bg-background/95 shadow-lg backdrop-blur lg:hidden">
        {nav.map((item) => {
          const active = pathname === item.to || pathname.startsWith(item.to + "/");
          return (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                "flex flex-1 flex-col items-center gap-1 py-3 text-[10px] font-medium transition-colors",
                active
                  ? "text-primary"
                  : "text-muted-foreground",
              )}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.mobileLabel ?? item.label}</span>
            </Link>
          );
        })}
      </nav>
      <div className="pointer-events-none fixed bottom-0 left-0 right-0 z-30 h-24 bg-gradient-to-t from-background to-transparent lg:hidden" />
    </div>
  );
}
