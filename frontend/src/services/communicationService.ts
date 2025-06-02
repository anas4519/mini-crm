import { CommunicationLog, Campaign, Customer } from "@/types/communication";

const API_BASE_URL = 'http://localhost:3000/api';

class CommunicationService {
  async getSegmentCustomers(rules: any[]): Promise<Customer[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/customers`);
      const customers = await response.json();
      return customers.filter(customer => {
        return rules.every(rule => {
          switch (rule.field) {
            case 'spend':
              const customerSpend = customer.spend || 0;
              return this.evaluateRule(customerSpend, rule.operator, parseFloat(rule.value));
            case 'visits':
              const customerVisits = customer.visits || 0;
              return this.evaluateRule(customerVisits, rule.operator, parseFloat(rule.value));
            default:
              return true;
          }
        });
      });
    } catch (error) {
      console.error('Error fetching customers:', error);
      return [];
    }
  }

  private evaluateRule(value: number, operator: string, targetValue: number): boolean {
    switch (operator) {
      case '>': return value > targetValue;
      case '<': return value < targetValue;
      case '>=': return value >= targetValue;
      case '<=': return value <= targetValue;
      case '=': return value === targetValue;
      case '!=': return value !== targetValue;
      default: return true;
    }
  }

  async createCampaign(segmentName: string, rules: any[], customMessage?: string): Promise<Campaign> {
    const customers = await this.getSegmentCustomers(rules);
    
    const campaign = {
      name: `Campaign for ${segmentName}`,
      segmentName,
      segmentRules: rules,
      audienceSize: customers.length,
      status: 'PENDING',
      createdAt: new Date().toISOString(),
      totalSent: 0,
      totalFailed: 0
    };

    try {
      const response = await fetch(`${API_BASE_URL}/campaigns`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(campaign)
      });

      const newCampaign = await response.json();
      await this.initiateCampaignDelivery(newCampaign, customers, customMessage);
      return newCampaign;
    } catch (error) {
      console.error('Error creating campaign:', error);
      throw error;
    }
  }

  private async initiateCampaignDelivery(campaign: Campaign, customers: Customer[], customMessage?: string) {
    console.log(`Starting campaign delivery for ${campaign.name} to ${customers.length} customers`);
    
    try {
      // Create communication logs for each customer
      const logs = customers.map(customer => ({
        campaignId: campaign.id,
        customerId: customer.id,
        customerName: customer.name,
        message: customMessage || `Hi ${customer.name}, here's 10% off on your next order!`,
        status: 'PENDING',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }));

      // Send logs in batches to avoid overwhelming the server
      const batchSize = 50;
      for (let i = 0; i < logs.length; i += batchSize) {
        const batch = logs.slice(i, i + batchSize);
        await Promise.all(batch.map(log =>
          fetch(`${API_BASE_URL}/campaigns/${campaign.id}/logs`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(log)
          })
        ));
      }
    } catch (error) {
      console.error('Error in campaign delivery:', error);
      throw error;
    }
  }

  async getCampaignHistory(): Promise<Campaign[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/campaigns`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching campaign history:', error);
      return [];
    }
  }

  async getCommunicationLogs(campaignId: string): Promise<CommunicationLog[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/campaigns/${campaignId}/logs`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching communication logs:', error);
      return [];
    }
  }
}

export const communicationService = new CommunicationService();
