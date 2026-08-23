import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate, Link } from "react-router";
import { motion } from "motion/react";
import { ChevronLeft, ArrowUpRight, Mail, ZoomIn } from "lucide-react";
import { supabase } from "../../lib/supabase";
import { Project } from "../types";
import { FALLBACK_PROJECTS } from "../data/fallbackProjects";
import Lightbox from "../components/Lightbox";

export default function ProjectDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const location = useLocation();
  const navigate = useNavigate();

  const [project, setProject] = useState<Project | null>(() => {
    const passed = (location.state as { project?: Project })?.project;
    if (passed) return passed;
    return FALLBACK_PROJECTS.find(p => p.slug === slug || String(p.id) === slug) || null;
  });
  const [loading, setLoading] = useState(!project);
  const [error, setError] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);

    async function fetchProject() {
      if (project && (project.slug === slug || String(project.id) === slug)) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(false);

      try {
        // Query by slug or by id
        let query = supabase.from("projects").select("*");
        if (slug && !isNaN(Number(slug))) {
          query = query.or(`slug.eq.${slug},id.eq.${slug}`);
        } else if (slug) {
          query = query.eq("slug", slug);
        }

        const { data, error: sbError } = await query.single();

        if (sbError || !data) {
          const fallback = FALLBACK_PROJECTS.find(p => p.slug === slug || String(p.id) === slug);
          if (fallback) {
            setProject(fallback);
          } else {
            setError(true);
          }
        } else {
          const mapped: Project = {
            id: data.id,
            slug: data.slug || String(data.id),
            title: data.title || "",
            category: data.category || "",
            year: data.year || "",
            description: data.description || "",
            fullDescription: data.full_description || data.description || "",
            tags: data.tags ? data.tags.split(",").map((t: string) => t.trim()) : [],
            coverImage: data.cover_image || data.image_url || "/image.png",
            accentColor: data.accent_color || "#4ade80",
            images: data.images
              ? data.images.split(",").map((img: string) => img.trim())
              : [],
          };
          setProject(mapped);
        }
      } catch (e) {
        const fallback = FALLBACK_PROJECTS.find(p => p.slug === slug || String(p.id) === slug);
        if (fallback) {
          setProject(fallback);
        } else {
          setError(true);
        }
      } finally {
        setLoading(false);
      }
    }

    fetchProject();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-muted-foreground text-sm font-mono">Loading project...</p>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20 px-6">
        <div className="text-center max-w-md">
          <h1 className="text-4xl font-display font-bold text-foreground mb-4">Project Not Found</h1>
          <p className="text-muted-foreground mb-8 text-sm">
            The project you're looking for doesn't exist or may have been moved.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity"
          >
            <ChevronLeft size={16} /> Back to portfolio
          </Link>
        </div>
      </div>
    );
  }

  const allImages = [project.coverImage, ...(project.images || [])].filter(Boolean);

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen"
    >
      {/* Hero Header */}
      <section className="relative pt-28 pb-16 lg:pt-36 lg:pb-20 overflow-hidden">
        {/* Subtle radial background glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse 700px 500px at 80% 20%, ${project.accentColor}15, transparent 70%)`,
          }}
        />

        <div className="max-w-5xl mx-auto px-6 lg:px-10 relative z-10">
          <button
            onClick={() => navigate("/")}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-10 group"
          >
            <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            Back to portfolio
          </button>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <span className="text-xs font-mono px-3 py-1.5 rounded-full border border-border bg-card text-muted-foreground font-medium">
                {project.year}
              </span>
              <span className="text-xs font-mono px-3 py-1.5 rounded-full border border-border/50 text-muted-foreground font-medium">
                {project.category}
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-display font-extrabold text-foreground leading-tight mb-6">
              {project.title}
            </h1>

            <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed w-full max-w-full break-words whitespace-pre-line">
              {project.fullDescription || project.description}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Tags Bar */}
      {project.tags && project.tags.length > 0 && (
        <section className="py-6 border-y border-border bg-muted/20">
          <div className="max-w-5xl mx-auto px-6 lg:px-10">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-xs font-mono text-muted-foreground uppercase tracking-widest shrink-0">
                Tags ·
              </span>
              {project.tags.map(tag => (
                <span
                  key={tag}
                  className="px-3 py-1.5 text-xs font-medium rounded-full border border-primary/20 bg-primary/10 text-primary"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Project Cover Image */}
      {project.coverImage && (
        <section className="py-12 max-w-5xl mx-auto px-6 lg:px-10">
          <div
            onClick={() => {
              setLightboxIndex(0);
              setLightboxOpen(true);
            }}
            className="group relative rounded-3xl overflow-hidden border border-border bg-card shadow-lg cursor-zoom-in"
            title="Click to view cover in Lightbox"
          >
            <img
              src={project.coverImage}
              alt={project.title}
              className="w-full h-auto max-h-[600px] object-cover object-center transition-transform duration-500 group-hover:scale-[1.02]"
            />
            <div className="absolute inset-0 bg-black/35 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
              <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-black/75 backdrop-blur-md text-white text-sm font-semibold border border-white/20 shadow-2xl">
                <ZoomIn size={16} className="text-primary" /> Click to expand image
              </span>
            </div>
          </div>
        </section>
      )}

      {/* Image Gallery */}
      {project.images && project.images.length > 0 && (
        <section className="py-16">
          <div className="max-w-5xl mx-auto px-6 lg:px-10">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-display font-bold text-foreground">Project Gallery</h2>
                <p className="text-xs text-muted-foreground mt-0.5">Click any image to open full resolution Lightbox</p>
              </div>
              <span className="text-xs font-mono text-primary bg-primary/10 border border-primary/20 px-3 py-1 rounded-full font-medium">
                {project.images.length} Images
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {project.images.map((src, i) => {
                const imageIndex = project.coverImage ? i + 1 : i;
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{ duration: 0.4, delay: (i % 2) * 0.1 }}
                    onClick={() => {
                      setLightboxIndex(imageIndex);
                      setLightboxOpen(true);
                    }}
                    className="group relative rounded-2xl overflow-hidden border border-border bg-card aspect-[3/2] cursor-zoom-in"
                  >
                    <img
                      src={src}
                      alt={`${project.title} — screenshot ${i + 1}`}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
                      <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-black/75 backdrop-blur-md text-white text-xs font-semibold border border-white/20 shadow-lg">
                        <ZoomIn size={14} className="text-primary" /> View Fullscreen
                      </span>
                    </div>
                    <div className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-sm rounded-full px-3 py-1 text-white text-xs font-mono opacity-80 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                      {String(i + 1).padStart(2, "0")} / {String(project.images.length).padStart(2, "0")}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Next Step / CTA */}
      <section className="py-20 border-t border-border bg-muted/20">
        <div className="max-w-5xl mx-auto px-6 lg:px-10 text-center">
          <h2 className="text-3xl lg:text-4xl font-display font-extrabold text-foreground mb-4">
            Like what you see?
          </h2>
          <p className="text-muted-foreground mb-8 text-base">Let's discuss your next project.</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              to="/"
              className="flex items-center gap-2 px-8 py-4 rounded-full bg-primary text-primary-foreground font-bold hover:shadow-[0_0_40px_rgba(170,255,56,0.25)] transition-all duration-300"
            >
              View more work <ArrowUpRight size={16} />
            </Link>
            <a
              href="mailto:ahmedazy.uxui@gmail.com"
              className="flex items-center gap-2 px-8 py-4 rounded-full border border-border bg-card text-foreground font-semibold hover:border-primary/40 hover:bg-primary/5 transition-all duration-300"
            >
              <Mail size={16} /> Get in touch
            </a>
          </div>
        </div>
      </section>

      {/* Lightbox Component */}
      <Lightbox
        isOpen={lightboxOpen}
        images={allImages}
        initialIndex={lightboxIndex}
        projectTitle={project.title}
        onClose={() => setLightboxOpen(false)}
      />
    </motion.main>
  );
}
