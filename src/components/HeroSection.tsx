import { useState, useEffect, useRef } from "react";
import { Search } from "lucide-react";
import heroVideo1 from "@/assets/hero-video-1.mp4";
import heroVideo2 from "@/assets/hero-video-2.mp4";

const videos = [heroVideo1, heroVideo2];

const suggestedQueries = [
  { emoji: "🏕️", text: "Best wildlife destinations" },
  { emoji: "🌊", text: "3-day Mombasa itinerary" },
  { emoji: "🏨", text: "Budget hotels near Maasai Mara" },
  { emoji: "⛰️", text: "Mount Kenya hiking tips" },
];

const HeroSection = () => {
  const [activeVideo, setActiveVideo] = useState(0);
  const [query, setQuery] = useState("");
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveVideo((prev) => (prev + 1) % videos.length);
    }, 12000);
    return () => clearInterval(interval);
  }, []);

  const scrollToChat = (q?: string) => {
    const chatSection = document.getElementById("chat");
    if (chatSection) chatSection.scrollIntoView({ behavior: "smooth" });
  };

  const handleSearch = (q?: string) => {
    const searchQuery = q || query;
    if (searchQuery.trim()) {
      scrollToChat(searchQuery);
    }
  };

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
          Your AI Travel Guide to{" "}
          <span className="text-primary">Kenya</span>
        </h1>
        <p className="text-primary-foreground/80 text-lg md:text-xl max-w-2xl mb-8 animate-fade-in font-body" style={{ animationDelay: "0.2s" }}>
          Ask anything about destinations, accommodations, itineraries, and hidden gems — powered by real tourism data.
        </p>

        <div className="w-full max-w-2xl animate-fade-in" style={{ animationDelay: "0.4s" }}>
          <div className="flex items-center bg-background/95 rounded-full shadow-lg border-2 border-primary overflow-hidden amber-glow">
            <Search className="w-5 h-5 text-muted-foreground ml-5 shrink-0" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="Ask a question... e.g., Best time to visit Maasai Mara"
              className="flex-1 px-4 py-4 bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none font-body"
            />
            <button
              onClick={() => handleSearch()}
              className="bg-primary hover:bg-primary-hover text-primary-foreground px-6 py-4 font-semibold transition-colors font-body"
            >
              Ask Now
            </button>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-3 mt-6 animate-fade-in" style={{ animationDelay: "0.6s" }}>
          {suggestedQueries.map((sq) => (
            <button
              key={sq.text}
              onClick={() => scrollToChat(sq.text)}
              className="bg-background/20 hover:bg-background/30 text-primary-foreground border border-primary-foreground/20 rounded-full px-4 py-2 text-sm font-body transition-colors backdrop-blur-sm"
            >
              {sq.emoji} {sq.text}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
