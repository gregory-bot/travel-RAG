import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from services.embedding_service import get_embedding
from database.postgres_client import store_document, init_db

SAMPLE_KENYA_TOURISM_DATA = [
    {
        "text": "Maasai Mara National Reserve is one of Africa's most famous safari destinations. Located in southwestern Kenya, it is renowned for the Great Migration, where millions of wildebeest, zebras, and gazelles migrate between July and October. The reserve is home to the Big Five: lions, elephants, leopards, rhinos, and buffalo. Best time to visit is during the dry season from June to October.",
        "metadata": {
            "location": "Maasai Mara",
            "category": "Wildlife",
            "source": "Kenya Tourism Board",
            "best_season": "June-October",
            "activities": ["Safari", "Wildlife viewing", "Hot air balloon"]
        }
    },
    {
        "text": "Mount Kenya is Africa's second-highest mountain at 5,199 meters. It offers diverse climbing routes suitable for both technical climbers and trekkers. The mountain is a UNESCO World Heritage Site with unique alpine vegetation and glaciers. Popular routes include Sirimon and Chogoria. The best climbing season is January-February and August-September.",
        "metadata": {
            "location": "Mount Kenya",
            "category": "Mountains",
            "source": "Tourism Research Institute",
            "best_season": "January-February, August-September",
            "activities": ["Hiking", "Mountain climbing", "Photography"]
        }
    },
    {
        "text": "Mombasa is Kenya's coastal city offering pristine beaches along the Indian Ocean. Fort Jesus, a UNESCO World Heritage Site built by the Portuguese in 1593, showcases the city's rich history. Popular beaches include Diani Beach, Nyali Beach, and Bamburi Beach. The city has a strong Swahili culture and delicious seafood cuisine.",
        "metadata": {
            "location": "Mombasa",
            "category": "Beaches",
            "source": "Wikivoyage",
            "best_season": "Year-round",
            "activities": ["Beach activities", "Snorkeling", "Cultural tours", "Water sports"]
        }
    },
    {
        "text": "Diani Beach is located 30km south of Mombasa and is consistently rated as one of Africa's best beaches. The white sandy beach stretches for 17km with crystal-clear turquoise waters. Activities include kite surfing, snorkeling, and diving. The area has numerous resorts ranging from budget to luxury accommodation.",
        "metadata": {
            "location": "Diani Beach",
            "category": "Beaches",
            "source": "Magical Kenya",
            "best_season": "Year-round",
            "activities": ["Swimming", "Kite surfing", "Diving", "Snorkeling"],
            "price_range": "Budget to Luxury"
        }
    },
    {
        "text": "Amboseli National Park offers stunning views of Mount Kilimanjaro. It's famous for large elephant herds and close-up wildlife encounters. The park has swamp areas that attract diverse wildlife. Best photography opportunities are during early morning and late afternoon. The dry season (June-October) offers the best wildlife viewing.",
        "metadata": {
            "location": "Amboseli",
            "category": "Wildlife",
            "source": "Kenya Tourism Board",
            "best_season": "June-October",
            "activities": ["Wildlife viewing", "Photography", "Bird watching"]
        }
    },
    {
        "text": "Lake Nakuru National Park is famous for millions of flamingos that create a pink shoreline. The park is a rhino sanctuary with both black and white rhinos. Other wildlife includes lions, leopards, giraffes, and buffalo. The park is located 160km from Nairobi, making it an easy day trip destination.",
        "metadata": {
            "location": "Lake Nakuru",
            "category": "Wildlife",
            "source": "Tourism Research Institute",
            "best_season": "Year-round",
            "activities": ["Bird watching", "Wildlife viewing", "Photography"]
        }
    },
    {
        "text": "Budget accommodation near Maasai Mara includes several camps and lodges. Mara Springs Safari Camp offers affordable tents with en-suite bathrooms from $80 per night. Jambo Mara Safari Lodge provides basic rooms at $60 per night. Budget travelers can also find camping sites for $20-30 per night. Most budget options include meals and game drives.",
        "metadata": {
            "location": "Maasai Mara",
            "category": "Accommodation",
            "source": "Kenya Tourism Board",
            "price_range": "Budget",
            "activities": ["Safari", "Game drives"]
        }
    },
    {
        "text": "A 3-day Mombasa itinerary: Day 1 - Visit Fort Jesus in the morning, explore Old Town in the afternoon, enjoy dinner at Tamarind Restaurant. Day 2 - Full day at Diani Beach with water sports. Day 3 - Morning visit to Haller Park, afternoon shopping at Bombolulu Workshops, evening dhow cruise. Budget: $200-300 per person excluding accommodation.",
        "metadata": {
            "location": "Mombasa",
            "category": "Itineraries",
            "source": "Wikivoyage",
            "duration": "3 days",
            "price_range": "Budget-Mid"
        }
    },
    {
        "text": "Mount Kenya hiking tips: Acclimatize properly to avoid altitude sickness. Hire experienced guides from authorized operators. Pack warm clothing as temperatures drop significantly at night. Carry water purification tablets. The trek takes 4-5 days for Point Lenana (4,985m), the most popular peak. Physical fitness is essential.",
        "metadata": {
            "location": "Mount Kenya",
            "category": "Activities",
            "source": "Tourism Research Institute",
            "activities": ["Hiking", "Mountain climbing"],
            "difficulty": "Moderate to Challenging"
        }
    },
    {
        "text": "Family-friendly coastal activities in Kenya include: Dolphin watching at Kisite-Mpunguti Marine Park, glass-bottom boat tours, camel rides along the beach, visiting the Mamba Village crocodile farm, snorkeling at Watamu Marine Park, and exploring the butterfly pavilion at Gedi Ruins. Most activities are suitable for children aged 5 and above.",
        "metadata": {
            "location": "Kenya Coast",
            "category": "Family Activities",
            "source": "Magical Kenya",
            "activities": ["Dolphin watching", "Snorkeling", "Cultural visits"],
            "suitable_for": "Families with children"
        }
    }
]

def index_sample_data():
    print("Initializing database...")
    init_db()

    print("Indexing sample tourism documents...")

    for i, doc in enumerate(SAMPLE_KENYA_TOURISM_DATA):
        try:
            print(f"Processing document {i+1}/{len(SAMPLE_KENYA_TOURISM_DATA)}: {doc['metadata']['location']}")

            embedding = get_embedding(doc["text"])

            doc_id = store_document(
                text=doc["text"],
                embedding=embedding,
                metadata=doc["metadata"]
            )

            print(f"✓ Stored document with ID: {doc_id}")

        except Exception as e:
            print(f"✗ Error processing document {i+1}: {e}")

    print("\n✓ Indexing complete!")

if __name__ == "__main__":
    index_sample_data()
