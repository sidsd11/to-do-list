import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
    userName: {type: String, required: true},
    title: {type: String, required: true},
    task: {type: String, required: true},
    isCompleted: {type: Boolean, default: false},
    createdAt: {type: Number, default: 0},
    editedAt: {type: Number, default: 0},
    completedAt: {type: Number, default: 0},
}, {timestamps: true})

const taskModel = mongoose.models.task || mongoose.model('task', taskSchema)

export default taskModel