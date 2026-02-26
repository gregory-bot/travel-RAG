import { useState, useEffect, useRef } from "react";

const videos = [
  "https://res.cloudinary.com/dgvx2tbcy/video/upload/q_auto,f_auto/hero-video-1_vq41as.mp4",
  "https://res.cloudinary.com/dgvx2tbcy/video/upload/v1772088097/hero-video-2_csh6d2.mp4"
];

const HeroSection = () => {
  const [activeVideo, setActiveVideo] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const transitionTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Handle smooth video transitions without stopping
  useEffect(() => {
    if (videos.length <= 1) return;

    // Clear existing timeouts
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (transitionTimeoutRef.current) clearTimeout(transitionTimeoutRef.current);

    // Auto rotate every 12 seconds
    timeoutRef.current = setTimeout(() => {
      // Get next video index
      const nextVideoIndex = (activeVideo + 1) % videos.length;
      const nextVideo = videoRefs.current[nextVideoIndex];

      // Start playing the next video BEFORE fading
      if (nextVideo) {
        nextVideo.currentTime = 0;
        nextVideo.play().catch(() => {
          console.log("Next video autoplay blocked");
        });
      }

      // Now start the fade transition
      setIsTransitioning(true);

      // After fade completes, switch active video and pause previous
      transitionTimeoutRef.current = setTimeout(() => {
        setActiveVideo(nextVideoIndex);
        setIsTransitioning(false);

        // Pause previous video after transition is complete
        const prevVideo = videoRefs.current[activeVideo];
        if (prevVideo) {
          prevVideo.pause();
          prevVideo.currentTime = 0;
        }
      }, 500); // 500ms fade duration
    }, 12000);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (transitionTimeoutRef.current) clearTimeout(transitionTimeoutRef.current);
    };
  }, [activeVideo]);

  // Initial video setup - only play the active video on mount
  useEffect(() => {
    videoRefs.current.forEach((video, index) => {
      if (!video) return;

      if (index === activeVideo) {
        video.play().catch(() => {
          console.log("Video autoplay blocked");
        });
      } else {
        video.pause();
        video.currentTime = 0;
      }
    });
  }, []);

  return (
    <section className="relative h-screen w-full overflow-hidden bg-black">
      {/* Background Videos */}
      {videos.map((src, i) => (
        <video
          key={i}
          ref={(el) => (videoRefs.current[i] = el)}
          src={src}
          muted
          playsInline
          preload="auto"
          poster="https://res.cloudinary.com/dgvx2tbcy/video/upload/so_1/hero-video-1_vq41as.jpg"
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
            activeVideo === i 
              ? "opacity-100" 
              : isTransitioning && ((activeVideo + 1) % videos.length) === i
              ? "opacity-100"
              : "opacity-0 pointer-events-none"
          }`}
          style={{ 
            willChange: "opacity",
            backfaceVisibility: "hidden",
            perspective: "1000px"
          }}
        />
      ))}

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/60" />

      {/* Content Container */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full px-4 text-center pointer-events-none">
        {/* Main Heading */}
        <h1 
          className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-yellow-400 mb-3 md:mb-4 animate-fade-in amber-text-glow leading-tight"
          style={{ textShadow: "2px 2px 8px rgba(0, 0, 0, 0.8)" }}
        >
          travel Guide to Kenya
        </h1>

        {/* Subtitle */}
        <p
          className="text-sm sm:text-base md:text-lg lg:text-xl text-white/90 max-w-xs sm:max-w-sm md:max-w-2xl animate-fade-in font-body drop-shadow-lg"
          style={{ 
            animationDelay: "0.2s",
            textShadow: "1px 1px 4px rgba(0, 0, 0, 0.8)"
          }}
        >
          Discover destinations, plan itineraries, and explore hidden gems
        </p>
      </div>

      {/* Brush Stroke Divider */}
      <div
        className="absolute bottom-0 left-0 w-full z-20 pointer-events-none"
        style={{ marginBottom: "-1px" }}
      >
        <svg
          viewBox="0 0 1440 200"
          preserveAspectRatio="none"
          className="w-full h-[40px] sm:h-[50px] md:h-[70px] lg:h-[90px] block"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <filter id="rough-edge" x="-5%" y="-5%" width="110%" height="110%">
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.04"
                numOctaves="4"
                seed="2"
                result="noise"
              />
              <feDisplacementMap
                in="SourceGraphic"
                in2="noise"
                scale="25"
                xChannelSelector="R"
                yChannelSelector="G"
              />
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