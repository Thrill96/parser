export type Gift = {
  year: number;
  amount: number;
  tier: string;
  category: string;
  method: string;
  event?: string;
};

export type Constituent = {
  id: string;
  first_name: string;
  last_name: string;
  name: string;
  email: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  tier: string;
  tier_amount: number;
  lifetime_total: number;
  gift_count: number;
  first_gift_year: number;
  last_gift_year: number;
  gifts: Gift[];
  is_organization: boolean;
  is_eagle: boolean;
};

export type WealthProfile = {
  ds_rating: number;
  mlr_score: number;
  major_gift_likelihood: string;
  annual_gift_likelihood: string;
  target_ask: number;
  est_net_worth: string;
  real_estate: { location: string; value: string; type: string }[];
  real_estate_total: string;
  political_giving: string;
  boards: string[];
  external_giving: { org: string; amount: string; year: string; type: string; source: string }[];
  external_total: string;
  foundation: string | null;
};

export type UpgradeCandidate = {
  constituent_id: string;
  current_tier: string;
  target_tier: string;
  gap: number;
  ds_rating: number;
  mlr_score: number;
  target_ask: number;
  signal: string;
};

export type Prospect = {
  id: string;
  name: string;
  zip: string;
  area: string;
  ds_rating: number;
  mlr_score: number;
  confirmed_giving: string;
  largest_gift: { org: string; amount: string };
  affinity: string;
  target_tier: string;
  status: string;
  est_capacity: string;
};

export type ZipStat = {
  zip: string;
  area: string;
  state: string;
  wealth: string;
  donors: number;
  giving: number;
  ds_matches: number;
  untapped_capacity: string;
};

export type Unmatched = {
  id: string;
  source: string;
  source_ref: string;
  received_at: string;
  status: string;
  customer_name: string;
  customer_email: string;
  amount: number;
  match_suggestion: string | null;
  match_confidence: number;
  reason: string;
};

export type SyncLogEntry = {
  id: string;
  source: string;
  type: string;
  status: string;
  records_processed: number;
  started_at: string;
  duration_ms: number;
  error: string | null;
};

export type WWSEvent = {
  id: string;
  name: string;
  date: string;
  type: string;
  status: string;
  attendees: number;
  revenue: number;
};
