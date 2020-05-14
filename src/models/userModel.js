const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcrypt')

const userSchema = new mongoose.Schema({
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
        required: true,
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
        required: true,
        minlength: 5,
        validate(value) {
            if (value.toLowerCase().includes("password"))
                throw new Error("Entered Password should not be exact match with Text 'Password' ")
        }
    }
})

// performing some operation before saving user object using middleware 
userSchema.pre('save', async function (next) {
    // hashing password before saving the user object
    if (this.isModified('password'))
        this.password = await bcrypt.hash(this.password, 8)
    // if this function is not called process go into infinite loop 
    // mwe are letting mongoose know that our operation is done and now save the user
    next()
})

const User = mongoose.model('User', userSchema)

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

// const encryptPass = async (pass)=> {
//     const hashedPass = await bcrypt.hash(pass, 8)
//     console.log(hashedPass)

//     const flag = await bcrypt.compare(pass, hashedPass)
//     console.log(flag)
// }
// // encryptPass("Vijay@123b")