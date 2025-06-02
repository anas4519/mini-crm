
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Send, CheckCircle, AlertCircle, Clock, Users } from "lucide-react";
import { communicationService } from "@/services/communicationService";
import { Campaign, CommunicationLog } from "@/types/communication";

interface CampaignDeliveryStatusProps {
  campaignId: string;
  onClose?: () => void;
}

export const CampaignDeliveryStatus = ({ campaignId, onClose }: CampaignDeliveryStatusProps) => {
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [logs, setLogs] = useState<CommunicationLog[]>([]);

  useEffect(() => {
    const updateStatus = async () => { // Make updateStatus async
      const campaigns = await communicationService.getCampaignHistory(); // Await the promise
      const currentCampaign = campaigns.find(c => c.id === campaignId);
      const campaignLogs = await communicationService.getCommunicationLogs(campaignId); // Await the promise
      
      setCampaign(currentCampaign || null);
      setLogs(campaignLogs);
    };

    updateStatus();
    const interval = setInterval(updateStatus, 1000); // Update every second

    return () => clearInterval(interval);
  }, [campaignId]);

  if (!campaign) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-center text-gray-500">Campaign not found</p>
        </CardContent>
      </Card>
    );
  }

  const progress = campaign.audienceSize > 0 
    ? ((campaign.totalSent + campaign.totalFailed) / campaign.audienceSize) * 100 
    : 0;

  const successRate = (campaign.totalSent + campaign.totalFailed) > 0
    ? (campaign.totalSent / (campaign.totalSent + campaign.totalFailed)) * 100
    : 0;

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Send className="w-5 h-5" />
              {campaign.name}
            </CardTitle>
            <Badge 
              className={
                campaign.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                campaign.status === 'SENDING' ? 'bg-blue-100 text-blue-800' :
                campaign.status === 'FAILED' ? 'bg-red-100 text-red-800' :
                'bg-gray-100 text-gray-800'
              }
            >
              {campaign.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <Users className="w-4 h-4 text-blue-600" />
                  <span className="text-sm text-gray-600">Audience</span>
                </div>
                <div className="text-xl font-bold">{campaign.audienceSize}</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-gray-600">Sent</span>
                </div>
                <div className="text-xl font-bold text-green-600">{campaign.totalSent}</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <AlertCircle className="w-4 h-4 text-red-600" />
                  <span className="text-sm text-gray-600">Failed</span>
                </div>
                <div className="text-xl font-bold text-red-600">{campaign.totalFailed}</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <Clock className="w-4 h-4 text-orange-600" />
                  <span className="text-sm text-gray-600">Success Rate</span>
                </div>
                <div className="text-xl font-bold">{successRate.toFixed(1)}%</div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Delivery Progress</span>
                <span>{progress.toFixed(1)}%</span>
              </div>
              <Progress value={progress} className="w-full" />
            </div>
          </div>
        </CardContent>
      </Card>

      {logs.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Message Delivery Log</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-60 overflow-y-auto">
              {logs.map((log) => (
                <div key={log.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium text-sm">{log.customerName}</p>
                    <p className="text-xs text-gray-600 truncate">{log.message}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {log.status === 'SENT' && <CheckCircle className="w-4 h-4 text-green-600" />}
                    {log.status === 'FAILED' && <AlertCircle className="w-4 h-4 text-red-600" />}
                    {log.status === 'PENDING' && <Clock className="w-4 h-4 text-orange-600" />}
                    <Badge 
                      className={
                        log.status === 'SENT' ? 'bg-green-100 text-green-800' :
                        log.status === 'FAILED' ? 'bg-red-100 text-red-800' :
                        'bg-orange-100 text-orange-800'
                      }
                    >
                      {log.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
