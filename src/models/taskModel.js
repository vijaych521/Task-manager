const mongoose = require('mongoose')
const validator = require('validator')

const Task = mongoose.model('Task', {
    description: {
        type: String,
        required: [true, 'Enter the description of your task'],
        trim: true
    },
    completed: {
        type: Boolean,
        default: false
    }
})

// const taskWork = new Task({
//     description: "Learning Mongoose   "
// })

// taskWork.save().then(() => {
//     console.log(taskWork)
// }).catch((err) => {
//     console.log(err)
// })

module.exports = Task
