import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import HowItWorks from "@/components/HowItWorks";
import DestinationsGrid from "@/components/DestinationsGrid";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import VoiceCallFAB from "@/components/VoiceCallFAB";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <HowItWorks />
      <DestinationsGrid />
      <Footer />
      <VoiceCallFAB />
    </div>
  );
};

export default Index;
