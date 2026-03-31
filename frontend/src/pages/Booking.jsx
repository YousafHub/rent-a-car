import { SidebarProvider } from '../components/ui/sidebar'
import TopBar from '../components/Topbar'
import AppSidebar from '../components/AppSidebar'
import AddBooking from '../components/AddBooking'
import EditBooking from '../components/EditBooking'
import AllBookings from '../components/AllBookings'

const Booking = () => {

  return (
    <SidebarProvider>
      <AppSidebar />
      <main className='md:w-[calc(100vw-16rem)] w-full'>
        <div className='pt-[70px] md:px-8 px-5 min-h-[calc(100vh-40px)] pb-10'>
          <TopBar />
          {window.location.pathname === '/bookings/add' ? (
            <AddBooking />
          ) : window.location.pathname.startsWith('/bookings/edit/') ? (
            <EditBooking />
          ) : (
            <AllBookings />
          )}
        </div>
        <div className='border-t h-[40px] flex justify-center items-center bg-gray-50 text-sm'>
          @ 2025 Yousaf Shahid. All rights reserved.
        </div>
      </main>
    </SidebarProvider>
  )
}

export default Booking