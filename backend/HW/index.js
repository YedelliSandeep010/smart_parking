// D:\Smart_parking\server\backend\HW\index.js
const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");
require("dotenv").config();

const app = express();


// Replace app.use(cors()); with this more specific version:
app.use(cors({
    origin: "http://localhost:3004", // Matches your current frontend port
    methods: ["GET", "POST", "PATCH", "DELETE"],
    credentials: true
}));


app.use(express.json());

// Models
const userModel = require("../models/User.js");
const Slot = require("../models/slotModel.js");

// Middleware Placeholder (Ensure auth.js exists)
const { protect } = require("../routes/auth.js"); 

// --- AUTH ROUTES ---
app.post("/register", async (req, res) => {
    try {
        const { name, email, password, role, phone, vehicleType, vehicleNumber } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new userModel({ name, email, password: hashedPassword, role, phone, vehicleType, vehicleNumber });
        await user.save();
        res.json({ message: "Registration successful" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await userModel.findOne({ email });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(400).json({ message: "Invalid credentials" });
        }
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || "secret123", { expiresIn: "1h" });
        res.json({ message: "Login successful", token });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// D:\Smart_parking\server\backend\HW\index.js

app.get("/profile", async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) return res.status(401).json({ message: "No token provided" });

        const token = authHeader.split(" ")[1];
        // Ensure JWT_SECRET matches what is in your .env
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret123");

        const user = await userModel.findById(decoded.id).select("-password");
        if (!user) return res.status(404).json({ message: "User not found" });

        res.json(user);
    } catch (error) {
        res.status(401).json({ message: "Invalid or expired token" });
    }
});

// --- SLOT ROUTES ---
app.get("/api/slots", async (req, res) => {
    try {
        const slots = await Slot.find();
        res.json(slots);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Replace your old app.post("/api/slots"...) with this:
// D:\Smart_parking\server\backend\HW\index.js

app.post("/api/slots", async (req, res) => {
    try {
        if (Array.isArray(req.body)) {
            // This allows you to send the whole list of 10 slots at once
            const newSlots = await Slot.insertMany(req.body);
            res.status(201).json(newSlots);
        } else {
            const { slotNumber, isAvailable } = req.body;
            const newSlot = new Slot({ slotNumber, isAvailable });
            await newSlot.save();
            res.status(201).json(newSlot);
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Start Server
mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/smartparking")
    .then(() => console.log("MongoDB Connected"))
    .catch((err) => console.log(err));

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server running on port ${port}`));


// D:\Smart_parking\server\backend\HW\index.js

// Add this to handle the "Confirm Booking" button from your web page
app.patch("/api/slots/book/:id", async (req, res) => {
    try {
        const { id } = req.params;
        // Find the slot and update isAvailable to false
        const updatedSlot = await Slot.findByIdAndUpdate(
            id,
            { isAvailable: false },
            { new: true } // returns the updated document
        );

        if (!updatedSlot) {
            return res.status(404).json({ message: "Slot not found" });
        }

        res.json({ message: "Slot booked successfully!", updatedSlot });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

