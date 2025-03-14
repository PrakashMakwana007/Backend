import mongoose, {Schema} from "mongoose";

const likeSchema = new Schema(
    {
     comment:{
         type : mongoose.Types.ObjectId,
         ref  : "Comment"
     },
     video:{
        type : mongoose.Types.ObjectId,
         ref  : "Video"
     },
     likedby:{
        type : mongoose.Types.ObjectId,
         ref  : "User"
     }
    },
    {
        timestamps:true
    }
)

export const like = mongoose.model("like",likeSchema)