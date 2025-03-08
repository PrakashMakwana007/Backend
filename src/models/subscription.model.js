import mongoose, { Schema } from "mongoose";

const subscripationSchema = new Schema({
    subscriber:{
       type : Schema.Types.ObjectId,  // who  subscriber 
       ref : "User"
    },
    chanel:{
       type : Schema.Types.ObjectId,//who "subscriber " is  sbcribing 
       ref : "User"
    }
},{
    timestamps:true
})

export const Subcripation = mongoose.model("Subcripation",subscripationSchema)