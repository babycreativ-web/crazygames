import React from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Game } from "@/types";
import gamesData from "@/data/games.json";
import { getOrGenerateGameSeo } from "@/utils/seo-fallback";
import GamePlayClient from "./GamePlayClient";

interface GamePageProps {
  params: Promise<{ id: string }>;
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
}

function getCategoryKeyword(category: string): string {
  const cat = category.toLowerCase();
  if (cat === "driving") return "Free Car Driving Game";
  if (cat === "shooting") return "Free Shooting Game";
  if (cat === "action") return "Free Action Game";
  if (cat === "puzzle") return "Free IQ Puzzle Game";
  if (cat === "arcade") return "Free Arcade Game";
  if (cat === "sports") return "Free Sports Game";
  if (cat === "adventure") return "Free Adventure Game";
  if (cat === "board") return "Free Online Board Game";
  if (cat === "card") return "Free Online Card Game";
  if (cat === "clicker") return "Free Clicker Idle Game";
  if (cat === "io" || cat === ".io") return "Free Multiplayer .io Game";
  if (cat === "simulation") return "Free Simulation Game";
  if (cat === "strategy") return "Free Online Strategy Game";
  if (cat === "thinky") return "Free Thinky Brain Game";
  if (cat === "trivia") return "Free Online Trivia Quiz";
  if (cat === "word") return "Free Online Word Game";
  return "Free Browser Game";
}

export async function generateMetadata({
  params,
}: GamePageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const gameId = resolvedParams.id;
  const allGames = gamesData as Game[];
  const game = allGames.find((g) => g.id === gameId || g.slug === gameId);

  if (!game) {
    return {
      title: "Game Not Found | CrazyArcade",
    };
  }

  const seoEntry = getOrGenerateGameSeo(game, allGames);
  const keywords = game.tags 
    ? `${game.title}, play ${game.title}, free online games, HTML5 games, browser games, ${game.category.toLowerCase()}, ${game.tags}`
    : `${game.title}, play ${game.title}, free online games, HTML5 games, browser games, ${game.category.toLowerCase()}`;

  const suffix = getCategoryKeyword(game.category);
  const pageTitle = `Play ${game.title} Game Online Free - ${suffix} | CrazyArcade`;
  const metaDescription = `Play ${game.title} game online free! Learn how to play, find controls, pro tips, similar games, and FAQ for this unblocked ${game.category.toLowerCase()} browser game on CrazyArcade.`;

  return {
    title: pageTitle,
    description: metaDescription,
    keywords: keywords,
    openGraph: {
      title: pageTitle,
      description: metaDescription,
      images: [{ url: game.thumb }],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description: metaDescription,
      images: [game.thumb],
    },
  };
}

export default async function GamePage({ params }: GamePageProps) {
  const resolvedParams = await params;
  const gameId = resolvedParams.id;
  const allGames = gamesData as Game[];
  const game = allGames.find((g) => g.id === gameId || g.slug === gameId);

  if (!game) {
    notFound();
  }

  const seoEntry = getOrGenerateGameSeo(game, allGames);

  // Find related games in same category, matching by category and excluding current game
  const relatedGames = allGames
    .filter((g) => g.category === game.category && g.id !== game.id)
    .slice(0, 6);

  return (
    <GamePlayClient
      game={game}
      seoEntry={seoEntry}
      relatedGames={relatedGames}
    />
  );
}

