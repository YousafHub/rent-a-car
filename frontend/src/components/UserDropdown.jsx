import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "../components/ui/dropdown-menu"
import { Avatar, AvatarImage } from "../components/ui/avatar"
import { IoShirtOutline } from "react-icons/io5";
import { MdOutlineShoppingBag } from "react-icons/md";

const UserDropdown = () => {

    const user = JSON.parse(localStorage.getItem('user'))

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild className='cursor-pointer'>
                <Avatar>
                    <AvatarImage src="/user.png" />
                </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent className='me-5 w-44'>
                    <DropdownMenuLabel>
                        <p className="font-semibold">{user?.name}</p>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                        <a href='/customers/add' className="cursor-pointer"><IoShirtOutline /> New Customer</a>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                        <a href='/bookings' className="cursor-pointer"><MdOutlineShoppingBag /> Bookings</a>
                    </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default UserDropdown