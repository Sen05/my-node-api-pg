// index.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 3000;
const userRoutes = require("./routes/user.route");

// Middleware
app.use(cors());
app.use(express.json());

// API Base Route
app.get("/", (req, res) => {
  res.send("API Node.js + PostgreSQL đã sẵn sàng!");
});

app.use("/api/users", userRoutes);

app.listen(port, () => {
  console.log(`Server chạy tại http://localhost:${port}`);
});
