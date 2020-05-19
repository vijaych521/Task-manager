const mongoose = require('mongoose')

mongoose.connect('mongodb://127.0.0.1:27017/task-manager-api', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
})

// if unique email is not created then execute below command in mongoose for user collection
//db.users.createIndex({email: 1}, {unique: true})