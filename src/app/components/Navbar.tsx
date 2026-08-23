import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { Sun, Moon, ChevronLeft, Menu, X } from "lucide-react";
import { useScrolled } from "../hooks/useScrolled";

interface NavbarProps {
  isDark: boolean;
  onToggleTheme: () => void;
}

export default function Navbar({ isDark, onToggleTheme }: NavbarProps) {
  const isScrolled = useScrolled(40);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("hero");
  const location = useLocation();
  const navigate = useNavigate();

  const isHome = location.pathname === "/";
  const isProject = location.pathname.startsWith("/project");
  const isDashboard = location.pathname.startsWith("/dashboard") || location.pathname.startsWith("/adashboard");

  const navLinks = [
    { label: "Home", id: "hero" },
    { label: "About", id: "about" },
    { label: "Services", id: "services" },
    { label: "Experience", id: "experience" },
    { label: "Work", id: "work" },
    { label: "Contact", id: "contact" },
  ];

  // ScrollSpy to track active section
  useEffect(() => {
    if (!isHome) return;

    const sectionIds = ["hero", "about", "services", "experience", "work", "contact"];

    const handleScroll = () => {
      const scrollPosition = window.scrollY + 160;

      // Near top of page
      if (window.scrollY < 120) {
        setActiveSection("hero");
        return;
      }

      // Near bottom of page
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 100) {
        setActiveSection("contact");
        return;
      }

      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const el = document.getElementById(sectionIds[i]);
        if (el) {
          const top = el.offsetTop;
          if (scrollPosition >= top) {
            setActiveSection(sectionIds[i]);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [isHome]);

  const handleNavClick = (sectionId: string) => {
    setMenuOpen(false);
    if (!isHome) {
      navigate("/");
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) {
          el.scrollIntoView({ behavior: "smooth" });
        }
      }, 150);
    } else {
      if (sectionId === "hero") {
        window.scrollTo({ top: 0, behavior: "smooth" });
        setActiveSection("hero");
      } else {
        const el = document.getElementById(sectionId);
        if (el) {
          el.scrollIntoView({ behavior: "smooth" });
          setActiveSection(sectionId);
        }
      }
    }
  };

  const handleLogoClick = (e: React.MouseEvent) => {
    if (isHome) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
      setActiveSection("hero");
    }
  };

  if (isDashboard) {
    return null; // Dashboard has its own header
  }

  const solidBg = isScrolled || menuOpen;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        solidBg
          ? "bg-background/90 backdrop-blur-md border-b border-border shadow-sm"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-10 flex items-center justify-between h-16 lg:h-20">
        {/* Brand Logo */}
        <Link
          to="/"
          onClick={handleLogoClick}
          className="text-4xl text-foreground hover:opacity-80 transition-opacity leading-none"
          style={{ fontFamily: "'Cookie', cursive" }}
        >
          Azaiza<span style={{ color: "#aaff38" }}>.</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-7">
          {isProject ? (
            <Link
              to="/"
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm font-medium"
            >
              <ChevronLeft size={16} /> Back to home
            </Link>
          ) : (
            navLinks.map(({ label, id }) => {
              const isActive = isHome && activeSection === id;
              return (
                <button
                  key={id}
                  onClick={() => handleNavClick(id)}
                  className={`text-sm transition-colors duration-200 relative py-1 font-medium ${
                    isActive
                      ? "text-primary font-semibold"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {label}
                  {isActive && (
                    <motion.span
                      layoutId="activeNavIndicator"
                      className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary rounded-full shadow-[0_0_8px_rgba(170,255,56,0.5)]"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </button>
              );
            })
          )}
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleTheme}
            aria-label="Toggle theme"
            className="w-9 h-9 rounded-full flex items-center justify-center border border-border bg-card hover:border-primary/50 hover:bg-primary/10 transition-all duration-200"
          >
            {isDark ? <Sun size={16} className="text-primary" /> : <Moon size={16} className="text-foreground" />}
          </button>

          <button
            className="hidden md:flex items-center gap-2 px-5 py-2 rounded-full bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity"
            onClick={() => handleNavClick("contact")}
          >
            Hire Me
          </button>

          <button
            className="md:hidden w-9 h-9 flex items-center justify-center text-foreground"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle mobile menu"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="md:hidden bg-background/95 backdrop-blur-lg border-b border-border px-6 pb-6 pt-2 shadow-xl space-y-1"
          >
            {isProject ? (
              <Link
                to="/"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2 py-3 text-base text-foreground border-b border-border/50 font-medium"
              >
                <ChevronLeft size={18} /> Back to home
              </Link>
            ) : (
              navLinks.map(({ label, id }) => {
                const isActive = isHome && activeSection === id;
                return (
                  <button
                    key={id}
                    onClick={() => handleNavClick(id)}
                    className={`flex items-center justify-between w-full text-left py-2.5 px-3 rounded-xl text-base font-medium transition-colors ${
                      isActive
                        ? "text-primary bg-primary/10 font-semibold"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
                    }`}
                  >
                    <span>{label}</span>
                    {isActive && <span className="w-2 h-2 rounded-full bg-primary" />}
                  </button>
                );
              })
            )}
            <button
              className="mt-3 w-full py-3 rounded-full bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity"
              onClick={() => handleNavClick("contact")}
            >
              Hire Me
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
