export type DeliverableStatus = 'pending' | 'submitted' | 'approved' | 'rejected';

export interface Deliverable {
  id: string;
  matchId: string;
  title: string;
  description: string;
  proofUrl?: string;
  status: DeliverableStatus;
  feedback?: string;
  dueDate: Date;
  createdAt: Date;
  updatedAt: Date;
  // Joined fields
  sponsorName?: string;
  eventName?: string;
  organizerName?: string;
}
