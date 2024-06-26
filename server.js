const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(
  "mongodb+srv://raja:2003@cluster0.a5zryul.mongodb.net/rpa-club",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

// Check if the connection is successful
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB");
});

// Serve static files from the React build folder
app.use(express.static(path.join(__dirname, "dist")));

// Sample controller (inside controllers folder)
const userController = require("./controller/userController");
const messagesRoute = require("./controller/messageController");
const activityRoutes = require("./controller/activityController");
const payRoutes = require("./controller/paymentController");
app.use("/api/users", userController); // Use this controller for handling user-related routes
app.use("/api/messages", messagesRoute);
app.use("/hope", activityRoutes);
app.use("/pay", payRoutes);

// Route to handle server errors and trigger automatic reload
app.use((err, req, res, next) => {
  console.error("Server error:", err);
  // Send a response to the client instructing it to reload the page
  res.status(500).send(`
    <html>
      <head>
        <script>
          setTimeout(() => {
            window.location.reload();
          }, 3000); // Reload the page after 3 seconds
        </script>
      </head>
      <body>
        <p>Server crashed. Reloading...</p>
      </body>
    </html>
  `);
});

// Serve the React app for any other routes
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist/index.html"));
});

// Start the server
const server = app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
