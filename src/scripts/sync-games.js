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

function normalizeCategory(feedCategory) {
  const cat = String(feedCategory || "").trim();
  const lowerCat = cat.toLowerCase();
  
  if (lowerCat === "racing" || lowerCat === "3d") {
    return "Driving";
  }
  if (lowerCat === "action" || lowerCat === "stickman") {
    return "Action";
  }
  if (lowerCat === "multiplayer" || lowerCat === ".io") {
    return "Multiplayer";
  }
  if (lowerCat === "girls") {
    return "Dress Up";
  }
  if (lowerCat === "soccer" || lowerCat === "sports") {
    return "Sports";
  }
  
  const matches = ["Arcade", "Puzzle", "Shooting", "Adventure", "Beauty", "Dress Up"];
  const found = matches.find(m => m.toLowerCase() === lowerCat);
  if (found) return found;

  if (lowerCat === "cooking") return "Arcade";
  if (lowerCat === "boys") return "Arcade";
  if (lowerCat === "clicker") return "Puzzle";
  
  return "Arcade";
}

function generateSlug(title) {
  return String(title)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

    // 3. Normalize and map the feed games to match our Game interface
    const mappedGames = liveGames.map((game) => ({
      id: String(game.id),
      slug: generateSlug(game.title),
      title: String(game.title || "Untitled Game"),
      description: String(game.description || ""),
      instructions: String(game.instructions || ""),
      url: String(game.url || ""),
      category: normalizeCategory(game.category),
      tags: String(game.tags || ""),
      thumb: String(game.thumb || ""),
      width: String(game.width || "800"),
      height: String(game.height || "600"),
    }));

    // Group games by category
    const categoryGroups = {};
    mappedGames.forEach((game) => {
      if (!categoryGroups[game.category]) {
        categoryGroups[game.category] = [];
      }
      categoryGroups[game.category].push(game);
    });

    // Select games in round-robin fashion until we reach target total
    const targetTotal = 200;
    const selectedGames = [];
    const categoriesList = Object.keys(categoryGroups);
    const indices = {};
    categoriesList.forEach((c) => (indices[c] = 0));

    let added = true;
    while (selectedGames.length < targetTotal && added) {
      added = false;
      for (const cat of categoriesList) {
        const group = categoryGroups[cat];
        const idx = indices[cat];
        if (idx < group.length) {
          selectedGames.push(group[idx]);
          indices[cat] = idx + 1;
          added = true;
          if (selectedGames.length >= targetTotal) {
            break;
          }
        }
      }
    }

    console.log(`Selected ${selectedGames.length} balanced games from feed.`);

    // 4. Merge self-hosted games (at the top) with feed games
    const mergedList = [...selfHostedGames, ...selectedGames];

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
