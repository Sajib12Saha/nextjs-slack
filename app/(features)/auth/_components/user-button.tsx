'use client'

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useCurrentUser } from "../api/use-current-user"
import {Loader, LogOut} from 'lucide-react';
import { useAuthActions } from "@convex-dev/auth/react";
import {useRouter} from 'next/navigation';




export const UserButton = () => {

  
    const router = useRouter()
    const {signOut} = useAuthActions()
    const {data, isLoading} = useCurrentUser();

  
    

    if(isLoading){
        return(
            <Loader className="size-4 animate-spin text-muted-foreground "/>
        )
     }

  
     if(!data) return null;

     const {image, name} = data;
     const avatarFallback = name!.charAt(0).toUpperCase()  

     const SignOut = async() => {

             await signOut()
             .finally(()=> {
                router.push('/auth')
                router.refresh()
             })
     
            
        
     }
      
       
    
       
     

    return(
        <DropdownMenu modal={false}>
            <DropdownMenuTrigger className="outline-none relative">
                <Avatar>
                    <AvatarImage alt="image" src={image}/>
                    <AvatarFallback className="bg-sky-600 text-white font-semibold">
                        {avatarFallback}
                    </AvatarFallback>
                </Avatar>

            </DropdownMenuTrigger>
            <DropdownMenuContent align="center" side="right" className="w-60">
                <DropdownMenuItem onClick={()=> SignOut()} className="h-10">
                    <LogOut className="size-4 mr-2"/>
                    Log out
                </DropdownMenuItem>

            </DropdownMenuContent>
        </DropdownMenu>
    )
}