"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import shaka from "shaka-player";

const IconPlay = (p) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
    <path d="M8 5.14v13.72a1 1 0 0 0 1.5.86l11-6.86a1 1 0 0 0 0-1.72l-11-6.86A1 1 0 0 0 8 5.14Z" />
  </svg>
);

const IconPause = (p) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
    <rect x="6" y="5" width="4" height="14" rx="1" />
    <rect x="14" y="5" width="4" height="14" rx="1" />
  </svg>
);

const IconVolumeHigh = (p) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...p}
  >
    <path d="M11 5 6 9H2v6h4l5 4V5Z" />
    <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
  </svg>
);

const IconVolumeMute = (p) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...p}
  >
    <path d="M11 5 6 9H2v6h4l5 4V5Z" />
    <line x1="23" y1="9" x2="17" y2="15" />
    <line x1="17" y1="9" x2="23" y2="15" />
  </svg>
);

const IconFullscreen = (p) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...p}
  >
    <path d="M8 3H5a2 2 0 0 0-2 2v3M16 3h3a2 2 0 0 1 2 2v3M21 16v3a2 2 0 0 1-2 2h-3M8 21H5a2 2 0 0 1-2-2v-3" />
  </svg>
);

const IconExitFullscreen = (p) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...p}
  >
    <path d="M9 3v3a2 2 0 0 1-2 2H4M15 3v3a2 2 0 0 0 2 2h3M21 16h-3a2 2 0 0 0-2 2v3M3 16h3a2 2 0 0 1 2 2v3" />
  </svg>
);

const IconSignal = (p) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
    <rect x="2" y="14" width="3" height="6" rx="0.5" />
    <rect x="7.5" y="10" width="3" height="10" rx="0.5" />
    <rect x="13" y="6" width="3" height="14" rx="0.5" />
    <rect x="18.5" y="2" width="3" height="18" rx="0.5" />
  </svg>
);

const IconAlert = (p) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...p}
  >
    <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);

const IconSettings = (p) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...p}
  >
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z" />
  </svg>
);

const IconRefresh = (p) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...p}
  >
    <path d="M21 12a9 9 0 1 1-2.64-6.36" />
    <path d="M21 3v6h-6" />
  </svg>
);

// ---- Helpers ---------------------------------------------------------------

function formatTime(seconds) {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  const mm = h > 0 ? String(m).padStart(2, "0") : String(m);
  const ss = String(s).padStart(2, "0");
  return h > 0 ? `${h}:${mm}:${ss}` : `${mm}:${ss}`;
}

function formatBitrate(bps) {
  if (!Number.isFinite(bps) || bps <= 0) return "—";
  if (bps >= 1_000_000) return `${(bps / 1_000_000).toFixed(1)} Mbps`;
  return `${Math.round(bps / 1000)} Kbps`;
}

// ------------------------------ Component -----------------------------------

