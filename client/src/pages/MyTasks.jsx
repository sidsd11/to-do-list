import React, { useContext, useEffect, useState } from 'react'
import Navbar from '../components/Navbar.jsx'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext.jsx'
import axios from 'axios'
import { toast } from 'react-toastify'
import { Loader, Pen, ChevronDown, ChevronUp } from 'lucide-react'

const MyTasks = () => {
    axios.defaults.withCredentials = true

    const navigate = useNavigate()
    const {backendUrl, isLoggedIn, userData, getUserData, authLoading} = useContext(AppContext)
    const [tasks, setTasks] = useState([])
    const filter = ['All', 'Completed', 'Pending']
    const [selectedFilter, setSelectedFilter] = useState('All')
    const [expandedTaskId, setExpandedTaskId] = useState(null)
    const [edit, setEdit] = useState(false)
    const [editTitle, setEditTitle] = useState('')
    const [editDescription, setEditDescription] = useState('')
    const [editTitleCheck, setEditTitleCheck] = useState('')
    const [editDescriptionCheck, setEditDescriptionCheck] = useState('')
    const [editTaskId, setEditTaskId] = useState('')
    const [fadeOut, setFadeOut] = useState(false)

    const getTasks = async () => {
        try {
            const {data} = await axios.get(`${backendUrl}/api/task/get-all-tasks/${userData.id}`, {withCredentials: true})
            if (data.success) {
                setTasks(data.tasks)
            }
            else {
                toast.error(data.message)
            }
        }
        catch (error) {
            toast.error(error.message)
        }
    }

    const completeTask = async (taskId, isTaskCompleted) => {
        try {
            let data
            if (!isTaskCompleted) {
                const response = await axios.patch(`${backendUrl}/api/task/complete-task/${taskId}`, {}, {withCredentials: true})
                data = response.data
            }
            else {
                const response = await axios.patch(`${backendUrl}/api/task/pending-task/${taskId}`, {}, {withCredentials: true})
                data = response.data
            }
            if (data.success) {
                toast.success(data.message)
                getTasks()
            }
            else {
                toast.error(data.message)
            }
        }
        catch (error) {
            toast.error(error.message)
        }
    }

    const handleVerify = async () => {
        try {
            axios.defaults.withCredentials = true
    
            const {data} = await axios.post(`${backendUrl}/api/user/send-verification-otp`)
            if (data.success) {
                sessionStorage.setItem('prevPage', '/my-tasks')
                navigate('/email-verify')
                toast.success(data.message)
            }
            else {
                toast.error(data.message)
            }
        }
        catch (error) {
            toast.error(error.message)
        }
    }

    const getSelectedTask = async (taskId) => {
        try {
            axios.defaults.withCredentials = true
    
            const {data} = await axios.get(`${backendUrl}/api/task/get-single-task/${taskId}`, {withCredentials: true})
            if (data.success) {
                setEdit(true)
                setEditTitle(data.task.title)
                setEditDescription(data.task.description)
                setEditTitleCheck(data.task.title)
                setEditDescriptionCheck(data.task.description)
                setEditTaskId(taskId)
            }
            else {
                toast.error(data.message)
            }
        }
        catch (error) {
            toast.error(error.message)
        }
    }

    const editSelectedTask = async (e) => {
        e.preventDefault()
        try {
            axios.defaults.withCredentials = true

            if (editTitleCheck === editTitle && editDescriptionCheck === editDescription) {
                toast.error('Title and description are same as before.')
                return
            }

            const {data} = await axios.patch(`${backendUrl}/api/task/edit-task/${editTaskId}`, {title: editTitle, description: editDescription}, {withCredentials: true})
            if (data.success) {
                getTasks()
                toast.success(data.message)
                setEdit(false)
                setEditTitle('')
                setEditDescription('')
                setEditTitleCheck('')
                setEditDescriptionCheck('')
            }
        }
        catch (error) {
            toast.error(error.message)
        }
    }

    const convertTime = (t) => {
        const day = String(t.getDate()).padStart(2, '0')
        const month = String(t.getMonth() + 1).padStart(2, '0')
        const year = String(t.getFullYear()).slice(-2)

        let hour = t.getHours()
        const min = String(t.getMinutes()).padStart(2, '0')
        const sec = String(t.getSeconds()).padStart(2, '0')
        const ampm = hour >= 12 ? 'pm' : 'am'
        hour = String(hour % 12 || 12).padStart(2, '0')

        return `${day}/${month}/${year} ${hour}:${min}:${sec} ${ampm}`
    }

    useEffect(() => {
        if (authLoading) return
        if (!isLoggedIn) {
            navigate('/')
            return
        }
        getTasks()
        getUserData()
    }, [authLoading, isLoggedIn])

    return (
        authLoading
        ? (
            <div className='flex flex-col items-center justify-center min-h-screen bg-linear-to-br from-blue-200 to-purple-400'>
                <h1 className='text-3xl text-center font-semibold text-black mb-5'>
                    Loading your page...
                </h1>
                <Loader className='animate-spin'/>
            </div>
        ) :
        (
            <div className='flex flex-col items-center justify-center min-h-screen bg-linear-to-br from-blue-200 to-purple-400'>
                <Navbar />
                {
                    !userData?.isAccountVerified
                    ? (
                        <div className='flex flex-col items-center mt-20 px-4 text-center p-10 w-[70%] sm:w-[80%] text-black text-sm'>
                            <h1 className='text-3xl text-center font-semibold'>
                                Your account is not verified. Please <span className='cursor-pointer underline' onClick={handleVerify}>verify</span> it to create tasks.
                            </h1>
                        </div>
                    ) :
                    (
                        edit
                        ? (
                            <div className='flex flex-col items-center mt-20 px-4 text-center bg-slate-900 p-10 rounded-lg shadow-lg w-[70%] sm:w-96 text-indigo-300 text-sm'>
                                <form onSubmit={editSelectedTask}>
                                    <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-lg bg-[#333A5C]'>
                                        <input type='text' value={editTitle} onChange={e => setEditTitle(e.target.value)} className='bg-transparent outline-none text-white' placeholder='Enter title' maxLength='20' required />
                                    </div>
                                    
                                    <div className='mb-4 w-full px-5 py-2.5 rounded-lg bg-[#333A5C]'>
                                        <textarea value={editDescription} onChange={e => setEditDescription(e.target.value)} className='bg-transparent outline-none text-white w-full min-h-[150px] resize overflow-auto' placeholder='Enter description' maxLength='200' required />
                                    </div>
                                    
                                    <button className='w-full py-3 bg-linear-to-r from-indigo-500 to-indigo-900 text-white rounded-full cursor-pointer'>
                                        Save task
                                    </button>
                                </form>
                            </div>
                        ) :
                        (
                            <div className='flex flex-col items-center mt-20 px-4 text-center p-10 w-[70%] sm:w-[80%] text-black text-sm'>
                                <h1 className='text-3xl text-center font-semibold mb-6'>
                                    My Tasks
                                </h1>
                                
                                <div className='hidden sm:flex gap-4 mb-6 justify-center'>
                                    {
                                        filter.map((f, index) => (
                                            <button
                                            key = {index}
                                            className={`px-4 py-2 rounded-full border border-indigo-600 transition-all ${selectedFilter === f ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-200 hover:scale-110'}`}
                                            onClick={() => setSelectedFilter(f)}
                                            >
                                                {f}
                                            </button>
                                        ))
                                    }
                                </div>

                                <div className='sm:hidden mb-6 justify-center'>
                                    <select
                                    className='w-full p-2 border border-indigo-600 rounded-lg text-white bg-indigo-600'
                                    value={selectedFilter}
                                    onChange={((e) => setSelectedFilter(e.target.value))}
                                    >
                                        {
                                            filter.map((f, index) => (
                                                <option key={index} value={f} className='text-black bg-white'>
                                                    {f}
                                                </option>
                                            ))
                                        }
                                    </select>
                                </div>
                                
                                <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full'>
                                    {(() => {
                                        const filteredTasks = tasks.filter(task => {
                                            if (selectedFilter === 'Completed') return task.isCompleted
                                            if (selectedFilter === 'Pending') return !task.isCompleted
                                            return true
                                        })

                                        if (filteredTasks.length === 0) {
                                            return (
                                                <p className='text-lg font-semibold text-black mt-10 col-span-full'>
                                                    No tasks found
                                                </p>
                                            )
                                        }

                                        return filteredTasks.map(task => (
                                            <div
                                            key={task._id}
                                            className={`${selectedFilter !== 'All' ? 'transition-opacity' : ''} p-4 bg-white shadow-md rounded-lg hover:shadow-xl hover:z-10 hover:scale-[1.03] transition-all w-full h-full`}>
                                                <h3 className='font-semibold text-lg text-gray-800 border-b pb-2'>
                                                    {task.title}
                                                </h3>

                                                <p className='text-gray-600 text-sm mt-2 transition-all duration-300 break-all whitespace-normal'>
                                                    {
                                                        expandedTaskId === task._id ? task.description : task.description.length > 50 ? task.description.substring(0, 50) + '...' : task.description
                                                    }
                                                </p>
                                                
                                                {
                                                    task.description?.length > 50 &&
                                                    <div className='flex justify-center items-center mt-3 gap-2'>
                                                        <p className='cursor-pointer' onClick={() => setExpandedTaskId(expandedTaskId === task._id ? null : task._id)}>                                                            
                                                            {
                                                                expandedTaskId === task._id ? <ChevronUp /> : <ChevronDown />
                                                            }
                                                        </p>
                                                    </div>
                                                }

                                                <div className='flex justify-center items-center mt-3 transition-all'>
                                                    <label className='flex items-center gap-2 cursor-pointer'>
                                                        <input
                                                        type='checkbox'
                                                        checked={task.isCompleted}
                                                        onChange={() => completeTask(task._id, task.isCompleted)}
                                                        className={`accent-green-600 cursor-pointer`}
                                                        />
                                                        <p className={`${task.isCompleted ? 'text-green-600' : 'text-yellow-600'} text-xs`}>
                                                            {task.isCompleted ? 'Completed' : 'Pending'}
                                                        </p>
                                                    </label>
                                                </div>

                                                <div className='flex justify-center items-center mt-3 gap-2'>
                                                    <p className='text-xs text-gray-500'>
                                                        Created at: {convertTime(new Date(task.createdAt))}
                                                    </p>
                                                </div>

                                                {
                                                    task.editedAt !== 0 && (
                                                        <div className='flex justify-center items-center mt-3 gap-2'>
                                                            <p className='text-xs text-gray-500'>
                                                                Edited at: {convertTime(new Date(task.editedAt))}
                                                            </p>
                                                        </div>
                                                    )
                                                }

                                                {
                                                    task.completedAt !== 0 && (
                                                        <div className='flex justify-center items-center mt-3 gap-2'>
                                                            <p className='text-xs text-gray-500'>
                                                                Completed at: {convertTime(new Date(task.completedAt))}
                                                            </p>
                                                        </div>
                                                    )
                                                }

                                                {
                                                    !task.isCompleted && (
                                                        <div className='flex justify-center items-center mt-3 gap-2'>
                                                            <p className='text-gray-500'>
                                                                <Pen className='size-5 cursor-pointer'
                                                                onClick={() => {
                                                                    setEdit(true)
                                                                    getSelectedTask(task._id)
                                                                }}/>
                                                            </p>
                                                        </div>
                                                    )
                                                }
                                            </div>
                                        ))
                                    })()}
                                </div>
                            </div>
                        )
                    )
                }
            </div>
        )
    )
}

export default MyTasks