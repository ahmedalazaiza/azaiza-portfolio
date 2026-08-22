import React, { useState, useRef, useCallback } from "react";
import { Link } from "react-router";
import { ArrowUpRight } from "lucide-react";
import { Project } from "../types";

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const [hovered, setHovered] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLAnchorElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
    if (window.innerWidth < 768) return;
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 8;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -8;
    setTilt({ x, y });
  }, []);

  const resetTilt = () => {
    setTilt({ x: 0, y: 0 });
    setHovered(false);
  };

  const projectUrl = `/project/${project.slug || project.id}`;

  return (
    <Link
      ref={cardRef}
      to={projectUrl}
      state={{ project }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={resetTilt}
      onMouseMove={handleMouseMove}
      className="block w-full max-w-full min-w-0 text-left group relative rounded-3xl overflow-hidden border border-border bg-card transition-all duration-300 hover:border-primary/40 hover:shadow-[0_8px_40px_rgba(0,0,0,0.08)] dark:hover:shadow-[0_20px_60px_rgba(0,0,0,0.35)] will-change-transform"
      style={{
        transform:
          window.innerWidth >= 768 && hovered
            ? `perspective(1000px) rotateX(${tilt.y}deg) rotateY(${tilt.x}deg)`
            : "none",
        transition: hovered
          ? "transform 0.1s ease-out"
          : "transform 0.4s ease-out, box-shadow 0.3s ease, border-color 0.3s ease",
      }}
    >
      {/* Image */}
      <div className="relative h-48 sm:h-52 overflow-hidden bg-muted/30">
        <img
          src={project.coverImage}
          alt={project.title}
          loading="lazy"
          className="w-full h-full max-w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent dark:from-black/70 dark:via-black/20 pointer-events-none" />
        <div
          className={`absolute inset-0 transition-opacity duration-300 pointer-events-none ${hovered ? "opacity-100" : "opacity-0"}`}
          style={{
            background: `linear-gradient(135deg, ${project.accentColor}22 0%, transparent 60%)`,
          }}
        />
      </div>

      {/* Content */}
      <div className="p-5 sm:p-6 min-w-0">
        <div className="flex items-center justify-between mb-3 gap-2">
          <span className="text-xs font-mono text-primary bg-primary/10 px-2.5 py-1 rounded-full shrink-0 font-medium">
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
        className={`absolute bottom-0 left-0 right-0 h-0.5 transition-all duration-300 ${
          hovered ? "opacity-100" : "opacity-0"
        }`}
        style={{
          background: `linear-gradient(90deg, transparent, ${project.accentColor}, transparent)`,
        }}
      />
    </Link>
  );
}
