import argparse
import time
import sys

def simulate_pipecat_execution(phone, prompt):
    print(f"[NVIDIA NIM] Booting Language Models & TTS for target {phone}...", flush=True)
    time.sleep(1)
    
    print(f"[VERTEX AI GROUNDING] System Prompt Intercepted: {prompt}", flush=True)
    time.sleep(1)
    
    print(f"[PIPECAT] Establishing SIP Trunk / WebRTC Connection to {phone}...", flush=True)
    time.sleep(1.5)
    
    print("[CALL CONNECTED]", flush=True)
    print("--- LIVE TRANSCRIPT ---", flush=True)
    
    transcript = [
        "UMBRA: Hey, I noticed you were missing your Google Business profile and SEO tags. Do you have 60 seconds?",
        "PROSPECT: Uh, who is this?",
        "UMBRA: It's the AI representative for UMBRA. We identified that your competitors are stealing 40% of your local search traffic because of those missing tags. I can fix it for free right now. Sound fair?",
        "PROSPECT: Oh, okay. Wow. Yeah, if it's free, why not.",
        "UMBRA: Excellent. I'm texting you a secure calendar link now to finalize the onboarding with my human partner. Talk to you soon."
    ]
    
    for line in transcript:
        print(f"\n{line}", flush=True)
        time.sleep(2)
        
    print("\n--- CALL TERMINATED ---", flush=True)
    print("[NVIDIA NIM] Resources Deallocated. Meeting successfully booked.", flush=True)
    sys.exit(0)

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="UMBRA Pipecat Voice Executable")
    parser.add_argument("--phone", required=True, help="Target phone number")
    parser.add_argument("--prompt", required=True, help="Vertex AI Grounded Context")
    
    args = parser.parse_args()
    
    simulate_pipecat_execution(args.phone, args.prompt)
