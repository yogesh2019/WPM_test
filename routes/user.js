const express = require('express');
const router = express.Router();
const { validateName, validateEmail, validatePassword } = require('../util/validators');
const bcrypt = require('bcrypt');
const User = require('../models/userModels');
const jwt = require('jsonwebtoken');
router.post('/signup', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        console.log(req.body, "body");
        const existingUser = await User.findOne({ where: { email } });
        console.log("existingUser", existingUser);
        if (existingUser || existingUser != null) {
            return res.status(403).json("User already exists");
        }
        if (!validateName(name)) {
            return res.status(400).json({ err: "Invalid Name" });
        }
        if (!validateEmail(email)) {
            return res.status(400).json({
                err: "Invalid Email"
            })
        }
        if (!validatePassword(password)) {
            return res.status(400).json({
                err: "Invalid Password"
            })
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = {
            name, email, password: hashedPassword
        }

        const createdUser = await User.create(user);
        console.log(createdUser);
        return res.status(200).json({
            message: `Welcome ${createdUser.name}`
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json(error);
    }
});

router.post('/signin', async (req, res) => {
    const { email, password } = req.body;
    if (email.length === 0) {
        return res.status(400).json({
            err: "Please provide email"
        })
    }
    if (password.length === 0) {
        return res.status(400).json({
            err: "Please provide password"
        })
    }
    const existingUser = await User.findOne({
        where: { email }
    })
    if (!existingUser) {
        return res.status(400).json({
            err: "User not found"
        })
    }
    const passwordMatched = await bcrypt.compare(password, existingUser.password);
    if (!passwordMatched) {
        return res.status(400).json({
            err: "email or password mismatch"
        })
    }
    const payload = { user: { id: existingUser.id } };
    const bearerToken = await jwt.sign(payload, "SECRET MESSAGE", {
        expiresIn: 36000,
    });
    res.cookie('t', bearerToken, { expire: new Date() + 9999 });
    res.redirect('/api/v1/play/game');
});

module.exports = router;
