const jwt = require('jsonwebtoken')
const User = require('../models/userModel')

const jwtKey = 'thisTokenForVijay'

// Authenticate jsaon web token
const auth = async (req, res, next) => {
    console.log("Middle ware !!")
    try {
        const token = req.header('Authorization').replace("Bearer ", "")
        const decodedAuthToken = jwt.verify(token, jwtKey)
        console.log("decoded token:- ", decodedAuthToken)

        // verifying json web toekn which returns the json {key:value} and the signatureKey  with which encoded
        // finding the user which macthes with given query {id, token} 
        const user = await User.findOne({ _id: decodedAuthToken._id, "tokens.token": token })

        if (!user)
            throw new Error()

        // setting the token value to request for further operation
        req.token = token

        // setting the user to request after authentocation
        req.user = user

        next()
    } catch (error) {
        console.log(error)
        res.status(401).send("Unable to authenticate")
    }
}

module.exports = auth