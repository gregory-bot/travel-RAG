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
    </section>
  );
};

export default HeroSection;
