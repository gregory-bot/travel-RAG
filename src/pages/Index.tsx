import HeroSection from "@/components/HeroSection";
import ChatInterface from "@/components/ChatInterface";
import DestinationsGrid from "@/components/DestinationsGrid";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import VoiceCallFAB from "@/components/VoiceCallFAB";

const Index = () => {
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
