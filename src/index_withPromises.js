const express = require('express')
require('./db/mongoose')

const User = require('./models/userModel.js')
const Task = require('./models/taskModel.js')
const app = express()
const port = process.env.PORT || 3000

app.use(express.json())

app.get('/users', async (request, response) => {
    User.find({}).then((result) => {
        response.send(result)
    }).catch((errors) => {
        response.status(500).send(errors)
    })
})

app.get('/users/:id', (request, response) => {
    const _id = request.params.id
    User.findById(_id).then((result) => {
        if (!result)
            return response.status(404).send("Not found")
        response.send(result)
    }).catch((errors) => {
        response.status(404).send(errors)
    })
})

app.post('/users', (request, response) => {
    const user = new User(request.body)

    user.save().then((result) => {
        response.status(201).send(result)
    }).catch((errors) => {
        response.status(400)
        response.send(errors)
    })
})


app.get('/tasks', (request, response) => {
    Task.find({}).then((result) => {
        response.send(result)
    }).catch((errors) => {
        response.status(500).send(errors)
    })
})

app.get('/tasks/:id', (request, response) => {
    const _id = request.params.id
    Task.findById(_id).then((result) => {
        if (!result)
            return response.status(404).send("Not found")
        response.send(result)
    }).catch((errors) => {
        response.status(404).send(errors)
    })
})

app.post('/tasks', (request, response) => {
    new Task(request.body).save().then((result) => {
        response.status(201).send(result)
    }).catch((errors) => {
        response.status(400).send(errors)
    })
})
app.listen(port, () => {
    console.log('Server is started on port : ' + port)
})