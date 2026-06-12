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
      // Dispatch custom event to notify Header
      window.dispatchEvent(new Event("favorites-updated"));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Link
      href={`/game/${game.slug || game.id}`}
      className="group relative flex flex-col overflow-hidden rounded-xl border border-white/5 bg-slate-900/40 p-2 transition-all duration-300 hover:border-violet-500/30 hover:bg-slate-900 hover:shadow-xl hover:shadow-violet-500/5 hover:-translate-y-1"
    >
      {/* Thumbnail Container */}
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg bg-slate-950">
        <img
          src={game.thumb}
          alt={game.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src =
              "https://placehold.co/400x300/111827/ffffff?text=Play+Game";
          }}
        />

        {/* Rating and Tags Overlay */}
        <div className="absolute top-2 left-2 flex items-center gap-1 rounded-full bg-slate-950/80 px-2 py-0.5 text-[10px] font-bold text-amber-400 shadow-md backdrop-blur-sm">
          <Star className="h-3 w-3 fill-amber-400" />
          <span>{rating}</span>
        </div>

        {/* Category Badge */}
        <div className="absolute top-2 right-2 rounded-full bg-slate-950/80 px-2.5 py-0.5 text-[10px] font-medium text-slate-300 shadow-md backdrop-blur-sm border border-white/5">
          {game.category}
        </div>

        {/* Hover Play Button Overlay */}
        <div className="absolute inset-0 flex items-center justify-center bg-slate-950/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <div className="flex h-12 w-12 scale-90 items-center justify-center rounded-full bg-gradient-to-tr from-violet-600 to-pink-500 text-white shadow-lg shadow-violet-500/40 transition-transform duration-300 group-hover:scale-100 hover:from-violet-500 hover:to-pink-400">
            <Play className="h-5 w-5 fill-white ml-0.5" />
          </div>
        </div>

        {/* Direct Favorite Heart Trigger */}
        <button
          onClick={toggleFavorite}
          className={`absolute bottom-2 right-2 flex h-8 w-8 items-center justify-center rounded-lg backdrop-blur-sm transition-all duration-200 border ${
            isFavorite
              ? "bg-pink-600/90 border-pink-500 text-white shadow-lg shadow-pink-500/20"
              : "bg-slate-950/80 border-white/5 text-slate-400 hover:border-pink-500/30 hover:text-pink-400 hover:bg-slate-950"
          }`}
          aria-label="Add to Favorites"
        >
          <Heart className={`h-4 w-4 ${isFavorite ? "fill-white" : ""}`} />
        </button>
      </div>

      {/* Info Blocks */}
      <div className="mt-2 flex flex-col px-1 pb-1">
        <h3 className="truncate text-sm font-semibold text-slate-100 group-hover:text-white transition-colors duration-200">
          {game.title}
        </h3>
        <p className="truncate text-[11px] text-slate-500 mt-0.5">
          {game.tags.split(",").slice(0, 3).join(" • ")}
        </p>
      </div>
    </Link>
  );
}
