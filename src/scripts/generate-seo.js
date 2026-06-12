const fs = require("fs");
const path = require("path");

const GAMES_FILE = path.join(__dirname, "../data/games.json");
const SEO_FILE = path.join(__dirname, "../data/games-seo.json");

// API Configuration
const MODEL = "gemini-2.5-flash"; // Standard fast and free model

async function generateSeoForGames() {
  const apiKey = process.argv[2] || process.env.GEMINI_API_KEY;

  if (!apiKey) {
    console.error("Error: Google Gemini API Key is required.");
    console.log("Usage: node generate-seo.js <GEMINI_API_KEY>");
    console.log("   or: set GEMINI_API_KEY environment variable and run: node generate-seo.js");
    process.exit(1);
  }

  console.log("--------------------------------------------------");
  console.log("Starting AI SEO Generation Engine using Gemini API");
  console.log("--------------------------------------------------");

  // 1. Read games list
  if (!fs.existsSync(GAMES_FILE)) {
    console.error(`Error: Games catalog not found at: ${GAMES_FILE}`);
    process.exit(1);
  }
  const games = JSON.parse(fs.readFileSync(GAMES_FILE, "utf8"));
  console.log(`Loaded ${games.length} games from catalog.`);

  // 2. Load existing SEO data to avoid repeating work
  let seoData = {};
  if (fs.existsSync(SEO_FILE)) {
    try {
      seoData = JSON.parse(fs.readFileSync(SEO_FILE, "utf8"));
      console.log(`Loaded existing SEO data for ${Object.keys(seoData).length} games.`);
    } catch (e) {
      console.warn("SEO data file was invalid or empty, starting fresh.");
    }
  }

  // 3. Find games that need SEO generation
  const pendingGames = games.filter((game) => !seoData[game.id]);
  console.log(`Found ${pendingGames.length} games pending SEO text generation.`);

  if (pendingGames.length === 0) {
    console.log("All games already have SEO descriptions. Finished!");
    process.exit(0);
  }

  // Process a limit of 100 games per run to cover the full catalog
  const limit = Math.min(pendingGames.length, 100);
  console.log(`Processing first ${limit} pending games in this run...`);

  for (let i = 0; i < limit; i++) {
    const game = pendingGames[i];
    console.log(`[${i + 1}/${limit}] Generating SEO for: "${game.title}" (ID: ${game.id})...`);

    const prompt = `
      You are an expert SEO copywriter and product manager for a major browser game portal.
      Generate a premium, search-engine-optimized landing page description for the HTML5 game: "${game.title}".
      
      Game Metadata:
      - Category: ${game.category}
      - Tags: ${game.tags}
      - Short Description: ${game.description}
      - Core Instructions: ${game.instructions}
      
      You must respond with a strict, valid JSON object ONLY. Do not write any markdown code blocks, backticks, or intro text. Just the raw JSON. The JSON structure must match this format:
      {
        "seoDescription": "A rich, engaging 300-400 word gameplay article. Use headings style, write paragraphs detailing the mechanics, strategies, and why it's addictive. Use keywords related to free web browser gaming.",
        "controls": "A clear, detailed guide on how to play, specifying Desktop controls (keyboard keys, mouse clicks) and Mobile controls (touch triggers, swipes).",
        "tips": [
          "Actionable Pro Tip 1",
          "Actionable Pro Tip 2",
          "Actionable Pro Tip 3"
        ],
        "faqs": [
          {
            "q": "FAQ Question 1 (e.g. Is ${game.title} safe to play unblocked?)",
            "a": "Answer 1"
          },
          {
            "q": "FAQ Question 2 (e.g. Can I play ${game.title} with friends?)",
            "a": "Answer 2"
          },
          {
            "q": "FAQ Question 3 (e.g. Do I need to download ${game.title}?)",
            "a": "Answer 3"
          }
        ]
      }
    `;

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: prompt,
                  },
                ],
              },
            ],
            // Request JSON response formatting
            generationConfig: {
              responseMimeType: "application/json",
            },
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`API returned HTTP ${response.status}`);
      }

      const resData = await response.json();
      const rawText = resData.candidates[0].content.parts[0].text;
      
      // Parse response
      const parsedSeo = JSON.parse(rawText);

      // Save to our dictionary
      seoData[game.id] = {
        title: game.title,
        seoDescription: parsedSeo.seoDescription,
        controls: parsedSeo.controls,
        tips: parsedSeo.tips,
        faqs: parsedSeo.faqs,
        generatedAt: new Date().toISOString(),
      };

      // Write progress incrementally to prevent data loss on interruption
      fs.writeFileSync(SEO_FILE, JSON.stringify(seoData, null, 2), "utf8");
      console.log(`✓ Completed: "${game.title}"`);

      // Rate limit buffer (sleep 4.5 seconds to avoid quota errors - max 15 RPM)
      await new Promise((resolve) => setTimeout(resolve, 4500));

    } catch (err) {
      console.error(`✗ Failed generating for "${game.title}":`, err.message);
      console.log("Waiting 10 seconds before trying next game...");
      await new Promise((resolve) => setTimeout(resolve, 10000));
    }
  }

  console.log("--------------------------------------------------");
  console.log(`Batch complete. SEO database now covers ${Object.keys(seoData).length} games.`);
  console.log(`Saved database to: src/data/games-seo.json`);
  console.log("--------------------------------------------------");
}

generateSeoForGames();
