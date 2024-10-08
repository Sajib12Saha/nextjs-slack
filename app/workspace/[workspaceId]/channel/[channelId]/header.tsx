import {Button} from '@/components/ui/button';
import {FaChevronDown} from 'react-icons/fa';
import { Dialog, DialogContent, DialogTitle, DialogHeader, DialogTrigger, DialogFooter,  DialogClose} from "@/components/ui/dialog";
import {TrashIcon} from 'lucide-react'
import { useState } from 'react';
import {Input} from "@/components/ui/input"
import {toast} from 'sonner';
import { useChannelId } from "@/hooks/use-channel-id";
import {useUpdateChannel } from "@/app/(features)/channels/api/use-update-channel";
import {useRemoveChannel } from "@/app/(features)/channels/api/use-remove-channel";
import {useRouter} from 'next/navigation';
import { useWorkspaceId } from '@/hooks/use-workspace-id';
import { useConfirm } from '@/hooks/use-confirm';
import { useCurrentMember } from '@/app/(features)/members/api/use-current-member';

interface Props {
    title:string;
}

export const Header = ({title}: Props) => {

    const router = useRouter();
    const channelId = useChannelId();
    const workspaceId = useWorkspaceId();
    const {data:member} = useCurrentMember({workspaceId});
    const [editOpen, setEditOpen] = useState(false);
    const [name, setName] = useState(title);
    const {mutate:updateChannel, isPending:updatingChannel} = useUpdateChannel();
    const {mutate:removeChannel, isPending:removingChannel} = useRemoveChannel();
    const [ConfirmDialog, confirm]= useConfirm("Delete this channel?", "You are about to delete this channel.This action is irreverible");

    const handleEditOpen = (value:boolean) => {
        if(member?.role !== "admin")return;
        setEditOpen(value)       
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        updateChannel(
            {id:channelId, name:name},
        {
            onSuccess: () => {
                toast.success("Channel updated");
                setEditOpen(false);
                
            }, 
            onError: () => {
                toast.error("Failed to updated channel")
            }
        }
        )
    }
    const handleDelete = async() =>{

        const ok = await confirm();
        if(!ok) return;
        removeChannel({id:channelId},{
            onSuccess: () => {
                toast.success(`Channel deleted`)
                router.replace(`/workspace/${workspaceId}`)
            },
            onError: () => {
                    toast.error("Failed to delete channel")
            }
        },

        )
    }

    return (
        <div className="bg-white border-b h-[49px] flex items-center px-4 overflow-hidden">
            <ConfirmDialog/>
            <Dialog>
            <DialogTrigger asChild>
           <Button variant="ghost" className="text-lg font-semibold px-2 overflow-hidden w-auto" size="sm">
            <span className="truncate">#{title}</span>
            <FaChevronDown className="ml-2 size-2.5"/>
           </Button>
           </DialogTrigger>
           <DialogContent className="p-0 bg-gray-50 overflow overflow-hidden rounded-md">
            <DialogHeader className="p-4 border-b bg-white">
                <DialogTitle>
                    #{title}
                </DialogTitle>
            </DialogHeader>
            <div className="px-4 pb-4 flex flex-col gap-y-2">

                <Dialog open={editOpen} onOpenChange={handleEditOpen}>
                    <DialogTrigger asChild>

                    <div className="px-5 py-4 bg-white rounded-lg border cursor-pointer hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                        <p className="text-sm font-semibold">Channel name</p>
                        {member?.role === "admin" && (
                               <p className="text-sm text-[#1264a3] hover:underline font-semibold">Edit</p>
                        )}
                     

                    </div>
                    <p className="text-sm">#{title}</p>

                </div>
                    </DialogTrigger>

              <DialogContent 
              className="bg-gray-50">
                <DialogHeader>
                <DialogTitle>Rename this Channel</DialogTitle>
                </DialogHeader>
             <form className="space-y-4" onSubmit={handleSubmit}>
                <Input value={name} disabled={updatingChannel} onChange={(e)=> {
                    setName(e.target.value.replace(/\s+/g, "-").toLowerCase())
                }} minLength={3} maxLength={80} placeholder="e.g plane-budget"/>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant={"outline"} disabled={updatingChannel}>Cancel</Button>
                        </DialogClose>
                        <Button disabled={updatingChannel}>Save</Button>
                </DialogFooter>
             </form>
              </DialogContent>

                </Dialog>
                {member?.role === "admin" &&(
                           <button className="flex items-center gap-x-2 px-5 py-4 bg-white rounded-lg cursor-pointer border hover:bg-gray-50  text-rose-600" onClick={handleDelete}>
                           <TrashIcon className="size-4"/>
                           <p className="text-sm font-semibold">Delete Channel</p>
                           </button>
                )}
                 

            </div>
           </DialogContent>

           </Dialog>
        </div>
    )
} 