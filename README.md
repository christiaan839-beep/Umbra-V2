# UMBRA V2 — Autonomous AI Marketing Intelligence

> 100-phase SaaS platform that replaces your entire marketing team with autonomous AI.

[![Vercel](https://img.shields.io/badge/deployed-Vercel-black?logo=vercel)](https://umbra-v2.vercel.app)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org/)
[![License](https://img.shields.io/badge/license-Proprietary-red)]()

## Architecture

```
src/
├── app/                    # Next.js 16 App Router
│   ├── api/                # 42 API route directories
│   │   ├── stripe/         # Stripe payments + webhooks
│   │   ├── payfast/        # PayFast ZAR payments (🇿🇦)
│   │   ├── paypal/         # PayPal global payments
│   │   ├── swarm/          # AI engine endpoints (Gemini)
│   │   ├── email/          # Email sender (Resend/Gmail)
│   │   ├── health/         # System health check
│   │   ├── monitor/        # Self-healing monitor
│   │   ├── webhooks/       # Payment & service webhooks
│   │   └── cron/           # Automated jobs
│   ├── dashboard/          # 43 dashboard pages
│   │   ├── outbound/       # AI cold email generator
│   │   ├── competitor/     # Competitive warfare scanner
│   │   ├── studio/         # AI video synthesis
│   │   ├── status/         # System health dashboard
│   │   ├── audit/          # Full audit trail
│   │   └── ...
│   ├── docs/               # Feature documentation
│   ├── onboarding/         # Client onboarding wizard
│   └── pricing/            # Pricing tiers
├── components/             # Shared UI components
│   ├── ErrorBoundary.tsx   # Global crash recovery
│   ├── SkeletonLoader.tsx  # Loading state system
│   └── ui/                 # Design system
├── db/                     # Drizzle ORM + Neon Postgres
├── lib/                    # Utilities (rate-limit, memory, etc.)
├── agents/                 # AI agent configurations
└── types/                  # TypeScript type definitions
```

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router, Turbopack) |
| Language | TypeScript 5.9 |
| Styling | Tailwind CSS 4 |
| Auth | Clerk |
| Database | Neon Postgres + Drizzle ORM |
| AI Engine | Google Gemini 2.5 Pro |
| Payments | Stripe, PayFast (ZAR), PayPal |
| Real-time | Pusher |
| Analytics | Vercel Analytics + Speed Insights |
| 3D/Visuals | Three.js + React Three Fiber |
| Animations | Framer Motion |
| Deployment | Vercel (auto-deploy from `main`) |

## Quick Start

```bash
# Clone and install
git clone https://github.com/your-org/sovereign-v2.git
cd sovereign-v2
npm install

# Configure environment
cp .env.example .env.local
# Fill in your API keys (see .env.example for all required vars)

# Run database migrations
npx drizzle-kit push

# Start development server
npm run dev
```

## Environment Variables

Copy `.env.example` to `.env.local` and fill in:

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | ✅ | Neon Postgres connection string |
| `CLERK_SECRET_KEY` | ✅ | Clerk authentication |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | ✅ | Clerk public key |
| `GOOGLE_GENERATIVE_AI_API_KEY` | ✅ | Gemini AI engine |
| `STRIPE_SECRET_KEY` | 💰 | Stripe payments |
| `PAYFAST_MERCHANT_ID` | 🇿🇦 | PayFast ZAR payments |
| `RESEND_API_KEY` | 📧 | Email delivery |
| `TELEGRAM_BOT_TOKEN` | 📱 | Commander notifications |

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/health` | GET | System health check with latency metrics |
| `/api/monitor/self-heal` | GET | Self-healing diagnostics |
| `/api/stripe/checkout` | POST | Create Stripe checkout session |
| `/api/payfast/checkout` | POST | Create PayFast ZAR checkout |
| `/api/email/send` | POST | Send branded emails |
| `/api/swarm/outbound` | POST | Generate AI cold emails |
| `/api/swarm/competitor/scan` | POST | Competitive analysis |

## Deployment

Automatically deploys to Vercel on push to `main`:

```bash
git add .
git commit -m "your changes"
git push origin main
# → Vercel auto-deploys in ~60 seconds
```

## License

Proprietary. All rights reserved.
