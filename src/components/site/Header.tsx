import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { to: "/" as const, label: "Home" },
  { to: "/services" as const, label: "Services" },
  { to: "/reels" as const, label: "Reels" },
  { to: "/artists" as const, label: "Artists" },
  { to: "/contact" as const, label: "Contact" },
];

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-background/70 border-b border-border/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-2xl gradient-btn flex items-center justify-center text-primary-foreground shadow-lg group-hover:rotate-12 transition-transform">
              <Sparkles className="w-5 h-5" />
            </div>
            <span className="font-display text-xl font-bold">
              reel<span className="gradient-text">factory</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                activeOptions={{ exact: l.to === "/" }}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-medium transition-all hover:bg-muted",
                )}
                activeProps={{ className: "bg-primary/10 text-primary" }}
              >
                {l.label}
              </Link>
            ))}
            <Link
              to="/contact"
              className="ml-2 px-5 py-2.5 rounded-full gradient-btn text-primary-foreground text-sm font-semibold shadow-lg shadow-primary/20 hover:shadow-xl hover:scale-105 transition-all"
            >
              Get a Quote
            </Link>
          </nav>

          <button
            className="md:hidden p-2 rounded-lg hover:bg-muted"
            onClick={() => setOpen(!open)}
            aria-label="Menu"
          >
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {open && (
          <div className="md:hidden pb-4 flex flex-col gap-1 animate-fade-up">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className="px-4 py-3 rounded-xl hover:bg-muted font-medium"
                activeProps={{ className: "bg-primary/10 text-primary" }}
              >
                {l.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </header>
  );
}
