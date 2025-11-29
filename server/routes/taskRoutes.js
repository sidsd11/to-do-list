import express from 'express'
import { getAllTasks, createTask, editTask, completeTask, pendingTask, deleteTask } from '../controllers/taskControllers.js'
import userAuth from '../middleware/authUser.js'

const taskRouter = express.Router()

taskRouter.get('/get-all-tasks/:id', userAuth, getAllTasks)
taskRouter.post('/create-task', userAuth, createTask)
taskRouter.patch('/edit-task/:id', userAuth, editTask)
taskRouter.patch('/complete-task/:id', userAuth, completeTask)
taskRouter.patch('/pending-task/:id', userAuth, pendingTask)
taskRouter.delete('/delete-task/:id', userAuth, deleteTask)

export default taskRouter