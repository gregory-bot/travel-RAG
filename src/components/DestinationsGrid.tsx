import { useState } from "react";

// Destinations with external image URLs
const destinations = [
  { 
    name: "Maasai Mara", 
    image: "https://i.pinimg.com/1200x/8c/4c/de/8c4cde9a2007c38438194402cf34be11.jpg",
    desc: "World-famous wildlife reserve with the Great Migration." 
  },
  { 
    name: "Mount Kenya", 
    image: "https://i.pinimg.com/736x/82/df/f0/82dff08b776c6b1adf1d48729723b01d.jpg",
    desc: "Africa's second-highest peak with stunning alpine scenery." 
  },
  { 
    name: "Mombasa", 
    image: "https://i.pinimg.com/736x/02/7b/8e/027b8e3379762631273c508d71cbe071.jpg",
    desc: "Historic coastal city with rich Swahili culture and beaches." 
  },
  { 
    name: "Diani Beach", 
    image: "https://i.pinimg.com/1200x/79/26/15/7926155bb20daaceb64e30dfaa0b2b8a.jpg",
    desc: "Pristine white sand beach on the Indian Ocean coast." 
  },
  { 
    name: "Amboseli", 
    image: "https://i.pinimg.com/736x/1e/16/37/1e1637f2654c8f842b36dd5032810dc8.jpg",
    desc: "Elephants with Kilimanjaro backdrop — an iconic view." 
  },
  { 
    name: "Lake Nakuru", 
    image: "https://i.pinimg.com/736x/6d/53/11/6d5311a71570a0333dcd1679a823204a.jpg",
    desc: "Famous flamingo lake in the Great Rift Valley." 
  },
];

// Fallback image for broken URLs
const FALLBACK_IMAGE = "https://i.pinimg.com/736x/10/cd/83/10cd83d9dcd2d2ea4075937824335f6c.jpg";

interface DestinationCardProps {
  destination: {
    name: string;
    image: string;
    desc: string;
  };
}

// Separate component for individual destination card
const DestinationCard = ({ destination }: DestinationCardProps) => {
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  const handleImageError = () => {
    setImageError(true);
    setIsLoading(false);
  };

  const imageUrl = imageError ? FALLBACK_IMAGE : destination.image;

  return (
    <div className="group bg-card rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all border border-border">
      {/* Image Container */}
      <div className="relative h-64 overflow-hidden bg-muted">
        {/* Loading skeleton */}
        {isLoading && (
          <div className="absolute inset-0 bg-gradient-to-r from-muted via-muted-foreground/10 to-muted animate-pulse" />
        )}
        
        {/* Image */}
        <img
          src={imageUrl}
          alt={destination.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
          onLoad={handleImageLoad}
          onError={handleImageError}
          srcSet={`${imageUrl}?w=400&h=400&fit=crop 400w, ${imageUrl}?w=600&h=600&fit=crop 600w`}
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="font-display text-lg font-semibold text-foreground mb-2">
          {destination.name}
        </h3>
        <p className="text-muted-foreground text-sm font-body">
          {destination.desc}
        </p>
      </div>
    </div>
  );
};

const DestinationsGrid = () => {
  return (
    <section className="py-20 bg-secondary">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <h2 className="font-display text-3xl md:text-4xl font-bold text-center text-foreground mb-4">
          Destinations
        </h2>
        <p className="text-muted-foreground text-center max-w-xl mx-auto mb-12 font-body">
          Explore Kenya's top destinations and discover their unique attractions.
        </p>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {destinations.map((destination) => (
            <DestinationCard
              key={destination.name}
              destination={destination}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default DestinationsGrid;