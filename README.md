# VulnArt — Deliberately Vulnerable Art Auction Platform

VulnArt is an intentionally vulnerable fine art auction web application designed for cybersecurity education, ethical hacking practice, and penetration testing training. Built as an elegant, production-looking Next.js application, it hides real-world security vulnerabilities behind a premium art auction interface — making it an ideal CTF-style training ground that mimics real applications attackers target every day.

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![React](https://img.shields.io/badge/React-19-blue?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss)
![Prisma](https://img.shields.io/badge/Prisma-6-2D3748?logo=prisma)
![SQLite](https://img.shields.io/badge/SQLite-3-003B57?logo=sqlite)
![License](https://img.shields.io/badge/License-MIT-green)

---

## Disclaimer

**This application is intentionally vulnerable and is strictly for educational and authorized security testing purposes only.** Do not deploy this application on public-facing servers. Unauthorized access to computer systems is illegal. Always obtain proper authorization before testing any system's security.

---

## Features

- Premium dark-themed art auction interface with gold accents and smooth animations
- 16 curated AI-generated artworks across diverse styles (Abstract, Surrealism, Classical, Cyberpunk, etc.)
- Fully functional auction-like features: gallery browsing, search, bidding, reviews, provenance verification
- Responsive design with mobile-first approach
- Built with modern stack: Next.js 16, React 19, TypeScript, Tailwind CSS 4, shadcn/ui

---

## Vulnerabilities

VulnArt contains **6 deliberately engineered vulnerabilities**, each disguised behind a realistic feature of the auction platform. These are the same classes of vulnerabilities found in real-world applications across the OWASP Top 10:

| # | Vulnerability | Location | Feature Disguise | Severity |
|---|--------------|----------|-----------------|----------|
| 1 | **SQL Injection** | `/api/login` | Member Login | Critical |
| 2 | **Reflected XSS** | `/api/search` | Search Collection | High |
| 3 | **Stored XSS** | `/api/comments` | Art Reviews | High |
| 4 | **Command Injection** | `/api/ping` | Verify Provenance | Critical |
| 5 | **Path Traversal** | `/api/file` | View Certificates | High |
| 6 | **IDOR** | `/api/user` | Collector Profiles | Medium |

### Detailed Vulnerability Descriptions

#### 1. SQL Injection (Member Login)

The login endpoint constructs SQL queries by directly interpolating user-supplied input without parameterization or sanitization. An attacker can bypass authentication entirely by injecting SQL payloads into the username or password fields. For example, entering `' OR '1'='1` as the username would modify the query logic to return all users, granting unauthorized access. The raw SQL query is visible in the debug panel on the frontend, which is a common misconfiguration found in development/staging environments that sometimes leak into production.

#### 2. Reflected XSS (Search Collection)

The search endpoint returns user input embedded directly in HTML responses without any output encoding or Content Security Policy headers. When a user searches for a term, the server reflects that term back in the rendered HTML. An attacker can craft a malicious URL or search query containing JavaScript payloads (e.g., `<script>alert(document.cookie)</script>`) that execute in the context of any user who views the search results. This is particularly dangerous because it can be used to steal session tokens, redirect users to phishing pages, or perform actions on behalf of the victim.

#### 3. Stored XSS (Art Reviews)

The review submission endpoint stores user-provided content in the database and renders it unsanitized when displayed to other users. Unlike reflected XSS, stored XSS persists across sessions — a single malicious review can affect every user who views the reviews page. This is one of the most impactful XSS variants because it requires no user interaction beyond visiting the affected page. Attackers can inject persistent JavaScript that steals credentials, performs unauthorized actions, or turns the page into a phishing portal.

#### 4. Command Injection (Verify Provenance)

The provenance verification endpoint takes a hostname parameter and passes it directly to a system shell command without any validation or sanitization. An attacker can inject arbitrary operating system commands using shell metacharacters like `;`, `|`, `&&`, or `$(...)`. For instance, entering `127.0.0.1; cat /etc/passwd` would execute both the intended ping command and the attacker's payload. This could lead to full server compromise, data exfiltration, or lateral movement within the infrastructure.

#### 5. Path Traversal (View Certificates)

The certificate viewer endpoint constructs file paths by concatenating user-supplied filenames with a base directory without proper path canonicalization. An attacker can use directory traversal sequences (`../`) to escape the intended directory and read arbitrary files on the server. For example, requesting `../../../etc/passwd` would traverse up the directory tree and expose the system's password file. This vulnerability can leak sensitive configuration files, source code, database credentials, and other secrets.

#### 6. Insecure Direct Object Reference (Collector Profiles)

The collector profile endpoint accepts a user ID parameter and returns all associated user data without any access control checks. By simply incrementing or modifying the ID parameter (e.g., changing `usr_user_001` to `usr_admin_001`), an attacker can access other users' sensitive information including email addresses, SSNs, credit card numbers, and home addresses. IDOR vulnerabilities are widespread in real APIs and frequently lead to large-scale data breaches.

---

## Getting Started

### Prerequisites

- Node.js 18+ or Bun runtime
- npm, yarn, or bun package manager
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/cysec-don/VulnArt.git
cd VulnArt

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env

# Set up the database
npx prisma generate
npx prisma db push

# Start the development server
npm run dev
```

The application will be available at `http://localhost:3000`.

### Demo Credentials

The seed endpoint automatically creates demo accounts on first visit:

| Username | Password | Role |
|----------|----------|------|
| `admin` | `admin123` | Administrator |
| `user` | `user123` | Regular User |

---

## Project Structure

```
VulnArt/
├── prisma/
│   └── schema.prisma          # Database schema (SQLite with User, Comment, Product models)
├── public/
│   ├── art/                   # AI-generated artwork images (16 pieces + logo)
│   ├── logo.svg
│   └── robots.txt
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── comments/route.ts    # Stored XSS vulnerability endpoint
│   │   │   ├── file/route.ts        # Path Traversal vulnerability endpoint
│   │   │   ├── login/route.ts       # SQL Injection vulnerability endpoint
│   │   │   ├── ping/route.ts        # Command Injection vulnerability endpoint
│   │   │   ├── search/route.ts      # Reflected XSS vulnerability endpoint
│   │   │   ├── seed/route.ts        # Database seeder
│   │   │   └── user/route.ts        # IDOR vulnerability endpoint
│   │   ├── globals.css              # Global styles with gold theme
│   │   ├── layout.tsx               # Root layout with metadata
│   │   └── page.tsx                 # Main SPA with all views
│   ├── components/ui/          # shadcn/ui component library
│   ├── hooks/                 # React hooks
│   └── lib/
│       ├── db.ts              # Prisma client initialization
│       ├── db-raw.ts          # Raw SQLite access (for vulnerabilities)
│       └── utils.ts           # Utility functions
├── .env.example
├── .gitignore
├── components.json
├── eslint.config.mjs
├── next.config.ts
├── package.json
├── postcss.config.mjs
├── tailwind.config.ts
└── tsconfig.json
```

---

## Technologies

| Category | Technology |
|----------|-----------|
| Framework | Next.js 16 (App Router) |
| UI Library | React 19 |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 4 + shadcn/ui |
| Animations | Framer Motion |
| Database | SQLite via Prisma ORM |
| Icons | Lucide React |
| Components | Radix UI primitives |

---

## Usage Scenarios

VulnArt is designed for multiple educational and training purposes:

- **Cybersecurity Courses**: Use as a hands-on lab for teaching web application security fundamentals. Students learn to identify, exploit, and remediate vulnerabilities in a realistic setting.
- **Penetration Testing Practice**: Provides a safe environment for security professionals to practice their skills before engaging with production systems.
- **CTF Competitions**: The application can serve as a CTF challenge platform with defined vulnerability categories and difficulty levels.
- **Security Tool Testing**: Validate the effectiveness of security scanners, WAFs, and other defensive tools against known vulnerability patterns.
- **Secure Coding Training**: Developers can study the vulnerable code patterns and learn how to implement proper security controls.

---

## Challenge Walkthrough (Spoilers)

<details>
<summary>Click to reveal exploitation hints</summary>

### SQL Injection
- Target: Login form
- Hint: Try `' OR '1'='1' --` in the username field
- The raw query is displayed in the debug panel

### Reflected XSS
- Target: Search bar
- Hint: Search for `<img src=x onerror=alert('XSS')>`
- The response is rendered via `dangerouslySetInnerHTML`

### Stored XSS
- Target: Review submission form
- Hint: Submit a review containing `<script>document.title='Pwned'</script>`
- The payload persists and executes for all visitors

### Command Injection
- Target: Provenance verification input
- Hint: Enter `127.0.0.1; id` or `127.0.0.1 && whoami`
- The input is passed directly to `exec()`

### Path Traversal
- Target: Certificate lookup
- Hint: Try `../../../etc/passwd` or `../../../.env`
- The filename is concatenated without path sanitization

### IDOR
- Target: Collector profile lookup
- Hint: Try different IDs like `usr_admin_001`, `usr_user_002`
- No authorization check is performed before returning user data

</details>

---

## Contributing

Contributions are welcome! This is an educational project, and we encourage security researchers, educators, and developers to contribute:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/new-vulnerability`)
3. Commit your changes (`git commit -m 'Add new vulnerability scenario'`)
4. Push to the branch (`git push origin feature/new-vulnerability`)
5. Open a Pull Request

Please ensure any new vulnerabilities include:
- Clear educational documentation
- A remediation guide showing how to fix the issue
- Difficulty rating for learners

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

## Author

Developed by **Cysec Don** — Dedicated to advancing cybersecurity education and building the next generation of security professionals.
