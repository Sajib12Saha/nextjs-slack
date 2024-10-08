import { useGetMember } from "@/app/(features)/members/api/use-get-member";
import { useGetMessages } from "@/app/(features)/messages/api/use-get-messages";
import { Id } from "@/convex/_generated/dataModel";
import { useMemberId } from "@/hooks/use-member-id";
import { usePanel } from "@/hooks/use-panel";
import {Loader} from 'lucide-react';
import {Header} from './header';
import {ChatInput}from './chat-input'
import {MessageList} from '@/components/message-list';

interface Props {
    id: Id<"conversations">
}

export const Conversation = ({id}:Props) => {
    const memberId = useMemberId();
    const {data:member, isLoading:memberLoading} = useGetMember({id:memberId});

    const {onOpenProfile} = usePanel();

    const {results, status, loadMore} = useGetMessages({
        conversationId: id,
    })

    if (memberLoading || status === "LoadingFirstPage") {
        return (
            <div className="flex h-full gap-x-2 justify-center items-center">
            <Loader className="size-5 text-muted-foreground animate-spin"/>
            </div>
        )
    }

    return (
        <div className="flex flex-col h-full">
            <Header
            memberName={member?.user.name}
            memberImage={member?.user.image}
            onClick={()=> onOpenProfile(memberId)}/>
            <MessageList
            data={results} variant={"conversation"}
            memberImage={member?.user.image}
            memberName={member?.user.name}
            loadMore={loadMore}
            isLoadingMore={status==="LoadingMore"}
            canLoadMore={status === "CanLoadMore"}/>
            <ChatInput
            placeholder={`Message ${member?.user.name}`} 
            conversationId={id}/>
        </div>
    )
}