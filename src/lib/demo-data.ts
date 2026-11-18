// Sample space and transaction data for development.
// Ready for backend integration.

export type SpaceType =
  | "personal"
  | "accountability"
  | "shared"
  | "community"
  | "campaign";

export type TransactionStatus =
  | "completed"
  | "pending"
  | "failed"
  | "expired";

export type MemberRole = "owner" | "admin" | "contributor" | "viewer";

export interface Member {
  id: string;
  name: string;
  email: string;
  role: MemberRole;
  joinedAt: string;
  permissions: {
    canView: boolean;
    canContribute: boolean;
    canInvite: boolean;
    canApprovePayouts: boolean;
    canRequestPayouts: boolean;
  };
}

export interface Transaction {
  id: string;
  date: string;
  type: "contribution" | "payout" | "donation";
  amount: number;
  currency: string;
  status: TransactionStatus;
  memberId?: string;
  memberName?: string;
  note?: string;
  reference: string;
}

export interface PayoutRequest {
  id: string;
  requestedBy: string;
  requestedAt: string;
  amount: number;
  currency: string;
  destination: string;
  reason: string;
  status: "pending" | "approved" | "rejected" | "executed";
  approvalsRequired: number;
  approvalsReceived: string[];
}

export interface Space {
  id: string;
  name: string;
  type: SpaceType;
  purpose: string;
  targetAmount: number;
  savedAmount: number;
  currency: string;
  targetDate?: string;
  createdAt: string;
  members: Member[];
  transactions: Transaction[];
  payoutRequests: PayoutRequest[];
  rules: string[];
  isPublic?: boolean;
  shareUrl?: string;
  status: "active" | "paused" | "completed";
  // campaign-specific
  beneficiary?: string;
  endDate?: string;
  donors?: DonorEntry[];
  // community-specific
  contributionCycle?: "weekly" | "monthly" | "biweekly";
  cycleAmount?: number;
  governanceThreshold?: number;
}

export interface DonorEntry {
  id: string;
  displayName: string; // "Anonymous" or real name if opted in
  amount: number;
  currency: string;
  date: string;
  status: TransactionStatus;
}

export interface InvitationPreview {
  token: string;
  spaceId: string;
  spaceName: string;
  spaceType: SpaceType;
  purpose: string;
  invitedBy: string;
  invitedByEmail: string;
  rules: string[];
  permissionsRequested: {
    canView: boolean;
    canContribute: boolean;
    canInvite: boolean;
    canApprovePayouts: boolean;
  };
  expiresAt: string;
}

// --- SAMPLE SPACES ---

