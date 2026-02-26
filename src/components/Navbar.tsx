import { useState } from "react";
import { Compass, Menu, X } from "lucide-react";

const navLinks = [
  { to: "home", label: "Home" },
  { to: "chat", label: "Chat" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);

  const handleClick = (section: string) => {
    setOpen(false);
    
    if (section === "home") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else if (section === "chat") {
      // Scroll to chat section
      const chatElement = document.getElementById("chat-section");
      if (chatElement) {
        chatElement.scrollIntoView({ behavior: "smooth", block: "start" });
      } else {
        console.warn("Chat section not found. Make sure your chat section has id='chat-section'");
      }
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-card">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        {/* Logo */}
        <button 
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} 
          className="flex items-center gap-2 font-display text-xl font-bold text-yellow-600 hover:opacity-80 transition-opacity"
        >
        travel Kenya RAG
        </button>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <button
              key={link.to}
              onClick={() => handleClick(link.to)}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200"
            >
              {link.label}
            </button>
          ))}
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          onClick={() => setOpen(!open)} 
          className="md:hidden text-foreground hover:text-primary transition-colors"
          aria-label="Toggle menu"
        >
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden glass-card border-t border-border animate-in fade-in slide-in-from-top-2">
          <div className="container mx-auto px-4 py-4 flex flex-col gap-4">
            {navLinks.map((link) => (
              <button
                key={link.to}
                onClick={() => handleClick(link.to)}
                className="text-sm font-medium text-muted-foreground hover:text-foreground text-left transition-colors duration-200 py-2"
              >
                {link.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;