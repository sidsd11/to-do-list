import React, { useContext, useEffect, useState } from 'react'
import Navbar from '../components/Navbar.jsx'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext.jsx'
import axios from 'axios'
import { toast } from 'react-toastify'
import { Loader } from 'lucide-react'

const MyTasks = () => {
    axios.defaults.withCredentials = true
    const navigate = useNavigate()
    const {backendUrl, isLoggedIn, userData, getUserData, authLoading} = useContext(AppContext)
    const [tasks, setTasks] = useState([])

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

    const completeTask = async (taskId) => {
        try {
            const {data} = await axios.patch(`${backendUrl}/api/task/complete-task/${taskId}`, {}, {withCredentials: true})
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
                sessionStorage.setItem("prevPage", "/my-tasks");
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
        ?
        <div className='flex flex-col items-center justify-center min-h-screen bg-linear-to-br from-blue-200 to-purple-400'>
            <h1 className='text-3xl text-center font-semibold text-black mb-5'>
                Loading your page...
            </h1>
            <Loader className='animate-spin'/>
        </div>
        :
        <div className='flex flex-col items-center justify-center min-h-screen bg-linear-to-br from-blue-200 to-purple-400'>
            <Navbar />
            {
                !userData.isAccountVerified ?
                (
                    <div className='flex flex-col items-center mt-20 px-4 text-center p-10 w-[70%] sm:w-[80%] text-black text-sm'>
                        <h1 className='text-3xl text-center font-semibold'>
                            Your account is not verified. Please <span className='cursor-pointer underline' onClick={handleVerify}>verify</span> it to create tasks.
                        </h1>
                    </div>
                ) :
                (
                    tasks?.length > 0 ?
                    (
                        <div className='flex flex-col items-center mt-20 px-4 text-center p-10 w-[70%] sm:w-[80%] text-black text-sm'>
                            <h1 className='text-3xl text-center font-semibold'>
                                My Tasks
                            </h1>
                            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 place-items-center w-full'>
                                {
                                    tasks.map((task) => (
                                        <div key={task._id} className='p-4 bg-white shadow-md rounded-lg hover:shadow-xl hover:scale-[1.03] transition-all'>
                                            <h3 className='font-semibold text-lg text-gray-800 border-b pb-2'>
                                                {task.title}
                                            </h3>

                                            {
                                                <p className='text-gray-600 text-sm mt-2 '>
                                                {
                                                    task.description?.length > 50
                                                    ? task.description.substring(0, 50) + "..."
                                                    : task.description
                                                }
                                                </p>
                                            }

                                            <div className="flex justify-between items-center mt-3 gap-2">
                                                <label className='flex items-center gap-2 cursor-pointer'>
                                                    <input 
                                                    type="checkbox"
                                                    checked={task.isCompleted}
                                                    disabled={task.isCompleted}
                                                    onChange={() => completeTask(task._id)}
                                                    className="cursor-pointer"
                                                    />
                                                    <p className={`${task.isCompleted ? "text-green-600" : "text-yellow-600"} text-xs`}>
                                                        {task.isCompleted ? "Completed" : "Pending"}
                                                    </p>
                                                </label>

                                                <p className="text-xs text-gray-500">
                                                    {new Date(task.createdAt).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                    ) :
                    (
                        <div className='flex flex-col items-center mt-20 px-4 text-center p-10 w-[70%] sm:w-[80%] text-black text-sm'>
                            <h1 className='text-3xl text-center font-semibold'>
                                No tasks found
                            </h1>
                        </div>
                    )
                )
            }
        </div>
    )
}

export default MyTasks