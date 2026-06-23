# Umbra V2

An autonomous AI agent platform for B2B lead generation and outbound workflow automation. Umbra orchestrates multi-agent pipelines that handle lead research, personalized outreach drafting, and campaign reporting, giving small teams a force-multiplier for repetitive sales operations.

## Overview

Umbra combines a Next.js edge application with a Python-based agent daemon. Client requests flow through a clean web UI; the agent layer executes the work and returns structured results and reporting. The system uses a local retrieval-augmented (RAG) memory loop so that every campaign improves the context available to the next one.

## Key Features

Multi-agent orchestration with coordinated agents for research, copy drafting, and reporting. A RAG memory loop using a local vector store (ChromaDB) embeds prior campaigns, transcripts, and reference docs to ground future outputs. LLM-powered drafting generates personalized outreach copy using Gemini, with human review before anything is sent. Automated reporting generates client-facing summary reports of work completed. The system is edge-ready: the Next.js app deploys to Vercel and the Python daemon runs locally or in Docker.

## Tech Stack

Frontend / App: Next.js, TypeScript, Tailwind CSS, Drizzle ORM. Backend / Agents: Python, ChromaDB (vector memory), Docker. Database: Postgres (Neon). LLMs: Google Gemini. Validation: Zod schema validation on all inbound payloads.

## Getting Started

Install and run the web app with `bun install` then `bun run dev`. Run the agent daemon from `server/python-agents` by activating the virtual environment (`source venv/bin/activate`) and running `python nemoclaw_os.py`. To run the full stack with Docker, use `docker-compose up -d --build`.

## Responsible Use

Umbra is built for legitimate, permission-based B2B outreach. Users are responsible for complying with applicable anti-spam and data-protection laws (e.g., GDPR, POPIA, CAN-SPAM), respecting website terms of service, and honoring opt-out requests. Outreach copy is generated for human review prior to sending.

## License

Add a license (e.g., MIT or proprietary).
