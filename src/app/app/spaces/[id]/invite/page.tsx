'use client'

import { use, useState } from 'react'
import Link from 'next/link'
import { useSpaces } from '@/lib/store'
import { AppShell } from '@/components/layout/AppShell'
import { Button } from '@/components/ui/Button'

type PermissionKey = 'canView' | 'canContribute' | 'canInvite' | 'canApprovePayouts' | 'canRequestPayouts'

const PERMISSION_LABELS: Record<PermissionKey, { label: string; hint: string }> = {
  canView: { label: 'View space details', hint: 'Can see the goal, activity, and member list' },
  canContribute: { label: 'Contribute', hint: 'Can add money to this space' },
  canInvite: { label: 'Invite others', hint: 'Can generate invite links for new members' },
  canRequestPayouts: { label: 'Request payouts', hint: 'Can submit payout requests' },
  canApprovePayouts: { label: 'Approve payouts', hint: 'Can vote to approve or reject payout requests' },
}

export default function InvitePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const { spaces } = useSpaces()
  const space = spaces.find(s => s.id === id)

  const inviteLink = `https://noma.app/invite/inv-${id}`
  const [copied, setCopied] = useState(false)

  const [permissions, setPermissions] = useState<Record<PermissionKey, boolean>>({
    canView: true,
    canContribute: true,
    canInvite: false,
    canRequestPayouts: false,
    canApprovePayouts: false,
  })

  function handleCopy() {
    navigator.clipboard.writeText(inviteLink).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    }).catch(() => {
      // Fallback: show link
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    })
  }

  function toggle(key: PermissionKey) {
    if (key === 'canView') return
    setPermissions(prev => ({ ...prev, [key]: !prev[key] }))
  }

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

  return (
    <AppShell>
      <div style={{ maxWidth: '32rem', margin: '0 auto', padding: '2.5rem 1rem' }}>
        <Link href={`/app/spaces/${id}`} style={{ color: '#2B6AD0', fontSize: '0.875rem', display: 'inline-block', marginBottom: '1.5rem' }}>
          ← {space.name}
        </Link>

        <h1 style={{ fontSize: '1.5rem', fontWeight: 600, color: '#061E47', marginBottom: '0.5rem' }}>
          Invite someone
        </h1>
        <p style={{ color: '#1F4591', marginBottom: '2rem', fontSize: '0.9375rem' }}>
          Share a link to invite people to {space.name}. Set what they can do before they accept.
        </p>

        {/* Permissions */}
        <section style={{ marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 600, color: '#061E47', marginBottom: '0.25rem' }}>
            Permissions for invitees
          </h2>
          <p style={{ fontSize: '0.8125rem', color: '#718096', marginBottom: '1.25rem' }}>
            Invitees will see these permissions before accepting.
          </p>
          <div>
            {(Object.keys(PERMISSION_LABELS) as PermissionKey[]).map((key, i) => {
              const { label, hint } = PERMISSION_LABELS[key]
              const isLocked = key === 'canView'
              return (
                <label
                  key={key}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.875rem',
                    padding: '0.875rem 0',
                    borderBottom: i < Object.keys(PERMISSION_LABELS).length - 1 ? '1px solid #E8EEF7' : 'none',
                    cursor: isLocked ? 'default' : 'pointer',
                  }}
                >
                  <input
                    type="checkbox"
                    checked={permissions[key]}
                    onChange={() => toggle(key)}
                    disabled={isLocked}
                    style={{ accentColor: '#2B6AD0', marginTop: '0.1875rem', flexShrink: 0 }}
                  />
                  <div>
                    <div style={{ color: '#061E47', fontWeight: 500, fontSize: '0.9375rem' }}>
                      {label}
                      {isLocked && <span style={{ color: '#68A4F1', fontWeight: 400, marginLeft: '0.5rem', fontSize: '0.8125rem' }}>(always on)</span>}
                    </div>
                    <div style={{ color: '#1F4591', fontSize: '0.8125rem', marginTop: '0.125rem' }}>{hint}</div>
                  </div>
                </label>
              )
            })}
          </div>
        </section>

        {/* Invite link */}
        <section>
          <h2 style={{ fontSize: '0.875rem', fontWeight: 600, color: '#1F4591', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1rem' }}>
            Invite link
          </h2>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.875rem 1rem',
              background: '#F3F7FF',
              borderRadius: '8px',
              border: '1px solid #D1D9E6',
              marginBottom: '0.75rem',
            }}
          >
            <span style={{ flex: 1, fontSize: '0.8125rem', color: '#1F4591', wordBreak: 'break-all' }}>
              {inviteLink}
            </span>
            <Button variant="secondary" size="sm" onClick={handleCopy}>
              {copied ? 'Copied!' : 'Copy'}
            </Button>
          </div>
          <p style={{ fontSize: '0.8125rem', color: '#68A4F1' }}>
            Anyone with this link can preview the invitation. They&apos;ll need a Noma account to accept.
          </p>
        </section>
      </div>
    </AppShell>
  )
}
