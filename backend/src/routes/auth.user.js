const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const User = require('../model/user.model');
const generateToken = require('../middleware/generateToken');




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
router.get("/users", async (req,res) => {
    try {
        const users = await User.find({}, 'id email role');
        res.status(200).send({message:"Users Found sucessfully", users});
    } catch (error) {
        onsole.error("error fetching user:", error)
        res.status(500).send({ message: "error fetching user",error: error.message })
    }
}),

//delete a user
router.delete("/users/:id", async (req,res) => {
    try {
        const {id} = req.params;
        const user = await User.findByIdAndDelete(id);
        if (!user) {
            return res(404).send({message: "user not found"});
        }
        res.status(200).send({message:"User deleted sucessfully"});


    } catch (error) {
        onsole.error("error deleting user:", error)
        res.status(500).send({ message: "error deleting user",error: error.message })
    }
})

//update the role of a user
router.put("/users/:id", async (req, res) => {
    try {
        const {id} = req.params;
        const {role} = req.body;
        const user = await User.findByIdAndUpdate(id, {role}, {new:true});
        if (!user) {
            return res(404).send({message: "user not found"});
        }
        res.status(200).send({message:"User Updated sucessfully", user});
    } catch (error) {
        onsole.error("error updating role of user:", error)
        res.status(500).send({ message: "error updating role of user",error: error.message })
    }
})










module.exports = router;