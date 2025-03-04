import { Button } from '@/components/ui/button';
import {Dialog, DialogContent, DialogHeader,DialogTitle, DialogDescription, DialogClose} from '@/components/ui/dialog'
import {CopyIcon, RefreshCcw } from 'lucide-react';
import { useWorkspaceId } from "@/hooks/use-workspace-id"
import {toast} from 'sonner';
import { useNewJoinCode } from '@/app/(features)/workspaces/api/use-new-joincode';
import { useConfirm } from '@/hooks/use-confirm';


interface Props {
    open: boolean;
    setOpen: (open:boolean) => void;
    name: string;
    joinCode:string;
}

export const InviteModel = ({open, setOpen, name, joinCode}:Props) => {

    const [ConfirmDialog, confirm] = useConfirm(
        "Are you sure ?",
        "This is will deactive the current invite code and generate a new one"
    );
    const workspaceId = useWorkspaceId();
    const {mutate, isPending} = useNewJoinCode()


    const handleNewCode = async() => {
        const ok = await confirm();

        if(!ok) return;

        mutate({workspaceId},{
            onSuccess: () => {
                toast.success("Invite code regenerated")
            }, 
            onError: () => {
                toast.error("Failed to regenerate invite code")
            }
        })
    }

    const handleCopy= () => {

        const inviteLink = `${window.location.origin}/join/${workspaceId}`
        navigator.clipboard.writeText(inviteLink).then(()=> toast.success("Invite link copied to clipboard"))
    }
 
    return (
        <>
      <ConfirmDialog/>
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="bg-slate-100 rounded-md">
                <DialogHeader>
                    <DialogTitle>
                        Invite people to {name}
                    </DialogTitle>
                    <DialogDescription>
                Use the code below to invite people to your workspace
                    </DialogDescription>
                </DialogHeader>
                <div className="flex flex-col gap-y-4 items-center justify-center py-10 ">
                    <p className="text-4xl font-bold tracking-widest uppercase">
                    {joinCode} 
                    </p>
                  <Button variant="ghost" size="sm" onClick={handleCopy}>
                    Copy link
                    <CopyIcon className="size-4 ml-2"/>
                  </Button>

                </div>
                <div className="flex items-center justify-between w-full">
             <DialogClose asChild>                 
                <Button>
                            Close
                        </Button>
                    </DialogClose>
                    <Button onClick={handleNewCode} disabled={isPending} variant="outline">
                        New code 
                    <RefreshCcw className="size-4 ml-2"/>
                    </Button>
                    
                </div>
            </DialogContent>

        </Dialog>

    </>
    )
}