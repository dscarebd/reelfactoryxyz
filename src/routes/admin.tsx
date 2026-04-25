import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { slugify } from "@/lib/slug";
import { toast } from "sonner";
import { Trash2, Plus, Save, Users, MessageSquare, HelpCircle, Inbox, Upload, Sparkles } from "lucide-react";
import { Toaster } from "@/components/ui/sonner";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin — ReelFactory" }, { name: "robots", content: "noindex,nofollow" }] }),
  component: AdminPanel,
});

type Member = { id: string; name: string; slug: string; role: string; photo_url: string | null; skills: string[] | null; phone: string | null; email: string | null; bio: string | null; display_order: number | null };
type Review = { id: string; member_id: string; reviewer_name: string; rating: number; review_text: string };
type FAQ = { id: string; member_id: string; question: string; answer: string };
type Submission = { id: string; name: string; email: string; message: string; created_at: string };

const tabs = [
  { id: "members", label: "Team", icon: Users },
  { id: "reviews", label: "Reviews", icon: MessageSquare },
  { id: "faqs", label: "FAQs", icon: HelpCircle },
  { id: "messages", label: "Messages", icon: Inbox },
] as const;

function AdminPanel() {
  const [tab, setTab] = useState<typeof tabs[number]["id"]>("members");

  return (
    <div className="min-h-screen bg-muted/30">
      <Toaster richColors />
      <header className="bg-card border-b sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl gradient-btn flex items-center justify-center text-primary-foreground"><Sparkles className="w-5 h-5" /></div>
            <div>
              <h1 className="font-display font-bold text-lg">ReelFactory Admin</h1>
              <p className="text-xs text-muted-foreground">Open access — keep this URL private</p>
            </div>
          </div>
          <a href="/" className="text-sm text-primary font-semibold">← View site</a>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-wrap gap-2 mb-6">
          {tabs.map((t) => (
            <button key={t.id} onClick={() => setTab(t.id)} className={`px-5 py-2.5 rounded-full font-semibold text-sm flex items-center gap-2 transition ${tab === t.id ? "gradient-btn text-primary-foreground shadow-lg" : "bg-card border hover:bg-muted"}`}>
              <t.icon className="w-4 h-4" /> {t.label}
            </button>
          ))}
        </div>

        {tab === "members" && <MembersTab />}
        {tab === "reviews" && <ReviewsTab />}
        {tab === "faqs" && <FaqsTab />}
        {tab === "messages" && <MessagesTab />}
      </div>
    </div>
  );
}

