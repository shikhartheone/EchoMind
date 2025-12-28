# 🧠 EchoMind — Real-Time AI Meeting Intelligence

EchoMind is an AI-powered **real-time meeting assistant** that listens to live meetings, transcribes conversations, builds long-term memory, and lets participants ask intelligent questions about what was discussed in the meet.

It combines **LiveKit**, **Deepgram**, **Gemini**, and **RAG (Retrieval-Augmented Generation)** to deliver a **AI meeting copilot**.

---

## 🚀 What EchoMind Does

✅ Real-time speech-to-text  
✅ Speaker-aware transcription  
✅ Live meeting memory  
✅ AI-powered Q&A over meetings  
✅ Automatic meeting summaries  
✅ Decision & question extraction  
✅ Token-efficient support for long meetings

---

## 🏗 Architecture Overview

```
Browser (LiveKit)
      │
      ▼
LiveKit Cloud
      │
      ▼
AI Worker (Node.js)
      │
      ├─ Deepgram (Speech → Text)
      ├─ Short-term Memory (RAM)
      ├─ Python RAG Service
      │     └─ Chroma Vector DB
      └─ Gemini (LLM)
      │
      ▼
Backend API (Node.js)
      │
      ▼
React Frontend
```

---


## ⚙️ Setup Instructions

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/shikhartheone/EchoMind.git
cd EchoMind
```

### 2️⃣ Install Dependencies

**Frontend**

```bash
cd frontend
npm install
```

**Backend**

```bash
cd backend
npm install
```

**AI Worker**

```bash
cd ai-worker
npm install
```

**Python RAG Service**

```bash
cd ai-worker
pip install fastapi uvicorn chromadb httpx
```

### 3️⃣ Start ChromaDB

```bash
chroma run --host localhost --port 8000
```

### 4️⃣ Start Python RAG Service

```bash
cd ai-worker
python rag_service.py
```

### 5️⃣ Start Backend API

```bash
cd backend
nodemon server
```

### 6️⃣ Start AI Worker

```bash
cd ai-worker
node src/server.js
```

### 7️⃣ Start Frontend

```bash
cd frontend
npm start
```

---

## 🔐 Environment Variables

Create `.env` files as follows:

**Backend** (`backend/.env`)

```bash
LIVEKIT_API_KEY=your_livekit_api_key
LIVEKIT_API_SECRET=your_livekit_api_secret
LIVEKIT_WS_URL=wss://your-livekit-instance.livekit.cloud
PORT=5050
GEMINI_API_KEY=your_gemini_api_key
```

**AI Worker** (`ai-worker/.env`)

```bash
LIVEKIT_URL=wss://your-livekit-instance.livekit.cloud
LIVEKIT_API_KEY=your_livekit_api_key
LIVEKIT_API_SECRET=your_livekit_api_secret
DEEPGRAM_API_KEY=your_deepgram_api_key
```

**Frontend** (`frontend/.env`)

```bash
REACT_APP_BACKEND_URL=http://localhost:5050
REACT_APP_LIVEKIT_URL=wss://your-livekit-instance.livekit.cloud
```

```

```
