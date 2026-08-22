import React, { useRef } from "react";
import { motion, useInView } from "motion/react";
import { Search, Layers, Smartphone } from "lucide-react";

export default function ServicesSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  const services = [
    {
      icon: Search,
      title: "UX Research & Strategy",
      desc: "Deep user interviews, persona development, information architecture, user journey mapping, and task completion optimization grounded in real behavioral data.",
      tags: ["User Interviews", "Personas", "IA", "Wireframes"],
    },
    {
      icon: Layers,
      title: "UI & Interaction Design",
      desc: "High-fidelity prototyping, responsive system design, and polished interaction patterns for web and mobile interfaces that delight at every touchpoint.",
      tags: ["Hi-Fi Prototypes", "Responsive", "Motion", "Mobile"],
    },
    {
      icon: Smartphone,
      title: "Design Systems",
      desc: "Scalable, atomic design systems with reusable component libraries that keep teams moving fast and products visually consistent at any scale.",
      tags: ["Atomic Design", "Components", "Tokens", "Documentation"],
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
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {services.map(({ icon: Icon, title, desc, tags }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group p-8 rounded-3xl border border-border bg-card hover:border-primary/40 hover:shadow-[0_6px_32px_rgba(0,0,0,0.07)] dark:hover:shadow-[0_0_60px_rgba(170,255,56,0.08)] transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-6 group-hover:bg-primary group-hover:border-primary transition-all duration-300">
                <Icon size={20} className="text-primary group-hover:text-primary-foreground transition-colors duration-300" />
              </div>
              <h3 className="text-xl font-display font-bold text-foreground mb-3">{title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed mb-6">{desc}</p>
              <div className="flex flex-wrap gap-2">
                {tags.map(tag => (
                  <span key={tag} className="text-xs px-2.5 py-1 rounded-full bg-muted text-muted-foreground">
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
