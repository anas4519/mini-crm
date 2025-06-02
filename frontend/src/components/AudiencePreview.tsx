
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, TrendingUp, Percent } from "lucide-react";

interface Rule {
  id: string;
  field: string;
  operator: string;
  value: string;
  connector?: 'AND' | 'OR';
}

interface AudiencePreviewProps {
  rules: Rule[];
  visible: boolean;
}

export const AudiencePreview = ({ rules, visible }: AudiencePreviewProps) => {
  const [audienceSize, setAudienceSize] = useState(0);
  const [loading, setLoading] = useState(false);

  // Simulate audience calculation
  useEffect(() => {
    if (rules.length > 0 && visible) {
      setLoading(true);
      const timer = setTimeout(() => {
        // Simple simulation based on rules
        let baseSize = 10000;
        rules.forEach(rule => {
          if (rule.field === 'spend' && rule.operator === '>') {
            baseSize = Math.floor(baseSize * 0.3); // High spenders are fewer
          }
          if (rule.field === 'visits' && rule.operator === '<') {
            baseSize = Math.floor(baseSize * 0.4); // Low visitors
          }
          if (rule.field === 'lastActive') {
            baseSize = Math.floor(baseSize * 0.2); // Inactive users
          }
        });
        setAudienceSize(Math.max(500, baseSize + Math.floor(Math.random() * 1000)));
        setLoading(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [rules, visible]);

  if (!visible) return null;

  const totalUsers = 50000; // Mock total user base
  const percentage = ((audienceSize / totalUsers) * 100).toFixed(1);

  return (
    <Card className="animate-fade-in">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="w-5 h-5" />
          Audience Preview
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-6">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-3"></div>
            <p className="text-sm text-gray-600">Calculating audience size...</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">{audienceSize.toLocaleString()}</div>
              <p className="text-sm text-gray-600">estimated users</p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Percent className="w-4 h-4 text-blue-600" />
                  <span className="text-sm">Audience Reach</span>
                </div>
                <span className="font-medium">{percentage}%</span>
              </div>

              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-600 h-2 rounded-full transition-all duration-1000"
                  style={{ width: `${Math.min(100, parseFloat(percentage))}%` }}
                ></div>
              </div>

              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>0</span>
                <span>{totalUsers.toLocaleString()} total users</span>
              </div>
            </div>

            <div className="pt-3 border-t">
              <div className="flex items-center gap-2 text-sm">
                <TrendingUp className="w-4 h-4 text-green-600" />
                <span className="text-gray-600">Est. engagement rate: </span>
                <span className="font-medium text-green-600">
                  {(Math.random() * 15 + 5).toFixed(1)}%
                </span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
