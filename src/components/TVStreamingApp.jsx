"use client";

import { useState, useEffect, useContext, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Hls from "hls.js";
import { useFavorites } from "@/context/FavoritesContext";
import DataContext from "@/context/DataContext";
import shaka from "shaka-player";

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
const IconArrowLeft = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    className="w-5 h-5"
  >
    <line x1="19" y1="12" x2="5" y2="12" />
    <polyline points="12 19 5 12 12 5" />
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
const IconAlert = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    className="w-6 h-6"
  >
    <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);

// ─── Live badge ────────────────────────────────────────────────────────────────
function LiveBadge({ size = "md" }) {
  const cls =
    size === "sm" ? "px-1.5 py-0.5 text-[9px]" : "px-2 py-0.5 text-[10px]";
  return (
    <span
      className={`inline-flex items-center gap-1 ${cls} rounded-sm font-bold tracking-[0.12em] bg-[#E0421A] text-white font-mono`}
    >
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
        ? "w-9 h-9 text-[11px]"
        : "w-12 h-12 text-sm";

  if (!err && logoUrl) {
    return (
      <img
        src={logoUrl}
        alt={name}
        onError={() => setErr(true)}
        className={`${sizeClass} object-contain rounded-md bg-white/[0.03] p-1 ring-1 ring-white/[0.06]`}
        loading="lazy"
      />
    );
  }
  return (
    <div
      className={`${sizeClass} rounded-md bg-[#171C26] ring-1 ring-white/[0.06] flex items-center justify-center font-bold font-mono text-[#F5A623]/80`}
    >
      {name?.slice(0, 2).toUpperCase() || "TV"}
    </div>
  );
}

// ─── Channel Card (grid view) ─────────────────────────────────────────────────
function ChannelCard({
  channel,
  logo,
  stream,
  onSelect,
  isFav,
  onToggleFav,
  isActive,
}) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.18 }}
      className={`group relative bg-[#0F1318] border rounded-lg overflow-hidden cursor-pointer transition-colors duration-150 ${
        isActive
          ? "border-[#F5A623]/60 ring-1 ring-[#F5A623]/30"
          : "border-white/[0.06] hover:border-white/[0.14]"
      }`}
      onClick={() => onSelect(channel, stream, logo)}
    >
      <div className="p-3.5">
        <div className="flex items-start justify-between mb-3">
          <ChannelLogo logoUrl={logo?.url} name={channel.name} />
          <div className="flex items-center gap-1.5">
            {stream && <LiveBadge size="sm" />}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleFav(channel);
              }}
              className={`p-1.5 rounded-md transition-colors ${
                isFav
                  ? "text-[#F5A623] bg-[#F5A623]/10"
                  : "text-slate-600 hover:text-[#F5A623] hover:bg-white/5"
              }`}
            >
              <IconStar filled={isFav} />
            </button>
          </div>
        </div>

        <h3 className="font-semibold text-white text-[13px] leading-tight line-clamp-1 mb-1.5 tracking-tight">
          {channel.name}
        </h3>

        <div className="flex items-center gap-2 flex-wrap">
          {channel.country && (
            <span className="text-[10px] text-slate-500 flex items-center gap-1 font-mono">
              <IconGlobe />
              {channel.country}
            </span>
          )}
          {channel.categories?.[0] && (
            <span className="text-[10px] px-1.5 py-0.5 rounded-sm bg-white/[0.04] text-slate-400 border border-white/[0.06] capitalize">
              {channel.categories[0]}
            </span>
          )}
        </div>

        {stream && (
          <div className="mt-3 pt-2.5 border-t border-white/[0.06] flex items-center justify-between">
            <span className="text-[10px] text-slate-500 font-mono uppercase tracking-wide">
              {stream.quality || "HD"}
            </span>
            <span className="text-[10px] text-emerald-500 flex items-center gap-1 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Online
            </span>
          </div>
        )}
      </div>

      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none bg-black/10">
        <div className="w-9 h-9 rounded-full bg-[#F5A623] flex items-center justify-center text-[#0B0E14] shadow-lg">
          <IconPlay />
        </div>
      </div>
    </motion.div>
  );
}