function MembersTab() {
  const [members, setMembers] = useState<Member[]>([]);
  const [editing, setEditing] = useState<Partial<Member> | null>(null);
  const [uploading, setUploading] = useState(false);

  const load = () => supabase.from("team_members").select("*").order("display_order").then(({ data }) => setMembers((data as Member[]) || []));
  useEffect(() => { load(); }, []);

  const save = async () => {
    if (!editing?.name || !editing?.role) { toast.error("Name and role required"); return; }
    const slug = slugify(editing.name);
    const payload = {
      name: editing.name, slug, role: editing.role, photo_url: editing.photo_url || null,
      skills: editing.skills || [], phone: editing.phone || null, email: editing.email || null,
      bio: editing.bio || null, display_order: editing.display_order || 0,
    };
    const { error } = editing.id
      ? await supabase.from("team_members").update(payload).eq("id", editing.id)
      : await supabase.from("team_members").insert(payload);
    if (error) { toast.error(error.message); return; }
    toast.success("Saved!");
    setEditing(null); load();
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this member?")) return;
    await supabase.from("team_members").delete().eq("id", id);
    toast.success("Deleted"); load();
  };

  const uploadPhoto = async (file: File) => {
    setUploading(true);
    const path = `${Date.now()}-${file.name.replace(/[^a-z0-9.]/gi, "-")}`;
    const { error } = await supabase.storage.from("team-photos").upload(path, file, { upsert: true });
    if (error) { toast.error(error.message); setUploading(false); return; }
    const { data } = supabase.storage.from("team-photos").getPublicUrl(path);
    setEditing((e) => ({ ...e, photo_url: data.publicUrl }));
    setUploading(false);
    toast.success("Photo uploaded");
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-display font-bold">Team Members</h2>
        <button onClick={() => setEditing({ skills: [], display_order: members.length })} className="px-4 py-2 rounded-full gradient-btn text-primary-foreground font-semibold flex items-center gap-2"><Plus className="w-4 h-4" /> Add Member</button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {members.map((m) => (
          <div key={m.id} className="bg-card rounded-2xl border overflow-hidden">
            <div className="aspect-video bg-muted overflow-hidden">{m.photo_url && <img src={m.photo_url} alt={m.name} className="w-full h-full object-cover" />}</div>
            <div className="p-4">
              <h3 className="font-display font-bold">{m.name}</h3>
              <p className="text-sm text-muted-foreground mb-1">{m.role}</p>
              <p className="text-xs text-muted-foreground mb-3 font-mono">/team/{m.slug}</p>
              <div className="flex gap-2">
                <button onClick={() => setEditing(m)} className="flex-1 px-3 py-1.5 rounded-lg bg-muted text-sm font-semibold">Edit</button>
                <button onClick={() => remove(m.id)} className="px-3 py-1.5 rounded-lg bg-destructive/10 text-destructive"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {editing && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto" onClick={() => setEditing(null)}>
          <div className="bg-card rounded-3xl max-w-2xl w-full p-6 my-8 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-xl font-display font-bold mb-4">{editing.id ? "Edit" : "Add"} Member</h3>
            <div className="space-y-3">
              <Field label="Name *"><input value={editing.name || ""} onChange={(e) => setEditing({ ...editing, name: e.target.value })} className="input" /></Field>
              {editing.name && <p className="text-xs text-muted-foreground">URL: /team/<b>{slugify(editing.name)}</b></p>}
              <Field label="Role *"><input value={editing.role || ""} onChange={(e) => setEditing({ ...editing, role: e.target.value })} className="input" /></Field>
              <Field label="Photo">
                <div className="flex items-center gap-3">
                  {editing.photo_url && <img src={editing.photo_url} alt="" className="w-16 h-16 rounded-xl object-cover" />}
                  <label className="cursor-pointer px-4 py-2 rounded-lg bg-muted text-sm font-semibold flex items-center gap-2">
                    <Upload className="w-4 h-4" /> {uploading ? "Uploading..." : "Upload"}
                    <input type="file" accept="image/*" hidden onChange={(e) => e.target.files?.[0] && uploadPhoto(e.target.files[0])} />
                  </label>
                </div>
              </Field>
              <Field label="Skills (comma separated)"><input value={(editing.skills || []).join(", ")} onChange={(e) => setEditing({ ...editing, skills: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) })} className="input" /></Field>
              <Field label="Phone"><input value={editing.phone || ""} onChange={(e) => setEditing({ ...editing, phone: e.target.value })} className="input" /></Field>
              <Field label="Email"><input value={editing.email || ""} onChange={(e) => setEditing({ ...editing, email: e.target.value })} className="input" /></Field>
              <Field label="Bio"><textarea value={editing.bio || ""} onChange={(e) => setEditing({ ...editing, bio: e.target.value })} rows={4} className="input" /></Field>
              <Field label="Display order"><input type="number" value={editing.display_order || 0} onChange={(e) => setEditing({ ...editing, display_order: +e.target.value })} className="input" /></Field>
            </div>
            <div className="flex gap-2 mt-6">
              <button onClick={save} className="flex-1 px-4 py-3 rounded-full gradient-btn text-primary-foreground font-bold flex items-center justify-center gap-2"><Save className="w-4 h-4" /> Save</button>
              <button onClick={() => setEditing(null)} className="px-4 py-3 rounded-full bg-muted font-semibold">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ReviewsTab() {
  const [members, setMembers] = useState<Member[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [editing, setEditing] = useState<Partial<Review> | null>(null);

  const load = async () => {
    const [{ data: m }, { data: r }] = await Promise.all([
      supabase.from("team_members").select("*").order("display_order"),
      supabase.from("member_reviews").select("*").order("created_at", { ascending: false }),
    ]);
    setMembers((m as Member[]) || []); setReviews((r as Review[]) || []);
  };
  useEffect(() => { load(); }, []);

  const save = async () => {
    if (!editing?.member_id || !editing?.reviewer_name || !editing?.review_text) { toast.error("All fields required"); return; }
    const payload = { member_id: editing.member_id, reviewer_name: editing.reviewer_name, rating: editing.rating || 5, review_text: editing.review_text };
    const { error } = editing.id ? await supabase.from("member_reviews").update(payload).eq("id", editing.id) : await supabase.from("member_reviews").insert(payload);
    if (error) { toast.error(error.message); return; }
    toast.success("Saved"); setEditing(null); load();
  };
  const remove = async (id: string) => { if (!confirm("Delete?")) return; await supabase.from("member_reviews").delete().eq("id", id); load(); };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-display font-bold">Reviews (per member)</h2>
        <button onClick={() => setEditing({ rating: 5 })} className="px-4 py-2 rounded-full gradient-btn text-primary-foreground font-semibold flex items-center gap-2"><Plus className="w-4 h-4" /> Add</button>
      </div>
      <div className="space-y-3">
        {reviews.map((r) => {
          const m = members.find((x) => x.id === r.member_id);
          return (
            <div key={r.id} className="bg-card rounded-2xl border p-4 flex items-start justify-between gap-4">
              <div className="flex-1">
                <p className="text-xs text-primary font-bold uppercase">{m?.name || "Unknown"} · {r.rating}★</p>
                <p className="font-semibold">{r.reviewer_name}</p>
                <p className="text-sm text-muted-foreground mt-1">{r.review_text}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setEditing(r)} className="px-3 py-1.5 rounded-lg bg-muted text-sm">Edit</button>
                <button onClick={() => remove(r.id)} className="px-3 py-1.5 rounded-lg bg-destructive/10 text-destructive"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          );
        })}
        {reviews.length === 0 && <p className="text-center text-muted-foreground py-10">No reviews yet</p>}
      </div>

      {editing && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setEditing(null)}>
          <div className="bg-card rounded-3xl max-w-lg w-full p-6" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-xl font-display font-bold mb-4">{editing.id ? "Edit" : "Add"} Review</h3>
            <div className="space-y-3">
              <Field label="Member *">
                <select value={editing.member_id || ""} onChange={(e) => setEditing({ ...editing, member_id: e.target.value })} className="input">
                  <option value="">Select…</option>
                  {members.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
                </select>
              </Field>
              <Field label="Reviewer name *"><input value={editing.reviewer_name || ""} onChange={(e) => setEditing({ ...editing, reviewer_name: e.target.value })} className="input" /></Field>
              <Field label="Rating (1-5) *"><input type="number" min={1} max={5} value={editing.rating || 5} onChange={(e) => setEditing({ ...editing, rating: +e.target.value })} className="input" /></Field>
              <Field label="Review *"><textarea value={editing.review_text || ""} onChange={(e) => setEditing({ ...editing, review_text: e.target.value })} rows={4} className="input" /></Field>
            </div>
            <div className="flex gap-2 mt-6">
              <button onClick={save} className="flex-1 px-4 py-3 rounded-full gradient-btn text-primary-foreground font-bold">Save</button>
              <button onClick={() => setEditing(null)} className="px-4 py-3 rounded-full bg-muted font-semibold">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function FaqsTab() {
  const [members, setMembers] = useState<Member[]>([]);
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [editing, setEditing] = useState<Partial<FAQ> | null>(null);

  const load = async () => {
    const [{ data: m }, { data: f }] = await Promise.all([
      supabase.from("team_members").select("*").order("display_order"),
      supabase.from("member_faqs").select("*").order("display_order"),
    ]);
    setMembers((m as Member[]) || []); setFaqs((f as FAQ[]) || []);
  };
  useEffect(() => { load(); }, []);

  const save = async () => {
    if (!editing?.member_id || !editing?.question || !editing?.answer) { toast.error("All fields required"); return; }
    const payload = { member_id: editing.member_id, question: editing.question, answer: editing.answer };
    const { error } = editing.id ? await supabase.from("member_faqs").update(payload).eq("id", editing.id) : await supabase.from("member_faqs").insert(payload);
    if (error) { toast.error(error.message); return; }
    toast.success("Saved"); setEditing(null); load();
  };
  const remove = async (id: string) => { if (!confirm("Delete?")) return; await supabase.from("member_faqs").delete().eq("id", id); load(); };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-display font-bold">FAQs (per member)</h2>
        <button onClick={() => setEditing({})} className="px-4 py-2 rounded-full gradient-btn text-primary-foreground font-semibold flex items-center gap-2"><Plus className="w-4 h-4" /> Add</button>
      </div>
      <div className="space-y-3">
        {faqs.map((f) => {
          const m = members.find((x) => x.id === f.member_id);
          return (
            <div key={f.id} className="bg-card rounded-2xl border p-4 flex items-start justify-between gap-4">
              <div className="flex-1">
                <p className="text-xs text-primary font-bold uppercase">{m?.name || "Unknown"}</p>
                <p className="font-semibold">{f.question}</p>
                <p className="text-sm text-muted-foreground mt-1">{f.answer}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setEditing(f)} className="px-3 py-1.5 rounded-lg bg-muted text-sm">Edit</button>
                <button onClick={() => remove(f.id)} className="px-3 py-1.5 rounded-lg bg-destructive/10 text-destructive"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          );
        })}
        {faqs.length === 0 && <p className="text-center text-muted-foreground py-10">No FAQs yet</p>}
      </div>

      {editing && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setEditing(null)}>
          <div className="bg-card rounded-3xl max-w-lg w-full p-6" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-xl font-display font-bold mb-4">{editing.id ? "Edit" : "Add"} FAQ</h3>
            <div className="space-y-3">
              <Field label="Member *">
                <select value={editing.member_id || ""} onChange={(e) => setEditing({ ...editing, member_id: e.target.value })} className="input">
                  <option value="">Select…</option>
                  {members.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
                </select>
              </Field>
              <Field label="Question *"><input value={editing.question || ""} onChange={(e) => setEditing({ ...editing, question: e.target.value })} className="input" /></Field>
              <Field label="Answer *"><textarea value={editing.answer || ""} onChange={(e) => setEditing({ ...editing, answer: e.target.value })} rows={4} className="input" /></Field>
            </div>
            <div className="flex gap-2 mt-6">
              <button onClick={save} className="flex-1 px-4 py-3 rounded-full gradient-btn text-primary-foreground font-bold">Save</button>
              <button onClick={() => setEditing(null)} className="px-4 py-3 rounded-full bg-muted font-semibold">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function MessagesTab() {
  const [items, setItems] = useState<Submission[]>([]);
  const load = () => supabase.from("contact_submissions").select("*").order("created_at", { ascending: false }).then(({ data }) => setItems((data as Submission[]) || []));
  useEffect(() => { load(); }, []);

  const remove = async (id: string) => { if (!confirm("Delete?")) return; await supabase.from("contact_submissions").delete().eq("id", id); load(); };

  return (
    <div>
      <h2 className="text-2xl font-display font-bold mb-4">Contact Submissions</h2>
      <div className="space-y-3">
        {items.map((s) => (
          <div key={s.id} className="bg-card rounded-2xl border p-5">
            <div className="flex items-start justify-between gap-4 mb-2">
              <div>
                <p className="font-display font-bold">{s.name}</p>
                <a href={`mailto:${s.email}`} className="text-sm text-primary">{s.email}</a>
                <p className="text-xs text-muted-foreground">{new Date(s.created_at).toLocaleString()}</p>
              </div>
              <button onClick={() => remove(s.id)} className="px-3 py-1.5 rounded-lg bg-destructive/10 text-destructive"><Trash2 className="w-4 h-4" /></button>
            </div>
            <p className="text-sm whitespace-pre-wrap">{s.message}</p>
          </div>
        ))}
        {items.length === 0 && <p className="text-center text-muted-foreground py-10">No messages yet</p>}
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">{label}</label>
      {children}
      <style>{`.input { width: 100%; padding: 0.625rem 0.875rem; border-radius: 0.75rem; border: 2px solid var(--color-border); background: var(--color-background); outline: none; font-family: inherit; }`}</style>
    </div>
  );
}
