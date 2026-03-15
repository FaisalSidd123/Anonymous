'use client'

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import Link from "next/link"
import { useState } from "react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { ApiResponse } from "@/types/ApiResponse"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2, LogIn, Eye, EyeOff } from "lucide-react"
import { signInSchema } from "@/schemas/signInSchema"
import { signIn } from "next-auth/react"
import { motion } from "framer-motion"

const Page = () => {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: '',
      password: ''
    }
  })

  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    setIsSubmitting(true)
    
    try {
      const result = await signIn('credentials', {
        redirect: false,
        identifier: data.identifier,
        password: data.password
      })

      if (result?.error) {
        if (result.error === 'CredentialsSignin') {
          toast.error("Incorrect username or password", {
            description: "Please check your credentials and try again"
          })
        } else {
          toast.error("Login Failed", {
            description: result.error
          })
        }
      } else if (result?.url) {
        toast.success("Logged in successfully!")
        router.replace('/dashboard')
      }
    } catch (error) {
      console.error("Login error:", error)
      toast.error("An unexpected error occurred")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="relative flex justify-center items-center min-h-[calc(100vh-64px)] overflow-hidden px-4 py-12">
      {/* Background Decorative Elements */}
      <div className="absolute top-[-15%] right-[-10%] w-[45%] h-[45%] rounded-full bg-indigo-500/15 dark:bg-indigo-500/8 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-15%] w-[50%] h-[50%] rounded-full bg-purple-500/15 dark:bg-purple-500/8 blur-[120px] pointer-events-none" />
      <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[30%] h-[30%] rounded-full bg-pink-500/10 dark:bg-pink-500/5 blur-[100px] pointer-events-none" />

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
            <div className="mx-auto w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30 mb-6">
              <LogIn className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-3">
              Welcome <span className="text-gradient">Back</span>
            </h1>
            <p className="text-muted-foreground font-medium">
              Sign in to continue your anonymous adventure
            </p>
          </motion.div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                <FormField
                  name="identifier"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-semibold">Email or Username</FormLabel>
                      <FormControl>
                        <div className="relative group">
                          <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl blur opacity-0 group-focus-within:opacity-20 transition duration-500"></div>
                          <Input 
                            placeholder="Enter your email or username"
                            className="relative rounded-xl border-input/50 bg-background/50 backdrop-blur-sm h-12 px-4 font-medium transition-all focus-visible:border-indigo-500/50"
                            {...field}
                            disabled={isSubmitting}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  name="password"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-semibold">Password</FormLabel>
                      <FormControl>
                        <div className="relative group">
                          <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl blur opacity-0 group-focus-within:opacity-20 transition duration-500"></div>
                          <div className="relative">
                            <Input 
                              type={showPassword ? "text" : "password"}
                              placeholder="Enter your password"
                              className="relative rounded-xl border-input/50 bg-background/50 backdrop-blur-sm h-12 px-4 pr-12 font-medium transition-all focus-visible:border-indigo-500/50"
                              {...field}
                              disabled={isSubmitting}
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                            >
                              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                          </div>
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
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Signing in...
                    </>
                  ) : (
                    <>
                      <LogIn className="mr-2 h-5 w-5" /> Sign In
                    </>
                  )}
                </Button>
              </form>
            </Form>
          </motion.div>

          {/* Footer Link */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.45 }}
            className="text-center pt-2"
          >
            <p className="text-sm text-muted-foreground">
              Don&apos;t have an account?{' '}
              <Link href="/sign-up" className="text-indigo-500 dark:text-indigo-400 hover:text-indigo-600 dark:hover:text-indigo-300 font-semibold transition-colors">
                Sign up
              </Link>
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}

export default Page