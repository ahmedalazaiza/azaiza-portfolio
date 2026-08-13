import React, { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { ArrowLeft, Mail, Briefcase, Clock, Trash2, Check, Eye } from "lucide-react";

interface AdashboardProps {
  onBack: () => void;
}

type Tab = "messages" | "projects" | "experiences";

export default function Adashboard({ onBack }: AdashboardProps) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState<Tab>("messages");
    const [checkingAuth, setCheckingAuth] = useState(true);
  
    // تحقق إذا المستخدم مسجل دخول مسبقاً
    useEffect(() => {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session) setIsAuthenticated(true);
        setCheckingAuth(false);
      });
  
      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        setIsAuthenticated(!!session);
      });
  
      return () => subscription.unsubscribe();
    }, []);
  
    const handleLogin = async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);
      setError("");
  
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
  
      if (error) {
        setError("البريد أو كلمة المرور غير صحيحة");
        setLoading(false);
      } else {
        setIsAuthenticated(true);
        setLoading(false);
      }
    };
  
    const handleLogout = async () => {
      await supabase.auth.signOut();
      setIsAuthenticated(false);
    };
  
    if (checkingAuth) {
      return (
        <div className="min-h-screen bg-background flex items-center justify-center">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      );
    }
  
    if (!isAuthenticated) {
      return (
        <div className="min-h-screen bg-background flex items-center justify-center px-6">
          <div className="w-full max-w-md">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-display font-bold text-foreground mb-2">Dashboard</h1>
              <p className="text-muted-foreground text-sm">Sign in to continue</p>
            </div>
  
            <form onSubmit={handleLogin} className="space-y-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                required
                className="w-full px-4 py-3 rounded-xl border border-border bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
                className="w-full px-4 py-3 rounded-xl border border-border bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-medium hover:opacity-90 transition disabled:opacity-50"
              >
                {loading ? "Signing in..." : "Sign In"}
              </button>
            </form>
  
            <button
              onClick={onBack}
              className="mt-6 w-full flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground transition"
            >
              <ArrowLeft size={16} />
              Back to website
            </button>
          </div>
        </div>
      );
    }
  
    return (
      <div className="min-h-screen bg-background text-foreground">
        {/* Header */}
        <div className="border-b border-border bg-card/50 backdrop-blur sticky top-0 z-10">
          <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={onBack}
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition"
              >
                <ArrowLeft size={16} />
                Back
              </button>
              <h1 className="text-xl font-display font-bold">Dashboard</h1>
            </div>
            <button
              onClick={handleLogout}
              className="text-sm text-muted-foreground hover:text-foreground transition"
            >
              Logout
            </button>
          </div>
        </div>
  
        {/* Tabs */}
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex gap-2 mb-8 border-b border-border pb-4">
            <TabButton
              active={activeTab === "messages"}
              onClick={() => setActiveTab("messages")}
              icon={<Mail size={16} />}
              label="Messages"
            />
            <TabButton
              active={activeTab === "projects"}
              onClick={() => setActiveTab("projects")}
              icon={<Briefcase size={16} />}
              label="Projects"
            />
            <TabButton
              active={activeTab === "experiences"}
              onClick={() => setActiveTab("experiences")}
              icon={<Clock size={16} />}
              label="Experience"
            />
          </div>
  
          {activeTab === "messages" && <MessagesTab />}
          {activeTab === "projects" && <ProjectsTab />}
          {activeTab === "experiences" && <ExperiencesTab />}
        </div>
      </div>
    );
  }
  
function TabButton({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
        active
          ? "bg-primary text-primary-foreground"
          : "text-muted-foreground hover:bg-muted hover:text-foreground"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}

// ─── Messages Tab ────────────────────────────────────────────────────────────
function MessagesTab() {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMessages();
  }, []);

  async function loadMessages() {
    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error) setMessages(data || []);
    setLoading(false);
  }

  async function markAsRead(id: number) {
    await supabase.from("messages").update({ is_read: true }).eq("id", id);
    loadMessages();
  }

  async function deleteMessage(id: number) {
    if (!confirm("Delete this message?")) return;
    await supabase.from("messages").delete().eq("id", id);
    loadMessages();
  }

  if (loading) return <p className="text-muted-foreground">Loading messages...</p>;

  if (messages.length === 0) {
    return <p className="text-muted-foreground">No messages yet.</p>;
  }

  return (
    <div className="space-y-4">
      {messages.map((msg) => (
        <div
          key={msg.id}
          className={`p-5 rounded-2xl border ${
            msg.is_read ? "border-border bg-card" : "border-primary/30 bg-primary/5"
          }`}
        >
          <div className="flex items-start justify-between gap-4 mb-3">
            <div>
              <h3 className="font-semibold text-foreground">{msg.name}</h3>
              <p className="text-sm text-muted-foreground">{msg.email}</p>
            </div>
            <div className="flex items-center gap-2">
              {!msg.is_read && (
                <button
                  onClick={() => markAsRead(msg.id)}
                  className="p-2 rounded-lg hover:bg-primary/10 text-primary transition"
                  title="Mark as read"
                >
                  <Check size={16} />
                </button>
              )}
              <button
                onClick={() => deleteMessage(msg.id)}
                className="p-2 rounded-lg hover:bg-red-500/10 text-red-500 transition"
                title="Delete"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
          {msg.subject && (
            <p className="text-sm font-medium text-foreground mb-2">Subject: {msg.subject}</p>
          )}
          <p className="text-sm text-muted-foreground whitespace-pre-wrap">{msg.message}</p>
          <p className="text-xs text-muted-foreground mt-3">
            {new Date(msg.created_at).toLocaleString()}
          </p>
        </div>
      ))}
    </div>
  );
}

