# 🔒 INSTRUCTOR-ONLY: Vuln Art Shop - Flag & Vulnerability Reference

> **WARNING**: This document contains complete solutions. Do NOT distribute to CTF participants.

---

## 📋 Flag Summary

| # | Flag | Tier | Points | Discovery Method |
|---|------|------|--------|-----------------|
| 1 | `FLAG{w3lcome_to_vuln_art}` | 🟢 Easy | 100 | HTML source comment on home page |
| 2 | `FLAG{r0b0ts_txt_g0ldm1ne}` | 🟢 Easy | 150 | Public .env file found via robots.txt |
| 3 | `FLAG{h1dd3n_4dm1n_p4n3l}` | 🟢 Easy | 150 | Accessing /admin-panel-x7k9 (from robots.txt) |
| 4 | `FLAG{d33p_n3st3d_f1l3s_w1n}` | 🟡 Medium | 300 | 10-level nested directory traversal |
| 5 | `FLAG{d3bug_m0d3_l34k}` | 🟡 Medium | 200 | /api/debug/env endpoint |
| 6 | `FLAG{1nt3rn4l_3xp0s3d}` | 🟡 Medium | 200 | /api/internal/stats endpoint |
| 7 | `FLAG{b4ckup_sql_dump}` | 🟡 Medium | 200 | /backup/db-backup.sql file |
| 8 | `FLAG{cr3d3nt14l_dump}` | 🟡 Medium | 200 | /secret-files/credentials.csv file |
| 9 | `FLAG{adm1n_c00k1e_h4ck}` | 🟡 Medium | 250 | Session manipulation / IDOR on profile update |
| 10 | `FLAG{b1d_m4n1pul4t10n}` | 🟡 Medium | 250 | Bidding with zero or negative amounts |
| 11 | `FLAG{r3nt_t1m3_tr4v3l3r}` | 🟡 Medium | 250 | Renting with days > 365 |
| 12 | `FLAG{4dm1n_fl4gs_v1ew}` | 🔴 Hard | 500 | /api/admin/flags endpoint (admin role required) |
| 13 | `FLAG{sql_qu3ry_m4st3r}` | 🔴 Hard | 400 | /api/v2/search injection-like behavior |
| 14 | `FLAG{exp0rt_d4t4_br34ch}` | 🟡 Medium | 200 | /api/v1/export data export endpoint |
| 15 | `FLAG{vh0st_3num3r4t10n_w1n}` | 🔴 Hard | 400 | admin.vulnart.local virtual host discovery |
| 16 | `FLAG{d3v_vh0st_3xp0s3d}` | 🔴 Hard | 400 | dev.vulnart.local virtual host discovery |
| 17 | `FLAG{st4g1ng_3nv_fl4g}` | 🔴 Hard | 400 | staging.vulnart.local virtual host discovery |
| 18 | `FLAG{m4st3r_0f_vuln}` | ⚫ Expert | 1000 | Multi-layer chaining across all systems |

**Total Points Available: 4,950**

---

## 🟢 EASY FLAGS (Entry-Level)

### Flag 1: `FLAG{w3lcome_to_vuln_art}`
- **Tier**: Easy | **Points**: 100
- **Location**: Home page HTML source code
- **How**: Right-click → View Page Source on the home page. Look for HTML comments.
- **Comment found**: `<!-- FLAG{w3lcome_to_vuln_art} -->`
- **Teaches**: Basic page source inspection
- **Hint for students**: "Every web page has more than what meets the eye."

### Flag 2: `FLAG{r0b0ts_txt_g0ldm1ne}`
- **Tier**: Easy | **Points**: 150
- **Location**: `/robots.txt` → `/.env` file
- **How**: Visit `/robots.txt` to discover disallowed paths. One entry is `/.env`. Visit `/.env` to find the flag.
- **Content of .env**: Contains `FLAG=r0b0ts_txt_g0ldm1ne` among other variables
- **Teaches**: robots.txt analysis, information gathering
- **Hint for students**: "Robots tell search engines where NOT to look. Where shouldn't you look?"

