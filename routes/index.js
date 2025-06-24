import express from "express";
import { GoogleGenAI } from "@google/genai";
// import cron from "node-cron";
import axios from "axios";

const router = express.Router();
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const MESSAGE = `You are an AI assistant. I will give you a coding problem.

Your task is to return a JSON object with two keys using CPP:

- "code": The solution code in a simple and clean format with no comments or extra text.
- "output": The actual output of the code after execution.

Do not return any explanation or commentary. Only return the JSON object.

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
