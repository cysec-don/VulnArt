# 🎨 Vuln Art Shop — Complete CTF Training Guide

**Created & Produced by Cysec Don** | cysecdon@gmail.com

---

## Table of Contents

1. [Introduction](#introduction)
2. [What is Vuln Art Shop?](#what-is-vuln-art-shop)
3. [Learning Objectives](#learning-objectives)
4. [Environment Setup](#environment-setup)
5. [Getting Started — Your First Flag](#getting-started)
6. [Tier-by-Tier Walkthrough Methodology](#tier-by-tier-methodology)
7. [Tool Guide](#tool-guide)
8. [Vulnerability Categories Explained](#vulnerability-categories)
9. [Attack Methodology](#attack-methodology)
10. [Scoring System](#scoring-system)
11. [Learning Path](#learning-path)
12. [For Instructors](#for-instructors)
13. [Reset & Troubleshooting](#reset--troubleshooting)

---

## Introduction

Welcome to **Vuln Art Shop**, a Capture-The-Flag (CTF) training platform created and produced by **Cysec Don**. This guide will walk you through everything you need to know about the platform, from initial setup to advanced exploitation techniques.

Vuln Art Shop is unique because it doesn't look like a CTF challenge. It looks like a real, polished SaaS product — a modern art marketplace where you can browse, buy, rent, and auction artworks. But beneath the elegant surface lies a carefully designed vulnerability landscape waiting to be discovered.

**The core philosophy**: Real vulnerabilities don't come with labels. In the real world, you won't find a flashing sign that says "SQL Injection here!" You have to explore, test, and think like an attacker. Vuln Art Shop trains you to do exactly that.

---

## What is Vuln Art Shop?

Vuln Art Shop operates on two distinct levels:

### The Surface: Art Marketplace

On the surface, Vuln Art Shop is a fully functional art marketplace with:

- **50 artworks** across five categories (Classical, Modern, Cyberpunk, Abstract, Realistic)
- **Purchase system** — Buy artworks with virtual currency
- **Rental system** — Rent artworks by the day
- **Auction system** — Live bidding with countdown timers
- **User profiles** — Track purchases, rentals, and bids
- **Dark/light mode** — Smooth, professional UI
- **Responsive design** — Works on mobile, tablet, and desktop

Every feature works exactly as expected. You can register, browse, buy, rent, bid, and manage your collection. The marketplace is not a shell — it's a real application.

### The Hidden Layer: CTF Lab

Beneath the marketplace lies a deep CTF environment with:

- **18 flags** across 4 difficulty tiers (Easy, Medium, Hard, Expert)
- **10-level nested directory** structure with hidden files containing clues and credentials
- **3 virtual hosts** (admin, dev, staging) only discoverable through enumeration
- **20+ API endpoints** with realistic vulnerabilities
- **6 test accounts** including 2 hidden admin accounts
- **Hidden admin panel** accessible only through discovery

The key insight: **Nothing is labeled**. There are no hints in the UI, no "challenge" pages, no difficulty indicators. You discover vulnerabilities the same way real security researchers do — through observation, exploration, and testing.

---

## Learning Objectives

By completing all challenges in Vuln Art Shop, you will learn:

### 🟢 Beginner Skills
- **Information Gathering**: How to inspect web pages, view source code, and read robots.txt
- **Basic Enumeration**: Discovering hidden paths and files through simple observation
- **HTTP Basics**: Understanding request/response cycles, headers, and cookies

### 🟡 Intermediate Skills
- **Directory Fuzzing**: Using tools like ffuf and gobuster to discover hidden endpoints
- **API Testing**: Using curl, Burp Suite, and browser dev tools to test API behavior
- **Parameter Manipulation**: Modifying request parameters to test input validation
- **Business Logic Testing**: Finding flaws in application logic (pricing, bidding, rentals)
- **IDOR (Insecure Direct Object Reference)**: Exploiting improper access controls

### 🔴 Advanced Skills
- **Privilege Escalation**: Chaining IDOR vulnerabilities to gain admin access
- **Virtual Host Enumeration**: Discovering subdomains and internal services
- **Error-Based Information Disclosure**: Extracting data from error messages
- **Multi-Step Exploitation**: Combining multiple vulnerabilities in sequence

### ⚫ Expert Skills
- **Full Attack Chain Methodology**: Combining every discovery into a complete compromise
- **Cross-System Exploitation**: Chaining vulnerabilities across different virtual hosts
- **Persistence and Documentation**: Maintaining access and documenting findings

---

## Environment Setup

Vuln Art Shop can be installed directly on your system or deployed with Docker. **Direct installation is the recommended and fastest method.** For detailed instructions, see [INSTALL.md](INSTALL.md).

### Method 1: Direct Install (Recommended — 2 minutes)

#### Prerequisites

| Requirement | Version | Install |
|-------------|---------|---------|
| **Node.js** | 20+ | [nodejs.org](https://nodejs.org) or `nvm install 20` |
| **Bun** (recommended) | Latest | `curl -fsSL https://bun.sh/install \| bash` |
| **npm** (alternative) | 9+ | Comes with Node.js |
| **Browser** | Chrome/Firefox | Latest |

#### Setup

```bash
# 1. Clone the repository
git clone https://github.com/cysec-don/VulnArt.git
cd VulnArt

# 2. Install dependencies
bun install

# 3. Initialize the database
bun run db:push
bunx prisma db seed

# 4. Start the server
bun run dev
```

Open **http://localhost:3000** in your browser. Login with `artist1` / `password123`.

> This gives you access to **15 out of 18 flags** immediately. The remaining 3 flags require virtual host setup (see Method 2 below).

### Method 2: Direct Install + Virtual Hosts (Full Experience — 10 minutes)

Adds Nginx reverse proxy and virtual host services for all 18 flags.

```bash
# After completing Method 1 above:

# 1. Add vhost entries to /etc/hosts
sudo nano /etc/hosts
# Add: 127.0.0.1  vulnart.local admin.vulnart.local dev.vulnart.local staging.vulnart.local

# 2. Install Nginx
sudo apt install nginx

# 3. Copy Nginx configuration
sudo cp docker/nginx/nginx.conf /etc/nginx/nginx.conf
sudo mkdir -p /etc/nginx/conf.d /etc/nginx/vhosts
sudo cp docker/nginx/conf.d/main.conf /etc/nginx/conf.d/
sudo cp docker/nginx/vhosts/*.conf /etc/nginx/vhosts/
sudo nginx -t && sudo systemctl restart nginx

# 4. Start vhost services
./scripts/start-vhosts.sh start
```

Now access via virtual hosts: `http://vulnart.local`, `http://admin.vulnart.local`, `http://dev.vulnart.local`, `http://staging.vulnart.local`

### Method 3: Docker Install (Alternative — 5 minutes)

For containerized deployment with everything included. Best for classroom environments.

#### Prerequisites

| Requirement | Version |
|-------------|---------|
| **Docker** | v20.10+ |
| **Docker Compose** | v2.0+ |
| **RAM** | 4GB+ |

#### Setup

```bash
# 1. Clone and deploy
git clone https://github.com/cysec-don/VulnArt.git
cd VulnArt/docker
docker-compose up -d --build

# 2. Configure /etc/hosts (same as Method 2, step 1)

# 3. Wait ~30 seconds, then verify
curl -I http://vulnart.local
```

### Install CTF Tools (All Methods)

```bash
# ffuf - Directory and vhost fuzzing
go install github.com/ffuf/ffuf/v2@latest

# gobuster - Alternative directory brute-forcer
go install github.com/OJ/gobuster/v3@latest

# jq - JSON processing
sudo apt install jq

# nmap - Network scanning
sudo apt install nmap
```

---

## Getting Started — Your First Flag

Once the platform is running, follow these steps to capture your first flag:

### Step 1: Open the Main Site

Navigate to `http://vulnart.local` in your browser. You'll see the Vuln Art Shop home page — a beautiful art marketplace.

### Step 2: View the Page Source

Right-click anywhere on the page and select **"View Page Source"** (or press `Ctrl+U` / `Cmd+Option+U`).

### Step 3: Look for Comments

Scroll through the HTML source code. Look for HTML comments (text between `<!--` and `-->`). Developers often leave notes, debugging information, or — in this case — something interesting.

### Step 4: Submit Your First Flag

Once you find the flag (format: `FLAG{...}`), you can submit it:

1. Register an account on the platform
2. Navigate to your **Profile** page
3. Click the **Rewards** tab
4. Enter the flag and submit

**Congratulations!** You've captured your first flag and learned one of the most fundamental skills in web security testing: **always inspect the source code**.

---

## Tier-by-Tier Methodology

### 🟢 Easy Tier — "The Observer"

**Mindset**: Look before you leap. The web is full of information if you know where to look.

**Skills Practiced**:
- Page source inspection
- robots.txt analysis
- HTTP header examination
- Following leads from one discovery to the next

**Approach**:
1. Start by visiting every page and viewing the source
2. Check `/robots.txt` — it tells search engines what NOT to index
3. Follow every path mentioned in robots.txt
4. Examine HTTP response headers (use browser dev tools Network tab)
5. Look for comments, hidden fields, and metadata

**What You'll Discover**:
- HTML comments containing flags or credentials
- Exposed `.env` file with sensitive configuration
- A hidden admin panel path

**Key Lesson**: Information is everywhere. Developers leave traces in comments, configuration files, and HTTP headers. A thorough observer can learn a tremendous amount without any special tools.

---

### 🟡 Medium Tier — "The Explorer"

**Mindset**: Use tools to go deeper. Fuzz directories, test parameters, and question every input.

**Skills Practiced**:
- Directory and file enumeration with ffuf/gobuster
- API endpoint discovery
- Parameter manipulation (IDOR, business logic)
- File discovery and analysis
- Using curl for API testing

**Approach**:
1. **Fuzz directories**: Use ffuf to discover hidden paths
   ```bash
   ffuf -u http://vulnart.local/FUZZ -w /usr/share/wordlists/dirb/common.txt
   ```

2. **Test API endpoints**: Once you find `/api/`, enumerate sub-paths
   ```bash
   ffuf -u http://vulnart.local/api/FUZZ -w api-wordlist.txt
   ```

3. **Manipulate parameters**: Test every input field and API parameter
   - What happens if you send a negative number?
   - What happens if you modify the request body?
   - Can you change your user role?

4. **Analyze discovered files**: Read every file you find — they may contain credentials, flags, or clues for the next step

**Vulnerabilities You'll Find**:
- 10-level nested directory structure with hidden files
- Debug and internal API endpoints without authentication
- Exposed backup files (SQL dumps, credential CSVs)
- IDOR in profile update (can change your role to admin)
- No minimum bid validation on auctions
- No rental duration validation

**Key Lesson**: Web applications have a much larger attack surface than what's visible in the UI. APIs, files, and parameters that aren't properly protected can reveal sensitive information or allow unauthorized actions.

---

### 🔴 Hard Tier — "The Chain Builder"

**Mindset**: One vulnerability is interesting. Combining vulnerabilities is powerful.

**Skills Practiced**:
- Privilege escalation through vulnerability chaining
- Virtual host enumeration
- Error-based information disclosure
- Multi-step attack chains
- Cross-system exploitation

**Approach**:
1. **Chain IDOR to admin access**:
   - Use the IDOR vulnerability to change your role to admin
   - Access admin-only endpoints with your elevated privileges

2. **Enumerate virtual hosts**:
   ```bash
   ffuf -u http://vulnart.local -H "Host: FUZZ.vulnart.local" -w vhost-wordlist.txt
   ```
   - Look for different response sizes or status codes
   - Each vhost has unique content and flags

3. **Test API error handling**:
   - Send malformed requests to search endpoints
   - Error messages may reveal database structure or flags

4. **Connect the dots**:
   - Information from one vulnerability helps exploit another
   - Credentials found in one place may work elsewhere
   - API documentation on one vhost reveals endpoints on another

**Key Lesson**: Real-world attacks rarely involve a single vulnerability. Attackers chain multiple low-severity issues into high-impact exploits. Learning to think in chains is what separates good testers from great ones.

---

### ⚫ Expert Tier — "The Master"

**Mindset**: The whole is greater than the sum of its parts. Only by understanding the entire system can you reach the final flag.

**Skills Practiced**:
- Complete attack chain methodology
- Cross-vhost exploitation
- Combining every previous discovery
- Documentation and persistence

**Approach**:
The expert flag requires combining discoveries from ALL previous tiers:

1. Start with basic enumeration (Easy tier techniques)
2. Discover hidden files and API endpoints (Medium tier)
3. Chain vulnerabilities for privilege escalation (Hard tier)
4. Enumerate virtual hosts for additional information
5. Use credentials and hints found across all layers
6. Access the final hidden admin panel with proper context
7. Combine everything to reveal the master flag

**The Chain**:
```
Page Source → robots.txt → Hidden Files → Credentials → 
IDOR Escalation → Admin Endpoints → Vhost Discovery → 
Dev/Staging Info → backup_admin → Master Admin Panel → Expert Flag
```

**Key Lesson**: The most impactful security findings come from understanding how different parts of a system interconnect. Master the whole system, not just individual vulnerabilities.

---

## Tool Guide

### Browser Developer Tools

The most important tool is already in your browser:

| Tool | Purpose | Access |
|------|---------|--------|
| Elements tab | Inspect HTML, find comments | F12 → Elements |
| Network tab | View HTTP requests/responses | F12 → Network |
| Console | Run JavaScript, check errors | F12 → Console |
| Application tab | View cookies, local storage | F12 → Application |
| Security tab | Check certificates, headers | F12 → Security |

### curl — HTTP Swiss Army Knife

```bash
# Basic GET request
curl http://vulnart.local

# View response headers
curl -I http://vulnart.local

# Send POST with JSON body
curl -X POST http://vulnart.local/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"artist1","password":"password123"}'

# Include cookies
curl -b "vulnart_session=YOUR_TOKEN" http://vulnart.local/api/users/profile

# Test virtual host
curl -H "Host: admin.vulnart.local" http://vulnart.local
```

### ffuf — Fuzzing Tool

```bash
# Directory enumeration
ffuf -u http://vulnart.local/FUZZ -w common.txt

# API endpoint enumeration
ffuf -u http://vulnart.local/api/FUZZ -w api-words.txt

# Virtual host enumeration
ffuf -u http://vulnart.local -H "Host: FUZZ.vulnart.local" -w subdomains.txt

# File extension fuzzing
ffuf -u http://vulnart.local/hidden/FUZZ -w words.txt -e .txt,.csv,.json,.sql,.env
```

### jq — JSON Processor

```bash
# Pretty-print API responses
curl -s http://vulnart.local/api/artworks | jq .

# Extract specific fields
curl -s http://vulnart.local/api/admin/users | jq '.users[] | {username, role}'

# Search for flags in JSON
curl -s http://vulnart.local/api/debug/env | jq '.environment | to_entries[] | select(.value | tostring | contains("FLAG"))'
```

---

## Vulnerability Categories

### 1. Information Disclosure

**What it is**: Sensitive information exposed to unauthorized users.

**Where to find it in Vuln Art Shop**:
- HTML comments with flags or credentials
- robots.txt revealing hidden paths
- HTTP headers revealing server technology
- `.env` files accessible via web
- Debug endpoints leaking environment variables
- Error messages revealing database structure

**How to test for it**:
- Always view page source
- Check robots.txt, sitemap.xml, .htaccess
- Examine HTTP response headers
- Look for backup files (.bak, .old, .sql)
- Test for common config file paths (.env, config.json, web.config)

### 2. Broken Access Control (IDOR)

**What it is**: Users can access resources or perform actions they shouldn't be able to.

**Where to find it in Vuln Art Shop**:
- Profile update endpoint accepts `role` parameter
- Admin API endpoints have no authentication
- Internal endpoints are publicly accessible
- Data export requires no authorization

**How to test for it**:
- Modify URL parameters and path segments
- Add unexpected fields to request bodies
- Test API endpoints without authentication
- Try accessing admin functions as a regular user

### 3. Business Logic Flaws

**What it is**: Application logic allows unintended actions.

**Where to find it in Vuln Art Shop**:
- Bid endpoint accepts zero or negative amounts
- Rental endpoint accepts extreme duration values
- Balance can go negative through manipulation

**How to test for it**:
- Test boundary values (0, -1, MAX_INT)
- Bypass client-side validation with curl/Burp
- Test race conditions on time-sensitive operations
- Question assumptions (can I bid $0? rent for 9999 days?)

### 4. Security Misconfiguration

**What it is**: Default or insecure configurations left in production.

**Where to find it in Vuln Art Shop**:
- Debug mode enabled in production
- Stack traces visible in error responses
- Default credentials in use
- Unnecessary services exposed (dev, staging)
- Directory listing or file serving enabled

**How to test for it**:
- Check for default credentials
- Look for development/staging environments
- Test error handling with malformed input
- Verify security headers are present

### 5. Virtual Host Discovery

**What it is**: Multiple websites hosted on the same server, some not publicly known.

**Where to find it in Vuln Art Shop**:
- admin.vulnart.local — Admin-only interface
- dev.vulnart.local — Development environment with debug info
- staging.vulnart.local — Staging environment with API docs

**How to test for it**:
- Enumerate subdomains with ffuf, gobuster, or subfinder
- Check DNS records for the domain
- Use certificate transparency logs
- Test common subdomain names (admin, dev, staging, test, api)

---

## Attack Methodology

### The 5-Step Approach

When approaching any web application for security testing, follow this methodology:

#### Step 1: Reconnaissance
- View all pages and their source code
- Check robots.txt, sitemap.xml
- Examine HTTP headers
- Note all forms, inputs, and interactive elements
- Map the application's functionality

#### Step 2: Enumeration
- Fuzz directories and files
- Discover API endpoints
- Identify all user roles and access levels
- Find hidden parameters and options
- Map the complete attack surface

#### Step 3: Testing
- Test each input for validation issues
- Check access controls for every endpoint
- Manipulate parameters and observe responses
- Test business logic for edge cases
- Try common attack patterns (injection, IDOR, etc.)

#### Step 4: Exploitation
- Chain discovered vulnerabilities
- Escalate privileges when possible
- Access restricted areas and data
- Document every step of your attack chain

#### Step 5: Documentation
- Record every finding with evidence
- Document the attack chain used
- Note any decoys or false leads
- Calculate your total score

---

## Scoring System

| Tier | Flags | Points Each | Total | % of Total |
|------|-------|-------------|-------|-----------|
| 🟢 Easy | 3 | 100-150 | 400 | 8.1% |
| 🟡 Medium | 8 | 200-300 | 1,800 | 36.4% |
| 🔴 Hard | 5 | 400-500 | 2,100 | 42.4% |
| ⚫ Expert | 1 | 1,000 | 1,000 | 20.2% |
| **Total** | **18** | — | **4,950** | **100%** |

### Rating Scale

| Points | Rating | Description |
|--------|--------|-------------|
| 0-400 | 🔰 Novice | You've learned the basics of web inspection |
| 400-1,000 | 🌱 Beginner | You can use basic tools and follow leads |
| 1,000-2,200 | 🌿 Intermediate | You understand common vulnerabilities |
| 2,200-3,950 | 🌳 Advanced | You can chain vulnerabilities effectively |
| 3,950-4,950 | 🏆 Expert | You've mastered the entire attack chain |

---

## Learning Path

### Week 1: Fundamentals (Easy Tier)
- Learn about HTTP, HTML, and web application basics
- Practice page source inspection
- Understand robots.txt and its security implications
- Learn to use browser developer tools effectively
- **Goal**: Capture all 3 easy flags

### Week 2-3: Tools & Techniques (Medium Tier)
- Learn directory fuzzing with ffuf/gobuster
- Practice API testing with curl and Postman
- Study common vulnerability types (IDOR, misconfigurations)
- Learn about business logic testing
- **Goal**: Capture all 8 medium flags

### Week 4-5: Advanced Exploitation (Hard Tier)
- Study privilege escalation techniques
- Learn virtual host enumeration
- Practice vulnerability chaining
- Study error-based information disclosure
- **Goal**: Capture all 5 hard flags

### Week 6+: Master Level (Expert Tier)
- Practice complete attack chain methodology
- Combine all discoveries across the platform
- Document your complete attack path
- **Goal**: Capture the expert flag

---

## For Instructors

### Lab Setup

1. **Direct install** (recommended for most classrooms):
   ```bash
   git clone https://github.com/cysec-don/VulnArt.git
   cd VulnArt
   bun install && bun run db:push && bunx prisma db seed
   bun run dev
   ```
2. For full virtual host experience, add Nginx and vhost services (see [INSTALL.md](INSTALL.md))
3. Ensure all virtual hosts are configured in students' `/etc/hosts` (Method 2/3 only)
4. Distribute only the `CTF_TRAINING_GUIDE.md` — keep `INSTRUCTOR_FLAG_GUIDE.md` private
5. Recommended lab duration: 6-8 weeks for complete curriculum

### Student Management

- Students should register their own accounts
- The flag submission system tracks progress automatically
- Use `GET /api/internal/stats` to monitor submissions (or check the database)
- The `INSTRUCTOR_FLAG_GUIDE.md` contains complete solutions

### Assessment Ideas

- **Progress-based**: Grade by number of flags captured
- **Write-up based**: Require detailed attack documentation
- **Presentation-based**: Students demonstrate their findings
- **Team-based**: Groups compete for highest total score

### Hints Policy

| Tier | Hint Policy |
|------|------------|
| 🟢 Easy | No hints — these should be discoverable by inspection |
| 🟡 Medium | One hint per flag after 30 minutes of struggle |
| 🔴 Hard | One hint per flag after 1 hour of struggle |
| ⚫ Expert | No hints — the challenge is in the chaining |

### Reset Options

```bash
# Direct install: full lab reset (clears all student data)
rm -f prisma/dev.db && bun run db:push && bunx prisma db seed

# Docker: full lab reset
cd docker && docker-compose down -v && docker-compose up -d --build
```

---

## Reset & Troubleshooting

### Direct Install Reset

```bash
# Reset the database (clears all user data)
rm -f prisma/dev.db
bun run db:push
bunx prisma db seed

# Alternative
npx prisma migrate reset --force
```

### Docker Reset

```bash
cd docker
docker-compose down -v
docker-compose up -d --build
```

### Common Issues

| Issue | Solution |
|-------|----------|
| `bun: command not found` | Install: `curl -fsSL https://bun.sh/install \| bash` |
| `node: command not found` | Install: `nvm install 20` |
| Port 3000 in use | `lsof -i :3000` then `kill -9 <PID>` |
| Port 80 in use | Stop Apache/Nginx: `sudo systemctl stop apache2` |
| Can't access vhosts | Verify `/etc/hosts` entries, flush DNS cache |
| 502 Bad Gateway | Wait for web container to fully start (30s) |
| Database errors | Reset: `rm -f prisma/dev.db && bun run db:push && bunx prisma db seed` |
| Missing artworks | Re-seed: `bunx prisma db seed` or `bunx tsx prisma/seed.ts` |
| Seed fails | `bunx tsx prisma/seed.ts` (run manually) |
| Nginx won't start | `sudo nginx -t` to test config |

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

## Contact & Support

Created and produced by **Cysec Don**

📧 Email: cysecdon@gmail.com
🔗 GitHub: [github.com/cysec-don](https://github.com/cysec-don)
📂 Repository: [github.com/cysec-don/VulnArt](https://github.com/cysec-don/VulnArt)

For questions, feedback, or collaboration opportunities, please reach out via email.

---

<p align="center">
  <strong>Remember: The best hackers are the ones who never stop asking "What if?"</strong>
  <br/><br/>
  <em>Created with ❤️ by Cysec Don</em>
</p>
