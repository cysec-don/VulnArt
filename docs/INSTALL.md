# 🎨 Vuln Art Shop — Installation Guide

**Created & Produced by Cysec Don** | cysecdon@gmail.com

---

## Table of Contents

1. [Installation Methods Overview](#overview)
2. [Method 1: Direct Install (Recommended)](#method-1-direct-install)
3. [Method 2: Direct Install + Virtual Hosts (Full Experience)](#method-2-direct-install--virtual-hosts)
4. [Method 3: Docker Install (Alternative)](#method-3-docker-install)
5. [Verifying Your Installation](#verifying-your-installation)
6. [Resetting the Lab](#resetting-the-lab)
7. [Troubleshooting](#troubleshooting)
8. [Upgrading](#upgrading)

---

## Installation Methods Overview

| | Direct Install | Direct + VHOSTs | Docker |
|---|---------------|-----------------|--------|
| **Setup Time** | ~2 min | ~10 min | ~5 min |
| **Difficulty** | Easy | Moderate | Easy |
| **Flags Available** | 15/18 | 18/18 | 18/18 |
| **Requires Docker** | No | No | Yes |
| **Requires Nginx** | No | Yes | No (included) |
| **Best For** | Quick start, solo learning | Complete CTF experience | Classrooms, labs |
| **Resource Usage** | Low | Low-Medium | Medium-High |

> 💡 **Recommendation**: Start with **Method 1** to begin exploring immediately. You can always upgrade to Method 2 or 3 later.

---

## Method 1: Direct Install

The fastest way to get Vuln Art Shop running. Works on Linux, macOS, and Windows. No Docker needed.

### Prerequisites

| Requirement | Version | How to Install |
|-------------|---------|---------------|
| **Node.js** | 20+ | [nodejs.org](https://nodejs.org) or via nvm |
| **Bun** (recommended) | Latest | `curl -fsSL https://bun.sh/install \| bash` |
| **npm** (alternative) | 9+ | Included with Node.js |
| **Git** | Latest | Package manager or [git-scm.com](https://git-scm.com) |

### Installing Node.js

If you don't have Node.js yet:

```bash
# Using nvm (recommended)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
source ~/.bashrc
nvm install 20
nvm use 20

# Using apt (Ubuntu/Debian)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Using Homebrew (macOS)
brew install node@20

# Windows: Download from https://nodejs.org
```

### Step 1: Clone the Repository

```bash
git clone https://github.com/cysec-don/VulnArt.git
cd VulnArt
```

### Step 2: Install Dependencies

```bash
# Using Bun (faster, recommended)
bun install

# Using npm (alternative)
npm install
```

### Step 3: Initialize the Database

```bash
# Create database schema and generate Prisma client
bun run db:push

# Seed the database with 60 artworks and 6 test accounts
bunx prisma db seed
```

If the seed command doesn't work automatically, you can run it manually:

```bash
bunx tsx prisma/seed.ts
# — or —
npx tsx prisma/seed.ts
```

### Step 4: Start the Development Server

```bash
# Development mode (with hot reload)
bun run dev

# Production mode (optimized, faster)
bun run build
bun run start
```

### Step 5: Access the Platform

Open your browser and navigate to:

| URL | Description |
|-----|-------------|
| **http://localhost:3000** | Main art marketplace |
| http://localhost:3000/gallery | Art gallery |
| http://localhost:3000/auctions | Live auctions |
| http://localhost:3000/robots.txt | CTF entry point |
| http://localhost:3000/admin-panel-x7k9 | Hidden admin panel |

### Default Login

- **Username**: `artist1`
- **Password**: `password123`

### What Works Without VHOSTs

On a direct install, you have access to **15 out of 18 flags** including:

- ✅ All 3 Easy flags (page source, robots.txt, hidden admin panel)
- ✅ All 8 Medium flags (hidden files, API endpoints, IDOR, business logic)
- ✅ 2 Hard flags (admin flags view, search injection)
- ❌ 3 Hard flags (virtual host discovery — requires Method 2 or 3)
- ✅ Expert flag (accessible via chaining non-vhost discoveries)

The virtual host flags can be simulated by accessing the vhost content directly through the main app's API endpoints, though the full vhost experience requires Method 2 or 3.

---

## Method 2: Direct Install + Virtual Hosts

This method adds Nginx as a reverse proxy with virtual host routing on top of a bare-metal install. You get all 18 flags.

### Prerequisites (in addition to Method 1)

| Requirement | How to Install |
|-------------|---------------|
| **Nginx** | `sudo apt install nginx` (Linux) or `brew install nginx` (macOS) |

### Step 1: Complete Method 1 First

Follow all steps in Method 1. Make sure `http://localhost:3000` works.

### Step 2: Configure Your Hosts File

**Linux/macOS:**
```bash
sudo nano /etc/hosts
```

**Windows (Run as Administrator):**
```
notepad C:\Windows\System32\drivers\etc\hosts
```

Add these entries:
```
# Vuln Art Shop CTF Lab
127.0.0.1  vulnart.local
127.0.0.1  www.vulnart.local
127.0.0.1  admin.vulnart.local
127.0.0.1  dev.vulnart.local
127.0.0.1  staging.vulnart.local
```

### Step 3: Start the Virtual Host Services

The vhost services are lightweight Node.js servers. Start them using the provided script:

```bash
# Make the script executable
chmod +x scripts/start-vhosts.sh

# Start all vhost services (runs in background)
./scripts/start-vhosts.sh start

# Check status
./scripts/start-vhosts.sh status

# Stop all vhost services
./scripts/start-vhosts.sh stop
```

Or start them manually in separate terminals:

```bash
# Terminal 1: Main app
bun run dev

# Terminal 2: Admin vhost (port 3001)
node scripts/vhost-admin.js

# Terminal 3: Dev vhost (port 3002)
node scripts/vhost-dev.js

# Terminal 4: Staging vhost (port 3003)
node scripts/vhost-staging.js
```

### Step 4: Configure Nginx

```bash
# Copy the Nginx configuration files
sudo cp docker/nginx/nginx.conf /etc/nginx/nginx.conf
sudo mkdir -p /etc/nginx/conf.d /etc/nginx/vhosts
sudo cp docker/nginx/conf.d/main.conf /etc/nginx/conf.d/
sudo cp docker/nginx/vhosts/admin.conf /etc/nginx/vhosts/
sudo cp docker/nginx/vhosts/dev.conf /etc/nginx/vhosts/
sudo cp docker/nginx/vhosts/staging.conf /etc/nginx/vhosts/

# Test the configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
# — or on macOS —
brew services restart nginx
```

### Step 5: Verify Everything Works

```bash
# Test main site
curl -I http://vulnart.local
# Should show: X-Powered-By: VulnArt/1.0.0

# Test admin vhost
curl -I http://admin.vulnart.local
# Should show: X-Powered-By: VulnArt-Admin/2.0.0

# Test dev vhost
curl -I http://dev.vulnart.local
# Should show: X-Powered-By: VulnArt-Dev/0.9.0-beta

# Test staging vhost
curl -I http://staging.vulnart.local
# Should show: X-Powered-By: VulnArt-Staging/1.0.0-rc1
```

### Access All Services

| Service | URL | Description |
|---------|-----|-------------|
| Main Site | http://vulnart.local | Art marketplace |
| Admin VHOST | http://admin.vulnart.local | Admin panel (discover via enumeration) |
| Dev VHOST | http://dev.vulnart.local | Debug info (discover via enumeration) |
| Staging VHOST | http://staging.vulnart.local | API docs (discover via enumeration) |

---

## Method 3: Docker Install

For containerized deployment with everything included. Best for classroom environments.

### Prerequisites

| Requirement | Version | How to Install |
|-------------|---------|---------------|
| **Docker** | v20.10+ | [docker.com](https://docs.docker.com/get-docker/) |
| **Docker Compose** | v2.0+ | Included with Docker Desktop |
| **RAM** | 4GB+ | — |
| **Disk Space** | 10GB+ | — |

### Step 1: Clone & Deploy

```bash
git clone https://github.com/cysec-don/VulnArt.git
cd VulnArt/docker
docker-compose up -d --build
```

### Step 2: Configure Hosts File

Same as Method 2, Step 2 — add the vhost entries to `/etc/hosts`.

### Step 3: Verify

```bash
docker-compose ps
curl -I http://vulnart.local
```

### Docker Service Architecture

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
│                PostgreSQL (Port 5432)                    │
│              Shared database: vulnart                    │
└─────────────────────────────────────────────────────────┘
```

| Container | Port | Purpose |
|-----------|------|---------|
| `vulnart-web` | 3000 | Main Next.js application |
| `vulnart-postgres` | 5432 | PostgreSQL database |
| `vulnart-nginx` | 80 | Reverse proxy + vhost routing |
| `vulnart-admin-vhost` | 3001 | Admin virtual host |
| `vulnart-dev-vhost` | 3002 | Development virtual host |
| `vulnart-staging-vhost` | 3003 | Staging virtual host |

---

## Verifying Your Installation

After installation, run these checks:

### Quick Health Check

```bash
# Is the server running?
curl -s http://localhost:3000/api/artworks | head -c 100

# Are artworks seeded?
curl -s http://localhost:3000/api/artworks | jq '.artworks | length'
# Expected: 60

# Is the database working?
curl -s http://localhost:3000/api/internal/stats | jq '.stats'
```

### Full Verification Checklist

- [ ] Home page loads at http://localhost:3000
- [ ] Gallery page shows artworks
- [ ] Registration works (create a new account)
- [ ] Login works with `artist1` / `password123`
- [ ] Profile page loads after login
- [ ] Auctions page shows active auctions
- [ ] robots.txt accessible at http://localhost:3000/robots.txt
- [ ] Hidden .env file accessible at http://localhost:3000/.env
- [ ] Hidden admin panel at http://localhost:3000/admin-panel-x7k9

### Virtual Host Verification (Method 2/3 only)

- [ ] http://vulnart.local returns `X-Powered-By: VulnArt/1.0.0`
- [ ] http://admin.vulnart.local returns different content
- [ ] http://dev.vulnart.local returns different content
- [ ] http://staging.vulnart.local returns different content

---

## Resetting the Lab

### Direct Install (Method 1 & 2)

```bash
# Full database reset
rm -f prisma/dev.db
bun run db:push
bunx prisma db seed

# Alternative using Prisma
npx prisma migrate reset --force

# Stop vhost services (Method 2 only)
./scripts/start-vhosts.sh stop
./scripts/start-vhosts.sh start
```

### Docker Install (Method 3)

```bash
cd docker

# Full reset (removes all data)
docker-compose down -v
docker-compose up -d --build

# Quick restart (preserves data)
docker-compose restart

# Database only reset
docker-compose exec web npx prisma migrate reset --force
```

---

## Troubleshooting

### "bun: command not found"

```bash
# Install Bun
curl -fsSL https://bun.sh/install | bash
source ~/.bashrc
```

### "node: command not found"

```bash
# Install Node.js via nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
source ~/.bashrc
nvm install 20
```

### Database Seed Fails

```bash
# Reset the database completely
rm -f prisma/dev.db
bun run db:push

# Run seed manually
bunx tsx prisma/seed.ts
```

### Port 3000 Already in Use

```bash
# Find what's using port 3000
lsof -i :3000

# Kill the process
kill -9 <PID>

# Or use a different port
PORT=3001 bun run dev
```

### Nginx Won't Start

```bash
# Test configuration
sudo nginx -t

# Check for conflicting services
sudo lsof -i :80

# Stop Apache if running
sudo systemctl stop apache2

# Restart Nginx
sudo systemctl restart nginx
```

### Virtual Hosts Not Working

1. Verify `/etc/hosts` entries are correct
2. Flush DNS cache:

```bash
# macOS
sudo dscacheutil -flushcache && sudo killall -HUP mDNSResponder

# Linux
sudo systemd-resolve --flush-caches

# Windows
ipconfig /flushdns
```

3. Verify vhost services are running:

```bash
curl -I http://localhost:3001  # Admin vhost
curl -I http://localhost:3002  # Dev vhost
curl -I http://localhost:3003  # Staging vhost
```

### Docker Container Won't Start

```bash
# Check logs
cd docker
docker-compose logs web
docker-compose logs postgres

# Restart specific container
docker-compose restart web

# Full rebuild
docker-compose down -v
docker-compose up -d --build
```

---

## Upgrading

```bash
# Pull the latest changes
git pull origin main

# Update dependencies
bun install

# Update database schema (if changed)
bun run db:push

# Re-seed if needed
bunx prisma db seed

# Restart the server
bun run dev
```

---

## Need Help?

Created and produced by **Cysec Don** (cysecdon@gmail.com)

- 📧 Email: cysecdon@gmail.com
- 🔗 GitHub: [github.com/cysec-don/VulnArt](https://github.com/cysec-don/VulnArt)

For bug reports and feature requests, please open an issue on GitHub.
