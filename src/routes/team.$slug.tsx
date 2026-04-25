import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/Layout";
import { Section } from "@/components/site/Section";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState, FormEvent } from "react";
import {
  Mail,
  Phone,
  ArrowLeft,
  Star,
  ChevronDown,
  Instagram,
  Twitter,
  Youtube,
  Linkedin,
  Music2,
  Globe,
  Sparkles,
  Calendar,
  Send,
  ExternalLink,
  Briefcase,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/team/$slug")({
  component: TeamMemberProfile,
});

type Member = {
  id: string;
  name: string;
  slug: string;
  role: string;
  photo_url: string | null;
  skills: string[] | null;
  phone: string | null;
  email: string | null;
  bio: string | null;
  availability_status: string | null;
  tagline: string | null;
};
type Review = { id: string; reviewer_name: string; rating: number; review_text: string };
type FAQ = { id: string; question: string; answer: string };
type Work = { id: string; title: string; description: string | null; image_url: string | null; link_url: string | null };
type Social = { id: string; platform: string; url: string };
type Experience = { id: string; title: string; company: string | null; start_year: number | null; end_year: number | null; description: string | null };

const SOCIAL_ICONS: Record<string, typeof Instagram> = {
  instagram: Instagram,
  twitter: Twitter,
  youtube: Youtube,
  linkedin: Linkedin,
  spotify: Music2,
};

