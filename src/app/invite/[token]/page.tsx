'use client'

import { use } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useApp, useAuth } from '@/lib/store'
import { DEMO_INVITATIONS, type Member } from '@/lib/demo-data'
import { PublicNav } from '@/components/layout/PublicNav'
import { Button } from '@/components/ui/Button'

export default function InviteTokenPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = use(params)
  const router = useRouter()
  const { user } = useAuth()
  const { state, updateSpace, showToast } = useApp()

  const invitation = DEMO_INVITATIONS[token]

  if (!invitation) {
    return (
      <>
        <PublicNav />
        <main style={{ maxWidth: '32rem', margin: '0 auto', padding: '5rem 1rem', textAlign: 'center' }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 600, color: '#061E47', marginBottom: '1rem' }}>
            Invitation not found
          </h1>
          <p style={{ color: '#1F4591', marginBottom: '2rem' }}>
            This invitation link may have expired or already been used. Ask the person who invited you to send a new link.
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
            <Link href="/sign-up"><Button variant="primary">Create an account</Button></Link>
            <Link href="/sign-in"><Button variant="secondary">Sign in</Button></Link>
          </div>
        </main>
      </>
    )
  }

  const space = state.spaces.find(s => s.id === invitation.spaceId)

  function handleAccept() {
    if (!space) return
    const newMember: Member = {
      id: 'member-' + Date.now(),
      name: user!.name,
      email: user!.email,
      role: 'contributor',
      joinedAt: new Date().toISOString(),
      permissions: {
        canView: invitation.permissionsRequested.canView,
        canContribute: invitation.permissionsRequested.canContribute,
        canInvite: invitation.permissionsRequested.canInvite,
        canApprovePayouts: invitation.permissionsRequested.canApprovePayouts,
        canRequestPayouts: false,
      },
    }
    updateSpace({ ...space, members: [...space.members, newMember] })
    showToast(`You've joined ${invitation.spaceName}.`, 'success')
    router.push(`/app/spaces/${invitation.spaceId}`)
  }

  function handleDecline() {
    router.push('/app')
  }

  return (
    <>
      <PublicNav />
      <main style={{ maxWidth: '36rem', margin: '0 auto', padding: '3rem 1.5rem' }}>
        {/* Header */}
        <div style={{ marginBottom: '2.5rem' }}>
          <p style={{ fontSize: '0.875rem', color: '#68A4F1', marginBottom: '0.5rem' }}>
            {invitation.invitedBy} has invited you to join
          </p>
          <h1 style={{ fontSize: '2rem', fontWeight: 700, color: '#061E47', marginBottom: '0.5rem' }}>
            {invitation.spaceName}
          </h1>
          <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#1F4591', textTransform: 'capitalize', background: '#EEF4FF', padding: '0.25rem 0.625rem', borderRadius: '99px' }}>
            {invitation.spaceType} space
          </span>
        </div>

        {/* Purpose */}
        <section style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '0.875rem', fontWeight: 600, color: '#1F4591', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.625rem' }}>
            Purpose
          </h2>
          <p style={{ color: '#061E47', lineHeight: 1.65 }}>{invitation.purpose}</p>
        </section>

        {/* Rules */}
        {invitation.rules.length > 0 && (
          <section style={{ marginBottom: '2rem', borderTop: '1px solid #E8EEF7', paddingTop: '2rem' }}>
            <h2 style={{ fontSize: '0.875rem', fontWeight: 600, color: '#1F4591', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>
              Rules
            </h2>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {invitation.rules.map((rule, i) => (
                <li key={i} style={{ color: '#061E47', paddingLeft: '1rem', position: 'relative', lineHeight: 1.5 }}>
                  <span style={{ position: 'absolute', left: 0, color: '#68A4F1' }}>–</span>
                  {rule}
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Permissions */}
        <section style={{ marginBottom: '2.5rem', borderTop: '1px solid #E8EEF7', paddingTop: '2rem' }}>
          <h2 style={{ fontSize: '0.875rem', fontWeight: 600, color: '#1F4591', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>
            Your permissions if you accept
          </h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {invitation.permissionsRequested.canView && (
              <span style={{ padding: '0.3125rem 0.75rem', borderRadius: '99px', background: '#EEF4FF', color: '#1F4591', fontSize: '0.8125rem', fontWeight: 500 }}>View</span>
            )}
            {invitation.permissionsRequested.canContribute && (
              <span style={{ padding: '0.3125rem 0.75rem', borderRadius: '99px', background: '#EEF4FF', color: '#1F4591', fontSize: '0.8125rem', fontWeight: 500 }}>Contribute</span>
            )}
            {invitation.permissionsRequested.canInvite && (
              <span style={{ padding: '0.3125rem 0.75rem', borderRadius: '99px', background: '#EEF4FF', color: '#1F4591', fontSize: '0.8125rem', fontWeight: 500 }}>Invite others</span>
            )}
            {invitation.permissionsRequested.canApprovePayouts && (
              <span style={{ padding: '0.3125rem 0.75rem', borderRadius: '99px', background: '#EEF4FF', color: '#1F4591', fontSize: '0.8125rem', fontWeight: 500 }}>Approve payouts</span>
            )}
          </div>
          <p style={{ fontSize: '0.8125rem', color: '#68A4F1', marginTop: '0.75rem' }}>
            Invite expires: {new Date(invitation.expiresAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </section>

        {/* CTA */}
        {user ? (
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <Button variant="primary" onClick={handleAccept}>Accept invitation</Button>
            <Button variant="ghost" onClick={handleDecline}>Decline</Button>
          </div>
        ) : (
          <div>
            <p style={{ color: '#1F4591', marginBottom: '1.25rem', fontSize: '0.9375rem' }}>
              You need a Noma account to accept this invitation.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <Link href={`/sign-in?redirect=/invite/${token}`}>
                <Button variant="primary">Sign in to accept</Button>
              </Link>
              <Link href="/sign-up">
                <Button variant="secondary">Create an account</Button>
              </Link>
            </div>
          </div>
        )}
      </main>
    </>
  )
}
