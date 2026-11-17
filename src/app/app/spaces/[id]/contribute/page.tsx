'use client'

import { use, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useSpaces, useApp } from '@/lib/store'
import { formatCurrency, type Transaction } from '@/lib/demo-data'
import { AppShell } from '@/components/layout/AppShell'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

type Step = 'amount' | 'review' | 'processing' | 'confirmed' | 'failed'

export default function ContributePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const { spaces, updateSpace } = useSpaces()
  const { showToast } = useApp()

  const space = spaces.find(s => s.id === id)

  const [step, setStep] = useState<Step>('amount')
  const [amount, setAmount] = useState('')
  const [amountError, setAmountError] = useState('')
  const [method, setMethod] = useState<'bank' | 'card'>('bank')
  const [reference, setReference] = useState('')

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
  const remaining = currentSpace.targetAmount - currentSpace.savedAmount
  const parsedAmount = parseFloat(amount)

  function validateAmount(): boolean {
    if (!amount || isNaN(parsedAmount) || parsedAmount <= 0) {
      setAmountError('Enter an amount greater than £0.')
      return false
    }
    if (parsedAmount > remaining + 0.001) {
      setAmountError(`The most you can contribute right now is ${formatCurrency(remaining, currentSpace.currency)}.`)
      return false
    }
    setAmountError('')
    return true
  }

  function handleAmountSubmit() {
    if (!validateAmount()) return
    setStep('review')
  }

  function handleConfirm() {
    setStep('processing')
    setTimeout(() => {
      const ref = 'NMA-' + Math.random().toString(36).slice(2, 9).toUpperCase()
      setReference(ref)

      const newTransaction: Transaction = {
        id: 'txn-' + Date.now(),
        type: 'contribution',
        amount: parsedAmount,
        currency: currentSpace.currency,
        date: new Date().toISOString(),
        note: 'Manual contribution',
        status: 'completed',
        memberName: 'You',
        reference: ref,
      }

      updateSpace({
        ...currentSpace,
        savedAmount: currentSpace.savedAmount + parsedAmount,
        transactions: [...currentSpace.transactions, newTransaction],
      })

      showToast(`${formatCurrency(parsedAmount, currentSpace.currency)} added to ${currentSpace.name}.`, 'success')
      setStep('confirmed')
    }, 1800)
  }

  return (
    <AppShell>
      <div style={{ maxWidth: '32rem', margin: '0 auto', padding: '2.5rem 1rem' }}>
        {/* Back link */}
        {(step === 'amount' || step === 'review') && (
          <Link
            href={`/app/spaces/${id}`}
            style={{ color: '#2B6AD0', fontSize: '0.875rem', display: 'inline-block', marginBottom: '1.5rem' }}
          >
            ← {space.name}
          </Link>
        )}

        {/* STEP: Amount */}
        {step === 'amount' && (
          <>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 600, color: '#061E47', marginBottom: '0.25rem' }}>
              Add to {space.name}
            </h1>
            <p style={{ color: '#1F4591', marginBottom: '2rem', fontSize: '0.9375rem' }}>
              {formatCurrency(space.savedAmount, space.currency)} saved of {formatCurrency(space.targetAmount, space.currency)}
            </p>

            <div style={{ marginBottom: '1.5rem' }}>
              <Input
                label="Amount (£)"
                type="number"
                min="0.01"
                step="0.01"
                placeholder="0.00"
                value={amount}
                onChange={e => { setAmount(e.target.value); setAmountError('') }}
                error={amountError}
                hint={remaining > 0 ? `Up to ${formatCurrency(remaining, space.currency)} remaining to goal` : 'Goal already reached.'}
              />
            </div>

            <fieldset style={{ marginBottom: '2rem', border: 'none', padding: 0 }}>
              <legend style={{ fontSize: '0.875rem', fontWeight: 500, color: '#061E47', marginBottom: '0.75rem' }}>
                Payment method
              </legend>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {(['bank', 'card'] as const).map(m => (
                  <label
                    key={m}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      cursor: 'pointer',
                      padding: '0.875rem 1rem',
                      border: `1.5px solid ${method === m ? '#2B6AD0' : '#D1D9E6'}`,
                      borderRadius: '8px',
                      background: method === m ? '#EEF4FF' : '#FEFEFE',
                    }}
                  >
                    <input
                      type="radio"
                      name="method"
                      value={m}
                      checked={method === m}
                      onChange={() => setMethod(m)}
                      style={{ accentColor: '#2B6AD0' }}
                    />
                    <span style={{ color: '#061E47', fontWeight: 500 }}>
                      {m === 'bank' ? 'Bank transfer' : 'Debit / credit card'}
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>

            <Button variant="primary" size="lg" fullWidth onClick={handleAmountSubmit}>
              Review contribution
            </Button>
          </>
        )}

        {/* STEP: Review */}
        {step === 'review' && (
          <>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 600, color: '#061E47', marginBottom: '1.75rem' }}>
              Review
            </h1>

            <dl style={{ marginBottom: '2rem' }}>
              {[
                ['Space', space.name],
                ['Amount', formatCurrency(parsedAmount, space.currency)],
                ['Method', method === 'bank' ? 'Bank transfer' : 'Debit / credit card'],
                ['Fee', '£0.00 (demo)'],
              ].map(([label, value]) => (
                <div
                  key={label}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '0.75rem 0',
                    borderBottom: '1px solid #E8EEF7',
                  }}
                >
                  <dt style={{ color: '#1F4591', fontSize: '0.875rem' }}>{label}</dt>
                  <dd style={{ color: '#061E47', fontWeight: 500 }}>{value}</dd>
                </div>
              ))}
            </dl>

            <p style={{ fontSize: '0.8125rem', color: '#68A4F1', marginBottom: '2rem' }}>
              Demo — no payment is processed. This contribution will be reflected in your space immediately.
            </p>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <Button variant="secondary" onClick={() => setStep('amount')}>Back</Button>
              <Button variant="primary" fullWidth onClick={handleConfirm}>Confirm</Button>
            </div>
          </>
        )}

        {/* STEP: Processing */}
        {step === 'processing' && (
          <div style={{ textAlign: 'center', paddingTop: '4rem' }}>
            <div
              style={{
                width: '2.5rem',
                height: '2.5rem',
                border: '3px solid #E8EEF7',
                borderTopColor: '#2B6AD0',
                borderRadius: '50%',
                animation: 'spin 0.8s linear infinite',
                margin: '0 auto 1.5rem',
              }}
            />
            <p style={{ color: '#061E47', fontWeight: 500 }}>Processing…</p>
          </div>
        )}

        {/* STEP: Confirmed */}
        {step === 'confirmed' && (
          <div style={{ paddingTop: '2rem' }}>
            <div style={{ marginBottom: '1.5rem' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: '#EDFAF3', color: '#3CB371', borderRadius: '50%', width: '3rem', height: '3rem', fontSize: '1.25rem', fontWeight: 700 }}>✓</span>
            </div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 600, color: '#061E47', marginBottom: '0.5rem' }}>
              Contribution confirmed
            </h1>
            <p style={{ color: '#1F4591', marginBottom: '1.75rem' }}>
              {formatCurrency(parsedAmount, space.currency)} has been added to {space.name}.
            </p>

            <dl style={{ marginBottom: '2rem' }}>
              {[
                ['Reference', reference],
                ['Amount', formatCurrency(parsedAmount, space.currency)],
                ['Space', space.name],
              ].map(([label, value]) => (
                <div
                  key={label}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '0.75rem 0',
                    borderBottom: '1px solid #E8EEF7',
                  }}
                >
                  <dt style={{ color: '#1F4591', fontSize: '0.875rem' }}>{label}</dt>
                  <dd style={{ color: '#061E47', fontWeight: 500 }}>{value}</dd>
                </div>
              ))}
            </dl>

            <Button variant="primary" onClick={() => router.push(`/app/spaces/${id}`)}>
              Back to space
            </Button>
          </div>
        )}

        {/* STEP: Failed */}
        {step === 'failed' && (
          <div style={{ paddingTop: '2rem' }}>
            <div style={{ marginBottom: '1.5rem' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: '#FFF1EE', color: '#FF6347', borderRadius: '50%', width: '3rem', height: '3rem', fontSize: '1.1rem', fontWeight: 700 }}>✕</span>
            </div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 600, color: '#061E47', marginBottom: '0.5rem' }}>
              Payment failed
            </h1>
            <p style={{ color: '#1F4591', marginBottom: '2rem' }}>
              Your payment couldn&apos;t be processed. No money has been taken. Try again or use a different payment method.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <Button variant="secondary" onClick={() => setStep('review')}>Try again</Button>
              <Button variant="ghost" onClick={() => router.push(`/app/spaces/${id}`)}>Cancel</Button>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  )
}
