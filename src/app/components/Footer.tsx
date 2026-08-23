import React from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { Mail, Phone, MapPin, ExternalLink, Sparkles, Heart } from "lucide-react";

export default function Footer() {
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === "/";

  const scrollToSection = (sectionId: string) => {
    if (!isHome) {
      navigate("/");
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }, 150);
    } else {
      if (sectionId === "hero") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        const el = document.getElementById(sectionId);
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <footer className="border-t border-border bg-card/60 backdrop-blur-sm pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-12 mb-14">
          {/* Brand Col */}
          <div className="lg:col-span-5 space-y-4">
            <Link
              to="/"
              onClick={(e) => {
                if (isHome) {
                  e.preventDefault();
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }
              }}
              className="text-4xl text-foreground leading-none inline-block hover:opacity-80 transition-opacity"
              style={{ fontFamily: "'Cookie', cursive" }}
            >
              Azaiza<span style={{ color: "#aaff38" }}>.</span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-sm leading-relaxed">
              Strategic Senior UX/UI Designer with 8+ years of experience turning complex challenges into simple, meaningful, and purposeful digital products.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-xs font-mono text-primary">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              Available for Global Projects & Consulting
            </div>
          </div>

          {/* Quick Navigation Col */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-mono font-semibold text-muted-foreground uppercase tracking-widest">
              Navigation
            </h4>
            <ul className="space-y-2.5 text-sm font-medium">
              {[
                { label: "Home", id: "hero" },
                { label: "About Me", id: "about" },
                { label: "Services", id: "services" },
                { label: "Work Experience", id: "experience" },
                { label: "Featured Work", id: "work" },
                { label: "Contact", id: "contact" },
              ].map(({ label, id }) => (
                <li key={id}>
                  <button
                    onClick={() => scrollToSection(id)}
                    className="text-muted-foreground hover:text-primary transition-colors cursor-pointer"
                  >
                    {label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect & Social Col */}
          <div className="lg:col-span-4 space-y-3">
            <h4 className="text-xs font-mono font-semibold text-muted-foreground uppercase tracking-widest">
              Direct Contact
            </h4>
            <div className="space-y-3 text-sm">
              <a
                href="mailto:ahmedazy.uxui@gmail.com"
                className="flex items-center gap-2.5 text-muted-foreground hover:text-primary transition-colors group"
              >
                <Mail size={16} className="text-primary group-hover:scale-110 transition-transform" />
                <span>ahmedazy.uxui@gmail.com</span>
              </a>
              <a
                href="tel:+905511703386"
                className="flex items-center gap-2.5 text-muted-foreground hover:text-primary transition-colors group"
              >
                <Phone size={16} className="text-primary group-hover:scale-110 transition-transform" />
                <span>+90 551 170 3386</span>
              </a>
              <div className="flex items-center gap-2.5 text-muted-foreground">
                <MapPin size={16} className="text-primary shrink-0" />
                <span>Istanbul, Turkey · Global Remote</span>
              </div>
              <div className="pt-2">
                <a
                  href="https://www.upwork.com/freelancers/~0164cb29425e741b93"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-card border border-border hover:border-primary/40 hover:bg-primary/5 text-foreground text-xs font-semibold transition-all duration-200 group"
                >
                  <ExternalLink size={13} className="text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  <span>Upwork Profile (Top-Rated Plus)</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright line */}
        <div className="pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} Ahmed M. Y. Al-Azaiza · All rights reserved.</p>
          <p className="flex items-center gap-1.5 font-medium">
            <span>Designed & crafted with precision</span>
            <Sparkles size={13} className="text-primary" />
          </p>
        </div>
      </div>
    </footer>
  );
}
