'use client'

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import {Button} from "@/components/ui/button"
import { ChevronDown, SquarePen, ListFilter } from "lucide-react";
import { Doc } from "@/convex/_generated/dataModel";
import { Hint } from "@/components/hint";
import { PreferancesModel } from "./preferances-model";
import {useState} from 'react';
import { InviteModel } from "./invite-model";

interface Props {
    workspace:  Doc<"workspaces">;
    isAdmin: boolean;
}

export const WorkspaceHeader = ({workspace, isAdmin}: Props) => {

    const [PreferencesOpen, setPreferencesOpen] = useState(false);
    const [inviteOpen, setInviteOpen] = useState(false);

    return(
        <>
        <InviteModel open={inviteOpen} setOpen= {setInviteOpen} name={workspace.name} joinCode={workspace.joinCode}/>
        <PreferancesModel open={PreferencesOpen} setOpen={setPreferencesOpen} intialValues={workspace.name}/>
        <div className="flex items-center justify-between px-4 h-[49px] gap-0.5">
       <DropdownMenu>
        <DropdownMenuTrigger asChild>
            <Button variant="transparent" className="font-semibold text-lg w-auto p-2 overflow-hidden select-none focus-visible:ring-transparent" size="sm">
                <span className='truncate'>
                    {workspace.name}
                </span>
                <ChevronDown className="size-5 ml-1 shrink-0"/>

            </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="bottom" align="start" className="w-64">
            <DropdownMenuItem className="cursor-pointer capitalize">
                <div className="size-9 relative overflow-hidden bg-[#616061] text-white font-semibold text-xl rounded-md flex items-center justify-center mr-2">
                    {workspace.name.charAt(0).toUpperCase()}
                </div>
                <div className="absolute bg-green-400 size-2.5 rounded-full top-1 left-9"/>
                <div className="flex flex-col items-start">
                    <p className="font-bold">{workspace.name}</p>
                    <p className="text-xs text-muted-foreground">Active workspace</p>

                </div>


            </DropdownMenuItem>
            {isAdmin && (
                <>
         

        <DropdownMenuSeparator/>
     <DropdownMenuItem className="cursor-pointer py-2" onClick={()=> setInviteOpen(true)}>

     Invite people to {workspace.name}

     </DropdownMenuItem>

     <DropdownMenuSeparator/>
        <DropdownMenuItem    className="cursor-pointer py-2" onClick={()=> setPreferencesOpen(true)}>

     Preferances

      </DropdownMenuItem>
         </>
            )}
        

        </DropdownMenuContent>
       </DropdownMenu>
       <div className="flex items-center gap-0.5">
        <Hint label="Filter conversation" side="bottom">
        <Button variant="transparent" size="iconSm">
            <ListFilter className="size-5"/>
        </Button>
        </Hint>
      
        <Hint label="New message" side="bottom">
        <Button variant="transparent" size="iconSm">
            <SquarePen className="size-5"/>
        </Button>
        </Hint>
   

       </div>
        </div>
        </>
    )
}