'use client'

import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { useMemberId } from "@/hooks/use-member-id";
import { useCreateOrGetConversation } from "@/app/(features)/conversations/api/use-create-or-get-conversation";
import { useEffect, useState } from "react";
import { Loader, AlertTriangle } from "lucide-react";
import{toast} from 'sonner';
import {Conversation} from './conversation'
import { Id } from "@/convex/_generated/dataModel";

const MemberId = () => {

    const memberId = useMemberId()
    const workspaceId = useWorkspaceId();
    const [conversationId, setConversationId] = useState<Id<"conversations"> |null>(null);

    const {mutate, data, isPending} = useCreateOrGetConversation()

    
    useEffect(()=> {
        mutate({
            workspaceId,
            memberId,
        },{
            onSuccess: (data) => {
                    setConversationId(data)
            },
            onError: (error)=> {
                toast.error("Failed to get or create conversation");
            }
        } 
    )
    }, [workspaceId, memberId, mutate])
    if (isPending) {
        return (
            <div className="flex h-full gap-x-2 justify-center items-center">
            <Loader className="size-5 text-muted-foreground animate-spin"/>
            </div>
        )
    }
    if(!conversationId){
    return (
         <div className="flex h-full gap-x-2 justify-center items-center">
        <AlertTriangle className="size-5 text-rose-900"/>
        <p className="text-sm text-muted-foreground">Conversation not found</p>
     </div>
     )
    }

    

    return <Conversation id={conversationId}/>
}

export default MemberId;