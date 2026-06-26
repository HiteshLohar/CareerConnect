import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import connectDB from "./src/config/db.js";
import authRoutes from "./src/routes/auth.route.js";

connectDB();

const app = express();

app.use(express.json());

app.use('/api/auth', authRoutes);



app.get("/",(req,res)=>{
    res.send("CareerConnect API Running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT,()=>{
    console.log(`CareerConnect API Running on port ${PORT}`);
})