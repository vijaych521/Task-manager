const express = require('express')
const Task = require('../models/taskModel')
const auth = require('../middleware/auth.js')

const router = new express.Router

router.get('/tasks', async (request, response) => {
    try {
        const tasks = await Task.find({})
        response.send(tasks)
    } catch (error) {
        response.status(404).send(error)
    }
})

router.get('/tasks/:id', async (request, response) => {
    const _id = request.params.id
    try {
        const task = await Task.findById(_id)
        if (!task) {
            await Promise.reject(new Error("Task not found with id: " + _id));
            // return response.status(404).send("Task with Not found with given id: " + _id)
        }
        response.send(task)
    } catch (errors) {
        response.status(404).send(errors.message)
    }
})

router.post('/tasks', auth, async (request, response) => {
    // const task = new Task(request.body)
    const task = new Task({
        ...request.body, // using ES6 function 
        'owner': request.user._id
    })
    try {
        response.status(201).send(await task.save())
    } catch (error) {
        response.status(400).send(error)
    }
})

//update tasks
router.patch('/tasks/:id', async (request, response) => {
    // check updated parameters are valid or not
    const updatedParams = Object.keys(request.body)
    const permitedParams = ['description', 'completed']
    const isValidParams = updatedParams.every(param => { return permitedParams.includes(param) })
    if (!isValidParams)
        response.status(400).send("invalid params ")

    const _id = request.params.id
    try {
        // const updatedTask = await Task.findByIdAndUpdate(_id, request.body, { new: true, runValidators: true })
        const updatedTask = await Task.findById(_id)
        updatedParams.forEach(param => updatedTask[param] = request.body[param])
        await updatedTask.save()
        
        if (!updatedTask) {
            /**
             * this if code will handles the unhandledRejection of promise on line 71
             */
            /*process.on('unhandledRejection', error => {
                // Prints "unhandledRejection woops!"
                console.log('unhandledRejection', error.test);
            });
            new Promise((_, reject) => reject({ test: 'woops!' }));*/

            await Promise.reject(new Error("Task not found with id: " + _id));
            // response.status(404).send("Task not found with id: " + _id)
        }
        response.status(201).send(updatedTask)
    } catch (error) {
        response.status(400).send(error.message)
    }
})
// delete task 
router.delete('/tasks/:id', async (request, response) => {
    const _id = request.params.id
    try {
        const task = await Task.findByIdAndDelete(_id)
        if (!task) {
            await Promise.reject(new Error("Task not found with id: " + _id));
            // response.status(404).send("Task  not found with given id: " + _id)
        }
        response.status(200).send(task)
    } catch (error) {
        response.status(400).send(error.message)
    }
})

module.exports = router

// async function rejected() {
//     // No unhandled rejection!
//     await Promise.reject(new Error('test'));
// }