"use client";

import React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Home,
  Flame,
  Clock,
  Heart,
  Gamepad,
  Zap,
  Brain,
  Car,
  Target,
  Trophy,
  Compass,
  Sparkles,
  Shirt,
  Users,
  Grid,
} from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  onClose?: () => void;
  activeCategory?: string;
  activeFilter?: string;
}

export default function Sidebar({ isOpen, activeCategory, activeFilter }: SidebarProps) {
  const searchParams = useSearchParams();
  const search = searchParams.get("search");

  const mainFilters = [
    { id: "all", label: "Home", icon: Home, href: "/" },
    { id: "popular", label: "Popular", icon: Flame, href: "/?filter=popular" },
    { id: "new", label: "Newest", icon: Clock, href: "/?filter=new" },
    { id: "favorites", label: "My Favorites", icon: Heart, href: "/?filter=favorites" },
  ];

  const categories = [
    { id: "Arcade", label: "Arcade", icon: Gamepad },
    { id: "Action", label: "Action", icon: Zap },
    { id: "Puzzle", label: "Puzzle", icon: Brain },
    { id: "Driving", label: "Driving", icon: Car },
    { id: "Shooting", label: "Shooting", icon: Target },
    { id: "Sports", label: "Sports", icon: Trophy },
    { id: "Adventure", label: "Adventure", icon: Compass },
    { id: "Multiplayer", label: "Multiplayer", icon: Users },
    { id: "Beauty", label: "Beauty", icon: Sparkles },
    { id: "Dress Up", label: "Dress Up", icon: Shirt },
  ];

  const isFilterActive = (filterId: string) => {
    if (search) return false;
    if (filterId === "all") {
      return !activeFilter && !activeCategory;
    }
    return activeFilter === filterId;
  };

  const isCategoryActive = (catId: string) => {
    if (search) return false;
    return activeCategory?.toLowerCase() === catId.toLowerCase();
  };

  return (
    <aside
      className={`fixed bottom-0 top-16 left-0 z-40 w-60 border-r border-white/5 bg-slate-950/90 py-5 px-3 transition-transform duration-300 backdrop-blur-md lg:sticky lg:translate-x-0 overflow-y-auto ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="flex flex-col gap-6">
        {/* Main Navigation */}
        <div>
          <h2 className="px-3 text-xs font-bold uppercase tracking-wider text-slate-500">
            Discover
          </h2>
          <nav className="mt-2 flex flex-col gap-1">
            {mainFilters.map((item) => {
              const Icon = item.icon;
              const active = isFilterActive(item.id);
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 ${
                    active
                      ? "bg-gradient-to-r from-violet-600 to-pink-500 text-white shadow-lg shadow-violet-500/10"
                      : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
                  }`}
                >
                  <Icon className="h-4.5 w-4.5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Categories Navigation */}
        <div>
          <h2 className="px-3 text-xs font-bold uppercase tracking-wider text-slate-500">
            Categories
          </h2>
          <nav className="mt-2 flex flex-col gap-1">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const active = isCategoryActive(cat.id);
              return (
                <Link
                  key={cat.id}
                  href={`/?category=${cat.id}`}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 ${
                    active
                      ? "bg-gradient-to-r from-violet-600 to-pink-500 text-white shadow-lg shadow-violet-500/10"
                      : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
                  }`}
                >
                  <Icon className="h-4.5 w-4.5" />
                  <span>{cat.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Info Block */}
        <div className="mt-auto rounded-xl border border-white/5 bg-slate-900/40 p-4 text-center">
          <div className="flex justify-center text-violet-400 mb-2">
            <Grid className="h-6 w-6 animate-pulse" />
          </div>
          <span className="text-xs font-semibold text-slate-200 block mb-1">
            Instant HTML5 Games
          </span>
          <p className="text-[10px] text-slate-500">
            No downloads or installations required. Play directly on your browser.
          </p>
        </div>
      </div>
    </aside>
  );
}
