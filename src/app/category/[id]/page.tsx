import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Game } from "@/types";
import gamesData from "@/data/games.json";
import GameCard from "@/components/GameCard";
import { Gamepad, Sparkles, HelpCircle } from "lucide-react";
import { getOrGenerateCategorySeo } from "@/utils/seo-fallback";

interface Props {
  params: Promise<{ id: string }>;
}

// Map slugs to standard category names
function resolveCategoryName(id: string): string | null {
  const slug = id.toLowerCase();
  if (slug === "arcade" || slug === "arcade-games") return "Arcade";
  if (slug === "action" || slug === "action-games") return "Action";
  if (slug === "puzzle" || slug === "puzzle-games") return "Puzzle";
  if (slug === "driving" || slug === "car-games" || slug === "car") return "Driving";
  if (slug === "shooting" || slug === "shooting-games") return "Shooting";
  if (slug === "sports" || slug === "sports-games") return "Sports";
  if (slug === "adventure" || slug === "adventure-games") return "Adventure";
  if (slug === "board" || slug === "board-games") return "Board";
  if (slug === "card" || slug === "card-games") return "Card";
  if (slug === "clicker" || slug === "clicker-games") return "Clicker";
  if (slug === "io" || slug === "io-games" || slug === "dot-io") return ".io";
  if (slug === "simulation" || slug === "simulation-games") return "Simulation";
  if (slug === "strategy" || slug === "strategy-games") return "Strategy";
  if (slug === "thinky" || slug === "thinky-games") return "Thinky";
  if (slug === "trivia" || slug === "trivia-games") return "Trivia";
  if (slug === "word" || slug === "word-games") return "Word";
  if (slug === "unblocked" || slug === "unblocked-games") return "Unblocked";
  
  return null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const categoryName = resolveCategoryName(resolvedParams.id);

  if (!categoryName) {
    return {
      title: "Category Not Found | CrazyArcade",
    };
  }

  let gamesCount = 0;
  if (categoryName === "Unblocked") {
    gamesCount = gamesData.length;
  } else {
    gamesCount = (gamesData as Game[]).filter(
      (g) => g.category.toLowerCase() === categoryName.toLowerCase()
    ).length;
  }

  const seoEntry = getOrGenerateCategorySeo(categoryName, gamesCount);

  return {
    title: seoEntry.title,
    description: seoEntry.metaDescription,
    keywords: seoEntry.keywords,
  };
}

export default async function CategoryPage({ params }: Props) {
  const resolvedParams = await params;
  const categoryName = resolveCategoryName(resolvedParams.id);

  if (!categoryName) {
    notFound();
  }

  // Filter games matching this category
  let categoryGames: Game[] = [];
  if (categoryName === "Unblocked") {
    categoryGames = gamesData as Game[];
  } else {
    categoryGames = (gamesData as Game[]).filter(
      (g) => g.category.toLowerCase() === categoryName.toLowerCase()
    );
  }

  const seoEntry = getOrGenerateCategorySeo(categoryName, categoryGames.length);
  const articleHtml = seoEntry.article;

  const otherCategories = [
    { slug: "action", name: "Action" },
    { slug: "adventure", name: "Adventure" },
    { slug: "arcade", name: "Arcade" },
    { slug: "board", name: "Board" },
    { slug: "card", name: "Card" },
    { slug: "clicker", name: "Clicker" },
    { slug: "driving", name: "Driving" },
    { slug: "io", name: ".io" },
    { slug: "puzzle", name: "Puzzle" },
    { slug: "shooting", name: "Shooting" },
    { slug: "simulation", name: "Simulation" },
    { slug: "sports", name: "Sports" },
    { slug: "strategy", name: "Strategy" },
    { slug: "thinky", name: "Thinky" },
    { slug: "trivia", name: "Trivia" },
    { slug: "word", name: "Word" }
  ].filter(c => c.name.toLowerCase() !== categoryName.toLowerCase());

  return (
    <div className="flex flex-col gap-8 pb-12">
      {/* Header section */}
      <div className="relative overflow-hidden rounded-3xl border border-white/5 bg-slate-900/30 p-8 lg:p-12">
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-violet-600/10 blur-3xl"></div>
        <div className="absolute -left-10 -bottom-10 h-40 w-40 rounded-full bg-pink-500/10 blur-3xl"></div>
        
        <div className="relative flex flex-col gap-3 max-w-3xl">
          <div className="flex items-center gap-2 text-xs font-semibold text-violet-400 uppercase tracking-widest">
            <Sparkles className="h-4 w-4" />
            <span>Category Explorer</span>
          </div>
          <h1 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-white">
            {categoryName === "Unblocked" ? "Free Unblocked Games" : `${categoryName} Games`}
          </h1>
          <p className="text-sm text-slate-400 leading-relaxed">
            {seoEntry?.metaDescription || `Play the best free online ${categoryName} games. Choose from ${categoryGames.length} unblocked games with no downloads required.`}
          </p>
        </div>
      </div>

      {/* Grid of games */}
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between border-b border-white/5 pb-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Gamepad className="h-5 w-5 text-violet-400" />
            <span>Play Now ({categoryGames.length} games)</span>
          </h2>
          <Link href="/" className="text-xs font-bold text-violet-400 hover:text-pink-400 transition-colors">
            Back to Home
          </Link>
        </div>

        {categoryGames.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 3xl:grid-cols-8 gap-2 md:gap-2.5">
            {categoryGames.map((game) => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-white/5 border-dashed p-12 text-center text-slate-500">
            <Gamepad className="h-10 w-10 mb-3 animate-bounce" />
            <span className="text-sm font-semibold">No games found in this category.</span>
            <p className="text-xs text-slate-600 mt-1">We will sync more games soon!</p>
          </div>
        )}
      </div>

      {/* SEO Article Section */}
      <div className="border-t border-white/5 pt-12">
        <h2 className="text-xl font-extrabold text-white mb-6 flex items-center gap-2">
          <HelpCircle className="h-5 w-5 text-violet-400" />
          <span>About {categoryName === "Unblocked" ? "Unblocked Games" : `${categoryName} Games`}</span>
        </h2>
        
        <div className="rounded-2xl border border-white/5 bg-slate-900/10 p-6 lg:p-10 shadow-xl">
          <div 
            className="prose-seo text-sm text-slate-300 leading-relaxed space-y-4"
            dangerouslySetInnerHTML={{ __html: articleHtml }}
          />
        </div>
      </div>

      {/* Internal Linking / Category Links */}
      <div className="border-t border-white/5 pt-8">
        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-4">
          Browse More Free Games
        </h3>
        <div className="flex flex-wrap gap-2.5">
          {otherCategories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/category/${cat.slug}`}
              className="rounded-xl border border-white/5 bg-slate-900/40 px-4 py-2 text-xs font-bold text-slate-300 hover:border-violet-500/30 hover:bg-slate-900 hover:text-white transition-all shadow-sm"
            >
              {cat.name} Games
            </Link>
          ))}
          <Link
            href="/category/unblocked"
            className="rounded-xl border border-white/5 bg-slate-900/40 px-4 py-2 text-xs font-bold text-violet-400 hover:border-violet-500/30 hover:bg-slate-900 hover:text-white transition-all shadow-sm"
          >
            Unblocked Games
          </Link>
        </div>
      </div>
    </div>
  );
}
