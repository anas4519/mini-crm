
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Users, Save, Eye, Send } from "lucide-react";
import { RuleBuilder } from "./RuleBuilder";
import { AudiencePreview } from "./AudiencePreview";
import { AIMessageSuggestions } from "./AIMessageSuggestions";
import { CampaignDeliveryStatus } from "./CampaignDeliveryStatus";
import { communicationService } from "@/services/communicationService";
import { useToast } from "@/hooks/use-toast";

interface Rule {
  id: string;
  field: string;
  operator: string;
  value: string;
  connector?: 'AND' | 'OR';
}

interface AudienceBuilderProps {
  onBack: () => void;
  onSave: () => void;
}

export const AudienceBuilder = ({ onBack, onSave }: AudienceBuilderProps) => {
  const [segmentName, setSegmentName] = useState("");
  const [rules, setRules] = useState<Rule[]>([
    { id: '1', field: 'spend', operator: '>', value: '10000', connector: 'AND' },
    { id: '2', field: 'visits', operator: '<', value: '3' }
  ]);
  const [customMessage, setCustomMessage] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [currentCampaignId, setCurrentCampaignId] = useState<string | null>(null);
  const [isCreatingCampaign, setIsCreatingCampaign] = useState(false);
  const { toast } = useToast();

  // Calculate mock audience size based on rules
  const calculateAudienceSize = () => {
    const baseSize = 5000;
    let modifier = 1;
    
    rules.forEach(rule => {
      if (rule.field === 'spend' && rule.operator === '>' && parseFloat(rule.value) > 10000) {
        modifier *= 0.3; // Fewer high spenders
      }
      if (rule.field === 'visits' && rule.operator === '<' && parseFloat(rule.value) < 5) {
        modifier *= 0.6; // Fewer low-visit customers
      }
    });
    
    return Math.floor(baseSize * modifier) + Math.floor(Math.random() * 500);
  };

  const audienceSize = calculateAudienceSize();

  const handleSave = async () => {
    if (segmentName && rules.length > 0) {
      setIsCreatingCampaign(true);
      
      try {
        // Save segment to localStorage (existing functionality)
        const segments = JSON.parse(localStorage.getItem('segments') || '[]');
        const newSegment = {
          id: Date.now().toString(),
          name: segmentName,
          rules: rules,
          audienceSize: audienceSize,
          createdAt: new Date().toISOString()
        };
        segments.push(newSegment);
        localStorage.setItem('segments', JSON.stringify(segments));

        // Create and initiate campaign with custom message
        const campaign = await communicationService.createCampaign(segmentName, rules, customMessage);
        setCurrentCampaignId(campaign.id);
        toast({
          title: "Campaign Started",
          description: `Campaign \"${campaign.name}\" has been created and message delivery is in progress.`,
        });
        onSave(); // <-- Add this line to redirect

        console.log("Campaign created:", campaign);

      } catch (error) {
        console.error("Error creating campaign:", error);
        toast({
          title: "Error",
          description: "Failed to create campaign. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsCreatingCampaign(false);
      }
    }
  };

  const handleBackToDashboard = () => {
    setCurrentCampaignId(null);
    onSave();
  };

  if (currentCampaignId) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <Button variant="ghost" onClick={handleBackToDashboard} className="p-2">
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Campaign Delivery Status</h1>
              <p className="text-gray-600">Track real-time message delivery progress</p>
            </div>
          </div>
          
          <CampaignDeliveryStatus campaignId={currentCampaignId} />
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
            <h1 className="text-2xl font-bold text-gray-900">Create Audience Segment</h1>
            <p className="text-gray-600">Define your target audience and craft AI-powered messages</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Segment Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Segment Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="segmentName">Segment Name</Label>
                    <Input
                      id="segmentName"
                      placeholder="e.g., High Value Customers"
                      value={segmentName}
                      onChange={(e) => setSegmentName(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Rule Builder */}
            <RuleBuilder rules={rules} setRules={setRules} />

            {/* Custom Message */}
            <Card>
              <CardHeader>
                <CardTitle>Campaign Message</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="customMessage">Custom Message (Optional)</Label>
                    <Textarea
                      id="customMessage"
                      placeholder="Enter your campaign message or use AI suggestions below..."
                      value={customMessage}
                      onChange={(e) => setCustomMessage(e.target.value)}
                      rows={3}
                      className="mt-1"
                    />
                    <div className="mt-1 text-xs text-gray-500">
                      {customMessage.length}/160 characters
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* AI Message Suggestions */}
            <AIMessageSuggestions
              rules={rules}
              audienceSize={audienceSize}
              onSelectMessage={setCustomMessage}
              selectedMessage={customMessage}
            />

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                onClick={() => setShowPreview(!showPreview)}
                className="flex items-center gap-2"
              >
                <Eye className="w-4 h-4" />
                {showPreview ? 'Hide Preview' : 'Preview Audience'}
              </Button>
              <Button 
                onClick={handleSave}
                disabled={!segmentName || rules.length === 0 || isCreatingCampaign}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
              >
                <Send className="w-4 h-4" />
                {isCreatingCampaign ? 'Creating Campaign...' : 'Save & Start Campaign'}
              </Button>
            </div>
          </div>

          <div className="space-y-6">
            {/* Audience Preview */}
            <AudiencePreview rules={rules} visible={showPreview} />
            
            {/* Rule Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Rule Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  {rules.map((rule, index) => (
                    <div key={rule.id} className="flex flex-col">
                      <span className="text-gray-700">
                        {rule.field} {rule.operator} {rule.value}
                      </span>
                      {index < rules.length - 1 && rule.connector && (
                        <span className="text-xs font-bold text-blue-600 py-1">
                          {rule.connector}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Audience Size */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Estimated Reach</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">
                    {audienceSize.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600">customers match your criteria</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
