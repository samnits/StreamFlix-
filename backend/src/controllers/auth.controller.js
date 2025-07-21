import User from "../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { upsertStreamUser } from "../lib/stream.js";
export async function signup(req, res) {
    const {email, password,fullName} = req.body; 
    try {
        if(!email ||!password ||!fullName) {
            return res.status(400).json({message: "All fields are required"});
        }
        if(password.length < 6) {
           return  res.status(400).json({message: "Password must be at least 6 characters long"});
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
           return res.status(400).json({ message: "Invalid email format" });
        }
        const existingUser=await User.findOne({email});
        if(existingUser){
            return res.status(400).json({message: "Email already exists, please use a different mail"  });
        }
        const idx=Math.floor(Math.random()*100)+1; // generate a random number between 1 and 100
        const randomAvtar = `https://avatar.iran.liara.run/public/${idx}.png`; // generate a random avatar image
        const newUser=await User.create({
        email,
        password,
        fullName,
        profilePic: randomAvtar
        });


        // TODO : CREATE  USER IN THE STREAM AS WELL
        try {
            await upsertStreamUser({
            id: newUser._id.toString(),
            name: newUser.fullName,
            avatar: newUser.profilePic || "",
        })
            console.log(`User created in the stream successfully ${newUser.fullName}`);

        } catch (error) {
            console.log("Error creating user in the stream: ", error);
        }



        const token= jwt.sign({userId: newUser._id}, process.env.JWT_SECRET_KEY, {expiresIn: "7d"});
        res.cookie("jwt",token,{
            maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
            sameSite: "strict",
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
        })
        res.status(201).json({message: "User registered successfully", user: newUser});

    } catch (error) {
        console.log("error in signup: ", error);
        res.status(500).json({error: "Server error, please try again later"});
    }   
}
export  async function login(req, res) {
    try {
        const {email, password}=req.body;
        if(!email ||  !password){
            return res.status(400).json({message: "All fields are required"});;
        } 
        const user= await User.findOne({email});
        if(!user){
            return res.status(401).json({message: "Invalid credentials"});
        }
        const isPasswordCorrect= await user.matchPassword(password);
        if(!isPasswordCorrect){
            return res.status(401).json({message: "Invalid credentials"});
        }
        const token= jwt.sign({userId: user._id}, process.env.JWT_SECRET_KEY, {expiresIn: "7d"});
        res.cookie("jwt",token,{
            maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
            sameSite: "strict",
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
        })
        res.status(200).json({message: "User logged in successfully", user});
    } catch (error) {
         console.log("error in login: ", error);
        res.status(500).json({message: "Server error, please try again later"});
    }  
}
export function logout(req, res) {
    res.clearCookie("jwt");
    res.status(200).json({success:true,message: "User logged out successfully"});   
}

export async function onboard(req, res) {
    try {
        const userId=req.user._id;
        const {fullName , bio , nativeLanguage, learningLanguage,location}=req.body;
        if(!fullName ||!bio ||!nativeLanguage ||!learningLanguage ||!location){
            return res.status(400).json({message: "All fields are required",
                missingFields:{
                    fullName:!fullName,
                    bio:!bio,
                    nativeLanguage:!nativeLanguage,
                    learningLanguage:!learningLanguage,
                    location:!location

                },
            });

        }
        const updatedUser=await  User.findByIdAndUpdate(userId,{
            ...req.body,
            isOnboarded:true},{new: true});
        if(!updatedUser){
            return res.status(404).json({message: "User not found"});
        }
        // TODO : UPDATE USER IN THE STREAM AS WELL
        try {
            await upsertStreamUser({
            id: updatedUser._id.toString(),
            name: updatedUser.fullName,
            avatar: updatedUser.profilePic || "",
        })
        } catch (error) {
            console.log("Error updating user in the stream: ", error);
            return res.status(500).json({message: "Failed to update user in the stream"});
        }



        res.status(200).json({message: "User onboarded successfully", user: updatedUser});

    } catch (error) {
        console.error("error in onboard: ", error);
        res.status(500).json({message: "Server error, please try again later"});
    }
}