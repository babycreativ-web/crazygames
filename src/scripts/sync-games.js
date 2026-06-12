const fs = require("fs");
const path = require("path");

// Configuration Paths
const DATA_FILE_PATH = path.join(__dirname, "../data/games.json");

async function syncGames() {
  const feedUrl = process.argv[2];

  if (!feedUrl) {
    console.error("Error: Please provide a GameMonetize feed URL as an argument.");
    console.log("Usage: node sync-games.js <FEED_URL>");
    process.exit(1);
  }

  console.log(`Starting synchronization from feed: ${feedUrl}`);

  try {
    // 1. Fetch live feed
    const response = await fetch(feedUrl);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const liveGames = await response.json();
    if (!Array.isArray(liveGames)) {
      throw new Error("Invalid feed format: expected a JSON array.");
    }

    console.log(`Fetched ${liveGames.length} games from the feed.`);

    // 2. Load existing games to preserve self-hosted entries
    // (Self-hosted game support disabled as requested)
    const selfHostedGames = [];

    // 3. Normalize and map the feed games to match our Game interface
    const mappedGames = liveGames.map((game) => ({
      id: String(game.id),
      title: String(game.title || "Untitled Game"),
      description: String(game.description || ""),
      instructions: String(game.instructions || ""),
      url: String(game.url || ""),
      category: String(game.category || "Arcade"),
      tags: String(game.tags || ""),
      thumb: String(game.thumb || ""),
      width: String(game.width || "800"),
      height: String(game.height || "600"),
    }));

    // Limit feed games to ensure we get exactly 100 games total
    const targetTotal = 100;
    const maxFeedGames = Math.max(0, targetTotal - selfHostedGames.length);
    const limitedFeedGames = mappedGames.slice(0, maxFeedGames);
    console.log(`Limiting feed games to ${limitedFeedGames.length} to target a total of ${targetTotal} games.`);

    // 4. Merge self-hosted games (at the top) with feed games
    const mergedList = [...selfHostedGames, ...limitedFeedGames];

    // Ensure data directory exists
    const dir = path.dirname(DATA_FILE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    // Write back to games.json
    fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(mergedList, null, 2), "utf8");

    console.log("--------------------------------------------------");
    console.log(`Success! Synchronized ${mergedList.length} total games.`);
    console.log(`Updated catalog written to: src/data/games.json`);
    console.log("--------------------------------------------------");
  } catch (error) {
    console.error("Synchronization failed:");
    console.error(error.message);
    process.exit(1);
  }
}

syncGames();
