export type MatchStatus = 'pending' | 'accepted' | 'rejected';

export interface Match {
  id: string;
  eventId: string;
  sponsorId: string;
  score: number;
  status: MatchStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface MatchFactors {
  categoryAlignment: number;
  budgetCompatibility: number;
  audienceSizeFit: number;
  locationProximity: number;
  historicalSuccess: number;
}
