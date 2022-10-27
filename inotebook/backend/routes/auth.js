const express = require('express')
const User = require('../models/User')
const { body, validationResult } = require('express-validator');
const router = express.Router()
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = 'Samisthebest'

//create a user using post /api/auth/createuser No login required
router.post('/createuser', [
    body('name').isLength({ min: 3 }),
    body('email').isEmail(),
    body('password').isLength({ min: 5 })
], async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    //check whether user with same email exists
    try {
        let user = await User.findOne({ email: req.body.email })
        if (user) {
            return res.status(400).json({ error: "A user with this email already exists" })
        }

        //bcrypt salt and hashing
        const salt = await bcrypt.genSalt(10)
        const secPass = await bcrypt.hash(req.body.password, salt)


        user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: secPass
        })

        //JSON web token
        const data = {
            user: {
                id: user.id
            }
        }
        const authToken = jwt.sign(data, JWT_SECRET)
        res.json(authToken)

        //to catch errors 
    } catch (error) {
        console.error(error.message)
        res.status(500).send("some error occured")
    }

})

//Authenticating the user using post /api/auth/login No login required
router.post('/login', [
    body('email', 'enter a valid email').isEmail(),
    body('password', 'password cannot be empty').exists()
], async (req, res) => {


    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }


    const { email, password } = req.body;
    try {
        let user = await User.findOne({ email });
        if (!user) {
          return res.status(400).json({ error: "Please enter valid details" })
        }

        const passwordCompare = await bcrypt.compare(password, user.password)

        if (!passwordCompare) {
          return res.status(400).json({ error: "Please enter valid details" })
        }
        const data = {
            user: {
                id: user.id
            }
        }
        const authToken = jwt.sign(data, JWT_SECRET)
        res.json({authToken})

    } catch (error) {
        console.error(error.message)
        res.status(500).send("some error occured")
    }

})

module.exports = router