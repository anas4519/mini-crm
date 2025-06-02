
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Send, Users, AlertCircle, CheckCircle, Clock, Eye } from "lucide-react";
import { communicationService } from "@/services/communicationService";
import { Campaign } from "@/types/communication";
import { CampaignDeliveryStatus } from "./CampaignDeliveryStatus";

interface CampaignHistoryProps {
  onBack: () => void;
}

export const CampaignHistory = ({ onBack }: CampaignHistoryProps) => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [selectedCampaignId, setSelectedCampaignId] = useState<string | null>(null);

  useEffect(() => {
    const updateCampaigns = async () => {
      const campaignHistory = await communicationService.getCampaignHistory();
      setCampaigns(campaignHistory);
    };

    updateCampaigns();
    const interval = setInterval(updateCampaigns, 2000); // Update every 2 seconds

    return () => clearInterval(interval);
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'FAILED':
        return <AlertCircle className="w-4 h-4 text-red-600" />;
      case 'SENDING':
        return <Clock className="w-4 h-4 text-blue-600" />;
      case 'PENDING':
        return <Clock className="w-4 h-4 text-orange-600" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Completed</Badge>;
      case 'FAILED':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Failed</Badge>;
      case 'SENDING':
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Sending</Badge>;
      case 'PENDING':
        return <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100">Pending</Badge>;
      default:
        return null;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) {
      const diffMinutes = Math.floor(diffMs / (1000 * 60));
      return `${diffMinutes} minutes ago`;
    } else if (diffHours < 24) {
      return `${diffHours} hours ago`;
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const getTotalStats = () => {
    return campaigns.reduce((acc, campaign) => ({
      totalSent: acc.totalSent + campaign.totalSent,
      totalFailed: acc.totalFailed + campaign.totalFailed,
      totalAudience: acc.totalAudience + campaign.audienceSize
    }), { totalSent: 0, totalFailed: 0, totalAudience: 0 });
  };

  const stats = getTotalStats();
  const successRate = stats.totalSent > 0 ? ((stats.totalSent / (stats.totalSent + stats.totalFailed)) * 100).toFixed(1) : '0';

  if (selectedCampaignId) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <Button variant="ghost" onClick={() => setSelectedCampaignId(null)} className="p-2">
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Campaign Details</h1>
              <p className="text-gray-600">Real-time delivery tracking</p>
            </div>
          </div>
          
          <CampaignDeliveryStatus campaignId={selectedCampaignId} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" onClick={onBack} className="p-2">
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Campaign History</h1>
            <p className="text-gray-600">Track your campaign performance and delivery stats</p>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Send className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Sent</p>
                  <p className="text-xl font-bold">{stats.totalSent.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Failed</p>
                  <p className="text-xl font-bold">{stats.totalFailed.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Success Rate</p>
                  <p className="text-xl font-bold">{successRate}%</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Users className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Reach</p>
                  <p className="text-xl font-bold">{stats.totalAudience.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Campaign List */}
        <Card>
          <CardHeader>
            <CardTitle>Campaign History</CardTitle>
          </CardHeader>
          <CardContent>
            {campaigns.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>No campaigns created yet.</p>
                <p className="text-sm">Create your first audience segment to start a campaign.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {campaigns.map((campaign) => (
                  <div key={campaign.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(campaign.status)}
                        <div>
                          <h3 className="font-semibold text-gray-900">{campaign.name}</h3>
                          <p className="text-sm text-gray-600">Segment: {campaign.segmentName}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {getStatusBadge(campaign.status)}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedCampaignId(campaign.id)}
                          className="flex items-center gap-1"
                        >
                          <Eye className="w-3 h-3" />
                          View Details
                        </Button>
                        <span className="text-sm text-gray-500">{formatDate(campaign.createdAt)}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">Audience Size</p>
                        <p className="font-medium">{campaign.audienceSize.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">Sent</p>
                        <p className="font-medium text-green-600">{campaign.totalSent.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">Failed</p>
                        <p className="font-medium text-red-600">{campaign.totalFailed.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">Success Rate</p>
                        <p className="font-medium">
                          {campaign.audienceSize > 0 
                            ? ((campaign.totalSent / campaign.audienceSize) * 100).toFixed(1)
                            : '0'
                          }%
                        </p>
                      </div>
                    </div>

                    {campaign.status === 'SENDING' && (
                      <div className="mt-3">
                        <div className="flex justify-between text-xs text-gray-600 mb-1">
                          <span>Progress</span>
                          <span>{(((campaign.totalSent + campaign.totalFailed) / campaign.audienceSize) * 100).toFixed(0)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${((campaign.totalSent + campaign.totalFailed) / campaign.audienceSize) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
