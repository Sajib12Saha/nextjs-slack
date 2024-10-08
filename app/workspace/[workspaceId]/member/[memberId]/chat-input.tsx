
import { useCreateMessage } from '@/app/(features)/messages/api/use-create-message';
import { useGeneratUploadUrl } from '@/app/(features)/upload/api/use-generate-upload-url';
import { Id } from '@/convex/_generated/dataModel';
import { useWorkspaceId } from '@/hooks/use-workspace-id';
import dynamic from 'next/dynamic'
import Quill from 'quill';
import { useRef, useState } from 'react';
import {toast} from 'sonner';

const Editor = dynamic(() => import('@/components/editor'), {ssr:false});

interface Props {
    placeholder:string;
    conversationId: Id<"conversations">;
}

type CreateMessageValue ={
    conversationId: Id<"conversations">
    workspaceId: Id<"workspaces">;
    body:string;
    image?: Id<"_storage"> | undefined;
}

export const ChatInput = ({placeholder, conversationId}:Props) => {

    const [isPending, setIsPending] = useState(false);
    const [editorKey, setEditorKey] = useState(0)
    const workspaceId = useWorkspaceId();


    const editorRef = useRef<Quill | null>(null)
    const {mutate:createMessage} = useCreateMessage();
    const {mutate:generateUploadUrl} = useGeneratUploadUrl()
    
 
    const  handleSubmit = async({body, image}: {body:string; image:File | null}) => {
       try{
        setIsPending(true);
        editorRef?.current?.enable(false)
        const values:CreateMessageValue={
        conversationId,
        workspaceId,
        body, 
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


    return (
        <div className="px-6 w-full ">
            <Editor placeholder={placeholder} onSubmit={handleSubmit} disabled={isPending} innerRef={editorRef} key={editorKey}/>
        </div>
    )
}