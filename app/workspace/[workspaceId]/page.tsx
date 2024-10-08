'use client'

import { useGetChannels } from '@/app/(features)/channels/api/use-get-channels';
import { useCreateChannelModel } from '@/app/(features)/channels/store/use-create-channel-model';
import { useGetWorkspace } from '@/app/(features)/workspaces/api/use-get-workspace';
import { useWorkspaceId } from '@/hooks/use-workspace-id';
import {useRouter} from 'next/navigation';
import {useMemo, useEffect} from 'react';
import {Loader, TriangleAlert} from 'lucide-react';
import { useCurrentMember } from '@/app/(features)/members/api/use-current-member';

    const WorkspaceIdPage = () => {

    const router = useRouter();
    const workspaceId = useWorkspaceId();
    const {isOpen, onOpen} = useCreateChannelModel();

    const {data:member, isLoading:memberLoading} = useCurrentMember({workspaceId})

    const {data:workspace, isLoading:workspaceLoading} = useGetWorkspace({id:workspaceId })

    const {data: channels, isLoading:channelsLoading} = useGetChannels({
    workspaceId,
})  
    const channelId = useMemo(() => channels?.[0]?._id, [channels])
    const isAdmin = useMemo(()=> member?.role === "admin", [member?.role]);

    useEffect(()=> {
        if(workspaceLoading || channelsLoading || memberLoading || !member|| !workspace) return;

        if(channelId){
            router.push(`/workspace/${workspaceId}/channel/${channelId}`)

        } else if(!isOpen && isAdmin){
            onOpen();

        }
    },[
         channelId, 
        workspaceLoading,
        channelsLoading,
        memberLoading,
        workspace,
        member,
        isOpen, 
        onOpen,
        isAdmin,
        router, workspaceId
    ])

    if(workspaceLoading || channelsLoading || memberLoading){
        return (
            <div className="h-full flex items-center justify-center flex-col gap-x-2">
                <Loader className="animate-spin size-6 text-muted-foreground"/>
            </div>
        )
    }

    if(!workspace || !member){
        return(
        <div className="h-full flex items-center justify-center flex-col gap-x-2">
        <TriangleAlert className="size-6 text-rose-900 ml-2"/>
        <span className="text-sm text-muted-foreground">Workspace not found</span>
    </div>
        )
    }

  return (
    <div className="h-full flex items-center justify-center gap-x-2">
    <TriangleAlert className="size-6 text-rose-900 ml-2"/>
    <span className="text-sm text-muted-foreground">No Channel found</span>
</div>
    )
};

export default WorkspaceIdPage;