export const DEMO_SPACES: Space[] = [
  {
    id: "space-1",
    name: "New laptop fund",
    type: "personal",
    purpose: "Save for a MacBook Pro for design work",
    targetAmount: 2500,
    savedAmount: 1340,
    currency: "GBP",
    targetDate: "2027-03-01",
    createdAt: "2026-09-01",
    status: "active",
    rules: [
      "No early withdrawals before target date",
      "Minimum £100 per month",
    ],
    members: [
      {
        id: "member-me",
        name: "You",
        email: "you@example.com",
        role: "owner",
        joinedAt: "2026-09-01",
        permissions: {
          canView: true,
          canContribute: true,
          canInvite: true,
          canApprovePayouts: true,
          canRequestPayouts: true,
        },
      },
      {
        id: "member-2",
        name: "Adaeze Okafor",
        email: "adaeze@demo.example",
        role: "viewer",
        joinedAt: "2026-09-05",
        permissions: {
          canView: true,
          canContribute: false,
          canInvite: false,
          canApprovePayouts: false,
          canRequestPayouts: false,
        },
      },
    ],
    transactions: [
      {
        id: "tx-1",
        date: "2026-11-01",
        type: "contribution",
        amount: 150,
        currency: "GBP",
        status: "completed",
        memberId: "member-me",
        memberName: "You",
        reference: "NMA-TX-0001",
      },
      {
        id: "tx-2",
        date: "2026-10-01",
        type: "contribution",
        amount: 150,
        currency: "GBP",
        status: "completed",
        memberId: "member-me",
        memberName: "You",
        reference: "NMA-TX-0002",
      },
      {
        id: "tx-3",
        date: "2026-09-01",
        type: "contribution",
        amount: 1040,
        currency: "GBP",
        status: "completed",
        memberId: "member-me",
        memberName: "You",
        note: "Initial deposit",
        reference: "NMA-TX-0003",
      },
    ],
    payoutRequests: [],
  },
  {
    id: "space-2",
    name: "Lagos family trip",
    type: "shared",
    purpose: "Annual family holiday to Lagos, covering flights and accommodation",
    targetAmount: 6000,
    savedAmount: 2200,
    currency: "GBP",
    targetDate: "2027-07-01",
    createdAt: "2026-10-10",
    status: "active",
    rules: [
      "Each person contributes £300 monthly",
      "Withdrawals require agreement from all members",
      "Funds only used for the stated trip",
    ],
    members: [
      {
        id: "member-me",
        name: "You",
        email: "you@example.com",
        role: "owner",
        joinedAt: "2026-10-10",
        permissions: {
          canView: true,
          canContribute: true,
          canInvite: true,
          canApprovePayouts: true,
          canRequestPayouts: true,
        },
      },
      {
        id: "member-3",
        name: "Chukwuemeka Obi",
        email: "emeka@demo.example",
        role: "contributor",
        joinedAt: "2026-10-12",
        permissions: {
          canView: true,
          canContribute: true,
          canInvite: false,
          canApprovePayouts: false,
          canRequestPayouts: false,
        },
      },
      {
        id: "member-4",
        name: "Ngozi Obi",
        email: "ngozi@demo.example",
        role: "contributor",
        joinedAt: "2026-10-12",
        permissions: {
          canView: true,
          canContribute: true,
          canInvite: false,
          canApprovePayouts: false,
          canRequestPayouts: false,
        },
      },
    ],
    transactions: [
      {
        id: "tx-4",
        date: "2026-11-01",
        type: "contribution",
        amount: 300,
        currency: "GBP",
        status: "completed",
        memberId: "member-me",
        memberName: "You",
        reference: "NMA-TX-0004",
      },
      {
        id: "tx-5",
        date: "2026-11-01",
        type: "contribution",
        amount: 300,
        currency: "GBP",
        status: "completed",
        memberId: "member-3",
        memberName: "Chukwuemeka Obi",
        reference: "NMA-TX-0005",
      },
      {
        id: "tx-6",
        date: "2026-11-01",
        type: "contribution",
        amount: 300,
        currency: "GBP",
        status: "pending",
        memberId: "member-4",
        memberName: "Ngozi Obi",
        reference: "NMA-TX-0006",
      },
    ],
    payoutRequests: [],
  },
  {
    id: "space-3",
    name: "Islington Ajo circle",
    type: "community",
    purpose:
      "Monthly rotating savings group. Each cycle, one member receives the full pot.",
    targetAmount: 12000,
    savedAmount: 4000,
    currency: "GBP",
    createdAt: "2026-06-01",
    status: "active",
    contributionCycle: "monthly",
    cycleAmount: 500,
    governanceThreshold: 2,
    rules: [
      "Each member contributes £500 on the 1st of every month",
      "Payout order decided by ballot at group formation",
      "Late contributions carry a £10 penalty agreed at formation",
      "Missing two consecutive payments results in removal",
    ],
    members: [
      {
        id: "member-me",
        name: "You",
        email: "you@example.com",
        role: "admin",
        joinedAt: "2026-06-01",
        permissions: {
          canView: true,
          canContribute: true,
          canInvite: true,
          canApprovePayouts: true,
          canRequestPayouts: true,
        },
      },
      {
        id: "member-5",
        name: "Folake Adewale",
        email: "folake@demo.example",
        role: "contributor",
        joinedAt: "2026-06-01",
        permissions: {
          canView: true,
          canContribute: true,
          canInvite: false,
          canApprovePayouts: true,
          canRequestPayouts: true,
        },
      },
      {
        id: "member-6",
        name: "Babatunde Eze",
        email: "babs@demo.example",
        role: "contributor",
        joinedAt: "2026-06-01",
        permissions: {
          canView: true,
          canContribute: true,
          canInvite: false,
          canApprovePayouts: true,
          canRequestPayouts: false,
        },
      },
      {
        id: "member-7",
        name: "Ifeoma Nwosu",
        email: "ifeoma@demo.example",
        role: "contributor",
        joinedAt: "2026-06-01",
        permissions: {
          canView: true,
          canContribute: true,
          canInvite: false,
          canApprovePayouts: false,
          canRequestPayouts: false,
        },
      },
    ],
    transactions: [
      {
        id: "tx-7",
        date: "2026-11-01",
        type: "contribution",
        amount: 500,
        currency: "GBP",
        status: "completed",
        memberId: "member-me",
        memberName: "You",
        reference: "NMA-TX-0007",
      },
      {
        id: "tx-8",
        date: "2026-11-01",
        type: "contribution",
        amount: 500,
        currency: "GBP",
        status: "completed",
        memberId: "member-5",
        memberName: "Folake Adewale",
        reference: "NMA-TX-0008",
      },
      {
        id: "tx-9",
        date: "2026-11-01",
        type: "contribution",
        amount: 500,
        currency: "GBP",
        status: "failed",
        memberId: "member-6",
        memberName: "Babatunde Eze",
        note: "Payment declined. Contact Babatunde.",
        reference: "NMA-TX-0009",
      },
      {
        id: "tx-10",
        date: "2026-11-01",
        type: "payout",
        amount: 2000,
        currency: "GBP",
        status: "completed",
        memberId: "member-5",
        memberName: "Folake Adewale",
        note: "Cycle 2 payout: Folake's turn",
        reference: "NMA-TX-0010",
      },
    ],
    payoutRequests: [
      {
        id: "pr-1",
        requestedBy: "Ifeoma Nwosu",
        requestedAt: "2026-11-15",
        amount: 2000,
        currency: "GBP",
        destination: "Ifeoma's bank account (ending 4821)",
        reason: "Cycle 3 payout: Ifeoma's scheduled turn",
        status: "pending",
        approvalsRequired: 2,
        approvalsReceived: ["member-me"],
      },
    ],
  },
];

