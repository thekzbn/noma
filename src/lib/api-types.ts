/**
 * Noma Backend API Specification and Contract
 *
 * This contract specifies the REST endpoints and data schemas required
 * by the frontend application for full backend integration.
 */

import type {
  Space,
  SpaceType,
  Member,
  Transaction,
  PayoutRequest,
  DonorEntry,
  InvitationPreview,
} from "./demo-data";
import type { AuthUser } from "./store";

// ---- Error Response ----

export interface ApiErrorResponse {
  error: {
    code: string;
    message: string;
    details?: Record<string, string[]>;
  };
}

// ---- Authentication Endpoints ----

export interface SignInRequestBody {
  email: string;
  password?: string;
  code?: string;
}

export interface SignUpRequestBody {
  name: string;
  email: string;
  password?: string;
  target?: string[];
}

export interface AuthSessionResponse {
  user: AuthUser;
  token?: string;
  expiresAt: string;
}

// ---- Spaces Endpoints ----

export interface CreateSpaceRequestBody {
  name: string;
  type: SpaceType;
  purpose: string;
  targetAmount: number;
  currency: string;
  targetDate?: string;
  rules?: string[];
  beneficiary?: string;
  endDate?: string;
  contributionCycle?: "weekly" | "biweekly" | "monthly";
  cycleAmount?: number;
  governanceThreshold?: number;
}

export interface UpdateSpaceRequestBody {
  name?: string;
  purpose?: string;
  targetAmount?: number;
  rules?: string[];
  status?: "active" | "paused" | "completed";
}

export interface SpacesListResponse {
  spaces: Space[];
  total: number;
}

// ---- Contributions and Transactions ----

export interface CreateContributionRequestBody {
  amount: number;
  currency: string;
  paymentMethod: "bank" | "card" | "wallet";
  note?: string;
}

export interface ContributionResultResponse {
  transaction: Transaction;
  newBalance: number;
  spaceId: string;
}

// ---- Payouts and Governance ----

export interface CreatePayoutRequestBody {
  amount: number;
  currency: string;
  destination: string;
  reason: string;
}

export interface PayoutVoteRequestBody {
  action: "approve" | "reject";
  comment?: string;
}

export interface PayoutDecisionResponse {
  payoutRequest: PayoutRequest;
  executed: boolean;
  transaction?: Transaction;
}

// ---- Invitations ----

export interface CreateInvitationRequestBody {
  permissions: {
    canView: boolean;
    canContribute: boolean;
    canInvite: boolean;
    canApprovePayouts: boolean;
  };
  expiresInDays?: number;
}

export interface InvitationResultResponse {
  token: string;
  inviteUrl: string;
  invitation: InvitationPreview;
}

export interface AcceptInvitationResponse {
  member: Member;
  space: Space;
}

// ---- Public Campaigns ----

export interface CreateCampaignDonationRequestBody {
  amount: number;
  currency: string;
  identity: "anonymous" | "named";
  displayName?: string;
  email?: string;
  paymentMethod: "card" | "bank" | "wallet";
}

export interface CampaignDonationResponse {
  donor: DonorEntry;
  campaignId: string;
  newTotal: number;
  reference: string;
}
