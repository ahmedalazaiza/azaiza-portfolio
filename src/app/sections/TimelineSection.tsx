import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useInView } from "motion/react";
import { MapPin, ChevronLeft } from "lucide-react";
import { supabase } from "../../lib/supabase";
import { Experience } from "../types";

const FALLBACK_EXPERIENCES: Experience[] = [
  {
    id: 1,
    period: "Oct 2023 – Present",
    current: true,
    role: "Senior UX/UI Designer",
    company: "HAD For Communications & IT",
    location: "Riyadh, Saudi Arabia · Remote",
    highlights: [
      "Lead end-to-end UX/UI design for high-profile Saudi government web portals",
      "Architected educational platforms for Arabic language learning at scale",
      "Directed UX strategy for service applications within the Saudi market",
      "Delivered high-fidelity wireframes, prototypes, and scalable design systems",
    ],
  },
  {
    id: 2,
    period: "Jun 2022 – Sep 2023",
    role: "Senior UX/UI Designer",
    company: "Gaza Gateway × FamilySearch",
    location: "Utah, USA · Remote",
    highlights: [
      "Designed and localized genealogy experiences for the MENA region",
      "Spearheaded field user research across multiple MENA countries",
      "Conceptualized kinship diagram systems for complex ancestral data",
      "Integrated cultural heritage elements into modern digital interfaces",
    ],
  },
  {
    id: 3,
    period: "Jan 2023 – Sep 2023",
    role: "UX/UI Consultant & Mentor",
    company: "Gaza Gateway",
    location: "Gaza, Palestine · Local",
    highlights: [
      "Strategic design consultant for outsourced international projects",
      "Orchestrated technical recruitment and portfolio reviews for design roles",
      "Mentored design team to maintain high standards for international clients",
    ],
  },
  {
    id: 4,
    period: "Apr 2020 – Apr 2022",
    role: "UX/UI Designer",
    company: "Valcom Properties LLC.",
    location: "Dubai, UAE · On-site",
    highlights: [
      "Designed and optimized the corporate luxury real estate platform",
      "Implemented interactive map views and advanced search filters",
      "Streamlined lead-to-agent communication workflows for international buyers",
    ],
  },
  {
    id: 5,
    period: "Mar 2019 – Mar 2020",
    role: "UX/UI Designer",
    company: "Crowdbotics (via Upwork)",
    location: "Global · Remote",
    highlights: [
      "Designed interfaces for a low-code/no-code application development platform",
      "Created dashboards visualizing AI-driven codebase insights",
      "Built scalable design systems for enterprise software modules",
    ],
  },
  {
    id: 6,
    period: "Jan 2019 – Present",
    role: "Senior UX/UI Designer · Freelance",
    company: "Upwork",
    location: "Global · Remote",
    highlights: [
      "Top-Rated Plus: Top 3% of freelancers worldwide",
      "100% Job Success Score across 70+ end-to-end projects",
      "$80K+ in delivered design solutions · 560+ expert hours logged",
    ],
  },
];

