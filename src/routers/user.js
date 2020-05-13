const User = require('../models/userModel')
const express = require('express')

const router = new express.Router

router.get('/users', async (request, response) => {
    try {
        const users = await User.find({})
        response.send(users)
    } catch (errors) {
        response.status(500).send(errors)
    }
})

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

router.post('/users', async (request, response) => {
    const user = new User(request.body)
    try {
        const savedUser = await user.save()
        response.status(201).send(savedUser)
    } catch (error) {
        response.status(400)
        response.send(error)
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
        const updatedUser = await User.findByIdAndUpdate(_id, request.body, { new: true, runValidators: true })
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

module.exports = router
