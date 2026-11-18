'use client'

import { use } from 'react'
import Link from 'next/link'
import { useApp } from '@/lib/store'
import { DEMO_CAMPAIGN, formatCurrency, progressPercent } from '@/lib/demo-data'
import { PublicNav } from '@/components/layout/PublicNav'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { Button } from '@/components/ui/Button'

export default function CampaignPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const { state } = useApp()

  const space = state.spaces.find(s => s.id === id) ?? (id === DEMO_CAMPAIGN.id ? DEMO_CAMPAIGN : null)

  if (!space || space.type !== 'campaign') {
    return (
      <>
        <PublicNav />
        <main style={{ maxWidth: '40rem', margin: '0 auto', padding: '5rem 1rem' }}>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 600, color: '#061E47', marginBottom: '1rem' }}>
            Campaign not found
          </h1>
          <p style={{ color: '#1F4591', marginBottom: '2rem' }}>
            This campaign link may have expired or the campaign has concluded.
          </p>
          <Link href="/" style={{ color: '#2B6AD0' }}>Back to home</Link>
        </main>
      </>
    )
  }

  const pct = progressPercent(space.savedAmount, space.targetAmount)

  return (
    <>
      <PublicNav />
      <main>
        {/* Hero */}
        <section style={{ background: '#F3F7FF', borderBottom: '1px solid #E8EEF7', padding: '4rem 1.5rem 3rem' }}>
          <div style={{ maxWidth: '42rem', margin: '0 auto' }}>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 700, color: '#061E47', lineHeight: 1.2, marginBottom: '1.25rem', letterSpacing: '-0.02em' }}>
              {space.name}
            </h1>
            <p style={{ color: '#1F4591', fontSize: '1.125rem', marginBottom: '2.5rem', lineHeight: 1.65 }}>
              {space.purpose}
            </p>

            {/* Financial Progress Hub */}
            <div style={{ marginBottom: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.75rem' }}>
                <span style={{ fontSize: '2rem', fontWeight: 700, color: '#061E47', letterSpacing: '-0.02em' }}>
                  {formatCurrency(space.savedAmount, space.currency)}
                </span>
                <span style={{ fontSize: '1rem', color: '#1F4591', fontWeight: 500 }}>
                  target of {formatCurrency(space.targetAmount, space.currency)} ({pct}%)
                </span>
              </div>
              <ProgressBar value={pct} size="md" />
              <div style={{ display: 'flex', gap: '2rem', marginTop: '0.75rem', fontSize: '0.875rem', color: '#68A4F1' }}>
                <span>{space.donors?.length ?? 0} total contributions</span>
                {space.endDate && (
                  <span>Campaign ends: {space.endDate}</span>
                )}
              </div>
            </div>

            <Link href={`/campaign/${id}/contribute`}>
              <Button variant="primary" size="lg">
                Contribute to this campaign
              </Button>
            </Link>
          </div>
        </section>

        {/* Details & Ledger */}
        <section style={{ maxWidth: '42rem', margin: '0 auto', padding: '3rem 1.5rem' }}>
          {space.beneficiary && (
            <div style={{ marginBottom: '2.5rem' }}>
              <h2 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#061E47', marginBottom: '0.5rem' }}>
                Beneficiary
              </h2>
              <p style={{ color: '#4A5568', lineHeight: 1.6 }}>{space.beneficiary}</p>
            </div>
          )}

          <div style={{ marginBottom: '2.5rem', borderTop: '1px solid #E8EEF7', paddingTop: '2.5rem' }}>
            <h2 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#061E47', marginBottom: '0.5rem' }}>
              Organised by
            </h2>
            <p style={{ color: '#4A5568' }}>{space.members[0]?.name}</p>
          </div>

          {/* Donors */}
          {space.donors && space.donors.length > 0 && (
            <div style={{ borderTop: '1px solid #E8EEF7', paddingTop: '2.5rem' }}>
              <h2 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#061E47', marginBottom: '0.25rem' }}>
                Contributions
              </h2>
              <p style={{ fontSize: '0.875rem', color: '#718096', marginBottom: '1.25rem' }}>
                Contributions are anonymous by default unless the contributor opted to display their name.
              </p>
              <div className="divide-y divide-[#E8EEF7]">
                {space.donors.map((donor) => (
                  <div
                    key={donor.id}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '0.875rem 0',
                    }}
                  >
                    <div>
                      <span style={{ color: '#061E47', fontWeight: 500 }}>{donor.displayName}</span>
                      <span style={{ display: 'block', fontSize: '0.75rem', color: '#718096' }}>{donor.date}</span>
                    </div>
                    <span style={{ color: '#3CB371', fontWeight: 600 }}>
                      +{formatCurrency(donor.amount, donor.currency)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div style={{ marginTop: '3.5rem', paddingTop: '2.5rem', borderTop: '1px solid #E8EEF7', textAlign: 'center' }}>
            <Link href={`/campaign/${id}/contribute`}>
              <Button variant="primary" size="lg">
                Contribute to this campaign
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-[#E2E8F0]">
        <div className="max-w-3xl mx-auto px-5 py-8 flex flex-wrap items-center justify-between gap-4">
          <span className="text-base font-bold text-[#1F4591]">noma.</span>
          <div className="flex items-center gap-6 text-sm text-[#718096]">
            <Link href="/" className="hover:text-[#1F4591] transition-colors">
              Home
            </Link>
            <Link href="/sign-up" className="hover:text-[#1F4591] transition-colors">
              Create an account
            </Link>
          </div>
        </div>
      </footer>
    </>
  )
}
