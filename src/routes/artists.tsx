import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/Layout";
import { Section, SectionHeading } from "@/components/site/Section";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";

export const Route = createFileRoute("/artists")({
  head: () => ({ meta: [
    { title: "Artists — ReelFactory" },
    { name: "description", content: "Meet the directors, editors, creators and producers behind ReelFactory's standout work." },
    { property: "og:title", content: "Our Artists — ReelFactory" },
    { property: "og:description", content: "The talented team crafting reels for brands worldwide." },
  ] }),
  component: ArtistsPage,
});

type Member = { id: string; name: string; slug: string; role: string; photo_url: string | null; skills: string[] | null };

function ArtistsPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from("team_members").select("id,name,slug,role,photo_url,skills").order("display_order").then(({ data }) => {
      setMembers(data || []);
      setLoading(false);
    });
  }, []);

  return (
    <SiteLayout>
      <Section className="!pt-16 !pb-8">
        <SectionHeading eyebrow="Meet the crew" title="The artists behind every reel" subtitle="A small, multidisciplinary team of directors, editors, creators and strategists." />
      </Section>

      <Section className="!pt-4">
        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-card rounded-3xl overflow-hidden border animate-pulse">
                <div className="aspect-square bg-muted" />
                <div className="p-6 space-y-3"><div className="h-5 bg-muted rounded w-2/3" /><div className="h-4 bg-muted rounded w-1/2" /></div>
              </div>
            ))}
          </div>
        ) : members.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground">No artists yet. Add some from the admin panel!</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {members.map((m, i) => (
              <Link key={m.id} to="/artists/$slug" params={{ slug: m.slug }} className="group bg-card rounded-3xl overflow-hidden border hover:shadow-2xl hover:-translate-y-2 transition-all animate-fade-up" style={{ animationDelay: `${i * 0.06}s` }}>
                <div className="aspect-square overflow-hidden bg-muted relative">
                  {m.photo_url && <img src={m.photo_url} alt={m.name} loading="lazy" className="w-full h-full object-cover group-hover:scale-110 transition duration-500" />}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition" />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-display font-bold">{m.name}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{m.role}</p>
                  {m.skills && m.skills.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {m.skills.slice(0, 3).map((s) => (
                        <span key={s} className="text-xs px-2.5 py-1 rounded-full bg-muted">{s}</span>
                      ))}
                    </div>
                  )}
                  <span className="inline-flex items-center gap-1 text-sm font-semibold text-primary group-hover:gap-2 transition-all">
                    View profile <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </Section>
    </SiteLayout>
  );
}
