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

export const SUPPORTED_CURRENCIES = [
  { code: "NGN", symbol: "₦", label: "NGN (₦)", name: "Nigerian Naira" },
  { code: "USD", symbol: "$", label: "USD ($)", name: "US Dollar" },
  { code: "GBP", symbol: "£", label: "GBP (£)", name: "British Pound" },
  { code: "EUR", symbol: "€", label: "EUR (€)", name: "Euro" },
];

// --- SAMPLE SPACES (Nigerian Naira as primary default, USD as secondary) ---

export const DEMO_SPACES: Space[] = [
  {
    id: "space-1",
    name: "MacBook Pro fund",
    type: "personal",
    purpose: "Save for a 16-inch M3 MacBook Pro for design work",
    targetAmount: 2800000,
    savedAmount: 1450000,
    currency: "NGN",
    targetDate: "2027-03-01",
    createdAt: "2026-09-01",
    status: "active",
    rules: [
      "No withdrawals before reaching the target amount",
      "Minimum ₦100,000 contribution each month",
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
        amount: 250000,
        currency: "NGN",
        status: "completed",
        memberId: "member-me",
        memberName: "You",
        reference: "NMA-TX-0001",
      },
      {
        id: "tx-2",
        date: "2026-10-01",
        type: "contribution",
        amount: 200000,
        currency: "NGN",
        status: "completed",
        memberId: "member-me",
        memberName: "You",
        reference: "NMA-TX-0002",
      },
      {
        id: "tx-3",
        date: "2026-09-01",
        type: "contribution",
        amount: 1000000,
        currency: "NGN",
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
    name: "Lagos family holiday fund",
    type: "shared",
    purpose: "Family holiday to Lagos covering flights, lodging, and logistics",
    targetAmount: 6000000,
    savedAmount: 2400000,
    currency: "NGN",
    targetDate: "2027-07-01",
    createdAt: "2026-10-10",
    status: "active",
    rules: [
      "Each family member contributes ₦300,000 monthly",
      "Payouts require agreement from all members",
      "Funds used exclusively for confirmed trip bookings",
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
        amount: 300000,
        currency: "NGN",
        status: "completed",
        memberId: "member-me",
        memberName: "You",
        reference: "NMA-TX-0004",
      },
      {
        id: "tx-5",
        date: "2026-11-01",
        type: "contribution",
        amount: 300000,
        currency: "NGN",
        status: "completed",
        memberId: "member-3",
        memberName: "Chukwuemeka Obi",
        reference: "NMA-TX-0005",
      },
      {
        id: "tx-6",
        date: "2026-11-01",
        type: "contribution",
        amount: 300000,
        currency: "NGN",
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
    name: "Lagos Mainland Ajo circle",
    type: "community",
    purpose:
      "Monthly rotating savings circle. Each cycle, one member receives the full pooled pot.",
    targetAmount: 12000000,
    savedAmount: 4000000,
    currency: "NGN",
    createdAt: "2026-06-01",
    status: "active",
    contributionCycle: "monthly",
    cycleAmount: 500000,
    governanceThreshold: 2,
    rules: [
      "Each member deposits ₦500,000 on the 1st of every month",
      "Payout order decided by transparent ballot at circle formation",
      "Late contributions incur an agreed ₦10,000 penalty",
      "Two consecutive missed payments result in removal",
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
        amount: 500000,
        currency: "NGN",
        status: "completed",
        memberId: "member-me",
        memberName: "You",
        reference: "NMA-TX-0007",
      },
      {
        id: "tx-8",
        date: "2026-11-01",
        type: "contribution",
        amount: 500000,
        currency: "NGN",
        status: "completed",
        memberId: "member-5",
        memberName: "Folake Adewale",
        reference: "NMA-TX-0008",
      },
      {
        id: "tx-9",
        date: "2026-11-01",
        type: "contribution",
        amount: 500000,
        currency: "NGN",
        status: "failed",
        memberId: "member-6",
        memberName: "Babatunde Eze",
        note: "Bank transfer declined. Contact Babatunde.",
        reference: "NMA-TX-0009",
      },
      {
        id: "tx-10",
        date: "2026-11-01",
        type: "payout",
        amount: 2000000,
        currency: "NGN",
        status: "completed",
        memberId: "member-5",
        memberName: "Folake Adewale",
        note: "Cycle 2 payout: Folake's scheduled turn",
        reference: "NMA-TX-0010",
      },
    ],
    payoutRequests: [
      {
        id: "pr-1",
        requestedBy: "Ifeoma Nwosu",
        requestedAt: "2026-11-15",
        amount: 2000000,
        currency: "NGN",
        destination: "First Bank Nigeria (ending 4821)",
        reason: "Cycle 3 payout: Ifeoma's scheduled turn",
        status: "pending",
        approvalsRequired: 2,
        approvalsReceived: ["member-me"],
      },
    ],
  },
  {
    id: "space-4",
    name: "Diaspora emergency fund",
    type: "shared",
    purpose: "Dollar-denominated emergency pool for cross-border family support",
    targetAmount: 5000,
    savedAmount: 3200,
    currency: "USD",
    createdAt: "2026-08-15",
    status: "active",
    rules: [
      "Members contribute $100 or more monthly",
      "Payouts require two-party confirmation",
    ],
    members: [
      {
        id: "member-me",
        name: "You",
        email: "you@example.com",
        role: "owner",
        joinedAt: "2026-08-15",
        permissions: {
          canView: true,
          canContribute: true,
          canInvite: true,
          canApprovePayouts: true,
          canRequestPayouts: true,
        },
      },
      {
        id: "member-8",
        name: "Tunde Williams",
        email: "tunde@demo.example",
        role: "contributor",
        joinedAt: "2026-08-20",
        permissions: {
          canView: true,
          canContribute: true,
          canInvite: true,
          canApprovePayouts: true,
          canRequestPayouts: true,
        },
      },
    ],
    transactions: [
      {
        id: "tx-11",
        date: "2026-11-01",
        type: "contribution",
        amount: 500,
        currency: "USD",
        status: "completed",
        memberId: "member-me",
        memberName: "You",
        reference: "NMA-TX-0011",
      },
      {
        id: "tx-12",
        date: "2026-11-02",
        type: "contribution",
        amount: 500,
        currency: "USD",
        status: "completed",
        memberId: "member-8",
        memberName: "Tunde Williams",
        reference: "NMA-TX-0012",
      },
    ],
    payoutRequests: [],
  },
];

// --- PUBLIC CAMPAIGN ---

export const DEMO_CAMPAIGN: Space = {
  id: "campaign-1",
  name: "Rebuild Oyo school library",
  type: "campaign",
  purpose:
    "We are raising funds to restore and restock the library at Government Secondary School, Oyo. The building was damaged in last year's flood. Books, shelving, and electrical repairs are all needed.",
  targetAmount: 15000000,
  savedAmount: 9240000,
  currency: "NGN",
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
      amount: 100000,
      currency: "NGN",
      date: "2026-11-16",
      status: "completed",
    },
    {
      id: "d-2",
      displayName: "Taiwo Adesanya",
      amount: 250000,
      currency: "NGN",
      date: "2026-11-15",
      status: "completed",
    },
    {
      id: "d-3",
      displayName: "Anonymous",
      amount: 50000,
      currency: "NGN",
      date: "2026-11-14",
      status: "completed",
    },
    {
      id: "d-4",
      displayName: "Kemi Oduola",
      amount: 500000,
      currency: "NGN",
      date: "2026-11-13",
      status: "completed",
    },
    {
      id: "d-5",
      displayName: "Anonymous",
      amount: 75000,
      currency: "NGN",
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
    spaceName: "Lagos family holiday fund",
    spaceType: "shared",
    purpose:
      "Family holiday to Lagos covering flights, lodging, and logistics",
    invitedBy: "Chukwuemeka Obi",
    invitedByEmail: "emeka@demo.example",
    rules: [
      "Each family member contributes ₦300,000 monthly",
      "Payouts require agreement from all members",
      "Funds used exclusively for confirmed trip bookings",
    ],
    permissionsRequested: {
      canView: true,
      canContribute: true,
      canInvite: false,
      canApprovePayouts: false,
    },
    expiresAt: "2026-12-31",
  },
  "inv-ajo-001": {
    token: "inv-ajo-001",
    spaceId: "space-3",
    spaceName: "Lagos Mainland Ajo circle",
    spaceType: "community",
    purpose:
      "Monthly rotating savings circle. Each cycle, one member receives the full pooled pot.",
    invitedBy: "You",
    invitedByEmail: "you@example.com",
    rules: [
      "Each member deposits ₦500,000 on the 1st of every month",
      "Payout order decided by transparent ballot at circle formation",
      "Late contributions incur an agreed ₦10,000 penalty",
      "Two consecutive missed payments result in removal",
    ],
    permissionsRequested: {
      canView: true,
      canContribute: true,
      canInvite: false,
      canApprovePayouts: true,
    },
    expiresAt: "2027-06-30",
  },
};

