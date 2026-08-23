import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useInView } from "motion/react";
import { MapPin, Calendar, Briefcase, Building2, CheckCircle2, ArrowUpRight, ChevronDown } from "lucide-react";
import { supabase } from "../../lib/supabase";
import { Experience } from "../types";

const FALLBACK_EXPERIENCES: Experience[] = [
  {
    id: 7,
    period: "Oct 2023 – Present",
    current: true,
    role: "Senior UX/UI Designer",
    company: "HAD For Communications & IT",
    location: "Riyadh, SA · Remote",
    highlights: [
      "Lead end-to-end UX/UI design process for high-profile Saudi government web portals, ensuring full compliance with national digital transformation standards and accessibility guidelines.",
      "Architected educational platforms and mobile applications dedicated to teaching Arabic to non-native speakers, focusing on intuitive user journeys and interactive learning experiences.",
      "Directed UX strategy for various service-based applications within the Saudi market, optimizing user flows to enhance engagement and streamline digital service delivery.",
      "Collaborated cross-functionally with product managers and developers to translate complex business requirements into high-fidelity wireframes, interactive prototypes, and scalable design systems.",
    ],
  },
  {
    id: 13,
    period: "Jan 2019 – Present",
    current: true,
    role: "Senior UX/UI Designer (Freelance)",
    company: "Upwork",
    location: "Global · Remote",
    highlights: [
      "Top-Rated Plus Professional: Recognized among the top 3% of freelancers worldwide, maintaining a 100% Job Success Score (JSS) across 70+ end-to-end projects.",
      "High-Value Delivery: Successfully delivered $80K+ in design solutions, accumulating 560+ hours of expert-level execution for international startups and enterprises.",
      "Specialized Expertise: Praised by global clients for designing complex LMS platforms and SaaS products, ensuring seamless web and mobile user journeys.",
      "Full Product Lifecycle: Managed diverse workflows including requirement gathering, user research, and scalable design system development for a global clientele.",
    ],
  },
  {
    id: 11,
    period: "Aug 2023",
    current: false,
    role: "Mentor, 4-Days UX/UI Bootcamp",
    company: "GazaSkyGeeks",
    location: "Gaza, PS",
    highlights: [
      "Mentored and guided aspiring designers through an intensive 4-day bootcamp, focusing on the fundamentals of user-centered design and industry-standard workflows.",
      "Provided hands-on technical support in Figma, helping participants transform their ideas into functional wireframes and high-fidelity prototypes.",
      "Conducted design critique sessions, offering professional feedback on UI layouts, color theory, and user journeys to ensure project quality.",
    ],
  },
  {
    id: 8,
    period: "Jun 2022 – Sep 2023",
    current: false,
    role: "Senior UX/UI Designer",
    company: "Gaza Gateway | Contracted to FamilySearch",
    location: "Utah, USA · Remote",
    highlights: [
      "Designed and localized digital experiences for the MENA region, focusing on genealogical platforms that help users discover and document their family lineages and historical roots.",
      "Spearheaded extensive user research and field interviews across the MENA region to capture authentic user requirements, transforming qualitative insights into actionable design strategies.",
      "Conceptualized complex visual structures for family trees and kinship diagrams, simplifying the representation of intricate ancestral data and historical connections.",
      "Integrated cultural elements into UI design, creating specialized interfaces for showcasing ancient poetry, tribal history, and regional heritage in a modern format.",
    ],
  },
  {
    id: 9,
    period: "Jan 2023 – Sep 2023",
    current: false,
    role: "UX/UI Consultant & Mentor",
    company: "Gaza Gateway",
    location: "Gaza, PS · Local",
    highlights: [
      "Acted as a Strategic Design Consultant for outsourced international projects, providing expert recommendations on software solutions and UI/UX best practices.",
      "Orchestrated technical recruitment for design roles, including portfolio reviews, design challenges, and interviewing candidates to ensure high-quality talent acquisition.",
      "Identified knowledge gaps within the design team and provided targeted mentorship to enhance technical skills and maintain high delivery standards.",
    ],
  },
  {
    id: 10,
    period: "Apr 2020 – Apr 2022",
    current: false,
    role: "UX/UI Designer",
    company: "Valcom Properties LLC.",
    location: "Dubai, UAE · On-site",
    highlights: [
      "Designed and optimized the corporate real estate platform, focusing on high-end property listings and seamless user journeys for buyers and tenants.",
      "Streamlined communication flow between international leads and internal real estate agents by designing intuitive contact interfaces and lead management features.",
      "Enhanced user engagement by implementing advanced search filters and interactive map views for luxury villas and apartments.",
    ],
  },
  {
    id: 12,
    period: "Mar 2019 – Mar 2020",
    current: false,
    role: "UX/UI Designer (Contract)",
    company: "Crowdbotics (via Upwork)",
    location: "Global · Remote",
    highlights: [
      "Translated complex technical requirements into user-friendly interfaces for a low-code/no-code application development platform, enabling users to build and deploy apps efficiently.",
      "Designed intuitive dashboards and workflows that visualized complex codebase insights and automated software development pipelines.",
      "Developed scalable design systems and reusable UI components that maintained consistency across various custom-built software modules for global clients.",
    ],
  },
];

