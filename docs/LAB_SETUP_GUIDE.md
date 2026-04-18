# 🎨 Vuln Art Shop - CTF Lab Setup Guide

**Created & Produced by Cysec Don** | cysecdon@gmail.com

---

## Table of Contents

1. [Installation Methods](#installation-methods)
2. [Method 1: Direct Install (Recommended)](#method-1-direct-install)
3. [Method 2: Direct Install + Virtual Hosts](#method-2-direct-install--virtual-hosts)
4. [Method 3: Docker Install (Alternative)](#method-3-docker-install)
5. [Host Configuration](#host-configuration)
6. [Verifying the Lab](#verifying-the-lab)
7. [Resetting the Lab](#resetting-the-lab)
8. [Troubleshooting](#troubleshooting)

---

## Installation Methods

| Method | Flags | Setup Time | Best For |
|--------|-------|------------|----------|
| **1. Direct Install** | 15/18 | ~2 min | Solo learners, quick start |
| **2. Direct + VHOSTs** | 18/18 | ~10 min | Complete CTF experience |
| **3. Docker** | 18/18 | ~5 min | Classrooms, labs, teams |

> See [INSTALL.md](INSTALL.md) for the most detailed installation instructions.

---

## Method 1: Direct Install

The simplest and fastest way to get started. No Docker needed.

### Prerequisites

- **Node.js** 20+ — [nodejs.org](https://nodejs.org)
- **Bun** (recommended) or **npm** — included with Node.js
- **Git** — [git-scm.com](https://git-scm.com)

### Setup

```bash
# Clone
git clone https://github.com/cysec-don/VulnArt.git
cd VulnArt

# Install dependencies
bun install

# Initialize database
bun run db:push
bunx prisma db seed

# Start the server
bun run dev
```

### Access

Open **http://localhost:3000** in your browser. Login with `artist1` / `password123`.

This gives you access to 15 out of 18 flags. The remaining 3 flags (virtual host discovery) require Method 2 or 3.

---

## Method 2: Direct Install + Virtual Hosts

Full CTF experience on bare metal with all 18 flags.

### Step 1: Complete Method 1

Follow all steps above. Verify `http://localhost:3000` works.

### Step 2: Configure Hosts File

Edit `/etc/hosts` (Linux/macOS) or `C:\Windows\System32\drivers\etc\hosts` (Windows):

```
# Vuln Art Shop CTF Lab
127.0.0.1  vulnart.local
127.0.0.1  www.vulnart.local
127.0.0.1  admin.vulnart.local
127.0.0.1  dev.vulnart.local
127.0.0.1  staging.vulnart.local
```

### Step 3: Install & Configure Nginx

```bash
# Install Nginx
sudo apt install nginx    # Linux
brew install nginx         # macOS

# Copy configuration files
sudo cp docker/nginx/nginx.conf /etc/nginx/nginx.conf
sudo mkdir -p /etc/nginx/conf.d /etc/nginx/vhosts
sudo cp docker/nginx/conf.d/main.conf /etc/nginx/conf.d/
sudo cp docker/nginx/vhosts/admin.conf /etc/nginx/vhosts/
sudo cp docker/nginx/vhosts/dev.conf /etc/nginx/vhosts/
sudo cp docker/nginx/vhosts/staging.conf /etc/nginx/vhosts/

# Test and restart
sudo nginx -t
sudo systemctl restart nginx
```

### Step 4: Start VHOST Services

```bash
# Start all vhost services
./scripts/start-vhosts.sh start

# Check status
./scripts/start-vhosts.sh status
```

### Step 5: Verify

```bash
curl -I http://vulnart.local          # X-Powered-By: VulnArt/1.0.0
curl -I http://admin.vulnart.local    # X-Powered-By: VulnArt-Admin/2.0.0
curl -I http://dev.vulnart.local      # X-Powered-By: VulnArt-Dev/0.9.0-beta
curl -I http://staging.vulnart.local  # X-Powered-By: VulnArt-Staging/1.0.0-rc1
```

---

## Method 3: Docker Install

Containerized deployment with all services included.

### Prerequisites

- **Docker** (v20.10+)
- **Docker Compose** (v2.0+)
- **4GB RAM** minimum

### Setup

```bash
git clone https://github.com/cysec-don/VulnArt.git
cd VulnArt/docker
docker-compose up -d --build
```

Configure hosts file (same as Method 2, Step 2), then access `http://vulnart.local`.

### Service Architecture

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

### Container Ports

| Container | Internal Port | External Port | Purpose |
|-----------|--------------|---------------|---------|
| nginx | 80 | 80 | Reverse proxy |
| web | 3000 | 3000 | Main application |
| admin-vhost | 3001 | - | Admin virtual host |
| dev-vhost | 3002 | - | Dev virtual host |
| staging-vhost | 3003 | - | Staging virtual host |
| postgres | 5432 | 5432 | Database |

---

## Host Configuration

### Linux / macOS

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

### Windows

Open `C:\Windows\System32\drivers\etc\hosts` as Administrator and add the same entries.

### DNS Cache Flush

```bash
# macOS
sudo dscacheutil -flushcache && sudo killall -HUP mDNSResponder

# Linux
sudo systemd-resolve --flush-caches

# Windows
ipconfig /flushdns
```

---

## Verifying the Lab

### Quick Health Check (All Methods)

```bash
# Is the server running?
curl -s http://localhost:3000/api/artworks | jq '.artworks | length'
# Expected: 50

# Can you access the main page?
curl -s http://localhost:3000 | head -20
```

### Virtual Host Verification (Method 2/3 only)

```bash
# Each vhost should return different X-Powered-By headers
curl -I http://vulnart.local
curl -I http://admin.vulnart.local
curl -I http://dev.vulnart.local
curl -I http://staging.vulnart.local
```

### Full Checklist

- [ ] Home page loads (localhost:3000 or vulnart.local)
- [ ] Gallery shows 60 artworks
- [ ] Registration and login work
- [ ] robots.txt accessible
- [ ] Hidden .env file accessible
- [ ] Admin panel at /admin-panel-x7k9
- [ ] (VHOST only) admin.vulnart.local responds
- [ ] (VHOST only) dev.vulnart.local responds
- [ ] (VHOST only) staging.vulnart.local responds

---

## Resetting the Lab

### Direct Install (Method 1 & 2)

```bash
# Reset the database
rm -f prisma/dev.db
bun run db:push
bunx prisma db seed

# Restart vhost services (Method 2 only)
./scripts/start-vhosts.sh restart
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
curl -fsSL https://bun.sh/install | bash && source ~/.bashrc
```

### "node: command not found"
```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
source ~/.bashrc && nvm install 20
```

### Port 3000 in use
```bash
lsof -i :3000 && kill -9 <PID>
# Or use a different port:
PORT=3001 bun run dev
```

### Nginx won't start
```bash
sudo nginx -t                    # Test config
sudo lsof -i :80                 # Check for conflicts
sudo systemctl stop apache2      # Stop Apache if running
sudo systemctl restart nginx     # Restart Nginx
```

### Virtual hosts not working
1. Verify `/etc/hosts` entries
2. Flush DNS cache (see above)
3. Verify vhost services are running: `./scripts/start-vhosts.sh status`
4. Test directly: `curl http://localhost:3001` (admin vhost)

### Docker container won't start
```bash
cd docker
docker-compose logs web          # Check logs
docker-compose restart web       # Restart
docker-compose down -v && docker-compose up -d --build  # Full rebuild
```

### Database seed fails
```bash
rm -f prisma/dev.db
bun run db:push
bunx tsx prisma/seed.ts          # Run seed manually
```

---

## Recommended Tools for CTF Participants

| Tool | Purpose | Install |
|------|---------|---------|
| Burp Suite | Web proxy & testing | [burpsuite.com](https://burpsuite.com) |
| ffuf | Directory/vhost fuzzing | `go install github.com/ffuf/ffuf/v2@latest` |
| gobuster | Directory brute-force | `go install github.com/OJ/gobuster/v3@latest` |
| nmap | Port scanning & enumeration | `apt install nmap` |
| curl | HTTP requests | Pre-installed |
| jq | JSON processing | `apt install jq` |

---

## Lab Duration & Difficulty

| Tier | Estimated Time | Skills Tested |
|------|---------------|---------------|
| 🟢 Easy | 1-2 hours | Basic enumeration, inspection |
| 🟡 Medium | 3-5 hours | Tool usage, API testing, parameter manipulation |
| 🔴 Hard | 5-8 hours | Multi-step chaining, vhost enumeration, privilege escalation |
| ⚫ Expert | 8-12 hours | Full system compromise, multi-layer chaining |
