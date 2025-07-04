// Load environment variables from .env file
require('dotenv').config();
const express = require('express');
const cors = require('cors'); // For handling Cross-Origin Resource Sharing
const fetch = require('node-fetch'); // For making HTTP requests from Node.js

const app = express();
const PORT = process.env.PORT || 3001; // Server will run on port 3001 by default

// Get the API key from environment variables
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// --- CORS Configuration ---
app.use(cors({
  origin: '*', // Allow requests from any origin during development
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Allow these HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allow these headers
}));

// Handle preflight requests for all routes
app.options('*', cors());

// --- Security and Performance Headers ---
app.use((req, res, next) => {
  // Set X-Content-Type-Options to prevent MIME-sniffing
  res.setHeader('X-Content-Type-Options', 'nosniff');

  // Remove X-XSS-Protection (often replaced by Content-Security-Policy)
  // If you want to keep it for older browsers, use: res.setHeader('X-XSS-Protection', '1; mode=block');
  res.removeHeader('X-XSS-Protection');

  // Replace X-Frame-Options with Content-Security-Policy's frame-ancestors
  res.removeHeader('X-Frame-Options');
  // Basic CSP: allows scripts from self, React/Babel CDNs, Tailwind CDN, Google Fonts, and your backend.
  // This is a minimal example; a robust CSP requires careful tuning.
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; " +
    "script-src 'self' 'unsafe-inline' https://unpkg.com https://cdn.tailwindcss.com; " +
    "style-src 'self' 'unsafe-inline' https://cdn.tailwindcss.com https://fonts.googleapis.com; " +
    "font-src 'self' https://fonts.gstatic.com; " +
    "img-src 'self' https://placehold.co data:; " + // Added data: for placeholder images
    "connect-src 'self' http://localhost:3001 https://generativelanguage.googleapis.com; " + // Allow connection to backend and Gemini API
    "frame-ancestors 'self';" // Replaces X-Frame-Options
  );

  // Set Cache-Control for API responses (e.g., no-cache for dynamic content)
  // For static assets, you'd set longer cache times.
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache'); // For HTTP/1.0 backwards compatibility

  // Ensure Content-Type charset is utf-8 (Express usually does this for JSON, but good to ensure)
  // This is often handled by express.json() and res.json() but can be explicitly set if needed.
  // For JSON responses, Express automatically sets Content-Type: application/json; charset=utf-8

  next();
});

// Middleware to parse JSON request bodies
app.use(express.json());


// --- API Endpoint for Story Generation ---
app.post('/generate-story', async (req, res) => {
  console.log('Received request for /generate-story');
  console.log('Request body:', req.body);

  if (!GEMINI_API_KEY) {
    console.error("GEMINI_API_KEY is not set in environment variables.");
    return res.status(500).json({ error: "Server configuration error: API key missing." });
  }

  const { prompt, mainCharacter, setting, conflict, storyLength, storyTone } = req.body;
  let fullPrompt = `Generate a ${storyLength} creative story with a ${storyTone} tone.`;
  if (prompt) fullPrompt += ` The core idea is: "${prompt}".`;
  if (mainCharacter) fullPrompt += ` The main character is: "${mainCharacter}".`;
  if (setting) fullPrompt += ` The setting is: "${setting}".`;
  if (conflict) fullPrompt += ` The central conflict is: "${conflict}".`;
  fullPrompt += ` Provide the response as a JSON object with two fields: "title" (string) and "story" (string).`;

  try {
    const chatHistory = [{ role: "user", parts: [{ text: fullPrompt }] }];
    const payload = {
      contents: chatHistory,
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "OBJECT",
          properties: {
            "title": { "type": "STRING" },
            "story": { "type": "STRING" }
          },
          "propertyOrdering": ["title", "story"]
        }
      }
    };

    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Gemini API error:", errorData);
      return res.status(response.status).json({ error: errorData.error?.message || 'Failed to fetch story from AI.' });
    }

    const result = await response.json();

    if (result.candidates && result.candidates.length > 0 &&
        result.candidates[0].content && result.candidates[0].content.parts &&
        result.candidates[0].content.parts.length > 0) {
      const jsonText = result.candidates[0].content.parts[0].text;
      const parsedResult = JSON.parse(jsonText);
      console.log('Story generated successfully, sending response to frontend.');
      return res.json(parsedResult);
    } else {
      console.log('AI generated no story content.');
      return res.status(500).json({ error: 'No story generated by AI.' });
    }

  } catch (error) {
    console.error("Server error during story generation:", error);
    return res.status(500).json({ error: `Server error: ${error.message || 'Something went wrong.'}` });
  }
});

// --- API Endpoint for Random Prompt Generation ---
app.post('/generate-random-prompt', async (req, res) => {
  console.log('Received request for /generate-random-prompt');

  if (!GEMINI_API_KEY) {
    console.error("GEMINI_API_KEY is not set in environment variables.");
    return res.status(500).json({ error: "Server configuration error: API key missing." });
  }

  try {
    const chatHistory = [{ role: "user", parts: [{ text: `Generate a unique and creative story prompt, focusing on a main character, a unique setting, and an interesting conflict. Provide the response as a simple string, suitable for a text input field.` }] }];
    const payload = { contents: chatHistory };
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Gemini API error for random prompt:", errorData);
      return res.status(response.status).json({ error: errorData.error?.message || 'Failed to fetch random prompt from AI.' });
    }

    const result = await response.json();
    if (result.candidates && result.candidates.length > 0 &&
        result.candidates[0].content && result.candidates[0].content.parts &&
        result.candidates[0].content.parts.length > 0) {
      const generatedText = result.candidates[0].content.parts[0].text;
      console.log('Random prompt generated successfully, sending response to frontend.');
      return res.json({ prompt: generatedText });
    } else {
      console.log('AI generated no random prompt content.');
      return res.status(500).json({ error: 'No random prompt generated by AI.' });
    }

  } catch (error) {
    console.error("Server error during random prompt generation:", error);
    return res.status(500).json({ error: `Server error: ${error.message || 'Something went wrong.'}` });
  }
});


// Start the server
app.listen(PORT, () => {
  console.log(`Backend proxy server running on http://localhost:${PORT}`);
});
