'use client'

import { Dialog, DialogContent, DialogTitle, DialogHeader } from "@/components/ui/dialog"
import { useWorkspaceModel } from "../store/use-create-workspace-model"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useCreateWorkspace } from "../api/use-create-workspaces"
import {useState} from 'react';
import {useRouter} from 'next/navigation'
import { toast } from "sonner"

export const CreateWorkspaceModel = () => {

    const {mutate, isPending} = useCreateWorkspace(); 
    const [name, setName] = useState('');
    const router = useRouter()

    const {isOpen, onClose} = useWorkspaceModel()

    const onChange = (open:boolean) => {
        if(!open ){
            setName("")
            return onClose()

        
    }
}



    const handleSubmit = async(e:React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        mutate({name }, {
            onSuccess(id){
            router.push(`/workspace/${id}`)
            toast.success("Workspace is created successfully")
            onClose()

            }
                })
   
    }

    return (
        <Dialog open={isOpen} onOpenChange={onChange}>
            <DialogContent className="bg-slate-100">
                <DialogHeader>
                    <DialogTitle>
                        Add a workspace
                        </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit}className="space-y-4">
                    <Input value={name} disabled={isPending} required autoFocus minLength={3} placeholder="Workspace name e.g. 'Work', 'Personal', 'Home' " onChange={(e)=> setName(e.target.value)}/>
                    <div className="flex justify-end">
                        <Button type="submit" disabled={isPending}>
                            Create
                        </Button>
 
                    </div>
                </form>
            </DialogContent>

        </Dialog>
    )
}