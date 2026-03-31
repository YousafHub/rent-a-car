import axios from 'axios'
import { IoIosLogOut } from "react-icons/io";
import { showToast } from '../lib/showToasts'
import { useNavigate } from 'react-router-dom'
import { Button } from './ui/button'

const LogoutButton = () => {

    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
    const navigate = useNavigate()

    const handleLogout = async () => {
        try {
            const { data: logoutResponse } = await axios.post(`${BACKEND_URL}/auth/logout`, {}, { withCredentials: true })
            if (!logoutResponse.success) {
                throw new Error(logoutResponse.message)
            }
            localStorage.removeItem('user')
            showToast('success', logoutResponse.message)
            navigate('/')
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Logout failed';
            showToast('error', errorMessage)
        }
    }

    return (
        <Button onClick={handleLogout} variant='secondary' className='bg-none cursor-pointer'>
            <IoIosLogOut />
        </Button>
    )
}

export default LogoutButton