
'use client'

import { useEffect, useMemo } from "react";
import { UserButton } from "./(features)/auth/_components/user-button";
import { useGetWorkspaces } from "./(features)/workspaces/api/use-get-workspaces";
import { useWorkspaceModel } from "./(features)/workspaces/store/use-create-workspace-model";
import {useRouter} from 'next/navigation';
import { LoaderCircle } from 'lucide-react';



export default function Home() {

  const router = useRouter()
  const {data, isLoading} = useGetWorkspaces();

  const {isOpen, onOpen} = useWorkspaceModel()


  const workspaceId = useMemo(()=> data?.[0]?._id , [data])

  useEffect(()=> {
      if(isLoading) return; 

      if(workspaceId){
        router.replace(`/workspace/${workspaceId}`);
         }
         else if(!isOpen){
        onOpen()
        }
  }, [workspaceId, isLoading, isOpen, onOpen])

  return (
 
  <div className="flex items-center justify-center h-full bg-[#481349]">
   
    <LoaderCircle className="animate-spin size-10 text-slate-100"/>
  

  </div>
   )
}
