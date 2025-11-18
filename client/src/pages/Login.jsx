import React from 'react'
import { assets } from '../assets/assets.js'
import { useNavigate } from 'react-router-dom'

const Login = () => {
    const navigate = useNavigate()
    return (
        <div className='flex flex-col items-center justify-center min-h-screen bg-linear-to-br from-blue-200 to-purple-400'>
            <div className='w-full flex justify-between items-center p-4 sm:p-6 sm:px-24 absolute top-0'>
                <img src={assets.logo} onClick={() => navigate('/')} className='w-28 sm:w-32 cursor-pointer hover:scale-110 transition-all'/>
            </div>
            <div className='flex flex-col items-center mt-20 px-4 text-center bg-slate-900 p-10 rounded-lg shadow-lg w-[80%] sm:w-96 text-indigo-300 text-sm'>
                    <h1 className='text-3xl text-center font-semibold text-white mb-5'>Login</h1>
            </div>
        </div>
    )
}

export default Login