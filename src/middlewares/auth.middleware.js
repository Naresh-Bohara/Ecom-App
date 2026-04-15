import jwt from "jsonwebtoken";
import HttpResponseCode from "../constants/http-status-code.contants.js";
import HttpResponse from "../constants/response-status.contants.js";
import authSvc from "../modules/auth/auth.service.js"

const checkLogin = async(req, res, next) => {
    try{
      let token = req.headers['authorization'] || null;
      if(!token){
        throw {status:HttpResponseCode.UNAUTHENTICATED, message:"Please login first.", statusCode:HttpResponse.unauthenticated}
      }
      token = token.split(" ").pop();

      //decode and verify
      const data = jwt.verify(token, process.env.JWT_SECRET)

      const user = await authSvc.getUserByFilter({
        _id: data.sub
      })

      req.loggedInUser = {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        gender: user.gender,
        address: user.address,
        phone: user.phone,
        image: user.image,
      };
      next()

    }catch(exception){
      if(exception instanceof jwt.TokenExpiredError){
        next({status:HttpResponseCode.UNAUTHENTICATED, message:exception.message, statusCode:HttpResponse.tokenExpired})
      }else if(exception instanceof jwt.JsonWebTokenError){
        next({status:HttpResponseCode.UNAUTHENTICATED, message:exception.message, statusCode:HttpResponse.unauthenticated})
      }else{
        next(exception)
      }
    }
  };

  const refreshToken = async(req, res, next)=>{
    try{
      const refreshToken = req.headers['refresh'] || null;
      if(!refreshToken){
        next({status:HttpResponseCode.UNAUTHENTICATED, message:"Token not found.", statusCode:HttpResponse.unauthenticated})
      }
      const data = jwt.verify(refreshToken, process.env.JWT_SECRET)
      const user = await authSvc.getUserByFilter({
        _id: data.sub
      })

      req.loggedInUser = {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        gender: user.gender,
        address: user.address,
        phone: user.phone,
        image: user.image,
      };
      next()

    }catch(exception){
      next(exception)
    }
  }
  
  export  {checkLogin, refreshToken};
  