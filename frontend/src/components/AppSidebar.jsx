import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "./ui/sidebar"
import { Button } from "./ui/button"
import { LuChevronRight } from "react-icons/lu";
import { IoMdClose } from "react-icons/io";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible"
import { SidebarContentMenu } from "../lib/SideBarContent";

const AppSidebar = () => {

    const { toggleSidebar } = useSidebar() 

  return (
    <Sidebar className='z-50'>
      <SidebarHeader className='border-b h-14 p-0'>
        <div className="flex justify-between items-center px-4 ">
            <img src="/download-2.png" className="block h-[50px] w-auto" alt="logo" />
            <Button onClick={toggleSidebar} type='button' size="icon" className='md:hidden'>
                <IoMdClose  />
            </Button>
        </div>
      </SidebarHeader>
      <SidebarContent className='p-3'>
        <SidebarMenu>
            {SidebarContentMenu.map((menu, index) => (
                <Collapsible key={index} className='group/collapsible'>
                    <SidebarMenuItem>
                        <CollapsibleTrigger asChild>
                            <SidebarMenuButton asChild className='font-semibold px-2 py-5'>
                                <a href={menu?.url}>
                                <menu.icon />
                                {menu.title}

                                {menu.subMenu && menu.subMenu.length > 0 && 
                                    <LuChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                                }
                                </a>
                            </SidebarMenuButton>
                        </CollapsibleTrigger>

                        {menu.subMenu && menu.subMenu.length > 0 && 
                            <CollapsibleContent>
                                <SidebarMenuSub>
                                    {menu.subMenu.map((subMenuItem, subMenuIndex) => (
                                        <SidebarMenuSubItem key={subMenuIndex}>
                                            <SidebarMenuSubButton asChild className='px-2 py-5'>
                                                <a href={subMenuItem.url}>
                                                    {subMenuItem.title}
                                                </a>
                                            </SidebarMenuSubButton>
                                        </SidebarMenuSubItem>
                                    ))}
                                </SidebarMenuSub>
                            </CollapsibleContent>
                        }
                    </SidebarMenuItem>
                </Collapsible>
            ))}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  )
}

export default AppSidebar