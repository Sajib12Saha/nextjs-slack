import { useGetWorkspace } from "@/app/(features)/workspaces/api/use-get-workspace";
import { useGetWorkspaces } from "@/app/(features)/workspaces/api/use-get-workspaces";
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { useWorkspaceModel } from './../../(features)/workspaces/store/use-create-workspace-model';
import { Loader, Plus } from "lucide-react";
import {useRouter} from 'next/navigation';

export const WorkspaceSwitcher = () => {

    const router = useRouter()
    const workspaceId = useWorkspaceId();

    const {data: workspace, isLoading: workspaceLoading} = useGetWorkspace({id: workspaceId})

    const {data:workspaces, isLoading: workspacesLoading} = useGetWorkspaces()
    const {onOpen} = useWorkspaceModel()

    const filterWorkspaces = workspaces?.filter((workspace)=> workspace?._id !== workspaceId)

    return (
        <DropdownMenu>
           <DropdownMenuTrigger asChild >
          <Button className="size-9  overflow-hidden bg-[#ABABAD] hover:bg-[#ABABAD]/80 text-slate-800 text-semibold text-xl">
            {workspaceLoading ? (
                <Loader className="size-5 animate-spin shrink-0"/>
            ) :
            
           workspace?.name.charAt(0).toUpperCase()
                 
                }
            </Button>
        

    
           </DropdownMenuTrigger>
           <DropdownMenuContent side="bottom" align="start" className="w-64">
            <DropdownMenuItem onClick={()=> router.push(`/workspace/${workspaceId}`)} className="cursor-pointer flex-col justify-start items-start capitalize">
             
               {workspace?.name}
             
       
            
                <span className="text-xs text-muted-foreground relative">
                    Active Workspace
                    <div className="absolute bg-green-500 size-2 rounded-full top-1.5 left-[100px]"/>
                </span>
            </DropdownMenuItem>

     {filterWorkspaces?.map((workspace)=> (   
         <DropdownMenuItem key={workspace._id} className="cursor-pointer capitalize" onClick={()=> router.push(`/workspace/${workspace._id}`)}>
             <div className="size-9 relative overflow-hidden bg-[#616061] text-slate-100 font-semibold text-lg rounded-md flex items-center justify-center mr-2 shrink-0">
                {workspace.name.charAt(0).toUpperCase()}
            </div>
            <p className="truncate">
            {workspace.name}
            </p>
    
            

     </DropdownMenuItem>
                          
                ))}
                <DropdownMenuItem className="cursor-pointer"
                onClick={()=> onOpen()}
                >
                <div className="size-9 relative overflow-hidden bg-slate-100 text-slate-800 font-semibold text-lg rounded-md flex items-center justify-center mr-2">
                    <Plus className="size-5"/>
                </div>
                Create a new workspace
                </DropdownMenuItem>
                

           </DropdownMenuContent>
        </DropdownMenu>
    )
}