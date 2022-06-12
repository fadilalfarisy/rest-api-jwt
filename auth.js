require('dotenv').config()
const jwt = require('jsonwebtoken');

function generateAccessToken(username) {
    return jwt.sign({ username }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: 1 * 3600
    })
}

function generateRefreshToken(username) {
    return jwt.sign({ username }, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: 60
    })
}

function authAccessToken(req, res, next) {

    let token = req.headers.authorization

    if (!token) {
        return res.json({ success: false, message: "Error! Token doesn't exist." });
    }
    
    token = token.split(' ')[1];
    try {
        const decodeToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        req.token = decodeToken
        next()
    } catch (err) {
        console.log(err.message)
        return res.status(500).json({
            auth: false,
            accessToken: 'expired'
        })
    }
}

function checkInput(req, res, next) {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).send("Required Username and Password")
    }
    req.body.username = username.replace(/ /g, '')
    req.body.password = (password).toString()
    next()
}

module.exports = ({
    generateAccessToken,
    generateRefreshToken,
    authAccessToken,
    checkInput
})