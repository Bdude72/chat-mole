"use client"

import { redirect } from "next/navigation"
import { Realtime } from "ably"
import { AblyProvider } from "ably/react"

import useSession from "@/hooks/useSession"
import { Button } from "@/components/ui/button"
import Chat from "@/components/Chat"
import NavBar from "@/components/NavBar"
import VideoContainer from "@/components/VideoContainer"

export default function Channel() {
  const { session } = useSession()

  if (!session?.username || !session.channelRef) redirect("/")

  const client = new Realtime.Promise({
    authUrl: "/api/auth",
    useTokenAuth: true,
  })

  return (
    <AblyProvider client={client}>
      {/* TODO: Fix max height*/}
      <main className="flex flex-1 flex-col lg:flex-row">
        <div className="flex h-full w-full">
          <VideoContainer />
        </div>
        <div className="flex h-full w-128">
          <Chat username={session.username} channelRef={session.channelRef} />
        </div>
      </main>
    </AblyProvider>
  )
}
