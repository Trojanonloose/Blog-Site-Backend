const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt"); //encrypting passwords

//REGISTER OR CREATING A USER
router.post("/register", async (req, res) => {
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword,
        })

        const user = await newUser.save();
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json(err)
    }
})

//LOGIN OR AUTHENTICATING A USER
router.post("/login", async (req, res) => {
    try {
        const user = await User.findOne({ username: req.body.username }); //validating user
        !user && res.status(400).json("Wrong credentials");

        const validated = await bcrypt.compare(req.body.password, user.password); //validating password
        !validated && res.status(400).json("Wrong credentials");

        const { password, ...others } = user._doc; //to send everything is response but password 
        res.status(200).json(others);
    } catch (err) {
        res.status(500).json(err)
    }
})

module.exports = router