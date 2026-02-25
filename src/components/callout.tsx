import { type ReactNode } from "react";
import { Info, AlertTriangle, CheckCircle } from "lucide-react";

interface CalloutProps {
  readonly type?: "info" | "warning" | "success";
  readonly title?: string;
  readonly children: ReactNode;
}

const variants = {
  info: {
    icon: Info,
    bg: "bg-brand-purple/[0.06] dark:bg-brand-purple/[0.08]",
    border: "border-brand-purple/20 dark:border-brand-purple/25",
    iconColor: "text-brand-purple dark:text-brand-purple-light",
    glass: "backdrop-blur-sm",
  },
  warning: {
    icon: AlertTriangle,
    bg: "bg-amber-50/80 dark:bg-amber-900/[0.15]",
    border: "border-amber-300/40 dark:border-amber-500/20",
    iconColor: "text-amber-600 dark:text-amber-400",
    glass: "backdrop-blur-sm",
  },
  success: {
    icon: CheckCircle,
    bg: "bg-brand-teal/[0.06] dark:bg-brand-teal/[0.08]",
    border: "border-brand-teal/20 dark:border-brand-teal/25",
    iconColor: "text-brand-teal dark:text-brand-teal-light",
    glass: "backdrop-blur-sm",
  },
};

export function Callout({ type = "info", title, children }: CalloutProps) {
  const v = variants[type];
  const Icon = v.icon;

  return (
    <div
      className={`${v.bg} ${v.border} ${v.glass} border rounded-xl p-4 my-4 flex gap-3`}
    >
      <Icon size={18} className={`${v.iconColor} shrink-0 mt-0.5`} />
      <div className="space-y-1 text-sm">
        {title && <p className="font-semibold text-foreground">{title}</p>}
        <div className="text-foreground/70 leading-relaxed">{children}</div>
      </div>
    </div>
  );
}
