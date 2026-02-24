import { useState } from "react";
import { Compass, Menu, X } from "lucide-react";

const navLinks = [
  { to: "#", label: "Home" },
  { to: "#chat", label: "Chat" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);

  const handleClick = (href: string) => {
    setOpen(false);
    if (href === "#") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      const el = document.querySelector(href);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-card">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="flex items-center gap-2 font-display text-xl font-bold text-foreground">
          <Compass className="w-6 h-6 text-primary" />
          Travel Kenya <span className="text-primary">RAG</span>
        </button>

        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <button
              key={link.to}
              onClick={() => handleClick(link.to)}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              {link.label}
            </button>
          ))}
        </div>

        <button onClick={() => setOpen(!open)} className="md:hidden text-foreground">
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden glass-card border-t border-border">
          <div className="container mx-auto px-4 py-4 flex flex-col gap-4">
            {navLinks.map((link) => (
              <button
                key={link.to}
                onClick={() => handleClick(link.to)}
                className="text-sm font-medium text-muted-foreground text-left"
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
