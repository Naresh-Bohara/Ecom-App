import HttpResponseCode from "../constants/http-status-code.contants.js"
import HttpResponse from "../constants/response-status.contants.js"

const checkPermission = (allowedby)=>{
    return (req, res, next)=>{
        if(!allowedby || allowedby.length === 0){
            next({status:HttpResponseCode.ACCESS_DENIED, message:"User Role Required.", statusCode:HttpResponse.emptyRole})
        }else if(!Array.isArray(allowedby)){
            next({status:HttpResponseCode.ACCESS_DENIED, message:"Allowed Roles should be an array", statusCode:HttpResponse.roleShouldBeArray})
        }else{
            const loggedInUserRole = req.loggedInUser.role
            if(allowedby.includes(loggedInUserRole)){
                next()
            }else{
            next({status:HttpResponseCode.ACCESS_DENIED, message:"You don't permission to access this endpoint ", statusCode:HttpResponse.accessDenied})
            }
        }
    }
}

export {checkPermission}