const mongoose=require("mongoose");

const companySchema= new mongoose.schema({
    name: { type:stringify,required:true},
    address: { type:string},
    website: {type:string},
    createAt: {type: Date,default: Date.now},
});

module.exports=mongoose.model("Company",companySchema);

