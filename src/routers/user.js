const User = require('../models/userModel')
const express = require('express')
const auth = require('../middleware/auth.js')

const router = new express.Router

router.post('/users/login', async (request, response) => {
    try {
        const user = await User.findByUserCredentials(request.body.email, request.body.password)
        const token = await user.generateAuthToken() // call on user instance
        response.send({ user, token })
    } catch (error) {
        response.status(404).send(error.message)
    }
})

router.get('/users', async (request, response) => {
    try {
        response.send(await User.find({}))
    } catch (errors) {
        response.status(500).send(errors)
    }
})

// get user profile
router.get('/users/me', auth, async (request, response) => {
    response.send(request.user)
})

// create user request
router.post('/users', async (request, response) => {
    const user = new User(request.body)
    try {
        const savedUser = await user.save()
        const token = await user.generateAuthToken()
        response.status(201).send({ savedUser, token })
    } catch (error) {
        response.status(400)
        response.send(error)
    }
})

// get user by id
router.get('/users/:id', async (request, response) => {
    const _id = request.params.id
    try {
        const user = await User.findById(_id)
        if (!user) {
            // return response.status(404).send("User Not found with given id: " + _id)
            await Promise.reject(new Error("Task not found with id: " + _id));
        }
        response.send(user)
    } catch (errors) {
        response.status(404).send(errors.message)
    }
})

// update user
router.patch('/users/:id', async (request, response) => {
    // check updated parameters are valid or not
    const updatedParams = Object.keys(request.body)
    const userParams = ['name', 'age', 'email', 'password']
    const isValidKeys = updatedParams.every(param => { return userParams.includes(param) })
    if (!isValidKeys)
        response.status(400).send("Invalid Key to update")

    const _id = request.params.id
    try {
        // const updatedUser = await User.findByIdAndUpdate(_id, request.body, { new: true, runValidators: true })
        const updatedUser = await User.findById(_id)
        updatedParams.forEach((param) => updatedUser[param] = request.body[param])
        await updatedUser.save()

        if (!updatedUser) {
            // response.status(404).send("User not found with given id: ")
            await Promise.reject(new Error("Task not found with id: " + _id));
        }
        response.status(200).send(updatedUser)
    } catch (error) {
        response.status(400).send(error.message)
    }
})

// delete user 
router.delete('/users/:id', async (request, response) => {
    const _id = request.params.id
    try {
        const user = await User.findByIdAndDelete(_id)
        if (!user) {
            /**
             * this if code will handles the unhandledRejection of promise on line 71
             */
            // process.on('unhandledRejection', error => {
            //     // Prints "unhandledRejection woops!"
            //     console.log('unhandledRejection', error.test);
            // });
            // new Promise((_, reject) => reject({ test: 'woops!' }));
            // response.status(404).send('User with given id not found')

            await Promise.reject(new Error("Task not found with id: " + _id));
        }
        response.status(200).send(user)
    } catch (error) {
        response.status(400).send(error.message)
    }
})

// logging out user
router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter(t => {
            return t.token !== req.token // removing request.token from user.tokens array object
        })
        console.log(req.user.tokens)
        await req.user.save()

        res.send()
    } catch (error) {
        res.send(400).send('Unbale to process')
    }
})

// logout all session
router.post('/users/logoutAll', auth, async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.send("Logout successfully from all other devices")
    } catch (error) {
        res.status(500).send("unable to logout...")
    }
})

module.exports = router