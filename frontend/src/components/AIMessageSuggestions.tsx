
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles, Copy, RefreshCw, Settings, Eye, EyeOff } from "lucide-react";
import { aiService, MessageSuggestion } from "@/services/aiService";
import { useToast } from "@/hooks/use-toast";

interface AIMessageSuggestionsProps {
  rules: any[];
  audienceSize: number;
  onSelectMessage: (message: string) => void;
  selectedMessage?: string;
}

export const AIMessageSuggestions = ({ 
  rules, 
  audienceSize, 
  onSelectMessage, 
  selectedMessage 
}: AIMessageSuggestionsProps) => {
  const [objective, setObjective] = useState("Increase sales with a promotional offer");
  const [suggestions, setSuggestions] = useState<MessageSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [apiKey, setApiKey] = useState(aiService.getApiKey() || "");
  const [showApiKeyInput, setShowApiKeyInput] = useState(!aiService.getApiKey());
  const [showApiKey, setShowApiKey] = useState(false);
  const { toast } = useToast();

  const handleGenerateSuggestions = async () => {
    if (!apiKey.trim()) {
      toast({
        title: "API Key Required",
        description: "Please enter your Gemini API key to use AI message suggestions.",
        variant: "destructive",
      });
      return;
    }

    if (!objective.trim()) {
      toast({
        title: "Objective Required",
        description: "Please enter a campaign objective to generate suggestions.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    aiService.setApiKey(apiKey);
    
    try {
      const newSuggestions = await aiService.generateMessageSuggestions({
        objective,
        audienceRules: rules,
        audienceSize
      });
      
      setSuggestions(newSuggestions);
      
      toast({
        title: "Messages Generated",
        description: `Generated ${newSuggestions.length} AI-powered message suggestions!`,
      });
    } catch (error) {
      console.error('Error generating suggestions:', error);
      toast({
        title: "Generation Failed", 
        description: error instanceof Error ? error.message : "Failed to generate suggestions. Using fallback messages.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyMessage = (message: string) => {
    navigator.clipboard.writeText(message);
    toast({
      title: "Copied!",
      description: "Message copied to clipboard.",
    });
  };

  const getToneColor = (tone: string) => {
    switch (tone) {
      case 'friendly': return 'bg-green-100 text-green-800';
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'professional': return 'bg-blue-100 text-blue-800';
      case 'promotional': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const objectiveSuggestions = [
    "Increase sales with a promotional offer",
    "Re-engage inactive customers",
    "Promote new product launch",
    "Drive traffic to seasonal sale",
    "Encourage repeat purchases",
    "Welcome new customers"
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-purple-600" />
          AI Message Suggestions
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* API Key Configuration */}
        {showApiKeyInput && (
          <div className="space-y-2 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center justify-between">
              <Label htmlFor="apiKey" className="text-sm font-medium">
                Gemini API Key
              </Label>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowApiKeyInput(false)}
                className="text-blue-600 p-1"
              >
                <EyeOff className="w-4 h-4" />
              </Button>
            </div>
            <div className="relative">
              <Input
                id="apiKey"
                type={showApiKey ? "text" : "password"}
                placeholder="sk-..."
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="pr-10"
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowApiKey(!showApiKey)}
                className="absolute right-1 top-1/2 -translate-y-1/2 p-1"
              >
                {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </Button>
            </div>
            <p className="text-xs text-blue-600">
              Your API key is stored locally and used only for generating message suggestions.
            </p>
          </div>
        )}

        {!showApiKeyInput && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-green-600">✓ API Key configured</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowApiKeyInput(true)}
              className="text-blue-600 p-1"
            >
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        )}

        {/* Campaign Objective */}
        <div className="space-y-2">
          <Label htmlFor="objective">Campaign Objective</Label>
          <Textarea
            id="objective"
            placeholder="Describe what you want to achieve with this campaign..."
            value={objective}
            onChange={(e) => setObjective(e.target.value)}
            rows={2}
          />
          <div className="flex flex-wrap gap-2">
            {objectiveSuggestions.map((suggestion) => (
              <Button
                key={suggestion}
                variant="outline"
                size="sm"
                onClick={() => setObjective(suggestion)}
                className="text-xs"
              >
                {suggestion}
              </Button>
            ))}
          </div>
        </div>

        {/* Generate Button */}
        <Button
          onClick={handleGenerateSuggestions}
          disabled={isLoading || !apiKey.trim()}
          className="w-full bg-purple-600 hover:bg-purple-700"
        >
          {isLoading ? (
            <>
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              Generating AI Messages...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 mr-2" />
              Generate AI Messages
            </>
          )}
        </Button>

        {/* Suggestions */}
        {suggestions.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-medium text-gray-900">AI-Generated Messages</h4>
            {suggestions.map((suggestion) => (
              <div
                key={suggestion.id}
                className={`p-4 border rounded-lg cursor-pointer transition-all ${
                  selectedMessage === suggestion.message
                    ? 'border-purple-300 bg-purple-50'
                    : 'border-gray-200 hover:border-purple-200 hover:bg-purple-25'
                }`}
                onClick={() => onSelectMessage(suggestion.message)}
              >
                <div className="flex items-start justify-between mb-2">
                  <Badge className={getToneColor(suggestion.tone)}>
                    {suggestion.tone}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCopyMessage(suggestion.message);
                    }}
                    className="p-1"
                  >
                    <Copy className="w-3 h-3" />
                  </Button>
                </div>
                <p className="text-sm font-medium mb-2">{suggestion.message}</p>
                <p className="text-xs text-gray-600">{suggestion.reasoning}</p>
                <div className="mt-2 text-xs text-gray-500">
                  Character count: {suggestion.message.length}/160
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Usage Info */}
        <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded-lg">
          <p className="font-medium mb-1">How it works:</p>
          <ul className="space-y-1">
            <li>• AI analyzes your audience rules and campaign objective</li>
            <li>• Generates personalized messages optimized for your target segment</li>
            <li>• Suggests different tones and approaches for maximum engagement</li>
            <li>• Messages are optimized for SMS (160 character limit)</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};
