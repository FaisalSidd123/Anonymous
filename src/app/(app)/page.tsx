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

const Home = () => {
  return (
    <main className='relative flex-grow flex flex-col items-center justify-center px-4 md:px-24 py-24 min-h-[calc(100vh-64px)] overflow-hidden'>
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-500/20 dark:bg-indigo-500/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-500/20 dark:bg-purple-500/10 blur-[120px] pointer-events-none" />

      <motion.section 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-center mb-16 relative z-10"
      >
        <h1 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight">
          Dive into the World of <br className="hidden md:block"/>
          <span className="text-gradient">Anonymous Conversations</span>
        </h1>
        <p className="text-lg md:text-2xl text-muted-foreground max-w-2xl mx-auto font-medium">
          Explore Mystery Message – Where your identity remains a secret.
        </p>
      </motion.section>
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
        className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-xl relative z-10"
      >
        <Carousel
          plugins={[Autoplay({ delay: 3000 })]}
          opts={{ align: "start", loop: true }}
          className="w-full"
        >
          <CarouselContent>
            {messages.map((message, index) => (
              <CarouselItem key={index}>
                <div className="p-2 md:p-4">
                  <Card className="glass-card border-none overflow-hidden group w-full">
                    <CardContent className="flex flex-col aspect-square items-center justify-center p-8 text-center relative">
                      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-6 text-2xl group-hover:scale-110 transition-transform duration-300">
                        💬
                      </div>
                      <p className="text-xl font-bold mb-3">{message.title}</p>
                      <p className="text-md text-muted-foreground leading-relaxed">{message.content}</p>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden md:flex -left-12 bg-background/50 backdrop-blur-sm border-white/10 hover:bg-background" />
          <CarouselNext className="hidden md:flex -right-12 bg-background/50 backdrop-blur-sm border-white/10 hover:bg-background" />
        </Carousel>
      </motion.div>
    </main>
  )
}

export default Home