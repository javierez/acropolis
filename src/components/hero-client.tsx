"use client";

import { motion } from "framer-motion";
import { Button } from "~/components/ui/button";
import Link from "next/link";
import Image from "next/image";
// import { fadeInLeft, fadeInRight, scaleIn, pulseAnimation } from "~/lib/animations";

interface HeroClientProps {
  title: string;
  subtitle: string;
  findPropertyButton: string;
  contactButton: string;
  backgroundType?: "image" | "video";
  backgroundVideo?: string;
  backgroundImage?: string;
}

export function HeroClient({
  title,
  subtitle,
  findPropertyButton,
  contactButton,
  backgroundType = "image",
  backgroundVideo,
  backgroundImage,
}: HeroClientProps) {
  return (
    <section className="relative mb-8 overflow-hidden sm:mb-12 md:mb-[60px] lg:mb-[70px]">
      {/* Video or Image Background */}
      {backgroundType === "video" && backgroundVideo ? (
        <>
          <div className="absolute inset-0 -z-20">
            <video
              autoPlay
              loop
              muted
              playsInline
              className="h-full w-full object-cover"
            >
              <source src={backgroundVideo} type="video/mp4" />
            </video>
          </div>
          {/* Dark overlay for better text readability */}
          <div className="absolute inset-0 -z-10 bg-black/40" />
        </>
      ) : backgroundImage ? (
        <>
          <div className="absolute inset-0 -z-20">
            <Image
              src={backgroundImage}
              alt="Hero background"
              fill
              className="object-cover"
              priority
            />
          </div>
          {/* Dark overlay for better text readability */}
          <div className="absolute inset-0 -z-10 bg-black/40" />
        </>
      ) : null}

      {/* Decorative animated orbs */}
      <motion.div
        className="absolute left-10 top-20 h-64 w-64 rounded-full bg-gradient-to-r from-amber-400/10 to-rose-400/10 blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute right-10 bottom-10 h-48 w-48 rounded-full bg-gradient-to-r from-blue-400/10 to-purple-400/10 blur-3xl"
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
      />

      <div className="container pb-20 pt-6 sm:pb-32 sm:pt-10 md:pb-40 md:pt-8 lg:pb-48 lg:pt-12">
        <div className="max-w-3xl space-y-4 px-4 sm:ml-8 sm:space-y-5 md:ml-12 lg:mx-auto lg:px-4">
          {/* Animated title */}
          <motion.h1
            className="text-5xl font-bold leading-tight text-white sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {title.split(" ").map((word, index) => {
              // Highlight "Acropolis" with gradient animation
              if (word === "Acropolis") {
                return (
                  <motion.span
                    key={index}
                    className="bg-gradient-to-r from-amber-400 to-rose-400 bg-clip-text text-transparent"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                  >
                    {word}{" "}
                  </motion.span>
                );
              }
              return <span key={index}>{word} </span>;
            })}
          </motion.h1>

          {/* Animated subtitle */}
          <motion.p
            className="max-w-2xl text-base leading-relaxed text-white/90 sm:text-lg md:text-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {subtitle}
          </motion.p>

          {/* Animated buttons */}
          <motion.div
            className="flex max-w-md flex-col gap-3 pt-2 sm:flex-row sm:gap-4 sm:pt-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                size="lg"
                className="w-full min-w-0 bg-white text-black hover:bg-white/90 sm:w-auto"
                asChild
              >
                <Link href="/venta-propiedades/todas-ubicaciones">{findPropertyButton}</Link>
              </Button>
            </motion.div>
            
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                size="lg"
                className="w-full min-w-0 !bg-black/80 !text-white hover:!bg-gray-900/90 hover:!text-white sm:w-auto"
                asChild
              >
                <Link href="#contact">{contactButton}</Link>
              </Button>
            </motion.div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}