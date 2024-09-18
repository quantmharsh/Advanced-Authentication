import { User } from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import {
	generateTokenAndSetCookies,
	generateVerificationToken,
} from "../utils/generateVerificationToken.js";
import {
	sendVerificationToken,
	sendWelcomeEmail,
	sendPasswordResetEmail,
	sendResetSuccessEmail,
} from "../mailtrap/emails.js";
import crypto from "crypto";
import dotenv from "dotenv";
dotenv.config();
export const signUp = async (req, res) => {
	const { email, password, name } = req.body;
	if (!email || !password || !name) {
		throw new error("All fields are required");
	}
	try {
		//check whether user exists or not with same email
		const userAlreadyExists = await User.findOne({ email });
		if (userAlreadyExists) {
			return res.json({ success: false, messsage: "User already exists" });
		}
		//hash the password of user
		const hashedPassword = await bcryptjs.hash(password, 12);
		//generating  verification token
		console.log("going to generate verification token");
		const verificationToken = await generateVerificationToken();
		console.log("verification token generated", verificationToken);

		//create new user and store it in database;
		console.log("user before storing in db");
		const user = await User.create({
			email,
			name,
			password: hashedPassword,
			verificationToken,
			verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000,
		});
		console.log("user after storing in db");

		//if user is created then generate jwt token and store it in cookies for future validation
		await generateTokenAndSetCookies(user._id, res);

		//sending verification token
		await sendVerificationToken(user.email, verificationToken);
		console.log("genrated token and set cookies");
		return res.status(201).json({
			success: true,
			message: "User added successfully",
			user: {
				...user._doc,
				password: undefined,
			},
		});
		console.log("after return");
	} catch (error) {
		return res.status(400).json({
			success: false,
			message: "Unable to create new user",
		});
	}
};
export const verifyEmail = async (req, res) => {
	const { code } = req.body;
	console.log("Code", code);
	try {
		const user = await User.findOne({
			verificationToken: code,
			verificationTokenExpiresAt: { $gt: Date.now() },
		});
		if (!user) {
			return res
				.status(400)
				.json({
					success: false,
					message: "Invalid or expired verification code",
				});
		}
		user.isVerified = true;
		user.verificationToken = undefined;
		user.verificationTokenExpiresAt = undefined;
		await user.save();
		await sendWelcomeEmail(user.email, user.name);
		console.log("Verified user successfully");
		return res.status(201).json({
			success: true,
			message: "User Verified successfully",
		});
	} catch (error) {
		console.log("Unable to verify email", error);
		throw new Error("Unable to verify email", error);
	}
};
export const login = async (req, res) => {
	const { email, password } = req.body;
	try {
		if (!email || !password) {
			return res.status(404).json({
				success: false,
				message: "All fields are required",
			});
		}
		const user = await User.findOne({ email });
		if (!user) {
			return res.status(404).json({
				success: false,
				message: "User not found",
			});
		}
		const isPasswordCorrect = await bcryptjs.compare(password, user.password);
		if (!isPasswordCorrect || !user) {
			return res.status(404).json({
				success: false,
				message: "Invalid credentials please try with correct credentials",
			});
		}
		//updating the last login time
		user.lastLogin = new Date();
		await user.save();
		//generatingTokens
		generateTokenAndSetCookies(user._id, res);
		return res.status(200).json({
			success: true,
			message: "Logged in Successfully",
			user: {
				...user._doc,
				password: undefined,
			},
		});
	} catch (error) {
		console.log("Unable to login", error);
		return res.status(404).json({
			success: false,
			message: "Problem occured while doing  login",
		});
	}
};

export const forgetPassword = async (req, res) => {
	const { email } = req.body;
	try {
		// 1. find user with email
		const user = await User.findOne({ email });
		if (!user) {
			return res.status(404).json({
				success: false,
				message: "User  not found",
			});
		}
		// 2 . generate reset token
		const resetToken = crypto.randomBytes(20).toString("hex");
		// 3.  add token expiry time
		const resetTokenExpiry = Date.now() + 1 * 60 * 60 * 1000; //1 hr
		// 4 . save token to db
		user.resetPasswordToken = resetToken;
		user.resetPasswordExpiresAt = resetTokenExpiry;
		//save user
		await user.save();
		//send the forget password email which will have reset url and  user email to whom we have to send the data
		await sendPasswordResetEmail(
			user.email,
			`${process.env.CLIENT_URL}/reset-password/${resetToken}`
		);
	} catch (error) {}
};

export const resetPassword = async (req, res) => {
	//get new password from req.body
	const { password } = req.body;
	const { token } = req.params;
	try {
		//find user in database
		const user = await User.findOne({
			resetPasswordToken: token,
			resetPasswordExpiresAt: { $gt: Date.now() },
		});
		if (!user) {
			return res.status(404).json({
				succes: false,
				message: "Invalid or expired Reset Token ",
			});
		}
		//hash new pasword
		const hashedPassword = await bcryptjs.hash(password, 10);
		user.password = hashedPassword;
		user.resetPasswordToken = undefined;
		user.resetPasswordExpiresAt = undefined;
		await user.save();
		await sendResetSuccessEmail(user.email);
		return res.status(201).json({
			success: true,
			message: "Password reset successfully",
		});
	} catch (error) {
		return res.status(404).json({
			success: false,
			message: "Reset password failed",
		});
	}
};

export const logout = async (req, res) => {
	try {
		res.cookie("token", "", {
			maxage: 1,
		});
		return res.status(202).json({
			success: true,
			message: "User loggedout successfully",
		});
	} catch (error) {
		console.log("Unable to logout", error);
		return res.status(400).json({
			successs: false,
			message: "Unable to logout",
		});
	}
};
