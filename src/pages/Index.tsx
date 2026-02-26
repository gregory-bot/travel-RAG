import HeroSection from "@/components/HeroSection";
import ChatInterface from "@/components/ChatInterface";
import DestinationsGrid from "@/components/DestinationsGrid";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import VoiceCallFAB from "@/components/VoiceCallFAB";


import { useEffect } from "react";

const Index = () => {
  // On mount, always scroll to top (prevents anchor/hash scroll)
  // No scroll-to-top effect; user controls scrolling
  return (
    <div className="min-h-screen">
      <Navbar />
      <HeroSection />
      <ChatInterface />
      <DestinationsGrid />
      <Footer />
      <VoiceCallFAB />
    </div>
  );
};

export default Index;
