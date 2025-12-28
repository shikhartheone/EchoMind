#!/usr/bin/env python3
"""
Simple ChromaDB HTTP server for EchoMind
Run: python chroma_server.py
"""

if __name__ == "__main__":
    import subprocess
    import sys
    
    print("🚀 Starting ChromaDB server on http://localhost:8000")
    print("Press Ctrl+C to stop")
    
    # Use chromadb CLI command
    subprocess.run([sys.executable, "-m", "chromadb.cli", "run", "--host", "localhost", "--port", "8000"])
