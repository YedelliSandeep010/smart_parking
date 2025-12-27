const express=require("express");
const app=express();
const port=5000;
require("dotenv").config();

const cors=require("cors");
app.use(cors());
app.use(express.json());

app.use("/api/admin",require("./routes/admin"));
const companyRoutes= require("./routes/company");
app.use("/api/company",companyRoutes);

const authRoutes=require("./routes/auth");

app.use("/app/auth",authRoutes);
//app.use("/api/admin",authRoutes);

const mongoose=require("mongoose");

app.get("/",(req,res)=>{
    res.send("Hello World!");
});

const users=[
    { email:"test@gmail.com",password:"1234",role:"user"},
    { email:"admin@gmail.com",password:"admin",role:"admin"},
];

app.post("/login",(req,res)=>{
    const{email,password}=req.body;

    const user=users.find((u)=>u.email === email && u.password === password);

    if(!user){
        return res.json({message:"Invalid credentials"});
    }

    res.json({message: "Login successful",role: user.role});
});

mongoose
 .connect(process.env.MONGO_URI)
 .then(()=>console.log("MongoDB Connected"))
 .catch((err)=>console.log(err));