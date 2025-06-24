import express from "express";
import { GoogleGenAI } from "@google/genai";
import cron from "node-cron";
import axios from "axios";

const router = express.Router();
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const MESSAGE = `You are an AI assistant. I will give you a coding problem.

Your task is to return a JSON object with two keys using C++:

"code": The solution code written in a clean and minimal format, using only what is explicitly mentioned in the problem. Do not use STL features like vector, map, or others unless they are specifically requested. Stick strictly to the requirements and constraints of the problem.

"output": The actual output produced by the code after execution with the given inputs (if any).

Return only the JSON object — no explanation, no extra text, and no comments in the code.

Here is the question:`;

// POST /getai
router.post("/getai", async (req, res) => {
  try {
    const { message } = req.body;

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: [
        {
          role: "user",
          parts: [{ text: `${MESSAGE}\n\n${message}` }]
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

// Cron job to ping backend every 5 minutes
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
