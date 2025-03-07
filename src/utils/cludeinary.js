import {v2 as cludeinary} from "cloudinary"
import fs from "fs"



cludeinary.config({
    cloud_name: process.env.CLOUDENARY_CLOUD_NAME,
    api_key:process.env.CLOUDENARY_API_KEY,
    api_secret:process.env.CLOUDENARY_API_SECRET
})

const  uplodeOncludeinary = async (localPath) =>{
    try {
        if(!localPath) return null
        const response = await cludeinary.uploader.upload(localPath,{
            resource_type : "auto"
        })
        console.log("the file uplode  on cl", response.url)
        console.log("the file uplode  on cl", response)
        fs.unlinkSync(localPath)
        return response
        
    } catch (error) {
        fs.unlinkSync(localPath)
        return null
    }
}
export {uplodeOncludeinary}