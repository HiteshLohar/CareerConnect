import express from 'express';
import dotenv from 'dotenv';
import connectDB from "./src/config/db.js";
dotenv.config();

const app = express();

connectDB();

app.get("/",(req,res)=>{
    res.send("Try this now");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT,()=>{
    console.log(`CareerConnect API Running on port ${PORT}`);
})