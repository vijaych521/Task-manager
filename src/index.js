const express = require('express')
require('./db/mongoose')
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')

const app = express()
const port = process.env.PORT || 3000

// using express as middleware
// app.use((req, res, next)=>{
//     console.log("Using middleware")
//     console.log(req.path, req.method)
//     next()
// })

// creating maintainence page
// app.use((req, res, next) => {
//     res.status(503).send("site under maintenennce")
// })

app.use(express.json(), userRouter, taskRouter)
// app.use(userRouter)
// app.use(taskRouter)

app.listen(port, () => {
    console.log('Server is started on port : ' + port)
})

const Task = require('./models/taskModel')
const User = require('./models/userModel')

const main = async () => {
    // const task = await Task.findById('5ec3ded3ecd86741ec345a95')
    // await task.populate('owner').execPopulate()
    // console.log(task.owner)

    const user = await User.findById('5ec3ddc7fd1a2043107bb8a7')
    await user.populate('tasks').execPopulate()
    console.log(user.tasks)
}
main()