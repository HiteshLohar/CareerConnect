import mongoose from "mongoose";

const companySchema = new mongoose.Schema({
    name : {
        type : String,
        required : true,
        unique : true,
        trim : true
    },
    description : {
        type : String,
        default : ""
    },
    website :{
        type : String,
        default : ""
    },
    location :{
        type:String,
        default : ""
    },
    logo:{
        type : String,
        default : ""
    },
    owner:{
        type : mongoose.Schema.ObjectId,
        ref : "User",
        required : true
    }
},{ timestamps : true});

const Company = mongoose.model("Company", companySchema);

export default Company;