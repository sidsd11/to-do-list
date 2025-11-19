import userModel from '../models/userModel.js'
import taskModel from '../models/taskModel.js'

export const getAllTasks = async (req, res) => {
    try {
        const userId = req.user.id

        const user = await userModel.findById(userId)
        if (!user) {
            return res.json({success: false, message: 'User does not exist'})
        }

        const tasks = await taskModel.find({email: user.email}).sort({createdAt: -1})

        return res.json({success: true, message: 'Tasks fetched successfully', tasks})
    }
    catch (error) {
        return res.json({success: false, message: 'Not authorized. Login again'})
    }
}

export const createTask = async (req, res) => {
    const {email, title, task} = req.body
    if (!email, !title, !task) {
        return res.json({success: false, message: 'Missing details'})
    }

    try {
        const createTask = new taskModel({email, title, task, createdAt: Date.now()})
        await createTask.save()
    
        return res.json({success: true, message: 'Task created succesfully'})        
    }
    catch (error) {
        return res.json({success: false, message: error.message})
    }

}

export const editTask = async (req, res) => {
    const {taskId, title, task} = req.body
    if (!taskId || !title || !task) {
        return res.json({success: false, message: 'Missing details'})
    }

    try {
        const selectedTask = await taskModel.findByIdAndUpdate(
            taskId,
            {
                $set: {
                    title, task
                }
            },
            {new: true, runValidators: true}
        )
        if (!selectedTask) {
            return res.json({success: false, message: 'Task not found'})
        }
    
        return res.json({success: true, message: 'Task edited successfully'})        
    }
    catch (error) {
        return res.json({success: false, message: error.message})
    }
}

export const completeTask = async (req, res) => {
    const {taskId} = req.body
    if (!taskId) {
        return res.json({success: false, message: 'Missing details'})
    }

    try {
        const selectedTask = await taskModel.findByIdAndUpdate(
            taskId,
            {
                $set: {
                    isCompleted: true,
                    completedAt: Date.now()
                }
            },
            {new: true, runValidators: true}
        )
        if (!selectedTask) {
            return res.json({success: false, message: 'Task not found'})
        }
    
        return res.json({success: true, message: 'Task marked as completed'})        
    }
    catch (error) {
        return res.json({success: false, message: error.message})
    }
}

export const deleteTask = async (req, res) => {
    const {taskId} = req.body
    if (!taskId) {
        return res.json({success: false, message: 'Missing details'})
    }

    try {
        const selectedTask = await taskModel.findByIdAndDelete(taskId)
        if (!selectedTask) {
            return res.json({success: false, message: 'Task not found'})
        }
    
        return res.json({success: true, message: 'Task deleted successfully'})        
    }
    catch (error) {
        return res.json({success: false, message: error.message})
    }
}