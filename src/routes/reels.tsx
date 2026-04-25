import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/Layout";
import { Section, SectionHeading } from "@/components/site/Section";
import { Play } from "lucide-react";
import { useState } from "react";
import fashion from "@/assets/reel-fashion.jpg";
import food from "@/assets/reel-food.jpg";
import tech from "@/assets/reel-tech.jpg";
import lifestyle from "@/assets/reel-lifestyle.jpg";
import fitness from "@/assets/reel-fitness.jpg";
import beauty from "@/assets/reel-beauty.jpg";
import travel from "@/assets/reel-travel.jpg";
import gaming from "@/assets/reel-gaming.jpg";

export const Route = createFileRoute("/reels")({
  head: () => ({ meta: [
    { title: "Our Reels — ReelFactory" },
    { name: "description", content: "A curated showcase of our best short-form work across fashion, food, tech, lifestyle, fitness and more." },
    { property: "og:title", content: "Our Reels — ReelFactory" },
    { property: "og:description", content: "Reels that move people — explore our recent work." },
  ] }),
  component: ReelsPage,
});

const reels = [
  { img: fashion, title: "Pink Era", category: "Fashion" },
  { img: food, title: "Plate Stories", category: "Food" },
  { img: tech, title: "Smart Pocket", category: "Tech" },
  { img: lifestyle, title: "Slow Mornings", category: "Lifestyle" },
  { img: fitness, title: "Move Daily", category: "Fitness" },
  { img: beauty, title: "Glow Up", category: "Beauty" },
  { img: travel, title: "Sunset Diaries", category: "Travel" },
  { img: gaming, title: "Neon Nights", category: "Gaming" },
];

const categories = ["All", "Fashion", "Food", "Tech", "Lifestyle", "Fitness", "Beauty", "Travel", "Gaming"];

function ReelsPage() {
  const [filter, setFilter] = useState("All");
  const filtered = filter === "All" ? reels : reels.filter((r) => r.category === filter);

  return (
    <SiteLayout>
      <Section className="!pt-16 !pb-8">
        <SectionHeading eyebrow="Our Reels" title="Reels that move people" subtitle="A look into our world — curated short-form work across industries." />
      </Section>

      <Section className="!pt-0 !pb-8">
        <div className="flex flex-wrap gap-2 justify-center">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setFilter(c)}
              className={`px-5 py-2 rounded-full text-sm font-semibold border transition ${
                filter === c ? "gradient-btn text-primary-foreground border-transparent shadow-lg" : "bg-card hover:bg-muted"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </Section>

      <Section className="!pt-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map((r, i) => (
            <div key={i} className="relative aspect-[9/16] rounded-3xl overflow-hidden group cursor-pointer animate-fade-up" style={{ animationDelay: `${i * 0.05}s` }}>
              <img src={r.img} alt={r.title} loading="lazy" className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                <div className="w-16 h-16 rounded-full bg-white/95 flex items-center justify-center shadow-2xl"><Play className="w-7 h-7 text-primary fill-primary ml-1" /></div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                <p className="text-xs uppercase tracking-wider opacity-80">{r.category}</p>
                <p className="font-display font-bold text-lg">{r.title}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>
    </SiteLayout>
  );
}
