import jwt from "jsonwebtoken"
export const generateVerificationToken=()=> Math.floor(100000+Math.random()*900000).toString();

export const generateTokenAndSetCookies =async (userId , res)=>{
    try {
        const token = jwt.sign({userId} , process.env.JWT_SECRET , {expiresIn:"7d"});
        res.cookie("token" , token ,
            {
                 htttpOnly:true ,
                 sameSite:true,
                secure:process.env.NODE_ENV==="production" ,
                maxAge:7*24*60*60*1000
            }
        );
     return token;
        
    } catch (error) {
        return res.status(500).json({message:"error while generating tokens"});
        
    }

}
