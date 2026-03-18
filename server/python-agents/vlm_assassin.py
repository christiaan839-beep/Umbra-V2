import asyncio
from playwright.async_api import async_playwright
import base64
import requests
import os
import sys

# ⚡ SOVEREIGN MATRIX // VLM ASSASSINATION NODE ⚡
# Derived from NVIDIA DGX Spark "Live VLM" Playbook.
# Takes a live screenshot of a target URL and feeds it to NVIDIA NIM (Llama 3.2 90B Vision)
# Output: A ruthless, conversion-focused critique proving why the target agency is inferior.

NVIDIA_API_KEY = os.getenv("NVIDIA_API_KEY")
# Using the premier Vision model on NVIDIA NIM
VLM_MODEL = "meta/llama-3.2-90b-vision-instruct"

async def capture_target_visuals(url: str) -> str:
    print(f"[*] Initializing Playwright Stealth Crawler for target: {url}")
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()
        await page.set_viewport_size({"width": 1920, "height": 1080})
        await page.goto(url, wait_until="networkidle")
        
        print(f"[*] Target visual acquired. Encrypting to Base64...")
        screenshot_bytes = await page.screenshot(type='jpeg', quality=80)
        base64_img = base64.b64encode(screenshot_bytes).decode('utf-8')
        
        await browser.close()
        return base64_img

def execute_vlm_strike(base64_image: str, target_name: str):
    if not NVIDIA_API_KEY:
        print("[!] CRITICAL ERROR: NVIDIA_API_KEY not found in environment.")
        return

    print(f"[⚡] Uplinking to NVIDIA TensorRT-LLM Exascale Cluster ({VLM_MODEL})...")
    
    headers = {
        "Authorization": f"Bearer {NVIDIA_API_KEY}",
        "Accept": "application/json"
    }

    payload = {
        "model": VLM_MODEL,
        "messages": [
            {
                "role": "user",
                "content": f'Evaluate this landing page for "{target_name}". As an elite $10k/mo agency director, give me a ruthless 3-point mathematical critique of its visual UX/UI and conversion flaws. Be aggressive but highly technical. Make it sound like a military debrief. Format with markdown bullet points.',
            },
            {
                "role": "user",
                "content": f'data:image/jpeg;base64,{base64_image}'
            }
        ],
        "max_tokens": 1000,
        "stream": False
    }

    response = requests.post("https://integrate.api.nvidia.com/v1/chat/completions", headers=headers, json=payload)
    
    if response.status_code == 200:
        data = response.json()
        critique = data["choices"][0]["message"]["content"]
        print("\n================ [ ASSASSINATION REPORT ] ================\n")
        print(critique)
        print("\n==========================================================\n")
    else:
        print(f"[!] NIM VLM Strike Failed: {response.text}")

async def main():
    if len(sys.argv) < 2:
        print("Usage: python3 vlm_assassin.py <target_url>")
        sys.exit(1)

    target_url = sys.argv[1]
    
    try:
        b64_img = await capture_target_visuals(target_url)
        execute_vlm_strike(b64_img, target_url)
    except Exception as e:
        print(f"[!] Lethal Exception in VLM Node: {e}")

if __name__ == "__main__":
    asyncio.run(main())
