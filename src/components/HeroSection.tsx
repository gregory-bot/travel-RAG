import { useState, useEffect, useRef } from "react";
import heroVideo1 from "@/assets/hero-video-1.mp4";
import heroVideo2 from "@/assets/hero-video-2.mp4";

const videos = [heroVideo1, heroVideo2];

const HeroSection = () => {
  const [activeVideo, setActiveVideo] = useState(0);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveVideo((prev) => (prev + 1) % videos.length);
    }, 12000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative h-screen w-full overflow-hidden">
      {videos.map((src, i) => (
        <video
          key={i}
          ref={(el) => { videoRefs.current[i] = el; }}
          src={src}
          autoPlay
          muted
          loop
          playsInline
          className={`absolute inset-0 w-full h-full object-cover video-transition ${
            activeVideo === i ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}

      <div className="absolute inset-0 hero-gradient-overlay" />

      <div className="relative z-10 flex flex-col items-center justify-center h-full px-4 text-center">
        <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold text-primary-foreground mb-4 animate-fade-in amber-text-glow">
          Your Travel Guide to{" "}
          <span className="text-primary">Kenya</span>
        </h1>
        <p className="text-primary-foreground/80 text-lg md:text-xl max-w-2xl animate-fade-in font-body" style={{ animationDelay: "0.2s" }}>
          Discover destinations, plan itineraries, and explore hidden gems — powered by real tourism data.
        </p>
      </div>

      {/* Brush stroke paint divider */}
      <div className="absolute bottom-0 left-0 w-full z-20 pointer-events-none" style={{ marginBottom: '-1px' }}>
        <svg
          viewBox="0 0 1440 50"
          preserveAspectRatio="none"
          className="w-full h-[30px] md:h-[40px] lg:h-[50px] block"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0,50 L0,28 C12,26 24,30 48,25 C72,20 96,27 132,22 C168,17 192,24 228,19 C264,14 288,22 324,18 C360,14 384,20 420,16 C456,12 480,19 516,15 C552,11 576,18 612,14 C648,10 672,17 708,13 C744,9 768,16 804,12 C840,8 864,15 900,11 C936,7 960,14 996,10 C1032,6 1056,13 1092,9 C1128,5 1152,12 1188,8 C1224,4 1248,11 1284,7 C1320,3 1356,10 1392,6 C1416,4 1440,8 1440,8 L1440,50 Z"
            className="fill-background"
          />
        </svg>
      </div>
    </section>
  );
};

export default HeroSection;