// Helper: Calculate chronological sorting score from period string
function getPeriodScore(period: string = "", isCurrent: boolean = false): number {
  const periodStr = String(period || "");
  const isNow = isCurrent || /present|current|now|حالي|الان/i.test(periodStr);
  
  const monthsMap: Record<string, number> = {
    jan: 1, feb: 2, mar: 3, apr: 4, may: 5, jun: 6,
    jul: 7, aug: 8, sep: 9, oct: 10, nov: 11, dec: 12
  };

  const getMonthNum = (str: string, yearStr: string): number => {
    const regex = new RegExp(`([a-zA-Z]{3,9})\\s*${yearStr}`, "i");
    const m = str.match(regex);
    if (m && m[1]) {
      const p = m[1].toLowerCase().slice(0, 3);
      if (monthsMap[p]) return monthsMap[p];
    }
    return 1;
  };

  // Find all 4-digit years in string
  const years = periodStr.match(/\b(20\d{2}|19\d{2})\b/g) || [];

  if (isNow) {
    // Current positions always come on top; sub-sorted by start date (newest start first)
    const startYear = years.length > 0 ? parseInt(years[0], 10) : 2024;
    const startMonth = years.length > 0 ? getMonthNum(periodStr, years[0]) : 1;
    return 9000000000 + (startYear * 100 + startMonth);
  }

  if (years.length >= 2) {
    const startYear = parseInt(years[0], 10);
    const startMonth = getMonthNum(periodStr, years[0]);
    const endYear = parseInt(years[1], 10);
    const endMonth = getMonthNum(periodStr, years[1]);
    return (endYear * 100 + endMonth) * 100000 + (startYear * 100 + startMonth);
  } else if (years.length === 1) {
    const yr = parseInt(years[0], 10);
    const mo = getMonthNum(periodStr, years[0]);
    return (yr * 100 + mo) * 100000;
  }

  return 0;
}

// Deduplicate experiences (keep richest entry if same company & role exist)
function deduplicateExperiences(items: Experience[]): Experience[] {
  if (!items || !Array.isArray(items)) return [];
  const map = new Map<string, Experience>();
  for (const item of items) {
    if (!item) continue;
    const normCompany = (item.company || "").toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 10);
    const normRole = (item.role || "").toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 10);
    const key = `${normCompany}-${normRole}` || `item-${item.id}`;
    
    const existing = map.get(key);
    if (!existing) {
      map.set(key, item);
    } else {
      const getLen = (h: any) => Array.isArray(h) ? h.join(" ").length : String(h || "").length;
      const existingLen = getLen(existing.highlights);
      const itemLen = getLen(item.highlights);
      if (itemLen >= existingLen) {
        map.set(key, item);
      }
    }
  }
  return Array.from(map.values());
}

