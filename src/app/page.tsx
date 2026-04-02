'use client'

import React, { useState, useEffect, useRef } from 'react'
import {
  Search, Eye, EyeOff, Send, Loader2, RefreshCw,
  Lock, Info, ExternalLink, Menu, X, Heart,
  Star, Award, Shield, FileCheck, Users, ChevronRight,
  Gavel, Palette, Image as ImageIcon, Clock, ArrowRight,
  CheckCircle2, XCircle, AlertTriangle, ChevronDown, ChevronUp,
  Zap, Terminal, UserPlus, LogOut, User, DollarSign
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { ScrollArea } from '@/components/ui/scroll-area'
import { motion, AnimatePresence } from 'framer-motion'

// ============ ART DATA ============
const artworks = [
  { id: 1, title: "Crimson Resonance", artist: "Elena Vasquez", image: "/art/crimson-gold.jpg", medium: "Oil on Canvas", year: 2023, startingBid: 12500, category: "Abstract" },
  { id: 2, title: "Temporal Drift", artist: "Marcus Chen", image: "/art/surreal-dreams.jpg", medium: "Oil on Canvas", year: 2022, startingBid: 18750, category: "Surrealism" },
  { id: 3, title: "Golden Ratio", artist: "Sarah Mitchell", image: "/art/geometric-navy.jpg", medium: "Acrylic on Canvas", year: 2024, startingBid: 8900, category: "Minimalist" },
  { id: 4, title: "Sakura Dreams", artist: "Yuki Tanaka", image: "/art/cherry-blossoms.jpg", medium: "Watercolor", year: 2023, startingBid: 6200, category: "Impressionist" },
  { id: 5, title: "Neon Requiem", artist: "Alex Rivera", image: "/art/neon-city.jpg", medium: "Digital Art", year: 2024, startingBid: 15000, category: "Contemporary" },
  { id: 6, title: "The Duchess", artist: "Isabella Romano", image: "/art/renaissance-portrait.jpg", medium: "Oil on Canvas", year: 2021, startingBid: 32000, category: "Classical" },
  { id: 7, title: "Emerald Depths", artist: "Oliver Blackwood", image: "/art/emerald-fluid.jpg", medium: "Mixed Media", year: 2024, startingBid: 11500, category: "Abstract" },
  { id: 8, title: "Pop Explosion", artist: "Jamie Watts", image: "/art/pop-art.jpg", medium: "Acrylic on Canvas", year: 2023, startingBid: 7500, category: "Pop Art" },
  { id: 9, title: "Earth Rhythms", artist: "Amara Okafor", image: "/art/earth-rhythms.jpg", medium: "Acrylic on Canvas", year: 2024, startingBid: 9800, category: "Contemporary" },
  { id: 10, title: "Golden Peaks", artist: "Thomas Ashford", image: "/art/golden-peaks.jpg", medium: "Oil on Canvas", year: 2023, startingBid: 14200, category: "Landscape" },
  { id: 11, title: "Cosmic Nebula", artist: "Dr. Aisha Patel", image: "/art/cosmic-nebula.jpg", medium: "Oil on Canvas", year: 2024, startingBid: 22000, category: "Space Art" },
  { id: 12, title: "Cubist Reverie", artist: "Jean-Pierre Moreau", image: "/art/cubist-still-life.jpg", medium: "Oil on Canvas", year: 2022, startingBid: 16500, category: "Cubism" },
  { id: 13, title: "Ocean Horizon", artist: "Catalina Reyes", image: "/art/ocean-sunset.jpg", medium: "Oil on Canvas", year: 2023, startingBid: 11000, category: "Impressionist" },
  { id: 14, title: "Autumn Impasto", artist: "Henrik Larsson", image: "/art/autumn-impasto.jpg", medium: "Palette Knife", year: 2024, startingBid: 8400, category: "Abstract" },
  { id: 15, title: "Enchanted Grove", artist: "Luna Kimura", image: "/art/enchanted-forest.jpg", medium: "Oil on Canvas", year: 2024, startingBid: 13500, category: "Fantasy" },
  { id: 16, title: "Zen Waters", artist: "Master Takeshi", image: "/art/zen-waters.jpg", medium: "Ink Wash", year: 2023, startingBid: 7800, category: "Minimalist" },
]

type ViewId = 'gallery' | 'reviews' | 'provenance' | 'certificates' | 'collectors'
type AuthModalTab = 'login' | 'signup'
type LoggedInUser = { id: string; username: string; role: string; email: string }

// ============ MAIN APP ============
export default function Home() {
  const [currentView, setCurrentView] = useState<ViewId>('gallery')
  const [authOpen, setAuthOpen] = useState(false)
  const [authTab, setAuthTab] = useState<AuthModalTab>('login')
  const [currentUser, setCurrentUser] = useState<LoggedInUser | null>(null)
  const [pendingBid, setPendingBid] = useState<typeof artworks[0] | null>(null)
  const [bidArtwork, setBidArtwork] = useState<typeof artworks[0] | null>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResultsHtml, setSearchResultsHtml] = useState('')
  const [searching, setSearching] = useState(false)
  const [bidAmount, setBidAmount] = useState('')
  const [bidPlaced, setBidPlaced] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)
  const userMenuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetch('/api/seed', { method: 'POST' }).catch(() => {})
  }, [])

  // Close user menu when clicking outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handlePlaceBid = (artwork: typeof artworks[0]) => {
    if (!currentUser) {
      setPendingBid(artwork)
      setAuthTab('login')
      setAuthOpen(true)
    } else {
      setBidArtwork(artwork)
      setBidAmount('')
      setBidPlaced(false)
    }
  }

  const handleAuthSuccess = (user: LoggedInUser) => {
    setCurrentUser(user)
    setAuthOpen(false)
    // If there was a pending bid, open the bid form now
    if (pendingBid) {
      setBidArtwork(pendingBid)
      setBidAmount('')
      setBidPlaced(false)
      setPendingBid(null)
    }
  }

  const handleLogout = () => {
    setCurrentUser(null)
    setBidArtwork(null)
    setUserMenuOpen(false)
  }

  const handleSearch = async () => {
    if (!searchQuery) return
    setSearching(true)
    setSearchResultsHtml('')
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`)
      const html = await res.text()
      setSearchResultsHtml(html)
      setCurrentView('gallery')
      setTimeout(() => searchRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100)
    } catch (e: any) {
      setSearchResultsHtml(`<div style="color:#c9a96e;padding:16px;text-align:center;">Search unavailable. Please try again.</div>`)
    }
    setSearching(false)
  }

  const navItems: { id: ViewId; label: string; icon: React.ReactNode }[] = [
    { id: 'gallery', label: 'Gallery', icon: <Palette className="w-4 h-4" /> },
    { id: 'reviews', label: 'Reviews', icon: <Star className="w-4 h-4" /> },
    { id: 'provenance', label: 'Provenance', icon: <Shield className="w-4 h-4" /> },
    { id: 'certificates', label: 'Certificates', icon: <Award className="w-4 h-4" /> },
    { id: 'collectors', label: 'Collectors', icon: <Users className="w-4 h-4" /> },
  ]

  const roleBadgeColor: Record<string, string> = {
    admin: 'bg-red-500/20 text-red-400 border-red-500/30',
    manager: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    dbadmin: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    auditor: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
    user: 'bg-[#c9a96e]/20 text-[#c9a96e] border-[#c9a96e]/30',
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Mobile menu overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 z-40 lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* ============ HEADER ============ */}
      <header className="sticky top-0 z-50 bg-[#0a0a0a]/90 backdrop-blur-md border-b border-[#c9a96e]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <img src="/art/logo.png" alt="VulnArt" className="w-9 h-9 rounded-lg" />
              <div className="hidden sm:block">
                <h1 className="text-lg font-bold text-[#f5f0e8] tracking-tight leading-none">VulnArt</h1>
                <p className="text-[9px] text-[#c9a96e]/70 uppercase tracking-[0.2em]">Fine Art Auction House</p>
              </div>
            </div>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-1">
              {navItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => setCurrentView(item.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2
                    ${currentView === item.id
                      ? 'bg-[#c9a96e]/10 text-[#c9a96e] border border-[#c9a96e]/20'
                      : 'text-[#888] hover:text-[#f5f0e8] hover:bg-white/[0.04] border border-transparent'
                    }`}
                >
                  {item.icon}
                  {item.label}
                </button>
              ))}
            </nav>

            {/* Right side - Auth */}
            <div className="flex items-center gap-3">
              {currentUser ? (
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="hidden sm:flex items-center gap-2 bg-[#c9a96e]/10 hover:bg-[#c9a96e]/15 border border-[#c9a96e]/25 rounded-lg px-3 py-1.5 transition-all"
                  >
                    <div className="w-6 h-6 rounded-full bg-[#c9a96e]/20 flex items-center justify-center">
                      <User className="w-3.5 h-3.5 text-[#c9a96e]" />
                    </div>
                    <span className="text-xs font-medium text-[#f5f0e8]">{currentUser.username}</span>
                    <Badge className={`text-[8px] px-1.5 py-0 ${roleBadgeColor[currentUser.role] || roleBadgeColor.user}`}>
                      {currentUser.role}
                    </Badge>
                    <ChevronDown className="w-3 h-3 text-[#888]" />
                  </button>

                  {/* User Dropdown Menu */}
                  <AnimatePresence>
                    {userMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -5, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -5, scale: 0.95 }}
                        className="absolute right-0 mt-2 w-64 bg-[#141414] border border-[#c9a96e]/15 rounded-xl shadow-xl overflow-hidden z-[70]"
                      >
                        <div className="p-4 border-b border-[#c9a96e]/10">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#c9a96e] to-[#8b6f3a] flex items-center justify-center text-[#0a0a0a] font-bold text-sm">
                              {currentUser.username[0].toUpperCase()}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold text-[#f5f0e8] truncate">{currentUser.username}</p>
                              <p className="text-[10px] text-[#888] truncate">{currentUser.email}</p>
                              <Badge className={`text-[8px] mt-1 ${roleBadgeColor[currentUser.role] || roleBadgeColor.user}`}>
                                {currentUser.role.toUpperCase()}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <div className="p-2">
                          <div className="flex items-center gap-2 px-3 py-2 rounded-lg text-[11px] text-[#888]">
                            <User className="w-3.5 h-3.5" />
                            <span>ID: {currentUser.id}</span>
                          </div>
                          <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-red-400 hover:bg-red-500/10 transition-colors mt-1"
                          >
                            <LogOut className="w-3.5 h-3.5" />
                            Sign Out
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Button
                  onClick={() => { setPendingBid(null); setAuthTab('login'); setAuthOpen(true) }}
                  className="hidden sm:flex bg-[#c9a96e]/10 text-[#c9a96e] hover:bg-[#c9a96e]/20 border border-[#c9a96e]/25 text-xs font-medium items-center gap-2"
                >
                  <Lock className="w-3.5 h-3.5" />
                  Member Login
                </Button>
              )}
              <button
                className="lg:hidden p-2 rounded-lg hover:bg-white/[0.06] text-[#888]"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Nav */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="lg:hidden overflow-hidden border-t border-[#c9a96e]/10 bg-[#0a0a0a]/95 backdrop-blur-md"
            >
              <div className="px-4 py-3 space-y-1">
                {navItems.map(item => (
                  <button
                    key={item.id}
                    onClick={() => { setCurrentView(item.id); setMobileMenuOpen(false) }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-all
                      ${currentView === item.id
                        ? 'bg-[#c9a96e]/10 text-[#c9a96e]'
                        : 'text-[#888] hover:bg-white/[0.04]'
                      }`}
                  >
                    {item.icon}
                    {item.label}
                  </button>
                ))}
                {currentUser ? (
                  <>
                    <div className="flex items-center gap-3 px-4 py-3 mt-2 border-t border-[#c9a96e]/10">
                      <div className="w-8 h-8 rounded-full bg-[#c9a96e]/20 flex items-center justify-center">
                        <User className="w-4 h-4 text-[#c9a96e]" />
                      </div>
                      <div>
                        <p className="text-sm text-[#f5f0e8]">{currentUser.username}</p>
                        <Badge className={`text-[8px] ${roleBadgeColor[currentUser.role] || roleBadgeColor.user}`}>
                          {currentUser.role}
                        </Badge>
                      </div>
                    </div>
                    <button
                      onClick={() => { handleLogout(); setMobileMenuOpen(false) }}
                      className="w-full flex items-center gap-2 px-4 py-3 rounded-lg text-sm text-red-400"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => { setPendingBid(null); setAuthTab('login'); setAuthOpen(true); setMobileMenuOpen(false) }}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-[#c9a96e]/10 text-[#c9a96e] text-sm mt-2"
                  >
                    <Lock className="w-4 h-4" />
                    Member Login
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* ============ MAIN CONTENT ============ */}
      <main className="max-w-7xl mx-auto">
        {/* Hero Section */}
        {currentView === 'gallery' && (
          <section className="relative overflow-hidden">
            <div className="relative h-[50vh] sm:h-[55vh] lg:h-[60vh]">
              <img
                src="/art/renaissance-portrait.jpg"
                alt="Featured artwork"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/50 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a]/60 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10 lg:p-16">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                  className="max-w-2xl"
                >
                  <Badge className="bg-[#c9a96e]/20 text-[#c9a96e] border-[#c9a96e]/30 text-[10px] uppercase tracking-wider mb-4">
                    <Gavel className="w-3 h-3 mr-1" />
                    Live Auction
                  </Badge>
                  <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#f5f0e8] mb-3 leading-tight">
                    The Duchess
                  </h2>
                  <p className="text-sm sm:text-base text-[#c9a96e]/80 mb-1">
                    by Isabella Romano
                  </p>
                  <p className="text-xs text-[#888] mb-4">
                    Oil on Canvas • 2021 • Classical Collection
                  </p>
                  <div className="flex items-end gap-3">
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-[#888] mb-1">Current Bid</p>
                      <p className="text-2xl sm:text-3xl font-bold text-[#c9a96e]">$32,000</p>
                    </div>
                    <Button
                      onClick={() => handlePlaceBid(artworks[5])}
                      className="bg-[#c9a96e] text-[#0a0a0a] hover:bg-[#d4b87d] font-semibold text-sm"
                    >
                      <Gavel className="w-4 h-4 mr-2" />
                      Place Bid
                    </Button>
                  </div>
                </motion.div>
              </div>
            </div>
          </section>
        )}

        {/* Search Bar */}
        <div ref={searchRef} className="sticky top-16 z-30 bg-[#0a0a0a]/95 backdrop-blur-md border-b border-[#c9a96e]/5 py-4 px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#555]" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Search our collection..."
                className="pl-10 bg-[#141414] border-[#c9a96e]/15 text-[#f5f0e8] placeholder:text-[#444] focus:border-[#c9a96e]/40 text-sm rounded-lg"
              />
            </div>
            <Button
              onClick={handleSearch}
              disabled={searching || !searchQuery}
              className="bg-[#c9a96e]/10 text-[#c9a96e] hover:bg-[#c9a96e]/20 border border-[#c9a96e]/25 rounded-lg"
            >
              {searching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        {/* Search Results (XSS) */}
        {searchResultsHtml && currentView === 'gallery' && (
          <div className="px-4 sm:px-6 lg:px-8 py-4">
            <div className="max-w-2xl mx-auto">
              <div className="flex items-center gap-2 mb-3">
                <Search className="w-4 h-4 text-[#c9a96e]" />
                <span className="text-xs text-[#888]">Search Results</span>
              </div>
              <div
                className="bg-[#111] border border-[#c9a96e]/10 rounded-xl overflow-hidden"
                dangerouslySetInnerHTML={{ __html: searchResultsHtml }}
              />
              <button
                onClick={() => setSearchResultsHtml('')}
                className="text-[10px] text-[#666] mt-2 hover:text-[#c9a96e] transition-colors"
              >
                Clear results
              </button>
            </div>
          </div>
        )}

        {/* ============ VIEWS ============ */}
        <div className="px-4 sm:px-6 lg:px-8 pb-16">
          {/* Gallery View */}
          {currentView === 'gallery' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="pt-8"
            >
              <div className="text-center mb-8">
                <h2 className="text-2xl sm:text-3xl font-bold text-[#f5f0e8] mb-2">The Collection</h2>
                <p className="text-sm text-[#888]">16 curated masterpieces from renowned artists worldwide</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {artworks.map((artwork, index) => (
                  <motion.div
                    key={artwork.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.08, duration: 0.5 }}
                  >
                    <Card className="bg-[#111] border-[#c9a96e]/8 overflow-hidden group hover:border-[#c9a96e]/25 transition-all duration-300 hover:shadow-[0_0_30px_rgba(201,169,110,0.08)]">
                      <div className="relative overflow-hidden aspect-[4/3]">
                        <img
                          src={artwork.image}
                          alt={artwork.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute top-3 left-3">
                          <Badge className="bg-black/60 text-[#c9a96e] border-[#c9a96e]/30 text-[10px] backdrop-blur-sm">
                            {artwork.category}
                          </Badge>
                        </div>
                        <div className="absolute top-3 right-3">
                          <button className="w-8 h-8 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-[#f5f0e8]/60 hover:text-red-400 transition-colors">
                            <Heart className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <div>
                            <h3 className="font-semibold text-[#f5f0e8] text-sm leading-tight">{artwork.title}</h3>
                            <p className="text-[11px] text-[#c9a96e]/70 mt-0.5">{artwork.artist}</p>
                          </div>
                        </div>
                        <p className="text-[10px] text-[#666] mt-2">{artwork.medium} • {artwork.year}</p>
                        <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#c9a96e]/8">
                          <div>
                            <p className="text-[9px] uppercase tracking-wider text-[#666]">Starting Bid</p>
                            <p className="text-lg font-bold text-[#c9a96e]">${artwork.startingBid.toLocaleString()}</p>
                          </div>
                          <Button
                            size="sm"
                            onClick={() => handlePlaceBid(artwork)}
                            className="bg-[#c9a96e]/10 text-[#c9a96e] hover:bg-[#c9a96e]/25 border border-[#c9a96e]/25 text-xs h-8"
                          >
                            <Gavel className="w-3 h-3 mr-1" />
                            Bid
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Reviews View (Stored XSS) */}
          {currentView === 'reviews' && <ReviewsSection />}
          {currentView === 'provenance' && <ProvenanceSection />}
          {currentView === 'certificates' && <CertificateSection />}
          {currentView === 'collectors' && <CollectorSection />}
        </div>

        {/* Footer */}
        <footer className="border-t border-[#c9a96e]/8 py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <img src="/art/logo.png" alt="" className="w-6 h-6 rounded" />
              <span className="text-xs text-[#555]">© 2025 VulnArt — Developed by <span className="text-[#c9a96e]/60">Cysec Don</span></span>
            </div>
            <div className="flex items-center gap-4 text-[10px] text-[#555]">
              <span>Privacy Policy</span>
              <span>Terms of Service</span>
              <span>Contact</span>
            </div>
          </div>
        </footer>
      </main>

      {/* ============ AUTH MODAL (Login / Signup with SQL Injection) ============ */}
      <AnimatePresence>
        {authOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[60] flex items-center justify-center p-4"
            onClick={() => setAuthOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-[#111] border border-[#c9a96e]/15 rounded-2xl w-full max-w-md overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="relative h-28 bg-gradient-to-br from-[#c9a96e]/20 to-transparent flex items-center justify-center">
                <div className="text-center">
                  {authTab === 'login' ? (
                    <Lock className="w-8 h-8 text-[#c9a96e] mx-auto mb-2" />
                  ) : (
                    <UserPlus className="w-8 h-8 text-[#c9a96e] mx-auto mb-2" />
                  )}
                  <h3 className="text-lg font-bold text-[#f5f0e8]">
                    {pendingBid ? `Bid on "${pendingBid.title}"` : authTab === 'login' ? 'Member Login' : 'Create Account'}
                  </h3>
                  <p className="text-xs text-[#888] mt-1">
                    {pendingBid
                      ? 'Sign in to place your bid'
                      : authTab === 'login' ? 'Sign in to place bids and manage your collection' : 'Join VulnArt to bid on exclusive pieces'
                    }
                  </p>
                </div>
                <button
                  onClick={() => setAuthOpen(false)}
                  className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/30 flex items-center justify-center text-[#888] hover:text-[#f5f0e8]"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Tabs */}
              <div className="flex border-b border-[#c9a96e]/10">
                <button
                  onClick={() => setAuthTab('login')}
                  className={`flex-1 py-3 text-xs font-medium transition-colors relative
                    ${authTab === 'login' ? 'text-[#c9a96e]' : 'text-[#666] hover:text-[#999]'}`}
                >
                  Sign In
                  {authTab === 'login' && <motion.div layoutId="auth-tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#c9a96e]" />}
                </button>
                <button
                  onClick={() => setAuthTab('signup')}
                  className={`flex-1 py-3 text-xs font-medium transition-colors relative
                    ${authTab === 'signup' ? 'text-[#c9a96e]' : 'text-[#666] hover:text-[#999]'}`}
                >
                  Create Account
                  {authTab === 'signup' && <motion.div layoutId="auth-tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#c9a96e]" />}
                </button>
              </div>

              {/* Tab Content */}
              <div className="p-6">
                {authTab === 'login' ? (
                  <LoginForm onSuccess={handleAuthSuccess} pendingBid={pendingBid} />
                ) : (
                  <SignupForm onSuccess={handleAuthSuccess} onSwitchToLogin={() => setAuthTab('login')} />
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ============ BID MODAL ============ */}
      <AnimatePresence>
        {bidArtwork && currentUser && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[60] flex items-center justify-center p-4"
            onClick={() => setBidArtwork(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-[#111] border border-[#c9a96e]/15 rounded-2xl w-full max-w-md overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Artwork preview */}
              <div className="relative h-40 overflow-hidden">
                <img
                  src={bidArtwork.image}
                  alt={bidArtwork.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#111] via-transparent to-transparent" />
                <button
                  onClick={() => setBidArtwork(null)}
                  className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-[#888] hover:text-[#f5f0e8]"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <h3 className="text-lg font-bold text-[#f5f0e8]">{bidArtwork.title}</h3>
                  <p className="text-xs text-[#c9a96e]/70">{bidArtwork.artist} • {bidArtwork.medium}</p>
                </div>

                <div className="bg-[#0a0a0a] rounded-lg p-3 border border-[#c9a96e]/8">
                  <p className="text-[9px] uppercase tracking-wider text-[#666] mb-1">Current Starting Bid</p>
                  <p className="text-xl font-bold text-[#c9a96e]">${bidArtwork.startingBid.toLocaleString()}</p>
                </div>

                {!bidPlaced ? (
                  <>
                    <div className="space-y-1.5">
                      <label className="text-[11px] text-[#888] font-medium uppercase tracking-wider">Your Bid Amount ($)</label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#555]" />
                        <Input
                          type="number"
                          value={bidAmount}
                          onChange={(e) => setBidAmount(e.target.value)}
                          placeholder={bidArtwork.startingBid.toString()}
                          min={bidArtwork.startingBid}
                          className="pl-9 bg-[#0a0a0a] border-[#c9a96e]/15 text-[#f5f0e8] placeholder:text-[#444] text-sm"
                          onKeyDown={(e) => e.key === 'Enter' && setBidPlaced(true)}
                        />
                      </div>
                    </div>

                    <Button
                      onClick={() => setBidPlaced(true)}
                      disabled={!bidAmount || Number(bidAmount) < bidArtwork.startingBid}
                      className="w-full bg-[#c9a96e] text-[#0a0a0a] hover:bg-[#d4b87d] font-semibold text-sm"
                    >
                      <Gavel className="w-4 h-4 mr-2" />
                      Confirm Bid
                    </Button>
                    {bidAmount && Number(bidAmount) < bidArtwork.startingBid && (
                      <p className="text-[10px] text-red-400 text-center">
                        Bid must be at least ${bidArtwork.startingBid.toLocaleString()}
                      </p>
                    )}
                  </>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-4"
                  >
                    <CheckCircle2 className="w-12 h-12 text-[#c9a96e] mx-auto mb-3" />
                    <h4 className="text-lg font-bold text-[#f5f0e8] mb-1">Bid Placed!</h4>
                    <p className="text-2xl font-bold text-[#c9a96e] mb-2">${Number(bidAmount).toLocaleString()}</p>
                    <p className="text-xs text-[#888]">on &ldquo;{bidArtwork.title}&rdquo; by {bidArtwork.artist}</p>
                    <p className="text-[10px] text-[#666] mt-3">Bidding as <span className="text-[#c9a96e]">{currentUser.username}</span></p>
                    <Button
                      onClick={() => setBidArtwork(null)}
                      className="mt-4 bg-[#c9a96e]/10 text-[#c9a96e] hover:bg-[#c9a96e]/20 border border-[#c9a96e]/25 text-xs"
                    >
                      Continue Browsing
                    </Button>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ============ LOGIN FORM (SQL Injection) ============
function LoginForm({ onSuccess, pendingBid }: { onSuccess: (user: any) => void; pendingBid: typeof artworks[0] | null }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{ success: boolean; message?: string; user?: any; error?: string } | null>(null)
  const [rawQuery, setRawQuery] = useState('')

  const handleLogin = async () => {
    setLoading(true)
    setResult(null)
    setRawQuery('')
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      })
      const data = await res.json()
      setResult(data)
      setRawQuery(`SELECT * FROM User WHERE username = '${username}' AND password = '${password}'`)
      if (data.success && data.user) {
        setTimeout(() => onSuccess(data.user), 800)
      }
    } catch (e: any) {
      setResult({ success: false, error: 'Connection error: ' + e.message })
    }
    setLoading(false)
  }

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        <div className="space-y-1.5">
          <label className="text-[11px] text-[#888] font-medium uppercase tracking-wider">Username or Email</label>
          <Input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="admin"
            className="bg-[#0a0a0a] border-[#c9a96e]/15 text-[#f5f0e8] placeholder:text-[#444] text-sm"
            onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-[11px] text-[#888] font-medium uppercase tracking-wider">Password</label>
          <div className="relative">
            <Input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              className="bg-[#0a0a0a] border-[#c9a96e]/15 text-[#f5f0e8] placeholder:text-[#444] text-sm pr-10"
              onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
            />
            <button
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#555] hover:text-[#999]"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>
        <Button
          onClick={handleLogin}
          disabled={loading || !username || !password}
          className="w-full bg-[#c9a96e] text-[#0a0a0a] hover:bg-[#d4b87d] font-semibold text-sm"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
          <span className="ml-2">Sign In</span>
        </Button>
      </div>

      <div className="text-center">
        <p className="text-[10px] text-[#555]">
          Test accounts: <span className="text-[#c9a96e]/60 font-mono">admin / admin123</span> &bull;{' '}
          <span className="text-[#c9a96e]/60 font-mono">user / user123</span>
        </p>
      </div>

      {rawQuery && (
        <div className="space-y-1">
          <p className="text-[9px] text-[#555] uppercase tracking-wider">Query Debug</p>
          <div className="bg-[#0a0a0a] border border-[#c9a96e]/8 rounded-lg p-2.5">
            <code className="text-[10px] text-[#ff6666]/70 font-mono break-all">{rawQuery}</code>
          </div>
        </div>
      )}

      {result && (
        <div className={`rounded-lg border p-3 ${result.success ? 'bg-[#c9a96e]/5 border-[#c9a96e]/20' : 'bg-red-500/5 border-red-500/20'}`}>
          <div className="flex items-center gap-2 mb-1.5">
            {result.success
              ? <CheckCircle2 className="w-4 h-4 text-[#c9a96e]" />
              : <XCircle className="w-4 h-4 text-red-400" />
            }
            <span className={`text-xs font-medium ${result.success ? 'text-[#c9a96e]' : 'text-red-400'}`}>
              {result.success ? `Welcome back, ${result.user?.username}!` : 'Authentication Failed'}
            </span>
          </div>
          <pre className="text-[10px] text-[#888] font-mono whitespace-pre-wrap">{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  )
}

// ============ SIGNUP FORM ============
function SignupForm({ onSuccess, onSwitchToLogin }: { onSuccess: (user: any) => void; onSwitchToLogin: () => void }) {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{ success: boolean; message?: string; user?: any; error?: string } | null>(null)

  const handleSignup = async () => {
    setLoading(true)
    setResult(null)

    if (password !== confirmPassword) {
      setResult({ success: false, error: 'Passwords do not match' })
      setLoading(false)
      return
    }

    try {
      const res = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, email }),
      })
      const data = await res.json()
      setResult(data)
      if (data.success && data.user) {
        setTimeout(() => onSuccess(data.user), 800)
      }
    } catch (e: any) {
      setResult({ success: false, error: 'Connection error: ' + e.message })
    }
    setLoading(false)
  }

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        <div className="space-y-1.5">
          <label className="text-[11px] text-[#888] font-medium uppercase tracking-wider">Username</label>
          <Input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Choose a username"
            className="bg-[#0a0a0a] border-[#c9a96e]/15 text-[#f5f0e8] placeholder:text-[#444] text-sm"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-[11px] text-[#888] font-medium uppercase tracking-wider">Email</label>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            className="bg-[#0a0a0a] border-[#c9a96e]/15 text-[#f5f0e8] placeholder:text-[#444] text-sm"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-[11px] text-[#888] font-medium uppercase tracking-wider">Password</label>
          <div className="relative">
            <Input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type={showPassword ? 'text' : 'password'}
              placeholder="Min 6 characters"
              className="bg-[#0a0a0a] border-[#c9a96e]/15 text-[#f5f0e8] placeholder:text-[#444] text-sm pr-10"
            />
            <button
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#555] hover:text-[#999]"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>
        <div className="space-y-1.5">
          <label className="text-[11px] text-[#888] font-medium uppercase tracking-wider">Confirm Password</label>
          <Input
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            type="password"
            placeholder="••••••••"
            className="bg-[#0a0a0a] border-[#c9a96e]/15 text-[#f5f0e8] placeholder:text-[#444] text-sm"
            onKeyDown={(e) => e.key === 'Enter' && handleSignup()}
          />
        </div>
        <Button
          onClick={handleSignup}
          disabled={loading || !username || !email || !password || !confirmPassword}
          className="w-full bg-[#c9a96e] text-[#0a0a0a] hover:bg-[#d4b87d] font-semibold text-sm"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserPlus className="w-4 h-4" />}
          <span className="ml-2">Create Account</span>
        </Button>
      </div>

      <div className="text-center">
        <p className="text-[10px] text-[#555]">
          Already have an account?{' '}
          <button onClick={onSwitchToLogin} className="text-[#c9a96e] hover:underline">Sign in</button>
        </p>
      </div>

      {result && (
        <div className={`rounded-lg border p-3 ${result.success ? 'bg-[#c9a96e]/5 border-[#c9a96e]/20' : 'bg-red-500/5 border-red-500/20'}`}>
          <div className="flex items-center gap-2 mb-1.5">
            {result.success
              ? <CheckCircle2 className="w-4 h-4 text-[#c9a96e]" />
              : <XCircle className="w-4 h-4 text-red-400" />
            }
            <span className={`text-xs font-medium ${result.success ? 'text-[#c9a96e]' : 'text-red-400'}`}>
              {result.success ? `Welcome, ${result.user?.username}!` : (result.error || 'Signup failed')}
            </span>
          </div>
          {result.success && (
            <p className="text-[10px] text-[#888]">Your account has been created. You can now place bids.</p>
          )}
        </div>
      )}
    </div>
  )
}

// ============ REVIEWS SECTION (Stored XSS) ============
function ReviewsSection() {
  const [author, setAuthor] = useState('')
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)
  const [htmlResult, setHtmlResult] = useState('')

  const loadReviews = async () => {
    try {
      const res = await fetch('/api/comments')
      const html = await res.text()
      setHtmlResult(html)
    } catch {}
  }

  useEffect(() => {
    let mounted = true
    fetch('/api/comments')
      .then(res => res.text())
      .then(html => { if (mounted) setHtmlResult(html) })
      .catch(() => {})
    return () => { mounted = false }
  }, [])

  const handleSubmit = async () => {
    setLoading(true)
    try {
      await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ author, content }),
      })
      setAuthor('')
      setContent('')
      loadReviews()
    } catch {}
    setLoading(false)
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pt-8 max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-[#f5f0e8] mb-2">Collector Reviews</h2>
        <p className="text-sm text-[#888]">Share your thoughts on our collection</p>
      </div>

      <Card className="bg-[#111] border-[#c9a96e]/8 mb-8">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm text-[#f5f0e8] flex items-center gap-2">
            <Star className="w-4 h-4 text-[#c9a96e]" />
            Write a Review
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Input
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder="Your name..."
            className="bg-[#0a0a0a] border-[#c9a96e]/15 text-[#f5f0e8] placeholder:text-[#444] text-sm"
          />
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Share your experience with our collection..."
            className="bg-[#0a0a0a] border-[#c9a96e]/15 text-[#f5f0e8] placeholder:text-[#444] text-sm min-h-[80px]"
            rows={3}
          />
          <div className="flex gap-2">
            <Button
              onClick={handleSubmit}
              disabled={loading || !author || !content}
              className="bg-[#c9a96e] text-[#0a0a0a] hover:bg-[#d4b87d] text-sm font-semibold"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              <span className="ml-2">Submit Review</span>
            </Button>
            <Button onClick={loadReviews} variant="outline" className="border-[#c9a96e]/15 text-[#888] text-sm">
              <RefreshCw className="w-4 h-4 mr-1" /> Refresh
            </Button>
          </div>
        </CardContent>
      </Card>

      {htmlResult && (
        <div
          className="bg-[#111] border border-[#c9a96e]/10 rounded-xl overflow-hidden"
          dangerouslySetInnerHTML={{ __html: htmlResult }}
        />
      )}
    </motion.div>
  )
}

// ============ PROVENANCE SECTION (Command Injection) ============
function ProvenanceSection() {
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{ success: boolean; command: string; output: string } | null>(null)

  const handleVerify = async () => {
    setLoading(true)
    setResult(null)
    try {
      const res = await fetch('/api/ping', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ host: code }),
      })
      const data = await res.json()
      setResult(data)
    } catch (e: any) {
      setResult({ success: false, command: '', output: 'Error: ' + e.message })
    }
    setLoading(false)
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pt-8 max-w-3xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-[#f5f0e8] mb-2">Verify Provenance</h2>
        <p className="text-sm text-[#888]">Authenticate artwork history and chain of custody</p>
      </div>

      <Card className="bg-[#111] border-[#c9a96e]/8">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm text-[#f5f0e8] flex items-center gap-2">
            <Shield className="w-4 h-4 text-[#c9a96e]" />
            Provenance Verification System
          </CardTitle>
          <CardDescription className="text-xs text-[#666]">
            Enter the artwork verification code or auction house server address to verify provenance records.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#444] text-xs font-mono">›</span>
              <Input
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="auction-server-01"
                className="pl-7 bg-[#0a0a0a] border-[#c9a96e]/15 text-[#f5f0e8] placeholder:text-[#444] font-mono text-sm"
                onKeyDown={(e) => e.key === 'Enter' && handleVerify()}
              />
            </div>
            <Button onClick={handleVerify} disabled={loading || !code} className="bg-[#c9a96e] text-[#0a0a0a] hover:bg-[#d4b87d] text-sm font-semibold">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              <span className="ml-2">Verify</span>
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="text-[10px] text-[#555]">Try:</span>
            {['auction-server-01', '127.0.0.1', 'provenance-db.local'].map(v => (
              <button key={v} onClick={() => setCode(v)}
                className="text-[10px] px-2 py-0.5 rounded bg-[#c9a96e]/5 text-[#888] hover:text-[#c9a96e] hover:bg-[#c9a96e]/10 transition-colors font-mono border border-[#c9a96e]/8">
                {v}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {result && (
        <div className="mt-6 space-y-3">
          <div className="bg-[#0a0a0a] border border-[#c9a96e]/8 rounded-lg p-2.5">
            <code className="text-[10px] text-[#c9a96e]/60 font-mono">$ {result.command}</code>
          </div>
          <div className="bg-[#0a0a0a] border border-[#c9a96e]/8 rounded-lg p-4 max-h-72 overflow-y-auto">
            <pre className="text-xs text-[#ccc] font-mono whitespace-pre-wrap">{result.output}</pre>
          </div>
        </div>
      )}
    </motion.div>
  )
}

// ============ CERTIFICATE SECTION (Path Traversal) ============
function CertificateSection() {
  const [filename, setFilename] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{ success: boolean; file: string; path: string; content: string; error?: string } | null>(null)

  const handleView = async () => {
    setLoading(true)
    setResult(null)
    try {
      const res = await fetch(`/api/file?file=${encodeURIComponent(filename)}`)
      const data = await res.json()
      setResult(data)
    } catch (e: any) {
      setResult({ success: false, file: filename, path: '', content: '', error: e.message })
    }
    setLoading(false)
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pt-8 max-w-3xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-[#f5f0e8] mb-2">Certificate of Authenticity</h2>
        <p className="text-sm text-[#888]">View and verify artwork certificates</p>
      </div>

      <Card className="bg-[#111] border-[#c9a96e]/8">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm text-[#f5f0e8] flex items-center gap-2">
            <Award className="w-4 h-4 text-[#c9a96e]" />
            Certificate Lookup
          </CardTitle>
          <CardDescription className="text-xs text-[#666]">
            Enter the certificate reference number to view the authenticity document.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              value={filename}
              onChange={(e) => setFilename(e.target.value)}
              placeholder="COA-001"
              className="flex-1 bg-[#0a0a0a] border-[#c9a96e]/15 text-[#f5f0e8] placeholder:text-[#444] font-mono text-sm"
              onKeyDown={(e) => e.key === 'Enter' && handleView()}
            />
            <Button onClick={handleView} disabled={loading || !filename} className="bg-[#c9a96e] text-[#0a0a0a] hover:bg-[#d4b87d] text-sm font-semibold">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileCheck className="w-4 h-4" />}
              <span className="ml-2">View</span>
            </Button>
          </div>
          <div className="space-y-2">
            <span className="text-[10px] text-[#555]">Available certificates:</span>
            <div className="flex flex-wrap gap-2">
              {['application.log', 'error.log', 'access.log', 'hosts.log'].map(f => (
                <button key={f} onClick={() => setFilename(f)}
                  className="text-[10px] px-2.5 py-1 rounded-lg bg-[#c9a96e]/5 text-[#888] hover:text-[#c9a96e] hover:bg-[#c9a96e]/10 transition-colors font-mono border border-[#c9a96e]/8">
                  {f}
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {result && (
        <div className="mt-6 space-y-3">
          {result.success ? (
            <>
              <div className="flex items-center gap-2 text-xs text-[#888]">
                <FileCheck className="w-3.5 h-3.5 text-[#c9a96e]" />
                <span>Certificate: <code className="text-[#c9a96e]">{result.file}</code></span>
              </div>
              <div className="bg-[#0a0a0a] border border-[#c9a96e]/8 rounded-lg p-2">
                <code className="text-[9px] text-[#555] font-mono break-all">{result.path}</code>
              </div>
              <div className="bg-[#0a0a0a] border border-[#c9a96e]/8 rounded-lg p-4 max-h-72 overflow-y-auto">
                <pre className="text-xs text-[#ccc] font-mono whitespace-pre-wrap">{result.content}</pre>
              </div>
            </>
          ) : (
            <div className="rounded-lg border border-red-500/20 bg-red-500/5 p-4">
              <div className="flex items-center gap-2 mb-1">
                <XCircle className="w-4 h-4 text-red-400" />
                <span className="text-sm text-red-400">Certificate Not Found</span>
              </div>
              <pre className="text-[10px] text-[#888] font-mono">{result.error || JSON.stringify(result, null, 2)}</pre>
            </div>
          )}
        </div>
      )}
    </motion.div>
  )
}

// ============ COLLECTOR SECTION (IDOR) ============
function CollectorSection() {
  const [collectorId, setCollectorId] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{ success: boolean; user?: any; error?: string } | null>(null)

  const handleFetch = async () => {
    setLoading(true)
    setResult(null)
    try {
      const res = await fetch(`/api/user?id=${encodeURIComponent(collectorId)}`)
      const data = await res.json()
      setResult(data)
    } catch (e: any) {
      setResult({ success: false, error: e.message })
    }
    setLoading(false)
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pt-8 max-w-3xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-[#f5f0e8] mb-2">Collector Profiles</h2>
        <p className="text-sm text-[#888]">View verified collector information</p>
      </div>

      <Card className="bg-[#111] border-[#c9a96e]/8">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm text-[#f5f0e8] flex items-center gap-2">
            <Users className="w-4 h-4 text-[#c9a96e]" />
            Collector Lookup
          </CardTitle>
          <CardDescription className="text-xs text-[#666]">
            Enter a collector ID to view their profile and collection details.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              value={collectorId}
              onChange={(e) => setCollectorId(e.target.value)}
              placeholder="COL-001"
              className="flex-1 bg-[#0a0a0a] border-[#c9a96e]/15 text-[#f5f0e8] placeholder:text-[#444] font-mono text-sm"
              onKeyDown={(e) => e.key === 'Enter' && handleFetch()}
            />
            <Button onClick={handleFetch} disabled={loading || !collectorId} className="bg-[#c9a96e] text-[#0a0a0a] hover:bg-[#d4b87d] text-sm font-semibold">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Users className="w-4 h-4" />}
              <span className="ml-2">View</span>
            </Button>
          </div>
          <div className="space-y-2">
            <span className="text-[10px] text-[#555]">Featured collectors:</span>
            <div className="flex flex-wrap gap-2">
              {[
                { id: 'usr_admin_001', label: 'Elena Vasquez' },
                { id: 'usr_user_001', label: 'Marcus Chen' },
                { id: 'usr_mgr_001', label: 'Sarah Mitchell' },
                { id: 'usr_dbadmin_001', label: 'Oliver Blackwood' },
              ].map(c => (
                <button key={c.id} onClick={() => setCollectorId(c.id)}
                  className="text-[10px] px-2.5 py-1 rounded-lg bg-[#c9a96e]/5 text-[#888] hover:text-[#c9a96e] hover:bg-[#c9a96e]/10 transition-colors border border-[#c9a96e]/8">
                  {c.label}
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {result && (
        <div className="mt-6">
          {result.success ? (
            <Card className="bg-[#111] border-[#c9a96e]/15">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm text-[#f5f0e8] flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#c9a96e]" />
                    {result.user?.username}
                  </CardTitle>
                  <Badge className="bg-[#c9a96e]/20 text-[#c9a96e] border-[#c9a96e]/30 text-[10px]">
                    {result.user?.role}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: 'Email', value: result.user?.email },
                    { label: 'SSN', value: result.user?.ssn },
                    { label: 'Credit Card', value: result.user?.creditCard },
                    { label: 'Address', value: result.user?.address },
                    { label: 'User ID', value: result.user?.id },
                  ].map(item => (
                    <div key={item.label} className="space-y-0.5 col-span-2 sm:col-span-1">
                      <p className="text-[9px] uppercase tracking-wider text-[#666]">{item.label}</p>
                      <p className="text-xs text-[#f5f0e8] font-mono">{item.value}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="rounded-lg border border-red-500/20 bg-red-500/5 p-4">
              <div className="flex items-center gap-2 mb-1">
                <XCircle className="w-4 h-4 text-red-400" />
                <span className="text-sm text-red-400">Collector Not Found</span>
              </div>
              <pre className="text-[10px] text-[#888] font-mono">{result.error || JSON.stringify(result, null, 2)}</pre>
            </div>
          )}
        </div>
      )}
    </motion.div>
  )
}
