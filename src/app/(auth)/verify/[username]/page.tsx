'use client'
import { verifySchema } from '@/schemas/verifySchema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useParams, useRouter } from 'next/navigation'
import React from 'react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import axios, { AxiosError } from 'axios'
import { ApiResponse } from '@/types/ApiResponse'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { Loader2, ShieldCheck } from 'lucide-react'
import { motion } from 'framer-motion'

const VerifyAccount = () => {
    const router = useRouter()
    const params = useParams<{username: string}>()
    const [isSubmitting, setIsSubmitting] = React.useState(false)
    
    const form = useForm<z.infer<typeof verifySchema>>({
        resolver: zodResolver(verifySchema),
        defaultValues: {
            code: ''
        }
    })

    const onSubmit = async (data: z.infer<typeof verifySchema>) => {
        setIsSubmitting(true)
        try {
            const response = await axios.post('/api/verify-code', {
                username: params.username,
                code: data.code
            })

            toast.success(response.data.message)
            router.replace('/sign-in')
        } catch (error) {
            console.error("Error in verifying user", error)
            const axiosError = error as AxiosError<ApiResponse>
            let errorMessage = axiosError.response?.data.message ?? "Error verifying account"
            toast.error(errorMessage)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="relative flex justify-center items-center min-h-[calc(100vh-64px)] overflow-hidden px-4 py-12">
            {/* Background Decorative Elements */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-emerald-500/15 dark:bg-emerald-500/8 blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-15%] w-[45%] h-[45%] rounded-full bg-indigo-500/15 dark:bg-indigo-500/8 blur-[120px] pointer-events-none" />

            <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="w-full max-w-md relative z-10"
            >
                <div className="glass-card rounded-3xl p-8 md:p-10 space-y-8 border border-white/10">
                    {/* Header */}
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.15 }}
                        className="text-center"
                    >
                        <div className="mx-auto w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/30 mb-6">
                            <ShieldCheck className="w-6 h-6 text-white" />
                        </div>
                        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-3">
                            Verify Your <span className="text-gradient">Account</span>
                        </h1>
                        <p className="text-muted-foreground font-medium">
                            Enter the 6-digit code sent to your email
                        </p>
                    </motion.div>

                    {/* Form */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                    >
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                <FormField
                                    name="code"
                                    control={form.control}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-sm font-semibold">Verification Code</FormLabel>
                                            <FormControl>
                                                <div className="relative group">
                                                    <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl blur opacity-0 group-focus-within:opacity-20 transition duration-500"></div>
                                                    <Input 
                                                        placeholder="Enter 6-digit code" 
                                                        className="relative rounded-xl border-input/50 bg-background/50 backdrop-blur-sm h-14 px-4 text-center text-2xl font-bold tracking-[0.5em] transition-all focus-visible:border-emerald-500/50"
                                                        maxLength={6}
                                                        {...field} 
                                                    />
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <Button 
                                    type="submit" 
                                    disabled={isSubmitting}
                                    className="w-full h-12 text-base rounded-xl font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Verifying...
                                        </>
                                    ) : (
                                        <>
                                            <ShieldCheck className="mr-2 h-5 w-5" /> Verify Account
                                        </>
                                    )}
                                </Button>
                            </form>
                        </Form>
                    </motion.div>
                </div>
            </motion.div>
        </div>
    )
}

export default VerifyAccount