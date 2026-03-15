'use client'

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useDebounceValue } from "usehooks-ts"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { signUpSchema } from "@/schemas/signUpSchema"
import axios, { AxiosError } from 'axios'
import { ApiResponse } from "@/types/ApiResponse"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2, UserPlus, Eye, EyeOff, CheckCircle2, XCircle } from "lucide-react"
import { motion } from "framer-motion"

const Page = () => {
  const [username, setUsername] = useState("")
  const [usernameMessage, setUsernameMessage] = useState("")
  const [isCheckingUsername, setIsCheckingUsername] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const [debouncedUsername] = useDebounceValue(username, 300)
  const router = useRouter()

  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: '',
      email: '',
      password: ''
    }
  })

  useEffect(() => {
    const checkUsernameUnique = async () => {
      if (debouncedUsername && typeof debouncedUsername === 'string' && debouncedUsername.length > 0) {
        setIsCheckingUsername(true)
        setUsernameMessage('')
        try {
          const response = await axios.get(`/api/check-username-unique?username=${encodeURIComponent(debouncedUsername)}`)
          setUsernameMessage(response.data.message)
        } catch (error) {
          const axiosError = error as AxiosError<ApiResponse>
          setUsernameMessage(axiosError.response?.data.message ?? "Error checking username")
        } finally {
          setIsCheckingUsername(false)
        }
      }
    }
    checkUsernameUnique()
  }, [debouncedUsername])

  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    setIsSubmitting(true)

    try {
      const response = await axios.post<ApiResponse>('/api/sign-up', data)
      toast.success(response.data.message)
      router.replace(`/verify/${data.username}`)
    } catch (error) {
      console.error("Error in signup of user", error)
      const axiosError = error as AxiosError<ApiResponse>
      let errorMessage = axiosError.response?.data.message ?? "Error signing up"
      toast.error(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  const isUsernameValid = usernameMessage === "Username is Unique"

  return (
    <div className="relative flex justify-center items-center min-h-[calc(100vh-64px)] overflow-hidden px-4 py-12">
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] left-[-15%] w-[50%] h-[50%] rounded-full bg-purple-500/15 dark:bg-purple-500/8 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-15%] right-[-10%] w-[45%] h-[45%] rounded-full bg-indigo-500/15 dark:bg-indigo-500/8 blur-[120px] pointer-events-none" />
      <div className="absolute top-[40%] right-[20%] w-[25%] h-[25%] rounded-full bg-pink-500/10 dark:bg-pink-500/5 blur-[100px] pointer-events-none" />

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
            <div className="mx-auto w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center shadow-lg shadow-purple-500/30 mb-6">
              <UserPlus className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-3">
              Join <span className="text-gradient">Mystery Message</span>
            </h1>
            <p className="text-muted-foreground font-medium">
              Sign up to start your anonymous adventure
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
                  name="username"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-semibold">Username</FormLabel>
                      <FormControl>
                        <div className="relative group">
                          <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl blur opacity-0 group-focus-within:opacity-20 transition duration-500"></div>
                          <Input 
                            placeholder="Choose a username"
                            className="relative rounded-xl border-input/50 bg-background/50 backdrop-blur-sm h-12 px-4 font-medium transition-all focus-visible:border-purple-500/50"
                            {...field}
                            onChange={(e) => {
                              field.onChange(e)
                              setUsername(e.target.value)
                            }}
                          />
                        </div>
                      </FormControl>
                      <div className="flex items-center gap-2 min-h-[24px] pt-1">
                        {isCheckingUsername && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
                        {!isCheckingUsername && usernameMessage && (
                          <motion.div 
                            initial={{ opacity: 0, x: -5 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex items-center gap-1.5"
                          >
                            {isUsernameValid ? (
                              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                            ) : (
                              <XCircle className="h-4 w-4 text-red-500" />
                            )}
                            <p className={`text-sm font-medium ${isUsernameValid ? 'text-emerald-500' : 'text-red-500'}`}>
                              {usernameMessage}
                            </p>
                          </motion.div>
                        )}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  name="email"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-semibold">Email</FormLabel>
                      <FormControl>
                        <div className="relative group">
                          <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl blur opacity-0 group-focus-within:opacity-20 transition duration-500"></div>
                          <Input 
                            type="email"
                            placeholder="you@example.com"
                            className="relative rounded-xl border-input/50 bg-background/50 backdrop-blur-sm h-12 px-4 font-medium transition-all focus-visible:border-purple-500/50"
                            {...field}
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
                          <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl blur opacity-0 group-focus-within:opacity-20 transition duration-500"></div>
                          <div className="relative">
                            <Input 
                              type={showPassword ? "text" : "password"}
                              placeholder="Create a strong password"
                              className="relative rounded-xl border-input/50 bg-background/50 backdrop-blur-sm h-12 px-4 pr-12 font-medium transition-all focus-visible:border-purple-500/50"
                              {...field}
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
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Creating account...
                    </>
                  ) : (
                    <>
                      <UserPlus className="mr-2 h-5 w-5" /> Sign Up
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
              Already a member?{' '}
              <Link href="/sign-in" className="text-indigo-500 dark:text-indigo-400 hover:text-indigo-600 dark:hover:text-indigo-300 font-semibold transition-colors">
                Sign in
              </Link>
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}

export default Page