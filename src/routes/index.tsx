import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/Layout";
import { Section, SectionHeading } from "@/components/site/Section";
import { ArrowRight, Play, Zap, Heart, Star, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import heroImg from "@/assets/hero.jpg";
import reelFashion from "@/assets/reel-fashion.jpg";
import reelFood from "@/assets/reel-food.jpg";
import reelLifestyle from "@/assets/reel-lifestyle.jpg";
import reelTravel from "@/assets/reel-travel.jpg";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [{ title: "ReelFactory — Reels That Make Brands Unforgettable" }] }),
  component: HomePage,
});

const stats = [
  { num: "2.5K+", label: "Reels Delivered" },
  { num: "180+", label: "Happy Brands" },
  { num: "500M+", label: "Views Generated" },
  { num: "40+", label: "Countries Served" },
];

const services = [
  { icon: Play, title: "Short-Form Reels", desc: "Scroll-stopping vertical videos for IG, TikTok & Shorts.", color: "bg-pink" },
  { icon: Zap, title: "UGC Content", desc: "Authentic creator-style content that converts.", color: "bg-mint" },
  { icon: Heart, title: "Brand Storytelling", desc: "Cinematic narratives that build real connection.", color: "bg-lavender" },
  { icon: Star, title: "Ad Creatives", desc: "Performance-driven ads optimised for ROI.", color: "bg-butter" },
];

