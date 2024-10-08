'use client'

import { CreateChannelsModel } from "@/app/(features)/channels/components/create-channels-model";
import { CreateWorkspaceModel } from "@/app/(features)/workspaces/components/create-workspace-model";
import {useState, useEffect} from 'react';


export const Modals = () => {

    const [mounted, setMounted ] = useState(false);

    useEffect(()=> {
        setMounted(true)
    }, [])

    if(!mounted) return null;

    return (
        <>
        <CreateWorkspaceModel/>
        <CreateChannelsModel/>
        </>
    )
}