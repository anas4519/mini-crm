
export interface CommunicationLog {
  id: string;
  campaignId: string;
  customerId: string;
  customerName: string;
  message: string;
  status: 'PENDING' | 'SENT' | 'FAILED';
  sentAt?: string;
  deliveredAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Campaign {
  id: string;
  name: string;
  segmentName: string;
  segmentRules: any[];
  audienceSize: number;
  status: 'PENDING' | 'SENDING' | 'COMPLETED' | 'FAILED';
  createdAt: string;
  totalSent: number;
  totalFailed: number;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  spend?: number;
  visits?: number;
  lastActive?: string;
}
