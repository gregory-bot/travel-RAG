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
          viewBox="0 0 1440 200"
          preserveAspectRatio="none"
          className="w-full h-[50px] md:h-[70px] lg:h-[90px] block"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <filter id="rough-edge" x="-5%" y="-5%" width="110%" height="110%">
              <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="4" seed="2" result="noise" />
              <feDisplacementMap in="SourceGraphic" in2="noise" scale="25" xChannelSelector="R" yChannelSelector="G" />
            </filter>
          </defs>
          <g filter="url(#rough-edge)">
            <path
              d="M-20,200 L-20,110 C60,95 120,115 200,90 C280,65 320,100 440,75 C560,50 580,95 700,70 C820,45 850,85 960,65 C1070,45 1100,80 1200,60 C1300,40 1350,70 1460,55 L1460,200 Z"
              className="fill-background"
            />
          </g>
          <g filter="url(#rough-edge)">
            <path
              d="M-20,200 L-20,140 C80,130 150,145 260,125 C370,105 400,135 520,115 C640,95 680,125 800,108 C920,90 960,118 1080,100 C1200,82 1240,108 1360,92 C1400,86 1440,95 1460,90 L1460,200 Z"
              className="fill-background"
              opacity="0.6"
            />
          </g>
        </svg>
      </div>
    </section>
  );
};

export default HeroSection;
