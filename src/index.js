import dotenv from "dotenv";
dotenv.config({
    path: "../env"
});

import connectDB from "./db/index.js";

connectDB()
.then(()=>{
    app.listion(process.env.PORT || 8000 ,() =>{
        console.log(`Server is running on port ${process.env.PORT || 8000}`); 
    })
})
.catch((err)=>{
    console.log("Mongo connion  err !!! ",err);
})
