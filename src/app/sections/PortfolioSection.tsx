import React, { useState, useEffect, useRef } from "react";
import { motion, useInView } from "motion/react";
import { supabase } from "../../lib/supabase";
import { Project } from "../types";
import ProjectCard from "../components/ProjectCard";
import { FALLBACK_PROJECTS } from "../data/fallbackProjects";

export default function PortfolioSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  const [projects, setProjects] = useState<Project[]>(FALLBACK_PROJECTS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProjects() {
      try {
        const { data, error } = await supabase
          .from("projects")
          .select("*")
          .order("id", { ascending: true });

        if (!error && data && data.length > 0) {
          const mapped: Project[] = data.map((item: any) => ({
            id: item.id,
            slug: item.slug || String(item.id),
            title: item.title || "",
            category: item.category || "",
            year: item.year || "",
            description: item.description || "",
            fullDescription: item.full_description || "",
            tags: item.tags ? item.tags.split(",").map((t: string) => t.trim()) : [],
            coverImage: item.cover_image || item.image_url || "/image.png",
            accentColor: item.accent_color || "#4ade80",
            images: item.images
              ? item.images.split(",").map((img: string) => img.trim())
              : [],
          }));
          setProjects(mapped);
        }
      } catch (err) {
        console.error("Error in loadProjects:", err);
      } finally {
        setLoading(false);
      }
    }

    loadProjects();
  }, []);

  return (
    <section id="work" ref={ref} className="py-24 lg:py-32 bg-muted/20">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="min-w-0 overflow-hidden mb-12 flex flex-col md:flex-row md:items-end justify-between gap-4"
        >
          <div>
            <span className="text-primary font-mono text-sm font-medium tracking-widest uppercase">
              My Work
            </span>
            <h2 className="mt-4 text-4xl lg:text-5xl font-display font-extrabold text-foreground">
              Selected Projects
            </h2>
          </div>
          <p className="text-muted-foreground text-sm max-w-xs">
            Hover to explore. Click to go deep.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-full py-12 text-center text-muted-foreground">
              Loading projects...
            </div>
          ) : projects.length === 0 ? (
            <div className="col-span-full py-12 text-center text-muted-foreground">
              No projects found.
            </div>
          ) : (
            projects.map((project, i) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 25 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: i * 0.07 }}
              >
                <ProjectCard project={project} />
              </motion.div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
