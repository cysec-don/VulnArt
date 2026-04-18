-- Vuln Art Shop Database Backup
-- Generated: 2024-12-01 03:00:00 UTC
-- FLAG{b4ckup_sql_dump}

-- =====================================================
-- Table: User
-- =====================================================
CREATE TABLE User (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  username TEXT UNIQUE NOT NULL,
  passwordHash TEXT NOT NULL,
  name TEXT,
  bio TEXT,
  avatar TEXT,
  role TEXT DEFAULT 'user',
  balance REAL DEFAULT 10000.0,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Sample data (passwords are hashed with bcrypt):
-- INSERT INTO User VALUES ('cl_xxx', 'mike@vulnart.shop', 'curator_mike', '$2a$10$...', 'Mike Curator', NULL, NULL, 'admin', 999999, ...);
-- INSERT INTO User VALUES ('cl_yyy', 'backup@vulnart.shop', 'backup_admin', '$2a$10$...', 'Backup Admin', NULL, NULL, 'admin', 500000, ...);

-- =====================================================
-- Table: Session
-- =====================================================
CREATE TABLE Session (
  id TEXT PRIMARY KEY,
  token TEXT UNIQUE NOT NULL,
  userId TEXT NOT NULL REFERENCES User(id) ON DELETE CASCADE,
  expiresAt DATETIME NOT NULL,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- NOTE: Session tokens are stored in cookies named 'vulnart_session'
-- If you can forge a session token, you can impersonate any user

-- =====================================================
-- Table: Artwork
-- =====================================================
CREATE TABLE Artwork (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  artist TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  price REAL NOT NULL,
  rentPrice REAL NOT NULL,
  image TEXT NOT NULL,
  isForSale BOOLEAN DEFAULT 1,
  isForRent BOOLEAN DEFAULT 1,
  isForAuction BOOLEAN DEFAULT 0,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- Table: Purchase
-- =====================================================
CREATE TABLE Purchase (
  id TEXT PRIMARY KEY,
  userId TEXT NOT NULL REFERENCES User(id) ON DELETE CASCADE,
  artworkId TEXT NOT NULL REFERENCES Artwork(id),
  amount REAL NOT NULL,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- Table: Rental
-- =====================================================
CREATE TABLE Rental (
  id TEXT PRIMARY KEY,
  userId TEXT NOT NULL REFERENCES User(id) ON DELETE CASCADE,
  artworkId TEXT NOT NULL REFERENCES Artwork(id),
  amount REAL NOT NULL,
  startDate DATETIME NOT NULL,
  endDate DATETIME NOT NULL,
  isActive BOOLEAN DEFAULT 1,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- VULNERABILITY NOTE: The rental endpoint doesn't validate 'days' parameter
-- A user can rent for 999999 days, which causes an integer overflow hint

-- =====================================================
-- Table: Auction
-- =====================================================
CREATE TABLE Auction (
  id TEXT PRIMARY KEY,
  artworkId TEXT NOT NULL REFERENCES Artwork(id),
  startPrice REAL NOT NULL,
  currentPrice REAL NOT NULL,
  minBid REAL NOT NULL,
  startTime DATETIME NOT NULL,
  endTime DATETIME NOT NULL,
  isActive BOOLEAN DEFAULT 1,
  winnerId TEXT,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- VULNERABILITY NOTE: The bid endpoint doesn't validate minimum bid server-side
-- The client-side validation can be bypassed

-- =====================================================
-- Table: Bid
-- =====================================================
CREATE TABLE Bid (
  id TEXT PRIMARY KEY,
  userId TEXT NOT NULL REFERENCES User(id) ON DELETE CASCADE,
  auctionId TEXT NOT NULL REFERENCES Auction(id),
  amount REAL NOT NULL,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- Table: FlagSubmission
-- =====================================================
CREATE TABLE FlagSubmission (
  id TEXT PRIMARY KEY,
  userId TEXT NOT NULL REFERENCES User(id) ON DELETE CASCADE,
  flag TEXT NOT NULL,
  tier TEXT NOT NULL,
  points INTEGER NOT NULL,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- Table: HiddenLog
-- =====================================================
CREATE TABLE HiddenLog (
  id TEXT PRIMARY KEY,
  eventType TEXT NOT NULL,
  message TEXT NOT NULL,
  metadata TEXT,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- System logs contain vulnerability hints and flag references
-- Access via /api/internal/stats (no auth required!)
