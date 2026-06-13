"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, Heart, Shuffle, Bell, User, Menu, X, Gamepad2, LogOut } from "lucide-react";
import { Game } from "@/types";
import gamesData from "@/data/games.json";
import { useAuth } from "@/context/AuthContext";
import AuthModal from "./AuthModal";

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
  const { user, loading, logout } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const profileDropdownRef = useRef<HTMLDivElement>(null);

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
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target as Node)) {
        setShowProfileDropdown(false);
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

        <Link href="/" className="flex items-center gap-2 select-none group">
          {/* Cute Purple Monster Mascot with Horns & Joystick */}
          <div className="flex h-9 w-9 items-center justify-center transition-transform duration-300 group-hover:scale-110">
            <svg viewBox="0 0 100 100" className="h-full w-full">
              {/* Shadow */}
              <ellipse cx="50" cy="85" rx="30" ry="6" fill="rgba(0,0,0,0.35)" />
              {/* Body */}
              <path d="M 20 45 C 20 20, 80 20, 80 45 C 80 65, 75 80, 50 80 C 25 80, 20 65, 20 45 Z" fill="url(#purpleGrad)" />
              {/* Horns */}
              <path d="M 22 26 L 12 12 C 16 22, 22 26, 22 26 Z" fill="#4f46e5" />
              <path d="M 78 26 L 88 12 C 84 22, 78 26, 78 26 Z" fill="#4f46e5" />
              {/* Eyes */}
              <circle cx="38" cy="45" r="13" fill="white" />
              <circle cx="62" cy="45" r="13" fill="white" />
              {/* Pupils */}
              <circle cx="42" cy="47" r="6.5" fill="#1e1b4b" />
              <circle cx="58" cy="47" r="6.5" fill="#1e1b4b" />
              {/* Blush */}
              <circle cx="28" cy="56" r="4" fill="#ec4899" opacity="0.6" />
              <circle cx="72" cy="56" r="4" fill="#ec4899" opacity="0.6" />
              {/* Joystick badge on bottom right */}
              <circle cx="74" cy="74" r="15" fill="#f59e0b" stroke="#0f172a" strokeWidth="3" />
              <line x1="74" y1="74" x2="80" y2="65" stroke="#0f172a" strokeWidth="4" strokeLinecap="round" />
              <circle cx="80" cy="65" r="5" fill="#ef4444" stroke="#0f172a" strokeWidth="2" />
              <defs>
                <linearGradient id="purpleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#a78bfa" />
                  <stop offset="100%" stopColor="#6d28d9" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          {/* Typography */}
          <div className="flex flex-col font-fredoka leading-[0.9] text-white">
            <span className="text-[17px] font-bold tracking-tight text-white">crazy</span>
            <span className="text-[17px] font-bold tracking-tight text-white">arcade</span>
          </div>
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

        {/* User Account Block */}
        <div className="relative animate-fade-in" ref={profileDropdownRef}>
          {loading ? (
            <div className="h-9 w-9 rounded-lg border border-white/5 bg-slate-900/40 animate-pulse flex items-center justify-center">
              <span className="h-4 w-4 rounded-full bg-slate-800"></span>
            </div>
          ) : user ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                className="flex h-9 items-center gap-2 rounded-lg border border-white/10 bg-slate-900/60 p-1 pr-3 hover:border-violet-500/30 hover:bg-slate-900 transition-all active:scale-[0.98]"
              >
                <img
                  src={user.photoURL || `https://api.dicebear.com/7.x/bottts/svg?seed=${user.uid}`}
                  alt={user.displayName || "User Avatar"}
                  className="h-7 w-7 rounded-md object-cover border border-white/10"
                />
                <span className="hidden text-xs font-bold text-slate-200 md:inline max-w-[85px] truncate">
                  {user.displayName?.split(" ")[0] || "Player"}
                </span>
              </button>

              {/* Profile Dropdown Menu */}
              {showProfileDropdown && (
                <div className="absolute right-0 top-11 z-50 w-48 overflow-hidden rounded-xl border border-white/10 bg-slate-900 shadow-2xl backdrop-blur-xl animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="p-3 border-b border-white/5 bg-white/5 text-left">
                    <p className="text-xs font-bold text-white truncate">{user.displayName || "Anonymous Player"}</p>
                    <p className="text-[10px] text-slate-400 truncate">{user.email}</p>
                  </div>
                  <div className="flex flex-col p-1 text-left">
                    <Link
                      href="/?filter=favorites"
                      onClick={() => setShowProfileDropdown(false)}
                      className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-semibold text-slate-300 hover:bg-white/5 hover:text-white transition-colors"
                    >
                      <Heart className="h-3.5 w-3.5" />
                      <span>My Favorites</span>
                    </Link>
                    <button
                      onClick={async () => {
                        setShowProfileDropdown(false);
                        await logout();
                      }}
                      className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-semibold text-red-400 hover:bg-red-500/10 transition-colors"
                    >
                      <LogOut className="h-3.5 w-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="flex h-9 items-center gap-2 rounded-lg border border-white/5 bg-slate-900/60 px-3.5 text-xs font-bold text-violet-400 hover:border-violet-500/30 hover:bg-violet-950/20 hover:text-violet-300 transition-all active:scale-[0.98]"
            >
              <User className="h-4 w-4" />
              <span>Sign In</span>
            </button>
          )}
        </div>
      </div>
      
      {/* Auth Modal Trigger */}
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </header>
  );
}
