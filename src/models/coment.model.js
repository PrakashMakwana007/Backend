import mongoose, {Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const commentSchema = new Schema(
    {
     content :{
        type : String,
        requred:true
     },
      video:{
        type : mongoose.Types.ObjectId,
        trf : "Video"
      },
      owner :{
        type : mongoose.Types.ObjectId,
        trf : "User"
      }
    },
    {
        timestamps:true
    }
)

commentSchema.plugin(mongooseAggregatePaginate)

export const Comment = mongoose.model("Comment",commentSchema)