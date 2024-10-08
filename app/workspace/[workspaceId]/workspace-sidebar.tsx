import { useCurrentMember } from "@/app/(features)/members/api/use-current-member";
import { useGetWorkspace } from "@/app/(features)/workspaces/api/use-get-workspace";
import { useWorkspaceId } from "@/hooks/use-workspace-id"
import { Loader, AlertTriangle, MessageSquareText, SendHorizontal, HashIcon } from "lucide-react";
import { WorkspaceHeader } from "./workspace-header";
import { WorkspaceSidebarItem } from "./workspace-sidebar-item";
import { useGetChannels } from "@/app/(features)/channels/api/use-get-channels";
import { useGetMembers } from "@/app/(features)/members/api/use-get-members";
import { WorkspaceSection } from "./workspace-section";
import { UserItem } from "./user-item";
import { useCreateChannelModel } from "@/app/(features)/channels/store/use-create-channel-model";
import { useChannelId } from "@/hooks/use-channel-id";
import{useMemberId} from '@/hooks/use-member-id';

export const WorkspaceSidebar = () => {

    const workspaceId = useWorkspaceId();
    const {isOpen, onOpen} = useCreateChannelModel();
    const channelId = useChannelId();
    const memberId= useMemberId()

    const {data: member, isLoading: memberLoading} = useCurrentMember({workspaceId});
    const {data: workspace, isLoading: workspaceLoading} = useGetWorkspace({id:workspaceId});
     const {data:channels, isLoading:channelsIsLoading} = useGetChannels({workspaceId});
     const {data:members, isLoading:membersLoading} = useGetMembers({workspaceId})

    if(workspaceLoading || memberLoading){
            return (
                <div className="flex flex-col bg-[#SE2C5F] h-full items-center justify-center">

                    <Loader className="size-5 animate-spin text-white"/>

                </div>
            )
    }

    
    if(!workspace || !member){
        return (
            <div className="flex flex-col bg-[#SE2C5F] h-full gap-y-2 items-center justify-center">

                <AlertTriangle className="size-5  text-white"/>
                <p className="text-white text-sm">
                    Workspace not found
                </p>

            </div>
        )
}

    return (
        <div className="flex flex-col bg-[#SE2C5F] h-full">
           <WorkspaceHeader workspace={workspace} isAdmin={member.role === "admin"}/>
           <div className="flex flex-col px-2 mt-3">
            <WorkspaceSidebarItem label="Threads" icon={MessageSquareText} id="threads"/>
            <WorkspaceSidebarItem label="Draft & Sent" icon={SendHorizontal} id="threads" />

            </div>
            <WorkspaceSection label="Channels" hint="New channel" onNew= {member.role === "admin" ? ()=> onOpen() : undefined }>

            {channels?.map((item)=> (

            <WorkspaceSidebarItem key={item._id} icon={HashIcon} label={item.name} id={item._id} variant={channelId === item._id ? "active" : "default"}/>
                ))}
            </WorkspaceSection>


            <WorkspaceSection label="Direct Messages" hint="New direct message" onNew= {()=> {}}>

            {members?.map((item)=> (
                 <UserItem id={item._id} label={item.user.name} key={item._id} image={item.user.image} 
                 variant={item._id === memberId ? "active" : "default"}/>
            ))}

            </WorkspaceSection>
         
       
        </div>
    )
}