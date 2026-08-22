import React, { useRef } from "react";
import { motion, useInView } from "motion/react";
import { PenTool } from "lucide-react";

export default function AboutSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

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
          {/* Left Column */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5 }}
            >
              <span className="text-primary font-mono text-sm font-medium tracking-widest uppercase">About Me</span>
              <h2 className="mt-4 text-4xl lg:text-5xl font-display font-extrabold text-foreground leading-tight">
                Bridging business complexity with human simplicity
              </h2>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mt-6 space-y-4 text-muted-foreground leading-relaxed"
            >
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

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-8 grid grid-cols-2 gap-4"
            >
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

          {/* Right Column: Skills & Tools */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <h3 className="text-sm font-mono font-medium text-muted-foreground uppercase tracking-widest mb-4">
                Skills & Expertise
              </h3>
              <div className="flex flex-wrap gap-2 mb-10">
                {skills.map((skill, i) => (
                  <motion.span
                    key={skill}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={inView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ duration: 0.3, delay: 0.15 + i * 0.015 }}
                    className="px-3 py-1.5 text-xs font-medium rounded-full border border-border bg-card text-foreground hover:border-primary/40 hover:bg-primary/5 hover:text-primary transition-all duration-150 cursor-default"
                  >
                    {skill}
                  </motion.span>
                ))}
              </div>

              <h3 className="text-sm font-mono font-medium text-muted-foreground uppercase tracking-widest mb-4">
                Tools
              </h3>
              <div className="flex flex-wrap gap-3">
                {tools.map((tool) => (
                  <div
                    key={tool}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/10 border border-primary/20 text-primary text-sm font-semibold"
                  >
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
