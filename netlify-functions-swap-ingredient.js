// netlify/functions/swap-ingredient.js
const fetch = require('node-fetch');

exports.handler = async function(event, context) {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    try {
        const { ingredient } = JSON.parse(event.body);
        if (!ingredient) {
            return { statusCode: 400, body: JSON.stringify({ error: "Ingredient is required." }) };
        }

        const prompt = `Suggest a single healthier alternative for "${ingredient}". Provide only the healthier ingredient and a very brief reason (1-2 sentences).`;
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
            console.error("Gemini API error (swap-ingredient):", errorData);
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
                     : "No swap suggested.";

        return {
            statusCode: 200,
            body: JSON.stringify({ swap: text })
        };

    } catch (error) {
        console.error("Serverless function error (swap-ingredient):", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Internal server error for ingredient swap." })
        };
    }
};