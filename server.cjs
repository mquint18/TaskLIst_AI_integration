require("dotenv").config();

const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

app.post("/breakdown", async (req, res) => {
  const { task } = req.body;
  if (!task) return res.status(400).json({ error: "No task provided" });

  res.json({
    subtasks: [
      `Research what "${task}" involves`,
      "List the resources or tools you need",
      "Break the first action into a 15-minute chunk",
      "Schedule a time block to start",
      "Define what done looks like",
    ],
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
