require("dotenv").config();
const express = require("express");
const sequelize = require("./models");
const authRoutes = require("./routes/authRoutes");
const fileRoutes = require("./routes/fileRoutes");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

app.use("/api/auth", authRoutes);
app.use("/api/files", fileRoutes);

const PORT = process.env.PORT || 5001;

sequelize
  .authenticate()
  .then(() =>
    console.log("Postgres connection has been established successfully.")
  )
  .catch((err) =>
    console.error("Unable to connect to the Postgres database:", err)
  );

sequelize.sync().then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
