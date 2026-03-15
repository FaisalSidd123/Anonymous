'use client'

import { useCallback, useEffect, useState } from "react"
import { Message } from "@/model/User"
import { useSession } from "next-auth/react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { AcceptMessageSchema } from "@/schemas/acceptMessageSchema"
import axios, { AxiosError } from "axios"
import { ApiResponse } from "@/types/ApiResponse"
import { Switch } from "@/components/ui/switch"  // Fixed import
import { Button } from "@/components/ui/button"  // Fixed import
import { motion, AnimatePresence } from "framer-motion"
import { Loader2, RefreshCcw } from "lucide-react"
import MessageCard from "@/components/MessageCard"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"
import { User } from "next-auth"

const Page = () => {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSwitchLoading, setIsSwitchLoading] = useState(false)

  const handleDeleteMessage = (messageId: string) => {
    setMessages(messages.filter((message) => message._id.toString() !== messageId))
  }

  const { data: session } = useSession()

  const form = useForm({
    resolver: zodResolver(AcceptMessageSchema),
    defaultValues: {
      acceptMessages: true
    }
  })

  const { register, watch, setValue } = form
  const acceptMessages = watch('acceptMessages')

  const fetchAcceptMessage = useCallback(async () => {
    setIsSwitchLoading(true)
    try {
      const response = await axios.get<ApiResponse>('/api/accept-messages')
      setValue('acceptMessages', response.data.isAcceptingMessage ?? false)
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      toast.error(axiosError.response?.data.message || "Failed to fetch message settings")
    } finally {
      setIsSwitchLoading(false)
    }
  }, [setValue])

  const fetchMessages = useCallback(async (refresh: boolean = false) => {
    setIsLoading(true)
    try {
      const response = await axios.get<ApiResponse>('/api/get-messages')
      setMessages(response.data.messages || [])
      if (refresh) {
        toast.success("Messages refreshed successfully")
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      toast.error(axiosError.response?.data.message || "Failed to fetch messages")
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    if (!session || !session.user) return
    fetchMessages()
    fetchAcceptMessage()
  }, [session, fetchAcceptMessage, fetchMessages])

  // Handle switch change
  const handleSwitchChange = async (checked: boolean) => {
    setIsSwitchLoading(true)
    try {
      const response = await axios.post<ApiResponse>('/api/accept-messages', {
        acceptMessages: checked
      })
      setValue('acceptMessages', checked)
      toast.success(response.data.message)
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      toast.error(axiosError.response?.data.message || "Failed to update message settings")
    } finally {
      setIsSwitchLoading(false)
    }
  }

  // Fix: Check if window is defined (for SSR)
  const [profileUrl, setProfileUrl] = useState('')
  
  useEffect(() => {
    if (session?.user) {
      const username = (session.user as User).username
      const baseUrl = `${window.location.protocol}//${window.location.host}`
      setProfileUrl(`${baseUrl}/u/${username}`)
    }
  }, [session])

  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl)
    toast.success("Profile URL copied to clipboard!")
  }

  if (!session || !session.user) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-64px)]">
        <p className="text-xl font-medium text-muted-foreground animate-pulse">Please sign in to access the dashboard</p>
      </div>
    )
  }

  return (
    <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-4 md:p-8 w-full max-w-6xl min-h-[calc(100vh-100px)]">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl md:text-5xl font-extrabold mb-8 tracking-tight text-gradient">Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <div className="glass-card rounded-2xl p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl -mr-10 -mt-10" />
            <h2 className="text-xl font-bold mb-4">Your Unique Link</h2>
            <p className="text-sm text-muted-foreground mb-4">Share this link to start receiving anonymous messages from anyone.</p>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={profileUrl}
                disabled
                className="flex h-11 w-full rounded-md border border-input/50 bg-background/50 px-4 py-2 text-sm font-medium shadow-inner disabled:opacity-70 flex-grow"
              />
              <Button onClick={copyToClipboard} size="lg" className="shadow-lg shadow-primary/20 hover:scale-105 transition-transform">Copy</Button>
            </div>
          </div>

          <div className="glass-card rounded-2xl p-6 relative overflow-hidden flex flex-col justify-center">
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl -mr-10 -mb-10" />
            <h2 className="text-xl font-bold mb-4">Message Preferences</h2>
            <div className="flex items-center justify-between p-4 rounded-xl bg-background/40 border border-white/5 shadow-sm">
              <div>
                <p className="font-semibold text-lg">{acceptMessages ? 'Accepting Messages' : 'Not Accepting Messages'}</p>
                <p className="text-sm text-muted-foreground">Toggle to pause new messages temporarily.</p>
              </div>
              <Switch
                {...register('acceptMessages')}
                checked={acceptMessages}
                onCheckedChange={handleSwitchChange}
                disabled={isSwitchLoading}
                className="scale-125 data-[state=checked]:bg-indigo-500"
              />
            </div>
          </div>
        </div>
      </motion.div>

      <Separator className="my-8 opacity-50" />

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mt-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold tracking-tight">Inbox</h2>
          <Button
            variant="outline"
            className="hover:scale-105 transition-transform gap-2 glass border-none shadow-sm"
            onClick={() => fetchMessages(true)}
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin text-indigo-500" />
            ) : (
              <RefreshCcw className="h-4 w-4 text-indigo-500" />
            )}
            <span className="hidden sm:inline">Refresh</span>
          </Button>
        </div>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6 pb-20">
          {messages.length > 0 ? (
            messages.map((message, index) => (
              <motion.div
                key={message._id.toString()}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                layout
              >
                <MessageCard
                  message={message}
                  onMessageDelete={handleDeleteMessage}
                />
              </motion.div>
            ))
          ) : (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="col-span-1 md:col-span-2 py-20 flex flex-col items-center justify-center glass-card rounded-2xl border-dashed border-2 border-muted"
            >
              <div className="text-6xl mb-4 opacity-50">📭</div>
              <p className="text-center text-xl font-semibold text-muted-foreground">
                Your inbox is empty
              </p>
              <p className="text-center text-sm text-muted-foreground mt-2">
                Share your link to start receiving messages!
              </p>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  )
}

export default Page