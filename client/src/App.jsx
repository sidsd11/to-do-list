import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Header from './components/Header'
import Home from './pages/Home'
import Login from './pages/Login'
import EmailVerify from './pages/EmailVerify'
import ResetPassword from './pages/ResetPassword'
import MyTasks from './pages/MyTasks'

const App = () => {
    return (
        <div>
            <ToastContainer />
            <Routes>
                <Route path='/' element={<Home />} />
                <Route path='/home' element={<Home />} />
                <Route path='/login' element={<Login />} />
                <Route path='/email-verify' element={<EmailVerify />} />
                <Route path='/reset-password' element={<ResetPassword />} />
                <Route path='/my-tasks' element={<MyTasks />} />
            </Routes>
        </div>
    )
}

export default App
