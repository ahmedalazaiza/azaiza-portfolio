import React from "react";
import { motion } from "motion/react";
import HeroSection from "../sections/HeroSection";
import StatsSection from "../sections/StatsSection";
import AboutSection from "../sections/AboutSection";
import ServicesSection from "../sections/ServicesSection";
import TimelineSection from "../sections/TimelineSection";
import PortfolioSection from "../sections/PortfolioSection";
import ContactSection from "../sections/ContactSection";

export default function HomePage() {
  const scrollToWork = () => {
    const el = document.getElementById("work");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen"
    >
      <HeroSection onWorkClick={scrollToWork} />
      <StatsSection />
      <AboutSection />
      <ServicesSection />
      <TimelineSection />
      <PortfolioSection />
      <ContactSection />
    </motion.main>
  );
}
