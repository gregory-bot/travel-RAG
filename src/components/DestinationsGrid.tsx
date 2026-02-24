import { ArrowRight } from "lucide-react";
import destMaasaiMara from "@/assets/dest-maasai-mara.jpg";
import destMountKenya from "@/assets/dest-mount-kenya.jpg";
import destMombasa from "@/assets/dest-mombasa.jpg";
import destDiani from "@/assets/dest-diani.jpg";
import destAmboseli from "@/assets/dest-amboseli.jpg";
import destNakuru from "@/assets/dest-nakuru.jpg";

const destinations = [
  { name: "Maasai Mara", image: destMaasaiMara, desc: "World-famous wildlife reserve with the Great Migration." },
  { name: "Mount Kenya", image: destMountKenya, desc: "Africa's second-highest peak with stunning alpine scenery." },
  { name: "Mombasa", image: destMombasa, desc: "Historic coastal city with rich Swahili culture and beaches." },
  { name: "Diani Beach", image: destDiani, desc: "Pristine white sand beach on the Indian Ocean coast." },
  { name: "Amboseli", image: destAmboseli, desc: "Elephants with Kilimanjaro backdrop — an iconic view." },
  { name: "Lake Nakuru", image: destNakuru, desc: "Famous flamingo lake in the Great Rift Valley." },
];

const DestinationsGrid = () => {

  const handleExplore = (name: string) => {
    // Scroll to chat and dispatch a custom event to pre-fill the query
    const chatSection = document.getElementById("chat");
    if (chatSection) chatSection.scrollIntoView({ behavior: "smooth" });
    window.dispatchEvent(new CustomEvent("explore-destination", { detail: `Tell me about ${name}` }));
  };

  return (
    <section className="py-20 bg-secondary">
      <div className="container mx-auto px-4">
        <h2 className="font-display text-3xl md:text-4xl font-bold text-center text-foreground mb-4">
          Popular <span className="text-primary">Destinations</span>
        </h2>
        <p className="text-muted-foreground text-center max-w-xl mx-auto mb-12 font-body">
          Explore Kenya's top destinations and ask our AI for detailed information.
        </p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {destinations.map((d) => (
            <div
              key={d.name}
              className="group bg-card rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all border border-border"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={d.image}
                  alt={d.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
              </div>
              <div className="p-5">
                <h3 className="font-display text-lg font-semibold text-foreground mb-2">{d.name}</h3>
                <p className="text-muted-foreground text-sm font-body mb-4">{d.desc}</p>
                <button
                  onClick={() => handleExplore(d.name)}
                  className="inline-flex items-center gap-1 text-primary hover:text-primary-hover font-medium text-sm font-body transition-colors"
                >
                  Explore <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DestinationsGrid;
