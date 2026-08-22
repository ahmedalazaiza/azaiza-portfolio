import React from "react";
import { Link } from "react-router";
import { ChevronUp } from "lucide-react";

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="py-10 border-t border-border bg-muted/20">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="text-center sm:text-left">
          <Link
            to="/"
            onClick={scrollToTop}
            className="text-4xl text-foreground mb-1 leading-none inline-block hover:opacity-80 transition-opacity"
            style={{ fontFamily: "'Cookie', cursive" }}
          >
            Azaiza<span style={{ color: "#aaff38" }}>.</span>
          </Link>
          <p className="text-xs text-muted-foreground mt-1">Senior UX/UI Designer · Istanbul, Turkey</p>
        </div>

        <p className="text-xs text-muted-foreground text-center">
          © {new Date().getFullYear()} Ahmed M. Y. Al-Azaiza · All rights reserved
        </p>

        <button
          onClick={scrollToTop}
          aria-label="Scroll to top"
          className="w-10 h-10 rounded-full border border-border bg-card flex items-center justify-center hover:border-primary/50 hover:bg-primary/10 transition-all duration-200 group"
        >
          <ChevronUp size={18} className="text-muted-foreground group-hover:text-primary transition-colors" />
        </button>
      </div>
    </footer>
  );
}
