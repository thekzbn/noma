'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { PublicNav } from '@/components/layout/PublicNav'
import { Button } from '@/components/ui/Button'

const MESSAGES = [
  "You've ₦ot found what you're looking for.",
  "We couldn't $ave you there.",
  "This page is out of your €lement.",
  "You've ₦ot found what you're looking for.",
  "This page isn't worth a ¥en.",
  "Something went ₹ong.",
  "This page is off the ₿lock.",
]

export default function NotFound() {
  const [msgIndex, setMsgIndex] = useState(0)
  const [displayedText, setDisplayedText] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)

  const currentMessage = MESSAGES[msgIndex]
  const isNaira = currentMessage.includes('₦')

  useEffect(() => {
    let timer: NodeJS.Timeout

    if (!isDeleting) {
      if (displayedText.length < currentMessage.length) {
        timer = setTimeout(() => {
          setDisplayedText(currentMessage.slice(0, displayedText.length + 1))
        }, 55)
      } else {
        // Full message typed: pause. Naira lingers longer.
        const pauseTime = isNaira ? 3200 : 2000
        timer = setTimeout(() => {
          setIsDeleting(true)
        }, pauseTime)
      }
    } else {
      if (displayedText.length > 0) {
        timer = setTimeout(() => {
          setDisplayedText(currentMessage.slice(0, displayedText.length - 1))
        }, 28)
      } else {
        timer = setTimeout(() => {
          setIsDeleting(false)
          setMsgIndex((prev) => (prev + 1) % MESSAGES.length)
        }, 200)
      }
    }

    return () => clearTimeout(timer)
  }, [displayedText, isDeleting, currentMessage, isNaira])

  return (
    <>
      <PublicNav />
      <main className="max-w-2xl mx-auto px-6 py-28 text-center flex flex-col items-center justify-center min-h-[60vh]">
        <div className="h-20 flex items-center justify-center mb-6">
          <h1 className="text-3xl sm:text-4xl font-semibold text-[#061E47] tracking-tight">
            <span>{displayedText}</span>
            <span className="inline-block w-0.5 h-8 ml-1 bg-[#2B6AD0] animate-pulse align-middle" />
          </h1>
        </div>

        <p className="text-base text-[#1F4591] mb-10 leading-relaxed max-w-md">
          The link you followed might be broken or the space may have moved. You can return home or go straight to your savings spaces.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link href="/app">
            <Button variant="primary" size="lg">Go to savings spaces</Button>
          </Link>
          <Link href="/">
            <Button variant="secondary" size="lg">Return home</Button>
          </Link>
        </div>
      </main>
    </>
  )
}
