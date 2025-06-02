
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Plus, Trash2, GripVertical } from "lucide-react";

interface Rule {
  id: string;
  field: string;
  operator: string;
  value: string;
  connector?: 'AND' | 'OR';
}

interface RuleBuilderProps {
  rules: Rule[];
  setRules: (rules: Rule[]) => void;
}

export const RuleBuilder = ({ rules, setRules }: RuleBuilderProps) => {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const fields = [
    { value: 'spend', label: 'Total Spend (₹)' },
    { value: 'visits', label: 'Page Visits' },
    { value: 'lastActive', label: 'Days Since Last Active' },
    { value: 'age', label: 'Age' },
    { value: 'orders', label: 'Total Orders' },
    { value: 'location', label: 'Location' }
  ];

  const operators = [
    { value: '>', label: 'Greater than' },
    { value: '<', label: 'Less than' },
    { value: '>=', label: 'Greater than or equal' },
    { value: '<=', label: 'Less than or equal' },
    { value: '=', label: 'Equals' },
    { value: '!=', label: 'Not equals' }
  ];

  const addRule = () => {
    const newRule: Rule = {
      id: Date.now().toString(),
      field: 'spend',
      operator: '>',
      value: '',
      connector: 'AND'
    };
    setRules([...rules, newRule]);
  };

  const updateRule = (id: string, field: string, value: any) => {
    setRules(rules.map(rule => 
      rule.id === id ? { ...rule, [field]: value } : rule
    ));
  };

  const removeRule = (id: string) => {
    setRules(rules.filter(rule => rule.id !== id));
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggedIndex === null) return;

    const newRules = [...rules];
    const draggedRule = newRules[draggedIndex];
    newRules.splice(draggedIndex, 1);
    newRules.splice(dropIndex, 0, draggedRule);

    setRules(newRules);
    setDraggedIndex(null);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Audience Rules</span>
          <Button onClick={addRule} size="sm" className="bg-green-600 hover:bg-green-700">
            <Plus className="w-4 h-4 mr-1" />
            Add Rule
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {rules.map((rule, index) => (
            <div key={rule.id}>
              <div
                className="flex items-center gap-3 p-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                draggable
                onDragStart={(e) => handleDragStart(e, index)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, index)}
              >
                <div className="cursor-grab hover:cursor-grabbing text-gray-400">
                  <GripVertical className="w-4 h-4" />
                </div>

                <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-3">
                  <Select
                    value={rule.field}
                    onValueChange={(value) => updateRule(rule.id, 'field', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {fields.map(field => (
                        <SelectItem key={field.value} value={field.value}>
                          {field.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select
                    value={rule.operator}
                    onValueChange={(value) => updateRule(rule.id, 'operator', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {operators.map(op => (
                        <SelectItem key={op.value} value={op.value}>
                          {op.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Input
                    placeholder="Value"
                    value={rule.value}
                    onChange={(e) => updateRule(rule.id, 'value', e.target.value)}
                  />

                  {index < rules.length - 1 && (
                    <Select
                      value={rule.connector}
                      onValueChange={(value) => updateRule(rule.id, 'connector', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="AND">AND</SelectItem>
                        <SelectItem value="OR">OR</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeRule(rule.id)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>

              {index < rules.length - 1 && rule.connector && (
                <div className="flex justify-center py-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    rule.connector === 'AND' 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'bg-purple-100 text-purple-700'
                  }`}>
                    {rule.connector}
                  </span>
                </div>
              )}
            </div>
          ))}

          {rules.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <p>No rules defined yet.</p>
              <p className="text-sm">Click "Add Rule" to get started.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
