"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, Heart, Shuffle, Bell, User, Menu, X, Gamepad2 } from "lucide-react";
import { Game } from "@/types";
import gamesData from "@/data/games.json";

interface HeaderProps {
  onToggleSidebar?: () => void;
  sidebarOpen?: boolean;
}

export default function Header({ onToggleSidebar, sidebarOpen }: HeaderProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Game[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [favoritesCount, setFavoritesCount] = useState(0);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Load favorites count from localStorage
  useEffect(() => {
    const updateFavorites = () => {
      try {
        const saved = localStorage.getItem("favorites_games");
        if (saved) {
          const list = JSON.parse(saved);
          setFavoritesCount(Array.isArray(list) ? list.length : 0);
        } else {
          setFavoritesCount(0);
        }
      } catch (e) {
        console.error(e);
      }
    };

    updateFavorites();
    window.addEventListener("storage", updateFavorites);
    window.addEventListener("favorites-updated", updateFavorites);

    return () => {
      window.removeEventListener("storage", updateFavorites);
      window.removeEventListener("favorites-updated", updateFavorites);
    };
  }, []);

  // Handle click outside dropdown to close it
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Perform search filtering
  useEffect(() => {
    if (searchQuery.trim().length > 0) {
      const filtered = (gamesData as Game[]).filter(
        (game) =>
          game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          game.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
          game.tags.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSearchResults(filtered.slice(0, 5));
      setShowDropdown(true);
    } else {
      setSearchResults([]);
      setShowDropdown(false);
    }
  }, [searchQuery]);

  // Navigate to random game
  const handleRandomPlay = () => {
    const games = gamesData as Game[];
    if (games.length > 0) {
      const randomGame = games[Math.floor(Math.random() * games.length)];
      router.push(`/game/${randomGame.slug || randomGame.id}`);
      setSearchQuery("");
      setShowDropdown(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim().length > 0) {
      router.push(`/?search=${encodeURIComponent(searchQuery.trim())}`);
      setShowDropdown(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 flex h-16 w-full items-center justify-between border-b border-white/5 bg-slate-950/75 px-4 backdrop-blur-md md:px-6">
      {/* Left side: Menu toggle & Brand Logo */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="rounded-lg p-2 text-slate-400 hover:bg-white/5 hover:text-white lg:hidden"
          aria-label="Toggle Sidebar"
        >
          {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>

        <Link href="/" className="flex items-center gap-2 font-black text-xl tracking-wider select-none">
          <div className="flex items-center justify-center rounded-lg bg-gradient-to-br from-violet-600 to-pink-500 p-1.5 shadow-lg shadow-violet-500/20">
            <Gamepad2 className="h-5 w-5 text-white" />
          </div>
          <span className="bg-gradient-to-r from-violet-400 via-pink-400 to-orange-400 bg-clip-text text-transparent glow-on-hover transition-all duration-300">
            CRAZYARCADE
          </span>
        </Link>
      </div>

      {/* Middle: Autocomplete Search Box */}
      <div className="relative mx-4 flex max-w-md flex-1 items-center" ref={dropdownRef}>
        <form onSubmit={handleSearchSubmit} className="relative w-full">
          <input
            type="text"
            placeholder="Search game, category, or tag..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => searchQuery.trim().length > 0 && setShowDropdown(true)}
            className="h-10 w-full rounded-full border border-white/10 bg-slate-900/60 pl-10 pr-4 text-sm text-slate-100 placeholder-slate-400 outline-none ring-offset-slate-950 transition-all focus:border-violet-500 focus:bg-slate-900 focus:ring-2 focus:ring-violet-500/30"
          />
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
        </form>

        {/* Dropdown Results */}
        {showDropdown && searchResults.length > 0 && (
          <div className="absolute top-12 left-0 w-full overflow-hidden rounded-xl border border-white/10 bg-slate-900 shadow-2xl backdrop-blur-xl">
            <div className="p-2 text-xs font-semibold text-slate-400 border-b border-white/5">
              Suggested Games
            </div>
            <div className="flex flex-col">
              {searchResults.map((game) => (
                <Link
                  key={game.id}
                  href={`/game/${game.slug || game.id}`}
                  onClick={() => {
                    setSearchQuery("");
                    setShowDropdown(false);
                  }}
                  className="flex items-center gap-3 p-3 transition-colors hover:bg-white/5"
                >
                  <img
                    src={game.thumb}
                    alt={game.title}
                    className="h-10 w-16 rounded-md object-cover border border-white/10 shadow-sm"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src =
                        "https://placehold.co/120x90/111827/ffffff?text=Gamepad";
                    }}
                  />
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-slate-100">{game.title}</span>
                    <span className="text-xs text-violet-400">{game.category}</span>
                  </div>
                </Link>
              ))}
            </div>
            <div
              onClick={() => {
                router.push(`/?search=${encodeURIComponent(searchQuery.trim())}`);
                setShowDropdown(false);
              }}
              className="cursor-pointer bg-white/5 p-2 text-center text-xs font-medium text-violet-400 hover:text-violet-300"
            >
              See all results for "{searchQuery}"
            </div>
          </div>
        )}
      </div>

      {/* Right side: Random game, Favorites, notifications, profile */}
      <div className="flex items-center gap-2 md:gap-3">
        {/* Shuffle Button */}
        <button
          onClick={handleRandomPlay}
          title="Play a Random Game"
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/5 bg-slate-900/60 text-slate-400 hover:border-violet-500/30 hover:bg-violet-950/20 hover:text-violet-400 transition-all duration-200"
        >
          <Shuffle className="h-4.5 w-4.5" />
        </button>

        {/* Favorites Page Link */}
        <Link
          href="/?filter=favorites"
          title="My Favorites"
          className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-white/5 bg-slate-900/60 text-slate-400 hover:border-pink-500/30 hover:bg-pink-950/20 hover:text-pink-400 transition-all duration-200"
        >
          <Heart className="h-4.5 w-4.5" />
          {favoritesCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-pink-500 text-[10px] font-bold text-white shadow-lg shadow-pink-500/30 animate-pulse">
              {favoritesCount}
            </span>
          )}
        </Link>

        {/* Notifications Mock */}
        <button
          title="Notifications"
          className="hidden md:flex h-9 w-9 items-center justify-center rounded-lg border border-white/5 bg-slate-900/60 text-slate-400 hover:bg-white/5 hover:text-white transition-all"
        >
          <Bell className="h-4.5 w-4.5" />
        </button>

        {/* User Account Drawer */}
        <button
          title="Profile"
          className="flex h-9 items-center gap-2 rounded-lg border border-white/5 bg-slate-900/60 px-3 text-slate-400 hover:bg-white/5 hover:text-white transition-all"
        >
          <User className="h-4.5 w-4.5" />
          <span className="hidden text-xs font-semibold md:inline">Player</span>
        </button>
      </div>
    </header>
  );
}
