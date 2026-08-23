import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { motion } from "motion/react";
import { Home, ArrowLeft, Compass, Sparkles, Briefcase, Mail, RefreshCw } from "lucide-react";

export default function NotFoundPage() {
  const navigate = useNavigate();
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [cursorPos1, setCursorPos1] = useState({ x: 40, y: 30 });
  const [cursorPos2, setCursorPos2] = useState({ x: 70, y: 65 });

  useEffect(() => {
    window.scrollTo(0, 0);

    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      setMousePos({
        x: (e.clientX / innerWidth - 0.5) * 30,
        y: (e.clientY / innerHeight - 0.5) * 30,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const handleRandomizeCursors = () => {
    setCursorPos1({
      x: Math.floor(Math.random() * 60) + 15,
      y: Math.floor(Math.random() * 50) + 20,
    });
    setCursorPos2({
      x: Math.floor(Math.random() * 60) + 20,
      y: Math.floor(Math.random() * 50) + 30,
    });
  };

  return (
    <main className="min-h-screen relative flex items-center justify-center pt-20 pb-16 px-6 overflow-hidden bg-background">
      {/* Background Radial Glow & Grid Mesh */}
      <div
        className="absolute inset-0 pointer-events-none opacity-40 dark:opacity-30 transition-all duration-300"
        style={{
          backgroundImage: `radial-gradient(circle at 50% 50%, rgba(170, 255, 56, 0.12) 0%, transparent 60%), radial-gradient(rgba(255, 255, 255, 0.07) 1px, transparent 1px)`,
          backgroundSize: "100% 100%, 32px 32px",
          transform: `translate3d(${mousePos.x * 0.4}px, ${mousePos.y * 0.4}px, 0)`,
        }}
      />

      {/* Floating Figma Collaborator Cursors (Interactive Easter Egg) */}
      <motion.div
        animate={{ left: `${cursorPos1.x}%`, top: `${cursorPos1.y}%` }}
        transition={{ type: "spring", damping: 25, stiffness: 90 }}
        className="absolute pointer-events-none hidden sm:flex items-center gap-1.5 z-20"
      >
        <svg className="w-4 h-4 text-primary fill-primary drop-shadow-md" viewBox="0 0 24 24">
          <path d="M5.5 3.21V20.8c0 .45.54.67.85.35l4.86-4.86a.5.5 0 0 1 .35-.15h6.87c.45 0 .67-.54.35-.85L6.35 2.85a.5.5 0 0 0-.85.36z" />
        </svg>
        <span className="px-2.5 py-1 rounded-full bg-primary text-primary-foreground text-[11px] font-mono font-bold shadow-lg">
          Ahmed (Lead UX)
        </span>
      </motion.div>

      <motion.div
        animate={{ left: `${cursorPos2.x}%`, top: `${cursorPos2.y}%` }}
        transition={{ type: "spring", damping: 25, stiffness: 80 }}
        className="absolute pointer-events-none hidden sm:flex items-center gap-1.5 z-20"
      >
        <svg className="w-4 h-4 text-sky-400 fill-sky-400 drop-shadow-md" viewBox="0 0 24 24">
          <path d="M5.5 3.21V20.8c0 .45.54.67.85.35l4.86-4.86a.5.5 0 0 1 .35-.15h6.87c.45 0 .67-.54.35-.85L6.35 2.85a.5.5 0 0 0-.85.36z" />
        </svg>
        <span className="px-2.5 py-1 rounded-full bg-sky-400 text-slate-950 text-[11px] font-mono font-bold shadow-lg">
          Lost User
        </span>
      </motion.div>

      <div className="max-w-3xl mx-auto text-center relative z-10">
        {/* Top Status Pill */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-xs font-mono text-primary mb-6 shadow-sm"
        >
          <Compass size={14} className="animate-spin text-primary" style={{ animationDuration: "8s" }} />
          <span>ERROR 404 · ROUTE NOT FOUND</span>
        </motion.div>

        {/* Big Stylized 404 Headline with Parallax */}
        <motion.div
          style={{
            transform: `perspective(1000px) rotateX(${mousePos.y * -0.6}deg) rotateY(${mousePos.x * 0.6}deg)`,
          }}
          className="relative select-none my-2 transition-transform duration-100 ease-out"
        >
          <h1 className="text-8xl sm:text-9xl md:text-[12rem] font-display font-black tracking-tight leading-none flex items-center justify-center gap-0 select-none">
            <span className="text-transparent bg-clip-text bg-gradient-to-b from-foreground via-foreground/80 to-foreground/30">
              4
            </span>
            <motion.span
              whileHover={{ scale: 1.08, rotate: 6 }}
              transition={{ type: "spring", stiffness: 350, damping: 15 }}
              className="text-primary inline-block cursor-pointer drop-shadow-[0_0_30px_rgba(170,255,56,0.35)]"
            >
              0
            </motion.span>
            <span className="text-transparent bg-clip-text bg-gradient-to-b from-foreground via-foreground/80 to-foreground/30">
              4
            </span>
          </h1>
          <div className="absolute inset-0 bg-primary/10 blur-3xl -z-10 rounded-full" />
        </motion.div>

        {/* UX Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="space-y-4 max-w-xl mx-auto"
        >
          <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-foreground leading-snug">
            Even the best user journeys hit unexpected dead ends.
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
            The page, prototype, or wireframe you are looking for has been moved, archived, or never made it past the initial sketch phase.
          </p>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-4"
        >
          <Link
            to="/"
            className="flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-primary text-primary-foreground font-bold text-sm hover:shadow-[0_0_35px_rgba(170,255,56,0.35)] active:scale-95 transition-all duration-200"
          >
            <Home size={16} />
            <span>Back to Home</span>
          </Link>

          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-6 py-3.5 rounded-full border border-border bg-card hover:border-primary/40 hover:bg-primary/5 text-foreground font-semibold text-sm transition-all duration-200"
          >
            <ArrowLeft size={16} />
            <span>Previous Page</span>
          </button>

          <button
            onClick={handleRandomizeCursors}
            className="w-11 h-11 rounded-full border border-border bg-card flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/40 hover:bg-primary/5 transition-all duration-200"
            title="Randomize Figma collaborator cursors"
            aria-label="Randomize Figma collaborator cursors"
          >
            <RefreshCw size={16} />
          </button>
        </motion.div>

        {/* Quick Discovery Cards */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-16 pt-10 border-t border-border/60 grid grid-cols-1 sm:grid-cols-2 gap-4 text-left max-w-xl mx-auto"
        >
          <Link
            to="/#work"
            className="p-4 rounded-2xl border border-border bg-card/60 hover:border-primary/40 hover:bg-card transition-all duration-200 group flex items-start gap-3.5"
          >
            <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0 group-hover:scale-110 transition-transform">
              <Briefcase size={18} />
            </div>
            <div>
              <div className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors flex items-center gap-1">
                <span>Featured Projects</span>
                <Sparkles size={12} className="text-primary" />
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">Explore case studies & interactive prototypes</p>
            </div>
          </Link>

          <Link
            to="/#contact"
            className="p-4 rounded-2xl border border-border bg-card/60 hover:border-primary/40 hover:bg-card transition-all duration-200 group flex items-start gap-3.5"
          >
            <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0 group-hover:scale-110 transition-transform">
              <Mail size={18} />
            </div>
            <div>
              <div className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                Get In Touch
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">Reach out directly for design collaborations</p>
            </div>
          </Link>
        </motion.div>
      </div>
    </main>
  );
}
