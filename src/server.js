import dotenv from "dotenv";
import app from "./app.js";
import connectDB from "./config/db.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

// Connect to MongoDB first
await connectDB();

// Start the server only after a successful DB connection
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});