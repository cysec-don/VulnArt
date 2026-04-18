/**
 * Vuln Art Shop - Dev Virtual Host Service
 * Runs on port 3002
 * Created & Produced by Cysec Don (cysecdon@gmail.com)
 */

const http = require('http');

const PORT = 3002;

const devPage = `
<!DOCTYPE html>
<html>
<head>
    <title>Vuln Art Shop - Development</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: monospace; background: #0d1117; color: #c9d1d9; padding: 2rem; }
        h1 { color: #f0883e; margin-bottom: 1rem; }
        .warning { background: #3d1f00; border: 1px solid #f0883e; padding: 1rem; border-radius: 6px; margin-bottom: 1rem; }
        .panel { background: #161b22; border: 1px solid #30363d; border-radius: 6px; padding: 1rem; margin-bottom: 1rem; }
        .env-var { color: #7ee787; }
        .comment { color: #8b949e; }
        .flag { color: #f0883e; font-weight: bold; }
        pre { background: #0d1117; padding: 1rem; border-radius: 4px; overflow-x: auto; }
    </style>
</head>
<body>
    <div class="warning">
        <strong>&#9888; DEVELOPMENT ENVIRONMENT</strong><br>
        This server is running in development mode. Debug information and stack traces are enabled.
    </div>

    <h1>Vuln Art Shop - Dev Server</h1>

    <div class="panel">
        <h2>Environment Variables</h2>
        <pre>
<span class="comment"># Application Config</span>
NODE_ENV=<span class="env-var">development</span>
DATABASE_URL=<span class="env-var">postgresql://vulnart:vulnart_pass_2024@postgres:5432/vulnart</span>
SECRET_KEY=<span class="env-var">vuln_art_secret_2024</span>
ADMIN_EMAIL=<span class="env-var">mike@vulnart.shop</span>
DEBUG_MODE=<span class="env-var">true</span>

<span class="comment"># SMTP Config</span>
SMTP_HOST=<span class="env-var">smtp.vulnart.shop</span>
SMTP_PORT=<span class="env-var">587</span>
SMTP_USER=<span class="env-var">noreply@vulnart.shop</span>
SMTP_PASS=<span class="env-var">mail_pass_2024</span>

<span class="comment"># Dev Flag</span>
DEV_FLAG=<span class="flag">FLAG{d3v_vh0st_3xp0s3d}</span>
        </pre>
    </div>

    <div class="panel">
        <h2>API Endpoints (Development Only)</h2>
        <pre>
GET  /api/dev-info         - Server info and config
GET  /api/dev/db-schema    - Database schema dump
GET  /api/dev/users        - All user data (dev mode)
GET  /api/dev/sessions     - Active sessions
POST /api/dev/reset-db     - Reset database
        </pre>
    </div>

    <div class="panel">
        <h2>Database Connection Info</h2>
        <pre>
Host: postgres
Port: 5432
Database: vulnart
Username: vulnart
Password: vulnart_pass_2024
SSL: disabled (development)
        </pre>
    </div>
</body>
</html>
`;

const server = http.createServer((req, res) => {
    res.setHeader('X-Powered-By', 'VulnArt-Dev/0.9.0-beta');
    res.setHeader('X-Environment', 'development');
    res.setHeader('X-Debug-Mode', 'enabled');
    res.setHeader('X-Stack-Trace', 'on');

    if (req.url === '/' || req.url === '/index.html') {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(devPage);
    } else if (req.url === '/api/dev-info') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            environment: 'development',
            version: '0.9.0-beta',
            database: { host: 'postgres', port: 5432, name: 'vulnart', user: 'vulnart', ssl: false },
            debug: true,
            stackTraces: true,
            devFlag: 'FLAG{d3v_vh0st_3xp0s3d}',
            note: 'This endpoint is only available in the development virtual host.',
        }));
    } else if (req.url === '/api/dev/users') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            users: [
                { id: 1, username: 'artist1', email: 'artist1@vulnart.shop', role: 'user' },
                { id: 2, username: 'collector_jane', email: 'jane@vulnart.shop', role: 'premium' },
                { id: 3, username: 'curator_mike', email: 'mike@vulnart.shop', role: 'admin' },
                { id: 4, username: 'backup_admin', email: 'backup@vulnart.shop', role: 'admin' },
            ],
            note: 'Dev mode: password hashes exposed for debugging',
        }));
    } else if (req.url === '/api/dev/db-schema') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            tables: ['User', 'Session', 'Artwork', 'Purchase', 'Rental', 'Auction', 'Bid', 'FlagSubmission', 'HiddenLog'],
            schema: {
                User: ['id', 'email', 'username', 'passwordHash', 'name', 'bio', 'avatar', 'role', 'balance', 'createdAt', 'updatedAt'],
                Session: ['id', 'token', 'userId', 'expiresAt', 'createdAt'],
                Artwork: ['id', 'title', 'artist', 'description', 'category', 'price', 'rentPrice', 'image', 'isForSale', 'isForRent', 'isForAuction'],
                HiddenLog: ['id', 'eventType', 'message', 'metadata', 'createdAt'],
            },
        }));
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
    }
});

server.listen(PORT, '0.0.0.0', () => {
    console.log(`[Vuln Art Shop] Dev VHOST running on port ${PORT}`);
});
