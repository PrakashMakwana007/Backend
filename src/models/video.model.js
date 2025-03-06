import mongoose, {Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
const videoSchema = new Schema(
    {
      videoFile :{
        type : string , // url
        require: true
      },
      thumbnail:{
        type : string, // url
        require: true
      },
      title :{
        type:string,
        reqire :true,

      },
      description :{
        type:string,
        reqire:true
      },
      viwes :{
        type:Number,
        default: 0,

      },
      duration :{
        type: Number,
        require: true
      },
      isPublic:{
        type:Boolean,
        default:true
      },
      owner :{
        type:Schema.Types.ObjectId,
        ref :"User",
      }
    },
  {timestamps: true}
)   

videoSchema.plugin(mongooseAggregatePaginate);

export const Video = mongoose.model("Video",videoSchema)