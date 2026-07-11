import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import connectDB from "./src/config/db.js";
import authRoutes from "./src/routes/auth.route.js";
import jobRoutes from "./src/routes/job.route.js"
import applicationRoutes from "./src/routes/application.routes.js";

connectDB();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use("/api/applications", applicationRoutes);


app.get("/",(req,res)=>{
    res.send("CareerConnect API Running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT,()=>{
    console.log(`CareerConnect API Running on port ${PORT}`);
})