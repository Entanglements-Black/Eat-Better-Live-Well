// netlify/functions/generate-recipe.js
const fetch = require('node-fetch'); // Node.js fetch API

exports.handler = async function(event, context) {
    try {
        const prompt = "Generate a short, healthy, and easy-to-make recipe idea. Include a creative name, 3-5 main ingredients, and 2-3 simple steps. Format it clearly.";
        const apiKey = process.env.GEMINI_API_KEY; // Access API key from environment variable

        if (!apiKey) {
            return {
                statusCode: 500,
                body: JSON.stringify({ error: "Gemini API key not configured." })
            };
        }

        const payload = {
            contents: [{ role: "user", parts: [{ text: prompt }] }]
        };

        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("Gemini API error:", errorData);
            return {
                statusCode: response.status,
                body: JSON.stringify({ error: "Failed to fetch from Gemini API", details: errorData })
            };
        }

        const result = await response.json();
        const text = result.candidates && result.candidates.length > 0 &&
                     result.candidates[0].content && result.candidates[0].content.parts &&
                     result.candidates[0].content.parts.length > 0
                     ? result.candidates[0].content.parts[0].text
                     : "No recipe generated.";

        return {
            statusCode: 200,
            body: JSON.stringify({ recipe: text })
        };

    } catch (error) {
        console.error("Serverless function error (generate-recipe):", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Internal server error generating recipe." })
        };
    }
};