// ─── Channel Row (list view / rail) ───────────────────────────────────────────
function ChannelRow({
  channel,
  logo,
  stream,
  onSelect,
  isFav,
  onToggleFav,
  isActive,
  compact,
}) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -6 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0 }}
      className={`group flex items-center gap-3 p-2.5 rounded-lg border cursor-pointer transition-colors duration-150 ${
        isActive
          ? "bg-[#F5A623]/[0.08] border-[#F5A623]/40"
          : "bg-[#0F1318] border-white/[0.06] hover:border-white/[0.14] hover:bg-[#13171F]"
      }`}
      onClick={() => onSelect(channel, stream, logo)}
    >
      <ChannelLogo logoUrl={logo?.url} name={channel.name} size="sm" />

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span
            className={`font-medium text-sm truncate ${isActive ? "text-[#F5A623]" : "text-white"}`}
          >
            {channel.name}
          </span>
          {stream && !compact && <LiveBadge size="sm" />}
        </div>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-[10px] text-slate-500 font-mono">
            {channel.country}
          </span>
          {!compact && channel.categories?.[0] && (
            <span className="text-[10px] text-slate-500 capitalize">
              {channel.categories[0]}
            </span>
          )}
        </div>
      </div>

      {!compact && (
        <div className="flex items-center gap-1.5 shrink-0">
          {stream?.quality && (
            <span className="text-[10px] text-slate-500 hidden sm:block font-mono">
              {stream.quality}
            </span>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleFav(channel);
            }}
            className={`p-1.5 rounded-md transition-colors ${isFav ? "text-[#F5A623]" : "text-slate-600 hover:text-[#F5A623]"}`}
          >
            <IconStar filled={isFav} />
          </button>
        </div>
      )}
      {stream && compact && (
        <span className="w-1.5 h-1.5 rounded-full bg-[#E0421A] shrink-0" />
      )}
    </motion.div>
  );
}

// ─── HLS Video Player ──────────────────────────────────────────────────────────
function ShakaPlayer({ src }) {
  const videoRef = useRef(null);
  const playerRef = useRef(null);

  const [status, setStatus] = useState("loading");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const initPlayer = async () => {
      if (!videoRef.current || !src) return;

      setStatus("loading");
      setErrorMsg("");

      // Install polyfills
      shaka.polyfill.installAll();

      if (!shaka.Player.isBrowserSupported()) {
        setStatus("error");
        setErrorMsg("Browser is not supported.");
        return;
      }

      const player = new shaka.Player(videoRef.current);

      playerRef.current = player;

      player.configure({
        streaming: {
          bufferingGoal: 30,
          rebufferingGoal: 2,
          retryParameters: {
            maxAttempts: 3,
          },
        },
      });

      player.addEventListener("error", (event) => {
        console.error(event.detail);

        setStatus("error");
        setErrorMsg(event.detail.message || "Unable to load stream.");
      });

      try {
        await player.load(src);

        await videoRef.current.play().catch(() => {});

        setStatus("playing");
      } catch (err) {
        console.error(err);
        setStatus("error");
        setErrorMsg(err.message || "Unable to load stream.");
      }
    };

    initPlayer();

    return () => {
      if (playerRef.current) {
        playerRef.current.destroy();
        playerRef.current = null;
      }
    };
  }, [src]);

  return (
    <div className="relative w-full h-full bg-black flex items-center justify-center">
      <video
        ref={videoRef}
        className="w-full h-full"
        controls
        autoPlay
        playsInline
      />

      {status === "loading" && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black">
          <div className="w-8 h-8 border-2 border-white/15 border-t-[#F5A623] rounded-full animate-spin" />
          <span className="text-xs text-slate-500 font-mono uppercase">
            Connecting...
          </span>
        </div>
      )}

      {status === "error" && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[#0B0E14] px-8 text-center">
          <div className="w-12 h-12 rounded-full bg-[#E0421A]/10 text-[#E0421A] flex items-center justify-center">
            <IconAlert />
          </div>

          <p className="text-white text-sm font-medium">Stream unavailable</p>

          <p className="text-slate-500 text-xs max-w-xs">{errorMsg}</p>
        </div>
      )}
    </div>
  );
}

