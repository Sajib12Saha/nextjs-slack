import { useProfileMemberId } from "@/app/(features)/members/store/use-profile-member-id";
import { useParentMessageId } from "@/app/(features)/messages/store/use-parent-message-id";


export const usePanel = () => {
    const [parentMessageId, setParentMessageId] = useParentMessageId();
    const [profileMemberId, setProfileMemberId] = useProfileMemberId();

    
    const onOpenProfile = (memberId:string) => {
        setProfileMemberId(memberId)
        setParentMessageId(null)
    };


    const onOpenMessage = (messageId:string) => {
        setParentMessageId(messageId)
        setProfileMemberId(null)
    };

    const onClose = () => {
        setParentMessageId(null)
        setProfileMemberId(null)
    }

    return {
        parentMessageId,
        onOpenMessage,
        onClose,
        profileMemberId,
        onOpenProfile,
    }
 }

