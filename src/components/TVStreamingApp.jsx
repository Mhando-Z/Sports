"use client";

import { useState, useEffect, useContext, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useFavorites } from "@/context/FavoritesContext";
import DataContext from "@/context/DataContext";

// ─── Icons (inline SVG to avoid extra deps) ───────────────────────────────────

const IconSearch = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    className="w-4 h-4"
  >
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.35-4.35" />
  </svg>
);
const IconStar = ({ filled }) => (
  <svg
    viewBox="0 0 24 24"
    fill={filled ? "currentColor" : "none"}
    stroke="currentColor"
    strokeWidth={2}
    className="w-4 h-4"
  >
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);
const IconTV = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    className="w-5 h-5"
  >
    <rect x="2" y="7" width="20" height="15" rx="2" ry="2" />
    <polyline points="17 2 12 7 7 2" />
  </svg>
);
const IconPlay = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <polygon points="5 3 19 12 5 21 5 3" />
  </svg>
);
const IconX = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    className="w-5 h-5"
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);
const IconMenu = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    className="w-5 h-5"
  >
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);
const IconGrid = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    className="w-4 h-4"
  >
    <rect x="3" y="3" width="7" height="7" />
    <rect x="14" y="3" width="7" height="7" />
    <rect x="14" y="14" width="7" height="7" />
    <rect x="3" y="14" width="7" height="7" />
  </svg>
);
const IconList = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    className="w-4 h-4"
  >
    <line x1="8" y1="6" x2="21" y2="6" />
    <line x1="8" y1="12" x2="21" y2="12" />
    <line x1="8" y1="18" x2="21" y2="18" />
    <line x1="3" y1="6" x2="3.01" y2="6" />
    <line x1="3" y1="12" x2="3.01" y2="12" />
    <line x1="3" y1="18" x2="3.01" y2="18" />
  </svg>
);
const IconGlobe = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    className="w-4 h-4"
  >
    <circle cx="12" cy="12" r="10" />
    <line x1="2" y1="12" x2="22" y2="12" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
);

// ─── Live badge ────────────────────────────────────────────────────────────────
function LiveBadge() {
  return (
    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold tracking-widest bg-red-600 text-white">
      <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
      LIVE
    </span>
  );
}

// ─── Channel logo with fallback ───────────────────────────────────────────────
function ChannelLogo({ logoUrl, name, size = "md" }) {
  const [err, setErr] = useState(false);
  const sizeClass =
    size === "lg"
      ? "w-16 h-16 text-xl"
      : size === "sm"
        ? "w-8 h-8 text-xs"
        : "w-12 h-12 text-sm";

  if (!err && logoUrl) {
    return (
      <img
        src={logoUrl}
        alt={name}
        onError={() => setErr(true)}
        className={`${sizeClass} object-contain rounded`}
        loading="lazy"
      />
    );
  }
  return (
    <div
      className={`${sizeClass} rounded bg-linear-to-br from-indigo-900 to-blue-900 flex items-center justify-center font-bold text-blue-300`}
    >
      {name?.slice(0, 2).toUpperCase() || "TV"}
    </div>
  );
}

// ─── Channel Card (grid view) ─────────────────────────────────────────────────
function ChannelCard({ channel, logo, stream, onSelect, isFav, onToggleFav }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
      className="group relative bg-[#111827] border border-white/5 rounded-xl overflow-hidden cursor-pointer hover:border-indigo-500/40 hover:shadow-lg hover:shadow-indigo-900/20 transition-all duration-200"
      onClick={() => onSelect(channel, stream, logo)}
    >
      {/* linear top bar */}
      <div className="h-0.5 bg-linear-to-r from-indigo-600 via-blue-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <ChannelLogo logoUrl={logo?.url} name={channel.name} />
          <div className="flex items-center gap-2">
            {stream && <LiveBadge />}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleFav(channel);
              }}
              className={`p-1.5 rounded-lg transition-colors ${isFav ? "text-yellow-400 bg-yellow-400/10" : "text-slate-600 hover:text-yellow-400 hover:bg-yellow-400/10"}`}
            >
              <IconStar filled={isFav} />
            </button>
          </div>
        </div>

        <h3 className="font-semibold text-white text-sm leading-tight line-clamp-1 mb-1">
          {channel.name}
        </h3>

        <div className="flex items-center gap-2 flex-wrap">
          {channel.country && (
            <span className="text-[11px] text-slate-500 flex items-center gap-1">
              <IconGlobe />
              {channel.country}
            </span>
          )}
          {channel.categories?.[0] && (
            <span className="text-[11px] px-1.5 py-0.5 rounded bg-indigo-950/60 text-indigo-400 border border-indigo-900/50 capitalize">
              {channel.categories[0]}
            </span>
          )}
        </div>

        {stream && (
          <div className="mt-3 pt-3 border-t border-white/5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-slate-500">
                {stream.quality || "HD"}
              </span>
              <span className="text-[11px] text-emerald-500 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Available
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Play overlay */}
      <div className="absolute inset-0 bg-indigo-600/0 group-hover:bg-indigo-600/5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all pointer-events-none">
        <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur flex items-center justify-center border border-white/20">
          <IconPlay />
        </div>
      </div>
    </motion.div>
  );
}

