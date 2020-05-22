const { express, multer } = require('./imports/commonImports')
require('./db/mongoose') // it will run the mongoose file when file loads
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')

const app = express()
const port = process.env.PORT
// creating maintainence page or as middleware
// app.use((req, res, next) => {
//     res.status(503).send("site under maintenennce")
// })

app.use(express.json(), userRouter, taskRouter)

app.listen(port, () => {
    console.log('Server is started on port : ' + port)
})

const upload = multer({
    dest: 'images',
    limits: {
        fileSize: 1000000 // 1
    },
    fileFilter(req, file, callback) {
        if (!file.originalname.match(/\.(doc|docx)$/))
            return callback(new Error("Please upload doc or docx file"))
        callback(undefined, true)
    }
})

app.post('/upload', upload.single('upload'), (req, res) => {
    res.send("uplaoded success !!")
}, (error, req, res, next) => {
    // this callback is redirected from middleware i.e upload.single
    res.send({ 'error': error.message })
})