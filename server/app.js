import express from 'express';

const app = express();


app.get("/",(req,res)=>{
    res.send("Try this now");
});

app.listen(5000,()=>{
    console.log("CareerConnect API Running");
})