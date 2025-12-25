import asyncio
import os
import sys
from pathlib import Path
from motor.motor_asyncio import AsyncIOMotorClient
from datetime import datetime, timezone
import uuid

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent.parent))

from dotenv import load_dotenv

ROOT_DIR = Path(__file__).parent.parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
db_name = os.environ['DB_NAME']

sample_products = [
    {
        "id": str(uuid.uuid4()),
        "name": "Sérum Visage Éclat",
        "description": "Un sérum précieux enrichi en vitamine C et acide hyaluronique pour un teint lumineux et unifié. Formule naturelle et bio.",
        "price": 45.00,
        "image_url": "https://images.pexels.com/photos/4202325/pexels-photo-4202325.jpeg",
        "category": "Soin du visage",
        "stock": 25,
        "created_at": datetime.now(timezone.utc).isoformat()
    },
    {
        "id": str(uuid.uuid4()),
        "name": "Crème Hydratante Luxe",
        "description": "Crème riche aux huiles précieuses d'argan et de rose. Nourrit intensément et laisse la peau douce et satinée.",
        "price": 55.00,
        "image_url": "https://images.pexels.com/photos/8605776/pexels-photo-8605776.jpeg",
        "category": "Soin du visage",
        "stock": 30,
        "created_at": datetime.now(timezone.utc).isoformat()
    },
    {
        "id": str(uuid.uuid4()),
        "name": "Huile Corps Précieuse",
        "description": "Une huile sèche aux notes florales délicates. Sublime votre peau tout en la nourrissant en profondeur.",
        "price": 38.00,
        "image_url": "https://images.pexels.com/photos/3762879/pexels-photo-3762879.jpeg",
        "category": "Soin du corps",
        "stock": 20,
        "created_at": datetime.now(timezone.utc).isoformat()
    },
    {
        "id": str(uuid.uuid4()),
        "name": "Gommage Doux Visage",
        "description": "Gommage enzymatique doux aux extraits de papaye. Élimine les cellules mortes pour une peau éclatante.",
        "price": 32.00,
        "image_url": "https://images.pexels.com/photos/3735657/pexels-photo-3735657.jpeg",
        "category": "Soin du visage",
        "stock": 18,
        "created_at": datetime.now(timezone.utc).isoformat()
    },
    {
        "id": str(uuid.uuid4()),
        "name": "Masque Purifiant Argile",
        "description": "Masque à l'argile verte et charbon actif. Purifie en profondeur et resserre les pores visibles.",
        "price": 28.00,
        "image_url": "https://images.pexels.com/photos/3762452/pexels-photo-3762452.jpeg",
        "category": "Soin du visage",
        "stock": 22,
        "created_at": datetime.now(timezone.utc).isoformat()
    },
    {
        "id": str(uuid.uuid4()),
        "name": "Rouge à Lèvres Velours",
        "description": "Rouge à lèvres mat longue tenue aux pigments naturels. Texture veloutée et confortable.",
        "price": 24.00,
        "image_url": "https://images.pexels.com/photos/2533266/pexels-photo-2533266.jpeg",
        "category": "Maquillage",
        "stock": 35,
        "created_at": datetime.now(timezone.utc).isoformat()
    },
    {
        "id": str(uuid.uuid4()),
        "name": "Parfum Fleur de Jasmin",
        "description": "Eau de parfum aux notes de jasmin, bois de santal et musc blanc. Élégant et envoûtant.",
        "price": 78.00,
        "image_url": "https://images.pexels.com/photos/965989/pexels-photo-965989.jpeg",
        "category": "Parfums",
        "stock": 15,
        "created_at": datetime.now(timezone.utc).isoformat()
    },
    {
        "id": str(uuid.uuid4()),
        "name": "Baume Corps Nourrissant",
        "description": "Baume riche au beurre de karité et huile de coco. Répare les peaux très sèches.",
        "price": 42.00,
        "image_url": "https://images.pexels.com/photos/4612011/pexels-photo-4612011.jpeg",
        "category": "Soin du corps",
        "stock": 28,
        "created_at": datetime.now(timezone.utc).isoformat()
    }
]

async def seed_database():
    client = AsyncIOMotorClient(mongo_url)
    db = client[db_name]
    
    try:
        # Clear existing products
        await db.products.delete_many({})
        print("Existing products cleared.")
        
        # Insert sample products
        result = await db.products.insert_many(sample_products)
        print(f"✓ {len(result.inserted_ids)} products added successfully!")
        
        # Print products
        for product in sample_products:
            print(f"  - {product['name']} ({product['category']}) - {product['price']}€")
        
    except Exception as e:
        print(f"Error seeding database: {e}")
    finally:
        client.close()

if __name__ == "__main__":
    print("Seeding database with sample products...")
    asyncio.run(seed_database())
    print("\nDatabase seeded successfully!")
