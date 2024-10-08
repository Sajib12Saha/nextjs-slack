'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog"
import {useState} from 'react';
import {TrashIcon} from 'lucide-react';
import { useUpdateWorkspace } from "@/app/(features)/workspaces/api/use-update-workspaces";
import { useRemoveWorkspace } from "@/app/(features)/workspaces/api/use-remove-workspaces";
import {Input} from '@/components/ui/input';
import {Button} from '@/components/ui/button';
import {toast} from 'sonner'
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import {useRouter} from 'next/navigation';
import { useConfirm } from "@/hooks/use-confirm";


interface Props{
    open: boolean;
    setOpen:(open:boolean) =>void;
    intialValues: string;
}

export const PreferancesModel = ({open, setOpen, intialValues}:Props) => {

 
  const [name, setName] = useState(intialValues);
  const [editOpen, setEditOpen] = useState(false);
  const router = useRouter()
  const [ConfirmDialog, confirm] = useConfirm(
    "Are you sure?",
    "This action is irreversible",
  )

  const {mutate:updatedWorkspace, isPending:isUpdatingWorkspace} = useUpdateWorkspace();
  const {mutate:removeWorkspace, isPending:isRemovingWorkspace} = useRemoveWorkspace();
  const workspaceId = useWorkspaceId();

  const handleEdit = (e:React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      updatedWorkspace({
        id: workspaceId,
        name: name,
      }, {
        onSuccess: () => {
          toast.success("Workspace updated")
          setEditOpen(false)
        },
        onError: () => {
          toast.error("Failed to update workspace")
        }
      })
      
  }

  const handleRemove = async() => {

    const ok = await confirm()
    if(!ok) return;

    removeWorkspace({
      id:workspaceId
    }, {
      onSuccess: () => {
          toast.success("Workspace remove")
          setEditOpen(false)
          router.replace("/")
      },
      onError: () => {
        toast.error("Failed to remove workspace")

      }

    })
  }

    return (
      <>
      <ConfirmDialog/>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bg-gray-50 p-0 overflow-hidden rounded-md">
          <DialogHeader className="p-4 border-b bg-white">
            <DialogTitle>
            {name}
            </DialogTitle>
          </DialogHeader>
          <div className="px-4 pb-4 flex flex-col gap-y-2">
           
             
              <div className="px-5 py-4 bg-white rounded-lg border cursor-pointer hover:bg-gray-50">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold">
                Workspace name

              </p>
              <Dialog open={editOpen} onOpenChange={setEditOpen}>
              <DialogTrigger asChild>
              <p className="text-sm text-[#1264a3] hover:underline font-semibold">
                Edit
              </p>

              </DialogTrigger>
              <DialogContent className="bg-slate-100 rounded-md">
                <DialogHeader>
                <DialogTitle>
                Rename this workspace
            </DialogTitle>
                </DialogHeader>

                <form className="space-y-4" onSubmit={handleEdit}> 
                  <Input value={name} disabled={isUpdatingWorkspace} onChange={(e)=> setName(e.target.value)} required autoFocus minLength={3} maxLength={80} placeholder="Workspace name e.g. 'Work', 'Personal', 'Home' "/>

                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline" disabled={isUpdatingWorkspace}>Cancel</Button>

                    </DialogClose>
                    <Button disabled={isUpdatingWorkspace} type="submit">Save</Button>
                  </DialogFooter>

                </form>
             
              </DialogContent>

              </Dialog>

             </div>
            <p className="text-sm">
              {name}
            </p>
            </div>
            
             <button disabled={isRemovingWorkspace} onClick={handleRemove} className="flex items-center gap-x-2 px-5 py-4 bg-white rounded-lg border cursor-pointer hover:bg-gray-50 text-rose-600">
              <TrashIcon className="size-4"/>
              <p className="text-sm font-semibold">
                Delete workspace
              </p>

            </button>

          </div>
        </DialogContent>

      </Dialog>
      </>
    )
}  