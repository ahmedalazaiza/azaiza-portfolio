import React, { useRef } from "react";
import { motion, useInView } from "motion/react";
import { Clock, Briefcase, Award, Users } from "lucide-react";
import { useCountUp } from "../hooks/useScrolled";

interface StatDef {
  value: number;
  suffix: string;
  prefix?: string;
  label: string;
  icon: React.ElementType;
  delay: number;
}

function StatItem({ value, suffix, prefix, label, icon: Icon, inView, delay }: StatDef & { inView: boolean }) {
  const count = useCountUp(value, inView, 1400 + delay * 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: delay * 0.08 }}
      className="flex flex-col items-center text-center p-6 rounded-2xl hover:bg-primary/5 transition-colors duration-200 group"
    >
      <Icon size={20} className="text-primary mb-3 group-hover:scale-110 transition-transform" />
      <div className="text-4xl lg:text-5xl font-display font-black text-foreground mb-1">
        {prefix}
        {count}
        {suffix}
      </div>
      <div className="text-sm text-muted-foreground font-medium">{label}</div>
    </motion.div>
  );
}

export default function StatsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  const stats: StatDef[] = [
    { value: 8, suffix: "+", label: "Years Experience", icon: Clock, delay: 0 },
    { value: 70, suffix: "+", label: "Projects Delivered", icon: Briefcase, delay: 1 },
    { value: 100, suffix: "%", label: "Job Success Score", icon: Award, delay: 2 },
    { value: 80, prefix: "$", suffix: "K+", label: "In Design Solutions", icon: Users, delay: 3 },
  ];

  return (
    <section ref={ref} className="py-16 border-y border-border">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-4">
          {stats.map(s => (
            <StatItem key={s.label} {...s} inView={inView} />
          ))}
        </div>
      </div>
    </section>
  );
}
