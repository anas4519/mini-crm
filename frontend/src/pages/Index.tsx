import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Users, Target, BarChart3, Plus, TrendingUp, Eye, Calendar, LogOut } from "lucide-react";
import { AudienceBuilder } from "@/components/AudienceBuilder";
import { CampaignHistory } from "@/components/CampaignHistory";
import AddCustomer from "@/components/AddCustomer"; 
import CustomerList from "@/components/CustomerList";
import { useAuth } from "../contexts/AuthContext";
import { communicationService } from "../services/communicationService";
import { Campaign } from "../types/communication";


const Index = () => {
  const { logout } = useAuth();
  const [currentView, setCurrentView] = useState<'dashboard' | 'builder' | 'history'| 'addCustomer' | 'customerList'>('dashboard');
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        setLoading(true);
        const campaignData = await communicationService.getCampaignHistory();
        setCampaigns(campaignData);
      } catch (error) {
        console.error('Error fetching campaigns:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCampaigns();
  }, [currentView]);

  const renderContent = () => {
    switch (currentView) {
      case 'builder':
        return <AudienceBuilder onBack={() => setCurrentView('dashboard')} onSave={() => setCurrentView('history')} />;
      case 'history':
        return <CampaignHistory onBack={() => setCurrentView('dashboard')} />;
      case 'addCustomer': // New case for AddCustomer
        return <AddCustomer onBack={() => setCurrentView('dashboard')} onSave={(customer) => {
          console.log('Customer added:', customer);
          setCurrentView('dashboard');
        }} />;
      case 'customerList': // New case for CustomerList
        return <CustomerList onBack={() => setCurrentView('dashboard')} />;
      default:
        return (
          <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30">
            {/* Header */}
            <div className="bg-white border-b border-gray-200/60 shadow-sm">
              <div className="max-w-7xl mx-auto px-6 py-8">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-3">
                      Audience Segments
                    </h1>
                    <p className="text-gray-600 text-lg">Create targeted audience segments with intelligent rule logic</p>
                  </div>
                  <div className="flex gap-3">
                    <Button 
                      onClick={() => setCurrentView('builder')}
                      className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      Create Segment
                    </Button>
                    <Button 
                      onClick={() => setCurrentView('addCustomer')} // Update onClick to show AddCustomer
                      className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      Add Customer
                    </Button>
                    <Button 
                      onClick={logout} // Add logout button
                      variant="outline"
                      className="border-2 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 flex items-center gap-2"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-8">
              {/* Stats Overview */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <Card className="bg-gradient-to-br from-blue-50 to-blue-100/50 border-blue-200/50 hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-blue-700 font-medium text-sm uppercase tracking-wide">Total Campaigns</p>
                        <p className="text-3xl font-bold text-blue-900 mt-1">{loading ? '...' : campaigns.length}</p>
                      </div>
                      <div className="bg-blue-200/50 p-3 rounded-xl">
                        <Target className="w-6 h-6 text-blue-700" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-green-50 to-green-100/50 border-green-200/50 hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-green-700 font-medium text-sm uppercase tracking-wide">Total Audience</p>
                        <p className="text-3xl font-bold text-green-900 mt-1">
                          {loading ? '...' : campaigns.reduce((sum, campaign) => sum + campaign.audienceSize, 0).toLocaleString()}
                        </p>
                      </div>
                      <div className="bg-green-200/50 p-3 rounded-xl">
                        <Users className="w-6 h-6 text-green-700" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-purple-50 to-purple-100/50 border-purple-200/50 hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-purple-700 font-medium text-sm uppercase tracking-wide">Total Sent</p>
                        <p className="text-3xl font-bold text-purple-900 mt-1">
                          {loading ? '...' : campaigns.reduce((sum, campaign) => sum + campaign.totalSent, 0).toLocaleString()}
                        </p>
                      </div>
                      <div className="bg-purple-200/50 p-3 rounded-xl">
                        <TrendingUp className="w-6 h-6 text-purple-700" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-orange-50 to-orange-100/50 border-orange-200/50 hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-orange-700 font-medium text-sm uppercase tracking-wide">Active Campaigns</p>
                        <p className="text-3xl font-bold text-orange-900 mt-1">
                          {loading ? '...' : campaigns.filter(campaign => campaign.status.toLowerCase() === 'active').length}
                        </p>
                      </div>
                      <div className="bg-orange-200/50 p-3 rounded-xl">
                        <BarChart3 className="w-6 h-6 text-orange-700" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Action Cards - Now in a 3-column grid */}
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <Card className="group hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1 bg-gradient-to-br from-white to-blue-50/30 border-2 border-transparent hover:border-blue-200/50" onClick={() => setCurrentView('builder')}>
                  <CardHeader className="text-center pb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                      <Target className="w-8 h-8 text-white" />
                    </div>
                    <CardTitle className="text-xl font-bold text-gray-800 mb-2">Create New Segment</CardTitle>
                    <CardDescription className="text-gray-600 text-sm">Build sophisticated audience rules with flexible logic operators and real-time preview</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 text-base shadow-lg hover:shadow-xl transition-all duration-200">
                      <Plus className="w-5 h-5 mr-2" />
                      Start Building
                    </Button>
                  </CardContent>
                </Card>

                <Card className="group hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1 bg-gradient-to-br from-white to-green-50/30 border-2 border-transparent hover:border-green-200/50" onClick={() => setCurrentView('history')}>
                  <CardHeader className="text-center pb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                      <BarChart3 className="w-8 h-8 text-white" />
                    </div>
                    <CardTitle className="text-xl font-bold text-gray-800 mb-2">Campaign Analytics</CardTitle>
                    <CardDescription className="text-gray-600 text-sm">Analyze campaign performance with detailed metrics and delivery insights</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button variant="outline" className="w-full border-2 border-green-200 text-green-700 hover:bg-green-50 font-semibold py-3 text-base hover:border-green-300 transition-all duration-200">
                      <Eye className="w-5 h-5 mr-2" />
                      View Analytics
                    </Button>
                  </CardContent>
                </Card>

                <Card className="group hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1 bg-gradient-to-br from-white to-purple-50/30 border-2 border-transparent hover:border-purple-200/50" onClick={() => setCurrentView('customerList')}>
                  <CardHeader className="text-center pb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                      <Users className="w-8 h-8 text-white" />
                    </div>
                    <CardTitle className="text-xl font-bold text-gray-800 mb-2">Added Customers</CardTitle>
                    <CardDescription className="text-gray-600 text-sm">View and manage all your added customer records.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button variant="outline" className="w-full border-2 border-purple-200 text-purple-700 hover:bg-purple-50 font-semibold py-3 text-base hover:border-purple-300 transition-all duration-200">
                      <Eye className="w-5 h-5 mr-2" />
                      View Customers
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* Segments List */}
              <div className="grid lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <Card className="shadow-lg border-0 bg-white/70 backdrop-blur-sm">
                    <CardHeader className="border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-xl font-bold text-gray-800">Campaign History</CardTitle>
                          <CardDescription className="text-gray-600 mt-1">Your recent campaign segments</CardDescription>
                        </div>
                        <Button variant="ghost" size="sm" className="text-gray-500 hover:text-gray-700" onClick={() => setCurrentView('history')}>
                          View All
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="p-0">
                      <div className="divide-y divide-gray-100">
                        {loading ? (
                          <div className="text-center py-12">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                              <Target className="w-8 h-8 text-gray-400 animate-spin" />
                            </div>
                            <p className="text-gray-500 text-lg font-medium">Loading campaigns...</p>
                          </div>
                        ) : campaigns.length === 0 ? (
                          <div className="text-center py-12">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                              <Target className="w-8 h-8 text-gray-400" />
                            </div>
                            <p className="text-gray-500 text-lg font-medium">No campaigns created yet</p>
                            <p className="text-gray-400 mt-1">Create your first campaign segment to get started</p>
                          </div>
                        ) : (
                          campaigns.slice(0, 3).map(campaign => (
                            <div key={campaign.id} className="p-6 hover:bg-gray-50/50 transition-colors duration-200 group">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center gap-3 mb-2">
                                    <h3 className="font-bold text-lg text-gray-800 group-hover:text-blue-700 transition-colors">{campaign.name}</h3>
                                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                      campaign.status.toLowerCase() === 'active' 
                                        ? 'bg-green-100 text-green-700' 
                                        : campaign.status.toLowerCase() === 'pending'
                                        ? 'bg-yellow-100 text-yellow-700'
                                        : 'bg-gray-100 text-gray-700'
                                    }`}>
                                      {campaign.status}
                                    </span>
                                  </div>
                                  <div className="text-sm text-gray-600 mb-2">
                                    <span className="font-medium text-blue-600">Segment:</span> {campaign.segmentName}
                                  </div>
                                  <div className="text-sm text-gray-600 mb-3 font-mono bg-gray-50 p-2 rounded-lg border">
                                    {campaign.segmentRules.map((rule, idx) => (
                                      <span key={rule._id}>
                                        <span className="font-semibold text-blue-600">{rule.field}</span>{' '}
                                        <span className="text-purple-600">{rule.operator}</span>{' '}
                                        <span className="text-green-600">"{rule.value || 'empty'}"</span>
                                        {idx < campaign.segmentRules.length - 1 && (
                                          <span className="font-bold text-orange-600 mx-2">AND</span>
                                        )}
                                      </span>
                                    ))}
                                  </div>
                                  <div className="flex items-center gap-4 text-sm text-gray-500">
                                    <div className="flex items-center gap-1">
                                      <Calendar className="w-4 h-4" />
                                      {new Date(campaign.createdAt).toLocaleDateString()}
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <TrendingUp className="w-4 h-4" />
                                      Sent: {campaign.totalSent} | Failed: {campaign.totalFailed}
                                    </div>
                                  </div>
                                </div>
                                <div className="text-right ml-6">
                                  <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2 rounded-xl shadow-md">
                                    <p className="text-xl font-bold">{campaign.audienceSize.toLocaleString()}</p>
                                    <p className="text-xs text-blue-100">audience</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="space-y-6">
                  <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-200/50 shadow-lg">
                    <CardHeader>
                      <CardTitle className="text-lg font-bold text-indigo-900">Performance Insights</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex justify-between items-center p-3 bg-white/60 rounded-lg">
                        <span className="text-gray-700 font-medium">Most Recent</span>
                        <span className="font-bold text-green-600">
                          {campaigns.length > 0 ? campaigns[0].segmentName : 'N/A'}
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-white/60 rounded-lg">
                        <span className="text-gray-700 font-medium">Largest Audience</span>
                        <span className="font-bold text-blue-600">
                          {campaigns.length > 0 ? Math.max(...campaigns.map(c => c.audienceSize)).toLocaleString() : '0'}
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-white/60 rounded-lg">
                        <span className="text-gray-700 font-medium">Pending Campaigns</span>
                        <span className="font-bold text-purple-600">
                          {campaigns.filter(c => c.status.toLowerCase() === 'pending').length}/{campaigns.length}
                        </span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200/50 shadow-lg">
                    <CardHeader>
                      <CardTitle className="text-lg font-bold text-amber-900">Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <Button variant="outline" className="w-full justify-start text-left border-amber-200 hover:bg-amber-50">
                        <Plus className="w-4 h-4 mr-2" />
                        Duplicate Top Segment
                      </Button>
                      <Button variant="outline" className="w-full justify-start text-left border-amber-200 hover:bg-amber-50">
                        <BarChart3 className="w-4 h-4 mr-2" />
                        Export Analytics
                      </Button>
                      <Button variant="outline" className="w-full justify-start text-left border-amber-200 hover:bg-amber-50">
                        <Users className="w-4 h-4 mr-2" />
                        Audience Overlap
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return renderContent();
};

export default Index;