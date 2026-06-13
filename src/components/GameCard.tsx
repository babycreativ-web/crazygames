"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Heart, Play, Star } from "lucide-react";
import { Game } from "@/types";

interface GameCardProps {
  game: Game;
}

export default function GameCard({ game }: GameCardProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [rating, setRating] = useState(4.0);

  // Hover states for gameplay video loop preview
  const [isHovered, setIsHovered] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);

  // Check if this game is favorited on load
  useEffect(() => {
    try {
      const saved = localStorage.getItem("favorites_games");
      if (saved) {
        const list = JSON.parse(saved);
        if (Array.isArray(list)) {
          setIsFavorite(list.includes(game.id));
        }
      }
    } catch (e) {
      console.error(e);
    }

    // Generate a consistent pseudo-random rating based on game.id
    const ratingSeed = parseInt(game.id.slice(-2)) || 45;
    const computedRating = 4.0 + (ratingSeed % 10) / 10;
    setRating(computedRating > 5.0 ? 4.9 : parseFloat(computedRating.toFixed(1)));
  }, [game.id]);

  // Debounced hover playback to prevent mass preloading when mouse sweeps across cards
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isHovered) {
      timer = setTimeout(() => {
        setShowVideo(true);
      }, 250); // 250ms delay
    } else {
      setShowVideo(false);
      setVideoLoaded(false);
    }
    return () => {
      clearTimeout(timer);
    };
  }, [isHovered]);

  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
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

  // Helper to map category to optimized Cloudinary CDN stock gameplay loops
  const getVideoSrc = (category: string) => {
    const cat = category.toLowerCase();
    if (cat.includes("driving") || cat.includes("car") || cat.includes("sports")) {
      return "https://res.cloudinary.com/demo/video/upload/q_auto,f_auto,w_400/finish_line.mp4";
    }
    if (
      cat.includes("puzzle") ||
      cat.includes("thinky") ||
      cat.includes("trivia") ||
      cat.includes("word") ||
      cat.includes("board") ||
      cat.includes("card")
    ) {
      return "https://res.cloudinary.com/demo/video/upload/q_auto,f_auto,w_400/sea_turtle.mp4";
    }
    if (cat.includes("simulation") || cat.includes("clicker")) {
      return "https://res.cloudinary.com/demo/video/upload/q_auto,f_auto,w_400/dog.mp4";
    }
    // Fallback for action, shooting, arcade, io, etc.
    return "https://res.cloudinary.com/demo/video/upload/q_auto,f_auto,w_400/rafting.mp4";
  };

  return (
    <Link
      href={`/game/${game.slug || game.id}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative flex flex-col overflow-hidden rounded-lg border border-white/5 bg-slate-900/40 p-0 transition-all duration-300 hover:border-violet-500 hover:ring-2 hover:ring-violet-500/20 hover:shadow-xl hover:shadow-violet-500/5 hover:-translate-y-1"
    >
      {/* Thumbnail Container */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-950">
        {/* Static Image Thumbnail */}
        <img
          src={game.thumb}
          alt={game.title}
          loading="lazy"
          className={`h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 ${
            videoLoaded ? "opacity-0" : "opacity-100"
          }`}
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src =
              "https://placehold.co/400x300/111827/ffffff?text=Play+Game";
          }}
        />

        {/* Live Video Preview (Rendered only on debounced hover) */}
        {showVideo && (
          <video
            src={getVideoSrc(game.category)}
            autoPlay
            loop
            muted
            playsInline
            onCanPlay={() => setVideoLoaded(true)}
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-300 z-10 ${
              videoLoaded ? "opacity-100" : "opacity-0"
            }`}
          />
        )}

        {/* Rating Overlay (hidden on hover to make video completely clean) */}
        <div className={`absolute top-1.5 left-1.5 flex items-center gap-0.5 rounded bg-slate-950/80 px-1.5 py-0.5 text-[9px] font-bold text-amber-400 shadow-md backdrop-blur-sm z-10 transition-opacity duration-200 ${
          isHovered ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}>
          <Star className="h-2.5 w-2.5 fill-amber-400" />
          <span>{rating}</span>
        </div>

        {/* Category Badge (hidden on hover) */}
        <div className={`absolute top-1.5 right-1.5 rounded bg-slate-950/80 px-1.5 py-0.5 text-[9px] font-medium text-slate-300 shadow-md backdrop-blur-sm border border-white/5 z-10 transition-opacity duration-200 ${
          isHovered ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}>
          {game.category}
        </div>

        {/* Hover Play Button & Bottom Left Title Overlay */}
        <div className={`absolute inset-0 flex flex-col justify-between p-2 transition-all duration-300 z-20 ${
          isHovered ? "opacity-100 bg-slate-950/30" : "opacity-0 bg-transparent pointer-events-none"
        }`}>
          {/* Top spacer */}
          <div className="h-4"></div>
          
          {/* Play Button in center */}
          <div className="flex justify-center">
            <div className="flex h-9 w-9 scale-90 items-center justify-center rounded-full bg-gradient-to-tr from-violet-600 to-pink-500 text-white shadow-lg shadow-violet-500/40 transition-transform duration-300 group-hover:scale-100 hover:from-violet-500 hover:to-pink-400">
              <Play className="h-4 w-4 fill-white ml-0.5" />
            </div>
          </div>

          {/* Title and tags at bottom left (align left) */}
          <div className="flex flex-col items-start text-left w-full bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent p-2 -mx-2 -mb-2 rounded-b-lg">
            <span className="w-full truncate text-[11px] font-bold text-white leading-tight">
              {game.title}
            </span>
            <span className="w-full truncate text-[9px] text-slate-400 mt-0.5">
              {game.category} • {game.tags.split(",")[0]}
            </span>
          </div>
        </div>

        {/* Direct Favorite Heart Trigger */}
        <button
          onClick={toggleFavorite}
          className={`absolute bottom-1.5 right-1.5 flex h-7 w-7 items-center justify-center rounded-md backdrop-blur-sm transition-all duration-200 border z-30 ${
            isFavorite
              ? "bg-pink-600/90 border-pink-500 text-white shadow-lg shadow-pink-500/20"
              : "bg-slate-950/80 border-white/5 text-slate-400 hover:border-pink-500/30 hover:text-pink-400 hover:bg-slate-950"
          }`}
          aria-label="Add to Favorites"
        >
          <Heart className={`h-3.5 w-3.5 ${isFavorite ? "fill-white" : ""}`} />
        </button>
      </div>
    </Link>
  );
}
