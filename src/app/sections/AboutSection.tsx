import React, { useRef } from "react";
import { motion, useInView } from "motion/react";
import { 
  PenTool, 
  MapPin, 
  Quote, 
  Users, 
  Compass, 
  Layers, 
  Navigation, 
  Lightbulb, 
  Eye, 
  Sparkles,
  HeartHandshake
} from "lucide-react";

export default function AboutSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  const strengths = [
    {
      title: "Human-Centered Design",
      desc: "I create user flows, wireframes, and prototypes that put real people at the heart of every interaction.",
      icon: Users,
    },
    {
      title: "Research-Driven Thinking",
      desc: "Insights from real users guide every decision, ensuring the product truly resonates.",
      icon: Compass,
    },
    {
      title: "Cross-Platform Consistency",
      desc: "From mobile apps to responsive websites and desktop tools, I maintain a unified and seamless experience.",
      icon: Layers,
    },
    {
      title: "Effortless Navigation",
      desc: "I design interfaces that feel natural — helping users move through the product with ease.",
      icon: Navigation,
    },
    {
      title: "Creative Solutions",
      desc: "I solve design challenges with fresh thinking, aligned with business objectives and brand voice.",
      icon: Lightbulb,
    },
    {
      title: "Visual Precision",
      desc: "Clean, modern, and accessible interfaces that balance form and function.",
      icon: Eye,
    },
  ];

  const skills = [
    "UX Research", "User Interviews", "Persona Development", "Information Architecture",
    "Wireframing", "Prototyping", "High-Fidelity UI", "Design Systems", "Atomic Design",
    "Responsive Design", "Interaction Design", "Usability Testing", "Design Tokens",
  ];

  const tools = ["Figma", "Sketch", "Principle", "FigJam", "Balsamiq"];

  return (
    <section id="about" ref={ref} className="py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        {/* Top Header */}
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-start mb-16">
          <div className="lg:col-span-7">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5 }}
            >
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <span className="text-primary font-mono text-sm font-medium tracking-widest uppercase">About Me</span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-mono text-primary">
                  <MapPin size={12} /> Based in Turkey, Istanbul
                </span>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold text-foreground leading-tight">
                Turning complex ideas into intuitive, purposeful experiences.
              </h2>
            </motion.div>

            {/* Philosophy Quote Callout */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mt-8 p-6 rounded-2xl bg-muted/40 dark:bg-card border border-border/80 relative"
            >
              <Quote className="absolute top-4 right-4 text-primary/20" size={32} />
              <p className="text-base sm:text-lg font-display italic font-semibold text-foreground">
                “If UI is a galaxy, then UX is an entire universe.”
              </p>
            </motion.div>

            {/* Bio Text */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="mt-6 space-y-4 text-muted-foreground text-base sm:text-lg leading-relaxed"
            >
              <p>
                With <span className="text-foreground font-semibold">8+ years of hands-on experience</span> in UX/UI design, I specialize in turning complex ideas into simple, meaningful, and visually engaging digital experiences.
              </p>
              <p>
                My work bridges the gap between user needs and business goals — crafting products that are not only beautiful, but also intuitive and purposeful.
              </p>
            </motion.div>
          </div>

          {/* Right Highlights / Collaboration Card */}
          <div className="lg:col-span-5 space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="p-6 sm:p-7 rounded-3xl border border-border bg-card shadow-sm space-y-4"
            >
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                <HeartHandshake size={24} />
              </div>
              <h3 className="text-xl font-display font-bold text-foreground">Collaboration & Impact</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                I work best when I'm working with others — developers, product owners, marketers, and end users. I believe in design as a strategic tool that drives value: increasing conversions, improving retention, and building trust.
              </p>
              <div className="pt-2 border-t border-border flex items-center gap-2 text-primary text-sm font-semibold font-display">
                <Sparkles size={16} />
                <span>Let’s design something people will love — and remember.</span>
              </div>
            </motion.div>

            {/* Quick stats tags */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.25 }}
              className="grid grid-cols-2 gap-3"
            >
              <div className="p-4 rounded-2xl bg-card border border-border">
                <div className="text-xs text-muted-foreground font-mono uppercase tracking-wide mb-1">Languages</div>
                <div className="text-sm font-semibold text-foreground">Arabic · English</div>
              </div>
              <div className="p-4 rounded-2xl bg-card border border-border">
                <div className="text-xs text-muted-foreground font-mono uppercase tracking-wide mb-1">Availability</div>
                <div className="text-sm font-semibold text-foreground text-primary flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  Open to work
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* ─── UX/UI Design Strengths Grid ────────────────────────────── */}
        <div className="mt-8 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mb-8"
          >
            <span className="text-primary font-mono text-xs font-semibold tracking-widest uppercase">Core Strengths</span>
            <h3 className="text-2xl sm:text-3xl font-display font-extrabold text-foreground mt-1">
              UX/UI Design Strengths
            </h3>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {strengths.map(({ title, desc, icon: Icon }, idx) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: 0.3 + idx * 0.05 }}
                className="p-6 rounded-2xl border border-border bg-card hover:border-primary/40 hover:bg-primary/[0.02] transition-all duration-200 group"
              >
                <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Icon size={20} />
                </div>
                <h4 className="text-base font-display font-bold text-foreground group-hover:text-primary transition-colors mb-2">
                  {title}
                </h4>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  {desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ─── Skills & Tools Footer ─────────────────────────────────── */}
        <div className="pt-10 border-t border-border grid lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8">
            <h4 className="text-xs font-mono font-semibold text-muted-foreground uppercase tracking-widest mb-3">
              Skills & Methodologies
            </h4>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <span
                  key={skill}
                  className="px-3 py-1.5 text-xs font-medium rounded-full border border-border bg-card text-foreground hover:border-primary/40 hover:text-primary transition-colors cursor-default"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div className="lg:col-span-4">
            <h4 className="text-xs font-mono font-semibold text-muted-foreground uppercase tracking-widest mb-3">
              Primary Tool Stack
            </h4>
            <div className="flex flex-wrap gap-2.5">
              {tools.map((tool) => (
                <div
                  key={tool}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-primary/10 border border-primary/20 text-primary text-xs font-semibold"
                >
                  <PenTool size={12} />
                  {tool}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
