import express from "express";
import cors from "cors";
import helmet from "helmet";
import path from "path";

// /server/ files
import apiRoutes from "./routes/api.routes";
import { environment, validateEnvironment } from "./config/environment";
import { errorHandler, notFoundHandler } from "./middleware/error.middleware";

// Validate environment variables
try {
  validateEnvironment();
} catch (error) {
  console.error("Environment validation failed:", error);
  process.exit(1);
}

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the React app
app.use(express.static(path.join(__dirname, "../../dist")));

// API routes
app.use("/api", apiRoutes);

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

// All remaining requests return the React app
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../../dist/index.html"));
});

app.listen(environment.port, () => {
  console.log(`Server running on port ${environment.nodeEnv}`);
});
