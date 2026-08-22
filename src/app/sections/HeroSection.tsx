import React from "react";
import { motion } from "motion/react";
import { ArrowUpRight, Mail, Star, Award, ChevronDown } from "lucide-react";

interface HeroSectionProps {
  onWorkClick: () => void;
}

export default function HeroSection({ onWorkClick }: HeroSectionProps) {
  const words = ["Digital", "Experiences"];

  const scrollToContact = () => {
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="hero" className="relative min-h-screen flex items-center overflow-hidden pt-20">
      {/* Ambient glow - using performant radial gradient instead of heavy blur filters */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 800px 600px at 50% 25%, rgba(170, 255, 56, 0.07), transparent 70%), radial-gradient(circle 400px at 90% 85%, rgba(170, 255, 56, 0.04), transparent 70%)",
        }}
      />

      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(var(--foreground) 1px, transparent 1px), linear-gradient(90deg, var(--foreground) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="max-w-7xl mx-auto px-6 lg:px-10 w-full py-20 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-6 items-center">
          {/* Left Column: Headline & Intro */}
          <div>
            {/* Availability Badge */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary text-sm font-mono font-medium mb-8"
            >
              <span className="w-2 h-2 rounded-full bg-primary" />
              Available for new projects
            </motion.div>

            {/* Headline with Staggered Entrance */}
            <div className="overflow-hidden mb-4">
              <motion.h1
                initial={{ y: 80, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="text-6xl md:text-7xl lg:text-8xl font-display font-extrabold leading-[0.9] tracking-tight text-foreground"
              >
                Crafting
              </motion.h1>
            </div>

            {words.map((word, i) => (
              <div key={word} className="overflow-hidden">
                <motion.h1
                  initial={{ y: 80, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.08 * (i + 1) }}
                  className={`text-6xl md:text-7xl lg:text-8xl font-display font-extrabold leading-[0.9] tracking-tight ${
                    i === 1 ? "text-primary" : "text-foreground"
                  }`}
                >
                  {word}
                </motion.h1>
              </div>
            ))}

            <div className="overflow-hidden mb-8">
              <motion.h1
                initial={{ y: 80, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.25 }}
                className="text-6xl md:text-7xl lg:text-8xl font-display font-extrabold leading-[0.9] tracking-tight text-foreground"
              >
                That Feel <span className="italic text-primary/80">Alive.</span>
              </motion.h1>
            </div>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="text-muted-foreground text-lg max-w-lg leading-relaxed mb-10"
            >
              Ahmed M. Y. Al-Azaiza — Senior UX/UI Designer with 7 years bridging complex business requirements and
              intuitive digital products for Government, EdTech, and Real Estate sectors.
            </motion.p>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="flex flex-wrap gap-4"
            >
              <button
                onClick={onWorkClick}
                className="group flex items-center gap-3 px-8 py-4 rounded-full bg-primary text-primary-foreground font-bold text-base hover:shadow-[0_0_40px_rgba(170,255,56,0.3)] transition-all duration-300 active:scale-95"
              >
                View My Work
                <ArrowUpRight size={18} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </button>
              <button
                onClick={scrollToContact}
                className="group flex items-center gap-3 px-8 py-4 rounded-full border border-border bg-card text-foreground font-semibold text-base hover:border-primary/40 hover:bg-primary/5 transition-all duration-300 active:scale-95"
              >
                Contact Me
                <Mail size={18} />
              </button>
            </motion.div>
          </div>

          {/* Right Column: Avatar + Static/Clean Settled Stat Cards (No Infinite Laggy JS Loops) */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="relative flex justify-center lg:justify-end"
          >
            <div className="relative">
              {/* Avatar Container */}
              <div className="w-64 h-64 lg:w-80 lg:h-80 rounded-3xl border border-primary/20 overflow-hidden relative shadow-[0_0_40px_rgba(74,222,128,0.12)]">
                <img
                  src="/image.png"
                  alt="Ahmed Azaiza"
                  width={320}
                  height={320}
                  className="w-full h-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />
              </div>

              {/* Stat Card 1: Top Left - Clean Entrance, No JS Animation Loop */}
              <motion.div
                initial={{ opacity: 0, scale: 0.85, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.45, ease: "easeOut" }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="absolute -top-6 -left-8 bg-card/95 backdrop-blur-sm border border-border rounded-2xl px-4 py-3 shadow-lg hover:border-primary/40 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Star size={14} className="text-primary fill-primary" />
                  <span className="text-sm font-mono font-semibold text-foreground">100% JSS</span>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">Upwork Top-Rated Plus</p>
              </motion.div>

              {/* Stat Card 2: Bottom Right */}
              <motion.div
                initial={{ opacity: 0, scale: 0.85, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.55, ease: "easeOut" }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="absolute -bottom-6 -right-8 bg-card/95 backdrop-blur-sm border border-border rounded-2xl px-4 py-3 shadow-lg hover:border-primary/40 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Award size={14} className="text-primary" />
                  <span className="text-sm font-mono font-semibold text-foreground">70+ Projects</span>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">Delivered globally</p>
              </motion.div>

              {/* Stat Card 3: Right Center */}
              <motion.div
                initial={{ opacity: 0, scale: 0.85, x: 15 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.65, ease: "easeOut" }}
                whileHover={{ x: 4, transition: { duration: 0.2 } }}
                className="absolute top-1/2 -right-12 -translate-y-1/2 bg-primary text-primary-foreground rounded-2xl px-4 py-3 shadow-lg hover:opacity-95 transition-opacity"
              >
                <div className="text-sm font-mono font-bold">7 Years</div>
                <div className="text-xs opacity-90 font-medium">Experience</div>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 cursor-pointer opacity-70 hover:opacity-100 transition-opacity"
          onClick={onWorkClick}
        >
          <div className="w-5 h-8 rounded-full border border-muted-foreground/40 flex items-start justify-center pt-1.5">
            <div className="w-1 h-2 rounded-full bg-primary" />
          </div>
          <span className="text-[11px] text-muted-foreground font-mono">scroll</span>
        </motion.div>
      </div>
    </section>
  );
}
