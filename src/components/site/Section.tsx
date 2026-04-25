import { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Section({ children, className, id }: { children: ReactNode; className?: string; id?: string }) {
  return (
    <section id={id} className={cn("container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24", className)}>
      {children}
    </section>
  );
}

export function SectionHeading({ eyebrow, title, subtitle, center = true }: { eyebrow?: string; title: string; subtitle?: string; center?: boolean }) {
  return (
    <div className={cn("max-w-3xl mb-12", center && "mx-auto text-center")}>
      {eyebrow && (
        <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-4">
          {eyebrow}
        </span>
      )}
      <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-4">
        {title}
      </h2>
      {subtitle && <p className="text-lg text-muted-foreground">{subtitle}</p>}
    </div>
  );
}
