
# Travel and Tourism RAG System

## Project Overview
This project implements a Retrieval-Augmented Generation (RAG) system for the travel and tourism domain, designed to answer user questions using a custom-built tourism knowledge base. The system retrieves relevant travel information from curated data sources and generates grounded responses using a Large Language Model (LLM), strictly based on retrieved documents rather than general model knowledge.

## Objectives
- Collect and clean real-world tourism data from reputable sources
- Structure and chunk textual information for efficient retrieval
- Generate embeddings using a local embedding model (Xenova)
- Store embeddings in a vector database (postgreSQL pgvector)
- Implement semantic retrieval and metadata filtering
- Integrate an LLM for grounded response generation
- Provide a React frontend for user interaction

## Data Sources
such as:
- Kenya Tourism Board ([magicalkenya.com](https://magicalkenya.com/))
- National Tourism Service ([tourkenya.go.ke](https://tourkenya.go.ke/))
- Tourism Research Institute ([tri.go.ke](https://tri.go.ke/))
- Wikivoyage ([wikivoyage.org](https://wikivoyage.org/))

Collected data includes information on destinations like Maasai Mara, Mount Kenya, and Mombasa. The dataset consists of at least 50–200 documents or 10,000+ words of cleaned text.

## Technical Architecture
The platform consists of:
- **Backend (FastAPI, Python):** Handles data ingestion, embedding generation (using Xenova), vector storage, semantic retrieval, and LLM-based response generation. Embeddings and metadata are stored locally for efficient retrieval.
- **Frontend (React, typescript):** Provides a user interface for submitting queries and viewing grounded answers, with optional display of retrieved sources.

### Data Processing
- Cleans and normalizes text,
- Chunks documents (300–500 tokens)
- Stores metadata (location, category, price range, season, activities)

### Embeddings & Vector Storage
- Uses a local embedding model (Xenova)
- Stores embeddings and metadata in a local vector database (pgvector db )

### Retrieval Pipeline
1. Accepts user question from frontend
2. Converts question to embedding
3. Retrieves top 3–5 relevant documents
4. Injects retrieved context into a prompt
5. Generates grounded response using LLM, restricted to retrieved context

### User Interface
- Built with React (see `src/`)
- Accepts user queries and displays answers
- Optionally shows retrieved sources

## Installation & Usage
1. **Clone the repository:**
	 ```sh
	 git clone <repo-url>
	 cd travel-RAG
	 ```
2. **Backend setup:**
	 - Install Python dependencies:
		 ```sh
		 cd backend
		 pip install -r requirements.txt
		 ```
	 - Start the FastAPI server:
		 ```sh
		 uvicorn main:app
		 ```
3. **Frontend setup:**
	 - Install Node.js dependencies:
		 ```sh
		 npm install
		 ```
	 - Start the React development server:
		 ```sh
		 npm run dev
		 ```
4. **Access the platform:**
	 - Open your browser at `http://localhost:5173` (or port shown in the terminal)

## Example Queries
- Best wildlife destinations in Kenya
- 3-day itinerary in Mombasa
- Best time to visit Mount Kenya
- Budget-friendly hotels near Maasai Mara
- Family-friendly coastal activities

All answers are grounded in retrieved documents.

## Repository Structure
- `backend/` — FastAPI backend, data processing, embeddings, retrieval, LLM integration
- `src/` — React frontend, user interface components

## License
See LICENSE file for details.

## by gregory
