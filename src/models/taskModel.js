const mongoose = require('mongoose')
const validator = require('validator')

const taskkSchema = new mongoose.Schema({
    description: { type: String, required: [true, 'Enter the description of your task'], trim: true },
    completed: { type: Boolean, default: false },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
}, {
    timestamps: true
})

// performing some operation before saving user object using middleware 
taskkSchema.pre('save', function (next) {
    // TODO some operation before saving object
    next()
})
const Task = mongoose.model('Task', taskkSchema)

// const taskWork = new Task({
//     description: "Learning Mongoose   "
// })

// taskWork.save().then(() => {
//     console.log(taskWork)
// }).catch((err) => {
//     console.log(err)
// })

module.exports = Task