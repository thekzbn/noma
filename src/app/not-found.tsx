import Link from 'next/link'
import { PublicNav } from '@/components/layout/PublicNav'
import { Button } from '@/components/ui/Button'

export default function NotFound() {
  return (
    <>
      <PublicNav />
      <main className="max-w-xl mx-auto px-6 py-24 text-center">
        <p className="text-xs font-semibold tracking-wider uppercase text-[#1F4591] mb-3">
          Page not found
        </p>
        <h1 className="text-3xl font-semibold text-[#061E47] mb-4">
          We couldn&apos;t find what you were looking for.
        </h1>
        <p className="text-base text-[#1F4591] mb-8 leading-relaxed">
          The link you followed may have changed, or the page may have moved. You can return home or go to your savings spaces.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link href="/">
            <Button variant="primary">Return home</Button>
          </Link>
          <Link href="/app">
            <Button variant="secondary">Go to spaces</Button>
          </Link>
        </div>
      </main>
    </>
  )
}
