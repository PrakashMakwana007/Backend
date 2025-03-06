import mongoose ,{Schema}from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"
const UserSchema = new Schema(
    {
         username: {
           type : String,
           require : true,
           unique : true ,
           trim : true,
           index : true,
           lowercase : true 
            },
           email: {
            type : String,
            require : true,
            unique : true ,
            trim : true,
            lowercase : true 
           },
           password: {
            type : String,
            require : true,
           
           },
           fullname :{
            type : String,
            require: true,
            trim : true,
            index : true,
           },
           avatar :{
            types : string , // url 
            require : true 
           },
           coverImage :{
            types : string , // url  
           },
           refreshTokens :{
            type : string,

           },
           watchHistory: [
            {
                type: Schema.Types.ObjectId,
                ref: "Video"
            }
        ],

    },
    {
    timestamps: true
    }

)

UserSchema.pre("save", async function(next) {
    if(!this.isModified("password")) return next()
        this.password = await bcrypt.hash(this.password, 10)
        next()
})

UserSchema.methods.checkpassword = async function(password) {
   return await bcrypt.compare(password,this.password)
}
UserSchema.methods.generateAccessToken = function(){
    jwt.sign({
        _id : this._Id,
        email : this.email,
        usernawe : this.username,
        fullName : this.fullname
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
     expiresIn: process.env.ACCESS_TOKEN_EXPRY
    }
  )   
}
UserSchema.methods.generateRefreshToken = function(){
    jwt.sign({
        _id : this._Id,
       
    },
    process.env.REFRESH_TOKEN,
    {
     expiresIn: process.env.REFRESH_TOKEN_EXPRY
    }
  )   
}
export const User = mongoose.model("User",UserSchema)