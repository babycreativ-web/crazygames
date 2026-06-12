import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Game } from "@/types";
import gamesData from "@/data/games.json";
import GameCard from "@/components/GameCard";
import { Gamepad, Sparkles, HelpCircle } from "lucide-react";
import fs from "fs";
import path from "path";

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
  if (slug === "multiplayer" || slug === "2-player" || slug === "2-player-games") return "Multiplayer";
  if (slug === "dress-up" || slug === "girls-games" || slug === "dress-up-games") return "Dress Up";
  if (slug === "beauty" || slug === "beauty-games") return "Beauty";
  if (slug === "unblocked" || slug === "unblocked-games") return "Unblocked";
  
  return null;
}

// Safely load category SEO data
function loadCategorySeo(categoryName: string) {
  try {
    const filePath = path.join(process.cwd(), "src/data/categories-seo.json");
    if (fs.existsSync(filePath)) {
      const seoData = JSON.parse(fs.readFileSync(filePath, "utf8"));
      const seoKey = categoryName.toLowerCase().replace(/\s+/g, "-");
      return seoData[seoKey] || null;
    }
  } catch (e) {
    console.error("Failed to load category SEO file:", e);
  }
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

  const seoEntry = loadCategorySeo(categoryName);
  
  if (categoryName === "Unblocked") {
    return {
      title: "Play Free Unblocked Games Online - Best Web Browser Games | CrazyArcade",
      description: "Play thousands of free online unblocked HTML5 games directly in your browser. Action, arcade, driving, puzzle and 2 player games unblocked with no downloads required!",
      keywords: "unblocked games, free online games unblocked, play unblocked games, browser games unblocked",
    };
  }

  return {
    title: seoEntry?.title || `Play Free ${categoryName} Games Online | No Downloads | CrazyArcade`,
    description: seoEntry?.metaDescription || `Play the best free online ${categoryName} games on CrazyArcade. No downloads or installations required!`,
    keywords: seoEntry?.keywords || `free ${categoryName} games, play ${categoryName} games, online ${categoryName} games, unblocked`,
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

  const seoEntry = loadCategorySeo(categoryName);

  const fallbackArticle = `
    <h2>The Best Free Online ${categoryName} Games</h2>
    <p>Welcome to CrazyArcade, your ultimate destination for playing free online <strong>${categoryName} games</strong>. Whether you are looking to kill a few minutes during a break or want to dive deep into immersive gameplay, we have you covered. All our games are fully unblocked HTML5 files, meaning you can play them directly in your web browser on desktop, tablet, or mobile devices with no downloads required!</p>
    <h3>Why Play ${categoryName} Games?</h3>
    <p>The ${categoryName} genre offers a diverse mix of experiences that cater to players of all skill levels. From simple mechanics that are easy to learn but hard to master, to complex multiplayer layouts that require strategy and split-second reflexes, there is always something new to discover.</p>
    <ul>
      <li><strong>No Downloads:</strong> Click and play instantly. No installs or plugins needed.</li>
      <li><strong>Cross-Platform:</strong> Works smoothly on Google Chrome, Apple Safari, Firefox, and mobile devices.</li>
      <li><strong>100% Free:</strong> Full access to all features and levels without paying a dime.</li>
    </ul>
    <h3>Top Strategy & Tips</h3>
    <p>To succeed in these games, make sure to read the controls guide on each game page, practice layouts, and learn how items behave. Bookmark CrazyArcade to join millions of browser gamers worldwide playing the best unblocked games daily!</p>
  `;

  const articleHtml = seoEntry?.article || fallbackArticle;

  const otherCategories = [
    { slug: "arcade", name: "Arcade" },
    { slug: "action", name: "Action" },
    { slug: "puzzle", name: "Puzzle" },
    { slug: "driving", name: "Driving" },
    { slug: "shooting", name: "Shooting" },
    { slug: "sports", name: "Sports" },
    { slug: "adventure", name: "Adventure" },
    { slug: "multiplayer", name: "Multiplayer" },
    { slug: "dress-up", name: "Dress Up" }
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
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
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
