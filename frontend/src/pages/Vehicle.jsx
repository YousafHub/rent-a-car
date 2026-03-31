import { SidebarProvider } from '../components/ui/sidebar'
import TopBar from '../components/Topbar'
import AppSidebar from '../components/AppSidebar'
import AddVehicle from '../components/AddVehicle'
import AllVehicles from '../components/AllVehicles'
import EditVehicle from '../components/EditVehicle'

const Vehicle = () => {

  return (
    <SidebarProvider>
      <AppSidebar />
      <main className='md:w-[calc(100vw-16rem)] w-full'>
        <div className='pt-[70px] md:px-8 px-5 min-h-[calc(100vh-40px)] pb-10'>
          <TopBar />
          {window.location.pathname === '/vehicles/add' ? (
            <AddVehicle />
          ) : window.location.pathname.startsWith('/vehicles/edit/') ? (
            <EditVehicle />
          ) : (
            <AllVehicles />
          )}
        </div>
        <div className='border-t h-[40px] flex justify-center items-center bg-gray-50 text-sm'>
          @ 2025 Yousaf Shahid. All rights reserved.
        </div>
      </main>
    </SidebarProvider>
  )
}

export default Vehicle