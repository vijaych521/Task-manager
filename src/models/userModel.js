const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const Task = require('./taskModel')
const jwtKey = 'thisTokenForVijay'

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
        unique: true, // create unique index for each email entry
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
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
    avatar: {
        type: Buffer
    }
}, {
    timestamps: true
})

userSchema.virtual('tasks', {
    ref: 'Task',
    localField: '_id',
    foreignField: 'owner'
})

/**
 *  toJSON will return the customized object
 */
// userSchema.methods.getPublicProfile = function () {
userSchema.methods.toJSON = function () {
    const userObject = this.toObject()

    // customizing user object for display
    delete userObject.password
    delete userObject.tokens
    return userObject
}

/**
 * Creating and verifying auth token
 * this method will be called on user instance
 */
userSchema.methods.generateAuthToken = async function () {
    const user = this
    const token = jwt.sign({ _id: user._id.toString() }, jwtKey)
    user.tokens = user.tokens.concat({ token })
    user.save()
    return token
}

/**
 * creating method to check user crdentials 
 * This method can be call Using Model name like in Java
 */
userSchema.statics.findByUserCredentials = async (email, password) => {
    const user = await User.findOne({ email })
    if (!user)
        throw new Error("Unable to login")
    const isPasswordMatched = await bcrypt.compare(password, user.password)
    if (!isPasswordMatched)
        throw new Error("Unable to login")
    return user
}

// performing some operation before saving user object using middleware 
userSchema.pre('save', async function (next) {
    // hashing password before saving the user object
    const user = this
    if (user.isModified('password'))
        user.password = await bcrypt.hash(user.password, 8)
    // if this function is not called process go into infinite loop 
    // mwe are letting mongoose know that our operation is done and now save the user
    next()
})

// this function will run after user remove() mongoose function called
userSchema.pre('remove', async function (next) {
    const user = this
    await Task.deleteMany({ owner: user.id })
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

// const authenticate = () => {
//     const token = jwt.sign({ _id: 'abXyz2341' }, "somekeyforToken", { expiresIn: "10 secs" })
//     console.log(token)

//     console.log(jwt.verify(token, "somekeyforToken"))
// }
// authenticate()