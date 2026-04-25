import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/Layout";
import { Section, SectionHeading } from "@/components/site/Section";
import { ArrowRight, Check } from "lucide-react";
import reels from "@/assets/service-reels.jpg";
import ugc from "@/assets/service-ugc.jpg";
import brand from "@/assets/service-brand.jpg";
import podcast from "@/assets/service-podcast.jpg";
import ads from "@/assets/service-ads.jpg";
import motion from "@/assets/service-motion.jpg";

export const Route = createFileRoute("/services")({
  head: () => ({ meta: [
    { title: "Services — ReelFactory" },
    { name: "description", content: "Short-form reels, UGC, brand storytelling, podcast clips, ad creatives & motion graphics — full creative production for modern brands." },
    { property: "og:title", content: "Services — ReelFactory" },
    { property: "og:description", content: "Full-service short-form video production for brands worldwide." },
  ] }),
  component: ServicesPage,
});

const services = [
  { img: reels, title: "Short-Form Reels", desc: "Crafted vertical videos for Instagram, TikTok and YouTube Shorts that stop thumbs and start conversations.", features: ["Trend-driven concepts", "Captions & sound design", "Platform-native edits"] },
  { img: ugc, title: "UGC Content", desc: "Authentic, creator-style content that feels native and converts like nothing else.", features: ["Real creator delivery", "Multiple variations", "Usage rights included"] },
  { img: brand, title: "Brand Storytelling", desc: "Cinematic narrative pieces that build emotional connection with your audience.", features: ["Story strategy", "High-end production", "Long & short cuts"] },
  { img: podcast, title: "Podcast Clips", desc: "Turn long-form podcasts into a steady stream of bite-sized viral moments.", features: ["Highlight extraction", "Animated subtitles", "Branded templates"] },
  { img: ads, title: "Ad Creatives", desc: "Performance-tested ads engineered for hook, retention and conversion.", features: ["A/B variants", "Funnel-mapped", "Iterated weekly"] },
  { img: motion, title: "Motion Graphics", desc: "Custom animations, lower thirds and explainer pieces that elevate your content.", features: ["2D / 2.5D animation", "Brand-matched style", "Loopable assets"] },
];

const process = [
  { n: "01", t: "Brief", d: "We dig into your goals, audience and brand voice." },
  { n: "02", t: "Concept", d: "Hooks, storyboards and creative directions." },
  { n: "03", t: "Shoot", d: "Studio, location or fully remote — your call." },
  { n: "04", t: "Edit", d: "Sound, color, captions and platform polish." },
  { n: "05", t: "Deliver", d: "Multi-format exports ready to post." },
];

function ServicesPage() {
  return (
    <SiteLayout>
      <Section className="!pt-16 !pb-10">
        <SectionHeading eyebrow="What we offer" title="Creative services that scale" subtitle="From a single hero reel to full-funnel campaigns — pick what fits, mix what works." />
      </Section>

      <Section className="!pt-0">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((s, i) => (
            <div key={i} className="group bg-card rounded-3xl overflow-hidden border hover:shadow-2xl hover:-translate-y-2 transition-all">
              <div className="aspect-[4/3] overflow-hidden bg-muted">
                <img src={s.img} alt={s.title} loading="lazy" className="w-full h-full object-cover group-hover:scale-110 transition duration-500" />
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-display font-bold mb-2">{s.title}</h3>
                <p className="text-muted-foreground mb-4">{s.desc}</p>
                <ul className="space-y-2">
                  {s.features.map((f, j) => (
                    <li key={j} className="flex items-center gap-2 text-sm">
                      <span className="w-5 h-5 rounded-full bg-mint flex items-center justify-center"><Check className="w-3 h-3" /></span>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section>
        <SectionHeading eyebrow="How we work" title="Simple, fast, transparent" />
        <div className="grid md:grid-cols-5 gap-4">
          {process.map((p) => (
            <div key={p.n} className="bg-card rounded-3xl p-6 border text-center hover:shadow-xl transition">
              <p className="text-4xl font-display font-bold gradient-text mb-2">{p.n}</p>
              <h4 className="font-bold mb-1">{p.t}</h4>
              <p className="text-sm text-muted-foreground">{p.d}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section>
        <div className="rounded-[2.5rem] gradient-btn p-10 md:p-16 text-center text-primary-foreground">
          <h2 className="text-3xl md:text-5xl font-display font-bold mb-4">Got a project in mind?</h2>
          <p className="text-lg opacity-90 mb-8">Tell us about it — we'll come back with a creative plan within 48h.</p>
          <Link to="/contact" className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-white text-primary font-bold shadow-xl hover:scale-105 transition">
            Start a Project <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </Section>
    </SiteLayout>
  );
}
