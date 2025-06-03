import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserPlus, Users, Mail, DollarSign, MousePointer, Clock, ArrowLeft } from "lucide-react";

interface Customer {
  id?: number;
  name: string;
  email: string;
  spend: number;
  visits: number;
  lastActive: string;
}

interface AddCustomerProps {
  onBack: () => void;
  onSave: (customer: Customer) => void;
}

const AddCustomer = ({ onBack, onSave }: AddCustomerProps) => {
  const [customerForm, setCustomerForm] = useState({
    name: '',
    email: '',
    spend: '',
    visits: '',
    lastActive: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setCustomerForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const customerData = {
        name: customerForm.name,
        email: customerForm.email,
        spend: parseFloat(customerForm.spend) || 0,
        visits: parseInt(customerForm.visits) || 0,
        lastActive: customerForm.lastActive ? new Date(customerForm.lastActive).toISOString() : new Date().toISOString()
      };

      // POST to API
      const response = await fetch(' https://mini-crm-lp2n.onrender.com/api/customers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(customerData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const savedCustomer = await response.json();
      
      // Call the onSave callback with the saved customer data
      await onSave(savedCustomer);
      
      // Reset form on success
      setCustomerForm({ name: '', email: '', spend: '', visits: '', lastActive: '' });
    } catch (error) {
      console.error('Error saving customer:', error);
      alert('Failed to save customer. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setCustomerForm({ name: '', email: '', spend: '', visits: '', lastActive: '' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-green-50/30">
      {/* Header */}
      <div className="bg-white border-b border-gray-200/60 shadow-sm">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              onClick={onBack}
              className="flex items-center gap-2 hover:bg-gray-100 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Button>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-3">
                Add New Customer
              </h1>
              <p className="text-gray-600 text-lg">Create a new customer profile with their details and activity data</p>
            </div>
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm hover:shadow-2xl transition-shadow duration-300">
          <CardHeader className="bg-gradient-to-r from-green-50 to-blue-50 border-b border-gray-100">
            <CardTitle className="text-2xl font-bold text-gray-800 flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                <UserPlus className="w-6 h-6 text-white" />
              </div>
              Customer Information
            </CardTitle>
            <CardDescription className="text-gray-600 text-base">
              Fill in all the required customer details below. Fields marked with * are required.
            </CardDescription>
          </CardHeader>
          
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Personal Information Section */}
              <div className="space-y-6">
                <div className="flex items-center gap-2 pb-2 border-b border-gray-200">
                  <Users className="w-5 h-5 text-green-600" />
                  <h3 className="text-lg font-semibold text-gray-800">Personal Information</h3>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label htmlFor="name" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <span className="text-red-500">*</span>
                      Full Name
                    </Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="Enter customer's full name"
                      value={customerForm.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      required
                      className="h-12 border-2 border-gray-200 focus:border-green-500 focus:ring-green-500/20 transition-all duration-200 text-base"
                    />
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="email" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      <span className="text-red-500">*</span>
                      Email Address
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="customer@example.com"
                      value={customerForm.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      required
                      className="h-12 border-2 border-gray-200 focus:border-green-500 focus:ring-green-500/20 transition-all duration-200 text-base"
                    />
                  </div>
                </div>
              </div>

              {/* Activity & Engagement Section */}
              <div className="space-y-6">
                <div className="flex items-center gap-2 pb-2 border-b border-gray-200">
                  <DollarSign className="w-5 h-5 text-blue-600" />
                  <h3 className="text-lg font-semibold text-gray-800">Activity & Engagement</h3>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label htmlFor="spend" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <DollarSign className="w-4 h-4" />
                      Total Spend (USD)
                    </Label>
                    <Input
                      id="spend"
                      type="number"
                      placeholder="0.00"
                      step="0.01"
                      min="0"
                      value={customerForm.spend}
                      onChange={(e) => handleInputChange('spend', e.target.value)}
                      className="h-12 border-2 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-200 text-base"
                    />
                    <p className="text-xs text-gray-500">Enter the total amount spent by this customer</p>
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="visits" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <MousePointer className="w-4 h-4" />
                      Total Visits
                    </Label>
                    <Input
                      id="visits"
                      type="number"
                      placeholder="0"
                      min="0"
                      value={customerForm.visits}
                      onChange={(e) => handleInputChange('visits', e.target.value)}
                      className="h-12 border-2 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-200 text-base"
                    />
                    <p className="text-xs text-gray-500">Number of times customer visited your platform</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="lastActive" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Last Active Date & Time
                  </Label>
                  <Input
                    id="lastActive"
                    type="datetime-local"
                    value={customerForm.lastActive}
                    onChange={(e) => handleInputChange('lastActive', e.target.value)}
                    className="h-12 border-2 border-gray-200 focus:border-purple-500 focus:ring-purple-500/20 transition-all duration-200 text-base max-w-md"
                  />
                  <p className="text-xs text-gray-500">When was this customer last active? (Leave empty for current time)</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-8 border-t border-gray-200">
                <Button
                  type="button"
                  variant="outline"
                  onClick={resetForm}
                  className="flex-1 h-12 border-2 hover:bg-gray-50 transition-colors text-base"
                  disabled={isSubmitting}
                >
                  Reset Form
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={onBack}
                  className="flex-1 h-12 border-2 hover:bg-gray-50 transition-colors text-base"
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting || !customerForm.name || !customerForm.email}
                  className="flex-1 h-12 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200 text-base disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Adding...
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-5 h-5 mr-2" />
                      Add Customer
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Help Section */}
        <Card className="mt-6 bg-blue-50/50 border-blue-200/50">
          <CardContent className="p-6">
            <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
              <Users className="w-4 h-4" />
              Tips for Adding Customers
            </h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Ensure email addresses are unique and valid for each customer</li>
              <li>• Spend amounts help create high-value customer segments</li>
              <li>• Visit counts indicate customer engagement levels</li>
              <li>• Last active date helps identify inactive customers for re-engagement</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AddCustomer;