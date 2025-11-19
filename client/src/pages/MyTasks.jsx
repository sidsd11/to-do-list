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
    const inputRefs = React.useRef([])

    const getTasks = async () => {
        try {
            const {data} = await axios.get(`${backendUrl}/api/get-all-tasks/${userData.email}`)
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
    })

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
            <div className='flex flex-col items-center mt-20 px-4 text-center p-10 w-[70%] sm:w-96 text-black text-sm'>
                <h1 className='text-3xl text-center font-semibold'>
                    My Tasks
                </h1>
                <div className='grid grid-cols-3 gap-4 place-items-center'>
                    <div className='w-20 h-20 bg-red-500'></div>
                    <div className='w-20 h-20 bg-red-500'></div>
                    <div className='w-20 h-20 bg-red-500'></div>
                    <div className='w-20 h-20 bg-red-500'></div>
                </div>
            </div>
        </div>
    )
}

export default MyTasks