// ─── Projects Tab ────────────────────────────────────────────────────────────
function ProjectsTab() {
    const [projects, setProjects] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({
      title: "",
      slug: "",
      category: "",
      year: "",
      description: "",
      full_description: "",
      tags: "",
      accent_color: "#4ade80",
      cover_image: "",
      images: "",
      is_featured: false,
      sort_order: 1,
    });
  
    useEffect(() => {
      loadProjects();
    }, []);
  
    async function loadProjects() {
      setLoading(true);
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .order("sort_order", { ascending: true });
  
      if (!error) setProjects(data || []);
      setLoading(false);
    }
  
    async function deleteProject(id: number) {
      if (!confirm("Delete this project?")) return;
      await supabase.from("projects").delete().eq("id", id);
      loadProjects();
    }
  
    async function handleSubmit(e: React.FormEvent) {
      e.preventDefault();
  
      const { error } = await supabase.from("projects").insert([
        {
          title: form.title,
          slug: form.slug || form.title.toLowerCase().replace(/\s+/g, "-"),
          category: form.category,
          year: form.year,
          description: form.description,
          full_description: form.full_description,
          tags: form.tags,
          accent_color: form.accent_color,
          cover_image: form.cover_image,
          images: form.images,
          is_featured: form.is_featured,
          sort_order: form.sort_order,
        },
      ]);
  
      if (error) {
        alert("Error: " + error.message);
        return;
      }
  
      setShowForm(false);
      setForm({
        title: "",
        slug: "",
        category: "",
        year: "",
        description: "",
        full_description: "",
        tags: "",
        accent_color: "#4ade80",
        cover_image: "",
        images: "",
        is_featured: false,
        sort_order: 1,
      });
      loadProjects();
    }
  
    if (loading) return <p className="text-muted-foreground">Loading projects...</p>;
  
    return (
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold">Projects ({projects.length})</h2>
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition"
          >
            {showForm ? "Cancel" : "+ Add Project"}
          </button>
        </div>
  
        {/* Add Form */}
        {showForm && (
          <form onSubmit={handleSubmit} className="mb-8 p-6 rounded-2xl border border-border bg-card space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <input
                required
                placeholder="Title *"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="px-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <input
                placeholder="Slug (optional)"
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
                className="px-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <input
                placeholder="Category"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="px-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <input
                placeholder="Year (e.g. 2023 – Now)"
                value={form.year}
                onChange={(e) => setForm({ ...form, year: e.target.value })}
                className="px-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <input
                placeholder="Accent Color (#4ade80)"
                value={form.accent_color}
                onChange={(e) => setForm({ ...form, accent_color: e.target.value })}
                className="px-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <input
                type="number"
                placeholder="Sort Order"
                value={form.sort_order}
                onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })}
                className="px-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
  
            <textarea
              placeholder="Short Description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={2}
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
  
            <textarea
              placeholder="Full Description"
              value={form.full_description}
              onChange={(e) => setForm({ ...form, full_description: e.target.value })}
              rows={3}
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
  
            <input
              placeholder="Tags (comma separated)"
              value={form.tags}
              onChange={(e) => setForm({ ...form, tags: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
  
            <input
              placeholder="Cover Image URL"
              value={form.cover_image}
              onChange={(e) => setForm({ ...form, cover_image: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
  
            <input
              placeholder="Images URLs (comma separated)"
              value={form.images}
              onChange={(e) => setForm({ ...form, images: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
  
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.is_featured}
                onChange={(e) => setForm({ ...form, is_featured: e.target.checked })}
              />
              Featured Project
            </label>
  
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-medium hover:opacity-90 transition"
            >
              Save Project
            </button>
          </form>
        )}
  
        {/* Projects List */}
        {projects.length === 0 ? (
          <p className="text-muted-foreground">No projects yet.</p>
        ) : (
          <div className="space-y-3">
            {projects.map((project) => (
              <div
                key={project.id}
                className="flex items-center gap-4 p-4 rounded-2xl border border-border bg-card"
              >
                {project.cover_image && (
                  <img
                    src={project.cover_image}
                    alt={project.title}
                    className="w-16 h-16 rounded-xl object-cover"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground truncate">{project.title}</h3>
                  <p className="text-sm text-muted-foreground">{project.category} · {project.year}</p>
                </div>
                <button
                  onClick={() => deleteProject(project.id)}
                  className="p-2 rounded-lg hover:bg-red-500/10 text-red-500 transition"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }
// ─── Experiences Tab ─────────────────────────────────────────────────────────
function ExperiencesTab() {
    const [experiences, setExperiences] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({
      period: "",
      role: "",
      company: "",
      location: "",
      current: false,
      highlights: "",
      sort_order: 1,
    });
  
    useEffect(() => {
      loadExperiences();
    }, []);
  
    async function loadExperiences() {
      setLoading(true);
      const { data, error } = await supabase
        .from("experiences")
        .select("*")
        .order("sort_order", { ascending: true });
  
      if (!error) setExperiences(data || []);
      setLoading(false);
    }
  
    async function deleteExperience(id: number) {
      if (!confirm("Delete this experience?")) return;
      await supabase.from("experiences").delete().eq("id", id);
      loadExperiences();
    }
  
    async function handleSubmit(e: React.FormEvent) {
      e.preventDefault();
  
      const { error } = await supabase.from("experiences").insert([
        {
          period: form.period,
          role: form.role,
          company: form.company,
          location: form.location,
          current: form.current,
          highlights: form.highlights,
          sort_order: form.sort_order,
        },
      ]);
  
      if (error) {
        alert("Error: " + error.message);
        return;
      }
  
      setShowForm(false);
      setForm({
        period: "",
        role: "",
        company: "",
        location: "",
        current: false,
        highlights: "",
        sort_order: 1,
      });
      loadExperiences();
    }
  
    if (loading) return <p className="text-muted-foreground">Loading experiences...</p>;
  
    return (
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold">Experience ({experiences.length})</h2>
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition"
          >
            {showForm ? "Cancel" : "+ Add Experience"}
          </button>
        </div>
  
        {/* Add Form */}
        {showForm && (
          <form onSubmit={handleSubmit} className="mb-8 p-6 rounded-2xl border border-border bg-card space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <input
                required
                placeholder="Period (e.g. Oct 2023 – Present) *"
                value={form.period}
                onChange={(e) => setForm({ ...form, period: e.target.value })}
                className="px-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <input
                required
                placeholder="Role / Job Title *"
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                className="px-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <input
                required
                placeholder="Company *"
                value={form.company}
                onChange={(e) => setForm({ ...form, company: e.target.value })}
                className="px-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <input
                placeholder="Location"
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                className="px-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <input
                type="number"
                placeholder="Sort Order"
                value={form.sort_order}
                onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })}
                className="px-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
  
            <textarea
              placeholder="Highlights (separate with | )"
              value={form.highlights}
              onChange={(e) => setForm({ ...form, highlights: e.target.value })}
              rows={4}
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
  
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.current}
                onChange={(e) => setForm({ ...form, current: e.target.checked })}
              />
              Current Position
            </label>
  
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-medium hover:opacity-90 transition"
            >
              Save Experience
            </button>
          </form>
        )}
  
        {/* Experiences List */}
        {experiences.length === 0 ? (
          <p className="text-muted-foreground">No experiences yet.</p>
        ) : (
          <div className="space-y-3">
            {experiences.map((exp) => (
              <div
                key={exp.id}
                className="flex items-start gap-4 p-4 rounded-2xl border border-border bg-card"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="text-xs font-mono text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                      {exp.period}
                    </span>
                    {exp.current && (
                      <span className="text-xs font-mono text-primary border border-primary/30 px-2 py-0.5 rounded-full">
                        Current
                      </span>
                    )}
                  </div>
                  <h3 className="font-semibold text-foreground">{exp.role}</h3>
                  <p className="text-sm text-muted-foreground">
                    {exp.company} · {exp.location}
                  </p>
                </div>
                <button
                  onClick={() => deleteExperience(exp.id)}
                  className="p-2 rounded-lg hover:bg-red-500/10 text-red-500 transition shrink-0"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }