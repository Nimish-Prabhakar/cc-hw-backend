require("dotenv").config();
const express = require("express");
const sequelize = require("./models"); // Import initialized sequelize instance
const authRoutes = require("./routes/authRoutes");
const fileRoutes = require("./routes/fileRoutes");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/files", fileRoutes);

const PORT = process.env.PORT || 5001;

// Test database connection and sync models
sequelize
  .authenticate()
  .then(() =>
    console.log("Postgres connection has been established successfully.")
  )
  .catch((err) =>
    console.error("Unable to connect to the Postgres database:", err)
  );

// Sync models and start the server
sequelize.sync().then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
