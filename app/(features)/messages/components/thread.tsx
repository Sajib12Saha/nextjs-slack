import { Id } from "@/convex/_generated/dataModel";
import {Button} from '@/components/ui/button';
import{XIcon, Loader, AlertTriangle} from 'lucide-react';
import { useGetMessage } from "../api/use-get-message";
import { Message } from "@/components/message";
import { useCurrentMember } from "../../members/api/use-current-member";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { useState, useRef } from "react";
import Quill from 'quill';
import dynamic from 'next/dynamic'
import { useCreateMessage } from "../api/use-create-message";
import { useGeneratUploadUrl } from "../../upload/api/use-generate-upload-url";
import {useChannelId} from '@/hooks/use-channel-id'
import {toast} from 'sonner'; 
import { useGetMessages } from "../api/use-get-messages";
import {format, isToday, isYesterday, differenceInMinutes} from 'date-fns';

const Editor = dynamic(() => import("@/components/editor"), {ssr: false})

const TIME_THRESHOLD = 5;

interface Props {
    messageId: Id<"messages">;
    onClose: () => void;
}

type CreateMessageValue ={
    channelId: Id<"channels">;
    workspaceId: Id<"workspaces">;
    parentMessageId: Id<"messages">;
    body:string;
    image?: Id<"_storage"> | undefined;
}

const formatDateLabel = (dataStr: string) => {
    const date = new Date(dataStr);
    if(isToday(date)) return "Today";
    if(isYesterday(date)) return "Yesterday";
    return format(date, "EEEE, MMMM d");
}


export const Thread = ({messageId, onClose}:Props) => {
    const workspaceId = useWorkspaceId()
    const channelId = useChannelId();
    const {data: currentMember} = useCurrentMember({workspaceId})
    const [editingId, setEditingId] = useState<Id<"messages"> | null>(null)
    const [isPending, setIsPending] = useState(false);
    const [editorKey, setEditorKey] = useState(0)
    const editorRef = useRef<Quill | null>(null);
    const {mutate:createMessage} = useCreateMessage();
    const {mutate:generateUploadUrl} = useGeneratUploadUrl()
    
    const {data:message, isLoading:loadMessage} = useGetMessage({id:messageId})
    const {results, status, loadMore} = useGetMessages({
        channelId,
        parentMessageId:messageId,
    })
    const canLoadMore = status === "CanLoadMore";
    const isLoadinMore = status === "LoadingMore";

    
    const  handleSubmit = async({body, image}: {body:string; image:File | null}) => {
        try{
         setIsPending(true);
         editorRef?.current?.enable(false)
         const values:CreateMessageValue={
         channelId, 
         workspaceId,
         body,
         parentMessageId:messageId, 
         image:undefined,
             
         }
         if(image){
             const url = await generateUploadUrl({}, {throwError:true})
 
             if(!url){
                 throw new Error("Url not found");
             }
 
             const result = await fetch(url, {
                 method: "POST",
                 headers: {"Content-Type": image.type},
                 body: image,
             });
 
             if(!result.ok){
                 throw new Error("Failed to upload image")
             }
 
             const {storageId} = await result.json()
             values.image = storageId
         }
         await createMessage(values, {throwError: true});
         
         setEditorKey((prevKey)=> prevKey+1)
        } catch(error) {
             toast.error("Failed to send message")
        } finally{
             setIsPending(false)
             editorRef?.current?.enable(false)
        }
       
 
     }


     const groupMessages = results?.reduce(
        (groups, message) => {
            const date = new Date(message._creationTime);
            const dateKey= format(date, "yyyy-MM-dd");
            if(!groups[dateKey]){
                groups[dateKey] = [];
            }
            groups[dateKey].unshift(message);
            return groups;

        }, {} as Record<string, typeof results>
        )

    if(loadMessage || status=== "LoadingFirstPage"){
        return (
            <div className="h-full flex flex-col">
            <div className="flex h-[49px] justify-between px-4 border-b">
                <p className="text-lg font-bold">
                    Thread
                </p>
                <Button variant="ghost" size="iconSm" onClick={onClose}>
                    <XIcon className="size-5 stroke-[1.5]"/>
                </Button>

            </div>
            <div className="flex h-full gap-x-2 justify-center items-center">
            <Loader className="size-5 text-muted-foreground animate-spin"/>
           
         </div>
        </div>
        )
    }

    if(!message){

        
    return (
        <div className="h-full flex flex-col">
            <div className="flex h-[49px] justify-between px-4 border-b">
                <p className="text-lg font-bold">
                    Thread
                </p>
                <Button variant="ghost" size="iconSm" onClick={onClose}>
                    <XIcon className="size-5 stroke-[1.5]"/>
                </Button>

            </div>
            <div className="flex h-full gap-x-2 justify-center items-center">
            <AlertTriangle className="size-5 text-rose-900"/>
            <p className="text-sm text-muted-foreground">Message not found</p>
         </div>
        </div>
    ) 
    }

    return (
        <div className="h-full flex flex-col">
            <div className="flex h-[49px] justify-between px-4 border-b">
                <p className="text-lg font-bold">
                    Thread
                </p>
                <Button variant="ghost" size="iconSm" onClick={onClose}>
                    <XIcon className="size-5 stroke-[1.5]"/>
                </Button>
               </div>
               <div className="flex flex-1 flex-col-reverse pb-4 overflow-y-auto messages-scrollbar">

                   {Object.entries(groupMessages || {}).map(([dateKey, messages])=> (
             <div key={dateKey}>
                <div className="text-center my-2 relative">
                    <hr className="absolute top-1/2 left-0 right-0 border-t border-gray-300"/>
                    <span className="relative inline-block bg-white px-4 py-1 rounded-full text-xs border border-gray-300 shadow-sm">
                        {formatDateLabel(dateKey)}
                    </span>

                </div>
                {messages.map((message, index)=> {

                    const prevMessage = messages[index -1]
                    const isCompact = prevMessage && prevMessage.user?._id === message.user?._id
                    && differenceInMinutes(
                        new Date(message._creationTime),
                        new Date(prevMessage._creationTime)
                    ) < TIME_THRESHOLD;

                    return (
                       <Message key={message._id}
                        id={message._id} 
                        memberId={message.memberId} 
                        authorImage={message.user.image}
                        authorName={message.user.name}
                        isAuthor={message.memberId === currentMember?._id}
                        reactions={message.reactions} 
                        body={message.body} 
                        image={message.image}
                        updatedAt={message.updatedAt}
                        createdAt={message._creationTime} 
                        threadCount={message.threadCount} 
                        threadName={message.threadName}
                        threadImage={message.threadImage} 
                        threadTimestamp={message.threadTimestamp}
                        isEditing={editingId === message._id}
                        setEditingId={setEditingId}
                        isCompact={isCompact}
                        hideThreadButton/>
                    )
                })}

            </div>
         ))}

         <Message hideThreadButton
                memberId={message.memberId}
                authorName={message.user.name}
                authorImage={message.user.image}
                isAuthor={message.memberId === currentMember?._id}
                image={message.image}
                createdAt={message._creationTime}
                updatedAt={message.updatedAt}
                id={message._id}
                reactions={message.reactions}
                isEditing={editingId === message._id}
                setEditingId={setEditingId} body={message.body}
         />

               </div>
               <div className="px-4">
                <Editor onSubmit={handleSubmit}
                    placeholder="Reply"
                    key={editorKey}
                    disabled={isPending}
                    innerRef={editorRef}
            />
                           
             </div>
                
              
        </div>
    ) 
}