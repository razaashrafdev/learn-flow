import { useCallback, useEffect, useRef, useState } from "react";
import { Maximize, Pause, Play, Volume2, VolumeX } from "lucide-react";
import { cn } from "@/lib/utils";

declare global {
  interface Window {
    YT?: {
      Player: new (id: string, opts: Record<string, unknown>) => YT.Player;
    };
    onYouTubeIframeAPIReady?: () => void;
  }
  namespace YT {
    interface Player {
      playVideo(): void;
      pauseVideo(): void;
      seekTo(seconds: number, allowSeekAhead: boolean): void;
      getCurrentTime(): number;
      getDuration(): number;
      getPlayerState(): number;
      getPlaybackRate(): number;
      getAvailablePlaybackRates(): number[];
      getQuality(): string;
      getAvailableQualityLevels(): string[];
      setPlaybackRate(rate: number): void;
      setQuality(quality: string): void;
      setVolume(volume: number): void;
      getVolume(): number;
      isMuted(): boolean;
      mute(): void;
      unMute(): void;
      destroy(): void;
      addEventListener(event: string, handler: (event: { data: number }) => void): void;
      getIframe(): HTMLIFrameElement;
    }
  }
}

const STATE = { PLAYING: 1, PAUSED: 2, BUFFERING: 3 } as const;
const SPEEDS = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];

interface QualityOption {
  label: string;
  value: string;
  ytLabel: string;
}

const QUALITY_OPTIONS_BASE: QualityOption[] = [
  { label: "Auto", value: "auto", ytLabel: "auto" },
  { label: "360p", value: "360", ytLabel: "medium" },
  { label: "720p", value: "720", ytLabel: "hd720" },
];

