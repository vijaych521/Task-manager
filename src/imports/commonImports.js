const User = require('../models/userModel')
const Task = require('../models/taskModel')
const express = require('express')
const auth = require('../middleware/auth')
const multer = require('multer')
const sharp = require('sharp')

module.exports = {
    User: User,
    Task: Task,
    express: express,
    auth: auth,
    multer: multer,
    sharp: sharp
}