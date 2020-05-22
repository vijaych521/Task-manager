const mongoose = require('mongoose')

mongoose.connect(process.env.MONGOOSE_DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
})

// if unique email is not created then execute below command in mongoose for user collection
//db.users.createIndex({email: 1}, {unique: true})