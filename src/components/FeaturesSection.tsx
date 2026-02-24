import { Shield, Search, RefreshCw } from "lucide-react";

const features = [
  {
    icon: Shield,
    title: "Grounded Answers",
    description: "Responses based on official tourism data, not generic AI knowledge.",
  },
  {
    icon: Search,
    title: "Smart Retrieval",
    description: "Finds the most relevant travel information from our Kenya database.",
  },
  {
    icon: RefreshCw,
    title: "Always Updated",
    description: "Fresh data from Magical Kenya, Wikivoyage, and tourism boards.",
  },
];

const FeaturesSection = () => {
  return (
    <section className="py-20 bg-secondary">
      <div className="container mx-auto px-4">
        <h2 className="font-display text-3xl md:text-4xl font-bold text-center text-foreground mb-4">
          Why Choose Our <span className="text-primary">RAG System</span>
        </h2>
        <p className="text-muted-foreground text-center max-w-xl mx-auto mb-12 font-body">
          Powered by retrieval-augmented generation for accurate, source-backed answers.
        </p>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((f, i) => (
            <div
              key={f.title}
              className="bg-card rounded-lg p-8 text-center shadow-sm hover:shadow-md transition-shadow border border-border group"
              style={{ animationDelay: `${i * 0.15}s` }}
            >
              <div className="w-14 h-14 bg-accent rounded-full flex items-center justify-center mx-auto mb-5 group-hover:bg-primary transition-colors">
                <f.icon className="w-7 h-7 text-primary group-hover:text-primary-foreground transition-colors" />
              </div>
              <h3 className="font-display text-xl font-semibold text-foreground mb-3">{f.title}</h3>
              <p className="text-muted-foreground font-body text-sm">{f.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
