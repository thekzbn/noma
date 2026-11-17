'use client'

import { use, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useSpaces, useApp } from '@/lib/store'
import { formatCurrency, type PayoutRequest } from '@/lib/demo-data'
import { AppShell } from '@/components/layout/AppShell'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

type Step = 'form' | 'review' | 'processing' | 'pending' | 'confirmed'

export default function PayoutPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const { spaces, updateSpace } = useSpaces()
  const { showToast } = useApp()

  const space = spaces.find(s => s.id === id)

  const [step, setStep] = useState<Step>('form')
  const [amount, setAmount] = useState('')
  const [destination, setDestination] = useState('')
  const [reason, setReason] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})

  if (!space) {
    return (
      <AppShell>
        <div style={{ maxWidth: '32rem', margin: '0 auto', padding: '4rem 1rem' }}>
          <p style={{ color: '#061E47', marginBottom: '1rem' }}>Space not found.</p>
          <Link href="/app" style={{ color: '#2B6AD0' }}>Back to spaces</Link>
        </div>
      </AppShell>
    )
  }

  const currentSpace = space
  const parsedAmount = parseFloat(amount)
  const needsApproval = currentSpace.type === 'community' || currentSpace.type === ('ajo' as string)

  function validate(): boolean {
    const e: Record<string, string> = {}
    if (!amount || isNaN(parsedAmount) || parsedAmount <= 0)
      e.amount = 'Enter an amount greater than £0.'
    else if (parsedAmount > currentSpace.savedAmount + 0.001)
      e.amount = `Available balance is ${formatCurrency(currentSpace.savedAmount, currentSpace.currency)}.`
    if (!destination.trim()) e.destination = 'Enter a destination account or name.'
    if (!reason.trim()) e.reason = 'Explain why you are requesting this payout.'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  function handleSubmit() {
    if (!validate()) return
    setStep('review')
  }

  function handleConfirm() {
    setStep('processing')
    setTimeout(() => {
      const newPayout: PayoutRequest = {
        id: 'payout-' + Date.now(),
        requestedBy: 'You (demo)',
        requestedAt: new Date().toISOString(),
        amount: parsedAmount,
        currency: currentSpace.currency,
        destination,
        reason,
        status: needsApproval ? 'pending' : 'approved',
        approvalsRequired: needsApproval ? (currentSpace.governanceThreshold ?? 2) : 0,
        approvalsReceived: [],
      }

      updateSpace({
        ...currentSpace,
        savedAmount: needsApproval ? currentSpace.savedAmount : currentSpace.savedAmount - parsedAmount,
        payoutRequests: [...currentSpace.payoutRequests, newPayout],
      })

      showToast(
        needsApproval
          ? 'Payout request submitted — awaiting approval.'
          : `${formatCurrency(parsedAmount, currentSpace.currency)} payout confirmed.`,
        'success'
      )

      setStep(needsApproval ? 'pending' : 'confirmed')
    }, 1600)
  }

  return (
    <AppShell>
      <div style={{ maxWidth: '32rem', margin: '0 auto', padding: '2.5rem 1rem' }}>
        {(step === 'form' || step === 'review') && (
          <Link href={`/app/spaces/${id}`} style={{ color: '#2B6AD0', fontSize: '0.875rem', display: 'inline-block', marginBottom: '1.5rem' }}>
            ← {space.name}
          </Link>
        )}

        {/* STEP: Form */}
        {step === 'form' && (
          <>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 600, color: '#061E47', marginBottom: '0.25rem' }}>
              Request a payout
            </h1>
            <p style={{ color: '#1F4591', marginBottom: '0.375rem', fontSize: '0.9375rem' }}>
              Available: {formatCurrency(space.savedAmount, space.currency)}
            </p>
            {needsApproval && (
              <p style={{ color: '#68A4F1', fontSize: '0.875rem', marginBottom: '2rem' }}>
                This space requires {space.governanceThreshold ?? 2} member approvals before a payout is released.
              </p>
            )}
            {!needsApproval && <div style={{ marginBottom: '2rem' }} />}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '2rem' }}>
              <Input
                label="Amount (£)"
                type="number"
                min="0.01"
                step="0.01"
                placeholder="0.00"
                value={amount}
                onChange={e => { setAmount(e.target.value); setErrors(prev => ({ ...prev, amount: '' })) }}
                error={errors.amount}
              />
              <Input
                label="Destination"
                type="text"
                placeholder="Account name or reference"
                value={destination}
                onChange={e => { setDestination(e.target.value); setErrors(prev => ({ ...prev, destination: '' })) }}
                error={errors.destination}
                hint="Where the funds should be sent"
              />
              <Input
                label="Reason"
                type="text"
                placeholder="Why are you requesting this payout?"
                value={reason}
                onChange={e => { setReason(e.target.value); setErrors(prev => ({ ...prev, reason: '' })) }}
                error={errors.reason}
              />
            </div>

            <Button variant="primary" size="lg" fullWidth onClick={handleSubmit}>
              Review request
            </Button>
          </>
        )}

        {/* STEP: Review */}
        {step === 'review' && (
          <>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 600, color: '#061E47', marginBottom: '1.75rem' }}>
              Review payout request
            </h1>
            <dl style={{ marginBottom: '1.5rem' }}>
              {[
                ['Space', space.name],
                ['Amount', formatCurrency(parsedAmount, space.currency)],
                ['Destination', destination],
                ['Reason', reason],
                ['Approvals needed', needsApproval ? `${space.governanceThreshold ?? 2} members` : 'None — instant release'],
              ].map(([label, value]) => (
                <div
                  key={label}
                  style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0', borderBottom: '1px solid #E8EEF7' }}
                >
                  <dt style={{ color: '#1F4591', fontSize: '0.875rem' }}>{label}</dt>
                  <dd style={{ color: '#061E47', fontWeight: 500, maxWidth: '55%', textAlign: 'right' }}>{value}</dd>
                </div>
              ))}
            </dl>
            <p style={{ fontSize: '0.8125rem', color: '#68A4F1', marginBottom: '2rem' }}>
              Demo — no actual transfer takes place.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <Button variant="secondary" onClick={() => setStep('form')}>Back</Button>
              <Button variant="primary" fullWidth onClick={handleConfirm}>Submit request</Button>
            </div>
          </>
        )}

        {/* STEP: Processing */}
        {step === 'processing' && (
          <div style={{ textAlign: 'center', paddingTop: '4rem' }}>
            <div style={{ width: '2.5rem', height: '2.5rem', border: '3px solid #E8EEF7', borderTopColor: '#2B6AD0', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 1.5rem' }} />
            <p style={{ color: '#061E47', fontWeight: 500 }}>Submitting request…</p>
          </div>
        )}

        {/* STEP: Pending */}
        {step === 'pending' && (
          <div style={{ paddingTop: '2rem' }}>
            <div style={{ marginBottom: '1.5rem' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: '#FFF8E6', color: '#C17D00', borderRadius: '50%', width: '3rem', height: '3rem', fontSize: '1.1rem' }}>⏱</span>
            </div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 600, color: '#061E47', marginBottom: '0.5rem' }}>
              Request submitted
            </h1>
            <p style={{ color: '#1F4591', marginBottom: '0.75rem' }}>
              Your payout request for {formatCurrency(parsedAmount, space.currency)} is waiting for{' '}
              {space.governanceThreshold ?? 2} member approvals. You&apos;ll see it in the space activity once approved.
            </p>
            <p style={{ color: '#68A4F1', fontSize: '0.875rem', marginBottom: '2rem' }}>
              Members with approval permission will be notified.
            </p>
            <Button variant="primary" onClick={() => router.push(`/app/spaces/${id}`)}>
              Back to space
            </Button>
          </div>
        )}

        {/* STEP: Confirmed */}
        {step === 'confirmed' && (
          <div style={{ paddingTop: '2rem' }}>
            <div style={{ marginBottom: '1.5rem' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: '#EDFAF3', color: '#3CB371', borderRadius: '50%', width: '3rem', height: '3rem', fontSize: '1.25rem', fontWeight: 700 }}>✓</span>
            </div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 600, color: '#061E47', marginBottom: '0.5rem' }}>
              Payout confirmed
            </h1>
            <p style={{ color: '#1F4591', marginBottom: '2rem' }}>
              {formatCurrency(parsedAmount, space.currency)} will be sent to {destination}.
            </p>
            <Button variant="primary" onClick={() => router.push(`/app/spaces/${id}`)}>
              Back to space
            </Button>
          </div>
        )}
      </div>
    </AppShell>
  )
}
