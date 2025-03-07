import asyncHandler from "../utils/asyncHandler.js"
import ApiError from "../utils/ApiError.js"
import  {User} from "../models/user.model.js"
import {uplodeOncludeinary} from "../utils/cludeinary.js"
import ApiResponse from "../utils/ApiResponse.js"





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

const generatAccessTokenAndRefreshToken = async(userId) =>{
    try {
        const user = await  User.findById(userId)
        const accessTokens= user.generateAccessToken()
        const refreshTokens = user.generateRefreshToken()

          user.refreshTokens= refreshTokens
          await user.save({validateBeforeSave : false})
          return {accessTokens,refreshTokens}
    } catch (error) {
        throw new ApiError(500 ,"the token is not valid ")
    }
}
const loginuser = asyncHandler(async (req ,res )=>{
    const {email , password , username} = req.body
    console.log(req.body)

    if(!(email || username)){
        throw new ApiError(400 , "email and  username are  reqired  ")
    }
    
      const user  =await User.findOne(
        {
            $or : [ { username } ,{ email }]
        }
    )
    if(!user){
        throw new ApiError(404 , "user  not  defind ")
    }

     const passwordValid = await user.checkpassword(password)

     if(!passwordValid){
        throw new ApiError(401 , "passsword is  not  valid ")
     }
    
     const {accessTokens,refreshTokens} = await generatAccessTokenAndRefreshToken(user._id)
     
     const userlogin = await User.findById(user._id).select
     ("-password -refreshTokens")
     const options = {
        httpOnly: true,
        secure: true
    }
     return res.status(200)
     .cookie("refreshTokens" ,refreshTokens,options)
     .cookie("accessTokens" ,accessTokens,options)
     .json(
        200,
        {
            user : userlogin,
            refreshTokens,
            accessTokens
        },
        "user Login success"
     )

})

  const logoutuser = asyncHandler(async (req ,res)=>{
       await User.findByIdandUpdate(req.user._id,
        {
          refreshTokens : undefined
        }

    )
       const options = {
        httpOnly: true,
        secure: true
       }

       return res.status(200)
       .cookie("refreshTokens" ,  options)
       .cookie("accessTokens", options)
       .json(
        200,
        {},
        "user logout success"
       )
  })
  
export {
    registeruser,
    loginuser,
    logoutuser
    

 }  