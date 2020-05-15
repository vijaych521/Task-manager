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
app.use((req, res, next) => {
    res.status(503).send("site under maintenennce")
})

app.use(express.json(), userRouter, taskRouter)
// app.use(userRouter)
// app.use(taskRouter)

app.listen(port, () => {
    console.log('Server is started on port : ' + port)
})