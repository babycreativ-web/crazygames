"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Game } from "@/types";
import GameCard from "@/components/GameCard";
import {
  ArrowLeft,
  Maximize2,
  Heart,
  RotateCcw,
  Share2,
  Gamepad,
  Sparkles,
  Info,
} from "lucide-react";

interface GamePlayClientProps {
  game: Game;
  seoEntry: any;
  relatedGames: Game[];
}

export default function GamePlayClient({
  game,
  seoEntry,
  relatedGames,
}: GamePlayClientProps) {
  const [iframeLoading, setIframeLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Sync favorites check with localStorage on mount or game change
  useEffect(() => {
    setIframeLoading(true);
    try {
      const saved = localStorage.getItem("favorites_games");
      if (saved) {
        const list = JSON.parse(saved);
        if (Array.isArray(list)) {
          setIsFavorite(list.includes(game.id));
        }
      }
    } catch (e) {
      console.error("Failed to load favorites", e);
    }
  }, [game.id]);

  // Listen to postMessage events from self-hosted games (e.g. progress saves)
  useEffect(() => {
    const handleGameMessage = (event: MessageEvent) => {
      const data = event.data;
      if (data && typeof data === "object") {
        if (data.type === "save_progress") {
          console.log("Progress save received from game iframe:", data.payload);
          try {
            localStorage.setItem(`game_save_${game.id}`, JSON.stringify(data.payload));
            alert(`🏆 Progress Saved! High Score: ${data.payload.highScore}`);
          } catch (e) {
            console.error("Failed to save progress", e);
          }
        }
        if (data.type === "game_event") {
          console.log(`[Game Event - ${game.id}]:`, data.name, data);
        }
      }
    };

    window.addEventListener("message", handleGameMessage);
    return () => {
      window.removeEventListener("message", handleGameMessage);
    };
  }, [game.id]);

  // Prevent page scroll when pressing Arrow keys or Spacebar on play page
  useEffect(() => {
    const handleScrollKeys = (e: KeyboardEvent) => {
      const activeEl = document.activeElement;
      if (
        activeEl &&
        (activeEl.tagName === "INPUT" ||
          activeEl.tagName === "TEXTAREA" ||
          (activeEl as HTMLElement).isContentEditable)
      ) {
        return; // Allow typing in search or text inputs
      }

      // Keys that trigger browser scrolling
      const keysToBlock = ["Space", "ArrowUp", "ArrowDown", "PageUp", "PageDown"];
      if (
        keysToBlock.includes(e.code) ||
        ["ArrowUp", "ArrowDown", "PageUp", "PageDown", " "].includes(e.key)
      ) {
        e.preventDefault();
      }
    };

    window.addEventListener("keydown", handleScrollKeys);
    return () => {
      window.removeEventListener("keydown", handleScrollKeys);
    };
  }, []);

  const toggleFavorite = () => {
    try {
      const saved = localStorage.getItem("favorites_games");
      let list: string[] = [];
      if (saved) {
        list = JSON.parse(saved);
        if (!Array.isArray(list)) list = [];
      }

      if (isFavorite) {
        list = list.filter((id) => id !== game.id);
        setIsFavorite(false);
      } else {
        list.push(game.id);
        setIsFavorite(true);
      }

      localStorage.setItem("favorites_games", JSON.stringify(list));
      window.dispatchEvent(new Event("favorites-updated"));
    } catch (err) {
      console.error(err);
    }
  };

  const handleFullscreen = () => {
    const container = document.getElementById("game-player-frame");
    if (container) {
      if (container.requestFullscreen) {
        container.requestFullscreen();
      }
    }
  };

  const handleReload = () => {
    setIframeLoading(true);
    const iframe = document.getElementById("game-iframe") as HTMLIFrameElement;
    if (iframe) {
      iframe.src = iframe.src;
    }
  };

  const handleShare = () => {
    try {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 pb-12">
      {/* Left Column: Player, Title, Description */}
      <div className="flex-1 flex flex-col gap-6">
        {/* Back Link */}
        <Link
          href="/"
          className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors w-fit"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to games portal
        </Link>

        {/* Game Iframe Wrapper Container */}
        <div
          id="game-player-frame"
          className="relative aspect-video w-full overflow-hidden rounded-2xl border border-white/10 bg-slate-950 shadow-2xl group"
        >
          {/* Iframe Spinner Loader */}
          {iframeLoading && (
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-slate-950/90 text-slate-200">
              <div className="relative mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-pink-500 shadow-lg shadow-violet-500/20">
                <Gamepad className="h-7 w-7 text-white animate-bounce" />
              </div>
              <h3 className="text-md font-bold text-white mb-1">Loading "{game.title}"</h3>
              <p className="text-xs text-slate-500">Connecting to GameMonetize servers...</p>
            </div>
          )}

          {/* Actual Embedded Game Frame */}
          <iframe
            id="game-iframe"
            src={game.url}
            onLoad={() => {
              setIframeLoading(false);
              // Auto-focus the game iframe so key events go directly to the game
              const iframe = document.getElementById("game-iframe");
              if (iframe) {
                iframe.focus();
              }
            }}
            className="h-full w-full border-none z-10 bg-slate-950"
            allow="autoplay; gamepad; keyboard-map; accelerometer; gyroscope; payment; screen-wake-lock; web-share; fullscreen"
            scrolling="no"
            sandbox="allow-scripts allow-same-origin allow-popups allow-pointer-lock allow-forms"
          ></iframe>
        </div>

        {/* Toolbar below player */}
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-white/5 bg-slate-900/40 p-4">
          {/* Game Title Info */}
          <div className="flex items-center gap-3">
            <span className="rounded-lg bg-violet-600/10 border border-violet-500/20 p-2 text-violet-400">
              <Gamepad className="h-5 w-5" />
            </span>
            <div className="flex flex-col">
              <h1 className="text-lg font-bold text-white leading-tight">{game.title}</h1>
              <span className="text-xs text-slate-400 mt-0.5">
                Category:{" "}
                <Link
                  href={`/category/${game.category.toLowerCase().replace(/\s+/g, "-")}`}
                  className="text-violet-400 hover:text-pink-400 underline transition-colors"
                >
                  {game.category}
                </Link>
              </span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggleFavorite}
              title={isFavorite ? "Remove from Favorites" : "Add to Favorites"}
              className={`flex h-10 px-4 items-center gap-2 rounded-lg border transition-all text-xs font-bold ${
                isFavorite
                  ? "bg-pink-600/90 border-pink-500 text-white shadow-md shadow-pink-500/15"
                  : "bg-slate-900 border-white/5 text-slate-400 hover:border-pink-500/30 hover:text-pink-400"
              }`}
            >
              <Heart className={`h-4 w-4 ${isFavorite ? "fill-white" : ""}`} />
              <span>{isFavorite ? "Favorited" : "Favorite"}</span>
            </button>

            <button
              onClick={handleReload}
              title="Restart Game"
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/5 bg-slate-900 text-slate-400 hover:border-white/10 hover:text-white transition-all"
            >
              <RotateCcw className="h-4 w-4" />
            </button>

            <button
              onClick={handleShare}
              title="Copy Link"
              className="flex h-10 px-3 items-center gap-2 rounded-lg border border-white/5 bg-slate-900 text-slate-400 hover:border-white/10 hover:text-white transition-all text-xs font-bold"
            >
              <Share2 className="h-4 w-4" />
              <span>{copiedLink ? "Copied!" : "Share"}</span>
            </button>

            <button
              onClick={handleFullscreen}
              title="Go Fullscreen"
              className="flex h-10 px-4 items-center gap-2 rounded-lg bg-gradient-to-r from-violet-600 to-pink-500 text-white shadow-md shadow-violet-500/15 hover:from-violet-500 hover:to-pink-400 transition-all font-bold text-xs"
            >
              <Maximize2 className="h-4 w-4" />
              <span>Fullscreen</span>
            </button>
          </div>
        </div>

        {/* Game Info Details Card */}
        <div className="flex flex-col gap-6 rounded-2xl border border-white/5 bg-slate-900/20 p-6">
          {/* Header */}
          <div className="flex items-center gap-2 text-violet-400 font-bold border-b border-white/5 pb-3">
            <Info className="h-4.5 w-4.5" />
            <span className="text-sm uppercase tracking-wider">Game Instructions & Description</span>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-sm font-semibold text-slate-200 mb-1.5">About this Game</h3>
            {seoEntry && (seoEntry.seoDescription.includes("<p>") || seoEntry.seoDescription.includes("<h2>")) ? (
              <div 
                className="text-xs leading-relaxed text-slate-400 space-y-3 prose-seo"
                dangerouslySetInnerHTML={{ __html: seoEntry.seoDescription }}
              />
            ) : (
              <p className="text-xs leading-relaxed text-slate-400 whitespace-pre-line">
                {seoEntry ? seoEntry.seoDescription : game.description}
              </p>
            )}
            <div className="mt-4 text-[11px] text-slate-500 border-t border-white/5 pt-3 flex flex-col gap-2">
              <div className="flex flex-wrap gap-x-4 gap-y-2">
                <span>
                  Browse our dedicated{" "}
                  <Link
                    href={`/category/${game.category.toLowerCase().replace(/\s+/g, "-")}`}
                    className="text-violet-400 hover:text-pink-400 underline font-semibold transition-colors"
                  >
                    {game.category} Games
                  </Link>
                  {" "}landing page!
                </span>
                <span className="text-slate-600">•</span>
                <span>
                  Find hot titles on our{" "}
                  <Link
                    href="/?filter=popular"
                    className="text-violet-400 hover:text-pink-400 underline font-semibold transition-colors"
                  >
                    🔥 Trending Games
                  </Link>
                  {" "}list!
                </span>
              </div>

              {relatedGames.length > 0 && (
                <div className="text-slate-500 border-t border-white/5 pt-2 mt-1">
                  <strong>Similar Games:</strong>{" "}
                  {relatedGames.slice(0, 3).map((rg, idx) => (
                    <React.Fragment key={rg.id}>
                      {idx > 0 && " • "}
                      <Link
                        href={`/game/${rg.slug || rg.id}`}
                        className="text-violet-400 hover:text-pink-400 underline font-semibold transition-colors"
                      >
                        {rg.title}
                      </Link>
                    </React.Fragment>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Instructions / Controls */}
          <div>
            <h3 className="text-sm font-semibold text-slate-200 mb-1.5">Game Controls</h3>
            <p className="text-xs leading-relaxed text-slate-400 bg-slate-900/60 border border-white/5 rounded-xl p-3.5 italic whitespace-pre-line">
              {seoEntry ? seoEntry.controls : game.instructions}
            </p>
          </div>

          {/* AI Generated Pro Tips (Render only if present) */}
          {seoEntry && seoEntry.tips && (
            <div className="rounded-xl border border-violet-500/15 bg-violet-950/10 p-4">
              <h3 className="text-sm font-bold text-violet-400 mb-2 flex items-center gap-1.5">
                <Sparkles className="h-4 w-4" />
                Pro Tips to Win
              </h3>
              <ul className="list-disc pl-4 text-xs text-slate-300 space-y-1.5">
                {seoEntry.tips.map((tip: string, idx: number) => (
                  <li key={idx}>{tip}</li>
                ))}
              </ul>
            </div>
          )}

          {/* AI Generated FAQ Blocks (Render only if present) */}
          {seoEntry && seoEntry.faqs && (
            <div className="border-t border-white/5 pt-4">
              <h3 className="text-sm font-bold text-white mb-3">Frequently Asked Questions</h3>
              <div className="space-y-4">
                {seoEntry.faqs.map((faq: any, idx: number) => (
                  <div key={idx} className="rounded-lg bg-slate-900/40 p-3.5 border border-white/5">
                    <h4 className="text-xs font-bold text-slate-200 mb-1">Q: {faq.q}</h4>
                    <p className="text-xs text-slate-400">A: {faq.a}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tags list */}
          <div>
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Tags</h3>
            <div className="flex flex-wrap gap-1.5">
              {game.tags.split(",").map((tag, idx) => (
                <Link
                  key={idx}
                  href={`/?search=${encodeURIComponent(tag.trim())}`}
                  className="rounded-full bg-slate-900 hover:bg-slate-800 border border-white/5 px-3 py-1 text-[10px] font-semibold text-slate-300 hover:text-white transition-colors"
                >
                  {tag.trim()}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: Recommendations Sidebar */}
      <div className="w-full lg:w-80 shrink-0 flex flex-col gap-6">
        <div className="flex items-center gap-2 border-b border-white/5 pb-3">
          <Sparkles className="h-4.5 w-4.5 text-violet-400 animate-pulse" />
          <h2 className="text-md font-bold tracking-tight text-white">Recommended Games</h2>
        </div>

        {relatedGames.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-1">
            {relatedGames.map((g) => (
              <GameCard key={g.id} game={g} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-xs text-slate-500 border border-white/5 border-dashed rounded-2xl">
            No related games found in {game.category}
          </div>
        )}
      </div>
    </div>
  );
}
