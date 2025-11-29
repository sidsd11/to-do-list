import React, { useContext, useEffect, useState } from 'react'
import Navbar from '../components/Navbar.jsx'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext.jsx'
import axios from 'axios'
import { toast } from 'react-toastify'
import { Loader, Pen } from 'lucide-react'

const MyTasks = () => {
    axios.defaults.withCredentials = true

    const navigate = useNavigate()
    const {backendUrl, isLoggedIn, userData, getUserData, authLoading} = useContext(AppContext)
    const [tasks, setTasks] = useState([])
    const filter = ['All', 'Completed', 'Pending']
    const [selectedFilter, setSelectedFilter] = useState('All')
    const [edit, setEdit] = useState(false)

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
                        <div className='flex flex-col items-center mt-20 px-4 text-center p-10 w-[70%] sm:w-[80%] text-black text-sm'>
                            <h1 className='text-3xl text-center font-semibold mb-6'>
                                My Tasks
                            </h1>
                            
                            <div className='hidden sm:flex gap-4 mb-6'>
                                {
                                    filter.map((f, index) => (
                                        <button
                                        key = {index}
                                        className={`px-4 py-2 rounded-full border border-indigo-600 transition-all ${selectedFilter === f ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-200'}`}
                                        onClick={() => setSelectedFilter(f)}
                                        >
                                            {f}
                                        </button>
                                    ))
                                }
                            </div>

                            <div className='sm:hidden mb-6'>
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
                            
                            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 place-items-center w-full'>
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
                                        <div key={task._id} className='p-4 bg-white shadow-md rounded-lg hover:shadow-xl hover:scale-[1.03] transition-all'>
                                            <h3 className='font-semibold text-lg text-gray-800 border-b pb-2'>
                                                {task.title}
                                            </h3>

                                            <p className='text-gray-600 text-sm mt-2'>
                                                {task.description?.length > 50
                                                ? task.description.substring(0, 50) + '...'
                                                : task.description}
                                            </p>

                                            <div className='flex justify-between items-center mt-3 gap-2'>
                                                <label className='flex items-center gap-2 cursor-pointer'>
                                                    <input
                                                    type='checkbox'
                                                    checked={task.isCompleted}
                                                    onChange={() => completeTask(task._id, task.isCompleted)}
                                                    className='accent-green-600 cursor-pointer'
                                                    />
                                                    <p className={`${task.isCompleted ? 'text-green-600' : 'text-yellow-600'} text-xs`}>
                                                        {task.isCompleted ? 'Completed' : 'Pending'}
                                                    </p>
                                                </label>

                                                <p className='text-xs text-gray-500'>
                                                    {new Date(task.createdAt).toLocaleDateString()}
                                                </p>

                                                <p className='text-gray-500'>
                                                    <Pen className='size-5 cursor-pointer' onClick={() => setEdit(true)}/>
                                                </p>
                                            </div>
                                        </div>
                                    ))
                                })()}
                            </div>
                        </div>
                    )
                }
            </div>
        )
    )
}

export default MyTasks