import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { supabase } from "../lib/supabase";
import { ArrowLeft, Mail, Briefcase, Clock, Trash2, Check, Eye, Pencil, Plus, ExternalLink, Upload, Image as ImageIcon, X, Loader2 } from "lucide-react";

interface AdashboardProps {
  onBack?: () => void;
}

type Tab = "messages" | "projects" | "experiences";

export default function Adashboard({ onBack }: AdashboardProps) {
    const navigate = useNavigate();
    const handleBack = onBack || (() => navigate("/"));
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
              onClick={handleBack}
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
                onClick={handleBack}
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

// ─── Storage Upload Helper ──────────────────────────────────────────────────
async function uploadFileToStorage(file: File, folder = "covers"): Promise<string> {
  const fileExt = file.name.split(".").pop();
  const cleanFileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
  const filePath = `${folder}/${cleanFileName}`;

  const { error } = await supabase.storage
    .from("portfolio")
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (error) {
    throw error;
  }

  const { data } = supabase.storage.from("portfolio").getPublicUrl(filePath);
  return data.publicUrl;
}

// ─── Projects Tab ────────────────────────────────────────────────────────────
function ProjectsTab() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);
  const [uploadError, setUploadError] = useState("");

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

  function handleStartAdd() {
    setEditingId(null);
    setUploadError("");
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
      sort_order: projects.length + 1,
    });
    setShowForm(true);
  }

  function handleStartEdit(project: any) {
    setEditingId(project.id);
    setUploadError("");
    setForm({
      title: project.title || "",
      slug: project.slug || "",
      category: project.category || "",
      year: project.year || "",
      description: project.description || "",
      full_description: project.full_description || "",
      tags: project.tags || "",
      accent_color: project.accent_color || "#4ade80",
      cover_image: project.cover_image || project.image_url || "",
      images: project.images || "",
      is_featured: project.is_featured || false,
      sort_order: project.sort_order || 1,
    });
    setShowForm(true);
  }

  async function handleCoverFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingCover(true);
    setUploadError("");

    try {
      const publicUrl = await uploadFileToStorage(file, "covers");
      setForm(prev => ({ ...prev, cover_image: publicUrl }));
    } catch (err: any) {
      console.error("Cover upload error:", err);
      setUploadError("Failed to upload cover: " + (err.message || "Ensure 'portfolio' bucket exists in Supabase"));
    } finally {
      setUploadingCover(false);
      e.target.value = "";
    }
  }

  async function handleGalleryFilesChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingGallery(true);
    setUploadError("");

    try {
      const fileList = Array.from(files);
      const uploadPromises = fileList.map(file => uploadFileToStorage(file, "gallery"));
      const newUrls = await Promise.all(uploadPromises);

      const existingUrls = form.images
        ? form.images.split(",").map(s => s.trim()).filter(Boolean)
        : [];
      const merged = [...existingUrls, ...newUrls].join(", ");

      setForm(prev => ({ ...prev, images: merged }));
    } catch (err: any) {
      console.error("Gallery upload error:", err);
      setUploadError("Failed to upload images: " + (err.message || "Ensure 'portfolio' bucket exists in Supabase"));
    } finally {
      setUploadingGallery(false);
      e.target.value = "";
    }
  }

  function handleRemoveGalleryImage(index: number) {
    const currentList = form.images
      ? form.images.split(",").map(s => s.trim()).filter(Boolean)
      : [];
    const updated = currentList.filter((_, i) => i !== index).join(", ");
    setForm(prev => ({ ...prev, images: updated }));
  }

  async function deleteProject(id: number) {
    if (!confirm("Are you sure you want to delete this project?")) return;
    const { error } = await supabase.from("projects").delete().eq("id", id);
    if (error) {
      alert("Error: " + error.message);
      return;
    }
    loadProjects();
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const payload = {
      title: form.title,
      slug: form.slug || form.title.toLowerCase().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-"),
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
    };

    if (editingId) {
      const { error } = await supabase.from("projects").update(payload).eq("id", editingId);
      if (error) {
        alert("Error updating project: " + error.message);
        return;
      }
    } else {
      const { error } = await supabase.from("projects").insert([payload]);
      if (error) {
        alert("Error creating project: " + error.message);
        return;
      }
    }

    setShowForm(false);
    setEditingId(null);
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

  const galleryImagesList = form.images
    ? form.images.split(",").map(s => s.trim()).filter(Boolean)
    : [];

  if (loading) return <p className="text-muted-foreground">Loading projects...</p>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold">Projects ({projects.length})</h2>
        <button
          onClick={() => {
            if (showForm) {
              setShowForm(false);
              setEditingId(null);
            } else {
              handleStartAdd();
            }
          }}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition"
        >
          {showForm ? "Cancel" : <><Plus size={16} /> Add Project</>}
        </button>
      </div>

      {/* Add / Edit Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="mb-8 p-6 rounded-2xl border border-border bg-card space-y-6 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <h3 className="font-semibold text-foreground text-base">
              {editingId ? "Edit Project" : "Add New Project"}
            </h3>
            {editingId && (
              <span className="text-xs font-mono text-primary bg-primary/10 px-2 py-0.5 rounded-md">
                ID #{editingId}
              </span>
            )}
          </div>

          {uploadError && (
            <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-500 text-sm">
              {uploadError}
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">Title *</label>
              <input
                required
                placeholder="Saudi Government Portal"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">Slug (auto-generated if empty)</label>
              <input
                placeholder="saudi-gov-portal"
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">Category</label>
              <input
                placeholder="Government UX / Web App"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">Year</label>
              <input
                placeholder="2024"
                value={form.year}
                onChange={(e) => setForm({ ...form, year: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">Accent Color (Hex)</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={form.accent_color || "#aaff38"}
                  onChange={(e) => setForm({ ...form, accent_color: e.target.value })}
                  className="w-10 h-10 rounded-lg cursor-pointer border border-border bg-transparent p-0.5"
                />
                <input
                  placeholder="#aaff38"
                  value={form.accent_color}
                  onChange={(e) => setForm({ ...form, accent_color: e.target.value })}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">Sort Order</label>
              <input
                type="number"
                placeholder="1"
                value={form.sort_order}
                onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })}
                className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1">Short Description (for card)</label>
            <textarea
              placeholder="Brief summary of the project..."
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={2}
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1">Full Description (for project detail page)</label>
            <textarea
              placeholder="Comprehensive project overview and case study details..."
              value={form.full_description}
              onChange={(e) => setForm({ ...form, full_description: e.target.value })}
              rows={3}
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1">Tags (comma separated)</label>
            <input
              placeholder="UX Research, Figma, Design System, RTL"
              value={form.tags}
              onChange={(e) => setForm({ ...form, tags: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* ─── COVER IMAGE UPLOADER ────────────────────────────────────── */}
          <div className="p-5 rounded-2xl border border-border bg-muted/20 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <ImageIcon size={16} className="text-primary" /> Cover / Thumbnail Image *
                </h4>
                <p className="text-xs text-muted-foreground">The main card image displayed in the project grid</p>
              </div>
              {form.cover_image && (
                <button
                  type="button"
                  onClick={() => setForm(prev => ({ ...prev, cover_image: "" }))}
                  className="text-xs text-red-500 hover:text-red-600 flex items-center gap-1"
                >
                  <Trash2 size={13} /> Remove Cover
                </button>
              )}
            </div>

            {form.cover_image ? (
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-3 rounded-xl bg-card border border-border">
                <img
                  src={form.cover_image}
                  alt="Cover Preview"
                  className="w-32 h-20 rounded-lg object-cover border border-border"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground font-mono truncate">{form.cover_image}</p>
                  <div className="mt-2 flex items-center gap-3">
                    <label className="cursor-pointer inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:opacity-80 transition">
                      <Upload size={14} />
                      {uploadingCover ? "Uploading..." : "Replace Cover Image"}
                      <input
                        type="file"
                        accept="image/*"
                        disabled={uploadingCover}
                        onChange={handleCoverFileChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <label className={`flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-xl cursor-pointer transition ${
                  uploadingCover
                    ? "border-primary/50 bg-primary/5 cursor-wait"
                    : "border-border hover:border-primary/50 hover:bg-card"
                }`}>
                  {uploadingCover ? (
                    <div className="flex flex-col items-center gap-2 text-primary">
                      <Loader2 size={24} className="animate-spin" />
                      <span className="text-xs font-medium">Uploading cover to Supabase Storage...</span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-center">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                        <Upload size={18} />
                      </div>
                      <div>
                        <span className="text-sm font-semibold text-foreground">Click to upload cover image from device</span>
                        <p className="text-xs text-muted-foreground mt-0.5">PNG, JPG, WebP, SVG supported</p>
                      </div>
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    disabled={uploadingCover}
                    onChange={handleCoverFileChange}
                    className="hidden"
                  />
                </label>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-muted-foreground shrink-0 font-mono">Or paste URL:</span>
                  <input
                    placeholder="https://..."
                    value={form.cover_image}
                    onChange={(e) => setForm({ ...form, cover_image: e.target.value })}
                    className="flex-1 px-3 py-1.5 rounded-lg border border-border bg-background text-foreground text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>
            )}
          </div>

          {/* ─── GALLERY IMAGES UPLOADER ─────────────────────────────────── */}
          <div className="p-5 rounded-2xl border border-border bg-muted/20 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <ImageIcon size={16} className="text-primary" /> Project Gallery Images
                </h4>
                <p className="text-xs text-muted-foreground">Screenshots and mockups for the project detail page</p>
              </div>
              <label className={`cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-medium transition ${
                uploadingGallery ? "opacity-50 cursor-wait" : "hover:opacity-90"
              }`}>
                {uploadingGallery ? <Loader2 size={13} className="animate-spin" /> : <Plus size={14} />}
                {uploadingGallery ? "Uploading..." : "Upload Gallery Images"}
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  disabled={uploadingGallery}
                  onChange={handleGalleryFilesChange}
                  className="hidden"
                />
              </label>
            </div>

            {/* Gallery Images Grid */}
            {galleryImagesList.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                {galleryImagesList.map((url, idx) => (
                  <div key={idx} className="relative group rounded-xl overflow-hidden border border-border bg-card aspect-[3/2]">
                    <img
                      src={url}
                      alt={`Gallery ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveGalleryImage(idx)}
                      className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-red-500/90 text-white flex items-center justify-center shadow-md hover:bg-red-600 transition"
                      title="Remove image"
                    >
                      <X size={13} />
                    </button>
                    <div className="absolute bottom-1.5 left-1.5 px-1.5 py-0.5 rounded bg-black/60 text-white text-[10px] font-mono">
                      #{idx + 1}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 border border-dashed border-border rounded-xl">
                <p className="text-xs text-muted-foreground">No gallery images uploaded yet.</p>
              </div>
            )}

            <div className="flex items-center gap-2 pt-1">
              <span className="text-[11px] text-muted-foreground shrink-0 font-mono">Image URLs:</span>
              <input
                placeholder="https://image1.jpg, https://image2.jpg"
                value={form.images}
                onChange={(e) => setForm({ ...form, images: e.target.value })}
                className="flex-1 px-3 py-1.5 rounded-lg border border-border bg-background text-foreground text-xs focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>

          <div className="flex items-center gap-4 pt-2">
            <button
              type="submit"
              className="flex-1 py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90 transition shadow-sm"
            >
              {editingId ? "Update Project" : "Save Project"}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setEditingId(null);
              }}
              className="px-6 py-3 rounded-xl border border-border text-foreground font-medium hover:bg-muted/50 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Projects List */}
      {projects.length === 0 ? (
        <div className="text-center py-12 border border-dashed border-border rounded-2xl">
          <p className="text-muted-foreground mb-3">No projects added yet.</p>
          <button
            onClick={handleStartAdd}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium"
          >
            <Plus size={16} /> Add your first project
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {projects.map((project) => (
            <div
              key={project.id}
              className="flex items-center gap-4 p-4 rounded-2xl border border-border bg-card hover:border-primary/30 transition-colors"
            >
              {project.cover_image ? (
                <img
                  src={project.cover_image}
                  alt={project.title}
                  className="w-16 h-16 rounded-xl object-cover border border-border shrink-0"
                />
              ) : (
                <div className="w-16 h-16 rounded-xl bg-muted flex items-center justify-center text-xs font-mono text-muted-foreground shrink-0">
                  No img
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-foreground truncate">{project.title}</h3>
                  <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-primary/10 text-primary shrink-0">
                    {project.year || "2024"}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground truncate">{project.category}</p>
                <p className="text-xs text-muted-foreground/70 truncate mt-0.5">{project.description}</p>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <a
                  href={`/project/${project.slug || project.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition"
                  title="View live project"
                >
                  <ExternalLink size={16} />
                </a>
                <button
                  onClick={() => handleStartEdit(project)}
                  className="p-2 rounded-lg hover:bg-primary/10 text-primary transition"
                  title="Edit project"
                >
                  <Pencil size={16} />
                </button>
                <button
                  onClick={() => deleteProject(project.id)}
                  className="p-2 rounded-lg hover:bg-red-500/10 text-red-500 transition"
                  title="Delete project"
                >
                  <Trash2 size={16} />
                </button>
              </div>
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
  const [editingId, setEditingId] = useState<number | null>(null);
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

  function handleStartAdd() {
    setEditingId(null);
    setForm({
      period: "",
      role: "",
      company: "",
      location: "",
      current: false,
      highlights: "",
      sort_order: experiences.length + 1,
    });
    setShowForm(true);
  }

  function handleStartEdit(exp: any) {
    setEditingId(exp.id);
    setForm({
      period: exp.period || "",
      role: exp.role || "",
      company: exp.company || "",
      location: exp.location || "",
      current: exp.current || false,
      highlights: exp.highlights || "",
      sort_order: exp.sort_order || 1,
    });
    setShowForm(true);
  }

  async function deleteExperience(id: number) {
    if (!confirm("Are you sure you want to delete this experience?")) return;
    const { error } = await supabase.from("experiences").delete().eq("id", id);
    if (error) {
      alert("Error: " + error.message);
      return;
    }
    loadExperiences();
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const payload = {
      period: form.period,
      role: form.role,
      company: form.company,
      location: form.location,
      current: form.current,
      highlights: form.highlights,
      sort_order: form.sort_order,
    };

    if (editingId) {
      const { error } = await supabase.from("experiences").update(payload).eq("id", editingId);
      if (error) {
        alert("Error updating experience: " + error.message);
        return;
      }
    } else {
      const { error } = await supabase.from("experiences").insert([payload]);
      if (error) {
        alert("Error creating experience: " + error.message);
        return;
      }
    }

    setShowForm(false);
    setEditingId(null);
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
          onClick={() => {
            if (showForm) {
              setShowForm(false);
              setEditingId(null);
            } else {
              handleStartAdd();
            }
          }}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition"
        >
          {showForm ? "Cancel" : <><Plus size={16} /> Add Experience</>}
        </button>
      </div>

      {/* Add / Edit Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="mb-8 p-6 rounded-2xl border border-border bg-card space-y-4 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <h3 className="font-semibold text-foreground text-base">
              {editingId ? "Edit Experience" : "Add New Experience"}
            </h3>
            {editingId && (
              <span className="text-xs font-mono text-primary bg-primary/10 px-2 py-0.5 rounded-md">
                ID #{editingId}
              </span>
            )}
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">Period *</label>
              <input
                required
                placeholder="Oct 2023 – Present"
                value={form.period}
                onChange={(e) => setForm({ ...form, period: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">Role / Job Title *</label>
              <input
                required
                placeholder="Senior UX/UI Designer"
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">Company *</label>
              <input
                required
                placeholder="HAD For Communications & IT"
                value={form.company}
                onChange={(e) => setForm({ ...form, company: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">Location</label>
              <input
                placeholder="Riyadh, Saudi Arabia · Remote"
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">Sort Order</label>
              <input
                type="number"
                placeholder="1"
                value={form.sort_order}
                onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })}
                className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div className="flex items-end pb-2">
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.current}
                  onChange={(e) => setForm({ ...form, current: e.target.checked })}
                  className="rounded border-border"
                />
                <span className="font-medium text-foreground">Current Position</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1">
              Highlights (separate each bullet with | )
            </label>
            <textarea
              placeholder="Lead end-to-end design | Scaled design system | Mentored team"
              value={form.highlights}
              onChange={(e) => setForm({ ...form, highlights: e.target.value })}
              rows={4}
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="flex items-center gap-4 pt-2">
            <button
              type="submit"
              className="flex-1 py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90 transition shadow-sm"
            >
              {editingId ? "Update Experience" : "Save Experience"}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setEditingId(null);
              }}
              className="px-6 py-3 rounded-xl border border-border text-foreground font-medium hover:bg-muted/50 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Experiences List */}
      {experiences.length === 0 ? (
        <div className="text-center py-12 border border-dashed border-border rounded-2xl">
          <p className="text-muted-foreground mb-3">No experiences added yet.</p>
          <button
            onClick={handleStartAdd}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium"
          >
            <Plus size={16} /> Add your first experience
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {experiences.map((exp) => (
            <div
              key={exp.id}
              className="flex items-start gap-4 p-4 rounded-2xl border border-border bg-card hover:border-primary/30 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className="text-xs font-mono text-primary bg-primary/10 px-2 py-0.5 rounded-full font-medium">
                    {exp.period}
                  </span>
                  {exp.current && (
                    <span className="text-xs font-mono text-primary border border-primary/30 px-2 py-0.5 rounded-full font-medium">
                      Current
                    </span>
                  )}
                </div>
                <h3 className="font-semibold text-foreground">{exp.role}</h3>
                <p className="text-sm text-muted-foreground">
                  {exp.company} · {exp.location}
                </p>
              </div>

              <div className="flex items-center gap-1.5 shrink-0 mt-1">
                <button
                  onClick={() => handleStartEdit(exp)}
                  className="p-2 rounded-lg hover:bg-primary/10 text-primary transition"
                  title="Edit experience"
                >
                  <Pencil size={16} />
                </button>
                <button
                  onClick={() => deleteExperience(exp.id)}
                  className="p-2 rounded-lg hover:bg-red-500/10 text-red-500 transition"
                  title="Delete experience"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}