function fmt(s: number) {
  if (!isFinite(s) || s < 0) return "0:00";
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, "0")}`;
}

interface Props {
  videoId: string;
  className?: string;
}
export function VideoPlayer({ videoId, className }: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<YT.Player | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval>>(null);
  const hideTimer = useRef<ReturnType<typeof setTimeout>>(null);
  const pendingQuality = useRef<string | null>(null);
  const retryTimer = useRef<ReturnType<typeof setTimeout>>(null);

  const [playing, setPlaying] = useState(false);
  const [cur, setCur] = useState(0);
  const [dur, setDur] = useState(0);
  const [muted, setMuted] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [speedOpen, setSpeedOpen] = useState(false);
  const [quality, setQuality] = useState("auto");
  const [qualityOpen, setQualityOpen] = useState(false);
  const [ready, setReady] = useState(false);
  const [showCtrl, setShowCtrl] = useState(false);
  const [doubleTap, setDoubleTap] = useState<{ side: "left" | "right"; key: number } | null>(null);
  const doubleTapTimer = useRef<ReturnType<typeof setTimeout>>(null);
  const [availableQualities, setAvailableQualities] = useState<string[]>([]);

  const destroy = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (hideTimer.current) clearTimeout(hideTimer.current);
    if (retryTimer.current) clearTimeout(retryTimer.current);
    try { playerRef.current?.destroy(); } catch { /* empty */ }
    playerRef.current = null;
  }, []);

  const applyQuality = useCallback((ytLabel: string, retries = 3) => {
    const p = playerRef.current;
    if (!p) return;
    try { p.setQuality(ytLabel); } catch { /* empty */ }
    if (retries > 0) {
      retryTimer.current = setTimeout(() => {
        const current = playerRef.current;
        if (!current) return;
        try {
          const actual = current.getQuality();
          if (ytLabel !== "auto" && actual !== ytLabel) {
            try { current.setQuality(ytLabel); } catch { /* empty */ }
            applyQuality(ytLabel, retries - 1);
          }
        } catch { /* empty */ }
      }, 500);
    }
  }, []);
  useEffect(() => {
    destroy();
    setPlaying(false);
    setCur(0);
    setDur(0);
    setReady(false);
    setSpeedOpen(false);
    setQualityOpen(false);
    setAvailableQualities([]);

    let cancelled = false;

    const init = () => {
      if (cancelled || !window.YT?.Player || !wrapRef.current) return;
      const elId = `yt-${videoId}`;
      const el = document.getElementById(elId);
      if (el) el.innerHTML = "";

      new window.YT.Player(elId, {
        videoId,
        playerVars: {
          rel: 0,
          controls: 0,
          iv_load_policy: 3,
          playsinline: 1,
          disablekb: 1,
          modestbranding: 1,
          origin: window.location.origin,
        },
        events: {
          onReady: (e: { target: YT.Player }) => {
            if (cancelled) return;
            playerRef.current = e.target;
            setDur(e.target.getDuration());
            setReady(true);
            timerRef.current = setInterval(() => {
              const p = playerRef.current;
              if (!p) return;
              try { setCur(p.getCurrentTime()); } catch { /* empty */ }
            }, 250);
          },
          onStateChange: (e: { data: number }) => {
            if (cancelled) return;
            if (e.data === STATE.PLAYING) {
              setPlaying(true);
              setDur(playerRef.current?.getDuration() ?? 0);
              try {
                const levels = playerRef.current?.getAvailableQualityLevels();
                if (levels && levels.length > 0) {
                  setAvailableQualities(levels);
                }
              } catch { /* empty */ }
              if (pendingQuality.current) {
                const label = pendingQuality.current;
                pendingQuality.current = null;
                applyQuality(label);
              }
            } else if (e.data === STATE.PAUSED) {
              setPlaying(false);
            } else if (e.data === STATE.BUFFERING) {
              if (pendingQuality.current) {
                const label = pendingQuality.current;
                pendingQuality.current = null;
                applyQuality(label);
              }
            }
          },
        },
      });
    };

    if (!window.YT) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      tag.async = true;
      window.onYouTubeIframeAPIReady = () => {
        init();
      };
      document.head.appendChild(tag);
    } else {
      init();
    }

    return () => { cancelled = true; destroy(); };
  }, [videoId, destroy, applyQuality]);
  const togglePlay = useCallback(() => {
    const p = playerRef.current;
    if (!p) return;
    playing ? p.pauseVideo() : p.playVideo();
  }, [playing]);

  const seek = useCallback((offset: number) => {
    const p = playerRef.current;
    if (!p) return;
    p.seekTo(
      Math.max(0, Math.min(p.getCurrentTime() + offset, p.getDuration())),
      true,
    );
  }, []);

  const onBarClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const p = playerRef.current;
      const rect = e.currentTarget.getBoundingClientRect();
      if (!p || !rect.width) return;
      const pct = (e.clientX - rect.left) / rect.width;
      p.seekTo(pct * p.getDuration(), true);
      setCur(pct * p.getDuration());
    },
    [],
  );

  const toggleMute = useCallback(() => {
    const p = playerRef.current;
    if (!p) return;
    p.isMuted() ? p.unMute() : p.mute();
    setMuted(p.isMuted());
  }, []);

  const toggleFullscreen = useCallback(() => {
    const el = wrapRef.current?.parentElement;
    if (!el) return;
    document.fullscreenElement
      ? document.exitFullscreen()
      : el.requestFullscreen?.();
  }, []);

  const showControls = useCallback(() => {
    setShowCtrl(true);
    if (hideTimer.current) clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => setShowCtrl(false), 3000);
  }, []);

  const handleDoubleClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const side = x < rect.width / 2 ? "left" : "right";
      seek(side === "left" ? -10 : 10);
      setDoubleTap({ side, key: Date.now() });
      if (doubleTapTimer.current) clearTimeout(doubleTapTimer.current);
      doubleTapTimer.current = setTimeout(() => setDoubleTap(null), 700);
    },
    [seek],
  );

  const closeMenus = useCallback(() => {
    setSpeedOpen(false);
    setQualityOpen(false);
  }, []);

  const handleQualitySelect = useCallback(
    (opt: QualityOption) => {
      setQuality(opt.value);
      setQualityOpen(false);
      const p = playerRef.current;
      if (!p) {
        pendingQuality.current = opt.ytLabel;
        return;
      }
      try { p.setQuality(opt.ytLabel); } catch { /* empty */ }
      applyQuality(opt.ytLabel);
    },
    [applyQuality],
  );

  const qualityOptions = QUALITY_OPTIONS_BASE.filter((opt) => {
    if (opt.value === "auto") return true;
    return availableQualities.includes(opt.ytLabel);
  });

  const pct = dur > 0 ? (cur / dur) * 100 : 0;
  return (
    <div
      className={cn("relative bg-black", className)}
      onMouseMove={showControls}
      onMouseEnter={showControls}
      onMouseLeave={() => {
        if (!speedOpen && !qualityOpen) setShowCtrl(false);
      }}
    >
      <div
        ref={wrapRef}
        className="relative w-full"
        style={{ paddingBottom: "56.25%" }}
        onDoubleClick={handleDoubleClick}
      >
        <div
          id={`yt-${videoId}`}
          className="absolute inset-0 h-full w-full"
        />

        {doubleTap && (
          <div
            key={doubleTap.key}
            className={cn(
              "absolute top-1/2 z-10 flex h-16 w-16 -translate-y-1/2 items-center justify-center rounded-full bg-black/60 text-white text-sm font-bold animate-in fade-in zoom-in duration-200",
              doubleTap.side === "left" ? "left-8" : "right-8",
            )}
          >
            {doubleTap.side === "left" ? "-10s" : "+10s"}
          </div>
        )}
      </div>

      {ready && (
        <div
          className={cn(
            "absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent px-4 pb-3 pt-10 transition-opacity duration-300",
            showCtrl || speedOpen || qualityOpen
              ? "opacity-100"
              : "opacity-0",
          )}
        >
          <div
            className="group/bar relative mb-2 h-1.5 w-full cursor-pointer rounded-full bg-white/20"
            onClick={(e) => { onBarClick(e); closeMenus(); }}
          >
            <div
              className="h-full rounded-full bg-primary transition-[width] duration-100"
              style={{ width: `${pct}%` }}
            />
            <div
              className="absolute top-1/2 h-3.5 w-3.5 -translate-y-1/2 rounded-full bg-primary opacity-0 transition-opacity group-hover/bar:opacity-100"
              style={{ left: `calc(${pct}% - 7px)` }}
            />
          </div>

          <div className="flex items-center gap-0.5 text-white">
            <button
              type="button"
              onClick={() => { togglePlay(); closeMenus(); }}
              className="rounded-md p-1.5 hover:bg-white/20"
            >
              {playing ? (
                <Pause className="h-4 w-4" />
              ) : (
                <Play className="h-4 w-4" />
              )}
            </button>

            <button
              type="button"
              onClick={() => { toggleMute(); closeMenus(); }}
              className="rounded-md p-1.5 hover:bg-white/20"
            >
              {muted ? (
                <VolumeX className="h-4 w-4" />
              ) : (
                <Volume2 className="h-4 w-4" />
              )}
            </button>

            <span className="ml-1 text-xs tabular-nums text-white/80">
              {fmt(cur)} / {fmt(dur)}
            </span>

            <div className="ml-auto flex items-center gap-0.5">              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setSpeedOpen(!speedOpen);
                    setQualityOpen(false);
                  }}
                  className="rounded-md px-2 py-1 text-xs font-semibold hover:bg-white/20"
                >
                  {speed}x
                </button>
                {speedOpen && (
                  <div className="absolute bottom-full right-0 mb-2 overflow-hidden rounded-lg border border-border bg-card shadow-lg">
                    {SPEEDS.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          playerRef.current?.setPlaybackRate(s);
                          setSpeed(s);
                          setSpeedOpen(false);
                        }}
                        className={cn(
                          "block w-full whitespace-nowrap px-4 py-2 text-left text-sm hover:bg-muted",
                          speed === s && "bg-primary/10 font-bold text-primary",
                        )}
                      >
                        {s}x
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setQualityOpen(!qualityOpen);
                    setSpeedOpen(false);
                  }}
                  className="rounded-md px-2 py-1 text-xs font-semibold hover:bg-white/20"
                >
                  {quality === "auto" ? "Auto" : `${quality}p`}
                </button>
                {qualityOpen && (
                  <div className="absolute bottom-full right-0 mb-2 overflow-hidden rounded-lg border border-border bg-card shadow-lg">
                    {qualityOptions.map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleQualitySelect(opt);
                        }}
                        className={cn(
                          "block w-full whitespace-nowrap px-4 py-2 text-left text-sm hover:bg-muted",
                          quality === opt.value && "bg-primary/10 font-bold text-primary",
                        )}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={toggleFullscreen}
                className="rounded-md p-1.5 hover:bg-white/20"
              >
                <Maximize className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}