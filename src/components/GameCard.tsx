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

  return (
    <Link
      href={`/game/${game.slug || game.id}`}
      className="group relative flex flex-col overflow-hidden rounded-lg border border-white/5 bg-slate-900/40 p-0 transition-all duration-300 hover:border-violet-500 hover:ring-2 hover:ring-violet-500/20 hover:shadow-xl hover:shadow-violet-500/5 hover:-translate-y-1"
    >
      {/* Thumbnail Container */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-950">
        <img
          src={game.thumb}
          alt={game.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src =
              "https://placehold.co/400x300/111827/ffffff?text=Play+Game";
          }}
        />

        {/* Rating Overlay */}
        <div className="absolute top-1.5 left-1.5 flex items-center gap-0.5 rounded bg-slate-950/80 px-1.5 py-0.5 text-[9px] font-bold text-amber-400 shadow-md backdrop-blur-sm z-10">
          <Star className="h-2.5 w-2.5 fill-amber-400" />
          <span>{rating}</span>
        </div>

        {/* Category Badge */}
        <div className="absolute top-1.5 right-1.5 rounded bg-slate-950/80 px-1.5 py-0.5 text-[9px] font-medium text-slate-300 shadow-md backdrop-blur-sm border border-white/5 z-10">
          {game.category}
        </div>

        {/* Hover Play Button & Title Overlay */}
        <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 z-10">
          {/* Play Button centered */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex h-10 w-10 scale-90 items-center justify-center rounded-full bg-gradient-to-tr from-violet-600 to-pink-500 text-white shadow-lg shadow-violet-500/40 transition-transform duration-300 group-hover:scale-100 hover:from-violet-500 hover:to-pink-400">
              <Play className="h-4.5 w-4.5 fill-white ml-0.5" />
            </div>
          </div>

          {/* Title at bottom */}
          <div className="flex flex-col p-2.5 pt-6">
            <span className="w-full truncate text-[12px] font-bold text-white leading-tight">
              {game.title}
            </span>
            <span className="w-full truncate text-[10px] text-slate-400 mt-0.5">
              {game.category} • {game.tags.split(",")[0]?.trim()}
            </span>
          </div>
        </div>

        {/* Direct Favorite Heart Trigger */}
        <button
          onClick={toggleFavorite}
          className={`absolute bottom-1.5 right-1.5 flex h-7 w-7 items-center justify-center rounded-md backdrop-blur-sm transition-all duration-200 border z-20 ${
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
