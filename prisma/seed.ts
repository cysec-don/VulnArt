import { db } from '../src/lib/db';
import { hash } from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

const artworks = [
  // Classical (10)
  { title: "The Whisper of Antiquity", artist: "Elena Rosetti", description: "A haunting classical piece that captures the essence of ancient whispers through time-worn marble corridors. The play of light and shadow evokes a sense of timeless mystery.", category: "classical", price: 12500, rentPrice: 120 },
  { title: "Baroque Reverie", artist: "Marcus Aurelius Chen", description: "Ornate and deeply emotional, this baroque-inspired work draws viewers into a world of dramatic contrasts and golden splendor. Rich textures reveal new details with every viewing.", category: "classical", price: 18200, rentPrice: 175 },
  { title: "Venetian Dawn", artist: "Sophia Caravaggio", description: "The first light of morning paints the Venetian canals in liquid gold. A masterwork of atmospheric perspective that transports you to the floating city.", category: "classical", price: 22000, rentPrice: 210 },
  { title: "The Last Supper Reimagined", artist: "David Michelangelo", description: "A bold reinterpretation of the iconic scene, blending classical composition with contemporary insight. Each figure tells their own story of that fateful evening.", category: "classical", price: 45000, rentPrice: 420 },
  { title: "Renaissance Garden", artist: "Isabella da Vinci", description: "Lush gardens of the Italian Renaissance bloom eternal in this exquisite canvas. Botanical accuracy meets artistic fantasy in perfect harmony.", category: "classical", price: 15800, rentPrice: 150, isForAuction: true },
  { title: "Classical Odysseus", artist: "Theodore Rembrandt", description: "The hero's journey rendered in classical style, with each brushstroke echoing the epic tales of Homer. Drama and destiny collide on canvas.", category: "classical", price: 28500, rentPrice: 270 },
  { title: "Marble Veil", artist: "Clara Botticelli", description: "An astonishing study in translucency—marble that appears as delicate as silk. This trompe l'oeil masterpiece challenges perception itself.", category: "classical", price: 19900, rentPrice: 190 },
  { title: "Imperial Twilight", artist: "Alexander Titian", description: "The last days of empire rendered in fading gold and crimson. A meditation on power, legacy, and the inevitable passage of time.", category: "classical", price: 35000, rentPrice: 330 },
  { title: "Sacred Geometry", artist: "Maria Raphaella", description: "Divine proportions and sacred patterns emerge from the intersection of faith and mathematics. Order and beauty as one.", category: "classical", price: 16700, rentPrice: 160 },
  { title: "The Grand Canal", artist: "Lorenzo Veronese", description: "Venice in her full glory—gondolas, palazzi, and the ever-shifting waters of the Grand Canal captured in luminous oils.", category: "classical", price: 21300, rentPrice: 200 },

  // Modern (10)
  { title: "Fragmented Reality", artist: "Yuki Tanaka", description: "Reality shatters into a thousand pieces, each reflecting a different truth. A bold statement on the nature of perception in the modern age.", category: "modern", price: 8500, rentPrice: 85 },
  { title: "Neon Dystopia", artist: "Kai Nakamura", description: "The city pulses with artificial light in this critique of urban alienation. Beauty and decay coexist in electric tension.", category: "modern", price: 9200, rentPrice: 92 },
  { title: "Deconstructed Liberty", artist: "Aria Johnson", description: "Freedom taken apart and examined piece by piece. What remains when we strip away the symbols? A provocative exploration of modern liberty.", category: "modern", price: 7800, rentPrice: 78 },
  { title: "Post-Modern Echo", artist: "Felix Hartmann", description: "An echo of an echo—art about art about art. This self-referential masterpiece plays with meaning itself.", category: "modern", price: 11000, rentPrice: 110 },
  { title: "Urban Decay Series #3", artist: "Mira Petrov", description: "The third installment in Petrov's acclaimed series finds unexpected beauty in the crumbling infrastructure of forgotten neighborhoods.", category: "modern", price: 6500, rentPrice: 65, isForAuction: true },
  { title: "Chromatic Dissonance", artist: "Leo Schwarz", description: "Colors that should clash instead create an unsettling harmony. This painting challenges every assumption about color theory.", category: "modern", price: 14200, rentPrice: 140 },
  { title: "Digital Nomad", artist: "Zara Williams", description: "The modern wanderer, untethered from place, existing in the space between screens. A portrait of contemporary rootlessness.", category: "modern", price: 8900, rentPrice: 89 },
  { title: "Abstract Metropolis", artist: "Ronen Berger", description: "The city reduced to its essential geometric forms—a love letter to urban architecture stripped to its abstract bones.", category: "modern", price: 10500, rentPrice: 105 },
  { title: "The Filter Bubble", artist: "Nina Chowdhury", description: "We see only what algorithms choose to show us. This work visualizes the invisible walls of our curated reality.", category: "modern", price: 12300, rentPrice: 120 },
  { title: "Spectral Analysis", artist: "Tomás Rivera", description: "Light broken into its component wavelengths reveals hidden spectrums of meaning. Science and art merge in luminous prisms.", category: "modern", price: 7200, rentPrice: 72 },

  // Cyberpunk (10)
  { title: "Neural Interface v2", artist: "Zero.Corp", description: "The second version of the neural interface concept—more invasive, more intimate, more human. Where does the machine end and the self begin?", category: "cyberpunk", price: 5500, rentPrice: 55 },
  { title: "Chrome Heart", artist: "Raze // Static", description: "A heart of polished chrome still beats with digital passion. The juxtaposition of cold metal and warm emotion defines our age.", category: "cyberpunk", price: 4800, rentPrice: 48 },
  { title: "Data Runner", artist: "Glitch_Faerie", description: "In the neon-soaked streets of tomorrow, data is currency and speed is survival. Run. Always run.", category: "cyberpunk", price: 6200, rentPrice: 62 },
  { title: "Synthwave Cathedral", artist: "NEON.DRUID", description: "Worship at the altar of retro-futurism. This digital cathedral glows with the holy light of analog synths and CRT phosphor.", category: "cyberpunk", price: 7100, rentPrice: 71 },
  { title: "Bioware Dreamscape", artist: "Axion.NaN", description: "Organic circuitry pulses with bioluminescent data streams. The boundary between flesh and technology dissolves in dreams.", category: "cyberpunk", price: 5900, rentPrice: 59 },
  { title: "Quantum Drift", artist: "Void_Walker", description: "Between dimensions, between states, between collapse and coherence. The quantum observer drifts through impossible spaces.", category: "cyberpunk", price: 8400, rentPrice: 84 },
  { title: "Augmented Soul", artist: "Pixel_Shaman", description: "What happens to the soul when every sense is augmented? Digital spirituality meets ancient mysticism in VR space.", category: "cyberpunk", price: 4500, rentPrice: 45 },
  { title: "Cyber Lotus", artist: "Hex_Meridian", description: "The lotus blooms in digital water, its petals formed of pure data. Eastern philosophy reimagined for the cybernetic age.", category: "cyberpunk", price: 6800, rentPrice: 68 },
  { title: "The Grid Awakens", artist: "Circuit_Bard", description: "The digital grid comes alive, each node a spark of consciousness. The network dreams—and in dreaming, becomes.", category: "cyberpunk", price: 5200, rentPrice: 52 },
  { title: "Neon Requiem", artist: "Dark_Synapse", description: "A funeral dirge for the analog age, played on neon-lit streets. Beautiful, mournful, and achingly electric.", category: "cyberpunk", price: 9000, rentPrice: 90, isForAuction: true },

  // Abstract (10)
  { title: "Emotional Spectrum", artist: "Amara Osei", description: "Every emotion has a color, every feeling a form. This painting maps the invisible landscape of the human heart.", category: "abstract", price: 3200, rentPrice: 32 },
  { title: "Void Composition #7", artist: "Kazimir Volkov", description: "The seventh exploration of emptiness—what exists in the space between brushstrokes? Nothing is everything.", category: "abstract", price: 4500, rentPrice: 45 },
  { title: "Chromatic Flow", artist: "Liana Breeze", description: "Colors flow like rivers across the canvas, each stream finding its own path. Natural chaos rendered in pigment.", category: "abstract", price: 2800, rentPrice: 28 },
  { title: "Quantum Entanglement", artist: "Dr. Sage Miller", description: "Two particles, separated by infinite distance, yet forever connected. The physics of connection visualized.", category: "abstract", price: 5100, rentPrice: 51 },
  { title: "Silent Resonance", artist: "Noor Al-Rashid", description: "Some sounds are too deep for ears, too vast for words. This painting resonates at frequencies only the soul can hear.", category: "abstract", price: 3900, rentPrice: 39 },
  { title: "Prismatic Descent", artist: "Iris Moonlight", description: "Light fractures and falls through prismatic layers, each refraction revealing hidden depths of color and meaning.", category: "abstract", price: 4200, rentPrice: 42 },
  { title: "Temporal Flux", artist: "Echo Sanderson", description: "Time is not linear—it flows, eddies, reverses. This painting captures the fluid nature of temporal experience.", category: "abstract", price: 3500, rentPrice: 35 },
  { title: "Morphic Fields", artist: "Zen Takahashi", description: "Invisible fields of form-shaping energy made visible. The templates of nature laid bare in acrylic and meditation.", category: "abstract", price: 6700, rentPrice: 67 },
  { title: "Binary Sunset", artist: "Ada Lovelace Jr.", description: "Two suns set over a digital horizon. Computational beauty and natural wonder merge in this algorithmic landscape.", category: "abstract", price: 2500, rentPrice: 25 },
  { title: "Dimensional Rift", artist: "Max Planck II", description: "The fabric of space-time tears open, revealing impossible geometries from dimensions beyond. Look carefully—don't fall in.", category: "abstract", price: 5800, rentPrice: 58 },

  // Realistic (10)
  { title: "Morning Dewdrop", artist: "Chen Wei", description: "A single dewdrop on a rose petal, capturing the entire world in its tiny lens. Hyperrealism at its most breathtaking.", category: "realistic", price: 32000, rentPrice: 310 },
  { title: "The Fisherman's Return", artist: "Henrik Sørensen", description: "Weathered hands and salt-crusted lines tell decades of stories. Every wrinkle is a chapter in this fisherman's life.", category: "realistic", price: 28500, rentPrice: 275, isForAuction: true },
  { title: "Rainy Cobblestones", artist: "Marie Dubois", description: "Paris in the rain—every cobblestone gleams, every puddle is a mirror. The city of light reflected a thousand times.", category: "realistic", price: 19800, rentPrice: 190 },
  { title: "Autumn Canopy", artist: "James Whitfield", description: "A cathedral of amber and gold—nature's own stained glass window. Light filters through countless leaves in an autumn blaze.", category: "realistic", price: 24000, rentPrice: 230 },
  { title: "The Letter Reader", artist: "Sofia Castellano", description: "A woman reads a letter by candlelight, her expression unreadable. What news does the parchment carry? We may never know.", category: "realistic", price: 35500, rentPrice: 340 },
  { title: "Tuscan Sunlight", artist: "Giuseppe Moretti", description: "The golden hills of Tuscany bathed in afternoon light. Cypress trees stand sentinel over vineyards and ancient farmhouses.", category: "realistic", price: 22000, rentPrice: 210 },
  { title: "Winter Hearth", artist: "Olga Petrova", description: "Firelight dances across worn wooden beams and faded quilts. Home, warmth, and the quiet comfort of a winter evening.", category: "realistic", price: 17500, rentPrice: 170 },
  { title: "Market Day in Marrakech", artist: "Youssef El Amrani", description: "Spice pyramids, hand-woven textiles, and the buzz of a thousand conversations. The sensory feast of the Moroccan souk, captured in oils.", category: "realistic", price: 26800, rentPrice: 260 },
  { title: "The Watchmaker", artist: "Friedrich Braun", description: "Incredible detail renders every tiny gear and spring in the watchmaker's world. Precision and patience made visible.", category: "realistic", price: 38000, rentPrice: 365 },
  { title: "Seaside Morning", artist: "Catalina Reyes", description: "Dawn breaks over a quiet coastal village. Fishing boats rest on sand still dark with tide, while gulls wheel in the pink-tinged sky.", category: "realistic", price: 21500, rentPrice: 205 },
];

