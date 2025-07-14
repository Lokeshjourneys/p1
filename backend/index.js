import dotenv from "dotenv";
dotenv.config({ path: "./.env" });
import app from "./app.js";
import connectDB from "./db/index.js";

// Connect to MongoDB and start server
connectDB()
  .then(() => {
    app.listen(process.env.PORT || 5000, () => {
      console.log(`Server is running on port ${process.env.PORT || 5000}`);
    });
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
    process.exit(1);
  });