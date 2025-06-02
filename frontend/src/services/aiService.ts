interface MessageSuggestion {
  id: string;
  message: string;
  tone: 'friendly' | 'urgent' | 'professional' | 'promotional';
  reasoning: string;
}

interface GenerateMessagesRequest {
  objective: string;
  audienceRules: any[];
  audienceSize: number;
}

class AIService {
  private apiKey: string | null = null;

  setApiKey(key: string) {
    this.apiKey = key;
    localStorage.setItem('gemini_api_key', key);
  }

  getApiKey(): string | null {
    if (this.apiKey) return this.apiKey;
    return localStorage.getItem('gemini_api_key');
  }

  clearApiKey() {
    this.apiKey = null;
    localStorage.removeItem('gemini_api_key');
  }

  private generateAudienceDescription(rules: any[]): string {
    if (rules.length === 0) return "all customers";
    return rules.map(rule => {
      const fieldLabels: Record<string, string> = {
        spend: 'total spend',
        visits: 'page visits',
        lastActive: 'days since last active',
        age: 'age',
        orders: 'total orders',
        location: 'location'
      };
      const operatorLabels: Record<string, string> = {
        '>': 'greater than',
        '<': 'less than',
        '>=': 'at least',
        '<=': 'at most',
        '=': 'equal to',
        '!=': 'not equal to'
      };
      const field = fieldLabels[rule.field] || rule.field;
      const operator = operatorLabels[rule.operator] || rule.operator;
      const value = rule.field === 'spend' ? `₹${rule.value}` : rule.value;
      return `${field} ${operator} ${value}`;
    }).join(' and ');
  }

  async generateMessageSuggestions(request: GenerateMessagesRequest): Promise<MessageSuggestion[]> {
    const apiKey = this.getApiKey();
    if (!apiKey) {
      throw new Error('Gemini API key not configured');
    }

    const audienceDescription = this.generateAudienceDescription(request.audienceRules);
    
    const prompt = `You are a marketing expert creating personalized campaign messages for an Indian e-commerce platform.\n\nCampaign Objective: ${request.objective}\nTarget Audience: Customers with ${audienceDescription}\nAudience Size: ${request.audienceSize} people\n\nGenerate 3 different message variations that:\n1. Are personalized and relevant to the audience characteristics\n2. Use appropriate Indian cultural context and currency (₹)\n3. Have different tones (friendly, urgent, professional)\n4. Are concise (under 160 characters for SMS compatibility)\n5. Include a clear call-to-action\n\nReturn your response as a JSON array with this exact structure:\n[\n  {\n    "message": "Your message here",\n    "tone": "friendly",\n    "reasoning": "Brief explanation of why this message works for this audience"\n  }\n]\n\nDo not include any text outside the JSON array.`;

    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }]
            }
          ]
        })
      });

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      let content = data.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!content) {
        throw new Error('No content received from Gemini');
      }

      // Remove markdown code block fences if present
      if (content.startsWith('```json') && content.endsWith('```')) {
        content = content.substring(7, content.length - 3).trim();
      }

      const suggestions = JSON.parse(content);

      return suggestions.map((suggestion: any, index: number) => ({
        id: `msg_${Date.now()}_${index}`,
        message: suggestion.message,
        tone: suggestion.tone,
        reasoning: suggestion.reasoning
      }));

    } catch (error) {
      console.error('Error generating AI messages:', error);
      return this.getMockSuggestions(request);
    }
  }

  private getMockSuggestions(request: GenerateMessagesRequest): MessageSuggestion[] {
    const audienceDescription = this.generateAudienceDescription(request.audienceRules);
    
    return [
      {
        id: 'mock_1',
        message: `Hi! Special 15% off just for you. Shop now and save on your favorites! Use code SAVE15. Valid till midnight! 🛍️`,
        tone: 'friendly',
        reasoning: `Friendly tone works well for customers with ${audienceDescription}, offering immediate value with urgency.`
      },
      {
        id: 'mock_2',
        message: `URGENT: Limited time offer! Get 20% off your next purchase. Don't miss out - only 24 hours left! Shop now.`,
        tone: 'urgent',
        reasoning: `Urgent messaging creates immediate action for this audience segment, emphasizing scarcity.`
      },
      {
        id: 'mock_3',
        message: `Exclusive offer for valued customers: Enjoy 10% off + free shipping on orders above ₹999. Shop premium quality today.`,
        tone: 'professional',
        reasoning: `Professional tone respects the customer relationship while highlighting premium value proposition.`
      }
    ];
  }
}

export const aiService = new AIService();
export type { MessageSuggestion, GenerateMessagesRequest };
