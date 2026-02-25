import { type ReactNode } from "react";

interface DocSectionProps {
  readonly id: string;
  readonly title: string;
  readonly children: ReactNode;
  readonly level?: 1 | 2 | 3;
}

export function DocSection({ id, title, children, level = 2 }: DocSectionProps) {
  const tagMap = { 1: "h1", 2: "h2", 3: "h3" } as const;
  const Tag = tagMap[level];
  const sizeMap = {
    1: "text-3xl font-bold",
    2: "text-2xl font-semibold",
    3: "text-lg font-semibold",
  } as const;
  const sizeClasses = sizeMap[level];

  return (
    <section id={id} className="scroll-mt-24 mb-12">
      <Tag
        className={`${sizeClasses} text-foreground font-(family-name:--font-poppins) mb-4 group flex items-center gap-2`}
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
      <div className="text-foreground/80 leading-relaxed space-y-4 font-(family-name:--font-inter)">
        {children}
      </div>
    </section>
  );
}
