import mongoose from "mongoose";

const likeSchema = new mongoose.Schema(
  {
    video: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Video",
      required: function() { return !this.comment; }
    },
    comment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
      required: function() { return !this.video; }
    },
    likedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  { timestamps: true }
);


likeSchema.index(
  { video: 1, likedBy: 1 },
  { 
    unique: true, 
    partialFilterExpression: { video: { $exists: true } }
  }
);

// Comment likes index (only applies when comment exists)
likeSchema.index(
  { comment: 1, likedBy: 1 },
  { 
    unique: true, 
    partialFilterExpression: { comment: { $exists: true } }
  }
);

export const Like = mongoose.model("Like", likeSchema);