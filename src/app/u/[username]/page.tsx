'use client'

import React, { useState } from 'react'
import axios, { AxiosError } from 'axios'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { MessageSchema } from '@/schemas/messageSchema'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { Loader2, Sparkles, Send, UserRound, ArrowRight } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
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

    // Modern avatar generator based on username
    const getAvatarGradient = (name: string) => {
        const gradients = [
            'from-indigo-500 to-purple-500',
            'from-rose-400 to-orange-400',
            'from-emerald-400 to-cyan-500',
            'from-blue-500 to-teal-400',
            'from-fuchsia-500 to-pink-500'
        ]
        const index = name?.length % gradients.length || 0;
        return gradients[index];
    }

    return (
        <div className="relative min-h-[calc(100vh-64px)] overflow-hidden py-12 px-4 sm:px-6">
            {/* Background Decorative Elements */}
            <div className="absolute top-[-5%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-500/15 dark:bg-indigo-500/10 blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-pink-500/15 dark:bg-pink-500/10 blur-[120px] pointer-events-none" />
            <div className="absolute top-[40%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[30%] h-[30%] rounded-full bg-purple-500/10 dark:bg-purple-500/5 blur-[100px] pointer-events-none" />

            <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="container mx-auto max-w-3xl relative z-10"
            >
                {/* Profile Header */}
                <div className="text-center mb-12">
                    {/* Modern Avatar Logo */}
                    <div className="relative inline-block mb-6 group">
                        <div className={`absolute -inset-1 bg-gradient-to-r ${getAvatarGradient(username)} rounded-full blur opacity-50 group-hover:opacity-100 transition duration-500`}></div>
                        <div className={`relative w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-br ${getAvatarGradient(username)} flex items-center justify-center shadow-xl border border-white/20`}>
                            <UserRound className="w-10 h-10 sm:w-12 sm:h-12 text-white/90 absolute z-0 opacity-20" />
                            <span className="text-white text-5xl font-black drop-shadow-md z-10">{username?.charAt(0).toUpperCase()}</span>
                        </div>
                    </div>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2, duration: 0.4 }}
                    >
                        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight">
                            Message <span className="text-gradient hover:opacity-80 transition-opacity">@{username}</span>
                        </h1>
                        <p className="text-muted-foreground font-medium text-lg max-w-xl mx-auto">
                            Send them an anonymous message. They won't know it's from you!
                        </p>
                    </motion.div>
                </div>

                {/* Message Input Card */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    className="glass-card rounded-3xl p-6 md:p-8 mb-12 shadow-2xl border border-white/10 relative overflow-hidden group"
                >
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-50"></div>
                    
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <FormField
                                control={form.control}
                                name="content"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <div className="relative group/input">
                                                <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-2xl blur opacity-0 group-focus-within/input:opacity-30 transition duration-500"></div>
                                                <textarea
                                                    placeholder="Type your secret message here..."
                                                    className="relative flex min-h-[160px] w-full border border-input/40 rounded-2xl bg-background/60 backdrop-blur-xl px-5 py-5 text-lg shadow-inner placeholder:text-muted-foreground focus-visible:outline-none focus-visible:border-indigo-500/50 disabled:cursor-not-allowed disabled:opacity-50 resize-y font-medium transition-all"
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
                                    className="px-8 py-6 text-lg rounded-xl font-bold shadow-lg shadow-primary/25 hover:scale-[1.02] active:scale-[0.98] transition-all w-full md:w-auto overflow-hidden relative group/btn"
                                >
                                    <div className="absolute inset-0 w-full h-full gradient-bg opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
                                    <span className="relative z-10 flex items-center">
                                        {isLoading ? (
                                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                        ) : (
                                            <Send className="mr-2 h-5 w-5" />
                                        )}
                                        Send Anonymously
                                    </span>
                                </Button>
                            </div>
                        </form>
                    </Form>
                </motion.div>

                {/* Suggestions Section */}
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                    className="space-y-6"
                >
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4 pl-2">
                        <div>
                            <h3 className="text-xl font-bold flex items-center gap-2">
                                <Sparkles className="w-5 h-5 text-yellow-500 animate-pulse" /> Need inspiration?
                            </h3>
                            <p className="text-sm font-medium text-muted-foreground">Click a suggestion to use it.</p>
                        </div>
                        <Button
                            onClick={fetchSuggestions}
                            variant="secondary"
                            className="font-bold glass shadow-sm hover:bg-secondary/80 transition-all rounded-xl"
                            disabled={isSuggesting}
                        >
                            {isSuggesting ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin text-indigo-500" />
                            ) : null}
                            Generate New Ideas
                        </Button>
                    </div>
                    
                    <div className="grid gap-3">
                        <AnimatePresence mode="popLayout">
                            {suggestions.map((msg, index) => (
                                <motion.div
                                    key={msg}
                                    initial={{ opacity: 0, x: -20, scale: 0.95 }}
                                    animate={{ opacity: 1, x: 0, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ duration: 0.3, delay: index * 0.1 }}
                                >
                                    <Button
                                        variant="outline"
                                        className="w-full justify-start whitespace-normal text-left h-auto py-4 px-6 text-base font-medium rounded-2xl glass hover:bg-indigo-500/10 hover:border-indigo-500/40 hover:-translate-y-0.5 transition-all shadow-sm group"
                                        onClick={() => handleSuggestionClick(msg)}
                                        type="button"
                                    >
                                        <span className="text-indigo-500 mr-3 opacity-0 group-hover:opacity-100 transition-opacity"><ArrowRight className="w-4 h-4"/></span>
                                        "{msg}"
                                    </Button>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </motion.div>

                <Separator className="my-14 opacity-40" />
                
                {/* Call to Action Wrapper */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    className="text-center relative group"
                >
                    <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-3xl blur opacity-20 group-hover:opacity-30 transition duration-1000"></div>
                    <div className="relative glass-card p-10 md:p-12 rounded-3xl border border-white/10">
                        <div className="mb-4 font-black text-3xl md:text-4xl tracking-tight text-gradient">Want Your Own Board?</div>
                        <p className="text-muted-foreground mb-8 text-lg max-w-md mx-auto font-medium">Create a free account to start receiving anonymous messages from your friends and followers.</p>
                        <Link href="/sign-up">
                            <Button size="lg" className="px-10 py-6 text-lg rounded-2xl font-extrabold shadow-xl shadow-primary/30 hover:scale-105 active:scale-95 transition-all bg-foreground text-background hover:bg-foreground/90">
                                Create Your Account Free
                            </Button>
                        </Link>
                    </div>
                </motion.div>
            </motion.div>
        </div>
    )
}