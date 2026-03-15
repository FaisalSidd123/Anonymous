'use client'

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import { Message } from "@/model/User"
import axios from "axios"
import { ApiResponse } from "@/types/ApiResponse"
import { toast } from "sonner"

type MessageCardProps = {
    message: Message
    onMessageDelete: (messageId: string) => void 
}

const MessageCard = ({ message, onMessageDelete }: MessageCardProps) => {
    
    const handleDeleteConfirm = async () => {
        try {
            const response = await axios.delete<ApiResponse>(`/api/delete-message/${message._id}`)
            toast.success(response.data.message)
            onMessageDelete(message._id.toString())
        } catch (error) {
            toast.error("Failed to delete message")
            console.error("Error deleting message:", error)
        }
    }
    
    return (
        <Card className="glass-card rounded-2xl border-none overflow-hidden group">
            <CardHeader className="relative">
                <div className="absolute top-2 right-2">
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="destructive" size="icon" className="h-8 w-8 opacity-70 hover:opacity-100 transition-opacity">
                                <X className="h-4 w-4" />
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Delete Message</AlertDialogTitle>
                                <AlertDialogDescription>
                                    Are you sure you want to delete this message? This action cannot be undone.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={handleDeleteConfirm}>
                                    Delete
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
                <CardTitle className="pr-8">Message from Anonymous</CardTitle>
                <CardDescription>
                    Received on {new Date(message.createdAt).toLocaleDateString()}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-foreground/80">{message.content}</p>
            </CardContent>
            {message.createdAt && (
                <CardFooter className="text-xs text-muted-foreground">
                    {new Date(message.createdAt).toLocaleTimeString()}
                </CardFooter>
            )}
        </Card>
    )
}

export default MessageCard