export default function TimelineSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [expanded, setExpanded] = useState<number | null>(null);
  const [experiences, setExperiences] = useState<Experience[]>(FALLBACK_EXPERIENCES);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadExperiences() {
      try {
        const { data, error } = await supabase
          .from("experiences")
          .select("*")
          .order("sort_order", { ascending: true });

        if (!error && data && data.length > 0) {
          const mapped: Experience[] = data.map((item: any) => ({
            id: item.id,
            period: item.period || "",
            role: item.role || "",
            company: item.company || "",
            location: item.location || "",
            current: item.current || false,
            highlights: item.highlights
              ? (item.highlights.includes("|")
                  ? item.highlights.split("|")
                  : item.highlights.split("\n")
                )
                  .map((h: string) => h.trim())
                  .filter(Boolean)
              : [],
          }));
          setExperiences(mapped);
        }
      } catch (e) {
        console.error("Error loading experiences:", e);
      } finally {
        setLoading(false);
      }
    }

    loadExperiences();
  }, []);

  return (
    <section id="experience" ref={ref} className="py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="mb-16"
        >
          <span className="text-primary font-mono text-sm font-medium tracking-widest uppercase">
            Career Path
          </span>
          <h2 className="mt-4 text-4xl lg:text-5xl font-display font-extrabold text-foreground">
            Experience
          </h2>
        </motion.div>

        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-6 lg:left-8 top-3 bottom-3 w-[2px] bg-gradient-to-b from-primary/50 via-border/80 to-primary/20" />

          <div className="space-y-3">
            {experiences.map((exp, i) => (
              <motion.div
                key={exp.id}
                initial={{ opacity: 0, x: -20 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.4, delay: i * 0.08 }}
              >
                <button
                  onClick={() => setExpanded(expanded === exp.id ? null : exp.id)}
                  className="w-full text-left group"
                >
                  <div className={`flex items-start gap-6 lg:gap-10 pl-16 lg:pl-20 relative py-5 px-4 rounded-2xl border transition-all duration-200 ${
                    expanded === exp.id
                      ? "bg-muted/40 dark:bg-card/70 border-border/80 shadow-sm"
                      : "border-transparent hover:bg-primary/[0.04] dark:hover:bg-primary/[0.06] hover:border-border/50"
                  }`}>
                    {/* Unified Dot */}
                    <div
                      className={`absolute left-4 lg:left-6 top-6 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                        expanded === exp.id
                          ? "border-primary bg-primary scale-110 shadow-[0_0_12px_rgba(170,255,56,0.4)]"
                          : exp.current
                          ? "border-primary bg-card ring-4 ring-primary/20 shadow-[0_0_8px_rgba(170,255,56,0.3)]"
                          : "border-primary/50 bg-card group-hover:border-primary group-hover:scale-105"
                      }`}
                    >
                      <div
                        className={`w-2 h-2 rounded-full transition-colors duration-200 ${
                          expanded === exp.id
                            ? "bg-primary-foreground"
                            : "bg-primary"
                        }`}
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 mb-1.5">
                        <span className="text-xs font-mono text-primary bg-primary/10 border border-primary/20 px-2.5 py-0.5 rounded-full font-medium">
                          {exp.period}
                        </span>
                        {exp.current && (
                          <span className="text-xs font-mono text-primary bg-primary/15 border border-primary/35 px-2.5 py-0.5 rounded-full font-semibold flex items-center gap-1.5">
                            <span className="relative flex h-2 w-2">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                            </span>
                            Current
                          </span>
                        )}
                      </div>
                      <h3 className="text-lg sm:text-xl font-display font-bold text-foreground group-hover:text-primary transition-colors duration-200">
                        {exp.role}
                      </h3>
                      <div className="flex flex-wrap items-center gap-2 mt-1">
                        <span className="text-sm font-semibold text-foreground/90">
                          {exp.company}
                        </span>
                        <span className="text-muted-foreground/60">·</span>
                        <span className="text-xs text-muted-foreground font-medium flex items-center gap-1">
                          <MapPin size={12} className="text-primary" />
                          {exp.location}
                        </span>
                      </div>
                    </div>

                    <div
                      className={`shrink-0 w-7 h-7 rounded-full border border-border bg-card/80 flex items-center justify-center mt-1 transition-all duration-200 text-muted-foreground ${
                        expanded === exp.id
                          ? "rotate-180 border-primary bg-primary/15 text-primary"
                          : "group-hover:border-primary/50 group-hover:text-primary"
                      }`}
                    >
                      <ChevronLeft size={14} className="rotate-[-90deg]" />
                    </div>
                  </div>

                  <AnimatePresence>
                    {expanded === exp.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden"
                      >
                        <div className="ml-16 lg:ml-20 mr-4 mt-2 mb-4 p-5 rounded-2xl bg-muted/40 dark:bg-card/60 border border-border/70">
                          <ul className="space-y-2.5">
                            {exp.highlights.map((h, j) => (
                              <li
                                key={j}
                                className="flex items-start gap-3 text-sm text-foreground/85 leading-relaxed"
                              >
                                <span className="mt-2 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                                <span>{h}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