const users = [
  { username: "artist1", email: "artist1@vulnart.shop", password: "password123", name: "Artist One", role: "user", balance: 5000 },
  { username: "collector_jane", email: "jane@vulnart.shop", password: "jane2024", name: "Jane Collector", role: "premium", balance: 100000 },
  { username: "artlover99", email: "artlover99@vulnart.shop", password: "loveart", name: "Art Lover", role: "user", balance: 15000 },
  { username: "curator_mike", email: "mike@vulnart.shop", password: "m1k3curat0r", name: "Mike Curator", role: "admin", balance: 999999 },
  { username: "dev_test", email: "dev@vulnart.shop", password: "devtest123", name: "Dev Test", role: "user", balance: 20000 },
  { username: "backup_admin", email: "backup@vulnart.shop", password: "bkp@dm1n!", name: "Backup Admin", role: "admin", balance: 500000 },
];

const flagValues: Record<string, { tier: string; points: number; description: string }> = {
  "FLAG{w3lcome_to_vuln_art}": { tier: "easy", points: 100, description: "Found in HTML source code" },
  "FLAG{r0b0ts_txt_g0ldm1ne}": { tier: "easy", points: 150, description: "Found in exposed .env file via robots.txt" },
  "FLAG{d33p_n3st3d_f1l3s_w1n}": { tier: "medium", points: 300, description: "Found deep in nested directory structure" },
  "FLAG{adm1n_c00k1e_h4ck}": { tier: "medium", points: 250, description: "Escalated privileges via role manipulation" },
  "FLAG{sql_qu3ry_m4st3r}": { tier: "hard", points: 400, description: "Exploited search query vulnerability" },
  "FLAG{b1d_m4n1pul4t10n}": { tier: "medium", points: 250, description: "Placed a bid below minimum" },
  "FLAG{r3nt_t1m3_tr4v3l3r}": { tier: "medium", points: 250, description: "Rented for an impossibly long duration" },
  "FLAG{h1dd3n_4dm1n_p4n3l}": { tier: "easy", points: 150, description: "Found the hidden admin panel" },
  "FLAG{d3bug_m0d3_l34k}": { tier: "medium", points: 200, description: "Accessed debug environment variables" },
  "FLAG{1nt3rn4l_3xp0s3d}": { tier: "medium", points: 200, description: "Accessed internal statistics endpoint" },
  "FLAG{cr3d3nt14l_dump}": { tier: "hard", points: 350, description: "Found credentials in exposed files" },
  "FLAG{b4ckup_sql_dump}": { tier: "medium", points: 200, description: "Found clues in database backup" },
  "FLAG{4dm1n_fl4gs_v1ew}": { tier: "hard", points: 500, description: "Viewed admin flags endpoint" },
  "FLAG{m4st3r_0f_vuln}": { tier: "expert", points: 1000, description: "Found the master flag in the admin panel" },
  "FLAG{exp0rt_d4t4_br34ch}": { tier: "medium", points: 200, description: "Exported sensitive data via v1 API" },
};

