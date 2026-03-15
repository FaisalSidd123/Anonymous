'use client'
import React from 'react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { User } from 'next-auth'
import { Button } from '@/components/ui/button'
import { ModeToggle } from '@/components/ModeToggle'
import { motion } from 'framer-motion'
import { LogOut, LayoutDashboard, UserPlus, LogIn } from 'lucide-react'

const Navbar = () => {
    const { data: session } = useSession()
    const user: User = session?.user as User

    return (
        <motion.nav 
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className='sticky top-0 z-50 w-full glass border-b'
        >
            <div className='container mx-auto px-6 h-16 flex justify-between items-center'>
                <Link href="/" className='flex items-center gap-2 group'>
                    <div className='w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg group-hover:shadow-indigo-500/50 transition-all'>
                        <span className='text-white font-bold text-lg'>M</span>
                    </div>
                    <span className='hidden sm:block text-xl font-bold tracking-tight'>Mstr<span className='text-indigo-500 dark:text-indigo-400'>Msg</span></span>
                </Link>

                <div className='flex items-center gap-4'>
                    <ModeToggle />
                    
                    {session ? (
                        <div className="flex items-center gap-3">
                            <span className='hidden md:block text-sm font-medium text-muted-foreground mr-2'>
                                Welcome back, <span className="text-foreground font-bold">{user?.username || user?.email}</span>
                            </span>
                            <Link href="/dashboard">
                                <Button variant="secondary" size="sm" className="hidden sm:flex gap-2">
                                    <LayoutDashboard className="w-4 h-4" /> Dashboard
                                </Button>
                            </Link>
                            <Button variant="destructive" size="sm" className='gap-2 shadow-sm' onClick={() => signOut()}>
                                <LogOut className="w-4 h-4" /> <span className="hidden sm:inline">Log Out</span>
                            </Button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-3">
                            <Link href={'/sign-in'}>
                                <Button variant="ghost" size="sm" className='gap-2 hidden sm:flex'>
                                    <LogIn className="w-4 h-4" /> Login
                                </Button>
                            </Link>
                            <Link href={'/sign-up'}>
                                <Button size="sm" className='bg-primary text-primary-foreground hover:bg-primary/90 gap-2 shadow-md shadow-primary/20'>
                                    <UserPlus className="w-4 h-4" /> Sign Up
                                </Button>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </motion.nav>
    )
}

export default Navbar