import express from "express";

const app = express();


// Built-in Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Home Route
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome to FindIt API - Community Lost and Found API",
  });
});

export default app;