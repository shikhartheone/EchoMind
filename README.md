# 🧠 EchoMind — Real-Time AI Meeting Intelligence

EchoMind is an AI-powered **real-time meeting assistant** that listens to live meetings, transcribes conversations, builds long-term memory, and lets participants ask intelligent questions about what was discussed — similar to **Otter.ai** or **Zoom AI Companion**.

It combines **LiveKit**, **Deepgram**, **Gemini**, and **RAG (Retrieval-Augmented Generation)** to deliver a **production-grade AI meeting copilot**.

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

## 🔥 Core Features

### 🎙 Live Transcription

Audio from all meeting participants is captured via **LiveKit** and transcribed in real time using **Deepgram WebSockets**.

---

### 🧠 Hierarchical Memory System

EchoMind stores meeting context in **two memory layers**:

#### 🔹 Short-Term Memory (RAM)

- Stores the last few minutes of conversation
- Used for continuity and live summaries

#### 🔹 Long-Term Memory (Vector DB)

- All meeting transcripts are embedded and stored in **ChromaDB**
- Enables semantic search and contextual question answering

---

### 🔍 Meeting Q&A (RAG Copilot)

Users can ask questions like:

- _“What was decided?”_
- _“Did anyone mention budget?”_
- _“Who talked about Deepgram?”_

#### 🔁 RAG Flow

```
User Question
    → Chroma Vector DB
    → Relevant Transcript Chunks
    → Gemini
    → Final Answer
```

✅ Prevents token overflow in long meetings  
✅ Ensures grounded, non-hallucinated answers  
✅ Scales efficiently with meeting length

---

### 🧠 Smart Meeting Summary

EchoMind can generate at any point:

- Meeting summary
- Key decisions
- Open questions

Powered by **Gemini**, with a **heuristic fallback** if the LLM is unavailable.

---

## 🖥 Frontend UI

The React dashboard includes:

- Live transcript
- Participant list
- Microphone controls
- AI Copilot (“Ask EchoMind”)
- Meeting summary panel

---

## 🧰 Tech Stack

| Layer          | Technology                  |
| -------------- | --------------------------- |
| Frontend       | React, Material UI          |
| Realtime Audio | LiveKit                     |
| Speech-to-Text | Deepgram (WebSocket)        |
| LLM            | Google Gemini               |
| Vector DB      | ChromaDB                    |
| RAG Service    | FastAPI (Python)            |
| Backend API    | Node.js (Express)           |
| AI Worker      | Node.js (LiveKit RTC Agent) |

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
