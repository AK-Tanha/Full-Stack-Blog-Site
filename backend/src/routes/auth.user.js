const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const User = require('../model/user.model');
const generateToken = require('../middleware/generateToken');
const verifyToken = require('../middleware/verifyToken');
const isAdmin = require('../middleware/isAdmin');




//register a new user
router.post("/register", async (req,res) => {
    try {
        const {email, password, username} = req.body
        const user = new User({email, password, username})
        await user.save();
        res.status(200).send({
            message: "registration sucessful", user:user
        })
    } catch (error) {
        console.error("error register user:", error)
        res.status(500).send({ message: "error register user",error: error.message })
    }
})

//user login
router.post("/log-in", async (req,res) => {
    try {
        /* console.log(req.body); */
        const {email, password} = req.body
        const user = await User.findOne({email});

        if(!user){
            return res.status(404).send({message:"user not found!"})
        }
        const isMatch = await user.comparePassword(password)

        if (!isMatch) {
            return res.status(401).send({message:"invalid password"})
        }

        const token = await generateToken(user._id)
        res.cookie("token",token,{
            httpOnly: true,
            secure: true,
            sameSite: true
        })


        res.status(200).send({
            message: "Log-in sucessful", token,
            user:{
                _id: user._id,
                email: user.email,
                username: user.username,
                role: user.role
            }
        })


    } catch (error) {
        console.error("log-in failed:", error)
        res.status(500).send({ message: "log-in failed",error: error.message })
    }
})

//log-out a user
router.post("/log-out", async (req, res) => {
    try {
        res.clearCookie('token');
        res.status(200).send({
            message: "log-out sucessful"})
    } catch (error) {
        console.error("log-out failed:", error)
        res.status(500).send({ message: "log-out failed",error: error.message })
    }
})

//get all users
router.get("/users", verifyToken, isAdmin, async (req,res) => {
    try {
        const users = await User.find({}, '_id email role username profileImage');
        res.status(200).send({message:"Users Found sucessfully", users});
    } catch (error) {
        console.error("error fetching user:", error)
        res.status(500).send({ message: "error fetching user",error: error.message })
    }
})

// Get single user profile
router.get("/profile", verifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.userId).select('-password');
        if (!user) {
            return res.status(404).send({ message: "User not found" });
        }
        res.status(200).send({ user });
    } catch (error) {
        console.error("Error fetching profile:", error);
        res.status(500).send({ message: "Error fetching profile", error: error.message });
    }
});

// Admin: Create a new user
router.post("/users", verifyToken, isAdmin, async (req, res) => {
    try {
        const { email, password, username, role, profileImage } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).send({ message: "User already exists with this email" });
        }
        const user = new User({ email, password, username, role, profileImage });
        await user.save();
        res.status(201).send({ message: "User created successfully", user });
    } catch (error) {
        console.error("Error creating user:", error);
        res.status(500).send({ message: "Error creating user", error: error.message });
    }
});

// Admin: Update user details (including role and image)
router.put("/users/:id", verifyToken, isAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const { role, username, email, profileImage } = req.body;
        const user = await User.findByIdAndUpdate(id, { role, username, email, profileImage }, { new: true });
        if (!user) {
            return res.status(404).send({ message: "User not found" });
        }
        res.status(200).send({ message: "User updated successfully", user });
    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).send({ message: "Error updating user", error: error.message });
    }
});

// User: Update own profile
router.put("/profile", verifyToken, async (req, res) => {
    try {
        const { username, profileImage } = req.body;
        const user = await User.findByIdAndUpdate(req.userId, { username, profileImage }, { new: true });
        if (!user) {
            return res.status(404).send({ message: "User not found" });
        }
        res.status(200).send({ message: "Profile updated successfully", user });
    } catch (error) {
        console.error("Error updating profile:", error);
        res.status(500).send({ message: "Error updating profile", error: error.message });
    }
});

//delete a user
router.delete("/users/:id", verifyToken, isAdmin, async (req,res) => {
    try {
        const {id} = req.params;
        const user = await User.findByIdAndDelete(id);
        if (!user) {
            return res.status(404).send({message: "user not found"});
        }
        res.status(200).send({message:"User deleted sucessfully"});


    } catch (error) {
        console.error("error deleting user:", error)
        res.status(500).send({ message: "error deleting user",error: error.message })
    }
})

module.exports = router;