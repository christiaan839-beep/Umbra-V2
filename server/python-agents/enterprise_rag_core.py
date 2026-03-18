import os
import glob
import chromadb
import PyPDF2

# ⚡ SOVEREIGN MATRIX // OMNISCIENT ENTERPRISE RAG ⚡
# Derived from NVIDIA Blueprint "Cyborg Enterprise RAG".
# Scans a local `./knowledge_base` folder for PDFs, case studies, 
# and Stripe reports, indexing them instantly into ChromaDB. 
# The Telegram Closer pulls this data live during negotiations.

KNOLWEDGE_DIR = "./knowledge_base"

chroma_client = chromadb.PersistentClient(path="../chroma_db")
collection = chroma_client.get_or_create_collection(name="sovereign_omniscience")

def extract_text_from_pdf(pdf_path):
    text = ""
    try:
        with open(pdf_path, 'rb') as file:
            reader = PyPDF2.PdfReader(file)
            for page in reader.pages:
                text += page.extract_text() + "\n"
    except Exception as e:
        print(f"[!] Error reading PDF {pdf_path}: {e}")
    return text

def index_enterprise_data():
    if not os.path.exists(KNOLWEDGE_DIR):
        os.makedirs(KNOLWEDGE_DIR)
        print(f"[*] Created {KNOLWEDGE_DIR}. Drop your PDFs here and run again.")
        return

    pdf_files = glob.glob(f"{KNOLWEDGE_DIR}/*.pdf")
    
    if not pdf_files:
        print(f"[*] Intelligence Directory ({KNOLWEDGE_DIR}) is empty. Awaiting payloads.")
        return

    print(f"[⚡] Initializing Agentic RAG Pipeline. Found {len(pdf_files)} core documents.")
    
    for i, pdf_path in enumerate(pdf_files):
        print(f"[*] Ripping Text Matrix: {os.path.basename(pdf_path)}")
        text = extract_text_from_pdf(pdf_path)
        
        # In Production, chunk the text overlappingly into 512 token blocks.
        chunks = [text[j:j+1000] for j in range(0, len(text), 1000)] if text else []
        
        for chunk_idx, chunk in enumerate(chunks):
            collection.add(
                documents=[chunk],
                metadatas=[{"source": os.path.basename(pdf_path), "chunk_idx": chunk_idx}],
                ids=[f"doc_{i}_chunk_{chunk_idx}"]
            )
            
    print("[✅] Enterprise Omniscience Achieved. Telegram Cartel now has perfect memory.")

if __name__ == '__main__':
    print("========================================================")
    print("[⚡] SOVEREIGN ENTERPRISE RAG CORE INITIALIZED [⚡]")
    print("========================================================")
    index_enterprise_data()
