import { Compass } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-foreground py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2 text-background font-display text-lg font-bold">
            <Compass className="w-5 h-5 text-primary" />
            Travel Kenya RAG
          </div>
          <p className="text-background/60 text-sm font-body">
            Powered by Retrieval-Augmented Generation • Data from official Kenyan tourism sources
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
