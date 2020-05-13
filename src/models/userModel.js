const mongoose = require('mongoose')
const validator = require('validator')

const User = mongoose.model('User', {
    name: {
        type: String,
        required: true,
        trim: true
    },
    age: {
        type: Number,
        default: 1,
        validate(value) {
            if (value > 100 || value <= 0)
                throw new Error("Age must be possitive value and Less than 100")
        }
    },
    email: {
        type: String,
        require: true,
        lowercase: true,
        trim: true,
        validate(value) {
            if (!validator.isEmail(value))
                throw new Error("Enter Valid Email address")
        }
    },
    password: {
        type: String,
        trim: true,
        minlength:5,
        validate(value) {
            if (value.toLowerCase().includes("password"))
                throw new Error("Entered Password should not be exact match with Text 'Password' ")
        }
    }
})

// const newUser = new User({
//     name: 'Vikram   ',
//     email: 'vicky@gmail.com    ',
//     password:"pass@12"
// })

// newUser.save().then(() => {
//     console.log(newUser)
// }).catch((error) => {
//     console.log("Some Error: " + error)
// })

module.exports = User