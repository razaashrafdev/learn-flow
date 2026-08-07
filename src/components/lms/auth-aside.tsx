import { BarChart3, CheckCircle2, PlayCircle } from "lucide-react";

export function AuthAside() {
  return (
    <aside className="relative hidden overflow-hidden bg-primary lg:block">
      <div className="absolute inset-0 opacity-25 [background:radial-gradient(60%_50%_at_20%_20%,white,transparent),radial-gradient(50%_50%_at_85%_75%,white,transparent)]" />
      <div className="relative flex h-full flex-col justify-center px-14 text-primary-foreground">
        <h2 className="max-w-md text-3xl font-extrabold leading-tight tracking-tight">
          A calmer way to teach and learn online.
        </h2>
        <p className="mt-4 max-w-md text-sm leading-relaxed text-primary-foreground/80">
          Lumen keeps course delivery simple: structured modules, video lessons and progress that
          tracks itself — nothing you have to babysit.
        </p>

        <ul className="mt-10 space-y-4 text-sm">
          {[
            { icon: PlayCircle, text: "Video lessons embedded straight from YouTube" },
            { icon: CheckCircle2, text: "Lesson-level completion and resume-where-you-left-off" },
            { icon: BarChart3, text: "Clear enrollment and progress reporting for admins" },
          ].map(({ icon: Icon, text }) => (
            <li key={text} className="flex items-start gap-3">
              <Icon className="mt-0.5 h-5 w-5 shrink-0 text-primary-foreground/90" />
              <span className="text-primary-foreground/90">{text}</span>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