export default function ShakaPlayer({ src }) {
  const videoRef = useRef(null);
  const playerRef = useRef(null);
  const hideControlsTimer = useRef(null);
  const containerRef = useRef(null);

  const [status, setStatus] = useState("loading");
  const [errorMsg, setErrorMsg] = useState("");

  const [isPlaying, setIsPlaying] = useState(false);
  const [isLive, setIsLive] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [buffered, setBuffered] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [controlsVisible, setControlsVisible] = useState(true);

  const [tracks, setTracks] = useState([]); // ABR variant tracks
  const [activeTrackId, setActiveTrackId] = useState(null);
  const [isAbrEnabled, setIsAbrEnabled] = useState(true);
  const [showQualityMenu, setShowQualityMenu] = useState(false);
  const [stats, setStats] = useState({
    bitrate: 0,
    droppedFrames: 0,
    bandwidth: 0,
  });

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
        console.error("Shaka error:", event.detail);

        setStatus("error");
        // setErrorMsg(event.detail.message || "Unable to load stream.");
        setErrorMsg(humanizeShakaError(event.detail));
      });

      player.addEventListener("buffering", (event) => {
        if (event.buffering) setStatus("loading");
        else setStatus((s) => (s === "loading" ? "playing" : s));
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

  // ---- Native video element event wiring ----

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onTimeUpdate = () => setCurrentTime(video.currentTime);
    const onDurationChange = () => setDuration(video.duration || 0);
    const onVolumeChange = () => {
      setVolume(video.volume);
      setIsMuted(video.muted);
    };
    const onProgress = () => {
      if (video.buffered.length > 0) {
        setBuffered(video.buffered.end(video.buffered.length - 1));
      }
    };

    video.addEventListener("play", onPlay);
    video.addEventListener("pause", onPause);
    video.addEventListener("timeupdate", onTimeUpdate);
    video.addEventListener("durationchange", onDurationChange);
    video.addEventListener("volumechange", onVolumeChange);
    video.addEventListener("progress", onProgress);

    return () => {
      video.removeEventListener("play", onPlay);
      video.removeEventListener("pause", onPause);
      video.removeEventListener("timeupdate", onTimeUpdate);
      video.removeEventListener("durationchange", onDurationChange);
      video.removeEventListener("volumechange", onVolumeChange);
      video.removeEventListener("progress", onProgress);
    };
  }, [src]);

  // ---- Fullscreen tracking ----

  useEffect(() => {
    const onFsChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onFsChange);
    return () => document.removeEventListener("fullscreenchange", onFsChange);
  }, []);

  // ---- Controls auto-hide ----

  // ---- Manual retry ----

  const retry = useCallback(() => {
    // Re-trigger the effect by forcing a reload of the same src
    const player = playerRef.current;
    if (player && src) {
      setStatus("loading");
      setErrorMsg("");
      player.load(src).then(
        () => {
          //   refreshTracks();
          setIsLive(player.isLive());
          videoRef.current?.play().catch(() => {});
          setStatus("playing");
        },
        (err) => {
          setStatus("error");
          setErrorMsg(humanizeShakaError(err));
        },
      );
    }
  }, [src]);

  const showControls = useCallback(() => {
    setControlsVisible(true);
    if (hideControlsTimer.current) clearTimeout(hideControlsTimer.current);
    hideControlsTimer.current = setTimeout(() => {
      if (isPlaying) setControlsVisible(false);
    }, 3000);
  }, [isPlaying]);

  useEffect(() => {
    return () => {
      if (hideControlsTimer.current) clearTimeout(hideControlsTimer.current);
    };
  }, []);

  // ---- Control handlers ----

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) video.play().catch(() => {});
    else video.pause();
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
  };

  const handleVolumeChange = (e) => {
    const video = videoRef.current;
    if (!video) return;
    const v = parseFloat(e.target.value);
    video.volume = v;
    video.muted = v === 0;
  };

  const handleSeek = (e) => {
    const video = videoRef.current;
    if (!video || isLive) return;
    video.currentTime = parseFloat(e.target.value);
  };

  const toggleFullscreen = () => {
    const el = containerRef.current;
    if (!el) return;
    if (!document.fullscreenElement) {
      el.requestFullscreen?.().catch(() => {});
    } else {
      document.exitFullscreen?.().catch(() => {});
    }
  };

  const selectTrack = (track) => {
    const player = playerRef.current;
    if (!player) return;
    if (track === "auto") {
      player.configure({ abr: { enabled: true } });
      setIsAbrEnabled(true);
    } else {
      player.configure({ abr: { enabled: false } });
      player.selectVariantTrack(track, true);
      setIsAbrEnabled(false);
      setActiveTrackId(track.id);
    }
    setShowQualityMenu(false);
  };

  // Signal strength bucket from estimated bandwidth, for the HUD icon.
  const signalLevel = (() => {
    const bw = stats.bandwidth;
    if (bw <= 0) return 0;
    if (bw < 1_000_000) return 1;
    if (bw < 4_000_000) return 2;
    if (bw < 8_000_000) return 3;
    return 4;
  })();

  const progressPct = duration > 0 ? (currentTime / duration) * 100 : 0;
  const bufferedPct = duration > 0 ? (buffered / duration) * 100 : 0;

  return (
    <div
      ref={containerRef}
      className="group relative w-full h-full bg-[#05070B] overflow-hidden select-none"
      onMouseMove={showControls}
      onMouseLeave={() => isPlaying && setControlsVisible(false)}
      style={{ fontFamily: "ui-sans-serif, system-ui, sans-serif" }}
    >
      <video
        ref={videoRef}
        className="w-full h-full object-contain"
        playsInline
        onClick={togglePlay}
      />

      {/* Ambient vignette for legibility under controls */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30" />

      {/* ---- Top HUD: live badge + signal/bitrate ---- */}
      {status === "playing" && (
        <div
          className={`absolute top-0 left-0 right-0 flex items-center justify-between px-5 py-4 transition-opacity duration-300 ${
            controlsVisible ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="flex items-center gap-2">
            {isLive && (
              <div className="flex items-center gap-1.5 rounded-full bg-[#E0421A]/90 backdrop-blur-md px-2.5 py-1 shadow-[0_0_12px_rgba(224,66,26,0.5)]">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-white" />
                </span>
                <span className="text-[10px] font-bold tracking-widest text-white uppercase">
                  Live
                </span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 rounded-full bg-black/40 backdrop-blur-md border border-white/10 px-3 py-1.5">
            <IconSignal
              className={`w-3.5 h-3.5 ${
                signalLevel >= 3
                  ? "text-[#F5A623]"
                  : signalLevel >= 1
                    ? "text-amber-200/70"
                    : "text-white/30"
              }`}
            />
            <span className="text-[10px] font-mono text-slate-300 tabular-nums">
              {formatBitrate(stats.bitrate)}
            </span>
          </div>
        </div>
      )}

      {/* ---- Center play/pause tap target (mobile-friendly) ---- */}
      {status === "playing" && !isPlaying && (
        <button
          onClick={togglePlay}
          className="absolute inset-0 flex items-center justify-center"
          aria-label="Play"
        >
          <div className="w-16 h-16 rounded-full bg-black/40 backdrop-blur-md border border-white/15 flex items-center justify-center hover:bg-black/55 hover:scale-105 transition-all">
            <IconPlay className="w-7 h-7 text-white ml-1" />
          </div>
        </button>
      )}

      {/* ---- Bottom glass control bar ---- */}
      {status === "playing" && (
        <div
          className={`absolute bottom-0 left-0 right-0 transition-all duration-300 ${
            controlsVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-2 pointer-events-none"
          }`}
        >
          <div className="mx-3 mb-3 rounded-2xl bg-black/45 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.4)] px-4 py-3">
            {/* Seek bar */}
            {!isLive && (
              <div className="relative mb-2.5 flex items-center group/seek">
                <div className="relative w-full h-1 rounded-full bg-white/15 overflow-hidden">
                  <div
                    className="absolute inset-y-0 left-0 bg-white/25 rounded-full"
                    style={{ width: `${bufferedPct}%` }}
                  />
                  <div
                    className="absolute inset-y-0 left-0 bg-[#F5A623] rounded-full"
                    style={{ width: `${progressPct}%` }}
                  />
                </div>
                <input
                  type="range"
                  min={0}
                  max={duration || 0}
                  step={0.1}
                  value={currentTime}
                  onChange={handleSeek}
                  className="absolute inset-0 w-full h-4 -top-1.5 opacity-0 cursor-pointer"
                  aria-label="Seek"
                />
                <div
                  className="absolute w-3 h-3 rounded-full bg-[#F5A623] shadow-[0_0_8px_rgba(245,166,35,0.6)] pointer-events-none transition-opacity opacity-0 group-hover/seek:opacity-100"
                  style={{ left: `calc(${progressPct}% - 6px)` }}
                />
              </div>
            )}

            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <button
                  onClick={togglePlay}
                  className="w-8 h-8 flex items-center justify-center rounded-full text-white hover:bg-white/10 transition-colors"
                  aria-label={isPlaying ? "Pause" : "Play"}
                >
                  {isPlaying ? (
                    <IconPause className="w-4 h-4" />
                  ) : (
                    <IconPlay className="w-4 h-4 ml-0.5" />
                  )}
                </button>

                <div className="flex items-center gap-1.5 group/vol">
                  <button
                    onClick={toggleMute}
                    className="w-8 h-8 flex items-center justify-center rounded-full text-white hover:bg-white/10 transition-colors"
                    aria-label={isMuted ? "Unmute" : "Mute"}
                  >
                    {isMuted || volume === 0 ? (
                      <IconVolumeMute className="w-4 h-4" />
                    ) : (
                      <IconVolumeHigh className="w-4 h-4" />
                    )}
                  </button>
                  <input
                    type="range"
                    min={0}
                    max={1}
                    step={0.05}
                    value={isMuted ? 0 : volume}
                    onChange={handleVolumeChange}
                    className="w-0 group-hover/vol:w-16 transition-all duration-200 accent-[#F5A623] h-1 cursor-pointer"
                    aria-label="Volume"
                  />
                </div>

                {!isLive && (
                  <span className="text-[11px] font-mono text-slate-300 tabular-nums">
                    {formatTime(currentTime)}{" "}
                    <span className="text-slate-500">/</span>{" "}
                    {formatTime(duration)}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-1.5">
                {/* Quality / ABR menu */}
                {tracks.length > 1 && (
                  <div className="relative">
                    <button
                      onClick={() => setShowQualityMenu((v) => !v)}
                      className="flex items-center gap-1 h-8 px-2.5 rounded-full text-white hover:bg-white/10 transition-colors"
                      aria-label="Quality settings"
                    >
                      <IconSettings className="w-3.5 h-3.5" />
                      <span className="text-[10px] font-mono uppercase tracking-wide text-slate-300">
                        {isAbrEnabled
                          ? "Auto"
                          : tracks.find((t) => t.id === activeTrackId)?.height
                            ? `${tracks.find((t) => t.id === activeTrackId).height}p`
                            : "Custom"}
                      </span>
                    </button>

                    {showQualityMenu && (
                      <div className="absolute bottom-10 right-0 w-40 rounded-xl bg-[#0B0E14]/95 backdrop-blur-xl border border-white/10 shadow-2xl overflow-hidden py-1">
                        <button
                          onClick={() => selectTrack("auto")}
                          className={`w-full text-left px-3 py-2 text-xs font-mono flex items-center justify-between hover:bg-white/10 transition-colors ${
                            isAbrEnabled ? "text-[#F5A623]" : "text-slate-300"
                          }`}
                        >
                          Auto
                          {isAbrEnabled && (
                            <span className="w-1.5 h-1.5 rounded-full bg-[#F5A623]" />
                          )}
                        </button>
                        {tracks
                          .filter(
                            (t, i, arr) =>
                              arr.findIndex((x) => x.height === t.height) === i,
                          )
                          .map((t) => (
                            <button
                              key={t.id}
                              onClick={() => selectTrack(t)}
                              className={`w-full text-left px-3 py-2 text-xs font-mono flex items-center justify-between hover:bg-white/10 transition-colors ${
                                !isAbrEnabled && activeTrackId === t.id
                                  ? "text-[#F5A623]"
                                  : "text-slate-300"
                              }`}
                            >
                              {t.height ? `${t.height}p` : "Unknown"}
                              {!isAbrEnabled && activeTrackId === t.id && (
                                <span className="w-1.5 h-1.5 rounded-full bg-[#F5A623]" />
                              )}
                            </button>
                          ))}
                      </div>
                    )}
                  </div>
                )}

                <button
                  onClick={toggleFullscreen}
                  className="w-8 h-8 flex items-center justify-center rounded-full text-white hover:bg-white/10 transition-colors"
                  aria-label={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
                >
                  {isFullscreen ? (
                    <IconExitFullscreen className="w-4 h-4" />
                  ) : (
                    <IconFullscreen className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ---- Loading state ---- */}
      {status === "loading" && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-[#05070B]">
          <div className="relative w-10 h-10">
            <div className="absolute inset-0 rounded-full border-2 border-white/10" />
            <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-[#F5A623] animate-spin" />
          </div>
          <span className="text-[11px] text-slate-500 font-mono uppercase tracking-[0.2em]">
            Connecting to stream
          </span>
        </div>
      )}

      {/* ---- Error state ---- */}
      {status === "error" && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-[#05070B] px-8 text-center">
          <div className="w-14 h-14 rounded-2xl bg-[#E0421A]/10 border border-[#E0421A]/20 text-[#E0421A] flex items-center justify-center">
            <IconAlert className="w-6 h-6" />
          </div>
          <div className="space-y-1.5">
            <p className="text-white text-sm font-semibold">
              Stream unavailable
            </p>
            <p className="text-slate-500 text-xs max-w-xs leading-relaxed">
              {errorMsg}
            </p>
          </div>
          <button
            onClick={retry}
            className="mt-1 flex items-center gap-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-2 text-xs font-medium text-slate-300 hover:text-white transition-colors"
          >
            <IconRefresh className="w-3.5 h-3.5" />
            Retry
          </button>
        </div>
      )}
    </div>
  );
}

// ---- Error message humanizer -------------------------------------------------

function humanizeShakaError(detail) {
  const code = detail?.code;
  const category = detail?.category;

  // Shaka error code reference: https://shaka-player-demo.appspot.com/docs/api/shaka.util.Error.html
  const map = {
    1001: "Could not reach the stream URL. Check the link or your connection.",
    1002: "The request timed out. The stream may be offline.",
    2000: "The manifest format isn't recognized as HLS or DASH.",
    2002: "Manifest couldn't be parsed — the source may be misconfigured.",
    3014: "This stream requires DRM credentials that weren't provided.",
    4032: "No playable video format found for this stream.",
  };

  if (code && map[code]) return map[code];
  if (detail?.message) return detail.message;
  if (category === 1) return "Network error — unable to reach the stream.";
  return "Unable to load this stream.";
}
