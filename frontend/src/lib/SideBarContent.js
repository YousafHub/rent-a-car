import { AiOutlineDashboard } from "react-icons/ai";
import { FaAddressBook } from "react-icons/fa";
import { IoIosPerson } from "react-icons/io";
import { RiCoupon2Line } from "react-icons/ri";
import { FaCarSide } from "react-icons/fa";

export const SidebarContentMenu = [
    {
        title: "Dashboard",
        url: "/dashboard",
        icon: AiOutlineDashboard
    },
    {
        title: "Customers",
        url: '#',
        icon: IoIosPerson,
        subMenu: [
            {
                title: "Add Customer",
                url: "/customers/add"
            },
            {
                title: "All Customers",
                url: "/customers"
            },
        ]
    },
    {
        title: "Vehicles",
        url: '#',
        icon: FaCarSide,
        subMenu: [
            {
                title: "Add Vehicle",
                url: "/vehicles/add"
            },
            {
                title: "All Vehicles",
                url: "/vehicles"
            },
        ]
    },
    {
        title: "Bookings",
        url: '#',
        icon: FaAddressBook,
        subMenu: [
            {
                title: "Add Booking",
                url: "/bookings/add"
            },
            {
                title: "All Bookings",
                url: "/bookings"
            },
        ]
    },
]