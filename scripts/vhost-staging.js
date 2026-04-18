/**
 * Vuln Art Shop - Staging Virtual Host Service
 * Runs on port 3003
 * Created & Produced by Cysec Don (cysecdon@gmail.com)
 */

const http = require('http');

const PORT = 3003;

const stagingPage = `
<!DOCTYPE html>
<html>
<head>
    <title>Vuln Art Shop - Staging</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: system-ui, sans-serif; background: #fafafa; color: #333; padding: 2rem; }
        h1 { color: #d63384; margin-bottom: 1rem; }
        .badge { background: #d63384; color: white; padding: 0.25rem 0.75rem; border-radius: 12px; font-size: 0.75rem; }
        .panel { background: white; border: 1px solid #dee2e6; border-radius: 8px; padding: 1.5rem; margin-bottom: 1rem; box-shadow: 0 1px 3px rgba(0,0,0,0.05); }
        .endpoint { display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem 0; border-bottom: 1px solid #f0f0f0; }
        .method { padding: 0.15rem 0.5rem; border-radius: 4px; font-size: 0.75rem; font-weight: bold; font-family: monospace; }
        .get { background: #d1ecf1; color: #0c5460; }
        .post { background: #d4edda; color: #155724; }
        .put { background: #fff3cd; color: #856404; }
        .delete { background: #f8d7da; color: #721c24; }
        code { background: #f5f5f5; padding: 0.15rem 0.4rem; border-radius: 3px; font-size: 0.9rem; }
        .flag { background: #d63384; color: white; padding: 0.5rem 1rem; border-radius: 4px; font-family: monospace; display: inline-block; }
    </style>
</head>
<body>
    <h1>Vuln Art Shop <span class="badge">STAGING</span></h1>

    <div class="panel">
        <h2>Staging Environment Flag</h2>
        <p>This flag is only available on the staging virtual host.</p>
        <p style="margin-top:0.5rem"><span class="flag">FLAG{st4g1ng_3nv_fl4g}</span></p>
    </div>

    <div class="panel">
        <h2>API Documentation</h2>

        <h3 style="margin-top:1rem">Authentication</h3>
        <div class="endpoint"><span class="method post">POST</span> <code>/api/auth/register</code></div>
        <div class="endpoint"><span class="method post">POST</span> <code>/api/auth/login</code></div>
        <div class="endpoint"><span class="method get">GET</span> <code>/api/auth/me</code></div>
        <div class="endpoint"><span class="method post">POST</span> <code>/api/auth/logout</code></div>

        <h3 style="margin-top:1rem">Artworks</h3>
        <div class="endpoint"><span class="method get">GET</span> <code>/api/artworks</code> - List all artworks</div>
        <div class="endpoint"><span class="method get">GET</span> <code>/api/artworks/[id]</code> - Get artwork details (includes internal notes)</div>

        <h3 style="margin-top:1rem">Marketplace</h3>
        <div class="endpoint"><span class="method post">POST</span> <code>/api/marketplace/buy</code> - Purchase artwork</div>
        <div class="endpoint"><span class="method post">POST</span> <code>/api/marketplace/rent</code> - Rent artwork</div>
        <div class="endpoint"><span class="method get">GET</span> <code>/api/marketplace/auctions</code> - List auctions</div>
        <div class="endpoint"><span class="method post">POST</span> <code>/api/marketplace/bid</code> - Place bid</div>

        <h3 style="margin-top:1rem">Users</h3>
        <div class="endpoint"><span class="method get">GET</span> <code>/api/users/profile</code></div>
        <div class="endpoint"><span class="method put">PUT</span> <code>/api/users/profile</code> - Update (accepts role field)</div>

        <h3 style="margin-top:1rem;color:#d63384">Hidden / Admin (Not in production docs)</h3>
        <div class="endpoint"><span class="method get">GET</span> <code>/api/admin/users</code> - All users (no auth)</div>
        <div class="endpoint"><span class="method get">GET</span> <code>/api/admin/flags</code> - Flag data (admin)</div>
        <div class="endpoint"><span class="method get">GET</span> <code>/api/internal/stats</code> - System stats</div>
        <div class="endpoint"><span class="method get">GET</span> <code>/api/debug/env</code> - Environment debug</div>
        <div class="endpoint"><span class="method get">GET</span> <code>/api/v1/export</code> - Data export</div>
    </div>

    <div class="panel">
        <h2>Test Accounts</h2>
        <p><strong>Username:</strong> artist1 / <strong>Password:</strong> password123</p>
        <p><strong>Username:</strong> collector_jane / <strong>Password:</strong> jane2024</p>
        <p><strong>Username:</strong> dev_test / <strong>Password:</strong> devtest123</p>
        <p style="margin-top:0.5rem;color:#888;font-size:0.85rem">Additional accounts may exist but are not listed in staging docs.</p>
    </div>

    <div class="panel">
        <h2>Database Schema</h2>
        <pre style="background:#f5f5f5;padding:1rem;border-radius:4px;overflow-x:auto;font-size:0.85rem">
User: id, email, username, passwordHash, name, bio, avatar, role, balance
Session: id, token, userId, expiresAt
Artwork: id, title, artist, description, category, price, rentPrice
Purchase: id, userId, artworkId, amount
Rental: id, userId, artworkId, amount, startDate, endDate
Auction: id, artworkId, startPrice, currentPrice, minBid
Bid: id, userId, auctionId, amount
FlagSubmission: id, userId, flag, tier, points
HiddenLog: id, eventType, message, metadata
        </pre>
    </div>
</body>
</html>
`;

const server = http.createServer((req, res) => {
    res.setHeader('X-Powered-By', 'VulnArt-Staging/1.0.0-rc1');
    res.setHeader('X-Environment', 'staging');

    if (req.url === '/' || req.url === '/index.html') {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(stagingPage);
    } else if (req.url === '/api-docs') {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(stagingPage);
    } else if (req.url === '/api/staging/info') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            environment: 'staging',
            version: '1.0.0-rc1',
            stagingFlag: 'FLAG{st4g1ng_3nv_fl4g}',
            testAccounts: [
                { username: 'artist1', password: 'password123' },
                { username: 'collector_jane', password: 'jane2024' },
            ],
        }));
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
    }
});

server.listen(PORT, '0.0.0.0', () => {
    console.log(`[Vuln Art Shop] Staging VHOST running on port ${PORT}`);
});
