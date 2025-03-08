import asyncHandler from "../utils/asyncHandler.js"
import ApiError from "../utils/ApiError.js"
import  {User} from "../models/user.model.js"
import {uplodeOncludeinary} from "../utils/cludeinary.js"
import ApiResponse from "../utils/ApiResponse.js"
import jwt from "jsonwebtoken"




const registeruser = asyncHandler(async (req ,res) =>{
   const {username , email , password , fullname} = req.body
    console.log("email :" ,email)
    console.log(req.body)

    if (
        [username,email,password,fullname].some((filed)=> 
        filed?.trim()==="")
    ){
        throw new ApiError(400 ,"All fields are required")
    }
    
   const exitUser =   await User.findOne({
        $or : [{ username },{ email }]
    })
    if(exitUser){
        throw new ApiError(409 , "user alrady exit ")
    }
    
   const avatarLocalpath = req.files?.avatar[0]?.path
   //const coverImagelocalpath = req.files?.coverImage[0]?.path
   console.log("avtarlocalpath and cocver ",avatarLocalpath )
      let coverImagelocalpath;
   if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.lenth >0 ){
       coverImagelocalpath = req.files.coverImage.path
   }

   if(!avatarLocalpath){
    throw new ApiError(400 , "avatar is reqiried")
   }
    
  const avatar = await uplodeOncludeinary(avatarLocalpath)
  const coverImage = await uplodeOncludeinary(coverImagelocalpath)

   if(!avatar){
    throw new ApiError(500 , "avatar not  uploded ")
   }

   const user = await User.create({
    username : username.toLowerCase(),
    email,
    avatar : avatar.url,
    coverImage : coverImage?.url || "",
    password,
    fullname
   })

    const cratedUser = await User.findById(user._id).select(
        "-password  -refreshTokens"
    )
    if(!cratedUser){
        throw new ApiError(500 , "user not  created ")
    }

     return res.status(201).json(
        new ApiResponse(200 , "user created success " , cratedUser)
     )
})

const generateAccessTokenAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId);
        if (!user) throw new ApiError(404, "User not found");

        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();
        console.log("refreshToken:", refreshToken);
        console.log("accessToken",accessToken);

        user.refreshTokens = refreshToken;
        await user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };
    } catch (error) {
        throw new ApiError(500, "Error generating tokens");
    }
};

const loginuser = asyncHandler(async (req, res) => {
    const { email, password, username } = req.body;
    console.log("email:", email);

    if (!(username || email)) {
        throw new ApiError(401, "Username or email is required");
    }

    const user = await User.findOne({
        $or: [{ username }, { email }]
    });

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    const passwordValid = await user.checkpassword(password); 
    if (!passwordValid) {
        throw new ApiError(401, "Password is not valid");
    }

   
    const { accessToken, refreshToken } = await generateAccessTokenAndRefreshToken(user._id);

    const userlogin = await User.findById(user._id).select("-password -refreshTokens");
    const options = {
        httpOnly: true,
        secure: true
    };

    return res.status(200)
        .cookie("refreshToken", refreshToken, options)
        .cookie("accessToken", accessToken, options)
        .json( new  ApiResponse(200,
           {user:userlogin,
            accessToken,
            refreshToken
           },
           "user  loging success"

        ));
});

  const logoutuser = asyncHandler(async (req ,res)=>{
       await User.findByIdAndUpdate(req.user._id,
        {
          refreshToken : undefined
        }

    )
       const options = {
        httpOnly: true,
        secure: true
       }

       return res.status(200)
        
       .cookie("refreshToken" ,"",  options)
       .cookie("accessToken","", options)
       .json(
          new ApiResponse(200,{},"user logout ")
       )
 });

 const refreshAccesstoken = asyncHandler(async(req,res)=>{
   
   const incomingtoken = await req.cookies.refreshToken || req.body.refreshToken
  
   if(!incomingtoken){
    throw new ApiError(401 , "token is required")
   }
    try {
       
      const decodtekon =  jwt.verify(incomingtoken,process.env.REFRESH_TOKEN)

      const user= await User.findById(decodtekon?._id)
       
      if(!user){
        throw new ApiError(401 , "token is invalid")
       }
   
       if(incomingtoken !== user.refreshTokens){
        throw new ApiError(401," token in expiry  and used ")
       }

       const {accessToken ,newRefreshToken} =await generateAccessTokenAndRefreshToken(user._id)


       const options = {
        httpOnly:true,
        secure:true
       }

       return res.status(200)
       .cookie("accessToken",accessToken,options)
       .cookie("refreshToken",newRefreshToken,options)
       .json(
         new ApiResponse(
            200,{
                accessToken ,refreshToken : newRefreshToken
            }
            ,
            "access token  refreshed"
         )
       )
    } catch (error) {
        throw new ApiError(500 , "token is not valid")
    }
  
 })

 const getCurrntuser = asyncHandler(async(req,res)=>{
     return res.status(200).json(
        new ApiResponse(200,req.user,"user  get success")
     )  

 })
 const changePassword = asyncHandler(async(req,res)=>{
    const {oldPassword , newPassword} = req.body
   
    const user = await User.findById(req.user?._id)
    const ispasswordiscorect = await user.checkpassword(oldPassword)

    if(!ispasswordiscorect) {
        throw new ApiError(400 , "old password is reqired ")
    }

    user.password= newPassword
    await user.save({validateBeforeSave:false})

    return res.status(200).json(
        new  ApiResponse (
            200,{},
            "password changed"
        )
    )
      
 })
  