// --- PUBLIC CAMPAIGN ---

export const DEMO_CAMPAIGN: Space = {
  id: "campaign-1",
  name: "Rebuild Oyo school library",
  type: "campaign",
  purpose:
    "We are raising funds to restore and restock the library at Government Secondary School, Oyo. The building was damaged in last year's flood. Books, shelving, and electrical work are all needed.",
  targetAmount: 15000,
  savedAmount: 9240,
  currency: "GBP",
  endDate: "2027-01-31",
  createdAt: "2026-10-01",
  status: "active",
  isPublic: true,
  shareUrl: "/campaign/campaign-1",
  beneficiary: "Government Secondary School, Oyo (library rebuilding project)",
  rules: [],
  members: [
    {
      id: "org-1",
      name: "Noma Gives Foundation",
      email: "giving@demo.example",
      role: "owner",
      joinedAt: "2026-10-01",
      permissions: {
        canView: true,
        canContribute: false,
        canInvite: true,
        canApprovePayouts: true,
        canRequestPayouts: true,
      },
    },
  ],
  transactions: [],
  payoutRequests: [],
  donors: [
    {
      id: "d-1",
      displayName: "Anonymous",
      amount: 100,
      currency: "GBP",
      date: "2026-11-16",
      status: "completed",
    },
    {
      id: "d-2",
      displayName: "Taiwo Adesanya",
      amount: 250,
      currency: "GBP",
      date: "2026-11-15",
      status: "completed",
    },
    {
      id: "d-3",
      displayName: "Anonymous",
      amount: 50,
      currency: "GBP",
      date: "2026-11-14",
      status: "completed",
    },
    {
      id: "d-4",
      displayName: "Kemi Oduola",
      amount: 500,
      currency: "GBP",
      date: "2026-11-13",
      status: "completed",
    },
    {
      id: "d-5",
      displayName: "Anonymous",
      amount: 75,
      currency: "GBP",
      date: "2026-11-12",
      status: "completed",
    },
  ],
};

// --- SAMPLE INVITATIONS ---

export const DEMO_INVITATIONS: Record<string, InvitationPreview> = {
  "inv-abc123": {
    token: "inv-abc123",
    spaceId: "space-2",
    spaceName: "Lagos family trip",
    spaceType: "shared",
    purpose:
      "Annual family holiday to Lagos, covering flights and accommodation",
    invitedBy: "Chukwuemeka Obi",
    invitedByEmail: "emeka@demo.example",
    rules: [
      "Each person contributes £300 monthly",
      "Withdrawals require agreement from all members",
      "Funds only used for the stated trip",
    ],
    permissionsRequested: {
      canView: true,
      canContribute: true,
      canInvite: false,
      canApprovePayouts: false,
    },
    expiresAt: "2026-12-31",
  },
};

// Helpers
export function formatCurrency(amount: number, currency: string): string {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function progressPercent(saved: number, target: number): number {
  return Math.min(100, Math.round((saved / target) * 100));
}

export function spaceTypeLabel(type: SpaceType): string {
  const labels: Record<SpaceType, string> = {
    personal: "Personal",
    accountability: "Accountability",
    shared: "Shared",
    community: "Community",
    campaign: "Campaign",
  };
  return labels[type];
}

export function statusLabel(status: TransactionStatus): string {
  const labels: Record<TransactionStatus, string> = {
    completed: "Completed",
    pending: "Pending",
    failed: "Failed",
    expired: "Expired",
  };
  return labels[status];
}
