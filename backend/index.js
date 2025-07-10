import dotenv from "dotenv";
dotenv.config();
// File: backend/index.js
import app from "./app.js";
import connectDB from "./db/index.js";

connectDB()
.then(() => {
    app.listen(process.env.PORT||5000, () => {
        console.log(`Server is running on port ${process.env.PORT}`);
    });
})
.catch((err)=> {
    console.error("Error connecting to MongoDB:", err);
    process.exit(1);
}) // Connect to MongoDB



app.get("/", (req, res) => {
  res.send("Server is running!");
});


// get a list of five jokes
app.get("/api/jokes", (req, res) => {
    const jokes = [
        {
            id: 1,
            joke: "Why don't scientists trust atoms? Because they make up everything!"
        },
        {
            id: 2,
            joke: "Why did the scarecrow win an award? Because he was outstanding in his field!"
        },
        {
            id: 3,
            joke: "I told my wife she was drawing her eyebrows too high. She looked surprised."
        },
        {
            id: 4,
            joke: "Parallel lines have so much in common. It’s a shame they’ll never meet."
        },
        {
            id: 5,
            joke: "I would tell you a chemistry joke, but I know I wouldn’t get a reaction."        
        }
    ]
    res.json(jokes);
});



// app.listen(port, () => {  console.log(`Example app listening at http://localhost:${port}`);
// });