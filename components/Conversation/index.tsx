"use client"

import { useCallback, useMemo, useState } from "react"

import { useConversation } from "@/hooks/chat/useConversation"
import { useMessages } from "@/hooks/chat/useMessages"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"

import MessageInput from "../MessageInput"
import MessageList from "../MessageList"
import ConversationHeader from "./ConversationHeader"

type ConversationProps = {}

const Conversation = (props: ConversationProps) => {
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null)
  const messages = useMessages()
  const conversation = useConversation()

  const handleSend = useCallback(
    async (content: string) => {
      if (editingMessageId) {
        return await conversation.messages.edit(editingMessageId, content)
      }
      await conversation.messages.send(content)
    },
    [conversation.messages, editingMessageId]
  )

  const handleEditClick = useCallback((messageId: string) => {
    setEditingMessageId(messageId)
  }, [])

  const handleClear = useCallback(() => {
    setEditingMessageId(null)
  }, [])

  // There should be a method on the SDK to get the message by id.
  const inputContent = useMemo<string | null>(() => {
    if (!editingMessageId) return null
    return messages?.find((m) => m.id === editingMessageId)?.content ?? null
  }, [messages, editingMessageId])

  return (
    <Card className="flex size-full flex-col rounded-none border-t-0">
      <CardHeader className="flex flex-row items-center">
        <ConversationHeader title="Chat room" onlineUserCount={928} />
      </CardHeader>
      <CardContent className="flex grow">
        <MessageList
          messages={messages}
          onEdit={handleEditClick}
          username={""}
        />
      </CardContent>
      <CardFooter>
        <MessageInput
          key={editingMessageId}
          onSubmit={handleSend}
          defaultValue={inputContent}
          onClear={handleClear}
        />
      </CardFooter>
    </Card>
  )
}

export default Conversation