export function sortExperiences(exps: Experience[], skipDedupe = false): Experience[] {
  if (!exps || !Array.isArray(exps)) return [];
  const list = skipDedupe ? [...exps] : deduplicateExperiences(exps);
  return list.sort((a, b) => {
    const isCurrentA = !!a.current || /present|current|now|حالي|الان/i.test(a.period || "");
    const isCurrentB = !!b.current || /present|current|now|حالي|الان/i.test(b.period || "");

    // 1. Current positions always first
    if (isCurrentA && !isCurrentB) return -1;
    if (!isCurrentA && isCurrentB) return 1;

    // 2. Chronological score comparison
    const scoreA = getPeriodScore(a.period || "", isCurrentA);
    const scoreB = getPeriodScore(b.period || "", isCurrentB);

    if (scoreA !== scoreB) {
      return scoreB - scoreA; // descending (newest first)
    }

    return (b.id || 0) - (a.id || 0);
  });
}

export default function TimelineSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  
  const initialSorted = sortExperiences(FALLBACK_EXPERIENCES);
  const [experiences, setExperiences] = useState<Experience[]>(initialSorted);
  // Default open card: The first / Current active role
  const [expandedId, setExpandedId] = useState<number | null>(() => initialSorted[0]?.id || null);

  useEffect(() => {
    async function loadExperiences() {
      try {
        const { data, error } = await supabase
          .from("experiences")
          .select("*");

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
          const sorted = sortExperiences(mapped);
          setExperiences(sorted);
          // Keep current role open by default if not yet opened
          if (sorted.length > 0) {
            setExpandedId(sorted[0].id);
          }
        }
      } catch (e) {
        console.error("Error loading experiences:", e);
      }
    }

    loadExperiences();
  }, []);

  const toggleAccordion = (id: number) => {
    // Exactly one card can be open at a time; clicking the open card toggles it off
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <section id="experience" ref={ref} className="py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        {/* Section Header */}
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column: Summary & Overview Sticky Card */}
          <div className="lg:col-span-4 lg:sticky lg:top-28">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center gap-2 mb-3">
                <span className="text-primary font-mono text-xs font-semibold tracking-widest uppercase">
                  Career Path
                </span>
                <span className="text-xs font-mono text-muted-foreground">· {experiences.length} Positions</span>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold text-foreground leading-tight">
                Work Experience
              </h2>
              <p className="mt-4 text-muted-foreground text-sm leading-relaxed">
                A proven track record of driving UX strategy, design systems, and product innovation across Saudi Arabia, USA, UAE, and global markets.
              </p>
            </motion.div>

            {/* Quick Metrics Bento Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="mt-8 p-6 rounded-3xl border border-border bg-card shadow-sm space-y-4"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                  <Briefcase size={20} />
                </div>
                <div>
                  <div className="text-sm font-display font-bold text-foreground">Track Record</div>
                  <div className="text-xs text-muted-foreground">8+ Years of Craft</div>
                </div>
              </div>

              <div className="space-y-2.5 pt-3 border-t border-border/60 text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-primary shrink-0" />
                  <span>Top-Rated Plus on Upwork (Top 3% globally)</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-primary shrink-0" />
                  <span>Government & Enterprise Portals at scale</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-primary shrink-0" />
                  <span>Cross-functional engineering & product teams</span>
                </div>
              </div>

              <a
                href="#contact"
                className="mt-2 flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-primary/10 border border-primary/20 hover:bg-primary hover:text-primary-foreground text-primary text-xs font-semibold transition-all duration-200"
              >
                <span>Discuss Opportunities</span>
                <ArrowUpRight size={14} />
              </a>
            </motion.div>
          </div>

          {/* Right Column: Sleek Streamlined Chronological Timeline */}
          <div className="lg:col-span-8">
            <div className="relative pl-6 sm:pl-8 border-l-2 border-primary/20 dark:border-primary/25 space-y-6">
              {experiences.map((exp, i) => {
                const isCurrent = exp.current || /present|current|now|حالي|الان/i.test(exp.period);
                const isExpanded = expandedId === exp.id;

                return (
                  <motion.div
                    key={exp.id || i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.4, delay: i * 0.06 }}
                    className="relative group"
                  >
                    {/* Glowing Timeline Indicator Dot */}
                    <div
                      className={`absolute -left-[31px] sm:-left-[39px] top-5 w-4 h-4 rounded-full border-2 bg-card transition-all duration-300 ${
                        isCurrent
                          ? "border-primary ring-4 ring-primary/20 scale-110 shadow-[0_0_12px_rgba(170,255,56,0.5)]"
                          : isExpanded
                          ? "border-primary scale-105"
                          : "border-primary/60 group-hover:border-primary group-hover:scale-105"
                      }`}
                    >
                      <div
                        className={`w-1.5 h-1.5 rounded-full absolute inset-0 m-auto ${
                          isCurrent
                            ? "bg-primary animate-pulse"
                            : isExpanded
                            ? "bg-primary"
                            : "bg-primary/80"
                        }`}
                      />
                    </div>

                    {/* Accordion Experience Card (Only one open at a time) */}
                    <div
                      className={`rounded-3xl border transition-all duration-300 overflow-hidden ${
                        isExpanded
                          ? "border-primary/50 bg-card shadow-[0_8px_30px_rgba(0,0,0,0.06)] dark:shadow-[0_0_40px_rgba(170,255,56,0.06)]"
                          : "border-border bg-card/80 hover:border-primary/30 hover:bg-card"
                      }`}
                    >
                      {/* Clickable Card Header */}
                      <button
                        type="button"
                        onClick={() => toggleAccordion(exp.id)}
                        className="w-full text-left p-5 sm:p-6 cursor-pointer focus:outline-none flex items-start justify-between gap-4 select-none"
                      >
                        <div className="flex-1 min-w-0">
                          {/* Top Badges */}
                          <div className="flex flex-wrap items-center gap-2 mb-2.5">
                            <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-primary/10 border border-primary/20 text-xs font-mono text-primary font-medium">
                              <Calendar size={12} />
                              {exp.period}
                            </span>
                            {isCurrent && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-primary/20 text-primary text-xs font-semibold font-mono">
                                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-ping" />
                                Active Role
                              </span>
                            )}
                          </div>

                          {/* Role & Company */}
                          <h3 className="text-lg sm:text-xl font-display font-bold text-foreground group-hover:text-primary transition-colors duration-200">
                            {exp.role}
                          </h3>
                          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-sm">
                            <div className="flex items-center gap-1.5 font-semibold text-foreground/90 font-display">
                              <Building2 size={14} className="text-primary" />
                              <span>{exp.company}</span>
                            </div>
                            <span className="text-muted-foreground/40 hidden sm:inline">·</span>
                            <div className="text-xs text-muted-foreground flex items-center gap-1 font-mono">
                              <MapPin size={12} className="text-primary" />
                              <span>{exp.location}</span>
                            </div>
                          </div>
                        </div>

                        {/* Chevron Toggle Button */}
                        <div
                          className={`shrink-0 w-8 h-8 rounded-full border border-border flex items-center justify-center transition-all duration-300 mt-1 ${
                            isExpanded
                              ? "bg-primary text-primary-foreground border-primary rotate-180 shadow-sm"
                              : "bg-muted/40 text-muted-foreground group-hover:border-primary/40 group-hover:text-foreground"
                          }`}
                        >
                          <ChevronDown size={16} />
                        </div>
                      </button>

                      {/* Smooth Accordion Body (Collapsible Highlights) */}
                      <AnimatePresence initial={false}>
                        {isExpanded && exp.highlights && exp.highlights.length > 0 && (
                          <motion.div
                            key="content"
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.25, ease: "easeInOut" }}
                            className="overflow-hidden"
                          >
                            <div className="px-5 sm:px-6 pb-6 pt-2 border-t border-border/50">
                              <ul className="space-y-2.5">
                                {exp.highlights.map((h, j) => (
                                  <li
                                    key={j}
                                    className="flex items-start gap-3 text-xs sm:text-sm text-muted-foreground leading-relaxed"
                                  >
                                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                                    <span>{h}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
