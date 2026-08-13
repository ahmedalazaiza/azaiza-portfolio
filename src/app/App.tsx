import Adashboard from "./Adashboard";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { supabase } from "../lib/supabase";
import { motion, useInView, AnimatePresence } from "motion/react";
import {
  Sun, Moon, Mail, Phone, MapPin, ArrowUpRight,
  ChevronLeft, Menu, X, Award, Users, Clock, Briefcase,
  Layers, Search, Smartphone, PenTool, Star, Send,
  CheckCircle, ExternalLink
} from "lucide-react";

// ─── Backend Config ──────────────────────────────────────────────────────────
// Set VITE_API_URL in your .env to connect your backend
// Usage: fetch(`${API_BASE}/contact`) etc.
export const API_BASE: string = (import.meta as any).env?.VITE_API_URL ?? "https://api.yourdomain.com";

// ─── Types ───────────────────────────────────────────────────────────────────
type Page = "home" | "project" | "adashboard";

interface Project {
  id: number;
  slug: string;
  title: string;
  category: string;
  year: string;
  description: string;
  fullDescription: string;
  tags: string[];
  coverImage: string;
  accentColor: string;
  images: string[];
}

interface Experience {
  id: number;
  period: string;
  role: string;
  company: string;
  location: string;
  current?: boolean;
  highlights: string[];
}


const EXPERIENCES: Experience[] = [
  {
    id: 1, period: "Oct 2023 – Present", current: true,
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
    id: 2, period: "Jun 2022 – Sep 2023",
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
    id: 3, period: "Jan 2023 – Sep 2023",
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
    id: 4, period: "Apr 2020 – Apr 2022",
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
    id: 5, period: "Mar 2019 – Mar 2020",
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
    id: 6, period: "Jan 2019 – Present",
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

// ─── Hooks ───────────────────────────────────────────────────────────────────
function useScrollY() {
  const [y, setY] = useState(0);
  useEffect(() => {
    const handler = () => setY(window.scrollY);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);
  return y;
}

function useCountUp(target: number, inView: boolean, duration = 1800) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [inView, target, duration]);
  return count;
}

// ─── Custom Cursor ────────────────────────────────────────────────────────────
function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const pos = useRef({ x: -100, y: -100 });
  const ring = useRef({ x: -100, y: -100 });

  useEffect(() => {
    const move = (e: MouseEvent) => { pos.current = { x: e.clientX, y: e.clientY }; };
    window.addEventListener("mousemove", move);

    let raf: number;
    const animate = () => {
      ring.current.x += (pos.current.x - ring.current.x) * 0.12;
      ring.current.y += (pos.current.y - ring.current.y) * 0.12;
      if (dotRef.current) dotRef.current.style.transform = `translate(${pos.current.x - 4}px, ${pos.current.y - 4}px)`;
      if (ringRef.current) ringRef.current.style.transform = `translate(${ring.current.x - 20}px, ${ring.current.y - 20}px)`;
      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);

    const grow = () => { ringRef.current?.classList.add("scale-150", "opacity-50"); };
    const shrink = () => { ringRef.current?.classList.remove("scale-150", "opacity-50"); };
    document.querySelectorAll("a,button,[data-cursor-grow]").forEach(el => {
      el.addEventListener("mouseenter", grow);
      el.addEventListener("mouseleave", shrink);
    });

    return () => { window.removeEventListener("mousemove", move); cancelAnimationFrame(raf); };
  }, []);

  return (
    <>
      <div ref={dotRef} className="fixed top-0 left-0 w-2 h-2 bg-primary rounded-full pointer-events-none z-[9999] hidden md:block transition-none" />
      <div ref={ringRef} className="fixed top-0 left-0 w-10 h-10 border border-primary/60 rounded-full pointer-events-none z-[9998] hidden md:block transition-transform duration-150" />
    </>
  );
}

