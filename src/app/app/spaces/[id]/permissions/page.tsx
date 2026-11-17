'use client'

import { use, useState } from 'react'
import Link from 'next/link'
import { useSpaces, useApp } from '@/lib/store'
import { type Member } from '@/lib/demo-data'
import { AppShell } from '@/components/layout/AppShell'
import { Button } from '@/components/ui/Button'

type PermKey = 'canView' | 'canContribute' | 'canInvite' | 'canApprovePayouts' | 'canRequestPayouts'

const PERM_LABELS: Record<PermKey, string> = {
  canView: 'View',
  canContribute: 'Contribute',
  canInvite: 'Invite',
  canRequestPayouts: 'Request payouts',
  canApprovePayouts: 'Approve payouts',
}

export default function PermissionsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const { spaces, updateSpace } = useSpaces()
  const { showToast } = useApp()

  const space = spaces.find(s => s.id === id)
  const [members, setMembers] = useState<Member[]>(() => space?.members ?? [])
  const [confirmRemove, setConfirmRemove] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)

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

  function togglePerm(memberId: string, perm: PermKey) {
    if (perm === 'canView') return
    setMembers(prev =>
      prev.map(m =>
        m.id === memberId
          ? { ...m, permissions: { ...m.permissions, [perm]: !m.permissions[perm] } }
          : m
      )
    )
    setSaved(false)
  }

  function handleRemove(memberId: string) {
    setMembers(prev => prev.filter(m => m.id !== memberId))
    setConfirmRemove(null)
    setSaved(false)
  }

  function handleSave() {
    updateSpace({ ...currentSpace, members })
    showToast('Permissions updated.', 'success')
    setSaved(true)
  }

  const ownerMember = members.find(m => m.role === 'owner')
  const editableMembers = members.filter(m => m.role !== 'owner')

  return (
    <AppShell>
      <div style={{ maxWidth: '42rem', margin: '0 auto', padding: '2.5rem 1rem' }}>
        <Link href={`/app/spaces/${id}`} style={{ color: '#2B6AD0', fontSize: '0.875rem', display: 'inline-block', marginBottom: '1.5rem' }}>
          ← {space.name}
        </Link>

        <h1 style={{ fontSize: '1.5rem', fontWeight: 600, color: '#061E47', marginBottom: '0.5rem' }}>
          Permissions
        </h1>
        <p style={{ color: '#1F4591', marginBottom: '2.5rem', fontSize: '0.9375rem' }}>
          Control what each member can do in this space.
        </p>

        {/* Owner */}
        {ownerMember && (
          <section style={{ marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '0.875rem', fontWeight: 600, color: '#1F4591', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1rem' }}>
              Owner
            </h2>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.875rem 0', borderBottom: '1px solid #E8EEF7' }}>
              <div>
                <div style={{ fontWeight: 500, color: '#061E47' }}>{ownerMember.name}</div>
                <div style={{ fontSize: '0.8125rem', color: '#68A4F1', marginTop: '0.125rem' }}>Full access — cannot be edited</div>
              </div>
              <span style={{ fontSize: '0.75rem', background: '#EEF4FF', color: '#1F4591', padding: '0.25rem 0.625rem', borderRadius: '99px', fontWeight: 500 }}>
                Owner
              </span>
            </div>
          </section>
        )}

        {/* Editable members */}
        <section style={{ marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '0.875rem', fontWeight: 600, color: '#1F4591', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1rem' }}>
            Members ({editableMembers.length})
          </h2>

          {editableMembers.length === 0 && (
            <p style={{ color: '#1F4591', fontSize: '0.9375rem' }}>
              No other members yet.{' '}
              <Link href={`/app/spaces/${id}/invite`} style={{ color: '#2B6AD0' }}>Invite someone.</Link>
            </p>
          )}

          {editableMembers.map((member, i) => (
            <div
              key={member.id}
              style={{
                borderTop: i === 0 ? '1px solid #E8EEF7' : 'none',
                borderBottom: '1px solid #E8EEF7',
                padding: '1.25rem 0',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <div>
                  <div style={{ fontWeight: 500, color: '#061E47' }}>{member.name}</div>
                  <div style={{ fontSize: '0.8125rem', color: '#68A4F1', marginTop: '0.125rem', textTransform: 'capitalize' }}>
                    {member.role}
                  </div>
                </div>
                {confirmRemove === member.id ? (
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.8125rem', color: '#FF6347' }}>Remove {member.name}?</span>
                    <Button variant="destructive" size="sm" onClick={() => handleRemove(member.id)}>Confirm</Button>
                    <Button variant="ghost" size="sm" onClick={() => setConfirmRemove(null)}>Cancel</Button>
                  </div>
                ) : (
                  <Button variant="ghost" size="sm" onClick={() => setConfirmRemove(member.id)}>
                    Remove
                  </Button>
                )}
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {(Object.keys(PERM_LABELS) as PermKey[]).map(perm => {
                  const isOn = member.permissions[perm]
                  const isLocked = perm === 'canView'
                  return (
                    <button
                      key={perm}
                      onClick={() => togglePerm(member.id, perm)}
                      disabled={isLocked}
                      style={{
                        padding: '0.3125rem 0.75rem',
                        borderRadius: '99px',
                        border: `1.5px solid ${isOn ? '#2B6AD0' : '#D1D9E6'}`,
                        background: isOn ? '#EEF4FF' : '#FEFEFE',
                        color: isOn ? '#1F4591' : '#68A4F1',
                        fontSize: '0.8125rem',
                        fontWeight: 500,
                        cursor: isLocked ? 'default' : 'pointer',
                      }}
                    >
                      {PERM_LABELS[perm]}
                    </button>
                  )
                })}
              </div>
            </div>
          ))}
        </section>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <Button variant="primary" onClick={handleSave}>
            Save changes
          </Button>
          {saved && (
            <span style={{ color: '#3CB371', fontSize: '0.9rem' }}>Saved</span>
          )}
        </div>
      </div>
    </AppShell>
  )
}
