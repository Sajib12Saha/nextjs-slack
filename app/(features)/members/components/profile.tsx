import { Id } from "@/convex/_generated/dataModel";
import {XIcon, Loader, AlertTriangle, MailIcon, ChevronDownIcon } from 'lucide-react';
import {Button} from '@/components/ui/button';
import { useGetMember } from "../api/use-get-member";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { DropdownMenu,DropdownMenuTrigger,DropdownMenuContent, DropdownMenuRadioItem, DropdownMenuRadioGroup} from "@/components/ui/dropdown-menu";
import Link from 'next/link';
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { useUpdateMember } from "../api/use-update-member";
import { useRemoveMember } from "../api/use-remove-member";
import { useCurrentMember } from "../api/use-current-member";
import {toast} from 'sonner';
import { useConfirm } from "@/hooks/use-confirm";
import {useRouter} from 'next/navigation';

interface Props{
    memberId : Id<"members">;
    onClose: () => void;
}
export const Profile = ({memberId, onClose}:Props) => {


    const router = useRouter();
    const workspaceId = useWorkspaceId();

    const [UpdateDialog, confirmUpdate] = useConfirm(
        "Change role",
        "Are you sure you want to chnage this member's role ?"
    );
    const [LeaveDialog, confirmLeave] =
     useConfirm(
        "Leave workspace", 
        "Are you sure you want to leave this workspace?"
    );
    const [RemoveDialog, confirmRemove] = useConfirm(
         "Remove member", 
        "Are you sure you want to remove this member?"
    );

     const {data:currentMember, isLoading: isLoadingCurrentMember} = useCurrentMember({workspaceId:workspaceId});

    const {data: member, isLoading: isLoadingMember} = useGetMember({id: memberId });

    const {mutate: updateMember, isPending:isUpdatingMember} = useUpdateMember();
    const {mutate: removeMember, isPending:isRemovingMember} = useRemoveMember();
    
    const onRemove = async() => {

        const ok = await confirmRemove();
        if(!ok) return;
        removeMember({
            id:memberId
        }, {
            onSuccess: () => {
      
                toast.success("Member remove")
                onClose();
            },
            onError: () =>{
                toast.error("Failed to remove member")
            }
          
        }) 
    }

       
    const onLeave = async() => {

        const ok = await confirmLeave();
        if(!ok) return;

        removeMember({
            id:memberId
        }, {
            onSuccess: () => {
                router.replace("/")
                toast.success("You left the workspace")
                onClose();
            },
            onError: () =>{
                toast.error("Failed to left the workspace")
            }
          
        }) 
    }

           
    const onUpdate = async(role: "admin" | "member") => {

        const ok = await confirmUpdate();
        if(!ok) return;

        updateMember({
            id:memberId,
            role: role,
        }, {
            onSuccess: () => {
                toast.success("Role changed")
                onClose();
            },
            onError: () =>{
                toast.error("Failed to change role ")
            }
          
        }) 
    }



    if(isLoadingMember || isLoadingCurrentMember){
        return (
            <div className="h-full flex flex-col">
            <div className="flex h-[49px] justify-between px-4 border-b">
                <p className="text-lg font-bold">
                    Profile
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

    if(!member){
        return (
            <div className="h-full flex flex-col">
            <div className="flex h-[49px] justify-between px-4 border-b">
                <p className="text-lg font-bold">
                    Profile
                </p>
                <Button variant="ghost" size="iconSm" onClick={onClose}>
                    <XIcon className="size-5 stroke-[1.5]"/>
                </Button>

            </div>
            <div className="flex h-full gap-x-2 justify-center items-center">
            <AlertTriangle className="size-5 text-rose-900"/>
            <p className="text-sm text-muted-foreground">Profile not found</p>
         </div>
        </div>
        )
    }
    const avatarFallback = member.user.name?.[0].toUpperCase() ?? "M";
    return (

        <>
        <UpdateDialog/>
        <LeaveDialog/>
        <RemoveDialog/>
        <div className="h-full flex flex-col">
        <div className="flex h-[49px] justify-between px-4 border-b">
            <p className="text-lg font-bold">
                Profile
            </p>
            <Button variant="ghost" size="iconSm" onClick={onClose}>
                <XIcon className="size-5 stroke-[1.5]"/>
            </Button>

        </div>
        <div className="flex  flex-col items-center justify-center p-4"> 
            <Avatar className="max-w-[256px] max-h-[256px] size-full">
                <AvatarImage src={member.user.image}/>
                <AvatarFallback className="bg-sky-600 text-white font-semibold aspect-square text-6xl">
                {avatarFallback}
                </AvatarFallback>
            </Avatar>
     </div>
     <div className="flex flex-col p-4 justify-center items-center">
        <p className="text-xl font-bold">
        {member.user.name}
        </p>
        {currentMember?.role === "admin" && currentMember?._id !== memberId ? (
            <div className="flex items-center gap-2 mt-4">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>

                    <Button variant="outline" className='w-full capitalize'>
                {member.role} <ChevronDownIcon className="size-4 ml-2"/>
                </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-full">
                        <DropdownMenuRadioGroup value={member.role} onValueChange={(role)=> onUpdate(role as "admin" | "member")}>
                            <DropdownMenuRadioItem value="admin" className="text-sm font-semibold">

                                Admin
                            </DropdownMenuRadioItem>
                            <DropdownMenuRadioItem value="member" className="text-sm font-semibold">

                            Member
                    </DropdownMenuRadioItem>
                        </DropdownMenuRadioGroup>

                    </DropdownMenuContent>
                </DropdownMenu>
            
            <Button variant="outline" className="w-full" onClick={onRemove}>Remove</Button>
            </div>
        ): currentMember?._id === member._id && currentMember?.role !== "admin" ? (
            <div className="mt-4 w-full">
                <Button variant="outline" className="w-full" onClick={onLeave}>
                    Leave
                </Button>
            </div>
        ): null}
     </div>
     <Separator/>
     <div className="flex flex-col p-4">
        <p className="text-sm font-bold mb-4">Contact information</p>

        <div className="flex items-center gap-2">
            <div className="size-9 rounded-md bg-muted flex items-center justify-center">
                <MailIcon className="size-4"/>
            </div>
            <div className="flex flex-col">
                <p className="text-[13px] font-semibold text-muted-foreground">
                    Email Address
                </p>
                <Link href={`mailto:${member.user.email}`} className="text-sm hover:underline text-[#1264a3]">
                {member.user.email}
                </Link>
            </div>
        </div>
     </div>
    </div>

    </>
    )
}