export function getInvitationPreview(
  token: string,
  spaces: Space[],
  customPerms?: {
    canView?: boolean;
    canContribute?: boolean;
    canInvite?: boolean;
    canApprovePayouts?: boolean;
  }
): InvitationPreview | null {
  if (DEMO_INVITATIONS[token]) {
    const base = DEMO_INVITATIONS[token];
    if (customPerms) {
      return {
        ...base,
        permissionsRequested: {
          ...base.permissionsRequested,
          ...customPerms,
        },
      };
    }
    return base;
  }

  const cleanId = token.startsWith("inv-") ? token.slice(4) : token;
  const matchedSpace = spaces.find((s) => s.id === cleanId || s.id === token);
  if (matchedSpace) {
    const owner =
      matchedSpace.members.find((m) => m.role === "owner") ||
      matchedSpace.members[0];
    return {
      token,
      spaceId: matchedSpace.id,
      spaceName: matchedSpace.name,
      spaceType: matchedSpace.type,
      purpose: matchedSpace.purpose,
      invitedBy: owner?.name ?? "A space member",
      invitedByEmail: owner?.email ?? "member@noma.app",
      rules: matchedSpace.rules,
      permissionsRequested: {
        canView: true,
        canContribute: customPerms?.canContribute ?? true,
        canInvite: customPerms?.canInvite ?? false,
        canApprovePayouts: customPerms?.canApprovePayouts ?? false,
      },
      expiresAt: "2027-12-31",
    };
  }

  return null;
}

// Helpers
export function formatCurrency(amount: number, currency: string): string {
  const localeMap: Record<string, string> = {
    NGN: "en-NG",
    USD: "en-US",
    GBP: "en-GB",
    EUR: "en-IE",
  };
  const locale = localeMap[currency] || "en-NG";
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(iso: string): string {
  const d = new Date(iso.length === 10 ? iso + "T00:00:00" : iso);
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
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
