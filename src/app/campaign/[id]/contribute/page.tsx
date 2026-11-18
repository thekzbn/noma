'use client'

import { use, useState } from 'react'
import Link from 'next/link'
import { useApp } from '@/lib/store'
import { DEMO_CAMPAIGN, formatCurrency, type DonorEntry } from '@/lib/demo-data'
import { PublicNav } from '@/components/layout/PublicNav'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

type Step = 'amount' | 'identity' | 'payment' | 'review' | 'processing' | 'confirmed' | 'pending' | 'failed'

export default function CampaignContributePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const { state, updateSpace } = useApp()

  const space = state.spaces.find(s => s.id === id) ?? (id === DEMO_CAMPAIGN.id ? DEMO_CAMPAIGN : null)

  const [step, setStep] = useState<Step>('amount')
  const [amount, setAmount] = useState('')
  const [amountError, setAmountError] = useState('')
  const [identity, setIdentity] = useState<'anonymous' | 'named'>('anonymous')
  const [displayName, setDisplayName] = useState('')
  const [nameError, setNameError] = useState('')
  // payment details
  const [cardName, setCardName] = useState('')
  const [cardNumber, setCardNumber] = useState('')
  const [expiry, setExpiry] = useState('')
  const [cvv, setCvv] = useState('')
  const [paymentErrors, setPaymentErrors] = useState<Record<string, string>>({})
  const [reference, setReference] = useState('')

  if (!space || space.type !== 'campaign') {
    return (
      <>
        <PublicNav />
        <main style={{ maxWidth: '32rem', margin: '0 auto', padding: '5rem 1rem' }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 600, color: '#061E47', marginBottom: '1rem' }}>Campaign not found</h1>
          <Link href="/" style={{ color: '#2B6AD0' }}>Back to home</Link>
        </main>
      </>
    )
  }

  const currentSpace = space
  const parsedAmount = parseFloat(amount)

  function validateAmount(): boolean {
    if (!amount || isNaN(parsedAmount) || parsedAmount <= 0) {
      setAmountError('Enter an amount greater than £0.')
      return false
    }
    setAmountError('')
    return true
  }

  function validateIdentity(): boolean {
    if (identity === 'named' && !displayName.trim()) {
      setNameError("Enter the name you'd like to show.")
      return false
    }
    setNameError('')
    return true
  }

  function validatePayment(): boolean {
    const e: Record<string, string> = {}
    if (!cardName.trim()) e.cardName = 'Enter the name on the card.'
    if (!cardNumber.trim() || cardNumber.replace(/\s/g, '').length < 12) e.cardNumber = 'Enter a valid card number.'
    if (!expiry.trim() || !expiry.match(/^\d{2}\/\d{2}$/)) e.expiry = 'Enter expiry as MM/YY.'
    if (!cvv.trim() || cvv.length < 3) e.cvv = 'Enter a 3 or 4-digit CVV.'
    setPaymentErrors(e)
    return Object.keys(e).length === 0
  }

  function simulatePayment() {
    setStep('processing')
    setTimeout(() => {
      const ref = 'NMA-CAM-' + Math.random().toString(36).slice(2, 9).toUpperCase()
      setReference(ref)

      const chosenName = identity === 'anonymous' ? 'Anonymous' : displayName.trim()
      const newDonor: DonorEntry = {
        id: 'donor-' + Date.now(),
        displayName: chosenName,
        amount: parsedAmount,
        currency: currentSpace.currency,
        date: new Date().toISOString().slice(0, 10),
        status: 'completed',
      }

      // Update space in state
      const updated = {
        ...currentSpace,
        savedAmount: currentSpace.savedAmount + parsedAmount,
        donors: [...(currentSpace.donors ?? []), newDonor],
      }
      updateSpace(updated)

      setStep('confirmed')
    }, 1200)
  }

  const stepMap: Record<string, number> = { amount: 1, identity: 2, payment: 3, review: 4 }
  const stepNumber = stepMap[step]

  return (
    <>
      <PublicNav />
      <main style={{ maxWidth: '32rem', margin: '0 auto', padding: '2.5rem 1rem' }}>
        <Link
          href={`/campaign/${id}`}
          style={{ color: '#2B6AD0', fontSize: '0.875rem', display: 'inline-block', marginBottom: '1.5rem' }}
        >
          ← {space.name}
        </Link>

        {/* Step indicator */}
        {stepNumber && (
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem' }}>
            {[1, 2, 3, 4].map(n => (
              <div
                key={n}
                style={{
                  height: '3px',
                  flex: 1,
                  borderRadius: '2px',
                  background: n <= stepNumber ? '#2B6AD0' : '#E8EEF7',
                }}
              />
            ))}
          </div>
        )}

        {/* STEP 1: Amount */}
        {step === 'amount' && (
          <>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 600, color: '#061E47', marginBottom: '0.5rem' }}>
              How much would you like to give?
            </h1>
            <p style={{ color: '#4A5568', marginBottom: '2rem', fontSize: '0.9375rem' }}>
              Contributing to: {space.name}
            </p>
            <div style={{ marginBottom: '1.5rem' }}>
              <Input
                label="Contribution amount (£)"
                type="number"
                min="1"
                step="1"
                placeholder="0"
                value={amount}
                onChange={e => { setAmount(e.target.value); setAmountError('') }}
                error={amountError}
              />
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
              {[10, 25, 50, 100].map(n => (
                <button
                  key={n}
                  type="button"
                  onClick={() => { setAmount(String(n)); setAmountError('') }}
                  style={{
                    padding: '0.5rem 1rem',
                    borderRadius: '99px',
                    border: `1.5px solid ${parseFloat(amount) === n ? '#2B6AD0' : '#D1D9E6'}`,
                    background: parseFloat(amount) === n ? '#EEF4FF' : '#FEFEFE',
                    color: parseFloat(amount) === n ? '#1F4591' : '#4A5568',
                    cursor: 'pointer',
                    fontWeight: 500,
                    fontSize: '0.875rem',
                  }}
                >
                  £{n}
                </button>
              ))}
            </div>
            <Button variant="primary" size="lg" fullWidth onClick={() => { if (validateAmount()) setStep('identity') }}>
              Continue
            </Button>
          </>
        )}

        {/* STEP 2: Identity */}
        {step === 'identity' && (
          <>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 600, color: '#061E47', marginBottom: '0.5rem' }}>
              How would you like to appear?
            </h1>
            <p style={{ color: '#4A5568', marginBottom: '2rem', fontSize: '0.9375rem' }}>
              Your contribution of {formatCurrency(parsedAmount, space.currency)} will be recorded in the campaign ledger.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
              {(['anonymous', 'named'] as const).map(opt => (
                <label
                  key={opt}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.75rem',
                    cursor: 'pointer',
                    padding: '0.875rem 1rem',
                    border: `1.5px solid ${identity === opt ? '#2B6AD0' : '#D1D9E6'}`,
                    borderRadius: '8px',
                    background: identity === opt ? '#EEF4FF' : '#FEFEFE',
                  }}
                >
                  <input
                    type="radio"
                    name="identity"
                    value={opt}
                    checked={identity === opt}
                    onChange={() => { setIdentity(opt); setNameError('') }}
                    style={{ accentColor: '#2B6AD0', marginTop: '0.1875rem' }}
                  />
                  <div>
                    <div style={{ color: '#061E47', fontWeight: 500 }}>
                      {opt === 'anonymous' ? 'Show as Anonymous' : 'Show my name'}
                    </div>
                    <div style={{ color: '#718096', fontSize: '0.8125rem', marginTop: '0.125rem' }}>
                      {opt === 'anonymous'
                        ? 'Your contribution appears publicly as "Anonymous".'
                        : 'Your full name will be displayed next to your contribution.'}
                    </div>
                  </div>
                </label>
              ))}
            </div>

            {identity === 'named' && (
              <div style={{ marginBottom: '1.5rem' }}>
                <Input
                  label="Name to display"
                  type="text"
                  placeholder="Your full name"
                  value={displayName}
                  onChange={e => { setDisplayName(e.target.value); setNameError('') }}
                  error={nameError}
                />
              </div>
            )}

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <Button variant="secondary" onClick={() => setStep('amount')}>Back</Button>
              <Button variant="primary" fullWidth onClick={() => { if (validateIdentity()) setStep('payment') }}>Continue</Button>
            </div>
          </>
        )}

        {/* STEP 3: Payment */}
        {step === 'payment' && (
          <>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 600, color: '#061E47', marginBottom: '0.5rem' }}>
              Payment information
            </h1>
            <p style={{ color: '#4A5568', fontSize: '0.875rem', marginBottom: '2rem' }}>
              Payments are securely encrypted and processed directly.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '2rem' }}>
              <Input
                label="Name on card"
                type="text"
                placeholder="Cardholder name"
                value={cardName}
                onChange={e => { setCardName(e.target.value); setPaymentErrors(p => ({ ...p, cardName: '' })) }}
                error={paymentErrors.cardName}
              />
              <Input
                label="Card number"
                type="text"
                placeholder="0000 0000 0000 0000"
                value={cardNumber}
                onChange={e => { setCardNumber(e.target.value); setPaymentErrors(p => ({ ...p, cardNumber: '' })) }}
                error={paymentErrors.cardNumber}
              />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <Input
                  label="Expiry (MM/YY)"
                  type="text"
                  placeholder="MM/YY"
                  value={expiry}
                  onChange={e => { setExpiry(e.target.value); setPaymentErrors(p => ({ ...p, expiry: '' })) }}
                  error={paymentErrors.expiry}
                />
                <Input
                  label="Security code (CVV)"
                  type="text"
                  placeholder="123"
                  value={cvv}
                  onChange={e => { setCvv(e.target.value); setPaymentErrors(p => ({ ...p, cvv: '' })) }}
                  error={paymentErrors.cvv}
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <Button variant="secondary" onClick={() => setStep('identity')}>Back</Button>
              <Button variant="primary" fullWidth onClick={() => { if (validatePayment()) setStep('review') }}>Review</Button>
            </div>
          </>
        )}

        {/* STEP 4: Review */}
        {step === 'review' && (
          <>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 600, color: '#061E47', marginBottom: '1.75rem' }}>
              Review contribution
            </h1>
            <dl style={{ marginBottom: '1.5rem' }}>
              {[
                ['Campaign', space.name],
                ['Contribution amount', formatCurrency(parsedAmount, space.currency)],
                ['Display identity', identity === 'anonymous' ? 'Anonymous' : displayName],
                ['Processing fee', '£0.00 (Covered by campaign)'],
              ].map(([label, value]) => (
                <div
                  key={label}
                  style={{ display: 'flex', justifyContent: 'space-between', padding: '0.875rem 0', borderBottom: '1px solid #E8EEF7' }}
                >
                  <dt style={{ color: '#718096', fontSize: '0.875rem' }}>{label}</dt>
                  <dd style={{ color: '#061E47', fontWeight: 600 }}>{value}</dd>
                </div>
              ))}
            </dl>
            <p style={{ fontSize: '0.8125rem', color: '#718096', marginBottom: '2rem' }}>
              By confirming, your payment will be authorised and added immediately to the campaign total.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <Button variant="secondary" onClick={() => setStep('payment')}>Back</Button>
              <Button variant="primary" fullWidth onClick={simulatePayment}>Confirm and pay</Button>
            </div>
          </>
        )}

        {/* Processing */}
        {step === 'processing' && (
          <div style={{ textAlign: 'center', paddingTop: '4rem' }}>
            <div style={{ width: '2.5rem', height: '2.5rem', border: '3px solid #E8EEF7', borderTopColor: '#2B6AD0', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 1.5rem' }} />
            <p style={{ color: '#061E47', fontWeight: 500 }}>Authorising payment…</p>
          </div>
        )}

        {/* Confirmed */}
        {step === 'confirmed' && (
          <div style={{ paddingTop: '2rem' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: '#EDFAF3', color: '#3CB371', borderRadius: '50%', width: '3rem', height: '3rem', fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem' }}>✓</span>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 600, color: '#061E47', marginBottom: '0.5rem' }}>
              Contribution confirmed
            </h1>
            <p style={{ color: '#4A5568', marginBottom: '1.75rem' }}>
              Your contribution of {formatCurrency(parsedAmount, space.currency)} to {space.name} has been processed.
            </p>
            <dl style={{ marginBottom: '2rem' }}>
              {[
                ['Reference code', reference],
                ['Public attribution', identity === 'anonymous' ? 'Anonymous' : displayName],
                ['Total contributed', formatCurrency(parsedAmount, space.currency)],
              ].map(([label, value]) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0', borderBottom: '1px solid #E8EEF7' }}>
                  <dt style={{ color: '#718096', fontSize: '0.875rem' }}>{label}</dt>
                  <dd style={{ color: '#061E47', fontWeight: 600 }}>{value}</dd>
                </div>
              ))}
            </dl>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <Link href={`/campaign/${id}`}>
                <Button variant="primary">Return to campaign</Button>
              </Link>
              <Link href="/sign-up">
                <Button variant="secondary">Create a noma. account</Button>
              </Link>
            </div>
          </div>
        )}

        {/* Pending */}
        {step === 'pending' && (
          <div style={{ paddingTop: '2rem' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: '#FFF8E6', color: '#C17D00', borderRadius: '50%', width: '3rem', height: '3rem', fontSize: '1.1rem', marginBottom: '1.5rem' }}>⏱</span>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 600, color: '#061E47', marginBottom: '0.5rem' }}>
              Payment pending verification
            </h1>
            <p style={{ color: '#4A5568', marginBottom: '2rem' }}>
              Your payment has been submitted. As soon as the transaction settles, the campaign ledger will update automatically.
            </p>
            <Link href={`/campaign/${id}`}>
              <Button variant="secondary">Back to campaign</Button>
            </Link>
          </div>
        )}

        {/* Failed */}
        {step === 'failed' && (
          <div style={{ paddingTop: '2rem' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: '#FFF1EE', color: '#FF6347', borderRadius: '50%', width: '3rem', height: '3rem', fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.5rem' }}>✕</span>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 600, color: '#061E47', marginBottom: '0.5rem' }}>
              Payment declined
            </h1>
            <p style={{ color: '#4A5568', marginBottom: '2rem' }}>
              The payment could not be completed. No money was taken from your account. Please check your card details and try again.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <Button variant="secondary" onClick={() => setStep('payment')}>Try again</Button>
              <Link href={`/campaign/${id}`}><Button variant="ghost">Cancel</Button></Link>
            </div>
          </div>
        )}
      </main>
    </>
  )
}
