from fastapi import APIRouter, HTTPException
from typing import List
from schemas.response_models import DestinationResponse
from database.postgres_client import get_db_connection

router = APIRouter()

@router.get("", response_model=List[DestinationResponse])
async def get_destinations():
    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        cursor.execute("""
            SELECT DISTINCT metadata->>'location' as name,
                   metadata->>'category' as category,
                   metadata->>'description' as description
            FROM tourism_documents
            WHERE metadata->>'location' IS NOT NULL
            LIMIT 20
        """)

        destinations = []
        for row in cursor.fetchall():
            destinations.append({
                "name": row[0],
                "category": row[1],
                "description": row[2]
            })

        cursor.close()
        conn.close()

        return destinations

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching destinations: {str(e)}")

@router.get("/{destination_name}", response_model=DestinationResponse)
async def get_destination(destination_name: str):
    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        cursor.execute("""
            SELECT metadata->>'location' as name,
                   metadata->>'category' as category,
                   metadata->>'description' as description
            FROM tourism_documents
            WHERE metadata->>'location' = %s
            LIMIT 1
        """, (destination_name,))

        row = cursor.fetchone()
        cursor.close()
        conn.close()

        if not row:
            raise HTTPException(status_code=404, detail="Destination not found")

        return {
            "name": row[0],
            "category": row[1],
            "description": row[2]
        }

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching destination: {str(e)}")
