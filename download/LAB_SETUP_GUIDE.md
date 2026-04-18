# 🎨 Vuln Art Shop - CTF Lab Setup Guide

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Quick Start](#quick-start)
3. [Host Configuration](#host-configuration)
4. [Docker Deployment](#docker-deployment)
5. [Accessing the Platform](#accessing-the-platform)
6. [Virtual Hosts](#virtual-hosts)
7. [Resetting the Lab](#resetting-the-lab)
8. [Troubleshooting](#troubleshooting)

---

## Prerequisites

- **Docker** (v20.10+)
- **Docker Compose** (v2.0+)
- **4GB RAM** minimum (8GB recommended)
- **10GB disk space**
- A modern web browser (Chrome/Firefox recommended)
- Network tools: `nmap`, `curl`, `ffuf` or `gobuster` (for CTF participants)

---

## Quick Start

```bash
# 1. Clone or navigate to the project
cd vuln-art-shop

# 2. Configure /etc/hosts (see below)

# 3. Build and start all containers
cd docker
docker-compose up -d --build

# 4. Wait for services to initialize (about 30 seconds)
docker-compose logs -f web

# 5. Access the platform
# Main site: http://vulnart.local
```

---

## Host Configuration

### Linux / macOS

Edit `/etc/hosts`:

```bash
sudo nano /etc/hosts
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

### Windows

Edit `C:\Windows\System32\drivers\etc\hosts` as Administrator and add the same entries.

### Verification

Test that hosts are configured correctly:

```bash
curl -I http://vulnart.local
curl -I http://admin.vulnart.local
curl -I http://dev.vulnart.local
curl -I http://staging.vulnart.local
```

Each should return different `X-Powered-By` headers.

---

## Docker Deployment

### Building

```bash
cd docker
docker-compose build
```

### Starting

```bash
# Start all services
docker-compose up -d

# Start specific service
docker-compose up -d web postgres nginx

# Check status
docker-compose ps
```

### Service Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Nginx (Port 80)                       │
│  Routes requests based on Host header to vhosts         │
├─────────────┬──────────────┬──────────────┬─────────────┤
│ vulnart.local│admin.vulnart │dev.vulnart   │staging.     │
│  → web:3000  │.local        │.local        │vulnart.local│
│              │ → admin:3001  │ → dev:3002   │→ staging:   │
│              │              │              │   3003      │
├─────────────┴──────────────┴──────────────┴─────────────┤
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

## Accessing the Platform

### Main Site
- URL: `http://vulnart.local`
- Description: The art marketplace front-end
- Default test account: `artist1` / `password123`

### Admin Panel (Hidden)
- URL: `http://vulnart.local/admin-panel-x7k9`
- Description: Hidden admin panel (not linked from navigation)
- Requires: Admin session or direct access

### Virtual Hosts (Discoverable)

| VHost | URL | Discovery Method |
|-------|-----|------------------|
| Admin | `http://admin.vulnart.local` | DNS/vhost enumeration |
| Dev | `http://dev.vulnart.local` | DNS/vhost enumeration |
| Staging | `http://staging.vulnart.local` | DNS/vhost enumeration |

---

## Virtual Hosts

### admin.vulnart.local
- Port: 3001
- Features: System status, user list, admin flags
- Header: `X-Powered-By: VulnArt-Admin/2.0.0`
- Contains: `FLAG{vh0st_3num3r4t10n_w1n}`

### dev.vulnart.local
- Port: 3002
- Features: Environment variables, API docs, DB schema, debug info
- Header: `X-Powered-By: VulnArt-Dev/0.9.0-beta`
- Contains: `FLAG{d3v_vh0st_3xp0s3d}`

### staging.vulnart.local
- Port: 3003
- Features: API documentation, test accounts, DB schema
- Header: `X-Powered-By: VulnArt-Staging/1.0.0-rc1`
- Contains: `FLAG{st4g1ng_3nv_fl4g}`

### Discovering Virtual Hosts

Participants can discover vhosts using:

```bash
# Using curl with Host header
curl -H "Host: admin.vulnart.local" http://vulnart.local

# Using ffuf for vhost enumeration
ffuf -u http://vulnart.local -H "Host: FUZZ.vulnart.local" -w vhost-wordlist.txt

# Using nmap
nmap -p 80 --script http-vhosts vulnart.local
```

---

## Resetting the Lab

### Full Reset

```bash
# Stop and remove all containers, volumes, and networks
cd docker
docker-compose down -v

# Rebuild and restart
docker-compose up -d --build
```

### Database Only Reset

```bash
# Reset the database
docker-compose exec web npx prisma migrate reset --force

# Re-seed the database
docker-compose exec web npx prisma db seed
```

### Quick Reset (Preserves Config)

```bash
# Restart all containers
docker-compose restart

# Restart specific service
docker-compose restart web
```

### Clean Slate

```bash
# Remove everything including images
docker-compose down -v --rmi all

# Start fresh
docker-compose up -d --build
```

---

## Troubleshooting

### Port Conflicts

If port 80 is already in use:

```bash
# Check what's using port 80
sudo lsof -i :80

# Stop the conflicting service
sudo systemctl stop apache2  # or nginx, etc.
```

### Container Won't Start

```bash
# Check logs
docker-compose logs web
docker-compose logs postgres

# Restart specific container
docker-compose restart web
```

### Database Connection Issues

```bash
# Verify PostgreSQL is running
docker-compose exec postgres pg_isready -U vulnart

# Check connection from web container
docker-compose exec web nc -zv postgres 5432
```

### Virtual Hosts Not Working

1. Verify `/etc/hosts` entries are correct
2. Clear browser DNS cache
3. Try: `curl -v http://admin.vulnart.local`

```bash
# Flush DNS cache (macOS)
sudo dscacheutil -flushcache
sudo killall -HUP mDNSResponder

# Flush DNS cache (Linux)
sudo systemd-resolve --flush-caches
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
| DirBuster | Directory enumeration | `apt install dirbuster` |
| wfuzz | Web fuzzer | `pip install wfuzz` |

---

## Lab Duration & Difficulty

| Tier | Estimated Time | Skills Tested |
|------|---------------|---------------|
| 🟢 Easy | 1-2 hours | Basic enumeration, inspection |
| 🟡 Medium | 3-5 hours | Tool usage, API testing, parameter manipulation |
| 🔴 Hard | 5-8 hours | Multi-step chaining, vhost enumeration, privilege escalation |
| ⚫ Expert | 8-12 hours | Full system compromise, multi-layer chaining |
