import React, { useRef } from "react";
import { motion, useInView } from "motion/react";
import { 
  Search, 
  Layers, 
  Boxes, 
  LineChart, 
  Smartphone, 
  Code2 
} from "lucide-react";

export default function ServicesSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  const services = [
    {
      icon: Search,
      title: "UX Research & Strategy",
      desc: "Deep user interviews, persona development, information architecture, user journey mapping, and task completion optimization grounded in real behavioral data.",
      tags: ["User Interviews", "Personas", "IA & Flows", "Data-Driven"],
    },
    {
      icon: Layers,
      title: "UI & Interaction Design",
      desc: "High-fidelity interactive prototyping, responsive system design, and polished micro-interactions for web and mobile interfaces that engage users.",
      tags: ["Hi-Fi Prototypes", "Micro-Interactions", "Motion", "Modern UI"],
    },
    {
      icon: Boxes,
      title: "Scalable Design Systems",
      desc: "Comprehensive atomic design systems, reusable Figma component libraries, and design tokens that accelerate team velocity and visual consistency.",
      tags: ["Atomic Design", "Figma Variables", "Tokens", "Documentation"],
    },
    {
      icon: LineChart,
      title: "UX Audit & Conversion (CRO)",
      desc: "Comprehensive heuristic evaluation of existing digital products to detect UX bottlenecks, reduce churn, and optimize conversion funnels.",
      tags: ["Heuristic Analysis", "Conversion Rate", "Usability Audit", "User Retention"],
    },
    {
      icon: Smartphone,
      title: "SaaS & Mobile Product Design",
      desc: "End-to-end digital product design from initial concept to launch-ready prototypes for complex SaaS platforms, B2B tools, and iOS/Android apps.",
      tags: ["SaaS Dashboards", "iOS & Android", "MVP to Scale", "User Journeys"],
    },
    {
      icon: Code2,
      title: "Design-to-Dev Handoff & Alignment",
      desc: "Bridging the gap between design and engineering with production-ready specs, variable naming, and technical feasibility backed by ICT knowledge.",
      tags: ["Dev Specs", "Tokens Handoff", "Tech Alignment", "QA Design Review"],
    },
  ];

  return (
    <section id="services" ref={ref} className="py-24 lg:py-32 bg-muted/30">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="text-primary font-mono text-sm font-medium tracking-widest uppercase">What I Do</span>
          <h2 className="mt-4 text-4xl lg:text-5xl font-display font-extrabold text-foreground">Services</h2>
          <p className="mt-3 text-muted-foreground text-base max-w-xl mx-auto">
            Strategic design solutions crafted to turn complex business requirements into intuitive, high-performing digital experiences.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map(({ icon: Icon, title, desc, tags }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="group p-8 rounded-3xl border border-border bg-card hover:border-primary/40 hover:shadow-[0_6px_32px_rgba(0,0,0,0.07)] dark:hover:shadow-[0_0_60px_rgba(170,255,56,0.08)] transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-6 group-hover:bg-primary group-hover:border-primary transition-all duration-300">
                  <Icon size={20} className="text-primary group-hover:text-primary-foreground transition-colors duration-300" />
                </div>
                <h3 className="text-xl font-display font-bold text-foreground mb-3">{title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-6">{desc}</p>
              </div>
              <div className="flex flex-wrap gap-2 pt-2 border-t border-border/40">
                {tags.map(tag => (
                  <span key={tag} className="text-xs px-2.5 py-1 rounded-full bg-muted text-muted-foreground group-hover:text-foreground transition-colors">
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
