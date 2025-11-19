import express from 'express'
import { getAllTasks, createTask, editTask, completeTask, deleteTask } from '../controllers/taskControllers.js'
import userAuth from '../middleware/authUser.js'

const taskRouter = express.Router()

taskRouter.get('/get-all-tasks/:email', userAuth, getAllTasks)
taskRouter.post('/create-task', userAuth, createTask)
taskRouter.patch('/edit-task/:taskId', userAuth, editTask)
taskRouter.patch('/complete-task/:taskId', userAuth, completeTask)
taskRouter.delete('/delete-task/:taskId', userAuth, deleteTask)

export default taskRouter