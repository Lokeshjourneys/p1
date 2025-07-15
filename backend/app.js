import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
const app = express();

dotenv.config({ path: "./.env" });

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    Credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"]
}));
app.use(express.json({
    limit: "50mb"
}));
app.use(express.urlencoded({
    limit: "50mb",
    extended: true
}));

app.use(express.static("public"));
app.use(cookieParser());

// Importing routes
import userRouter from "./Routes/user.routes.js";





// Using routes
app.use("/api/users", userRouter);

// Global error handler 
app.use((err, req, res, next) => {
  res.status(err.statusCode || 500)
     .send(`
      <html>
        <head><title>Error</title></head>
        <body>
          <h1>Error: ${err.statusCode || 500}</h1>
          <h2>${err.message || "Internal Server Error"}</h2>
          ${process.env.NODE_ENV === "development" ? `<pre>${err.stack}</pre>` : ""}
        </body>
      </html>
    `);
});

export default app;