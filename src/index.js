const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/database");
const routes = require("./routes");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const app = express();
const PORT = process.env.PORT || 3001;

// Config env
dotenv.config();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/uploads", express.static("uploads"));

// CORS
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

// Connect Database
connectDB();

// Routes
routes(app);

app.listen(PORT, () => {
  console.log(`ShoeSystem listening on port ${PORT}`);
});
