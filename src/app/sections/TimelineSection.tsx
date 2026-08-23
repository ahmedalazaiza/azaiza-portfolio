import React, { useState, useEffect, useRef } from "react";
import { motion, useInView } from "motion/react";
import { MapPin, Calendar, Briefcase, Sparkles, Building2, CheckCircle2, ArrowUpRight } from "lucide-react";
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
    id: 6,
    period: "Jan 2019 – Present",
    current: true,
    role: "Senior UX/UI Designer · Freelance",
    company: "Upwork",
    location: "Global · Remote",
    highlights: [
      "Top-Rated Plus: Top 3% of freelancers worldwide",
      "100% Job Success Score across 70+ end-to-end projects",
      "$80K+ in delivered design solutions · 560+ expert hours logged",
    ],
  },
  {
    id: 2,
    period: "Jun 2022 – Sep 2023",
    current: false,
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
    current: false,
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
    current: false,
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
    current: false,
    role: "UX/UI Designer",
    company: "Crowdbotics (via Upwork)",
    location: "Global · Remote",
    highlights: [
      "Designed interfaces for a low-code/no-code application development platform",
      "Created dashboards visualizing AI-driven codebase insights",
      "Built scalable design systems for enterprise software modules",
    ],
  },
];

// Helper: Calculate chronological sorting score from period string
function getPeriodScore(period: string, isCurrent: boolean): number {
  const isNow = isCurrent || /present|current|now|حالي|الان/i.test(period);
  
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
  const years = period.match(/\b(20\d{2}|19\d{2})\b/g) || [];

  if (isNow) {
    // Current positions always come on top; sub-sorted by start date (newest start first)
    const startYear = years.length > 0 ? parseInt(years[0], 10) : 2024;
    const startMonth = years.length > 0 ? getMonthNum(period, years[0]) : 1;
    return 9000000000 + (startYear * 100 + startMonth);
  }

  if (years.length >= 2) {
    const startYear = parseInt(years[0], 10);
    const startMonth = getMonthNum(period, years[0]);
    const endYear = parseInt(years[1], 10);
    const endMonth = getMonthNum(period, years[1]);
    return (endYear * 100 + endMonth) * 100000 + (startYear * 100 + startMonth);
  } else if (years.length === 1) {
    const yr = parseInt(years[0], 10);
    const mo = getMonthNum(period, years[0]);
    return (yr * 100 + mo) * 100000;
  }

  return 0;
}

export function sortExperiences(exps: Experience[]): Experience[] {
  return [...exps].sort((a, b) => {
    const isCurrentA = a.current || /present|current|now|حالي|الان/i.test(a.period);
    const isCurrentB = b.current || /present|current|now|حالي|الان/i.test(b.period);

    const scoreA = getPeriodScore(a.period, isCurrentA);
    const scoreB = getPeriodScore(b.period, isCurrentB);

    if (scoreA !== scoreB) {
      return scoreB - scoreA; // descending (newest first)
    }

    return (a.id || 0) - (b.id || 0);
  });
}

export default function TimelineSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [experiences, setExperiences] = useState<Experience[]>(() => sortExperiences(FALLBACK_EXPERIENCES));

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
          setExperiences(sortExperiences(mapped));
        }
      } catch (e) {
        console.error("Error loading experiences:", e);
      }
    }

    loadExperiences();
  }, []);

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
                <span className="text-xs font-mono text-muted-foreground">· {experiences.length} Roles</span>
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
            <div className="relative pl-6 sm:pl-8 border-l-2 border-primary/20 dark:border-primary/25 space-y-8">
              {experiences.map((exp, i) => {
                const isCurrent = exp.current || /present|current|now|حالي|الان/i.test(exp.period);

                return (
                  <motion.div
                    key={exp.id || i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.4, delay: i * 0.07 }}
                    className="relative group"
                  >
                    {/* Glowing Timeline Indicator Dot */}
                    <div
                      className={`absolute -left-[31px] sm:-left-[39px] top-4 w-4 h-4 rounded-full border-2 bg-card transition-all duration-300 ${
                        isCurrent
                          ? "border-primary ring-4 ring-primary/20 scale-110 shadow-[0_0_12px_rgba(170,255,56,0.5)]"
                          : "border-primary/60 group-hover:border-primary group-hover:scale-110"
                      }`}
                    >
                      <div
                        className={`w-1.5 h-1.5 rounded-full absolute inset-0 m-auto ${
                          isCurrent ? "bg-primary animate-pulse" : "bg-primary/80"
                        }`}
                      />
                    </div>

                    {/* Clean Experience Card */}
                    <div className="p-6 sm:p-7 rounded-3xl border border-border bg-card hover:border-primary/40 hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] dark:hover:shadow-[0_0_40px_rgba(170,255,56,0.05)] transition-all duration-300">
                      {/* Top Badges */}
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                        <div className="flex items-center gap-2">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-mono text-primary font-medium">
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
                        <span className="text-xs font-mono text-muted-foreground flex items-center gap-1">
                          <MapPin size={12} className="text-primary" />
                          {exp.location}
                        </span>
                      </div>

                      {/* Role & Company */}
                      <div className="mb-4">
                        <h3 className="text-lg sm:text-xl font-display font-bold text-foreground group-hover:text-primary transition-colors duration-200">
                          {exp.role}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <Building2 size={14} className="text-muted-foreground" />
                          <span className="text-sm font-semibold text-foreground/90 font-display">
                            {exp.company}
                          </span>
                        </div>
                      </div>

                      {/* Highlights */}
                      {exp.highlights && exp.highlights.length > 0 && (
                        <div className="pt-3 border-t border-border/50">
                          <ul className="space-y-2">
                            {exp.highlights.map((h, j) => (
                              <li
                                key={j}
                                className="flex items-start gap-2.5 text-xs sm:text-sm text-muted-foreground leading-relaxed"
                              >
                                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                                <span>{h}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
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