### Flag 3: `FLAG{h1dd3n_4dm1n_p4n3l}`
- **Tier**: Easy | **Points**: 150
- **Location**: `/admin-panel-x7k9`
- **How**: robots.txt reveals `/admin-panel-x7k9/` as a disallowed path. Navigate to it directly.
- **Teaches**: Following robots.txt leads to hidden areas
- **Hint for students**: "If it's disallowed, it must be interesting."

---

## 🟡 MEDIUM FLAGS (Tool-Assisted Discovery)

### Flag 4: `FLAG{d33p_n3st3d_f1l3s_w1n}`
- **Tier**: Medium | **Points**: 300
- **Location**: `/hidden/level1/level2/level3/level4/level5/level6/level7/level8/level9/level10/flag.txt`
- **How**: Directory fuzzing with ffuf/gobuster discovers `/hidden/`. Then recursive enumeration through 10 levels.
- **Key files along the way**:
  - `/hidden/notes.txt` - Developer notes with hints about deeper levels
  - `/hidden/level1/hints.txt` - "The path goes deeper..."
  - `/hidden/level1/level2/hints.txt` - "Keep going, you're on the right track"
  - Various clues in each level
  - Final flag in level10/flag.txt
- **Teaches**: Directory enumeration, recursive discovery
- **Hint for students**: "Some treasures are buried deep."

### Flag 5: `FLAG{d3bug_m0d3_l34k}`
- **Tier**: Medium | **Points**: 200
- **Location**: `/api/debug/env`
- **How**: Found via robots.txt disallow entry or directory fuzzing. Accessing this endpoint returns environment variables including the flag.
- **Teaches**: API endpoint discovery, information disclosure
- **Hint for students**: "Developers sometimes leave debug tools accessible."

### Flag 6: `FLAG{1nt3rn4l_3xp0s3d}`
- **Tier**: Medium | **Points**: 200
- **Location**: `/api/internal/stats`
- **How**: Found via robots.txt or API fuzzing. Returns internal system stats including hidden logs.
- **Teaches**: Internal API discovery
- **Hint for students**: "Internal endpoints aren't always properly protected."

### Flag 7: `FLAG{b4ckup_sql_dump}`
- **Tier**: Medium | **Points**: 200
- **Location**: `/backup/db-backup.sql`
- **How**: Found via robots.txt disallow entry or directory enumeration. The SQL dump contains flag hints and credentials.
- **Teaches**: Backup file discovery
- **Hint for students**: "Backups sometimes contain more than intended."

### Flag 8: `FLAG{cr3d3nt14l_dump}`
- **Tier**: Medium | **Points**: 200
- **Location**: `/secret-files/credentials.csv`
- **How**: Found via robots.txt or directory fuzzing. CSV file contains credentials for hidden accounts.
- **Teaches**: Credential file discovery
- **Hint for students**: "Secret files sometimes have straightforward names."

### Flag 9: `FLAG{adm1n_c00k1e_h4ck}`
- **Tier**: Medium | **Points**: 250
- **Location**: User profile update endpoint (IDOR vulnerability)
- **How**: `PUT /api/users/profile` accepts a `role` field in the request body. Send `{"role": "admin"}` to escalate privileges.
- **Exploit steps**:
  1. Login as a normal user (e.g., `artist1` / `password123`)
  2. Send PUT request to `/api/users/profile` with body `{"role": "admin"}`
  3. The response includes the flag
- **Teaches**: IDOR, privilege escalation via API parameter manipulation
- **Hint for students**: "What fields does the profile update accept?"

### Flag 10: `FLAG{b1d_m4n1pul4t10n}`
- **Tier**: Medium | **Points**: 250
- **Location**: Auction bid endpoint
- **How**: `POST /api/marketplace/bid` does not validate minimum bid server-side. Submitting a bid of $0 or a negative amount reveals the flag.
- **Exploit steps**:
  1. Login to any account
  2. Send POST to `/api/marketplace/bid` with `{"auctionId": "<id>", "amount": 0}`
  3. Response includes the flag
- **Teaches**: Business logic validation, parameter tampering
- **Hint for students**: "What's the minimum you can bid?"

