import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import { useQuery } from "convex/react"

interface CurrentMemberProps{
    workspaceId: Id<"workspaces">
}

export const useCurrentMember = ({workspaceId}:CurrentMemberProps) => {
    const data = useQuery(api.members.current,{workspaceId})
    const isLoading = data === undefined;

    return {data, isLoading};
}