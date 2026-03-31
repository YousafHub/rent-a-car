import UserDropdown from './UserDropdown'
import { RiMenuFill } from 'react-icons/ri'
import { Button } from './ui/button'
import { useSidebar } from './ui/sidebar'
import LogoutButton from './LogoutButton'

const TopBar = () => {

    const { toggleSidebar } = useSidebar()

    return (
        <div className='fixed border h-14 w-full top-0 left-0 z-30 md:ps-72 md:pe-8 px-5 flex justify-between items-center bg-white'>
            <div className='flex items-center md:hidden'>
                <img src="/download-2.png" className="block h-12 w-12 w-auto" alt="logo" />
            </div>
            <div className='flex items-end gap-2'>
                <UserDropdown />
                <Button onClick={toggleSidebar} type='button' size='icon' className='ms-2 md:hidden'>
                    <RiMenuFill />
                </Button>
            </div>
                <LogoutButton />
        </div>
    )
}

export default TopBar