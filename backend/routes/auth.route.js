import  express from "express"
import { login, logout, signUp  ,verifyEmail , forgetPassword ,resetPassword} from "../controllers/auth.controller.js";
const router=express.Router();
router.post('/signUp' ,signUp)
router.post('/login' ,login)
router.post("/logout" ,logout)
router.post("/verify-email" ,verifyEmail)
router.post("/forget-password" ,forgetPassword)
router.post("/reset-password/:token" , resetPassword)
export default router;