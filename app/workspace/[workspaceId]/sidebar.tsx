import { UserButton } from "@/app/(features)/auth/_components/user-button"
import { WorkspaceSwitcher } from "./workspace-switcher"
import { SidebarButton } from "./sidebar-button"
import {Home, Bell, MoreHorizontal, MessagesSquare} from 'lucide-react';
import { usePathname } from "next/navigation";

export const Sidebar = () => {

    const pathname = usePathname()

    return (
        <aside className="w-[80px] h-full bg-[#481349] flex flex-col gap-y-4 items-center pt-[9px] pb-4">
      <WorkspaceSwitcher/>

      <SidebarButton icon={Home} label="Home" isActive={pathname.includes("/workspace")}/>
        
      <SidebarButton icon={MessagesSquare} label="DMs" />
      <SidebarButton icon={Bell} label="Activity" />
      <SidebarButton icon={ MoreHorizontal} label="More" />
     

        <div className="flex flex-col items-center justify-center gap-y-1 mt-auto">
            <UserButton/>
        </div>
        </aside>
    )
}