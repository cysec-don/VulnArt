<p align="center">
  <img src="public/logo.svg" alt="Vuln Art Shop" width="80" height="80" />
  <h1 align="center">🎨 Vuln Art Shop</h1>
  <p align="center"><strong>A CTF Training Platform Disguised as a Modern Art Marketplace</strong></p>
  <p align="center">
    <img src="https://img.shields.io/badge/Platform-CTF_Training-amber?style=for-the-badge" alt="CTF Platform" />
    <img src="https://img.shields.io/badge/Flags-18_Total-9B59B6?style=for-the-badge" alt="18 Flags" />
    <img src="https://img.shields.io/badge/Difficulty-Beginner_to_Expert-e74c3c?style=for-the-badge" alt="Difficulty Range" />
    <img src="https://img.shields.io/badge/License-MIT-2ecc71?style=for-the-badge" alt="License" />
  </p>
</p>

---

## 🏆 Credits

| Role | Name | Contact |
|------|------|---------|
| **Creator & Producer** | **Cysec Don** | cysecdon@gmail.com |
| Concept & Architecture | Cysec Don | cysecdon@gmail.com |
| CTF Challenge Design | Cysec Don | cysecdon@gmail.com |
| Full-Stack Development | Cysec Don | cysecdon@gmail.com |
| Security Lab Design | Cysec Don | cysecdon@gmail.com |
| Documentation & Guides | Cysec Don | cysecdon@gmail.com |

> **Vuln Art Shop** was created and produced by **Cysec Don** as an educational cybersecurity training platform. All intellectual property, challenge designs, and architectural decisions are the work of Cysec Don.

---

## 📖 About

**Vuln Art Shop** is a production-quality Capture-The-Flag (CTF) training platform that operates on two levels:

1. **Surface Layer**: A beautiful, minimalistic art marketplace where users can browse, buy, rent, and auction artworks — just like a real SaaS product.
2. **Hidden Layer**: A deeply layered CTF lab environment with 18 flags across 4 difficulty tiers, hidden endpoints, virtual hosts, and vulnerability chains waiting to be discovered.

The platform is designed to teach cybersecurity concepts through **realistic, hands-on exploration** — not through explicit labels or walkthroughs. Beginners see a clean art shop; intermediate users find hidden flaws; advanced users chain vulnerabilities across the system.

---

## ⚠️ Disclaimer

> **This platform is designed exclusively for educational and authorized cybersecurity training purposes.** All vulnerabilities are intentionally placed in an isolated environment. Do NOT apply techniques learned here against systems you do not own or have explicit authorization to test. The creator, Cysec Don, assumes no liability for misuse of this training material.

---

## 🎯 Platform Overview

### What You See (Art Marketplace)
- 🖼️ **60 artworks** across 6 categories: Classical, Modern, Cyberpunk, Abstract, Realistic, African
- 💰 **Buy system** — Purchase artworks with virtual currency
- 🕐 **Rent system** — Time-based artwork rentals
- 🏛️ **Auction system** — Live bidding with countdown timers
- 👤 **User profiles** — Purchase history, rental tracking, bid management
- 🌗 **Dark/Light mode** — Smooth theme transitions
- 📱 **Responsive design** — Mobile-first, works on all devices

