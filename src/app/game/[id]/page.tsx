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

  return {
    title: `Play ${game.title} Online - Free Browser Game | CrazyArcade`,
    description: description.slice(0, 160).trim(),
    keywords: keywords,
    openGraph: {
      title: `Play ${game.title} Online - Free Browser Game | CrazyArcade`,
      description: description.slice(0, 160).trim(),
      images: [{ url: game.thumb }],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `Play ${game.title} Online - Free Browser Game | CrazyArcade`,
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
