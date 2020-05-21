const express = require('express')
const Task = require('../models/taskModel')
const auth = require('../middleware/auth.js')

const router = new express.Router

//GET /tasks?completed=true
/*GET /tasks?limit=2&skip=4
    --> limit is number of records u want to show on each page
    --> skip is number of records u want to skip for next page
    limit = 2 and skip = 4 will skip the first 4 records and will show the 3rd page with records
*/
//GET /tasks?sortBy=createdAt:desc
//GET /tasks?limit=3&skip=3&sortBy=createdAt:desc

router.get('/tasks', auth, async (request, response) => {
    console.log(request.query)
    const match = {}
    var sort = {}
    // using filtering
    if (request.query.completed)
        match.completed = request.query.completed === 'true'
    // sorting
    if (request.query.sortBy) {
        var parts = request.query.sortBy.split(':')
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
    }

    try {
        // await request.user.populate('tasks').execPopulate()
        await request.user.populate({
            path: 'tasks',
            match,
            options: {
                limit: parseInt(request.query.limit),
                skip: parseInt(request.query.skip),
                sort
            },
        }).execPopulate()
        // const tasks = await Task.find({ owner: request.user._id })
        response.send(request.user.tasks)
    } catch (error) {
        response.status(404).send(error)
    }
})

router.get('/tasks/:id', auth, async (request, response) => {
    const _task_id = request.params.id
    try {
        //const task = await Task.findById(_task_id)
        const task = await Task.findOne({ _id: _task_id, owner: request.user._id }) // here user._id is retured from Auth function
        if (!task) {
            await Promise.reject(new Error("Task not found with id: " + _task_id));
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
router.patch('/tasks/:id', auth, async (request, response) => {
    // check updated parameters are valid or not
    const updatedParams = Object.keys(request.body)
    const permitedParams = ['description', 'completed']
    const isValidParams = updatedParams.every(param => { return permitedParams.includes(param) })
    if (!isValidParams)
        response.status(400).send("invalid params ")
    const _task_id = request.params.id
    try {
        // const updatedTask = await Task.findByIdAndUpdate(_id, request.body, { new: true, runValidators: true })
        const updatedTask = await Task.findOne({ _id: _task_id, owner: request.user._id })
        if (!updatedTask) {
            await Promise.reject(new Error("Task not found with id: " + _task_id));
            // response.status(404).send("Task not found with id: " + _id)
        }
        updatedParams.forEach(param => updatedTask[param] = request.body[param])
        await updatedTask.save()
        response.status(201).send(updatedTask)
    } catch (error) {
        response.status(400).send(error.message)
    }
})
// delete task 
router.delete('/tasks/:id', auth, async (request, response) => {
    try {
        const task = await Task.findOneAndDelete({ _id: request.params.id, owner: request.user._id })
        if (!task) {
            await Promise.reject(new Error("Task not found with id: " + _id));
            // response.status(404).send("Task  not found with given id: " + _id)
        }
        response.status(200).send(task)
    } catch (error) {
        response.status(400).send(error.message)
    }
})

//delete all tasks related to user
router.post('/tasks/deleteAll', auth, async (req, res) => {
    try {
        const query = Task.deleteMany({ owner: req.user._id })
        if ((await query).deletedCount > 0)
            res.status(200).send('All task deleted successfully')
        else
            await Promise.reject(new Error("No Tasks associated with user !!"))
    } catch (error) {
        res.status(400).send(error.message)
    }
})

module.exports = router

// async function rejected() {
//     // No unhandled rejection!
//     await Promise.reject(new Error('test'));
// }