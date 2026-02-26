
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
	 - Create a `.env` file in the `backend/` directory with the following structure:
		 ```env
		 # Database settings
		 DB_HOST=your_postgres_host
		 DB_PORT=your_postgres_port
		 DB_NAME=your_db_name
		 DB_USER=your_db_user
		 DB_PASSWORD=your_db_password

		 # Embedding and LLM settings
		 EMBEDDING_DIM=384
		 EMBEDDING_MODEL=xenova
		 LLM_MODEL=gemini

		 # API Keys
		 OPENAI_API_KEY=your_openai_key
		 GEMINI_API_KEY=your_gemini_key
		 ```
	 - Ensure your PostgreSQL database is running and accessible. The backend uses PostgreSQL with the pgvector extension for vector storage.
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
	 - Open your browser at `http://localhost:5173` (or the port shown in the terminal)

## Deployment

### Frontend (Netlify)
1. Push your code to GitHub.
2. Go to [Netlify](https://www.netlify.com/) and create a new site from GitHub.
3. Select your repository and follow the prompts (default build command: `npm run build`, publish directory: `dist`).
4. Deploy the site. Netlify will provide a public URL.

### Backend (Render)
1. Push your backend code to GitHub.
2. Go to [Render](https://render.com/) and create a new Web Service.
3. Connect your GitHub repository and select the backend folder.
4. Set the build command to `pip install -r requirements.txt` and the start command to `uvicorn main:app --host 0.0.0.0 --port 10000` (or your preferred port).
5. Add your environment variables in the Render dashboard (copy from your `.env` file, do not commit secrets).
6. Deploy the service. Render will provide a public API URL.

**Note:**
- Ensure CORS is configured in your FastAPI backend to allow requests from your Netlify frontend domain.
- Update the frontend API URLs to point to your deployed backend.

## Example .env file structure
```env
# Database settings
DB_HOST=your_postgres_host
DB_PORT=your_postgres_port
DB_NAME=your_db_name
DB_USER=your_db_user
DB_PASSWORD=your_db_password

# Embedding and LLM settings
EMBEDDING_DIM=384
EMBEDDING_MODEL=xenova
LLM_MODEL=gemini

# API Keys
OPENAI_API_KEY=your_openai_key
GEMINI_API_KEY=your_gemini_key
```

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
