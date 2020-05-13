require('../src/db/mongoose')

const User = require('../src/models/userModel')

// 5eb9a142a2a36f0bf08c27b8

// User.findByIdAndUpdate('', { age: 10 }).then((user) => {
//     console.log(user)
//     return User.countDocuments({ age: 10 })
// }).then((result) => {
//     console.log('count of age 1 are :' + result)
// }).catch((e) => {
//     console.log("some error : " + e)
// })


const updateUserById = async (_id, query) => {
    const user = await User.findByIdAndUpdate(_id, query)
    const count = await User.countDocuments(query)
    return { count, user }
}

updateUserById('5eb994d9c6cc231dcc5c8a31', { age: 28 }).then((result) => {
    console.log("total count " + result.count)
    console.log("Changed User is  " + result.user)
}).catch(error => {
    console.log(error)
})