### What's Hidden (CTF Lab)
- 🟢 **Easy Flags (3)** — Found via basic inspection and enumeration
- 🟡 **Medium Flags (8)** — Require tool usage and parameter manipulation
- 🔴 **Hard Flags (5)** — Multi-step chaining and virtual host enumeration
- ⚫ **Expert Flag (1)** — Full system compromise across all layers
- 📁 **10-level nested directory** system with hidden files
- 🌐 **3 virtual hosts** discoverable via DNS enumeration
- 🔓 **20+ vulnerable API endpoints** with realistic weaknesses

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Nginx (Port 80)                       │
│          Routes requests based on Host header            │
├──────────────┬───────────────┬──────────────┬───────────┤
│ vulnart.local│admin.vulnart  │dev.vulnart   │staging.   │
│  → web:3000  │.local         │.local        │vulnart.   │
│              │ → admin:3001  │ → dev:3002   │local      │
│              │               │              │→ stag:3003│
├──────────────┴───────────────┴──────────────┴───────────┤
│                PostgreSQL / SQLite                        │
│                    Shared Database                        │
└─────────────────────────────────────────────────────────┘
```

### Technology Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 16, React 19, TypeScript 5 |
| Styling | Tailwind CSS 4, shadcn/ui, Framer Motion |
| Backend | Next.js API Routes, Prisma ORM |
| Database | SQLite (default) / PostgreSQL (optional) |
| Auth | Session-based with httpOnly cookies |
| Proxy | Nginx with virtual host routing (optional) |
| Runtime | Node.js 20+ or Bun |

---

## 🚀 Installation

Vuln Art Shop can be installed directly on your system or deployed with Docker. **Direct installation is the recommended method** — Docker is provided as an alternative for containerized environments.

### Method 1: Direct Install (Recommended)

This is the simplest and fastest way to get Vuln Art Shop running on your machine.

#### Prerequisites

| Requirement | Version | Install |
|-------------|---------|---------|
| **Node.js** | 20+ | [nodejs.org](https://nodejs.org) or `nvm install 20` |
| **Bun** (recommended) | Latest | `curl -fsSL https://bun.sh/install \| bash` |
| **npm** (alternative) | 9+ | Comes with Node.js |
| **Git** | Latest | `apt install git` or [git-scm.com](https://git-scm.com) |

#### Step 1: Clone & Install

```bash
git clone https://github.com/cysec-don/VulnArt.git
cd VulnArt

# Install dependencies (use bun for speed, or npm)
bun install
# — or —
npm install
```

#### Step 2: Set Up the Database

```bash
# Generate Prisma client and create the database
bun run db:push
# — or —
npx prisma db push

# Seed the database with 60 artworks and test accounts
bunx prisma db seed
# — or —
npx prisma db seed
```

#### Step 3: Start the Server

```bash
# Development mode (hot reload)
bun run dev
# — or —
npm run dev

# Production mode
bun run build && bun run start
# — or —
npm run build && npm run start
```

#### Step 4: Access the Platform

Open your browser and navigate to:

| URL | Description |
|-----|-------------|
| **http://localhost:3000** | Main art marketplace |
| http://localhost:3000/admin-panel-x7k9 | Hidden admin panel |
| http://localhost:3000/robots.txt | robots.txt (CTF entry point) |

#### Step 5: Start Exploring!

1. Register an account or log in with: `artist1` / `password123`
2. Begin your CTF journey by inspecting the page source 👀

> 💡 **Tip**: The core CTF experience (15 out of 18 flags) works perfectly on `localhost:3000` without any additional setup. The remaining 3 flags require virtual host configuration (see below).

---

### Method 2: Docker Install (Alternative)

Docker provides a containerized deployment with full virtual host support out of the box. Use this method if you want the complete multi-container experience with Nginx and vhost routing.

#### Prerequisites

| Requirement | Version |
|-------------|---------|
| **Docker** | v20.10+ |
| **Docker Compose** | v2.0+ |
| **RAM** | 4GB minimum (8GB recommended) |
| **Disk Space** | 10GB |

#### Step 1: Clone & Deploy

```bash
git clone https://github.com/cysec-don/VulnArt.git
cd VulnArt

# Build and start all containers
cd docker
docker-compose up -d --build
```

#### Step 2: Configure Hosts File

Edit `/etc/hosts` (Linux/macOS) or `C:\Windows\System32\drivers\etc\hosts` (Windows):

```
# Vuln Art Shop CTF Lab
127.0.0.1  vulnart.local
127.0.0.1  www.vulnart.local
127.0.0.1  admin.vulnart.local
127.0.0.1  dev.vulnart.local
127.0.0.1  staging.vulnart.local
```

#### Step 3: Access the Platform

Wait ~30 seconds for services to initialize, then visit `http://vulnart.local`.

---

### Method 3: Direct Install + Virtual Hosts (Full Experience)

For the complete CTF experience with all 18 flags on a bare-metal install, add Nginx as a reverse proxy for virtual host routing.

#### Prerequisites (in addition to Method 1)

| Requirement | Install |
|-------------|---------|
| **Nginx** | `sudo apt install nginx` or [nginx.org](https://nginx.org) |

#### Step 1: Complete Method 1 first

Follow all steps in Method 1 to get the app running on `localhost:3000`.

#### Step 2: Configure Hosts File

```bash
sudo nano /etc/hosts
```

Add:
```
# Vuln Art Shop CTF Lab
127.0.0.1  vulnart.local
127.0.0.1  www.vulnart.local
127.0.0.1  admin.vulnart.local
127.0.0.1  dev.vulnart.local
127.0.0.1  staging.vulnart.local
```

#### Step 3: Start the VHOST Services

The virtual host services are standalone Node.js servers included in the `docker/` directory. Run them alongside the main app:

```bash
# Terminal 1: Main app (already running from Method 1)
bun run dev

# Terminal 2: Admin vhost
node docker/Dockerfile.admin-vhost  # Extract and run the embedded server
# — or use the standalone scripts —
cd docker && node -e "require('fs').readFileSync('Dockerfile.admin-vhost','utf8').match(/COPY <<'EOF' ([\\s\\S]*?)EOF/)"
```

Alternatively, use the provided vhost start script:

```bash
# Start all vhost services (from project root)
bash scripts/start-vhosts.sh
```

#### Step 4: Configure Nginx

Copy the provided Nginx configuration:

```bash
# Copy Nginx configs
sudo cp docker/nginx/nginx.conf /etc/nginx/nginx.conf
sudo cp -r docker/nginx/conf.d /etc/nginx/conf.d
sudo cp -r docker/nginx/vhosts /etc/nginx/vhosts

# Test and restart Nginx
sudo nginx -t
sudo systemctl restart nginx
```

#### Step 5: Access All Services

| Service | URL |
|---------|-----|
| Main Site | http://vulnart.local |
| Admin VHOST | http://admin.vulnart.local |
| Dev VHOST | http://dev.vulnart.local |
| Staging VHOST | http://staging.vulnart.local |

---

## 📋 Installation Comparison

| Feature | Direct Install | Direct + VHOSTs | Docker |
|---------|---------------|-----------------|--------|
| **Setup Time** | ~2 minutes | ~10 minutes | ~5 minutes |
| **Difficulty** | Easy | Moderate | Easy |
| **Flags Available** | 15/18 | 18/18 | 18/18 |
| **Virtual Hosts** | ❌ | ✅ | ✅ |
| **Resource Usage** | Low | Low-Medium | Medium-High |
| **Best For** | Quick start, learning | Complete CTF | Classrooms, labs |
| **Requires Docker** | ❌ | ❌ | ✅ |
| **Requires Nginx** | ❌ | ✅ | ❌ (included) |

> 💡 **Recommendation**: Start with **Method 1 (Direct Install)** to begin exploring immediately. Add virtual hosts later when you're ready for the hard-tier vhost flags.

---

## 🐳 Docker Services (Method 2 Reference)

| Container | Port | Purpose |
|-----------|------|---------|
| `vulnart-web` | 3000 | Main Next.js application |
| `vulnart-postgres` | 5432 | PostgreSQL database |
| `vulnart-nginx` | 80 | Reverse proxy + vhost routing |
| `vulnart-admin-vhost` | 3001 | Admin virtual host |
| `vulnart-dev-vhost` | 3002 | Development virtual host |
| `vulnart-staging-vhost` | 3003 | Staging virtual host |

---

## 👥 Test Accounts

| Username | Password | Role | How to Discover |
|----------|----------|------|-----------------|
| `artist1` | `password123` | user | Easy to guess / staging docs |
| `collector_jane` | `jane2024` | premium | Staging docs |
| `artlover99` | `loveart` | user | credentials.csv file |
| `curator_mike` | `m1k3curat0r` | admin | HTML source comment |
| `dev_test` | `devtest123` | user | Staging docs |
| `backup_admin` | `bkp@dm1n!` | admin | Hidden in files/logs |

---

## 🧩 CTF Flag Tiers

### 🟢 Easy Flags (Entry-Level)

These flags teach basic enumeration and inspection skills. No special tools required — just a browser and curiosity.

| # | Points | Discovery Method |
|---|--------|-----------------|
| 1 | 100 | View page source on the home page |
| 2 | 150 | Check robots.txt, then visit the exposed .env file |
| 3 | 150 | Follow robots.txt leads to a hidden admin panel |

### 🟡 Medium Flags (Tool-Assisted)

These flags require basic security tools (curl, ffuf, browser dev tools) and an understanding of web application vulnerabilities.

| # | Points | Discovery Method |
|---|--------|-----------------|
| 4 | 300 | Navigate through 10 levels of nested hidden directories |
| 5 | 200 | Access a debug endpoint that leaks environment variables |
| 6 | 200 | Access an internal stats endpoint with sensitive data |
| 7 | 200 | Discover a backup SQL dump file |
| 8 | 200 | Find exposed credentials in a CSV file |
| 9 | 250 | Exploit an IDOR vulnerability in profile updates |
| 10 | 250 | Manipulate auction bid amounts (business logic flaw) |
| 11 | 250 | Exploit unvalidated rental duration parameter |
| 14 | 200 | Access an unauthenticated data export endpoint |

### 🔴 Hard Flags (Multi-Step Chaining)

These flags require chaining multiple vulnerabilities and discoveries together. Virtual host enumeration is key.

| # | Points | Discovery Method |
|---|--------|-----------------|
| 12 | 500 | Chain IDOR + admin endpoint access |
| 13 | 400 | Trigger injection-like error in search API |
| 15 | 400 | Discover admin.vulnart.local virtual host |
| 16 | 400 | Discover dev.vulnart.local virtual host |
| 17 | 400 | Discover staging.vulnart.local virtual host |

### ⚫ Expert Flag (Final Boss)

| # | Points | Discovery Method |
|---|--------|-----------------|
| 18 | 1000 | Multi-layer chaining across auth, hidden files, virtual hosts, and admin panel |

**Total Points Available: 4,950**

---

## 🔍 Vulnerability Map

```
┌─────────────────────────────────────────────────┐
│                   SURFACE LEVEL                  │
│  robots.txt → .env, /hidden/, /admin-panel-x7k9 │
│  HTML source → comments with credentials/flags  │
│  HTTP headers → X-Powered-By information leak   │
├─────────────────────────────────────────────────┤
│                  DIRECTORY LEVEL                 │
│  /hidden/ → 10-level nested files → flag        │
│  /secret-files/ → credentials.csv               │
│  /backup/ → db-backup.sql                       │
├─────────────────────────────────────────────────┤
│                    API LEVEL                     │
│  /api/debug/env → environment variables         │
│  /api/internal/stats → system info + logs       │
│  /api/admin/users → no auth, all users          │
│  /api/v1/export → data export without auth      │
│  /api/v2/search → injection-like behavior       │
├─────────────────────────────────────────────────┤
│                BUSINESS LOGIC LEVEL              │
│  PUT /api/users/profile → role IDOR             │
│  POST /api/marketplace/bid → no min validation  │
│  POST /api/marketplace/rent → no days limit     │
├─────────────────────────────────────────────────┤
│                 VIRTUAL HOST LEVEL               │
│  admin.vulnart.local → admin panel + flag       │
│  dev.vulnart.local → env vars, debug info       │
│  staging.vulnart.local → API docs, accounts     │
├─────────────────────────────────────────────────┤
│                  CHAINING LEVEL                  │
│  IDOR → admin → /api/admin/flags → vhost hints  │
│  vhost discovery → credentials → backup_admin   │
│  All combined → /admin-panel-x7k9 → master flag │
└─────────────────────────────────────────────────┘
```

---

## 🛠️ Recommended Tools

| Tool | Purpose | Install |
|------|---------|---------|
| Burp Suite | Web proxy & testing | [burpsuite.com](https://burpsuite.com) |
| ffuf | Directory/vhost fuzzing | `go install github.com/ffuf/ffuf/v2@latest` |
| gobuster | Directory brute-force | `go install github.com/OJ/gobuster/v3@latest` |
| nmap | Port scanning & enumeration | `apt install nmap` |
| curl | HTTP requests | Pre-installed |
| jq | JSON processing | `apt install jq` |

---

## 🔄 Resetting the Lab

### Direct Install

```bash
# Reset the database (clears all user data, restores seed data)
rm db/custom.db
bun run db:push
bunx prisma db seed

# — or —
npx prisma migrate reset --force
```

### Docker Install

```bash
# Full reset (removes all data)
cd docker
docker-compose down -v
docker-compose up -d --build

# Quick restart (preserves data)
docker-compose restart

# Database only reset
docker-compose exec web npx prisma migrate reset --force
```

---

## 📂 Project Structure

```
VulnArt/
├── src/
│   ├── app/
│   │   ├── page.tsx                    # Home page
│   │   ├── layout.tsx                  # Root layout + theme
│   │   ├── gallery/page.tsx            # Art gallery
│   │   ├── artwork/[id]/page.tsx       # Artwork detail
│   │   ├── auctions/page.tsx           # Live auctions
│   │   ├── login/page.tsx              # Login form
│   │   ├── register/page.tsx           # Registration form
│   │   ├── profile/page.tsx            # User profile + flag submit
│   │   ├── admin-panel-x7k9/page.tsx   # Hidden admin panel
│   │   └── api/
│   │       ├── auth/                   # Authentication routes
│   │       ├── artworks/               # Artwork CRUD
│   │       ├── marketplace/            # Buy, rent, auction, bid
│   │       ├── users/                  # Profile, purchases, rentals
│   │       ├── admin/                  # Admin endpoints (no auth)
│   │       ├── internal/               # Internal stats endpoint
│   │       ├── debug/                  # Debug env endpoint
│   │       ├── v1/                     # Export API
│   │       ├── v2/                     # Search API
│   │       └── flags/                  # Flag submission
│   ├── components/
│   │   ├── ui/                         # shadcn/ui components
│   │   ├── header.tsx                  # Navigation header
│   │   ├── artwork-card.tsx            # Artwork display card
│   │   ├── artwork-grid.tsx            # Responsive grid layout
│   │   ├── auction-card.tsx            # Auction display card
│   │   ├── auth-form.tsx               # Login/register forms
│   │   ├── flag-submit-form.tsx        # CTF flag submission
│   │   └── theme-provider.tsx          # Dark/light mode
│   ├── lib/
│   │   ├── auth.ts                     # Session & password utils
│   │   ├── db.ts                       # Prisma client
│   │   └── utils.ts                    # Utility functions
│   ├── store/
│   │   └── auth-store.ts               # Zustand auth state
│   └── proxy.ts                       # Proxy (middleware) + info disclosure headers
├── prisma/
│   ├── schema.prisma                   # Database models
│   └── seed.ts                         # 60 artworks + test users
├── public/
│   ├── robots.txt                      # CTF: exposes hidden paths
│   ├── .env                            # CTF: leaked environment
│   ├── hidden/                         # CTF: 10-level nested dirs
│   ├── secret-files/credentials.csv    # CTF: credential dump
│   ├── backup/db-backup.sql            # CTF: database backup
│   └── logo.svg                        # App logo
├── docker/
│   ├── Dockerfile                      # Main web app
│   ├── Dockerfile.admin-vhost          # Admin vhost service
│   ├── Dockerfile.dev-vhost            # Dev vhost service
│   ├── Dockerfile.staging-vhost        # Staging vhost service
│   ├── docker-compose.yml              # Multi-container setup
│   ├── init-db.sql                     # Database initialization
│   └── nginx/
│       ├── nginx.conf                  # Main Nginx config
│       ├── conf.d/main.conf            # vulnart.local routing
│       └── vhosts/
│           ├── admin.conf              # admin.vulnart.local
│           ├── dev.conf                # dev.vulnart.local
│           └── staging.conf            # staging.vulnart.local
├── scripts/
│   └── start-vhosts.sh                 # Start vhost services (bare-metal)
├── docs/
│   ├── INSTALL.md                      # Detailed installation guide
│   ├── CTF_TRAINING_GUIDE.md           # Complete training guide
│   ├── LAB_SETUP_GUIDE.md              # Lab setup for classrooms
│   └── INSTRUCTOR_FLAG_GUIDE.md        # Flag reference (🔒 only)
└── README.md                           # This file
```

---

## 📜 License

This project is created and produced by **Cysec Don** (cysecdon@gmail.com).

Licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

---

## 🤝 Acknowledgments

- **Concept, Design & Development**: Cysec Don
- **CTF Challenge Architecture**: Cysec Don
- **Security Lab Design**: Cysec Don
- **Documentation & Training Materials**: Cysec Don

---

<p align="center">
  <strong>Clean. Elegant. Dangerous (in a controlled way).</strong>
  <br/><br/>
  Created with ❤️ by <a href="mailto:cysecdon@gmail.com">Cysec Don</a>
</p>