// ─── Navbar ───────────────────────────────────────────────────────────────────
function Navbar({ isDark, onToggle, onBack, page }: {
  isDark: boolean; onToggle: () => void; onBack: () => void; page: Page;
}) {
  const scrollY = useScrollY();
  const [menuOpen, setMenuOpen] = useState(false);
  const solid = scrollY > 40 || menuOpen;

  const navLinks = ["About", "Services", "Work", "Experience", "Contact"];

  const scrollTo = (id: string) => {
    setMenuOpen(false);
    if (page !== "home") { onBack(); setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }), 100); }
    else document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${solid ? "bg-background/90 backdrop-blur-xl border-b border-border" : ""}`}>
      <div className="max-w-7xl mx-auto px-6 lg:px-10 flex items-center justify-between h-16 lg:h-20">
        <button onClick={page === "project" ? onBack : () => scrollTo("hero")}
          className="text-4xl text-foreground hover:opacity-80 transition-opacity leading-none"
          style={{ fontFamily: "'Cookie', cursive" }}>
          Azaiza<span style={{ color: "#aaff38" }}>.</span>
        </button>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          {page === "project" ? (
            <button onClick={onBack} className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm">
              <ChevronLeft size={16} /> Back to home
            </button>
          ) : (
            navLinks.map(l => (
              <button key={l} onClick={() => scrollTo(l.toLowerCase())}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors relative group">
                {l}
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-primary transition-all duration-300 group-hover:w-full" />
              </button>
            ))
          )}
        </div>

        <div className="flex items-center gap-3">
          <button onClick={onToggle}
            className="w-9 h-9 rounded-full flex items-center justify-center border border-border bg-card hover:border-primary/50 hover:bg-primary/10 transition-all duration-300">
            {isDark ? <Sun size={16} className="text-primary" /> : <Moon size={16} className="text-foreground" />}
          </button>
          <button className="hidden md:flex items-center gap-2 px-5 py-2 rounded-full bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity"
            onClick={() => scrollTo("contact")}>
            Hire Me
          </button>
          <button className="md:hidden w-9 h-9 flex items-center justify-center" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            className="md:hidden bg-background/95 backdrop-blur-xl border-b border-border px-6 pb-6">
            {navLinks.map(l => (
              <button key={l} onClick={() => scrollTo(l.toLowerCase())}
                className="block w-full text-left py-3 text-lg text-muted-foreground hover:text-foreground border-b border-border/50 last:border-0 transition-colors">
                {l}
              </button>
            ))}
            <button className="mt-4 w-full py-3 rounded-full bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity"
              onClick={() => scrollTo("contact")}>
              Hire Me
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────
function Hero({ onWorkClick }: { onWorkClick: () => void }) {
  const words = ["Digital", "Experiences"];
  return (
    <section id="hero" className="relative min-h-screen flex items-center overflow-hidden pt-20">
      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[600px] rounded-full blur-[120px] bg-[#aaff38]/5 dark:bg-[#aaff38]/6" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full blur-[100px] bg-[#aaff38]/3" />
      </div>

      {/* Grid pattern */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{ backgroundImage: "linear-gradient(var(--foreground) 1px, transparent 1px), linear-gradient(90deg, var(--foreground) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />

      <div className="max-w-7xl mx-auto px-6 lg:px-10 w-full py-20">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-6 items-center">
          <div>
            {/* Badge */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary text-sm font-mono font-medium mb-8">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              Available for new projects
            </motion.div>

            {/* Headline */}
            <div className="overflow-hidden mb-4">
              <motion.h1 initial={{ y: 100 }} animate={{ y: 0 }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="text-6xl md:text-7xl lg:text-8xl font-display font-extrabold leading-[0.9] tracking-tight text-foreground">
                Crafting
              </motion.h1>
            </div>
            {words.map((word, i) => (
              <div key={word} className="overflow-hidden">
                <motion.h1 initial={{ y: 100 }} animate={{ y: 0 }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 * (i + 1) }}
                  className={`text-6xl md:text-7xl lg:text-8xl font-display font-extrabold leading-[0.9] tracking-tight ${i === 1 ? "text-primary" : "text-foreground"}`}>
                  {word}
                </motion.h1>
              </div>
            ))}
            <div className="overflow-hidden mb-8">
              <motion.h1 initial={{ y: 100 }} animate={{ y: 0 }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
                className="text-6xl md:text-7xl lg:text-8xl font-display font-extrabold leading-[0.9] tracking-tight text-foreground">
                That Feel <span className="italic text-primary/80">Alive.</span>
              </motion.h1>
            </div>

            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.5 }}
              className="text-muted-foreground text-lg max-w-lg leading-relaxed mb-10">
              Ahmed M. Y. Al-Azaiza — Senior UX/UI Designer with 7 years bridging complex business requirements and
              intuitive digital products for Government, EdTech, and Real Estate sectors.
            </motion.p>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.6 }}
              className="flex flex-wrap gap-4">
              <button onClick={onWorkClick}
                className="group flex items-center gap-3 px-8 py-4 rounded-full bg-primary text-primary-foreground font-bold text-base hover:shadow-[0_0_40px_rgba(170,255,56,0.3)] transition-all duration-300">
                View My Work
                <ArrowUpRight size={18} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </button>
              <button onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
                className="group flex items-center gap-3 px-8 py-4 rounded-full border border-border bg-card text-foreground font-semibold text-base hover:border-primary/40 hover:bg-primary/5 transition-all duration-300">
                Contact Me
                <Mail size={18} />
              </button>
            </motion.div>
          </div>

          {/* Right: Avatar + floating cards */}
          <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.9, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="relative flex justify-center lg:justify-end">
            <div className="relative">
          {/* Avatar */}
          <div className="w-64 h-64 lg:w-80 lg:h-80 rounded-3xl border border-primary/20 overflow-hidden relative shadow-[0_0_40px_rgba(74,222,128,0.15)]">
            <img
              src="/image.png"
              alt="Ahmad Azaiza"
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />
          </div>         
          {/* Floating stat cards */}
              <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-6 -left-8 bg-card border border-border rounded-2xl px-4 py-3 shadow-xl">
                <div className="flex items-center gap-2">
                  <Star size={14} className="text-primary fill-primary" />
                  <span className="text-sm font-mono font-semibold text-foreground">100% JSS</span>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">Upwork Top-Rated Plus</p>
              </motion.div>

              <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                className="absolute -bottom-6 -right-8 bg-card border border-border rounded-2xl px-4 py-3 shadow-xl">
                <div className="flex items-center gap-2">
                  <Award size={14} className="text-primary" />
                  <span className="text-sm font-mono font-semibold text-foreground">70+ Projects</span>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">Delivered globally</p>
              </motion.div>

              <motion.div animate={{ y: [0, -6, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute top-1/2 -right-12 -translate-y-1/2 bg-primary text-primary-foreground rounded-2xl px-4 py-3 shadow-xl">
                <div className="text-sm font-mono font-bold">7 Years</div>
                <div className="text-xs opacity-80">Experience</div>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
          <motion.div animate={{ y: [0, 6, 0] }} transition={{ duration: 1.5, repeat: Infinity }}
            className="w-5 h-8 rounded-full border border-muted-foreground/40 flex items-start justify-center pt-1.5">
            <div className="w-1 h-2 rounded-full bg-primary" />
          </motion.div>
          <span className="text-xs text-muted-foreground font-mono">scroll</span>
        </motion.div>
      </div>
    </section>
  );
}

// ─── Stats ────────────────────────────────────────────────────────────────────
interface StatDef { value: number; suffix: string; prefix?: string; label: string; icon: React.ElementType; delay: number; }

function StatItem({ value, suffix, prefix, label, icon: Icon, inView, delay }: StatDef & { inView: boolean }) {
  const count = useCountUp(value, inView, 1600 + delay * 100);
  return (
    <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: delay * 0.1 }}
      className="flex flex-col items-center text-center p-6 rounded-2xl hover:bg-primary/5 transition-colors duration-300 group">
      <Icon size={20} className="text-primary mb-3 group-hover:scale-110 transition-transform" />
      <div className="text-4xl lg:text-5xl font-display font-black text-foreground mb-1">
        {prefix}{count}{suffix}
      </div>
      <div className="text-sm text-muted-foreground font-medium">{label}</div>
    </motion.div>
  );
}

function StatsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const stats: StatDef[] = [
    { value: 7, suffix: "+", label: "Years Experience", icon: Clock, delay: 0 },
    { value: 70, suffix: "+", label: "Projects Delivered", icon: Briefcase, delay: 1 },
    { value: 100, suffix: "%", label: "Job Success Score", icon: Award, delay: 2 },
    { value: 80, prefix: "$", suffix: "K+", label: "In Design Solutions", icon: Users, delay: 3 },
  ];
  return (
    <section ref={ref} className="py-20 border-y border-border">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-4">
          {stats.map(s => <StatItem key={s.label} {...s} inView={inView} />)}
        </div>
      </div>
    </section>
  );
}

// ─── About ────────────────────────────────────────────────────────────────────
function AboutSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const skills = [
    "UX Research", "User Interviews", "Persona Development", "Information Architecture",
    "Wireframing", "Prototyping", "High-Fidelity UI", "Design Systems", "Atomic Design",
    "Responsive Design", "Interaction Design", "Figma", "Sketch", "FigJam", "Balsamiq",
    "Government Portals", "LMS Platforms", "SaaS Products", "Real Estate UX", "RTL Design",
  ];
  const tools = ["Figma", "Sketch", "Principle", "FigJam", "Balsamiq"];

  return (
    <section id="about" ref={ref} className="py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-start">
          <div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5 }}>
              <span className="text-primary font-mono text-sm font-medium tracking-widest uppercase">About Me</span>
              <h2 className="mt-4 text-4xl lg:text-5xl font-display font-extrabold text-foreground leading-tight">
                Bridging business complexity with human simplicity
              </h2>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: 0.15 }}
              className="mt-6 space-y-4 text-muted-foreground leading-relaxed">
              <p>
                Strategic Senior UX/UI Designer with nearly 7 years of professional experience, combining a technical
                Information & Communication Technology background with an MBA mindset.
              </p>
              <p>
                I specialize in high-impact user experiences for Government, EdTech, and Real Estate sectors —
                recognized as a Top-Rated Plus professional on Upwork with a 100% Job Success Score across 70+ completed jobs.
              </p>
              <p>
                Based in Istanbul, Turkey — working globally and fluent in Arabic and English.
              </p>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: 0.25 }}
              className="mt-8 grid grid-cols-2 gap-4">
              {[
                { label: "Location", value: "Istanbul, Turkey" },
                { label: "Availability", value: "Open to work" },
                { label: "Languages", value: "Arabic · English" },
                { label: "Education", value: "MBA · ICT B.Sc." },
              ].map(({ label, value }) => (
                <div key={label} className="p-4 rounded-xl bg-card border border-border">
                  <div className="text-xs text-muted-foreground font-mono uppercase tracking-wide mb-1">{label}</div>
                  <div className="text-sm font-semibold text-foreground">{value}</div>
                </div>
              ))}
            </motion.div>
          </div>

          <div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: 0.1 }}>
              <h3 className="text-sm font-mono font-medium text-muted-foreground uppercase tracking-widest mb-4">Skills & Expertise</h3>
              <div className="flex flex-wrap gap-2 mb-10">
                {skills.map((skill, i) => (
                  <motion.span key={skill} initial={{ opacity: 0, scale: 0.8 }} animate={inView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ duration: 0.3, delay: 0.2 + i * 0.02 }}
                    className="px-3 py-1.5 text-xs font-medium rounded-full border border-border bg-card text-foreground hover:border-primary/40 hover:bg-primary/5 hover:text-primary transition-all duration-200 cursor-default">
                    {skill}
                  </motion.span>
                ))}
              </div>

              <h3 className="text-sm font-mono font-medium text-muted-foreground uppercase tracking-widest mb-4">Tools</h3>
              <div className="flex flex-wrap gap-3">
                {tools.map((tool) => (
                  <div key={tool} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/10 border border-primary/20 text-primary text-sm font-semibold">
                    <PenTool size={13} />
                    {tool}
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Services ─────────────────────────────────────────────────────────────────
function ServicesSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const services = [
    {
      icon: Search, title: "UX Research & Strategy",
      desc: "Deep user interviews, persona development, information architecture, user journey mapping, and task completion optimization grounded in real behavioral data.",
      tags: ["User Interviews", "Personas", "IA", "Wireframes"],
    },
    {
      icon: Layers, title: "UI & Interaction Design",
      desc: "High-fidelity prototyping, responsive system design, and polished interaction patterns for web and mobile interfaces that delight at every touchpoint.",
      tags: ["Hi-Fi Prototypes", "Responsive", "Motion", "Mobile"],
    },
    {
      icon: Smartphone, title: "Design Systems",
      desc: "Scalable, atomic design systems with reusable component libraries that keep teams moving fast and products visually consistent at any scale.",
      tags: ["Atomic Design", "Components", "Tokens", "Documentation"],
    },
  ];

  return (
    <section id="services" ref={ref} className="py-24 lg:py-32 bg-muted/30">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5 }}
          className="text-center mb-16">
          <span className="text-primary font-mono text-sm font-medium tracking-widest uppercase">What I Do</span>
          <h2 className="mt-4 text-4xl lg:text-5xl font-display font-extrabold text-foreground">Services</h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {services.map(({ icon: Icon, title, desc, tags }, i) => (
            <motion.div key={title} initial={{ opacity: 0, y: 40 }} animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.12 }}
              className="group p-8 rounded-3xl border border-border bg-card hover:border-primary/40 hover:shadow-[0_6px_32px_rgba(0,0,0,0.07)] dark:hover:shadow-[0_0_60px_rgba(170,255,56,0.08)] transition-all duration-500">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-6 group-hover:bg-primary group-hover:border-primary transition-all duration-300">
                <Icon size={20} className="text-primary group-hover:text-primary-foreground transition-colors duration-300" />
              </div>
              <h3 className="text-xl font-display font-bold text-foreground mb-3">{title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed mb-6">{desc}</p>
              <div className="flex flex-wrap gap-2">
                {tags.map(tag => (
                  <span key={tag} className="text-xs px-2.5 py-1 rounded-full bg-muted text-muted-foreground">{tag}</span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Timeline ─────────────────────────────────────────────────────────────────
function TimelineSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [expanded, setExpanded] = useState<number | null>(null);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadExperiences() {
      const { data, error } = await supabase
        .from("experiences")
        .select("*")
        .order("sort_order", { ascending: true });

      if (error) {
        console.error("Error loading experiences:", error);
        setLoading(false);
        return;
      }

      const mapped: Experience[] = (data || []).map((item: any) => ({
        id: item.id,
        period: item.period || "",
        role: item.role || "",
        company: item.company || "",
        location: item.location || "",
        current: item.current || false,
        highlights: item.highlights
          ? item.highlights.split("|").map((h: string) => h.trim())
          : [],
      }));

      setExperiences(mapped);
      setLoading(false);
    }

    loadExperiences();
  }, []);

  return (
    <section id="experience" ref={ref} className="py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
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
          <div className="absolute left-6 lg:left-8 top-0 bottom-0 w-px bg-border" />

          <div className="space-y-2">
            {loading ? (
              <p className="text-muted-foreground pl-16">Loading experience...</p>
            ) : experiences.length === 0 ? (
              <p className="text-muted-foreground pl-16">No experience added yet.</p>
            ) : (
              experiences.map((exp, i) => (
                <motion.div
                  key={exp.id}
                  initial={{ opacity: 0, x: -30 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                >
                  <button
                    onClick={() => setExpanded(expanded === exp.id ? null : exp.id)}
                    className="w-full text-left group"
                  >
                    <div className="flex items-start gap-6 lg:gap-10 pl-16 lg:pl-20 relative py-5 rounded-2xl hover:bg-primary/5 transition-colors duration-200 pr-4">
                      {/* Dot */}
                      <div
                        className={`absolute left-4 lg:left-6 top-7 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                          expanded === exp.id
                            ? "border-primary bg-primary scale-125"
                            : "border-border bg-card group-hover:border-primary/60"
                        }`}
                      >
                        {exp.current && (
                          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mb-1">
                          <span className="text-xs font-mono text-primary bg-primary/10 px-2.5 py-0.5 rounded-full">
                            {exp.period}
                          </span>
                          {exp.current && (
                            <span className="text-xs font-mono text-primary bg-primary/10 px-2.5 py-0.5 rounded-full border border-primary/20">
                              Current
                            </span>
                          )}
                        </div>
                        <h3 className="text-lg font-display font-bold text-foreground">
                          {exp.role}
                        </h3>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-sm text-muted-foreground font-medium">
                            {exp.company}
                          </span>
                          <span className="text-border">·</span>
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <MapPin size={11} />
                            {exp.location}
                          </span>
                        </div>
                      </div>
                      <div
                        className={`shrink-0 w-6 h-6 rounded-full border border-border flex items-center justify-center mt-1 transition-transform duration-300 ${
                          expanded === exp.id
                            ? "rotate-180 border-primary bg-primary/10"
                            : "group-hover:border-primary/50"
                        }`}
                      >
                        <ChevronLeft size={13} className="rotate-[-90deg]" />
                      </div>
                    </div>

                    <AnimatePresence>
                      {expanded === exp.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <ul className="pl-16 lg:pl-20 pr-4 pb-6 space-y-2">
                            {exp.highlights.map((h, j) => (
                              <li
                                key={j}
                                className="flex items-start gap-3 text-sm text-muted-foreground"
                              >
                                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                                {h}
                              </li>
                            ))}
                          </ul>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </button>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Portfolio ────────────────────────────────────────────────────────────────
function PortfolioSection({ onProjectClick }: { onProjectClick: (p: Project) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProjects() {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .order("id", { ascending: true });

      if (error) {
        console.error("Error loading projects:", error);
        setLoading(false);
        return;
      }

      const mapped: Project[] = (data || []).map((item: any) => ({
        id: item.id,
        slug: item.slug || "",
        title: item.title || "",
        category: item.category || "",
        year: item.year || "",
        description: item.description || "",
        fullDescription: item.full_description || "",
        tags: item.tags ? item.tags.split(",").map((t: string) => t.trim()) : [],
        coverImage: item.cover_image || item.image_url || "",
        accentColor: item.accent_color || "#4ade80",
        images: item.images
          ? item.images.split(",").map((img: string) => img.trim())
          : [],
      }));

      setProjects(mapped);
      setLoading(false);
    }

    loadProjects();
  }, []);

  return (
    <section id="work" ref={ref} className="py-24 lg:py-32 bg-muted/20">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-16"
        >
          <div>
            <span className="text-primary font-mono text-sm font-medium tracking-widest uppercase">
              My Work
            </span>
            <h2 className="mt-4 text-4xl lg:text-5xl font-display font-extrabold text-foreground">
              Selected Projects
            </h2>
          </div>
          <p className="text-muted-foreground max-w-sm text-sm">
            Hover to explore. Click to go deep.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <p className="text-muted-foreground col-span-full">Loading projects...</p>
          ) : projects.length === 0 ? (
            <p className="text-muted-foreground col-span-full">No projects yet.</p>
          ) : (
            projects.map((project, i) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 40 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: i * 0.08 }}
              >
                <ProjectCard
                  project={project}
                  onClick={() => onProjectClick(project)}
                />
              </motion.div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}

function ProjectCard({ project, onClick }: { project: Project; onClick: () => void }) {
  const [hovered, setHovered] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLButtonElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    // عطّل الـ tilt على الشاشات الصغيرة
    if (window.innerWidth < 768) return;
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 10;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -10;
    setTilt({ x, y });
  }, []);

  const resetTilt = () => {
    setTilt({ x: 0, y: 0 });
    setHovered(false);
  };

  return (
    <button
      ref={cardRef}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={resetTilt}
      onMouseMove={handleMouseMove}
      className="w-full max-w-full min-w-0 text-left group relative rounded-3xl overflow-hidden border border-border bg-card transition-all duration-300 hover:border-primary/40 hover:shadow-[0_8px_40px_rgba(0,0,0,0.08)] dark:hover:shadow-[0_20px_60px_rgba(0,0,0,0.35)]"
      style={{
        transform:
          window.innerWidth >= 768
            ? `perspective(1000px) rotateX(${tilt.y}deg) rotateY(${tilt.x}deg)`
            : "none",
        transition: hovered
          ? "transform 0.1s ease"
          : "transform 0.5s ease, box-shadow 0.3s ease, border-color 0.3s ease",
      }}
    >
      {/* Image */}
      <div className="relative h-48 sm:h-52 overflow-hidden">
        <img
          src={project.coverImage}
          alt={project.title}
          className="w-full h-full max-w-full object-cover object-center transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent dark:from-black/70 dark:via-black/20" />
        <div
          className={`absolute inset-0 transition-opacity duration-500 ${hovered ? "opacity-100" : "opacity-0"}`}
          style={{
            background: `linear-gradient(135deg, ${project.accentColor}22 0%, transparent 60%)`,
          }}
        />
      </div>

      {/* Content */}
      <div className="p-5 sm:p-6 min-w-0">
        <div className="flex items-center justify-between mb-3 gap-2">
          <span className="text-xs font-mono text-primary bg-primary/10 px-2.5 py-1 rounded-full shrink-0">
            {project.year}
          </span>
          <ArrowUpRight
            size={18}
            className={`text-primary shrink-0 transition-all duration-300 ${
              hovered ? "opacity-100 translate-x-0.5 -translate-y-0.5" : "opacity-0"
            }`}
          />
        </div>
        <h3 className="text-lg font-display font-bold text-foreground mb-1.5 group-hover:text-primary transition-colors duration-300 break-words">
          {project.title}
        </h3>
        <p className="text-xs text-muted-foreground mb-4 leading-relaxed line-clamp-2 break-words">
          {project.description}
        </p>
        <div className="text-xs text-muted-foreground font-mono break-words">
          {project.category}
        </div>
      </div>

      {/* Bottom accent bar */}
      <div
        className={`absolute bottom-0 left-0 right-0 h-0.5 transition-all duration-500 ${
          hovered ? "opacity-100" : "opacity-0"
        }`}
        style={{
          background: `linear-gradient(90deg, transparent, ${project.accentColor}, transparent)`,
        }}
      />
    </button>
  );
}
// ─── Contact ──────────────────────────────────────────────────────────────────
function ContactSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
  
    try {
      const { error } = await supabase.from("messages").insert([
        {
          name: form.name,
          email: form.email,
          subject: form.subject,
          message: form.message,
          is_read: false,
        },
      ]);
  
      if (error) {
        throw error;
      }
  
      setStatus("success");
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  };
  
  const inputClass = "w-full px-5 py-3.5 rounded-xl border border-border bg-input-background text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/20 transition-all duration-200 text-sm";

  return (
    <section id="contact" ref={ref} className="py-24 lg:py-32 border-t border-border">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-start">
          <motion.div initial={{ opacity: 0, x: -30 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.6 }}>
            <span className="text-primary font-mono text-sm font-medium tracking-widest uppercase">Get In Touch</span>
            <h2 className="mt-4 text-4xl lg:text-5xl font-display font-extrabold text-foreground leading-tight">
              Let's build something great together.
            </h2>
            <p className="mt-6 text-muted-foreground leading-relaxed">
              Whether you have a project in mind or just want to chat about design — my inbox is always open.
              I typically respond within 24 hours.
            </p>

            <div className="mt-10 space-y-4">
              {[
                { icon: Mail, label: "Email", value: "ahmedazy.uxui@gmail.com", href: "mailto:ahmedazy.uxui@gmail.com" },
                { icon: Phone, label: "Phone", value: "+90 507 638 12 62", href: "tel:+905076381262" },
                { icon: MapPin, label: "Location", value: "Istanbul, Turkey", href: null },
              ].map(({ icon: Icon, label, value, href }) => (
                <div key={label} className="flex items-center gap-4 p-4 rounded-2xl border border-border bg-card hover:border-primary/30 transition-colors duration-200">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <Icon size={16} className="text-primary" />
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground font-mono">{label}</div>
                    {href ? (
                      <a href={href} className="text-sm font-semibold text-foreground hover:text-primary transition-colors">{value}</a>
                    ) : (
                      <div className="text-sm font-semibold text-foreground">{value}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 flex items-center gap-4">
              <a href="https://www.upwork.com/freelancers/ahmedazaiza" target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-border bg-card text-sm text-foreground hover:border-primary/40 hover:bg-primary/5 transition-all duration-200 font-medium">
                <ExternalLink size={14} className="text-primary" /> Upwork Profile
              </a>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 30 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.6, delay: 0.1 }}>
            {status === "success" ? (
              <div className="flex flex-col items-center justify-center text-center py-16 h-full">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                  <CheckCircle size={28} className="text-primary" />
                </div>
                <h3 className="text-2xl font-display font-bold text-foreground mb-3">Message sent!</h3>
                <p className="text-muted-foreground mb-8">Thanks for reaching out. I'll get back to you soon.</p>
                <button onClick={() => setStatus("idle")}
                  className="px-6 py-3 rounded-full bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity">
                  Send another
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-mono text-muted-foreground uppercase tracking-wide block mb-2">Name</label>
                    <input name="name" value={form.name} onChange={handleChange} required placeholder="Ahmed Al-Azaiza"
                      className={inputClass} />
                  </div>
                  <div>
                    <label className="text-xs font-mono text-muted-foreground uppercase tracking-wide block mb-2">Email</label>
                    <input name="email" type="email" value={form.email} onChange={handleChange} required placeholder="you@company.com"
                      className={inputClass} />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-mono text-muted-foreground uppercase tracking-wide block mb-2">Subject</label>
                  <input name="subject" value={form.subject} onChange={handleChange} required placeholder="Project collaboration"
                    className={inputClass} />
                </div>
                <div>
                  <label className="text-xs font-mono text-muted-foreground uppercase tracking-wide block mb-2">Message</label>
                  <textarea name="message" value={form.message} onChange={handleChange} required rows={5} placeholder="Tell me about your project..."
                    className={`${inputClass} resize-none`} />
                </div>
                {status === "error" && (
                  <p className="text-sm text-destructive-foreground bg-destructive/20 rounded-lg px-4 py-2.5">
                    Something went wrong. Please try again or email directly.
                  </p>
                )}
                <button type="submit" disabled={status === "loading"}
                  className="w-full flex items-center justify-center gap-3 py-4 rounded-xl bg-primary text-primary-foreground font-bold text-base hover:shadow-[0_0_40px_rgba(170,255,56,0.25)] disabled:opacity-60 transition-all duration-300">
                  {status === "loading" ? (
                    <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" /> Sending...</span>
                  ) : (
                    <><Send size={16} /> Send Message</>
                  )}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────
function Footer({ onScrollTop }: { onScrollTop: () => void }) {
  return (
    <footer className="py-10 border-t border-border bg-muted/20">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="text-center sm:text-left">
          <div className="text-4xl text-foreground mb-1 leading-none" style={{ fontFamily: "'Cookie', cursive" }}>
            Azaiza<span style={{ color: "#aaff38" }}>.</span>
          </div>
          <p className="text-xs text-muted-foreground">Senior UX/UI Designer · Istanbul, Turkey</p>
        </div>
        <p className="text-xs text-muted-foreground text-center">
          © {new Date().getFullYear()} Ahmed M. Y. Al-Azaiza · All rights reserved
        </p>
        <button onClick={onScrollTop}
          className="w-10 h-10 rounded-full border border-border bg-card flex items-center justify-center hover:border-primary/50 hover:bg-primary/10 transition-all duration-200 group">
          <ChevronLeft size={16} className="rotate-90 text-muted-foreground group-hover:text-primary transition-colors" />
        </button>
      </div>
    </footer>
  );
}

// ─── Project Detail Page ──────────────────────────────────────────────────────
function ProjectDetail({ project, onBack }: { project: Project; onBack: () => void }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
      {/* Hero */}
      <section className="relative pt-28 pb-16 lg:pt-36 lg:pb-20 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full blur-[140px]"
            style={{ background: `${project.accentColor}10` }} />
        </div>
        <div className="max-w-5xl mx-auto px-6 lg:px-10 relative">
          <button onClick={onBack}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-10 group">
            <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            Back to portfolio
          </button>

          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <span className="text-xs font-mono px-3 py-1.5 rounded-full border bg-card text-muted-foreground">{project.year}</span>
              <span className="text-xs font-mono px-3 py-1.5 rounded-full border border-border/50 text-muted-foreground">{project.category}</span>
            </div>
            <h1 className="text-5xl lg:text-7xl font-display font-extrabold text-foreground leading-tight mb-6">{project.title}</h1>
            <p className="text-xl text-muted-foreground leading-relaxed max-w-lg break-words">
  {project.fullDescription}
</p>
          </motion.div>
        </div>
      </section>

      {/* Tags */}
      <section className="py-8 border-y border-border bg-muted/20">
        <div className="max-w-5xl mx-auto px-6 lg:px-10">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-xs font-mono text-muted-foreground uppercase tracking-widest shrink-0">Tags ·</span>
            {project.tags.map(tag => (
              <span key={tag} className="px-3 py-1.5 text-xs font-medium rounded-full border border-primary/20 bg-primary/10 text-primary">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Image Grid: 2 per row */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-6 lg:px-10">
          <h2 className="text-2xl font-display font-bold text-foreground mb-10">Project Gallery</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {project.images.map((src, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.5, delay: (i % 2) * 0.1 }}
                className="group relative rounded-2xl overflow-hidden border border-border bg-card aspect-[3/2]">
                <img src={src} alt={`${project.title} — image ${i + 1}`}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-3 right-3 bg-black/50 backdrop-blur-sm rounded-full px-3 py-1 text-white text-xs font-mono opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {String(i + 1).padStart(2, "0")} / {String(project.images.length).padStart(2, "0")}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 border-t border-border bg-muted/20">
        <div className="max-w-5xl mx-auto px-6 lg:px-10 text-center">
          <h2 className="text-3xl lg:text-4xl font-display font-extrabold text-foreground mb-4">Like what you see?</h2>
          <p className="text-muted-foreground mb-8">Let's discuss your next project.</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <button onClick={onBack}
              className="flex items-center gap-2 px-8 py-4 rounded-full bg-primary text-primary-foreground font-bold hover:shadow-[0_0_40px_rgba(170,255,56,0.25)] transition-all duration-300">
              View more work <ArrowUpRight size={16} />
            </button>
            <a href="mailto:ahmedazy.uxui@gmail.com"
              className="flex items-center gap-2 px-8 py-4 rounded-full border border-border bg-card text-foreground font-semibold hover:border-primary/40 hover:bg-primary/5 transition-all duration-300">
              <Mail size={16} /> Get in touch
            </a>
          </div>
        </div>
      </section>
    </motion.div>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [isDark, setIsDark] = useState(true);
  const [page, setPage] = useState<Page>(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get("page") === "adashboard" ? "adashboard" : "home";
  });
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("theme");
    const dark = stored ? stored === "dark" : true;
    setIsDark(dark);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
    localStorage.setItem("theme", isDark ? "dark" : "light");
  }, [isDark]);

  const handleProjectClick = (project: Project) => {
    setSelectedProject(project);
    setPage("project");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBack = () => {
    setPage("home");
    setSelectedProject(null);
    setTimeout(() => document.getElementById("work")?.scrollIntoView({ behavior: "smooth" }), 50);
  };

  const scrollToWork = () => {
    document.getElementById("work")?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <CustomCursor />
      {page !== "adashboard" && (
  <Navbar isDark={isDark} onToggle={() => setIsDark(d => !d)} onBack={handleBack} page={page} />
)}

      <AnimatePresence mode="wait">
        {page === "home" ? (
          <motion.main key="home" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
            <Hero onWorkClick={scrollToWork} />
            <StatsSection />
            <AboutSection />
            <ServicesSection />
            <TimelineSection />
            <PortfolioSection onProjectClick={handleProjectClick} />
            <ContactSection />
            <Footer onScrollTop={scrollToTop} />
          </motion.main>
        ) : page === "project" ? (
          <motion.main key="project" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
            {selectedProject && <ProjectDetail project={selectedProject} onBack={handleBack} />}
            <Footer onScrollTop={scrollToTop} />
          </motion.main>
        ) : (
          <motion.main key="adashboard" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
            <Adashboard onBack={() => setPage("home")} />
          </motion.main>
        )}
      </AnimatePresence>

    </div>
  );
}
