require("dotenv").config();

const express = require("express");
const cors = require("cors");
const Anthropic = require("@anthropic-ai/sdk");

const app = express();
app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

// Initialize the Anthropic client
// It automatically reads ANTHROPIC_API_KEY from .env
const client = new Anthropic();

app.post("/breakdown", async (req, res) => {
  const { task } = req.body;

  if (!task) {
    return res.status(400).json({ error: "No task provided" });
  }

  try {
    const message = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: `Break down this task into exactly 5 concrete, actionable subtasks: "${task}"

Rules:
- Return ONLY a JSON array of exactly 5 strings
- Each string is one subtask written as a short imperative sentence (start with a verb)
- No numbering, no bullet points, no explanation outside the JSON
- Example format: ["Research X", "Write Y", "Contact Z", "Review W", "Submit V"]`,
        },
      ],
    });

    // Extract the text response from Claude
    const rawText = message.content[0].text.trim();

    // Parse the JSON array Claude returned
    // We wrap this in try/catch because if Claude returns
    // unexpected formatting, JSON.parse will throw
    let subtasks;
    try {
      subtasks = JSON.parse(rawText);

      // Sanity check — make sure we got an array of strings
      if (!Array.isArray(subtasks) || subtasks.length === 0) {
        throw new Error("Invalid format from Claude");
      }
    } catch (parseErr) {
      console.error("Claude returned unexpected format:", rawText);
      return res.status(500).json({
        error: "AI returned an unexpected format — please try again",
      });
    }

    res.json({ subtasks });
  } catch (err) {
    // Handle specific Anthropic API errors
    if (err.status === 401) {
      return res.status(500).json({ error: "Invalid API key" });
    }
    if (err.status === 429) {
      return res
        .status(500)
        .json({ error: "Rate limit hit — wait a moment and try again" });
    }
    console.error("Anthropic API error:", err.message);
    res.status(500).json({ error: "AI request failed — please try again" });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
