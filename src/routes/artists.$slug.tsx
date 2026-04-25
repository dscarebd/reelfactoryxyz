import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/Layout";
import { Section } from "@/components/site/Section";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { Mail, Phone, ArrowLeft, Star, ChevronDown } from "lucide-react";

export const Route = createFileRoute("/artists/$slug")({
  component: ArtistProfile,
});

type Member = { id: string; name: string; slug: string; role: string; photo_url: string | null; skills: string[] | null; phone: string | null; email: string | null; bio: string | null };
type Review = { id: string; reviewer_name: string; rating: number; review_text: string };
type FAQ = { id: string; question: string; answer: string };

function ArtistProfile() {
  const { slug } = Route.useParams();
  const [member, setMember] = useState<Member | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [openFaq, setOpenFaq] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { data: m } = await supabase.from("team_members").select("*").eq("slug", slug).maybeSingle();
      setMember(m as Member | null);
      if (m) {
        const [{ data: r }, { data: f }] = await Promise.all([
          supabase.from("member_reviews").select("*").eq("member_id", m.id).order("created_at", { ascending: false }),
          supabase.from("member_faqs").select("*").eq("member_id", m.id).order("display_order"),
        ]);
        setReviews((r as Review[]) || []);
        setFaqs((f as FAQ[]) || []);
      }
      setLoading(false);
    })();
  }, [slug]);

  if (loading) return <SiteLayout><Section><p className="text-center text-muted-foreground py-20">Loading…</p></Section></SiteLayout>;
  if (!member) return (
    <SiteLayout>
      <Section>
        <div className="text-center py-20">
          <h1 className="text-4xl font-display font-bold mb-4">Artist not found</h1>
          <Link to="/artists" className="text-primary font-semibold">← Back to all artists</Link>
        </div>
      </Section>
    </SiteLayout>
  );

  return (
    <SiteLayout>
      <Section className="!pt-12">
        <Link to="/artists" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-8">
          <ArrowLeft className="w-4 h-4" /> All artists
        </Link>

        <div className="grid md:grid-cols-[1fr_2fr] gap-10 items-start">
          <div className="relative animate-fade-up">
            <div className="absolute -inset-4 gradient-bg-soft rounded-[2.5rem] blur-xl" />
            <div className="relative aspect-square rounded-[2rem] overflow-hidden bg-muted shadow-2xl">
              {member.photo_url && <img src={member.photo_url} alt={member.name} className="w-full h-full object-cover" />}
            </div>
          </div>
          <div className="animate-fade-up" style={{ animationDelay: "0.1s" }}>
            <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-2">{member.role}</p>
            <h1 className="text-5xl md:text-6xl font-display font-bold mb-4">{member.name}</h1>
            {member.bio && <p className="text-lg text-muted-foreground mb-6">{member.bio}</p>}

            {member.skills && member.skills.length > 0 && (
              <div className="mb-6">
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Skills</p>
                <div className="flex flex-wrap gap-2">
                  {member.skills.map((s) => (
                    <span key={s} className="px-3 py-1.5 rounded-full bg-card border text-sm font-medium">{s}</span>
                  ))}
                </div>
              </div>
            )}

            <div className="flex flex-wrap gap-3">
              {member.email && (
                <a href={`mailto:${member.email}`} className="inline-flex items-center gap-2 px-5 py-3 rounded-full gradient-btn text-primary-foreground font-semibold shadow-lg hover:scale-105 transition">
                  <Mail className="w-4 h-4" /> {member.email}
                </a>
              )}
              {member.phone && (
                <a href={`tel:${member.phone}`} className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-card border-2 font-semibold hover:bg-muted transition">
                  <Phone className="w-4 h-4" /> {member.phone}
                </a>
              )}
            </div>
          </div>
        </div>
      </Section>

      {reviews.length > 0 && (
        <Section>
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-8">What clients say</h2>
          <div className="grid md:grid-cols-2 gap-5">
            {reviews.map((r) => (
              <div key={r.id} className="bg-card rounded-3xl p-6 border shadow-sm">
                <div className="flex gap-0.5 mb-3">
                  {Array.from({ length: r.rating }).map((_, i) => <Star key={i} className="w-4 h-4 fill-primary text-primary" />)}
                </div>
                <p className="mb-4">"{r.review_text}"</p>
                <p className="text-sm font-semibold">— {r.reviewer_name}</p>
              </div>
            ))}
          </div>
        </Section>
      )}

      {faqs.length > 0 && (
        <Section>
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-8">Frequently asked</h2>
          <div className="max-w-3xl space-y-3">
            {faqs.map((f) => (
              <div key={f.id} className="bg-card rounded-2xl border overflow-hidden">
                <button onClick={() => setOpenFaq(openFaq === f.id ? null : f.id)} className="w-full flex items-center justify-between p-5 text-left font-semibold hover:bg-muted/50 transition">
                  <span>{f.question}</span>
                  <ChevronDown className={`w-5 h-5 transition ${openFaq === f.id ? "rotate-180" : ""}`} />
                </button>
                {openFaq === f.id && <div className="px-5 pb-5 text-muted-foreground animate-fade-up">{f.answer}</div>}
              </div>
            ))}
          </div>
        </Section>
      )}
    </SiteLayout>
  );
}
