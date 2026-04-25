import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/Layout";
import { Section, SectionHeading } from "@/components/site/Section";
import { useState } from "react";
import { Mail, Phone, MapPin, Send, Instagram, Youtube, Twitter } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import contactImg from "@/assets/contact.jpg";
import { z } from "zod";

const schema = z.object({
  name: z.string().trim().min(1, "Name required").max(100),
  email: z.string().trim().email("Invalid email").max(200),
  message: z.string().trim().min(5, "Message too short").max(2000),
});

export const Route = createFileRoute("/contact")({
  head: () => ({ meta: [
    { title: "Contact — ReelFactory" },
    { name: "description", content: "Get in touch with the ReelFactory team. We respond within 24 hours." },
    { property: "og:title", content: "Contact — ReelFactory" },
    { property: "og:description", content: "Let's create reels your audience will love." },
  ] }),
  component: ContactPage,
});

function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) { toast.error(parsed.error.issues[0].message); return; }
    setLoading(true);
    const { error } = await supabase.from("contact_submissions").insert(parsed.data);
    setLoading(false);
    if (error) { toast.error("Could not send. Try again."); return; }
    toast.success("Message sent! We'll be in touch within 24h.");
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <SiteLayout>
      <Section className="!pt-16">
        <SectionHeading eyebrow="Say hello" title="Let's make something amazing" subtitle="Tell us about your project and we'll get back within 24 hours." />

        <div className="grid lg:grid-cols-2 gap-10 items-start mt-8">
          <div className="space-y-5 animate-fade-up">
            <div className="relative">
              <div className="absolute -inset-6 gradient-bg-soft rounded-[2.5rem] blur-2xl" />
              <img src={contactImg} alt="Contact us" loading="lazy" className="relative rounded-[2rem] shadow-xl animate-float" />
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              <a href="mailto:hello@reelfactory.xyz" className="bg-card rounded-2xl p-5 border hover:shadow-lg transition flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-pink flex items-center justify-center"><Mail className="w-5 h-5" /></div>
                <div><p className="text-xs text-muted-foreground">Email</p><p className="font-semibold text-sm">hello@reelfactory.xyz</p></div>
              </a>
              <a href="tel:+10000000000" className="bg-card rounded-2xl p-5 border hover:shadow-lg transition flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-mint flex items-center justify-center"><Phone className="w-5 h-5" /></div>
                <div><p className="text-xs text-muted-foreground">Phone</p><p className="font-semibold text-sm">+1 (000) 000-0000</p></div>
              </a>
              <div className="bg-card rounded-2xl p-5 border flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-lavender flex items-center justify-center"><MapPin className="w-5 h-5" /></div>
                <div><p className="text-xs text-muted-foreground">Based</p><p className="font-semibold text-sm">Worldwide · Remote</p></div>
              </div>
              <div className="bg-card rounded-2xl p-5 border flex items-center gap-3">
                <a href="#" className="w-9 h-9 rounded-full bg-muted flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition"><Instagram className="w-4 h-4" /></a>
                <a href="#" className="w-9 h-9 rounded-full bg-muted flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition"><Youtube className="w-4 h-4" /></a>
                <a href="#" className="w-9 h-9 rounded-full bg-muted flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition"><Twitter className="w-4 h-4" /></a>
              </div>
            </div>
          </div>

          <form onSubmit={submit} className="bg-card rounded-3xl p-6 md:p-8 border shadow-lg space-y-5 animate-fade-up" style={{ animationDelay: "0.15s" }}>
            <div>
              <label className="block text-sm font-semibold mb-2">Your name</label>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Jane Doe" className="w-full px-4 py-3 rounded-xl border-2 bg-background focus:border-primary outline-none transition" />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Email</label>
              <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@brand.com" className="w-full px-4 py-3 rounded-xl border-2 bg-background focus:border-primary outline-none transition" />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Tell us about your project</label>
              <textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} rows={6} placeholder="What are you trying to create?" className="w-full px-4 py-3 rounded-xl border-2 bg-background focus:border-primary outline-none transition resize-none" />
            </div>
            <button type="submit" disabled={loading} className="w-full px-6 py-4 rounded-full gradient-btn text-primary-foreground font-bold shadow-lg shadow-primary/30 hover:scale-[1.02] transition disabled:opacity-60 inline-flex items-center justify-center gap-2">
              {loading ? "Sending…" : <>Send message <Send className="w-4 h-4" /></>}
            </button>
          </form>
        </div>
      </Section>
    </SiteLayout>
  );
}
