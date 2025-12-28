#!/usr/bin/env python3
"""
RAG Microservice: Handles Chroma interactions and semantic search
Accessed by Node.js EchoMind agent via HTTP

Architecture:
  Node (EchoMind) → HTTP → Python (RAG Service) → Chroma (Vector DB)
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import chromadb
import os
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()

# CORS for Node.js requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Connect to Chroma (HTTP if available, else persistent local)
collection = None
chroma_client = None

def _init_chroma_client():
    global chroma_client
    host = os.getenv("ECHOMIND_CHROMA_HOST", "127.0.0.1")
    port = int(os.getenv("ECHOMIND_CHROMA_PORT", "8000"))
    try:
        chroma_client = chromadb.HttpClient(host=host, port=port)
        logger.info(f"🌐 Using Chroma HTTP at {host}:{port}")
    except Exception as e:
        data_dir = os.path.join(os.path.dirname(__file__), "chroma_data")
        os.makedirs(data_dir, exist_ok=True)
        chroma_client = chromadb.PersistentClient(path=data_dir)
        logger.warning(
            f"⚠️ Chroma HTTP connect failed ({e}); falling back to PersistentClient at {data_dir}"
        )
RECENTS: list[dict] = []
RECENT_LIMIT = 100


def init_collection():
    global collection
    try:
        if chroma_client is None:
            _init_chroma_client()
        collection = chroma_client.get_or_create_collection(
            name="echomind",
            metadata={"hnsw:space": "cosine"}
        )
        logger.info("✅ Chroma collection initialized")
    except Exception as e:
        logger.error(f"❌ Chroma init failed: {e}")
        raise


@app.on_event("startup")
async def startup():
    init_collection()


class AddTranscriptRequest(BaseModel):
    text: str
    speaker: str


class QueryRequest(BaseModel):
    query: str | None = None
    text: str | None = None
    n_results: int = 5


@app.post("/add")
async def add_transcript(req: AddTranscriptRequest):
    """Add a transcript to Chroma vector store"""
    if not collection:
        raise HTTPException(status_code=500, detail="Chroma not initialized")

    try:
        doc_id = f"{req.speaker}_{int(__import__('time').time() * 1000)}"
        collection.add(
            ids=[doc_id],
            documents=[req.text],
            metadatas=[{"speaker": req.speaker}]
        )
        RECENTS.append({"id": doc_id, "speaker": req.speaker, "text": req.text})
        if len(RECENTS) > RECENT_LIMIT:
            RECENTS.pop(0)
        logger.info(f"📝 Added: [{req.speaker}] {req.text[:50]}")
        return {"status": "ok", "id": doc_id}
    except Exception as e:
        logger.error(f"❌ Add failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/query")
async def query_memory(req: QueryRequest):
    """Query Chroma for similar transcripts"""
    if not collection:
        raise HTTPException(status_code=500, detail="Chroma not initialized")

    q = req.query or req.text
    if not q:
        raise HTTPException(status_code=422, detail="Provide 'query' or 'text' field")

    try:
        results = collection.query(
            query_texts=[q],
            n_results=req.n_results,
            include=["documents", "metadatas"]
        )
        count = len(results['documents'][0]) if results.get('documents') else 0
        logger.info(f"🔍 Query: {q[:50]} → {count} results")
        return {
            "documents": results["documents"][0] if results.get("documents") else [],
            "metadatas": results["metadatas"][0] if results.get("metadatas") else []
        }
    except Exception as e:
        logger.error(f"❌ Query failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/recent")
async def recent(n: int = 20):
    """Return last N transcripts from in-memory buffer"""
    try:
        items = RECENTS[-n:]
        return {"items": items}
    except Exception as e:
        logger.error(f"❌ Recent failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))


# Alias to avoid client path mismatches
@app.get("/recents")
async def recent_alias(n: int = 20):
    return await recent(n)


@app.get("/query_text")
async def query_text(q: str, n: int = 5):
    """GET variant: query using URL params (q, n)"""
    if not collection:
        raise HTTPException(status_code=500, detail="Chroma not initialized")

    try:
        results = collection.query(
            query_texts=[q],
            n_results=n,
            include=["documents", "metadatas"]
        )
        count = len(results['documents'][0]) if results.get('documents') else 0
        logger.info(f"🔍 Query(GET): {q[:50]} → {count} results")
        return {
            "documents": results["documents"][0] if results.get("documents") else [],
            "metadatas": results["metadatas"][0] if results.get("metadatas") else []
        }
    except Exception as e:
        logger.error(f"❌ Query(GET) failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
async def health():
    """Health check endpoint"""
    return {"status": "ok" if collection else "initializing"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=5000, log_level="info")
