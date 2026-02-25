import { type ReactNode } from "react";

interface DocSectionProps {
  id: string;
  title: string;
  children: ReactNode;
  level?: 1 | 2 | 3;
}

export function DocSection({ id, title, children, level = 2 }: DocSectionProps) {
  const Tag = level === 1 ? "h1" : level === 2 ? "h2" : "h3";
  const sizeClasses =
    level === 1
      ? "text-3xl font-bold"
      : level === 2
      ? "text-2xl font-semibold"
      : "text-lg font-semibold";

  return (
    <section id={id} className="scroll-mt-24 mb-12">
      <Tag
        className={`${sizeClasses} text-foreground font-[family-name:var(--font-poppins)] mb-4 group flex items-center gap-2`}
      >
        <a
          href={`#${id}`}
          className="hover:text-brand-purple dark:hover:text-brand-purple-light transition-colors"
        >
          {title}
        </a>
        <span className="opacity-0 group-hover:opacity-100 transition-opacity text-brand-purple/40 text-sm">
          #
        </span>
      </Tag>
      <div className="text-foreground/80 leading-relaxed space-y-4 font-[family-name:var(--font-inter)]">
        {children}
      </div>
    </section>
  );
}
