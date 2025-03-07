import  jwt  from "jsonwebtoken";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import {User} from "../models/user.model.js";

export const verifyJWT = asyncHandler(async(req,res ,next)=>{
    try {
         const token = await req.cookies.refreshTokens || req.header("Authorization")?.replace("Bearer ","")
         
         console.log("token :" ,token)
         if(!token){
            throw new ApiError(401 ,"the  token is  wrong")

         }

         const decode  =  jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
         if(!decode){
            throw new ApiError(401 ,"the  token is  wrong")
         }
          const  user =await User.findById(decode._id).select("-password -refreshTokens")
          
          if(!user){
            throw new ApiError(401 ,"the user  not defind by token ")
          }
          req.user = user
          next()

    } catch (error) {
         throw new ApiError(500 ,"the  token is not  valid ")
    }
})