// ─── Channel Row (list view) ──────────────────────────────────────────────────
function ChannelRow({ channel, logo, stream, onSelect, isFav, onToggleFav }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0 }}
      className="group flex items-center gap-4 p-3 rounded-xl bg-[#111827] border border-white/5 hover:border-indigo-500/30 cursor-pointer transition-all duration-150 hover:bg-[#151f2e]"
      onClick={() => onSelect(channel, stream, logo)}
    >
      <ChannelLogo logoUrl={logo?.url} name={channel.name} size="sm" />

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-medium text-white text-sm truncate">
            {channel.name}
          </span>
          {stream && <LiveBadge />}
        </div>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-[11px] text-slate-500">{channel.country}</span>
          {channel.categories?.[0] && (
            <span className="text-[11px] text-indigo-400 capitalize">
              {channel.categories[0]}
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        {stream?.quality && (
          <span className="text-[11px] text-slate-500 hidden sm:block">
            {stream.quality}
          </span>
        )}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFav(channel);
          }}
          className={`p-1.5 rounded-lg transition-colors ${isFav ? "text-yellow-400" : "text-slate-600 hover:text-yellow-400"}`}
        >
          <IconStar filled={isFav} />
        </button>
        <div className="p-1.5 text-slate-600 group-hover:text-indigo-400 transition-colors">
          <IconPlay />
        </div>
      </div>
    </motion.div>
  );
}

