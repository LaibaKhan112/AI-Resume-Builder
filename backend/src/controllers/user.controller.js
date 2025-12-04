import { User } from "../models/user.model.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import Resume from "../models/resume.model.js";
dotenv.config()

const registerHandler = async (req, res) => {
    try {
        const { name, email, password } = req.body
        if (!name || !email || !password) {
            return res.status(400).json({ message: "All fields are required" })

        }

        const existedUser = await User.findOne({ email })
        if (existedUser) {
            return res.status(400).json({ "message": "Email registered already" })
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const newUser = await User.create({
            name,
            email,
            password: hashedPassword
        })

        return res.status(201).json({
            message: "User registered succesffully",
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email
            }
        })
    } catch (error) {
        res.status(500).json({ message: "server error", error: error.message })
    }
}

const generateToken = (userId) => {
    const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "7d" })
    return token

}

const loginHandler = async (req, res) => {
    try {
        const { email, password } = req.body
        console.log("Login attempt:", req.body);

        const user = await User.findOne({ email })
        console.log("Found user:", user ? user.email : "none");


        if (!user) {
            return res.status(400).json({ message: "user is not registered" })
        }

        const isMatch = await user.comparePassword(password);
        console.log("Password match:", isMatch);

        if (!isMatch) {
            return res.status(400).json({ message: "Invalid email or password" });
        }


        const token = generateToken(user._id)

        return res.status(200).json({
            message: "user logged in",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        })
    } catch (error) {
        res.status(500).json({ message: "server error", error: error.message })
    }
}

const getUserById = async (req, res) => {
    try {
        const userId = req.userId

        const user = await User.findById(userId)

        if (!user) {
            return res.status(400).json({ message: "user not found" })
        }

        return res.status(200).json({ user })
    } catch (error) {
        return res.status(400).json({ message: error.message })

    }

}

// Get all resumes of user

const getUserResumes = async (req, res) => {
    try {
        const userId = req.userId

        const resumes = Resume.find({ userId })
        return res.status(200).json({ resumes })
    } catch (error) {
        return res.status(400).json({ message: error.message })

    }

}

export { registerHandler, loginHandler, getUserById, getUserResumes }