import express from "express";
import { GoogleGenAI } from "@google/genai";
import cron from "node-cron";
import axios from "axios";

const router = express.Router();
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });


const getPrompt = (language) => `You are an AI coding assistant. I will provide you with a coding problem.

Your task is to return a JSON object with two keys, using ${language}:

"code": The complete solution written in a clean, minimal style — as a beginner or student might write. Use only the constructs mentioned in the problem.
${
language.toLowerCase().includes('c++')
? 'Avoid using STL (e.g., vector, map) unless the problem specifically asks for it. '
: ''
}Avoid advanced optimizations or patterns — keep it basic and straightforward. Use classes if appropriate.

"output": The actual output from running the code with the provided input (if any).

Return only the JSON object. No explanations, no extra text, and no comments inside the code.

Here is the question:

`;

router.post("/getai", async (req, res) => {
  try {
    const { message, language = 'cpp' } = req.body; 
    
    const prompt = getPrompt(language) + message;
    
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }]
        }
      ]
    });

    const responseText =
      response?.candidates?.[0]?.content?.parts?.[0]?.text || "No response generated.";

    res.status(200).json({ resp: responseText });
  } catch (error) {
    console.error("Error generating content:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

cron.schedule("*/5 * * * *", async () => {
  try {
    const url = "https://co-assignmentbackend.onrender.com/";
    await axios.get(url);
    console.log(`Pinged ${url} to keep the app alive`);
  } catch (err) {
    console.error("Cron self-ping failed:", err.message);
  }
});

export default router;