### Flag 11: `FLAG{r3nt_t1m3_tr4v3l3r}`
- **Tier**: Medium | **Points**: 250
- **Location**: Artwork rental endpoint
- **How**: `POST /api/marketplace/rent` does not validate the `days` parameter. Setting days to an extreme value (e.g., 999999) reveals the flag.
- **Exploit steps**:
  1. Login to any account
  2. Send POST to `/api/marketplace/rent` with `{"artworkId": "<id>", "days": 999999}`
  3. Response includes the flag
- **Teaches**: Input validation, business logic flaws
- **Hint for students**: "How long can you rent an artwork?"

### Flag 14: `FLAG{exp0rt_d4t4_br34ch}`
- **Tier**: Medium | **Points**: 200
- **Location**: `/api/v1/export?format=json`
- **How**: This endpoint exports all user and artwork data without authentication.
- **Teaches**: Data exposure, API versioning discovery
- **Hint for students**: "v1 APIs sometimes have fewer restrictions than v2."

---

## 🔴 HARD FLAGS (Multi-Step Chaining)

### Flag 12: `FLAG{4dm1n_fl4gs_v1ew}`
- **Tier**: Hard | **Points**: 500
- **Location**: `/api/admin/flags`
- **How**: Requires admin role. Chain the IDOR vulnerability (Flag 9) to escalate to admin, then access this endpoint.
- **Exploit chain**:
  1. Register/login as normal user
  2. Use IDOR on `PUT /api/users/profile` to set role to "admin"
  3. Access `GET /api/admin/flags` which now returns all flags
- **Teaches**: Chaining vulnerabilities, privilege escalation
- **Hint for students**: "What can you see once you're an admin?"

### Flag 13: `FLAG{sql_qu3ry_m4st3r}`
- **Tier**: Hard | **Points**: 400
- **Location**: `/api/v2/search?q=`
- **How**: The search endpoint has a REAL SQL injection vulnerability. The `q` parameter is directly interpolated into a raw SQL query via `$queryRawUnsafe`, allowing UNION-based and error-based SQL injection attacks.
- **Exploit steps** (Error-based reconnaissance):
  1. Access `/api/v2/search?q=test` - normal search results
  2. Try `/api/v2/search?q='` - triggers SQL error revealing table names, columns, and database type
  3. The error response leaks `debugInfo` including table list and column names
- **Exploit steps** (UNION-based data extraction):
  1. Use the error disclosure to learn the schema (11 columns in Artwork table)
  2. Craft a UNION SELECT to extract data from HiddenLog: `/api/v2/search?q=' UNION SELECT id, eventType, message, metadata, '', 0, 0, '', 1, 1, 0 FROM HiddenLog--`
  3. The response includes hidden log entries containing flag hints
  4. When flag-related data is found in results, `FLAG{sql_qu3ry_m4st3r}` is also returned
- **Exploit steps** (Login SQL injection - additional attack surface):
  1. The login endpoint (`POST /api/auth/login`) also uses raw SQL with the username parameter
  2. Auth bypass: `username = "curator_mike'--"` bypasses password verification
  3. Error disclosure: malformed SQL on login returns table/column names
- **sqlmap automation**:
  ```bash
  sqlmap -u 'http://localhost:3000/api/v2/search?q=test' --dbs
  sqlmap -u 'http://localhost:3000/api/v2/search?q=test' -D main -T HiddenLog --dump
  ```
- **Teaches**: Real SQL injection exploitation (UNION-based, error-based, auth bypass), raw query dangers
- **Hint for students**: "What happens when you break the search? Can you make it show data from other tables?"

### Flag 15: `FLAG{vh0st_3num3r4t10n_w1n}`
- **Tier**: Hard | **Points**: 400
- **Location**: `admin.vulnart.local`
- **How**: Discover the admin virtual host through DNS/vhost enumeration.
- **Exploit steps**:
  1. Use ffuf with vhost mode: `ffuf -u http://vulnart.local -H "Host: FUZZ.vulnart.local" -w wordlist.txt`
  2. Discover `admin.vulnart.local`
  3. Access `http://admin.vulnart.local` to find the flag
- **Teaches**: Virtual host enumeration, DNS reconnaissance
- **Hint for students**: "A single server can host multiple websites."

