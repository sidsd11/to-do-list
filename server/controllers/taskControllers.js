import taskModel from '../models/taskModel.js'

export const createTask = async (req, res) => {
    const {userName, title, task} = req.body
    if(!userName, !title, !task) {
        return res.json({success: false, message: 'Missing details'})
    }

    try {
        const createTask = new taskModel({userName, title, task, createdAt: Date.now()})
        await createTask.save()
    
        return res.json({success: true, message: 'Task created succesfully'})        
    }
    catch (error) {
        return res.json({success: false, message: error.message})
    }

}

export const editTask = async (req, res) => {
    const {taskId, title, task} = req.body
    if(!taskId || !title || !task) {
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
        if(!selectedTask) {
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
        if(!selectedTask) {
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
        if(!selectedTask) {
            return res.json({success: false, message: 'Task not found'})
        }
    
        return res.json({success: true, message: 'Task deleted successfully'})        
    }
    catch (error) {
        return res.json({success: false, message: error.message})
    }
}