// ─── Video Player Modal ────────────────────────────────────────────────────────
function PlayerModal({ channel, stream, logo, onClose }) {
  const videoRef = useRef(null);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.92, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.92, opacity: 0 }}
          transition={{ type: "spring", damping: 25 }}
          className="w-full max-w-4xl bg-[#0d1220] rounded-2xl overflow-hidden border border-white/10 shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Player header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/8">
            <div className="flex items-center gap-3">
              <ChannelLogo logoUrl={logo?.url} name={channel.name} size="sm" />
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-white">
                    {channel.name}
                  </span>
                  {stream && <LiveBadge />}
                </div>
                <span className="text-xs text-slate-500">
                  {channel.country} · {channel.categories?.[0] || "General"}
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <IconX />
            </button>
          </div>

          {/* Player area */}
          <div className="aspect-video bg-black relative flex items-center justify-center">
            {stream?.url ? (
              <div className="w-full h-full flex flex-col items-center justify-center gap-4 text-center px-8">
                <div className="w-16 h-16 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center">
                  <IconTV />
                </div>
                <div>
                  <p className="text-white font-medium mb-1">
                    Stream Available
                  </p>
                  <p className="text-slate-400 text-sm mb-4 max-w-sm">
                    This stream requires a compatible media player. Copy the URL
                    below to watch in VLC or your IPTV app.
                  </p>
                  <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg px-3 py-2 max-w-md mx-auto">
                    <code className="text-xs text-indigo-300 truncate flex-1">
                      {stream.url}
                    </code>
                    <button
                      onClick={() => navigator.clipboard.writeText(stream.url)}
                      className="text-xs text-slate-400 hover:text-white bg-white/10 px-2 py-1 rounded shrink-0 transition-colors"
                    >
                      Copy
                    </button>
                  </div>
                </div>
                {stream.quality && (
                  <span className="text-xs text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded">
                    {stream.quality}
                  </span>
                )}
              </div>
            ) : (
              <div className="text-center">
                <div className="w-16 h-16 rounded-2xl bg-slate-800 flex items-center justify-center mx-auto mb-4">
                  <IconTV />
                </div>
                <p className="text-slate-400">
                  No stream available for this channel
                </p>
                {channel.website && (
                  <a
                    href={channel.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-block text-indigo-400 hover:text-indigo-300 text-sm underline underline-offset-2"
                  >
                    Visit official website →
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Info bar */}
          <div className="px-5 py-3 border-t border-white/8 flex items-center gap-4 text-xs text-slate-500 flex-wrap">
            {channel.network && (
              <span>
                Network:{" "}
                <span className="text-slate-300">{channel.network}</span>
              </span>
            )}
            {stream?.label && (
              <span className="text-amber-400">{stream.label}</span>
            )}
            {channel.website && (
              <a
                href={channel.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-400 hover:text-indigo-300 ml-auto"
              >
                Official Site →
              </a>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────
function Sidebar({
  categories,
  activeCategory,
  onCategoryChange,
  isOpen,
  onClose,
  favCount,
}) {
  const navItems = [
    { id: "all", label: "All Channels", icon: "📺" },
    { id: "favorites", label: `My Watchlist`, icon: "⭐", badge: favCount },
    { id: "live", label: "Live Now", icon: "🔴" },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-30 lg:hidden"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      <motion.aside
        initial={false}
        animate={{ x: isOpen ? 0 : "-100%" }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
        className="fixed top-0 left-0 h-full w-64 bg-[#090d18] border-r border-white/5 z-40 flex flex-col lg:translate-x-0 lg:static lg:z-auto"
      >
        {/* Logo */}
        <div className="px-5 py-5 border-b border-white/5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-linear-to-br from-indigo-600 to-blue-600 flex items-center justify-center">
              <IconTV />
            </div>
            <div>
              <span className="font-bold text-white tracking-tight">
                StreamVault
              </span>
              <div className="text-[10px] text-indigo-400 leading-none">
                IPTV Directory
              </div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
          <p className="text-[10px] font-semibold text-slate-600 uppercase tracking-widest px-2 mb-2">
            Navigation
          </p>
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                onCategoryChange(item.id);
                onClose();
              }}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-all ${
                activeCategory === item.id
                  ? "bg-indigo-600/20 text-indigo-300 border border-indigo-500/20"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <span className="flex items-center gap-2.5">
                <span>{item.icon}</span>
                {item.label}
              </span>
              {item.badge > 0 && (
                <span className="text-[10px] bg-indigo-600 text-white px-1.5 py-0.5 rounded-full font-bold">
                  {item.badge}
                </span>
              )}
            </button>
          ))}

          <div className="pt-4 pb-1">
            <p className="text-[10px] font-semibold text-slate-600 uppercase tracking-widest px-2 mb-2">
              Categories
            </p>
            {categories?.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  onCategoryChange(cat.id);
                  onClose();
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all capitalize ${
                  activeCategory === cat.id
                    ? "bg-indigo-600/20 text-indigo-300 border border-indigo-500/20"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </nav>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-white/5">
          <p className="text-[10px] text-slate-600 text-center">
            Powered by iptv-org
          </p>
        </div>
      </motion.aside>
    </>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function TVStreamingApp() {
  const { channels, feeds, logos, streams, categories } =
    useContext(DataContext);
  const { favorites, toggleFavorite, checkFavorite } = useFavorites();

  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [viewMode, setViewMode] = useState("grid");
  const [selectedChannel, setSelectedChannel] = useState(null);
  const [selectedStream, setSelectedStream] = useState(null);
  const [selectedLogo, setSelectedLogo] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [countryFilter, setCountryFilter] = useState("");
  const [page, setPage] = useState(1);
  const PER_PAGE = 48;

  // Build maps for O(1) lookups
  const logoMap = useCallback(() => {
    if (!logos) return {};
    return logos.reduce((acc, l) => {
      if (l.in_use) acc[l.channel] = l;
      return acc;
    }, {});
  }, [logos]);

  const streamMap = useCallback(() => {
    if (!streams) return {};
    return streams.reduce((acc, s) => {
      if (s.channel && !acc[s.channel]) acc[s.channel] = s;
      return acc;
    }, {});
  }, [streams]);

  const logoLookup = logoMap();
  const streamLookup = streamMap();

  // Filter channels
  const filtered = useCallback(() => {
    if (!channels) return [];
    let list = channels;

    if (activeCategory === "favorites") {
      const favIds = new Set(favorites.map((f) => f.id));
      list = list.filter((c) => favIds.has(c.id));
    } else if (activeCategory === "live") {
      list = list.filter((c) => !!streamLookup[c.id]);
    } else if (activeCategory !== "all") {
      list = list.filter((c) => c.categories?.includes(activeCategory));
    }

    if (countryFilter) {
      list = list.filter(
        (c) => c.country?.toLowerCase() === countryFilter.toLowerCase(),
      );
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (c) =>
          c.name?.toLowerCase().includes(q) ||
          c.alt_names?.some((n) => n.toLowerCase().includes(q)) ||
          c.country?.toLowerCase().includes(q) ||
          c.network?.toLowerCase().includes(q),
      );
    }

    return list;
  }, [
    channels,
    activeCategory,
    search,
    countryFilter,
    favorites,
    streamLookup,
  ]);

  const allFiltered = filtered();
  const totalPages = Math.ceil(allFiltered.length / PER_PAGE);
  const paginated = allFiltered.slice(0, page * PER_PAGE);

  // Reset page on filter change
  useEffect(() => {
    setPage(1);
  }, [search, activeCategory, countryFilter]);

  const handleSelect = (channel, stream, logo) => {
    setSelectedChannel(channel);
    setSelectedStream(stream || null);
    setSelectedLogo(logo || null);
  };

  const liveCount = streams
    ? new Set(streams.map((s) => s.channel).filter(Boolean)).size
    : 0;

  // Unique countries
  const countries = channels
    ? [...new Set(channels.map((c) => c.country).filter(Boolean))].sort()
    : [];

  const loading = !channels || !streams || !logos || !categories;

  return (
    <div className="min-h-screen bg-[#0A0E1A] text-white flex">
      {/* Sidebar */}
      <Sidebar
        categories={categories}
        activeCategory={activeCategory}
        onCategoryChange={(c) => {
          setActiveCategory(c);
          setSearch("");
        }}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        favCount={favorites.length}
      />

      {/* Main */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Top bar */}
        <header className="sticky top-0 z-20 bg-[#0A0E1A]/95 backdrop-blur border-b border-white/5 px-4 sm:px-6 py-3">
          <div className="flex items-center gap-3">
            <button
              className="lg:hidden p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/5"
              onClick={() => setSidebarOpen(true)}
            >
              <IconMenu />
            </button>

            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
                <IconSearch />
              </span>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search channels, networks..."
                className="w-full bg-white/5 border border-white/8 rounded-xl pl-9 pr-4 py-2 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/60 focus:bg-white/8 transition-all"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
                >
                  <IconX />
                </button>
              )}
            </div>

            {/* Country filter */}
            <select
              value={countryFilter}
              onChange={(e) => setCountryFilter(e.target.value)}
              className="hidden sm:block bg-white/5 border border-white/8 rounded-xl px-3 py-2 text-sm text-slate-300 focus:outline-none focus:border-indigo-500/60 cursor-pointer"
            >
              <option value="">All Countries</option>
              {countries.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>

            {/* View toggle */}
            <div className="flex items-center bg-white/5 border border-white/8 rounded-xl p-1 gap-0.5">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-1.5 rounded-lg transition-colors ${viewMode === "grid" ? "bg-indigo-600 text-white" : "text-slate-500 hover:text-white"}`}
              >
                <IconGrid />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-1.5 rounded-lg transition-colors ${viewMode === "list" ? "bg-indigo-600 text-white" : "text-slate-500 hover:text-white"}`}
              >
                <IconList />
              </button>
            </div>
          </div>
        </header>

        {/* Stats bar */}
        <div className="px-4 sm:px-6 py-3 border-b border-white/5 flex items-center gap-4 sm:gap-6 overflow-x-auto">
          {loading ? (
            <div className="h-4 w-48 bg-white/5 rounded animate-pulse" />
          ) : (
            <>
              <StatPill
                label="Channels"
                value={allFiltered.length.toLocaleString()}
              />
              <StatPill
                label="Live Now"
                value={liveCount.toLocaleString()}
                color="emerald"
              />
              <StatPill
                label="Watchlist"
                value={favorites.length}
                color="yellow"
              />
              {activeCategory !== "all" && (
                <button
                  onClick={() => {
                    setActiveCategory("all");
                    setSearch("");
                    setCountryFilter("");
                  }}
                  className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 ml-auto shrink-0"
                >
                  <IconX /> Clear filters
                </button>
              )}
            </>
          )}
        </div>

        {/* Content */}
        <main className="flex-1 px-4 sm:px-6 py-6">
          {loading ? (
            <LoadingSkeleton viewMode={viewMode} />
          ) : allFiltered.length === 0 ? (
            <EmptyState category={activeCategory} search={search} />
          ) : (
            <>
              <AnimatePresence mode="popLayout">
                {viewMode === "grid" ? (
                  <motion.div
                    key="grid"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3"
                  >
                    {paginated.map((ch) => (
                      <ChannelCard
                        key={ch.id}
                        channel={ch}
                        logo={logoLookup[ch.id]}
                        stream={streamLookup[ch.id]}
                        onSelect={(c, s, l) => handleSelect(c, s, l)}
                        isFav={checkFavorite(ch.id)}
                        onToggleFav={toggleFavorite}
                      />
                    ))}
                  </motion.div>
                ) : (
                  <motion.div
                    key="list"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col gap-2 max-w-3xl"
                  >
                    {paginated.map((ch) => (
                      <ChannelRow
                        key={ch.id}
                        channel={ch}
                        logo={logoLookup[ch.id]}
                        stream={streamLookup[ch.id]}
                        onSelect={(c, s, l) => handleSelect(c, s, l)}
                        isFav={checkFavorite(ch.id)}
                        onToggleFav={toggleFavorite}
                      />
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Load more */}
              {page * PER_PAGE < allFiltered.length && (
                <div className="flex justify-center mt-8">
                  <button
                    onClick={() => setPage((p) => p + 1)}
                    className="px-6 py-2.5 rounded-xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-300 hover:bg-indigo-600/30 hover:text-white text-sm font-medium transition-all"
                  >
                    Load more · {allFiltered.length - page * PER_PAGE} remaining
                  </button>
                </div>
              )}
            </>
          )}
        </main>
      </div>

      {/* Player Modal */}
      <AnimatePresence>
        {selectedChannel && (
          <PlayerModal
            channel={selectedChannel}
            stream={selectedStream}
            logo={selectedLogo}
            onClose={() => {
              setSelectedChannel(null);
              setSelectedStream(null);
              setSelectedLogo(null);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function StatPill({ label, value, color = "slate" }) {
  const colors = {
    slate: "text-slate-400",
    emerald: "text-emerald-400",
    yellow: "text-yellow-400",
  };
  return (
    <div className="flex items-center gap-2 shrink-0">
      <span className={`text-base font-bold ${colors[color]}`}>{value}</span>
      <span className="text-xs text-slate-600">{label}</span>
    </div>
  );
}

function LoadingSkeleton({ viewMode }) {
  return viewMode === "grid" ? (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-3">
      {Array.from({ length: 20 }).map((_, i) => (
        <div
          key={i}
          className="bg-[#111827] rounded-xl p-4 animate-pulse border border-white/5"
        >
          <div className="w-12 h-12 rounded bg-white/5 mb-3" />
          <div className="h-3 bg-white/5 rounded mb-2 w-3/4" />
          <div className="h-3 bg-white/5 rounded w-1/2" />
        </div>
      ))}
    </div>
  ) : (
    <div className="flex flex-col gap-2 max-w-3xl">
      {Array.from({ length: 12 }).map((_, i) => (
        <div
          key={i}
          className="bg-[#111827] rounded-xl p-3 animate-pulse border border-white/5 flex items-center gap-4"
        >
          <div className="w-8 h-8 rounded bg-white/5 shrink-0" />
          <div className="flex-1">
            <div className="h-3 bg-white/5 rounded mb-2 w-1/3" />
            <div className="h-2.5 bg-white/5 rounded w-1/4" />
          </div>
        </div>
      ))}
    </div>
  );
}

function EmptyState({ category, search }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-24 text-center"
    >
      <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-4 text-2xl">
        {category === "favorites" ? "⭐" : "📺"}
      </div>
      <h3 className="text-lg font-semibold text-white mb-2">
        {category === "favorites"
          ? "Your watchlist is empty"
          : "No channels found"}
      </h3>
      <p className="text-slate-500 text-sm max-w-xs">
        {category === "favorites"
          ? "Star any channel to add it to your personal watchlist for quick access."
          : search
            ? `No results for "${search}". Try a different search term.`
            : "No channels match the current filters."}
      </p>
    </motion.div>
  );
}
