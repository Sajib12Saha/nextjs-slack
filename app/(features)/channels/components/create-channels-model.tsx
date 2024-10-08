'use client'

import { Dialog, DialogContent, DialogTitle, DialogHeader } from "@/components/ui/dialog"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

import {useState} from 'react';
import {useRouter} from 'next/navigation'
import { toast } from "sonner"
import { useCreateChannelModel } from "../store/use-create-channel-model"
import { useCreateChannel } from "../api/use-create-channel";
import { useWorkspaceId } from "@/hooks/use-workspace-id"

export const CreateChannelsModel = () => {

    const [name, setName] = useState('');
    const router = useRouter()
    const workspaceId = useWorkspaceId();

    const {isOpen, onClose} = useCreateChannelModel()

    const {mutate:createChannel, isPending:channelPending} = useCreateChannel()

    const onChange = (open:boolean) => {
        if(!open ){
            setName("")
            return onClose()

        
    }
}

    const handleSubmit = async(e:React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        createChannel({
            name, workspaceId 
        }, {
            onSuccess:(id) => {
                toast.success(`channel create successfully`);
                router.push(`/workspace/${workspaceId}/channel/${id}`)
                onClose()
                setName("")
            }, 
            onError(error) {
                
                toast.error("Failed to create channel")
            },
        })

      
   
    }


    return (
        <Dialog open={isOpen} onOpenChange={onChange}>
            <DialogContent className="bg-slate-100 rounded-md">
                <DialogHeader>
                    <DialogTitle>
                        Add a channels
                        </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input value={name} disabled={channelPending} required autoFocus minLength={3} placeholder="e.g. plane-budget " onChange={(e)=>setName(e.target.value.replace(/\s+/g, "-").toLowerCase()) }/>
                    <div className="flex justify-end">
                        <Button type="submit" disabled={channelPending}>
                            Create
                        </Button>

                    </div>
                </form>
            </DialogContent>

        </Dialog>
    )
}