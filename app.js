const express = require('express');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const {User, Product} = require('./schema.js');
require('dotenv').config();
const bcrypt = require('bcrypt');
const {
    generateAccessToken,
    generateRefreshToken,
    authAccessToken,
    checkInput
} = require('./auth.js');


const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

mongoose.connect('mongodb://localhost:27017/jwt')
    .then(() => console.log('connected'))
    .catch((err) => console.log(err))

app.get('/', (req, res)=>{
    res.send('Please Login or Register')
})

app.post('/register', checkInput, async (req, res) => {
    const { username, password } = req.body;

    try {
        const existingUser = await User.findOne({ username })
        if (existingUser) {
            return res.send("Your username was used.")
        }

        const accessToken = generateAccessToken(username)
        const refreshToken = generateRefreshToken(username)

        const hashPassword = await bcrypt.hash(password, 10)
        
        const newUser = new User({
            username,
            password : hashPassword,
            refreshToken
        })
        await newUser.save()

        res.json({
            auth: true,
            accessToken,
            refreshToken
        })

    } catch (err) {
        console.log(err.message)
        return res.status(500).send("Sign Up failed.")
    }
})


app.post('/login', checkInput, async (req, res) => {
    const { username, password } = req.body;

    try {
        const existingUser = await User.findOne({ username })
        if (!existingUser) {
            return res.send("Username is invalid")
        }

        const hashPassword = await bcrypt.compare(password, existingUser.password)
        if (!hashPassword) {
            return res.send("password is invalid")
        }

        const accessToken = generateAccessToken(username)
        const refreshToken = generateRefreshToken(username)

        await User.updateOne({ username }, { refreshToken })

        res.json({
            auth: true,
            accessToken,
            refreshToken
        })

    } catch (err) {
        console.log(err.message)
        return res.status(500).send("Login failed.")
    }
})

app.get('/token', authAccessToken, (req, res) => {
    res.status(200).json({
        data: req.token
    })
})

app.get('/refreshToken', async (req, res) => {
    let token = req.headers.authorization

    if (!token) {
        return res.json({ success: false, message: "Error! Token doesn't exist." });
    }

    token = token.split(' ')[1];
    try {
        const refreshToken = await User.findOne({ refreshToken: token })
        if (!refreshToken) {
            return res.send("Please relogin")
        }
        const decodeToken = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET)
        const accessToken = generateAccessToken(decodeToken.username)
        res.json({ accessToken })
    } catch (err) {
        console.log(err.message)
        return res.status(500).send("Please relogin")
    }

})

app.post('/logout', async (req, res) => {
    const { username } = req.body

    try {
        const existingUser = await User.findOne({ username })
        if (!existingUser) {
            return res.send("Can't found your account.")
        }
    } catch (err) {
        console.log(err.message)
        res.status(500).send('Logout failed')
    }

    try {
        await User.updateOne({ username }, { refreshToken: '' })
        res.send('Logout success')
    } catch (err) {
        console.log(err.message)
        res.status(500).send('Logout failed')
    }
})

// app.get('/users',  async (req, res) => {
//     try {
//         const user = await User.find()
//         res.send(user)
//     } catch (err) {
//         console.log(err.message)
//         res.status(500).send("Error!")
//     }
// })
//
// app.patch('/api/:user', checkInput, async (req, res) => {
//     try {
//         await User.updateOne({ username: req.params.user }, req.body)
//         res.redirect('/api/users')
//     } catch (err) {
//         console.log(err.message)
//         res.status(500).send('Something wrong!')
//     }
// })

// app.put('/api/:user', checkInput, async (req, res) => {

//     try {
//         await User.replaceOne({ username: req.params.user }, req.body)
//         res.redirect('/api/users')
//     } catch (err) {
//         console.log(err.message)
//         res.status(500).send('Something wrong!')
//     }
// })

// app.delete('/api/:user', authAccessToken, async (req, res) => {
//     try {
//         await User.deleteOne({ username: req.params.user })
//         res.redirect('/api/users')
//     } catch (err) {
//         console.log(err.message)
//         res.status(500).send('Something wrong!')
//     }
// })


app.listen(3000, () => {
    console.log('http://localhost:3000')
})