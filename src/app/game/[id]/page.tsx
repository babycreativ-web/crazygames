import React from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Game } from "@/types";
import gamesData from "@/data/games.json";
import gamesSeoData from "@/data/games-seo.json";
import GamePlayClient from "./GamePlayClient";

interface GamePageProps {
  params: Promise<{ id: string }>;
}

function getCategoryKeyword(category: string): string {
  const cat = category.toLowerCase();
  if (cat === "driving") return "Free Car Driving Game";
  if (cat === "multiplayer") return "Free 2 Player Game";
  if (cat === "shooting") return "Free Shooting Game";
  if (cat === "action") return "Free Action Game";
  if (cat === "puzzle") return "Free IQ Puzzle Game";
  if (cat === "arcade") return "Free Arcade Game";
  if (cat === "sports") return "Free Sports Game";
  if (cat === "dress-up") return "Free Girls Dress Up Game";
  return "Free Browser Game";
}

export async function generateMetadata({
  params,
}: GamePageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const gameId = resolvedParams.id;
  const game = (gamesData as Game[]).find((g) => g.id === gameId);

  if (!game) {
    return {
      title: "Game Not Found | CrazyArcade",
    };
  }

  const seoEntries = gamesSeoData as Record<string, any>;
  const seoEntry = seoEntries?.[game.id];
  const description = seoEntry?.seoDescription || game.description || "";
  const keywords = game.tags 
    ? `${game.title}, play ${game.title}, free online games, HTML5 games, browser games, ${game.category.toLowerCase()}, ${game.tags}`
    : `${game.title}, play ${game.title}, free online games, HTML5 games, browser games, ${game.category.toLowerCase()}`;

  const suffix = getCategoryKeyword(game.category);
  const pageTitle = `Play ${game.title} Online - ${suffix} | CrazyArcade`;

  return {
    title: pageTitle,
    description: description.slice(0, 160).trim(),
    keywords: keywords,
    openGraph: {
      title: pageTitle,
      description: description.slice(0, 160).trim(),
      images: [{ url: game.thumb }],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description: description.slice(0, 160).trim(),
      images: [game.thumb],
    },
  };
}

export default async function GamePage({ params }: GamePageProps) {
  const resolvedParams = await params;
  const gameId = resolvedParams.id;
  const game = (gamesData as Game[]).find((g) => g.id === gameId);

  if (!game) {
    notFound();
  }

  const seoEntries = gamesSeoData as Record<string, any>;
  const seoEntry = seoEntries?.[game.id] || null;

  // Find related games in same category
  const relatedGames = (gamesData as Game[])
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
