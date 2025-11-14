const express = require("express");
const { connectDB } = require("./DB.js");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());

// Routes
const userRoutes = require("./Routs/userRoutes");
app.use("/api", userRoutes);

// Start server
app.listen(PORT, async () => {
  await connectDB();
  console.log(`🚀 Server running on port ${PORT}`);
});
