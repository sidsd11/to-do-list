import React from 'react'
import { assets } from '../assets/assets.js'
import { useNavigate } from 'react-router-dom'

const Login = () => {
    const navigate = useNavigate()
    return (
        <div className='min-h-screen bg-linear-to-br from-blue-200 to-purple-400 px-6 sm:px-0'>
            <div className='w-full flex justify-between items-center p-4 sm:p-6 sm:px-24 absolute top-0'>
                <img src={assets.logo} onClick={() => navigate('/')} className='w-28 sm:w-32 cursor-pointer hover:scale-110 transition-all'/>
            </div>
            <div className='flex min-h-screen items-center justify-center'>
                <div className='bg-slate-900 rounded-lg shadow-lg w-full text-sm text-indigo-300'>
                    <h1 className='text-3xl text-center font-semibold text-white mb-5'>Login</h1>
                </div>
            </div>
        </div>
    )
}

export default Login