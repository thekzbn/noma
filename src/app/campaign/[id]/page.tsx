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

  // Look in state.spaces first (for user-created campaigns), fallback to DEMO_CAMPAIGN
  const space = state.spaces.find(s => s.id === id) ?? (id === DEMO_CAMPAIGN.id ? DEMO_CAMPAIGN : null)

  if (!space || space.type !== 'campaign') {
    return (
      <>
        <PublicNav />
        <main style={{ maxWidth: '40rem', margin: '0 auto', padding: '5rem 1rem' }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 600, color: '#061E47', marginBottom: '1rem' }}>
            Campaign not found
          </h1>
          <p style={{ color: '#1F4591', marginBottom: '2rem' }}>
            This campaign link may have expired or the campaign may have ended.
          </p>
          <Link href="/" style={{ color: '#2B6AD0' }}>Back to Noma</Link>
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
        <section style={{ background: '#F3F7FF', borderBottom: '1px solid #E8EEF7', padding: '3.5rem 1.5rem 2.5rem' }}>
          <div style={{ maxWidth: '40rem', margin: '0 auto' }}>
            <div style={{ marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#1F4591', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Community campaign
              </span>
            </div>
            <h1 style={{ fontSize: '2rem', fontWeight: 700, color: '#061E47', lineHeight: 1.25, marginBottom: '1rem' }}>
              {space.name}
            </h1>
            <p style={{ color: '#1F4591', fontSize: '1rem', marginBottom: '2rem', lineHeight: 1.65 }}>
              {space.purpose}
            </p>

            {/* Progress */}
            <div style={{ marginBottom: '1.5rem' }}>
              <ProgressBar value={pct} />
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.75rem', fontSize: '0.9375rem' }}>
                <span style={{ color: '#061E47', fontWeight: 600 }}>
                  {formatCurrency(space.savedAmount, space.currency)} raised
                </span>
                <span style={{ color: '#1F4591' }}>
                  of {formatCurrency(space.targetAmount, space.currency)}
                </span>
              </div>
              <div style={{ display: 'flex', gap: '1.5rem', marginTop: '0.5rem', fontSize: '0.875rem', color: '#68A4F1' }}>
                <span>{space.donors?.length ?? 0} contributions</span>
                {space.endDate && (
                  <span>Ends {space.endDate}</span>
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

        {/* Details */}
        <section style={{ maxWidth: '40rem', margin: '0 auto', padding: '2.5rem 1.5rem' }}>
          {space.beneficiary && (
            <div style={{ marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '0.875rem', fontWeight: 600, color: '#1F4591', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
                Beneficiary
              </h2>
              <p style={{ color: '#061E47' }}>{space.beneficiary}</p>
            </div>
          )}

          <div style={{ marginBottom: '2rem', borderTop: '1px solid #E8EEF7', paddingTop: '2rem' }}>
            <h2 style={{ fontSize: '0.875rem', fontWeight: 600, color: '#1F4591', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1rem' }}>
              Organiser
            </h2>
            <p style={{ color: '#061E47' }}>{space.members[0]?.name}</p>
          </div>

          {/* Donors */}
          {space.donors && space.donors.length > 0 && (
            <div style={{ borderTop: '1px solid #E8EEF7', paddingTop: '2rem' }}>
              <h2 style={{ fontSize: '0.875rem', fontWeight: 600, color: '#1F4591', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1rem' }}>
                Recent contributions
              </h2>
              <p style={{ fontSize: '0.8125rem', color: '#68A4F1', marginBottom: '1rem' }}>
                Contributions are anonymous by default. Names appear only if the donor chose to share them.
              </p>
              <div>
                {space.donors.map((donor, i) => (
                  <div
                    key={donor.id}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '0.75rem 0',
                      borderBottom: i < space.donors!.length - 1 ? '1px solid #E8EEF7' : 'none',
                    }}
                  >
                    <span style={{ color: '#061E47' }}>{donor.displayName}</span>
                    <span style={{ color: '#1F4591', fontWeight: 500 }}>
                      {formatCurrency(donor.amount, donor.currency)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid #E8EEF7', textAlign: 'center' }}>
            <Link href={`/campaign/${id}/contribute`}>
              <Button variant="primary" size="lg">
                Contribute to this campaign
              </Button>
            </Link>
          </div>
        </section>
      </main>
    </>
  )
}
