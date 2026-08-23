import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Download } from "lucide-react";

interface LightboxProps {
  isOpen: boolean;
  images: string[];
  initialIndex?: number;
  projectTitle?: string;
  onClose: () => void;
}

export default function Lightbox({
  isOpen,
  images,
  initialIndex = 0,
  projectTitle = "Project Preview",
  onClose,
}: LightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isZoomed, setIsZoomed] = useState(false);

  // Sync index when initialIndex changes or modal opens
  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(initialIndex);
      setIsZoomed(false);
      // Lock body scroll
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen, initialIndex]);

  const handleNext = useCallback(() => {
    if (images.length <= 1) return;
    setIsZoomed(false);
    setCurrentIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const handlePrev = useCallback(() => {
    if (images.length <= 1) return;
    setIsZoomed(false);
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowRight") {
        handleNext();
      } else if (e.key === "ArrowLeft") {
        handlePrev();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, handleNext, handlePrev, onClose]);

  if (!isOpen || images.length === 0) return null;

  const currentImage = images[currentIndex] || images[0];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex flex-col justify-between select-none"
        >
          {/* Top Bar */}
          <div className="flex items-center justify-between px-4 py-3 sm:px-6 sm:py-4 z-10 bg-gradient-to-b from-black/85 via-black/50 to-transparent">
            {/* Title & Counter */}
            <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1 mr-2">
              <span className="text-white text-xs sm:text-sm font-semibold truncate max-w-[130px] sm:max-w-xs md:max-w-md">
                {projectTitle}
              </span>
              <span className="shrink-0 whitespace-nowrap text-white/90 text-[11px] sm:text-xs font-mono font-medium px-2.5 py-0.5 rounded-full bg-white/15 border border-white/10">
                {currentIndex + 1} / {images.length}
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              <button
                onClick={() => setIsZoomed(!isZoomed)}
                aria-label={isZoomed ? "Zoom out" : "Zoom in"}
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-white/80 hover:text-white hover:bg-white/10 transition-colors"
                title={isZoomed ? "Zoom out" : "Zoom in"}
              >
                {isZoomed ? <ZoomOut size={17} /> : <ZoomIn size={17} />}
              </button>

              <a
                href={currentImage}
                target="_blank"
                rel="noopener noreferrer"
                download
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-white/80 hover:text-white hover:bg-white/10 transition-colors"
                title="Open original image"
              >
                <Download size={17} />
              </a>

              <button
                onClick={onClose}
                aria-label="Close Lightbox"
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center bg-white/15 hover:bg-white/25 text-white transition-colors ml-1"
                title="Close (Esc)"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Main Image Stage */}
          <div className="relative flex-1 flex items-center justify-center p-3 sm:p-8 overflow-hidden">
            {/* Previous Button */}
            {images.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrev();
                }}
                aria-label="Previous Image"
                className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/50 hover:bg-black/80 sm:bg-white/10 sm:hover:bg-white/20 text-white flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg backdrop-blur-sm"
              >
                <ChevronLeft size={20} className="sm:size-6" />
              </button>
            )}

            {/* Current Image Container */}
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.25 }}
              className="relative max-w-full max-h-full flex items-center justify-center cursor-pointer"
              onClick={() => setIsZoomed(!isZoomed)}
            >
              <img
                src={currentImage}
                alt={`${projectTitle} — ${currentIndex + 1}`}
                className={`rounded-xl object-contain transition-all duration-300 shadow-2xl ${
                  isZoomed
                    ? "max-h-[92vh] max-w-[96vw] scale-125 cursor-zoom-out"
                    : "max-h-[75vh] max-w-[90vw] cursor-zoom-in"
                }`}
              />
            </motion.div>

            {/* Next Button */}
            {images.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleNext();
                }}
                aria-label="Next Image"
                className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg"
              >
                <ChevronRight size={24} />
              </button>
            )}
          </div>

          {/* Bottom Thumbnails Carousel */}
          {images.length > 1 && (
            <div className="py-4 px-6 z-10 bg-gradient-to-t from-black/90 via-black/50 to-transparent">
              <div className="flex items-center justify-center gap-3 overflow-x-auto max-w-4xl mx-auto py-1 scrollbar-thin">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setIsZoomed(false);
                      setCurrentIndex(idx);
                    }}
                    className={`relative shrink-0 rounded-lg overflow-hidden transition-all duration-200 aspect-[3/2] w-16 sm:w-20 ${
                      idx === currentIndex
                        ? "ring-2 ring-primary scale-105 opacity-100 shadow-md"
                        : "opacity-40 hover:opacity-80"
                    }`}
                  >
                    <img
                      src={img}
                      alt={`Thumb ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
