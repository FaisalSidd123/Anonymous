'use client'
import * as React from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import Autoplay from "embla-carousel-autoplay"
import messages from '@/messages.json'
import Link from "next/link"
import { Button } from "@/components/ui/button"

const Home = () => {
  return (
    <main className='relative flex-grow flex flex-col items-center justify-center px-4 md:px-12 lg:px-24 py-12 min-h-[calc(100vh-64px)] overflow-hidden'>
      {/* Dynamic Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-500/15 dark:bg-indigo-500/10 blur-[130px] pointer-events-none animate-pulse-slow" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-purple-500/15 dark:bg-purple-500/10 blur-[130px] pointer-events-none animate-pulse-slow" style={{animationDelay: "2s"}} />
      
      <div className="z-10 w-full max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        
        {/* Left Side: Hero Text */}
        <motion.section 
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center lg:text-left order-2 lg:order-1 flex flex-col items-center lg:items-start"
        >
          <div className="inline-block py-1 px-3 rounded-full glass border-indigo-500/30 text-indigo-600 dark:text-indigo-400 font-bold mb-6 shadow-sm text-sm tracking-wide uppercase">
            Start receiving feedback 🚀
          </div>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6 tracking-tight leading-[1.1]">
            Dive into the World of <br className="hidden md:block"/>
            <span className="text-gradient">Anonymous</span> <br className="hidden md:block" /> Conversations
          </h1>
          <p className="text-lg md:text-2xl text-muted-foreground max-w-xl font-medium mb-10 leading-relaxed">
            Explore Anonymous – Where your identity remains a secret, but your voice is heard loud and clear.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Link href="/sign-up">
                <Button size="lg" className="w-full sm:w-auto px-8 py-6 text-lg rounded-2xl font-bold shadow-xl shadow-primary/25 hover:scale-105 transition-all">
                    Get Started Free
                </Button>
            </Link>
            <Link href="/sign-in">
                <Button size="lg" variant="outline" className="w-full sm:w-auto px-8 py-6 text-lg rounded-2xl font-bold glass shadow-sm hover:scale-105 transition-all border-input/50">
                    Sign In
                </Button>
            </Link>
          </div>
        </motion.section>
        
        {/* Right Side: Message Carousel */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, x: 40 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="w-full order-1 lg:order-2 relative"
        >
          {/* Decorative backdrop for carousel */}
          <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/10 to-purple-500/10 rounded-[3rem] transform rotate-3 scale-105 blur-md -z-10"></div>
          
          <Carousel
            plugins={[Autoplay({ delay: 3500 })]}
            opts={{ align: "start", loop: true }}
            className="w-full"
          >
            <CarouselContent className="-ml-2 md:-ml-4">
              {messages.map((message, index) => (
                <CarouselItem key={index} className="pl-2 md:pl-4">
                  <div className="p-2 sm:p-4">
                    <Card className="glass-card border border-white/20 dark:border-white/10 overflow-hidden group w-full rounded-3xl shadow-2xl">
                      <CardContent className="flex flex-col aspect-square items-center justify-center p-8 text-center relative h-full min-h-[300px] md:min-h-[400px]">
                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-transparent to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                        
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center mb-8 text-3xl group-hover:scale-110 group-hover:rotate-12 transition-transform duration-500 shadow-lg shadow-indigo-500/30">
                           <span className="drop-shadow-md">💬</span>
                        </div>
                        
                        <p className="text-2xl font-black mb-4 tracking-tight relative z-10">{message.title}</p>
                        <p className="text-lg text-muted-foreground leading-relaxed font-medium relative z-10">"{message.content}"</p>
                        
                        {/* Decorative quotes */}
                        <div className="absolute top-10 left-10 text-8xl text-indigo-500/10 dark:text-indigo-400/5 font-serif select-none pointer-events-none">"</div>
                        <div className="absolute bottom-10 right-10 text-8xl text-purple-500/10 dark:text-purple-400/5 font-serif select-none pointer-events-none rotate-180">"</div>

                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            {/* Nav buttons hidden on mobile, visible on lg */}
            <CarouselPrevious className="hidden lg:flex -left-6 bg-background/80 backdrop-blur-md border-white/20 hover:bg-background hover:scale-110 transition-all text-foreground h-12 w-12 shadow-lg z-20" />
            <CarouselNext className="hidden lg:flex -right-6 bg-background/80 backdrop-blur-md border-white/20 hover:bg-background hover:scale-110 transition-all text-foreground h-12 w-12 shadow-lg z-20" />
          </Carousel>
        </motion.div>

      </div>
    </main>
  )
}

export default Home