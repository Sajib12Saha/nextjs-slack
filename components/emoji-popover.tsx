import { useState } from "react";
import Picker from '@emoji-mart/react';
import data from '@emoji-mart/data';
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";

interface Props {
    children: React.ReactNode;
    hint?: string;
    onEmojiSelect: (emoji:any) => void;
}

export const EmojiPopover = ({children, hint="Emoji", onEmojiSelect}:Props) => {

    const [popoverOpen, setPopoverOpen] = useState(false);

    const [tooltipOpen, setTooltipOpen] = useState(false);
    const onSelect = (emoji:any) => {
        onEmojiSelect(emoji)
        setPopoverOpen(false)

        setTimeout(()=> {
            setTooltipOpen(false)
        }, 500)
    }

    return (
       <TooltipProvider>
        <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
            <Tooltip open={tooltipOpen} onOpenChange={setTooltipOpen} delayDuration={50}>
                <PopoverTrigger asChild>
                    <TooltipTrigger>
                    {children}
                    </TooltipTrigger>
                    </PopoverTrigger>
                    <TooltipContent className="bg-black text-white border-white/5">
                        <p className="font-medium text-xs">{hint}</p>
                    </TooltipContent>
               
            
  </Tooltip>
        <PopoverContent className="p-0 w-full border-none shadow-none">
        <Picker data={data} onEmojiSelect={onSelect}/>
        </PopoverContent>
        </Popover>
       </TooltipProvider>
    )
}