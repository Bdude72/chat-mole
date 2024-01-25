import { memo, useCallback, useMemo, useRef, useState } from "react"
import { Message } from "@ably-labs/chat"
import { PopoverContent } from "@radix-ui/react-popover"
import { ToggleGroup, ToggleGroupItem } from "@radix-ui/react-toggle-group"
import { Laugh, Pencil, Reply, Trash2 } from "lucide-react"

/**
 * Hooks
 */
import { useKeyboardDown } from "@/hooks/useKeyboardDown"
import { useOutsideAlerter } from "@/hooks/useOutsideAlerter"
/**
 * Components
 */
import { Popover, PopoverAnchor, PopoverTrigger } from "@/components/ui/popover"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import EmojiPicker from "@/components/EmojiPicker"

import MessageReactions from "./MessageReactions"

function getUserColor(username: string) {
  const hue = stringToHue(username)
  const saturation = 90 // Keeping saturation & lightness constant
  const lightness = 50
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`
}

function stringToHue(str: string) {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash)
  }
  return hash % 360
}

const hasReactions = (message: Message) => {
  return Object.entries(message.reactions.counts).some(
    ([, count]) => count > 0,
    false
  )
}

type MessageItemProps = {
  message: Message
  username: string
  onEdit: (messageId: string, content: string) => void
  onDelete: (messageId: string) => void
  onAddReaction: (messageId: string, unicode: string) => void
  onRemoveReaction: (reactionId: string) => void
}

const MessageItem = ({
  message,
  username,
  onEdit,
  onDelete,
  onAddReaction,
  onRemoveReaction,
}: MessageItemProps) => {
  const [open, setOpen] = useState(false)

  const handleEscape = useCallback(() => setOpen(false), [setOpen])
  const handleOpenPicker = useCallback(() => setOpen(true), [])
  const handleAddReaction = useCallback(
    (unicode: string) => {
      setOpen(false)
      onAddReaction(message.id, unicode)
    },
    [message.id, onAddReaction]
  )

  const itemRef = useRef(null)
  useKeyboardDown("Escape", handleEscape)
  useOutsideAlerter(itemRef, handleEscape)

  const showReactions = useMemo(() => hasReactions(message), [message])
  const color = getUserColor(message.client_id)
  const isUsersMessage = message?.client_id === username

  return (
    <Popover open={open}>
      <Tooltip>
        <li className="w-full" ref={itemRef}>
          <TooltipTrigger asChild>
            <PopoverAnchor asChild>
              <p className="space-x-3 rounded-sm px-2 py-1 leading-6 hover:bg-muted">
                <span style={{ color }} className="font-bold">
                  {message.client_id}
                </span>
                <span>{message.content}</span>
              </p>
            </PopoverAnchor>
          </TooltipTrigger>
          {showReactions ? (
            <MessageReactions
              message={message}
              onAdd={handleAddReaction}
              onRemove={onRemoveReaction}
              onAddClick={handleOpenPicker}
            />
          ) : null}
        </li>
        <TooltipContent className="border bg-background p-2">
          <ToggleGroup type="multiple" className="flex items-center space-x-4">
            <PopoverTrigger asChild>
              <ToggleGroupItem
                value={"add-reaction"}
                aria-label={"Add Reaction"}
                onClick={handleOpenPicker}
                className="text-gray-400"
              >
                <Laugh size="18" />
              </ToggleGroupItem>
            </PopoverTrigger>
            <ToggleGroupItem
              value={"reply"}
              aria-label={"reply"}
              title="Coming soon"
              className="text-gray-400"
            >
              <Reply size="18" />
            </ToggleGroupItem>
            {isUsersMessage ? (
              <>
                <ToggleGroupItem
                  value={"edit"}
                  aria-label={"edit"}
                  className="text-gray-400"
                  onClick={() => onEdit(message.id, message.content)}
                >
                  <Pencil size="18" />
                </ToggleGroupItem>
                <ToggleGroupItem
                  value={"delete"}
                  aria-label={"delete"}
                  onClick={() => onDelete(message.id)}
                  className="text-gray-400"
                >
                  <Trash2 size="18" />
                </ToggleGroupItem>
              </>
            ) : null}
          </ToggleGroup>
        </TooltipContent>
      </Tooltip>
      <PopoverContent className="w-[350px] p-0" ref={itemRef}>
        <EmojiPicker onSelect={handleAddReaction} />
      </PopoverContent>
    </Popover>
  )
}

export default memo(MessageItem)