### Flag 16: `FLAG{d3v_vh0st_3xp0s3d}`
- **Tier**: Hard | **Points**: 400
- **Location**: `dev.vulnart.local`
- **How**: Discover the dev virtual host, which exposes environment variables, debug info, and database credentials.
- **Exploit steps**:
  1. Enumerate vhosts (same as Flag 15)
  2. Discover `dev.vulnart.local`
  3. Access the dev environment to find exposed secrets and the flag
- **Teaches**: Development environment exposure
- **Hint for students**: "Developers need debug tools. Sometimes they forget to disable them."

### Flag 17: `FLAG{st4g1ng_3nv_fl4g}`
- **Tier**: Hard | **Points**: 400
- **Location**: `staging.vulnart.local`
- **How**: Discover the staging virtual host, which has API documentation and test credentials.
- **Exploit steps**:
  1. Enumerate vhosts (same as Flag 15)
  2. Discover `staging.vulnart.local`
  3. Access staging to find API docs, test accounts, and the flag
- **Teaches**: Staging environment reconnaissance
- **Hint for students**: "Before production, there's always a staging ground."

---

## ⚫ EXPERT FLAG (Final Boss)

### Flag 18: `FLAG{m4st3r_0f_vuln}`
- **Tier**: Expert | **Points**: 1000
- **Location**: Hidden admin panel `/admin-panel-x7k9` (requires full chaining)
- **How**: This flag requires chaining multiple vulnerabilities across the entire system:
  1. Discover the admin panel via robots.txt
  2. Escalate to admin role via IDOR (Flag 9)
  3. Access /api/admin/flags to get hints about vhosts
  4. Discover virtual hosts (Flags 15-17)
  5. Find the backup_admin credentials in dev/staging vhosts
  6. Login as backup_admin
  7. Access the admin panel with the master flag
- **Exploit chain**:
  1. Start with basic enumeration (robots.txt, page source)
  2. Discover hidden endpoints and files
  3. Find credentials in exposed files
  4. Use IDOR to escalate privileges
  5. Enumerate virtual hosts
  6. Chain discoveries across vhosts
  7. Access the master admin panel
- **Teaches**: Complete attack chain methodology, multi-system exploitation
- **Hint for students**: "The true master connects all the dots."

---

## 👥 Test Accounts Reference

| Username | Password | Role | Discovery Method |
|----------|----------|------|------------------|
| `artist1` | `password123` | user | Listed in staging docs, easy to guess |
| `collector_jane` | `jane2024` | premium | Listed in staging docs |
| `artlover99` | `loveart` | user | Found in credentials.csv |
| `curator_mike` | `m1k3curat0r` | admin | Found in HTML source comment on login page |
| `dev_test` | `devtest123` | user | Listed in staging docs |
| `backup_admin` | `bkp@dm1n!` | admin | Found in hidden logs and dev vhost |

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
│  /api/v2/search → REAL SQL injection (UNION)   │
│  /api/auth/login → SQL injection auth bypass    │
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

## 📊 Scoring Tiers

| Tier | Flags | Total Points | % of Total |
|------|-------|-------------|-----------|
| 🟢 Easy | 3 | 400 | 8.1% |
| 🟡 Medium | 8 | 1,800 | 36.4% |
| 🔴 Hard | 5 | 2,100 | 42.4% |
| ⚫ Expert | 1 | 1,000 | 20.2% |
| **Total** | **18** | **4,950** | **100%** |

---

## 🎓 Suggested Learning Path

### Beginner (Week 1)
1. Learn about robots.txt and page source inspection
2. Find Flags 1, 2, 3 (Easy tier)
3. Practice with curl and browser dev tools

### Intermediate (Week 2-3)
4. Learn directory fuzzing with ffuf/gobuster
5. Find Flags 4-8, 14 (Medium tier - file discovery)
6. Learn about IDOR and parameter manipulation
7. Find Flags 9-11 (Medium tier - business logic)

### Advanced (Week 4-5)
8. Learn about API security testing
9. Find Flags 12-13 (Hard tier - API exploitation)
10. Learn about virtual host enumeration
11. Find Flags 15-17 (Hard tier - vhost discovery)

### Expert (Week 6+)
12. Practice full attack chain methodology
13. Combine all discoveries to find Flag 18 (Expert)
14. Document the complete attack chain
