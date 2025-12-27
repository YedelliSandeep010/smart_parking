const mongoose = require("mongoose");
const Slot = require("../models/slotModel");
 
mongoose.connect("mongodb+srv://sandeepyedellii_db_user:<abcd123456>@cluster0.nzbq3ic.mongodb.net/smart_parking6 appName=Cluster0", {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log("DB Connected"))
.catch((err) => console.log(err));
 
const slots = [
    { slotNumber: "A1", isAvailable: true, location: { x: 10, y: 20 } },
    { slotNumber: "A2", isAvailable: false, location: { x: 20, y: 20 } },
    { slotNumber: "A3", isAvailable: true, location: { x: 30, y: 20 } },
    { slotNumber: "A4", isAvailable: true, location: { x: 40, y: 20 } }
];
 
Slot.insertMany(slots)
.then(() => {
    console.log("Slots Inserted Successfully!");
    mongoose.connection.close();
})
.catch(err => console.log(err));