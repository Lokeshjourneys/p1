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












export default app;