'use client'

import React, { useState } from 'react'
import axios, { AxiosError } from 'axios'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { MessageSchema } from '@/schemas/messageSchema'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { Loader2, Sparkles, Send } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { motion, AnimatePresence } from 'framer-motion'

export default function PublicMessagePage() {
    const params = useParams<{ username: string }>()
    const username = params?.username

    const [isSuggesting, setIsSuggesting] = useState(false)
    const [suggestions, setSuggestions] = useState<string[]>([
        "What's your favorite movie?",
        "Do you have any pets?",
        "What's your dream job?"
    ])
    const [isLoading, setIsLoading] = useState(false)

    const form = useForm<z.infer<typeof MessageSchema>>({
        resolver: zodResolver(MessageSchema),
        defaultValues: {
            content: ''
        }
    })

    const messageContent = form.watch('content')

    const onSubmit = async (data: z.infer<typeof MessageSchema>) => {
        setIsLoading(true)
        try {
            const response = await axios.post('/api/send-message', {
                username,
                content: data.content
            })
            toast.success(response.data.message || 'Message sent successfully')
            form.reset({ content: '' })
        } catch (error) {
            const axiosError = error as AxiosError<any>
            toast.error(
                axiosError.response?.data.message || 'Error occurred while sending message'
            )
        } finally {
            setIsLoading(false)
        }
    }

    const fetchSuggestions = async () => {
        try {
            setIsSuggesting(true)
            const response = await axios.post('/api/suggest-messages')
            const outputString = response.data.output
            if (outputString) {
                const parts = outputString.split('|').map((part: string) => part.trim()).filter(Boolean)
                if (parts.length > 0) {
                   setSuggestions(parts)
                }
            }
        } catch (error) {
            toast.error('Failed to fetch suggestions from AI. Make sure your API key is configured properly.')
            console.error(error)
        } finally {
            setIsSuggesting(false)
        }
    }

    const handleSuggestionClick = (msg: string) => {
        form.setValue('content', msg)
    }

    return (
        <div className="relative min-h-[calc(100vh-64px)] overflow-hidden py-12 px-4 sm:px-6">
            {/* Background Decorative Elements */}
            <div className="absolute top-[-5%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-500/10 dark:bg-indigo-500/5 blur-[100px] pointer-events-none" />
            <div className="absolute bottom-[20%] right-[-10%] w-[40%] h-[40%] rounded-full bg-pink-500/10 dark:bg-pink-500/5 blur-[100px] pointer-events-none" />

            <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="container mx-auto max-w-3xl relative z-10"
            >
                <div className="text-center mb-10">
                    <div className="inline-block mb-4 w-16 h-16 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/30">
                        <span className="text-white text-3xl font-bold">{username?.charAt(0).toUpperCase()}</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight">
                        Message <span className="text-gradient">@{username}</span>
                    </h1>
                    <p className="text-muted-foreground font-medium text-lg">Send them an anonymous message. They won't know it's from you!</p>
                </div>

                <div className="glass-card rounded-3xl p-6 md:p-8 mb-10 shadow-xl border border-white/10">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <FormField
                                control={form.control}
                                name="content"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <div className="relative group">
                                                <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl blur opacity-0 group-focus-within:opacity-30 transition duration-500"></div>
                                                <textarea
                                                    placeholder="Type your secret message here..."
                                                    className="relative flex min-h-[160px] w-full border-2 border-input/50 rounded-2xl bg-background/50 backdrop-blur-sm px-5 py-4 text-base shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:border-indigo-500/50 disabled:cursor-not-allowed disabled:opacity-50 resize-none font-medium transition-all"
                                                    {...field}
                                                />
                                            </div>
                                        </FormControl>
                                        <FormMessage className="pl-2 pt-2" />
                                    </FormItem>
                                )}
                            />
                            <div className="flex justify-center md:justify-end">
                                <Button 
                                    type="submit" 
                                    disabled={isLoading || !messageContent} 
                                    className="px-8 py-6 text-lg rounded-xl font-bold shadow-lg shadow-primary/25 hover:scale-105 transition-all w-full md:w-auto"
                                >
                                    {isLoading ? (
                                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                    ) : (
                                        <Send className="mr-2 h-5 w-5" />
                                    )}
                                    Send Anonymously
                                </Button>
                            </div>
                        </form>
                    </Form>
                </div>

                <div className="space-y-6">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-2 pl-2">
                        <div>
                            <h3 className="text-xl font-bold flex items-center gap-2">
                                <Sparkles className="w-5 h-5 text-amber-500" /> Need inspiration?
                            </h3>
                            <p className="text-sm font-medium text-muted-foreground">Click a suggestion to use it.</p>
                        </div>
                        <Button
                            onClick={fetchSuggestions}
                            variant="secondary"
                            className="font-bold glass border-none hover:bg-secondary/80"
                            disabled={isSuggesting}
                        >
                            {isSuggesting ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin text-indigo-500" />
                            ) : null}
                            Generate New Ideas
                        </Button>
                    </div>
                    
                    <div className="grid gap-3">
                        <AnimatePresence mode="wait">
                            {suggestions.map((msg, index) => (
                                <motion.div
                                    key={msg + index}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ duration: 0.3, delay: index * 0.1 }}
                                >
                                    <Button
                                        variant="outline"
                                        className="w-full justify-start whitespace-normal text-left h-auto py-4 px-6 text-base font-medium rounded-2xl glass hover:bg-indigo-500/5 hover:border-indigo-500/30 transition-all shadow-sm"
                                        onClick={() => handleSuggestionClick(msg)}
                                        type="button"
                                    >
                                        "{msg}"
                                    </Button>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </div>

                <Separator className="my-12 opacity-50" />
                
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center glass-card p-10 rounded-3xl"
                >
                    <div className="mb-6 font-bold text-2xl tracking-tight">Get Your Own Message Board</div>
                    <p className="text-muted-foreground mb-8 text-lg max-w-md mx-auto">Create a free account to start receiving anonymous messages from your friends and followers.</p>
                    <Link href="/sign-up">
                        <Button size="lg" className="px-10 py-6 text-lg rounded-xl font-extrabold shadow-xl shadow-primary/30 hover:scale-105 transition-all">
                            Create Your Account Free
                        </Button>
                    </Link>
                </motion.div>
            </motion.div>
        </div>
    )
}