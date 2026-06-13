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

function normalizeCategory(feedCategory, tagsStr, titleStr) {
  const cat = String(feedCategory || "").trim().toLowerCase();
  const tags = String(tagsStr || "").toLowerCase().split(',').map(t => t.trim());
  const title = String(titleStr || "").toLowerCase();
  
  const hasTag = (tagList) => tagList.some(t => tags.includes(t) || tags.some(tg => tg.includes(t)) || title.includes(t));
  
  // 1. .io / Multiplayer
  if (cat === '.io' || cat === 'multiplayer' || hasTag(['.io', 'io', 'multiplayer', 'lobby'])) {
    return '.io';
  }
  
  // 2. Driving
  if (cat === 'racing' || cat === '3d' || hasTag(['car', 'driving', 'racing', 'truck', 'bike', 'motorcycle', 'moto', 'drift', 'speed', 'kart', 'stunt'])) {
    return 'Driving';
  }
  
  // 3. Shooting
  if (cat === 'shooting' || hasTag(['shooting', 'shooter', 'gun', 'sniper', 'fps', 'tps', 'bullet', 'weapons', 'archery', 'bow'])) {
    return 'Shooting';
  }
  
  // 4. Action
  if (cat === 'action' || cat === 'stickman' || hasTag(['action', 'fight', 'stickman', 'combat', 'battle', 'ninja', 'sword', 'beat', 'punch', 'kick', 'warrior'])) {
    return 'Action';
  }
  
  // 5. Sports
  if (cat === 'sports' || cat === 'soccer' || hasTag(['sports', 'soccer', 'football', 'basketball', 'tennis', 'golf', 'billiards', 'pool', 'bowling', 'athletics', 'skate', 'snowboard', 'hockey', 'baseball'])) {
    return 'Sports';
  }
  
  // 6. Board
  if (hasTag(['board', 'chess', 'checkers', 'monopoly', 'ludo', 'domino', 'mahjong', 'backgammon', 'checkers', 'tic-tac-toe', 'tic tac toe'])) {
    return 'Board';
  }
  
  // 7. Card
  if (hasTag(['card', 'solitaire', 'poker', 'blackjack', 'uno', 'cards', 'klondike', 'spider', 'deck', 'bridge'])) {
    return 'Card';
  }
  
  // 8. Clicker
  if (cat === 'clicker' || hasTag(['clicker', 'idle', 'tap', 'click', 'incremental'])) {
    return 'Clicker';
  }
  
  // 9. Simulation
  if (hasTag(['simulation', 'simulator', 'tycoon', 'farming', 'cooking', 'manage', 'management', 'dress up', 'girls', 'makeup', 'beauty', 'dentist', 'pet', 'care', 'baby', 'doctor', 'job'])) {
    return 'Simulation';
  }
  
  // 10. Strategy
  if (hasTag(['strategy', 'tower defense', 'td', 'tactical', 'war', 'defense', 'clans', 'empire', 'rts', 'turn-based'])) {
    return 'Strategy';
  }
  
  // 11. Word
  if (hasTag(['word', 'spelling', 'letters', 'crossword', 'text', 'vocabulary', 'anagram', 'scrabble', 'words'])) {
    return 'Word';
  }
  
  // 12. Trivia
  if (hasTag(['trivia', 'quiz', 'question', 'guess', 'general knowledge', 'test', 'knowledge', 'intellectual'])) {
    return 'Trivia';
  }
  
  // 13. Thinky
  if (hasTag(['think', 'thinky', 'logic', 'brain', 'math', 'memory', 'physics', 'maze', 'escape', 'sudoku'])) {
    return 'Thinky';
  }
  
  // 14. Adventure
  if (cat === 'adventure' || hasTag(['adventure', 'explore', 'rpg', 'platformer', 'run', 'runner', 'running', 'escape', 'jump'])) {
    return 'Adventure';
  }
  
  // 15. Puzzle
  if (cat === 'puzzle' || hasTag(['puzzle', 'matching', 'match-3', 'bubble shooter', 'difference', 'hidden'])) {
    return 'Puzzle';
  }
  
  // 16. Arcade
  return 'Arcade';
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
      category: normalizeCategory(game.category, game.tags, game.title),
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
    const targetTotal = 400;
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
