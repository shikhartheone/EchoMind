# 🧠 EchoMind — System Design

## 🎯 Problem Overview

Meetings contain critical information, but that information is often lost shortly after the meeting ends. Participants forget:

- What was discussed
- Who said what
- What decisions were made
- Why decisions were taken

**EchoMind** is built as a **real-time meeting intelligence system** that listens, understands, remembers, and answers questions _during_ meetings — not after.

---

## 🏗 High-Level Architecture

EchoMind follows a **streaming-first, memory-aware architecture** optimized for long-running meetings and real-time interaction.

```
Participants (Browser)
        │
        ▼
    LiveKit Room
        │
        ▼
AI Worker (Node.js)
 ├─ Live Audio Stream (LiveKit)
 ├─ Speech-to-Text (Deepgram)
 ├─ Short-Term Memory (RAM)
 ├─ RAG Service (Python + ChromaDB)
 └─ LLM Reasoning (Gemini)
        │
        ▼
Backend API (Express)
        │
        ▼
Frontend Dashboard (React)
```

### Architecture Rationale

- **LiveKit** → Low-latency, browser-native audio streaming
- **AI Worker** → Decouples real-time AI processing from UI
- **Deepgram** → Fast and accurate streaming transcription
- **ChromaDB** → Scalable semantic long-term memory
- **Gemini (LLM)** → Reasoning strictly over retrieved context
- **React Dashboard** → Real-time transcript and Q&A interface

---

## 🔄 Data Flow

1. User speaks during the meeting
2. Audio is streamed via LiveKit
3. AI Worker joins as a silent participant
4. Deepgram transcribes audio in real time
5. Transcripts are stored in:
   - Short-term memory (recent context)
   - Long-term vector memory (ChromaDB via Python RAG service)
6. Frontend updates live transcript via polling
7. User asks a question
8. Question is sent to Backend API
9. Backend queries Python RAG service for relevant transcript chunks
10. Gemini generates a grounded response with context
11. Answer is shown in the UI

---

## 🧠 Key Assumptions

- LiveKit provides stable low-latency audio streams
- Transcription accuracy is sufficient for conversational meetings
- LLMs are only used with retrieved context (RAG-first)
- ChromaDB stores embeddings, not raw logs
- Meetings are browser-based
- Users prefer real-time intelligence over post-meeting summaries
- Backend serves as API gateway between frontend and AI services
- Python RAG service runs separately for vector operations

---

## 🔍 Why Retrieval-Augmented Generation (RAG)?

Meetings are unbounded and token-heavy.

**Sending full transcripts to an LLM:**

- Is expensive
- Hits token limits
- Increases hallucinations
- Slows response time

**EchoMind uses RAG to:**

- Retrieve only relevant transcript segments (top 5 chunks)
- Keep prompts small and focused
- Support long meetings without token limits
- Produce accurate, grounded answers
- Scale efficiently with meeting duration

---

## 📊 Memory Architecture

### Two-Tier Memory System

#### 1. Short-Term Memory (RAM)

- Last 25 conversation turns
- Used for immediate context
- Fast in-memory access
- Located in AI Worker

#### 2. Long-Term Memory (Vector DB)

- All meeting transcripts embedded
- Stored in ChromaDB
- Semantic similarity search
- Accessed via Python FastAPI service
- Persistent across sessions

**Flow:**

```
New Transcript
    ├─> Short-Term Memory (RAM buffer)
    └─> Python RAG Service
            └─> ChromaDB (Vector embeddings)
```

---

## 🎯 API Endpoints

### Backend API (Port 5050)

| Endpoint       | Method | Purpose                       |
| -------------- | ------ | ----------------------------- |
| `/api/token`   | POST   | Generate LiveKit room tokens  |
| `/api/summary` | GET    | Generate AI meeting summary   |
| `/api/ask`     | POST   | Q&A with Gemini + RAG context |

### Python RAG Service (Port 5000)

| Endpoint  | Method | Purpose                     |
| --------- | ------ | --------------------------- |
| `/add`    | POST   | Store new transcript chunk  |
| `/query`  | POST   | Semantic search for context |
| `/recent` | GET    | Get last N transcripts      |
| `/health` | GET    | Service health check        |

### ChromaDB (Port 8000)

- HTTP server for vector operations
- Fallback to PersistentClient if HTTP unavailable

---

## ⚠️ Known Limitations

1. **Single-language meetings**

   - No automatic language detection yet

2. **Speaker attribution confidence**

   - Diarization lacks confidence scoring
   - Relies on LiveKit participant metadata

3. **Limited long-term summarization**

   - Summaries are generated on-demand only
   - No periodic auto-summarization

4. **Basic memory pruning**

   - Time-based eviction instead of semantic importance
   - Fixed buffer size (25 turns, 100 for queries)

5. **Single-meeting scope**

   - No cross-meeting organizational memory
   - Each meeting is isolated

6. **No offline support**
   - Requires all services running simultaneously
   - No graceful degradation if services fail

---

## 🚀 Improvements With More Time

### 1. Advanced Speaker Intelligence

- Voice-based speaker identification
- Persistent speaker profiles across meetings
- Role-aware summaries (who made decisions, action items per person)

### 2. Smarter Memory Management

- Importance-weighted memory retention
- Automatic decision and action item extraction
- Cross-meeting knowledge graphs
- Topic clustering and trend analysis

### 3. Multi-language Support

- Automatic language detection
- Multi-lingual transcription and retrieval
- Cross-language semantic search

### 4. Proactive AI Assistance

- Automatic decision alerts during meeting
- Real-time follow-up reminders
- Conflict and risk detection
- Sentiment analysis per participant

### 5. Enterprise Scaling

- Multi-tenant architecture
- Fine-grained access control and permissions
- Audit logs and compliance support
- Meeting recording and playback
- Integration with calendars and task managers

### 6. Enhanced Q&A

- Multi-turn conversations with context
- Question suggestions based on meeting content
- Automatic FAQ generation
- Export summaries to Notion, Slack, etc.

---

## 🎯 Summary

EchoMind is designed as a **real-time, memory-driven AI meeting copilot** rather than a passive transcription tool.

By combining:

- **Streaming audio** (LiveKit + Deepgram)
- **Hierarchical memory** (RAM buffer + ChromaDB)
- **Retrieval-augmented reasoning** (RAG + Gemini)

EchoMind transforms meetings into **queryable, persistent knowledge systems** that participants can interact with in real-time.

The architecture prioritizes:

- ✅ Low latency for real-time interaction
- ✅ Scalability for long meetings
- ✅ Accuracy through grounded RAG
- ✅ Modularity for independent service scaling
- ✅ User experience with live updates and instant answers
