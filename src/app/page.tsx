"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Game } from "@/types";
import gamesData from "@/data/games.json";
import GameCard from "@/components/GameCard";
import { Play, Flame, Heart, Sparkles, Grid, Search, HelpCircle, Star, Zap, Brain, Skull, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

export default function Home() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const activeCategory = searchParams.get("category");
  const activeFilter = searchParams.get("filter");
  const searchQuery = searchParams.get("search");

  const [filteredGames, setFilteredGames] = useState<Game[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [featuredGame, setFeaturedGame] = useState<Game | null>(null);
  const [visibleCount, setVisibleCount] = useState(20);
  const [recentlyPlayed, setRecentlyPlayed] = useState<Game[]>([]);

  // Load favorites, recently played and filter games
  useEffect(() => {
    // 1. Get favorites from localStorage
    const loadFavorites = () => {
      try {
        const saved = localStorage.getItem("favorites_games");
        if (saved) {
          setFavorites(JSON.parse(saved));
        } else {
          setFavorites([]);
        }
      } catch (e) {
        console.error(e);
      }
    };

    // 2. Get recently played from localStorage
    const loadRecentlyPlayed = () => {
      try {
        const saved = localStorage.getItem("recently_played");
        if (saved) {
          const ids = JSON.parse(saved);
          if (Array.isArray(ids)) {
            const allGames = gamesData as Game[];
            const matched = ids
              .map((id) => allGames.find((g) => g.id === id))
              .filter(Boolean) as Game[];
            setRecentlyPlayed(matched);
          }
        } else {
          setRecentlyPlayed([]);
        }
      } catch (e) {
        console.error(e);
      }
    };

    loadFavorites();
    loadRecentlyPlayed();

    window.addEventListener("favorites-updated", loadFavorites);
    
    const handleRecentlyPlayedUpdate = () => {
      loadRecentlyPlayed();
    };
    window.addEventListener("recently-played-updated", handleRecentlyPlayedUpdate);

    return () => {
      window.removeEventListener("favorites-updated", loadFavorites);
      window.removeEventListener("recently-played-updated", handleRecentlyPlayedUpdate);
    };
  }, []);

  // Filter game data based on parameters
  useEffect(() => {
    let result = gamesData as Game[];

    // Filter by search
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (g) =>
          g.title.toLowerCase().includes(q) ||
          g.category.toLowerCase().includes(q) ||
          g.tags.toLowerCase().includes(q)
      );
    }

    // Filter by category
    if (activeCategory) {
      result = result.filter(
        (g) => g.category.toLowerCase() === activeCategory.toLowerCase()
      );
    }

    // Filter by main categories / sidebar choices
    if (activeFilter === "favorites") {
      result = result.filter((g) => favorites.includes(g.id));
    } else if (activeFilter === "popular") {
      // Sort or filter by high play counts (pseudo simulation)
      result = [...result].sort((a, b) => parseInt(b.id) - parseInt(a.id));
    } else if (activeFilter === "new") {
      // Sort by newest addition (id base)
      result = [...result].reverse();
    } else if (activeFilter === "rage") {
      result = result.filter(
        (g) =>
          g.tags.toLowerCase().includes("skill") ||
          g.tags.toLowerCase().includes("physics") ||
          g.tags.toLowerCase().includes("run") ||
          g.tags.toLowerCase().includes("avoid") ||
          g.title.toLowerCase().includes("rage") ||
          g.title.toLowerCase().includes("impossible") ||
          g.title.toLowerCase().includes("run")
      );
    } else if (activeFilter === "hardest") {
      result = result.filter(
        (g) =>
          g.tags.toLowerCase().includes("difficult") ||
          g.tags.toLowerCase().includes("shooter") ||
          g.tags.toLowerCase().includes("zombie") ||
          g.tags.toLowerCase().includes("ninja") ||
          g.title.toLowerCase().includes("escape") ||
          g.title.toLowerCase().includes("master") ||
          g.title.toLowerCase().includes("hard")
      );
    } else if (activeFilter === "iq-puzzle") {
      result = result.filter((g) => g.category.toLowerCase() === "puzzle");
    }

    setFilteredGames(result);

    // Set a random featured game from the results (or fallback to first game)
    if (result.length > 0) {
      setFeaturedGame(result[0]);
    } else {
      setFeaturedGame(null);
    }

    // Reset pagination on filter change
    setVisibleCount(20);
  }, [activeCategory, activeFilter, searchQuery, favorites]);

  // Load more games handler
  const handleShowMore = () => {
    setVisibleCount((prev) => prev + 12);
  };

  const getPageTitle = () => {
    if (searchQuery) return `Search Results for "${searchQuery}"`;
    if (activeCategory) return `${activeCategory} Games`;
    if (activeFilter === "favorites") return "My Favorite Games";
    if (activeFilter === "popular") return "Popular Games";
    if (activeFilter === "new") return "New Additions";
    if (activeFilter === "rage") return "Rage Games";
    if (activeFilter === "hardest") return "Hardest Games";
    if (activeFilter === "iq-puzzle") return "IQ Puzzle Games";
    return "Trending Games";
  };

  const getPageIcon = () => {
    if (activeFilter === "favorites") return <Heart className="h-5 w-5 text-pink-500 fill-pink-500" />;
    if (activeFilter === "popular") return <Flame className="h-5 w-5 text-orange-500" />;
    if (activeFilter === "new") return <Sparkles className="h-5 w-5 text-violet-400" />;
    if (activeFilter === "rage") return <Zap className="h-5 w-5 text-yellow-400" />;
    if (activeFilter === "hardest") return <Skull className="h-5 w-5 text-red-500" />;
    if (activeFilter === "iq-puzzle") return <Brain className="h-5 w-5 text-cyan-400" />;
    return <Grid className="h-5 w-5 text-violet-400" />;
  };

  const categories = [
    { id: "Action", label: "Action" },
    { id: "Adventure", label: "Adventure" },
    { id: "Arcade", label: "Arcade" },
    { id: "Board", label: "Board" },
    { id: "Card", label: "Card" },
    { id: "Clicker", label: "Clicker" },
    { id: "Driving", label: "Driving" },
    { id: "io", label: ".io" },
    { id: "Puzzle", label: "Puzzle" },
    { id: "Shooting", label: "Shooting" },
    { id: "Simulation", label: "Simulation" },
    { id: "Sports", label: "Sports" },
    { id: "Strategy", label: "Strategy" },
    { id: "Thinky", label: "Thinky" },
    { id: "Trivia", label: "Trivia" },
    { id: "Word", label: "Word" },
  ];

  const scrollRow = (id: string, direction: "left" | "right") => {
    const el = document.getElementById(id);
    if (el) {
      const scrollAmount = direction === "left" ? -el.clientWidth * 0.75 : el.clientWidth * 0.75;
      el.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  const allGames = gamesData as Game[];

  // Curate rows
  const trendingGames = [...allGames].sort((a, b) => parseInt(b.id) - parseInt(a.id)).slice(0, 24);
  const newGames = [...allGames].reverse().slice(0, 24);
  
  const gamesByCategory = (catName: string) => {
    return allGames.filter((g) => g.category.toLowerCase() === catName.toLowerCase()).slice(0, 24);
  };

  const renderGameRow = (title: string, games: Game[], rowId: string, href: string) => {
    if (games.length === 0) return null;
    return (
      <div key={rowId} className="relative group/row flex flex-col gap-2.5 animate-fadeIn">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-lg font-bold text-slate-100 md:text-xl hover:text-violet-400 transition-colors tracking-tight">
            <span>{title}</span>
          </h3>
          <Link href={href} className="text-[11px] font-bold text-violet-400 hover:text-pink-400 transition-colors">
            View more
          </Link>
        </div>
        
        <div className="relative">
          {/* Left Scroll Button */}
          <button
            onClick={() => scrollRow(rowId, "left")}
            className="absolute left-1 top-[38%] -translate-y-1/2 z-30 hidden group-hover/row:flex h-8 w-8 items-center justify-center rounded-full bg-slate-950/90 text-white border border-white/10 hover:bg-slate-900 transition-all cursor-pointer shadow-lg hover:scale-105"
            aria-label="Scroll left"
          >
            <ChevronLeft className="h-4.5 w-4.5" />
          </button>
          
          {/* Right Scroll Button */}
          <button
            onClick={() => scrollRow(rowId, "right")}
            className="absolute right-1 top-[38%] -translate-y-1/2 z-30 hidden group-hover/row:flex h-8 w-8 items-center justify-center rounded-full bg-slate-950/90 text-white border border-white/10 hover:bg-slate-900 transition-all cursor-pointer shadow-lg hover:scale-105"
            aria-label="Scroll right"
          >
            <ChevronRight className="h-4.5 w-4.5" />
          </button>

          {/* Horizontal scroll container */}
          <div
            id={rowId}
            className="flex gap-2 md:gap-2.5 overflow-x-auto pb-2 pt-0.5 scrollbar-none scroll-smooth w-full"
          >
            {games.map((game) => (
              <div key={game.id} className="w-[135px] sm:w-[160px] md:w-[185px] lg:w-[205px] xl:w-[220px] shrink-0">
                <GameCard game={game} />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-6 pb-12">
      {/* Category Horizontal Pill Scroller */}
      <div className="relative flex items-center w-full">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none w-full scroll-smooth">
          <Link
            href="/"
            className={`rounded-full px-4 py-1.5 text-xs font-semibold whitespace-nowrap transition-all border ${
              !activeCategory && !activeFilter && !searchQuery
                ? "bg-violet-600 border-violet-500 text-white shadow-lg shadow-violet-600/20"
                : "bg-slate-900 border-white/5 text-slate-300 hover:border-white/10 hover:bg-slate-800"
            }`}
          >
            All Games
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/?category=${cat.id}`}
              className={`rounded-full px-4 py-1.5 text-xs font-semibold whitespace-nowrap transition-all border ${
                activeCategory === cat.id
                  ? "bg-violet-600 border-violet-500 text-white shadow-lg shadow-violet-600/20"
                  : "bg-slate-900 border-white/5 text-slate-300 hover:border-white/10 hover:bg-slate-800"
              }`}
            >
              {cat.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Featured Hero Banner */}
      {featuredGame && !searchQuery && !activeCategory && !activeFilter && (
        <div className="relative overflow-hidden rounded-xl border border-white/5 bg-slate-900 shadow-2xl animate-fadeIn">
          {/* Background image fade */}
          <div className="absolute inset-0 bg-cover bg-center opacity-15 blur-sm" style={{ backgroundImage: `url(${featuredGame.thumb})` }}></div>
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/70 to-transparent"></div>

          <div className="relative z-10 flex flex-col md:flex-row gap-6 p-6 items-center">
            {/* Banner image */}
            <div className="relative aspect-[4/3] w-40 md:w-52 overflow-hidden rounded-lg border border-white/10 shadow-2xl shrink-0">
              <img
                src={featuredGame.thumb}
                alt={featuredGame.title}
                className="h-full w-full object-cover"
              />
            </div>

            {/* Banner details */}
            <div className="flex flex-col gap-2.5 flex-1 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-2">
                <span className="rounded-full bg-violet-500/10 border border-violet-500/30 px-3 py-0.5 text-[9px] font-bold uppercase tracking-wider text-violet-400">
                  Featured Game
                </span>
                <div className="flex items-center gap-1 text-[9px] font-bold text-amber-400">
                  <Star className="h-3 w-3 fill-amber-400" />
                  <span>4.8 Rating</span>
                </div>
              </div>
              
              <h1 className="text-xl md:text-2xl lg:text-3xl font-extrabold text-white tracking-tight leading-tight">
                {featuredGame.title}
              </h1>
              
              <p className="text-xs text-slate-400 max-w-xl line-clamp-2">
                {featuredGame.description}
              </p>

              <div className="mt-1 flex flex-wrap items-center justify-center md:justify-start gap-4">
                <Link
                  href={`/game/${featuredGame.slug || featuredGame.id}`}
                  className="flex items-center gap-2 rounded-full bg-gradient-to-r from-violet-600 to-pink-500 px-5 py-2 text-xs font-bold text-white shadow-lg shadow-violet-500/25 hover:from-violet-500 hover:to-pink-400 transition-all hover:scale-105"
                >
                  <Play className="h-3.5 w-3.5 fill-white ml-0.5" />
                  Play Now
                </Link>
                <span className="text-xs text-slate-500">
                  Genre: <span className="text-slate-300 font-semibold">{featuredGame.category}</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Curated Sliders or Grid View */}
      {!activeCategory && !activeFilter && !searchQuery ? (
        <div className="flex flex-col gap-8">
          {/* Continue Playing */}
          {recentlyPlayed.length > 0 &&
            renderGameRow("Continue playing", recentlyPlayed, "continue-playing", "/?filter=new")}

          {/* Trending Games */}
          {renderGameRow("Trending games", trendingGames, "trending", "/?filter=popular")}

          {/* New Games */}
          {renderGameRow("New games", newGames, "new-games", "/?filter=new")}

          {/* Category Rows */}
          {categories.map((cat) => {
            const catGames = gamesByCategory(cat.id);
            return renderGameRow(
              `${cat.label} Games`,
              catGames,
              `cat-${cat.id.toLowerCase()}`,
              `/?category=${cat.id}`
            );
          })}
        </div>
      ) : (
        <>
          {/* Main Grid Header */}
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <div className="flex items-center gap-2.5">
              {getPageIcon()}
              <h2 className="text-lg font-bold tracking-tight text-white md:text-xl">
                {getPageTitle()}
              </h2>
              <span className="rounded-full bg-slate-900 border border-white/5 px-2.5 py-0.5 text-[10px] text-slate-400">
                {filteredGames.length} games
              </span>
            </div>
          </div>

          {/* Grid of Cards */}
          {filteredGames.length > 0 ? (
            <div className="grid grid-cols-2 gap-2 md:gap-2.5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 3xl:grid-cols-8 animate-fadeIn">
              {filteredGames.slice(0, visibleCount).map((game) => (
                <GameCard key={game.id} game={game} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              {activeFilter === "favorites" ? (
                <div className="max-w-md flex flex-col items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-pink-950/20 text-pink-500 border border-pink-500/10">
                    <Heart className="h-7 w-7" />
                  </div>
                  <h3 className="text-md font-bold text-white">No favorites yet</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Click the heart icon on any game thumbnail to add it here. Your favorites list syncs automatically to this device.
                  </p>
                  <Link
                    href="/"
                    className="mt-2 rounded-full bg-slate-900 border border-white/10 px-5 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-800 transition-colors"
                  >
                    Browse Games
                  </Link>
                </div>
              ) : (
                <div className="max-w-md flex flex-col items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-900 text-slate-400 border border-white/5">
                    <Search className="h-7 w-7" />
                  </div>
                  <h3 className="text-md font-bold text-white">No games found</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    We couldn't find any games matching your current selection. Try checking other categories or tags.
                  </p>
                  <Link
                    href="/"
                    className="mt-2 rounded-full bg-slate-900 border border-white/10 px-5 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-850 transition-colors"
                  >
                    Clear Filters
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* Pagination Show More */}
          {filteredGames.length > visibleCount && (
            <div className="mt-8 flex justify-center">
              <button
                onClick={handleShowMore}
                className="rounded-full bg-slate-900 border border-white/5 hover:border-white/10 px-8 py-3 text-xs font-bold text-slate-200 hover:bg-slate-850 hover:text-white transition-all shadow-md active:scale-95"
              >
                Show More Games
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
