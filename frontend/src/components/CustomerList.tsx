import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, User, Mail, DollarSign, Calendar, Clock } from 'lucide-react';

interface Customer {
  _id: string;
  name: string;
  email: string;
  spend: number;
  visits: number;
  lastActive: string;
  createdAt: string;
  updatedAt: string;
}

interface CustomerListProps {
  onBack: () => void;
}

const CustomerList: React.FC<CustomerListProps> = ({ onBack }) => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://mini-crm-lp2n.onrender.com/api/customers');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        // Map the data to match the Customer interface, handling nested objects for dates and numbers
        const formattedData: Customer[] = data.map((customer: any) => ({
          _id: customer._id.$oid || customer._id, // Handle both $oid and direct string _id
          name: customer.name,
          email: customer.email,
          spend: parseInt(customer.spend.$numberInt || customer.spend), // Handle both $numberInt and direct number spend
          visits: parseInt(customer.visits.$numberInt || customer.visits), // Handle both $numberInt and direct number visits
          lastActive: customer.lastActive && customer.lastActive.$date && customer.lastActive.$date.$numberLong ? new Date(parseInt(customer.lastActive.$date.$numberLong)).toISOString() : customer.lastActive, // Handle $date.$numberLong and direct string lastActive
          createdAt: customer.createdAt && customer.createdAt.$date && customer.createdAt.$date.$numberLong ? new Date(parseInt(customer.createdAt.$date.$numberLong)).toISOString() : customer.createdAt, // Handle $date.$numberLong and direct string createdAt
          updatedAt: customer.updatedAt && customer.updatedAt.$date && customer.updatedAt.$date.$numberLong ? new Date(parseInt(customer.updatedAt.$date.$numberLong)).toISOString() : customer.updatedAt, // Handle $date.$numberLong and direct string updatedAt
        }));
        setCustomers(formattedData);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  if (loading) {
    return <div className="text-center py-12">Loading customers...</div>;
  }

  if (error) {
    return <div className="text-center py-12 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" onClick={onBack} className="p-2">
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Added Customers</h1>
            <p className="text-gray-600">View and manage all your added customer records</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {customers.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-500 text-lg font-medium">No customers found</p>
            <p className="text-gray-400 mt-1">Add new customers to see them here.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {customers.map((customer) => (
              <Card key={customer._id} className="shadow-lg border-0 bg-white/70 backdrop-blur-sm">
                <CardHeader className="border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                  <CardTitle className="text-xl font-bold text-gray-800 flex items-center gap-2">
                    <User className="w-5 h-5 text-blue-600" /> {customer.name}
                  </CardTitle>
                  <CardDescription className="text-gray-600 mt-1 flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-500" /> {customer.email}
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6 space-y-3">
                  <div className="flex items-center gap-2 text-gray-700">
                    <DollarSign className="w-4 h-4 text-green-600" />
                    <span className="font-medium">Total Spend:</span> ${customer.spend}
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <Clock className="w-4 h-4 text-purple-600" />
                    <span className="font-medium">Total Visits:</span> {customer.visits}
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <Calendar className="w-4 h-4 text-orange-600" />
                    <span className="font-medium">Last Active:</span> {new Date(customer.lastActive).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span className="font-medium">Created At:</span> {new Date(customer.createdAt).toLocaleDateString()}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerList;