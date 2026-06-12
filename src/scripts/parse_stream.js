const fs = require('fs');
const path = require('path');

const scriptPath = './script_8_content.js';

function parseStream() {
  try {
    const raw = fs.readFileSync(scriptPath, 'utf8');
    
    // The raw script looks like: window.__reactRouterContext.streamController.enqueue("...")
    // Let's extract the string inside the enqueue("...") function call
    const match = raw.match(/enqueue\("([\s\S]*?)"\);/);
    if (!match) {
      console.log("Could not find enqueue string in script content.");
      return;
    }
    
    let escapedStr = match[1];
    
    // Decode the escaped string. Since it is double-escaped, let's clean it up
    // We can eval or parse it. Since it's inside a string literal, we can do a simple replacement
    // or wrap it in a JSON parser.
    // Let's do a simple unescaping of JSON strings
    let unescaped = escapedStr
      .replace(/\\"/g, '"')
      .replace(/\\\\/g, '\\')
      .replace(/\\n/g, '\n')
      .replace(/\\t/g, '\t');
      
    fs.writeFileSync('./decoded_stream.txt', unescaped);
    console.log("Wrote unescaped stream to decoded_stream.txt");

    // Look for message structures or plain text lines
    // In streamed responses, messages are stored in JSON. Let's find parts that look like text:
    // E.g. "content" or strings inside.
    // Let's run a simple regex to find all text blocks between quotes that are longer than 30 characters.
    const textBlocks = [];
    const regex = /"([^"]{30,})"/g;
    let rMatch;
    while ((rMatch = regex.exec(unescaped)) !== null) {
      const txt = rMatch[1].replace(/\\n/g, '\n');
      // If it looks like code or HTML, we can ignore it, but keep prose
      if (!txt.includes('__reactRouterContext') && !txt.includes('streamController')) {
        textBlocks.push(txt);
      }
    }
    
    console.log(`Extracted ${textBlocks.length} text blocks.`);
    
    // Save to file
    const formattedBlocks = textBlocks.map((b, i) => `--- BLOCK ${i} ---\n${b}`).join('\n\n');
    fs.writeFileSync('./prose_blocks.txt', formattedBlocks);
    console.log("Saved extracted prose blocks to prose_blocks.txt");
    
    // Let's search if there's any JSON object we can parse
    // The stream is typically in "Devalue" format or standard serialized JS
    // Let's find sections in prose_blocks that contain actual plans or recommendations
    const planBlocks = textBlocks.filter(b => 
      b.toLowerCase().includes('plan') || 
      b.toLowerCase().includes('recreate') || 
      b.toLowerCase().includes('roadmap') || 
      b.toLowerCase().includes('database') ||
      b.toLowerCase().includes('game')
    );
    
    console.log(`Found ${planBlocks.length} blocks discussing 'plan/roadmap/database/game'`);
    if (planBlocks.length > 0) {
      fs.writeFileSync('./relevant_plan_blocks.txt', planBlocks.join('\n\n=========================================\n\n'));
      console.log("Saved relevant plan blocks to relevant_plan_blocks.txt");
    }
    
  } catch (err) {
    console.error('Error:', err);
  }
}

parseStream();
