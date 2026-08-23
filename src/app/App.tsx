import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router";
import { AnimatePresence } from "motion/react";
import CustomCursor from "./components/CustomCursor";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ScrollToTopButton from "./components/ScrollToTopButton";
import HomePage from "./pages/HomePage";
import ProjectDetailPage from "./pages/ProjectDetailPage";
import DashboardPage from "./pages/DashboardPage";
import NotFoundPage from "./pages/NotFoundPage";

export const API_BASE: string =
  (import.meta as any).env?.VITE_API_URL ?? "https://api.yourdomain.com";

function AppContent({
  isDark,
  onToggleTheme,
}: {
  isDark: boolean;
  onToggleTheme: () => void;
}) {
  const location = useLocation();
  const isDashboard =
    location.pathname.startsWith("/dashboard") ||
    location.pathname.startsWith("/adashboard");

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden selection:bg-primary/30 selection:text-primary">
      <CustomCursor />
      {!isDashboard && <Navbar isDark={isDark} onToggleTheme={onToggleTheme} />}

      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<HomePage />} />
          <Route path="/project/:slug" element={<ProjectDetailPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/adashboard" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </AnimatePresence>

      {!isDashboard && <Footer />}
      {!isDashboard && <ScrollToTopButton />}
    </div>
  );
}

export default function App() {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("theme");
    const dark = stored ? stored === "dark" : true;
    setIsDark(dark);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
    localStorage.setItem("theme", isDark ? "dark" : "light");
  }, [isDark]);

  const toggleTheme = () => setIsDark(d => !d);

  return (
    <BrowserRouter>
      <AppContent isDark={isDark} onToggleTheme={toggleTheme} />
    </BrowserRouter>
  );
}
