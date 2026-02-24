import { Search, BookOpen, MessageSquare } from "lucide-react";

const steps = [
  { icon: Search, label: "You Ask", desc: "Type your travel question" },
  { icon: BookOpen, label: "We Search", desc: "System retrieves relevant docs" },
  { icon: MessageSquare, label: "AI Answers", desc: "Generates response with sources" },
];

const HowItWorks = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <h2 className="font-display text-3xl md:text-4xl font-bold text-center text-foreground mb-12">
          How It <span className="text-primary">Works</span>
        </h2>

        <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-4">
          {steps.map((step, i) => (
            <div key={step.label} className="flex items-center gap-4">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center mb-3 shadow-lg">
                  <step.icon className="w-8 h-8 text-primary-foreground" />
                </div>
                <h3 className="font-display text-lg font-semibold text-foreground">{step.label}</h3>
                <p className="text-muted-foreground text-sm font-body mt-1">{step.desc}</p>
              </div>
              {i < steps.length - 1 && (
                <div className="hidden md:block w-16 h-0.5 bg-primary/30 mt-[-2rem]" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