function TeamMemberProfile() {
  const { slug } = Route.useParams();
  const [member, setMember] = useState<Member | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [works, setWorks] = useState<Work[]>([]);
  const [socials, setSocials] = useState<Social[]>([]);
  const [experience, setExperience] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [openFaq, setOpenFaq] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", project_type: "", budget: "", message: "" });

  useEffect(() => {
    (async () => {
      setLoading(true);
      const { data: m } = await supabase.from("team_members").select("*").eq("slug", slug).maybeSingle();
      setMember(m as Member | null);
      if (m) {
        const [{ data: r }, { data: f }, { data: w }, { data: s }, { data: e }] = await Promise.all([
          supabase.from("member_reviews").select("*").eq("member_id", m.id).order("created_at", { ascending: false }),
          supabase.from("member_faqs").select("*").eq("member_id", m.id).order("display_order"),
          supabase.from("member_works").select("*").eq("member_id", m.id).order("display_order"),
          supabase.from("member_socials").select("*").eq("member_id", m.id),
          supabase.from("member_experience").select("*").eq("member_id", m.id).order("display_order"),
        ]);
        setReviews((r as Review[]) || []);
        setFaqs((f as FAQ[]) || []);
        setWorks((w as Work[]) || []);
        setSocials((s as Social[]) || []);
        setExperience((e as Experience[]) || []);
      }
      setLoading(false);
    })();
  }, [slug]);

  async function handleBooking(e: FormEvent) {
    e.preventDefault();
    if (!member) return;
    setSubmitting(true);
    const { error } = await supabase.from("member_bookings").insert({ member_id: member.id, ...form });
    setSubmitting(false);
    if (error) {
      toast.error("Could not send your inquiry. Please try again.");
    } else {
      toast.success(`Inquiry sent to ${member.name}. They'll be in touch within 24h.`);
      setForm({ name: "", email: "", project_type: "", budget: "", message: "" });
    }
  }

  if (loading)
    return (
      <SiteLayout>
        <Section>
          <p className="text-center text-muted-foreground py-20">Loading…</p>
        </Section>
      </SiteLayout>
    );

  if (!member)
    return (
      <SiteLayout>
        <Section>
          <div className="text-center py-20">
            <h1 className="text-4xl font-display font-bold mb-4">Team member not found</h1>
            <Link to="/team" className="text-primary font-semibold">
              ← Back to the team
            </Link>
          </div>
        </Section>
      </SiteLayout>
    );

  const isAvailable = (member.availability_status ?? "available") === "available";
  const avgRating = reviews.length > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : 0;

  return (
    <SiteLayout>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute -top-32 -left-32 w-[600px] h-[600px] rounded-full bg-primary/20 blur-3xl" />
          <div className="absolute top-40 -right-32 w-[500px] h-[500px] rounded-full bg-accent/20 blur-3xl" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/0 via-background/40 to-background" />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-20">
          <Link to="/team" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-10 transition">
            <ArrowLeft className="w-4 h-4" /> All team members
          </Link>

          <div className="grid lg:grid-cols-[minmax(0,420px)_1fr] gap-12 items-center">
            {/* Photo */}
            <div className="relative animate-fade-in">
              <div className="absolute -inset-6 bg-gradient-to-br from-primary via-accent to-primary rounded-[3rem] blur-2xl opacity-60" />
              <div className="relative aspect-[4/5] rounded-[2.5rem] overflow-hidden bg-muted shadow-2xl ring-1 ring-border/50">
                {member.photo_url && <img src={member.photo_url} alt={member.name} className="w-full h-full object-cover" />}
                {isAvailable && (
                  <div className="absolute top-5 left-5 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-background/90 backdrop-blur border shadow-lg">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                    </span>
                    <span className="text-xs font-bold uppercase tracking-wider">Available</span>
                  </div>
                )}
                {avgRating > 0 && (
                  <div className="absolute bottom-5 right-5 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-background/90 backdrop-blur border shadow-lg">
                    <Star className="w-3.5 h-3.5 fill-primary text-primary" />
                    <span className="text-sm font-bold">{avgRating.toFixed(1)}</span>
                    <span className="text-xs text-muted-foreground">({reviews.length})</span>
                  </div>
                )}
              </div>
            </div>

            {/* Info */}
            <div className="animate-fade-in" style={{ animationDelay: "0.1s" }}>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest mb-5">
                <Sparkles className="w-3 h-3" /> {member.role}
              </div>
              <h1 className="text-5xl md:text-7xl font-display font-bold mb-4 tracking-tight bg-gradient-to-br from-foreground via-foreground to-foreground/60 bg-clip-text text-transparent">
                {member.name}
              </h1>
              {member.tagline && <p className="text-lg text-muted-foreground mb-3 italic">{member.tagline}</p>}
              {member.bio && <p className="text-lg leading-relaxed mb-7 max-w-2xl">{member.bio}</p>}

              {member.skills && member.skills.length > 0 && (
                <div className="mb-7">
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">Specialities</p>
                  <div className="flex flex-wrap gap-2">
                    {member.skills.map((s) => (
                      <span key={s} className="px-4 py-1.5 rounded-full bg-card border-2 text-sm font-semibold hover:border-primary transition">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Stats row */}
              <div className="grid grid-cols-3 gap-4 mb-8 max-w-md">
                <div className="bg-card border rounded-2xl p-4 text-center">
                  <div className="text-2xl font-display font-bold">{works.length}</div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wider">Projects</div>
                </div>
                <div className="bg-card border rounded-2xl p-4 text-center">
                  <div className="text-2xl font-display font-bold">{reviews.length}</div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wider">Reviews</div>
                </div>
                <div className="bg-card border rounded-2xl p-4 text-center">
                  <div className="text-2xl font-display font-bold">{experience.length > 0 ? `${new Date().getFullYear() - Math.min(...experience.map((x) => x.start_year ?? new Date().getFullYear()))}+` : "—"}</div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wider">Years</div>
                </div>
              </div>

              {/* CTAs */}
              <div className="flex flex-wrap gap-3 mb-6">
                <a href="#book" className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-foreground text-background font-semibold shadow-xl hover:scale-105 transition">
                  <Calendar className="w-4 h-4" /> Book {member.name.split(" ")[0]}
                </a>
                {member.email && (
                  <a href={`mailto:${member.email}`} className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-card border-2 font-semibold hover:bg-muted transition">
                    <Mail className="w-4 h-4" /> Email
                  </a>
                )}
                {member.phone && (
                  <a href={`tel:${member.phone}`} className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-card border-2 font-semibold hover:bg-muted transition">
                    <Phone className="w-4 h-4" /> Call
                  </a>
                )}
              </div>

              {/* Socials */}
              {socials.length > 0 && (
                <div className="flex items-center gap-3">
                  {socials.map((s) => {
                    const Icon = SOCIAL_ICONS[s.platform.toLowerCase()] ?? Globe;
                    return (
                      <a
                        key={s.id}
                        href={s.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 inline-flex items-center justify-center rounded-full bg-card border hover:bg-primary hover:text-primary-foreground hover:border-primary transition"
                        aria-label={s.platform}
                      >
                        <Icon className="w-4 h-4" />
                      </a>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* PORTFOLIO */}
      {works.length > 0 && (
        <Section>
          <div className="flex items-end justify-between mb-10 flex-wrap gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-primary mb-2">Selected Works</p>
              <h2 className="text-4xl md:text-5xl font-display font-bold">Portfolio</h2>
            </div>
            <p className="text-muted-foreground max-w-md">A curated look at recent projects, releases and collaborations.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {works.map((w, i) => (
              <a
                key={w.id}
                href={w.link_url ?? "#"}
                target={w.link_url ? "_blank" : undefined}
                rel="noopener noreferrer"
                className="group relative aspect-[4/5] rounded-3xl overflow-hidden bg-muted border shadow-sm hover:shadow-2xl transition-all hover:-translate-y-1"
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                {w.image_url && <img src={w.image_url} alt={w.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                <div className="absolute bottom-0 inset-x-0 p-6 text-white">
                  <h3 className="text-xl font-display font-bold mb-1 flex items-center gap-2">
                    {w.title}
                    {w.link_url && <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition" />}
                  </h3>
                  {w.description && <p className="text-sm text-white/80 line-clamp-2">{w.description}</p>}
                </div>
              </a>
            ))}
          </div>
        </Section>
      )}

      {/* EXPERIENCE TIMELINE */}
      {experience.length > 0 && (
        <Section>
          <div className="grid lg:grid-cols-[1fr_2fr] gap-12">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-primary mb-2">Career</p>
              <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">Experience</h2>
              <p className="text-muted-foreground">A track record of building, shipping and shaping creative projects.</p>
            </div>
            <ol className="relative border-l-2 border-border space-y-8 pl-8">
              {experience.map((x) => (
                <li key={x.id} className="relative">
                  <span className="absolute -left-[42px] flex items-center justify-center w-10 h-10 rounded-full bg-primary text-primary-foreground ring-4 ring-background">
                    <Briefcase className="w-4 h-4" />
                  </span>
                  <div className="bg-card border rounded-2xl p-6 shadow-sm">
                    <div className="flex flex-wrap items-baseline justify-between gap-2 mb-1">
                      <h3 className="text-lg font-display font-bold">{x.title}</h3>
                      <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        {x.start_year}{x.end_year ? ` — ${x.end_year}` : " — Present"}
                      </span>
                    </div>
                    {x.company && <p className="text-sm font-semibold text-primary mb-2">{x.company}</p>}
                    {x.description && <p className="text-sm text-muted-foreground">{x.description}</p>}
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </Section>
      )}

      {/* REVIEWS */}
      {reviews.length > 0 && (
        <Section>
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-10">What clients say</h2>
          <div className="grid md:grid-cols-2 gap-5">
            {reviews.map((r) => (
              <div key={r.id} className="bg-card rounded-3xl p-7 border shadow-sm hover:shadow-lg transition">
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: r.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                  ))}
                </div>
                <p className="mb-4 text-lg leading-relaxed">"{r.review_text}"</p>
                <p className="text-sm font-semibold">— {r.reviewer_name}</p>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* FAQ */}
      {faqs.length > 0 && (
        <Section>
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-10">Frequently asked</h2>
          <div className="max-w-3xl space-y-3">
            {faqs.map((f) => (
              <div key={f.id} className="bg-card rounded-2xl border overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === f.id ? null : f.id)}
                  className="w-full flex items-center justify-between p-5 text-left font-semibold hover:bg-muted/50 transition"
                >
                  <span>{f.question}</span>
                  <ChevronDown className={`w-5 h-5 transition ${openFaq === f.id ? "rotate-180" : ""}`} />
                </button>
                {openFaq === f.id && <div className="px-5 pb-5 text-muted-foreground animate-fade-in">{f.answer}</div>}
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* BOOKING CTA */}
      <Section id="book" className="!pb-32">
        <div className="relative overflow-hidden rounded-[2.5rem] border bg-card shadow-xl">
          <div className="absolute inset-0 -z-10 opacity-50">
            <div className="absolute -top-20 -right-20 w-96 h-96 rounded-full bg-primary/30 blur-3xl" />
            <div className="absolute -bottom-20 -left-20 w-96 h-96 rounded-full bg-accent/30 blur-3xl" />
          </div>
          <div className="grid lg:grid-cols-2 gap-10 p-8 md:p-12">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-primary mb-3">Get in touch</p>
              <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">Work with {member.name.split(" ")[0]}</h2>
              <p className="text-lg text-muted-foreground mb-6">
                Tell us about your project. We'll review and get back to you within 24 hours.
              </p>
              <ul className="space-y-3">
                {[
                  "Free 30-minute discovery call",
                  "Tailored creative proposal",
                  "Transparent pricing & timeline",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <form onSubmit={handleBooking} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <input
                  required
                  placeholder="Your name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-background border-2 focus:border-primary outline-none transition"
                />
                <input
                  required
                  type="email"
                  placeholder="Email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-background border-2 focus:border-primary outline-none transition"
                />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <select
                  value={form.project_type}
                  onChange={(e) => setForm({ ...form, project_type: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-background border-2 focus:border-primary outline-none transition"
                >
                  <option value="">Project type…</option>
                  <option>Recording / Production</option>
                  <option>Live performance</option>
                  <option>Brand collaboration</option>
                  <option>Mentorship</option>
                  <option>Other</option>
                </select>
                <select
                  value={form.budget}
                  onChange={(e) => setForm({ ...form, budget: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-background border-2 focus:border-primary outline-none transition"
                >
                  <option value="">Budget…</option>
                  <option>Under $5k</option>
                  <option>$5k — $15k</option>
                  <option>$15k — $50k</option>
                  <option>$50k+</option>
                </select>
              </div>
              <textarea
                required
                rows={5}
                placeholder="Tell us about your project…"
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-background border-2 focus:border-primary outline-none transition resize-none"
              />
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center justify-center gap-2 w-full px-6 py-4 rounded-xl bg-foreground text-background font-bold shadow-lg hover:scale-[1.02] transition disabled:opacity-50"
              >
                {submitting ? "Sending…" : (<><Send className="w-4 h-4" /> Send inquiry</>)}
              </button>
            </form>
          </div>
        </div>
      </Section>
    </SiteLayout>
  );
}
