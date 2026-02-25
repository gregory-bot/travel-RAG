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

      {/* Brush stroke divider */}
      <div className="absolute bottom-0 left-0 w-full z-20 pointer-events-none" style={{ marginBottom: '-2px' }}>
        <svg
          viewBox="0 0 1440 120"
          preserveAspectRatio="none"
          className="w-full h-[60px] md:h-[90px] lg:h-[120px] block"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0,120 L0,85 C20,82 40,90 80,78 C120,66 140,88 200,72 C260,56 280,80 340,68 C400,56 420,75 480,65 C540,55 560,78 620,62 C680,46 720,72 780,58 C840,44 860,70 920,60 C980,50 1020,74 1080,56 C1140,38 1160,68 1220,54 C1280,40 1320,65 1380,52 C1410,46 1430,55 1440,50 L1440,120 Z"
            className="fill-background"
          />
          <path
            d="M0,120 L0,95 C30,92 60,98 120,88 C180,78 210,96 280,82 C350,68 380,90 450,78 C520,66 550,85 620,74 C690,63 730,82 800,70 C870,58 900,78 970,66 C1040,54 1080,76 1150,64 C1220,52 1250,72 1320,62 C1370,55 1410,65 1440,60 L1440,120 Z"
            className="fill-background"
            opacity="0.7"
          />
        </svg>
      </div>
    </section>
  );
};

export default HeroSection;
