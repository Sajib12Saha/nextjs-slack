import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import { useQuery } from "convex/react"

interface Props{
    id: Id<"members">
}

export const useGetMember = ({id}:Props) => {
    const data = useQuery(api.members.getById,{id})
    const isLoading = data === undefined;

    return {data, isLoading};
}