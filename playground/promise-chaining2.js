require('../src/db/mongoose')
const Task = require('../src/models/taskModel')

// Task.findByIdAndRemove('5eb98bd8bd643d1c9453dff8').then((task) => {
//     console.log(task)
//     return Task.countDocuments({ completed: false })
// }).then((result) => {
//     console.log("count of faslse: " + result)
// }).catch((error) => {
//     console.log('some error: ' + error)
// })


const findTaskByIdAndRemove = async (_id) => {
    const task = await Task.findByIdAndRemove(_id)
    const count = await Task.countDocuments({ completed: false })
    return { task, count }
}

findTaskByIdAndRemove('5eb9a29a146c402b04e449dc').then(result => {
    console.log("Removed Task is : " + result.task)
    console.log("Count of incompleted Task is : " + result.count)
}).catch(e => {
    console.log(e)
})