function HomePage() {
  const [members, setMembers] = useState<{ id: string; name: string; slug: string; role: string; photo_url: string | null }[]>([]);
  const [reviews, setReviews] = useState<{ id: string; reviewer_name: string; rating: number; review_text: string }[]>([]);

  useEffect(() => {
    supabase.from("team_members").select("id,name,slug,role,photo_url").order("display_order").limit(4).then(({ data }) => setMembers(data || []));
    supabase.from("member_reviews").select("id,reviewer_name,rating,review_text").limit(3).then(({ data }) => setReviews(data || []));
  }, []);

  return (
    <SiteLayout>
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 pt-10 md:pt-16 pb-12">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <div className="animate-fade-up">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card border shadow-sm text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4 text-primary" /> International reel-making agency
            </span>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-bold leading-[1.05] mb-6">
              Reels that make brands <span className="gradient-text">unforgettable</span>.
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-xl">
              We're a global creative studio crafting short-form content that stops the scroll, tells your story, and turns viewers into fans.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/contact" className="px-6 py-3.5 rounded-full gradient-btn text-primary-foreground font-semibold shadow-lg shadow-primary/30 hover:scale-105 transition inline-flex items-center gap-2">
                Start Your Project <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/reels" className="px-6 py-3.5 rounded-full bg-card border-2 font-semibold hover:bg-muted transition">Watch Our Reels</Link>
            </div>
          </div>
          <div className="relative animate-fade-up" style={{ animationDelay: "0.2s" }}>
            <div className="absolute -inset-8 gradient-bg-soft rounded-[3rem] blur-2xl" />
            <img src={heroImg} alt="Creator filming a reel" width={1536} height={1152} className="relative rounded-[2rem] shadow-2xl animate-float" />
            <div className="absolute -bottom-4 -left-4 bg-card rounded-2xl shadow-xl px-4 py-3 flex items-center gap-3 animate-bounce-soft">
              <div className="w-10 h-10 rounded-full bg-mint flex items-center justify-center"><Heart className="w-5 h-5 text-pink fill-pink" /></div>
              <div><p className="text-xs text-muted-foreground">Engagement</p><p className="font-bold">+340%</p></div>
            </div>
            <div className="absolute -top-4 -right-4 bg-card rounded-2xl shadow-xl px-4 py-3 flex items-center gap-3 animate-bounce-soft" style={{ animationDelay: "1s" }}>
              <div className="w-10 h-10 rounded-full bg-butter flex items-center justify-center"><Star className="w-5 h-5 text-primary fill-primary" /></div>
              <div><p className="text-xs text-muted-foreground">Avg rating</p><p className="font-bold">4.9 / 5</p></div>
            </div>
          </div>
        </div>
      </section>

      <Section className="!py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {stats.map((s, i) => (
            <div key={i} className="bg-card rounded-3xl p-6 md:p-8 text-center border shadow-sm hover:shadow-xl hover:-translate-y-1 transition">
              <p className="text-3xl md:text-4xl font-display font-bold gradient-text">{s.num}</p>
              <p className="text-sm text-muted-foreground mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section>
        <SectionHeading eyebrow="What we do" title="Content that moves people" subtitle="From a single hero reel to full-funnel campaigns — we've got the creative firepower." />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {services.map((s, i) => (
            <div key={i} className="group bg-card rounded-3xl p-6 border hover:shadow-xl hover:-translate-y-2 transition-all">
              <div className={`w-14 h-14 rounded-2xl ${s.color} flex items-center justify-center mb-4 group-hover:rotate-6 transition`}>
                <s.icon className="w-7 h-7 text-foreground" />
              </div>
              <h3 className="text-xl font-display font-bold mb-2">{s.title}</h3>
              <p className="text-sm text-muted-foreground">{s.desc}</p>
            </div>
          ))}
        </div>
        <div className="text-center mt-10">
          <Link to="/services" className="inline-flex items-center gap-2 text-primary font-semibold hover:gap-3 transition-all">See all services <ArrowRight className="w-4 h-4" /></Link>
        </div>
      </Section>

      <Section>
        <SectionHeading eyebrow="Our Feels" title="Recent work that hits different" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[reelFashion, reelFood, reelLifestyle, reelTravel].map((src, i) => (
            <div key={i} className="relative aspect-[9/16] rounded-3xl overflow-hidden group cursor-pointer">
              <img src={src} alt="Reel" loading="lazy" className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center"><Play className="w-7 h-7 text-primary fill-primary ml-1" /></div>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {members.length > 0 && (
        <Section>
          <SectionHeading eyebrow="Meet the team" title="The artists behind the magic" />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {members.map((m) => (
              <Link key={m.id} to="/artists/$slug" params={{ slug: m.slug }} className="group bg-card rounded-3xl overflow-hidden border hover:shadow-xl hover:-translate-y-2 transition">
                <div className="aspect-square overflow-hidden bg-muted">
                  {m.photo_url && <img src={m.photo_url} alt={m.name} loading="lazy" className="w-full h-full object-cover group-hover:scale-110 transition duration-500" />}
                </div>
                <div className="p-5">
                  <h3 className="font-display font-bold text-lg">{m.name}</h3>
                  <p className="text-sm text-muted-foreground">{m.role}</p>
                </div>
              </Link>
            ))}
          </div>
        </Section>
      )}

      {reviews.length > 0 && (
        <Section>
          <SectionHeading eyebrow="Loved by clients" title="What people say about us" />
          <div className="grid md:grid-cols-3 gap-5">
            {reviews.map((r) => (
              <div key={r.id} className="bg-card rounded-3xl p-6 border shadow-sm">
                <div className="flex gap-0.5 mb-3">{Array.from({ length: r.rating }).map((_, i) => <Star key={i} className="w-4 h-4 fill-primary text-primary" />)}</div>
                <p className="text-foreground mb-4">"{r.review_text}"</p>
                <p className="text-sm font-semibold">— {r.reviewer_name}</p>
              </div>
            ))}
          </div>
        </Section>
      )}

      <Section>
        <div className="relative rounded-[2.5rem] overflow-hidden gradient-btn p-10 md:p-16 text-center text-primary-foreground">
          <div className="relative">
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">Ready to make some magic?</h2>
            <p className="text-lg md:text-xl opacity-90 mb-8 max-w-2xl mx-auto">Let's create reels your audience will obsess over.</p>
            <Link to="/contact" className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-white text-primary font-bold shadow-xl hover:scale-105 transition">
              Let's Talk <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </Section>
    </SiteLayout>
  );
}
