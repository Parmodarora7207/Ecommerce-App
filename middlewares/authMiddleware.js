import JWT from "jsonwebtoken";
import { token } from "morgan";
import usermodel from "../models/usermodel.js";

// protected Routes token based
export const requireSignIn=async(req,res,next)=>{
try{
    const decode=JWT.verify(req.headers.authorization,process.env.JWT_SECRET)
    req.user=decode;
    next();
}catch(error){
    console.log(error)
}
}

// Admin Acess  Middleware

export const isAdmin=async(req,res,next)=>{
    try{
const user=await usermodel.findById(req.user._id)
if(user.role!==1){
    return res.status(401).send({
        success:false,
        message:"unAuthorized Access"
    });
    }else{
        next();
    }
    }catch(error){
        console.log(error)
        res.status(401).send({
            success:false,
            error,
            message:"Error in admmin Middleware"
        })
    }
}