// ─── Player Pane (split view, replaces modal) ─────────────────────────────────
function PlayerPane({ channel, stream, logo, onClose }) {
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  const playable = stream?.url && /\.(m3u8|mpd)($|\?)/i.test(stream.url);

  return (
    <motion.div
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 24 }}
      transition={{ type: "spring", damping: 28, stiffness: 280 }}
      className="flex flex-col sticky top-0 bg-[#070A10] lg:border-l border-white/6"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 sm:px-5 py-3.5 border-b border-white/6 shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={onClose}
            className="p-1.5 rounded-md text-slate-400 hover:text-white hover:bg-white/5 transition-colors shrink-0"
          >
            <IconArrowLeft />
          </button>
          <ChannelLogo logoUrl={logo?.url} name={channel.name} size="sm" />
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-white text-sm truncate">
                {channel.name}
              </span>
              {stream && <LiveBadge size="sm" />}
            </div>
            <span className="text-[11px] text-slate-500 font-mono truncate block">
              {channel.country} · {channel.categories?.[0] || "General"}
            </span>
          </div>
        </div>
        <button
          onClick={onClose}
          className="hidden sm:flex p-2 rounded-md text-slate-400 hover:text-white hover:bg-white/5 transition-colors shrink-0"
        >
          <IconX />
        </button>
      </div>

      {/* Player area */}
      <div className="aspect-video lg:aspect-auto lg:flex-1 bg-black relative">
        {stream?.url ? (
          playable ? (
            <ShakaPlayer src={stream.url} />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center gap-4 text-center px-8">
              <div className="w-14 h-14 rounded-xl bg-[#F5A623]/10 border border-[#F5A623]/25 flex items-center justify-center text-[#F5A623]">
                <IconTV />
              </div>
              <div>
                <p className="text-white font-medium mb-1 text-sm">
                  Non-HLS stream
                </p>
                <p className="text-slate-500 text-xs mb-4 max-w-sm">
                  This source isn't an HLS (.m3u8) feed. Copy the URL into VLC
                  or a compatible player.
                </p>
                <div className="flex items-center gap-2 bg-white/4 border border-white/8 rounded-md px-3 py-2 max-w-md mx-auto">
                  <code className="text-[11px] text-[#F5A623]/90 truncate flex-1 font-mono">
                    {stream.url}
                  </code>
                  <button
                    onClick={() => navigator.clipboard.writeText(stream.url)}
                    className="text-[11px] text-slate-400 hover:text-white bg-white/4 px-2 py-1 rounded shrink-0 transition-colors"
                  >
                    Copy
                  </button>
                </div>
              </div>
            </div>
          )
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-center px-8">
            <div className="w-14 h-14 rounded-xl bg-white/[0.04] flex items-center justify-center mb-4 text-slate-500">
              <IconTV />
            </div>
            <p className="text-slate-400 text-sm">
              No stream available for this channel
            </p>
            {channel.website && (
              <a
                href={channel.website}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-block text-[#F5A623] hover:text-[#ffb840] text-xs underline underline-offset-2 font-mono"
              >
                Visit official website →
              </a>
            )}
          </div>
        )}
      </div>

      {/* Info bar */}
      <div className="px-4 sm:px-5 py-3 border-t border-white/6 flex items-center gap-4 text-[11px] text-slate-500 flex-wrap shrink-0 font-mono">
        {channel.network && (
          <span>
            NETWORK <span className="text-slate-300">{channel.network}</span>
          </span>
        )}
        {stream?.label && (
          <span className="text-[#F5A623]/80">{stream.label}</span>
        )}
        {channel.website && (
          <a
            href={channel.website}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#F5A623]/80 hover:text-[#F5A623] ml-auto"
          >
            OFFICIAL SITE →
          </a>
        )}
      </div>
    </motion.div>
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
    { id: "all", label: "All Channels", icon: "▦" },
    { id: "favorites", label: "Watchlist", icon: "★", badge: favCount },
    { id: "live", label: "Live Now", icon: "●" },
  ];

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 z-30 lg:hidden"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      <motion.aside
        initial={false}
        animate={{ x: isOpen ? 0 : "-100%" }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
        className="fixed top-0 left-0 h-full w-64 bg-[#0A0D13] border-r border-white/6 z-40 flex flex-col lg:translate-x-0 lg:static lg:z-auto lg:shrink-0"
      >
        {/* Logo */}
        <div className="px-5 py-5 border-b border-white/6">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-md bg-[#F5A623] flex items-center justify-center text-[#0B0E14]">
              <IconTV />
            </div>
            <div>
              <span className="font-bold text-white tracking-tight text-sm">
                StreamVault
              </span>
              <div className="text-[10px] text-[#F5A623]/80 leading-none font-mono uppercase tracking-wider mt-0.5">
                IPTV Console
              </div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
          <p className="text-[10px] font-semibold text-slate-600 uppercase tracking-[0.15em] px-2 mb-2 font-mono">
            Navigation
          </p>
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                onCategoryChange(item.id);
                onClose();
              }}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-md text-sm transition-colors ${
                activeCategory === item.id
                  ? "bg-[#F5A623]/12 text-[#F5A623] border border-[#F5A623]/25"
                  : "text-slate-400 hover:text-white hover:bg-white/4 border border-transparent"
              }`}
            >
              <span className="flex items-center gap-2.5">
                <span className="font-mono text-xs w-3">{item.icon}</span>
                {item.label}
              </span>
              {item.badge > 0 && (
                <span className="text-[10px] bg-[#F5A623] text-[#0B0E14] px-1.5 py-0.5 rounded-sm font-bold font-mono">
                  {item.badge}
                </span>
              )}
            </button>
          ))}

          <div className="pt-4 pb-1">
            <p className="text-[10px] font-semibold text-slate-600 uppercase tracking-[0.15em] px-2 mb-2 font-mono">
              Categories
            </p>
            {categories?.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  onCategoryChange(cat.id);
                  onClose();
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-sm transition-colors capitalize ${
                  activeCategory === cat.id
                    ? "bg-[#F5A623]/[0.12] text-[#F5A623] border border-[#F5A623]/25"
                    : "text-slate-400 hover:text-white hover:bg-white/4 border border-transparent"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </nav>

        <div className="px-4 py-3 border-t border-white/6">
          <p className="text-[10px] text-slate-600 text-center font-mono">
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
  const paginated = allFiltered.slice(0, page * PER_PAGE);
  const isPlayerOpen = !!selectedChannel;

  useEffect(() => {
    setPage(1);
  }, [search, activeCategory, countryFilter]);

  const handleSelect = (channel, stream, logo) => {
    setSelectedChannel(channel);
    setSelectedStream(stream || null);
    setSelectedLogo(logo || null);
  };

  const closePlayer = () => {
    setSelectedChannel(null);
    setSelectedStream(null);
    setSelectedLogo(null);
  };

  const liveCount = streams
    ? new Set(streams.map((s) => s.channel).filter(Boolean)).size
    : 0;
  const countries = channels
    ? [...new Set(channels.map((c) => c.country).filter(Boolean))].sort()
    : [];
  const loading = !channels || !streams || !logos || !categories;

  return (
    <div className="min-h-screen bg-[#0A0E1A] text-white flex font-sans">
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

      {/* Channel list column — shrinks to a rail when player is open on desktop */}
      <motion.div
        layout
        transition={{ type: "spring", damping: 30, stiffness: 280 }}
        className={`flex flex-col min-w-0 ${isPlayerOpen ? "lg:w-[360px] lg:shrink-0" : "flex-1"} ${
          isPlayerOpen ? "hidden lg:flex" : "flex flex-1"
        }`}
      >
        {/* Top bar */}
        <header className="sticky top-0 z-20 bg-[#0A0E1A]/95 backdrop-blur border-b border-white/6 px-4 sm:px-6 py-3 shrink-0">
          <div className="flex items-center gap-3">
            <button
              className="lg:hidden p-2 text-slate-400 hover:text-white rounded-md hover:bg-white/5"
              onClick={() => setSidebarOpen(true)}
            >
              <IconMenu />
            </button>

            <div className="relative flex-1 max-w-md">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
                <IconSearch />
              </span>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search channels, networks…"
                className="w-full bg-white/4 border border-white/8 rounded-lg pl-9 pr-4 py-2 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-[#F5A623]/50 focus:bg-white/6 transition-colors"
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

            {!isPlayerOpen && (
              <select
                value={countryFilter}
                onChange={(e) => setCountryFilter(e.target.value)}
                className="hidden sm:block bg-white/4 border border-white/8 rounded-lg px-3 py-2 text-sm text-slate-300 focus:outline-none focus:border-[#F5A623]/50 cursor-pointer"
              >
                <option value="">All Countries</option>
                {countries.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            )}

            {!isPlayerOpen && (
              <div className="flex items-center bg-white/4 border border-white/8 rounded-lg p-1 gap-0.5">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-1.5 rounded-md transition-colors ${
                    viewMode === "grid"
                      ? "bg-[#F5A623] text-[#0B0E14]"
                      : "text-slate-500 hover:text-white"
                  }`}
                >
                  <IconGrid />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-1.5 rounded-md transition-colors ${
                    viewMode === "list"
                      ? "bg-[#F5A623] text-[#0B0E14]"
                      : "text-slate-500 hover:text-white"
                  }`}
                >
                  <IconList />
                </button>
              </div>
            )}
          </div>
        </header>

        {/* Stats bar */}
        {!isPlayerOpen && (
          <div className="px-4 sm:px-6 py-3 border-b border-white/6 flex items-center gap-4 sm:gap-6 overflow-x-auto shrink-0">
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
                  color="amber"
                />
                {activeCategory !== "all" && (
                  <button
                    onClick={() => {
                      setActiveCategory("all");
                      setSearch("");
                      setCountryFilter("");
                    }}
                    className="text-xs text-[#F5A623] hover:text-[#ffb840] flex items-center gap-1 ml-auto shrink-0 font-mono"
                  >
                    <IconX /> CLEAR
                  </button>
                )}
              </>
            )}
          </div>
        )}

        {/* Content */}
        <main
          className={`flex-1 overflow-y-auto ${isPlayerOpen ? "px-3 py-3" : "px-4 sm:px-6 py-6"}`}
        >
          {loading ? (
            <LoadingSkeleton viewMode={isPlayerOpen ? "list" : viewMode} />
          ) : allFiltered.length === 0 ? (
            <EmptyState category={activeCategory} search={search} />
          ) : (
            <>
              <AnimatePresence mode="popLayout">
                {isPlayerOpen || viewMode === "list" ? (
                  <motion.div
                    key="list"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col gap-2"
                  >
                    {paginated.map((ch) => (
                      <ChannelRow
                        key={ch.id}
                        channel={ch}
                        logo={logoLookup[ch.id]}
                        stream={streamLookup[ch.id]}
                        onSelect={handleSelect}
                        isFav={checkFavorite(ch.id)}
                        onToggleFav={toggleFavorite}
                        isActive={selectedChannel?.id === ch.id}
                        compact={isPlayerOpen}
                      />
                    ))}
                  </motion.div>
                ) : (
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
                        onSelect={handleSelect}
                        isFav={checkFavorite(ch.id)}
                        onToggleFav={toggleFavorite}
                        isActive={selectedChannel?.id === ch.id}
                      />
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>

              {page * PER_PAGE < allFiltered.length && (
                <div className="flex justify-center mt-8">
                  <button
                    onClick={() => setPage((p) => p + 1)}
                    className="px-6 py-2.5 rounded-lg bg-[#F5A623]/10 border border-[#F5A623]/25 text-[#F5A623] hover:bg-[#F5A623]/15 text-sm font-medium transition-colors"
                  >
                    Load more · {allFiltered.length - page * PER_PAGE} remaining
                  </button>
                </div>
              )}
            </>
          )}
        </main>
      </motion.div>

      {/* Player pane */}
      <AnimatePresence>
        {isPlayerOpen && (
          <div className="fixed inset-0 z-40 lg:static lg:z-auto lg:flex-1 lg:min-w-0">
            <PlayerPane
              channel={selectedChannel}
              stream={selectedStream}
              logo={selectedLogo}
              onClose={closePlayer}
            />
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function StatPill({ label, value, color = "slate" }) {
  const colors = {
    slate: "text-slate-400",
    emerald: "text-emerald-400",
    amber: "text-[#F5A623]",
  };
  return (
    <div className="flex items-center gap-2 shrink-0">
      <span className={`text-base font-bold font-mono ${colors[color]}`}>
        {value}
      </span>
      <span className="text-[11px] text-slate-600 uppercase tracking-wide font-mono">
        {label}
      </span>
    </div>
  );
}

function LoadingSkeleton({ viewMode }) {
  return viewMode === "grid" ? (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-3">
      {Array.from({ length: 20 }).map((_, i) => (
        <div
          key={i}
          className="bg-[#0F1318] rounded-lg p-3.5 animate-pulse border border-white/6"
        >
          <div className="w-12 h-12 rounded-md bg-white/5 mb-3" />
          <div className="h-3 bg-white/5 rounded mb-2 w-3/4" />
          <div className="h-3 bg-white/5 rounded w-1/2" />
        </div>
      ))}
    </div>
  ) : (
    <div className="flex flex-col gap-2">
      {Array.from({ length: 12 }).map((_, i) => (
        <div
          key={i}
          className="bg-[#0F1318] rounded-lg p-2.5 animate-pulse border border-white/6 flex items-center gap-3"
        >
          <div className="w-9 h-9 rounded-md bg-white/5 shrink-0" />
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
      <div className="w-14 h-14 rounded-xl bg-white/4 flex items-center justify-center mb-4 text-[#F5A623]">
        {category === "favorites" ? <IconStar filled /> : <IconTV />}
      </div>
      <h3 className="text-base font-semibold text-white mb-2">
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
