import express from "express"
import {register, login, logout, isAuth, sendVerificationOtp, verifyAccount, sendResetPasswordOtp, resetPassword} from "../controllers/userControllers.js"
import userAuth from "../middleware/authUser.js"

const authRouter = express.Router()

authRouter.post('/register', register)
authRouter.post('/login', login)
authRouter.post('/logout', logout)
authRouter.get('/is-auth', userAuth, isAuth)
authRouter.post('/send-verification-otp', userAuth, sendVerificationOtp)
authRouter.post('/verify-account', userAuth, verifyAccount)
authRouter.post('/send-reset-otp', userAuth, sendResetPasswordOtp)
authRouter.post('/reset-password', userAuth, resetPassword)

export default authRouter