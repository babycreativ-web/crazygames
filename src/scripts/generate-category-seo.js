const fs = require("fs");
const path = require("path");

const SEO_FILE = path.join(__dirname, "../data/categories-seo.json");
const MODEL = "gemini-2.5-flash"; // Standard fast model

const CATEGORIES = [
  "Action",
  "Adventure",
  "Arcade",
  "Board",
  "Card",
  "Clicker",
  "Driving",
  ".io",
  "Puzzle",
  "Shooting",
  "Simulation",
  "Sports",
  "Strategy",
  "Thinky",
  "Trivia",
  "Word"
];

async function generateCategorySeo() {
  const apiKey = process.argv[2] || process.env.GEMINI_API_KEY;

  if (!apiKey) {
    console.error("Error: Google Gemini API Key is required.");
    console.log("Usage: node generate-category-seo.js <GEMINI_API_KEY>");
    process.exit(1);
  }

  console.log("--------------------------------------------------");
  console.log("Starting Category AI SEO Generation Engine");
  console.log("--------------------------------------------------");

  let seoData = {};
  if (fs.existsSync(SEO_FILE)) {
    try {
      seoData = JSON.parse(fs.readFileSync(SEO_FILE, "utf8"));
      console.log(`Loaded existing category SEO data for ${Object.keys(seoData).length} categories.`);
    } catch (e) {
      console.warn("Category SEO file was invalid or empty, starting fresh.");
    }
  }

  for (let i = 0; i < CATEGORIES.length; i++) {
    const category = CATEGORIES[i];
    const key = category.toLowerCase().replace(/\s+/g, "-");

    if (seoData[key]) {
      console.log(`[${i + 1}/${CATEGORIES.length}] Skipping: "${category}" (already exists).`);
      continue;
    }

    console.log(`[${i + 1}/${CATEGORIES.length}] Generating 1000-word SEO article for: "${category}"...`);

    const prompt = `
      You are an expert SEO copywriter and product manager for a major browser game portal.
      Generate a premium, search-engine-optimized category landing page description for: "${category} Games".
      
      Requirements:
      1. Write a comprehensive, detailed article (800 to 1200 words).
      2. Highlight the history of ${category} games, core gameplay mechanics, why they are addictive, popular sub-genres, and tips for players.
      3. Format the article using HTML tags (strictly use: <h2>, <h3>, <p>, <ul>, <li>, <strong>). Do NOT use <h1> tags. Keep it visually organized and premium.
      4. Use relevant, high-traffic keywords related to free web browser gaming, unblocked games, play online without downloading.
      
      You must respond with a strict, valid JSON object ONLY. Do not write any markdown code blocks, backticks, or intro text. Just the raw JSON. The JSON structure must match this format:
      {
        "title": "Play Free ${category} Games Online | No Downloads | CrazyArcade",
        "metaDescription": "A compelling search-engine description (150-160 characters) summarizing what the ${category} games page offers, to boost search click-through-rates.",
        "keywords": "free ${category} games, play ${category} games online, unblocked ${category} games, browser games",
        "article": "Your full HTML article text..."
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
      
      const parsedSeo = JSON.parse(rawText);

      seoData[key] = {
        categoryName: category,
        title: parsedSeo.title,
        metaDescription: parsedSeo.metaDescription,
        keywords: parsedSeo.keywords,
        article: parsedSeo.article,
        generatedAt: new Date().toISOString(),
      };

      // Write progress incrementally
      const dir = path.dirname(SEO_FILE);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(SEO_FILE, JSON.stringify(seoData, null, 2), "utf8");
      console.log(`✓ Completed category: "${category}"`);

      // Rate limit buffer (sleep 7 seconds to avoid quota limits)
      await new Promise((resolve) => setTimeout(resolve, 7000));

    } catch (err) {
      console.error(`✗ Failed generating category "${category}":`, err.message);
      console.log("Waiting 15 seconds before trying next category...");
      await new Promise((resolve) => setTimeout(resolve, 15000));
    }
  }

  console.log("--------------------------------------------------");
  console.log(`Batch complete. Category SEO covers ${Object.keys(seoData).length} categories.`);
  console.log(`Saved database to: src/data/categories-seo.json`);
  console.log("--------------------------------------------------");
}

generateCategorySeo();