const updateAvatar = asyncHandler(async (req,res)=>{
      
   const localAvatar = req.file?.path
   if(!localAvatar){
    throw new ApiError(400 , "not coming  avatar")

   }

  const  avatar=  await  uplodeOncludeinary(localAvatar)

  if(!avatar.url){
    throw new ApiError (400 , "error on uploding avatar ")
  }

  const user =await User.findByIdAndUpdate(
    req.user._id,
    {
      $set : {
        avatar :avatar.url
      }
    }
  ).select("-pa ssword")
  
    return res.status(200).json(new ApiResponse(
        200,user ,"avatar is update"
    ))
})
const updateCoverimage = asyncHandler(async (req,res)=>{
      
    const localCoverimage = req.file?.path
    if(!localCoverimage){
     throw new ApiError(400 , "error : files mising covrimage ")
    }
 
   const  coverImage=  await  uplodeOncludeinary(localCoverimage)
 
   if(!coverImage.url){
     throw new ApiError (400 , "error on uploding coverImage ")
   }
 
   const user =await User.findByIdAndUpdate(
     req.user._id,
     {
       $set : {
         coverImage :coverImage.url
       }
     }
   ).select("-pa ssword")
   
     return res.status(200).json(new ApiResponse(
         200,user ,"coverImage is update"
     ))
 })

const chanelprofile = asyncHandler(async(req,res)=>{
    const  { username } = req.params

    if(!username){
      throw new ApiError(401 , "username  is  reqired")
    }
    
   const chenal = await User.aggregate([
    {
      $match: {
        username : username?.toLowerCase()
      }
    },
    {
      $lookup : {
        from : "subcripations",
        localField:"_Id",
        foreignField:"chanel",
        as : "subscriber"
      }
    },
    {
      $lookup : {
        from : "subcripations",
        localField:"_Id",
        foreignField:"subscriber",
        as : "subscribedTo"
      }

    },
    {
      $addFields:{
       subscriberCount :{
          $size :"$subscribers"
        },
        subscribedtoCount :{
          $size : "$subscribedTo"
        },
        isSubcribed :{
          if: {$in :[req.user?._Id, "$subscribers . subscriber"]},
          then : true,
          else : false
        }
      }
    },
    {
      $project:{
         username :1,
         subscriberCount:1,
         subscribedtoCount:1,
         fullname:1,
         avatar:1,
         coverImage:1,
         email : 1,
         createAt : 1
      }
    }
   ])
   console.log("chanel:",chenal)


   if(!chenal?.length){
    throw new ApiError(400,"chanel is  reqired ")
   }

   return res.status(200).json(
    new ApiResponse(200,
      chenal[0],
      "user channel fatced succeess"
    )
   )
})








export {
    registeruser,
    loginuser,
    logoutuser,
    refreshAccesstoken,
    getCurrntuser,
    changePassword,
    updateAvatar,
    updateCoverimage,
    chanelprofile
 }  