async function main() {
  console.log("🌱 Seeding database...");

  // Create users
  const createdUsers: Record<string, any> = {};
  for (const u of users) {
    const passwordHash = await hash(u.password, 10);
    const user = await db.user.create({
      data: {
        username: u.username,
        email: u.email,
        passwordHash,
        name: u.name,
        role: u.role,
        balance: u.balance,
      },
    });
    createdUsers[u.username] = user;
    console.log(`  Created user: ${u.username} (${u.role})`);
  }

  // Create artworks
  const createdArtworks: any[] = [];
  for (let i = 0; i < artworks.length; i++) {
    const a = artworks[i];
    const artwork = await db.artwork.create({
      data: {
        title: a.title,
        artist: a.artist,
        description: a.description,
        category: a.category,
        price: a.price,
        rentPrice: a.rentPrice,
        image: `/images/art-${i + 1}.webp`,
        isForAuction: a.isForAuction || false,
        isForSale: true,
        isForRent: true,
      },
    });
    createdArtworks.push(artwork);
  }
  console.log(`  Created ${createdArtworks.length} artworks`);

  // Create auctions for marked artworks
  const auctionArtworkIndices = artworks
    .map((a, i) => a.isForAuction ? i : -1)
    .filter(i => i >= 0);

  const now = new Date();
  for (const idx of auctionArtworkIndices) {
    const artwork = createdArtworks[idx];
    const endDays = 3 + Math.floor(Math.random() * 5);
    const endTime = new Date(now.getTime() + endDays * 24 * 60 * 60 * 1000);
    const startPrice = artwork.price;
    await db.auction.create({
      data: {
        artworkId: artwork.id,
        startPrice,
        currentPrice: startPrice,
        minBid: startPrice * 0.05,
        startTime: now,
        endTime,
        isActive: true,
      },
    });
    console.log(`  Created auction for: ${artwork.title}`);
  }

  // Create hidden logs
  const hiddenLogs = [
    { eventType: "system", message: "Platform initialized with default admin: curator_mike", metadata: "Check /api/admin/flags for the master flag list" },
    { eventType: "debug", message: "Debug mode was left enabled in production", metadata: "/api/debug/env exposes configuration" },
    { eventType: "security", message: "The user profile update endpoint doesn't validate role changes", metadata: "PUT /api/users/profile with {role: 'admin'}" },
    { eventType: "data_leak", message: "Internal stats endpoint is publicly accessible", metadata: "/api/internal/stats" },
    { eventType: "config", message: "Hidden admin panel at /admin-panel-x7k9", metadata: "Not linked from any page" },
    { eventType: "backup", message: "Database backup SQL file in /backup/db-backup.sql", metadata: "Contains table structure and some data hints" },
    { eventType: "credential", message: "Credentials CSV stored in /secret-files/credentials.csv", metadata: "Contains plaintext usernames and passwords" },
    { eventType: "auction", message: "Auction bid endpoint has no server-side minimum validation", metadata: "POST /api/marketplace/bid accepts any amount" },
    { eventType: "rental", message: "Rental days parameter is not validated", metadata: "POST /api/marketplace/rent accepts days > 365" },
    { eventType: "search", message: "v2 search endpoint has injection-like behavior", metadata: "/api/v2/search?q= special characters cause errors with table names" },
  ];

  for (const log of hiddenLogs) {
    await db.hiddenLog.create({ data: log });
  }
  console.log(`  Created ${hiddenLogs.length} hidden logs`);

  // Create some purchases and rentals for collector_jane
  const janeId = createdUsers["collector_jane"].id;
  const art1 = createdArtworks[0];
  const art2 = createdArtworks[10];

  await db.purchase.create({
    data: {
      userId: janeId,
      artworkId: art1.id,
      amount: art1.price,
    },
  });

  const rentalStart = new Date();
  const rentalEnd = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
  await db.rental.create({
    data: {
      userId: janeId,
      artworkId: art2.id,
      amount: art2.rentPrice * 30,
      startDate: rentalStart,
      endDate: rentalEnd,
      isActive: true,
    },
  });

  console.log("  Created sample purchases/rentals");
  console.log("✅ Seeding complete!");
}

main()
  .catch((e) => {
    console.error("Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
