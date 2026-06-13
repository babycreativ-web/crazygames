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
  Shirt,
  Users,
  Grid,
  Skull,
  ChessPawn,
  Layers,
  MousePointerClick,
  CircleDot,
  Puzzle,
  Gamepad2,
  Crown,
  Ghost,
  HelpCircle,
  Type,
  Mail,
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
    { id: "popular", label: "🔥 Trending", icon: Flame, href: "/?filter=popular" },
    { id: "new", label: "🎮 New Games", icon: Clock, href: "/?filter=new" },
    { id: "favorites", label: "❤️ My Favorites", icon: Heart, href: "/?filter=favorites" },
  ];

  const viralFilters = [
    { id: "rage", label: "😡 Rage Games", icon: Zap, href: "/?filter=rage" },
    { id: "hardest", label: "💀 Hardest Games", icon: Skull, href: "/?filter=hardest" },
    { id: "iq-puzzle", label: "🧠 IQ Puzzles", icon: Brain, href: "/?filter=iq-puzzle" },
  ];

  const categories = [
    { id: "action", label: "Action", icon: Zap },
    { id: "adventure", label: "Adventure", icon: Compass },
    { id: "arcade", label: "Arcade", icon: Gamepad },
    { id: "board", label: "Board", icon: ChessPawn },
    { id: "card", label: "Card", icon: Layers },
    { id: "clicker", label: "Clicker", icon: MousePointerClick },
    { id: "driving", label: "Driving", icon: Car },
    { id: "io", label: ".io", icon: CircleDot },
    { id: "puzzle", label: "Puzzle", icon: Puzzle },
    { id: "shooting", label: "Shooting", icon: Target },
    { id: "simulation", label: "Simulation", icon: Gamepad2 },
    { id: "sports", label: "Sports", icon: Trophy },
    { id: "strategy", label: "Strategy", icon: Crown },
    { id: "thinky", label: "Thinky", icon: Ghost },
    { id: "trivia", label: "Trivia", icon: HelpCircle },
    { id: "word", label: "Word", icon: Type },
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
        {/* Discover Navigation */}
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

        {/* Viral Playlists Navigation */}
        <div>
          <h2 className="px-3 text-xs font-bold uppercase tracking-wider text-slate-500">
            Special Playlists
          </h2>
          <nav className="mt-2 flex flex-col gap-1">
            {viralFilters.map((item) => {
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
                  href={`/category/${cat.id}`}
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

        {/* Footer Links Area */}
        <div className="mt-auto pt-4 flex flex-col gap-4 border-t border-white/5">
          <a
            href="mailto:babycreativ@gmail.com"
            className="flex items-center justify-center gap-2 rounded-full bg-violet-600 px-4 py-2 text-sm font-bold text-white hover:bg-violet-500 transition-colors shadow-lg shadow-violet-600/20"
          >
            <Mail className="h-4 w-4" />
            Contact us
          </a>

          <div className="flex flex-col gap-2 px-1">
            <Link href="/about" className="text-xs text-slate-400 hover:text-slate-200 transition-colors">About</Link>
            <Link href="/" className="text-xs text-slate-400 hover:text-slate-200 transition-colors">Developers</Link>
            <Link href="/" className="text-xs text-slate-400 hover:text-slate-200 transition-colors">Kids site</Link>
            <Link href="/" className="text-xs text-slate-400 hover:text-slate-200 transition-colors">Jobs</Link>
            <Link href="/info-for-parents" className="text-xs text-slate-400 hover:text-slate-200 transition-colors">Info for parents</Link>
            <Link href="/terms" className="text-xs text-slate-400 hover:text-slate-200 transition-colors">Terms &amp; conditions</Link>
            <Link href="/privacy" className="text-xs text-slate-400 hover:text-slate-200 transition-colors">Privacy</Link>
            <Link href="/?category=Action" className="text-xs text-slate-400 hover:text-slate-200 transition-colors">All games</Link>
          </div>

          {/* Copyright */}
          <div className="pt-2 px-1">
            <p className="text-[11px] text-slate-600">&copy; {new Date().getFullYear()} CrazyArcade</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
