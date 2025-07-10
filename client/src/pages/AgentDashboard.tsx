import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Plus, Eye, Edit, Trash2, Star, TrendingUp, Users, 
  DollarSign, Home, Calendar, MessageCircle, BarChart3,
  Settings, Bell, Upload, Globe
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { Link } from 'wouter';

interface Property {
  id: number;
  title: string;
  price: string;
  currency: string;
  country: string;
  city: string;
  propertyType: string;
  listingType: string;
  bedrooms: number;
  bathrooms: number;
  area: string;
  views: number;
  isActive: boolean;
  isFeatured: boolean;
  images: string[];
  createdAt: string;
}

interface DashboardStats {
  totalListings: number;
  activeListings: number;
  totalViews: number;
  newLeads: number;
  totalValue: string;
}

export default function AgentDashboard() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [newPropertyForm, setNewPropertyForm] = useState({
    title: '',
    description: '',
    price: '',
    currency: 'EUR',
    propertyType: '',
    listingType: 'sale',
    country: '',
    region: '',
    city: '',
    address: '',
    bedrooms: 1,
    bathrooms: 1,
    area: '',
    features: [],
  });

  // Mock agent ID - in real app this would come from auth context
  const agentId = 1;

  // Fetch agent's properties
  const { data: properties = [], isLoading: propertiesLoading } = useQuery<Property[]>({
    queryKey: ['/api/agents', agentId, 'properties'],
  });

  // Fetch dashboard stats
  const { data: stats } = useQuery<DashboardStats>({
    queryKey: ['/api/agents', agentId, 'stats'],
    queryFn: async () => {
      // Mock stats calculation
      const totalListings = properties.length;
      const activeListings = properties.filter(p => p.isActive).length;
      const totalViews = properties.reduce((sum, p) => sum + (p.views || 0), 0);
      const newLeads = 12; // Mock data
      const totalValue = properties.reduce((sum, p) => sum + parseFloat(p.price || '0'), 0);
      
      return {
        totalListings,
        activeListings,
        totalViews,
        newLeads,
        totalValue: `€${(totalValue / 1000000).toFixed(1)}M`,
      };
    },
    enabled: properties.length > 0,
  });

  // Create property mutation
  const createPropertyMutation = useMutation({
    mutationFn: async (propertyData: any) => {
      await apiRequest('POST', '/api/properties', {
        ...propertyData,
        agentId,
      });
    },
    onSuccess: () => {
      toast({
        title: t('agent.propertyCreated'),
        description: t('agent.propertyCreatedSuccess'),
      });
      queryClient.invalidateQueries({ queryKey: ['/api/agents', agentId, 'properties'] });
      setNewPropertyForm({
        title: '',
        description: '',
        price: '',
        currency: 'EUR',
        propertyType: '',
        listingType: 'sale',
        country: '',
        region: '',
        city: '',
        address: '',
        bedrooms: 1,
        bathrooms: 1,
        area: '',
        features: [],
      });
    },
    onError: () => {
      toast({
        title: t('common.error'),
        description: t('agent.propertyCreatedError'),
        variant: 'destructive',
      });
    },
  });

  // Delete property mutation
  const deletePropertyMutation = useMutation({
    mutationFn: async (propertyId: number) => {
      await apiRequest('DELETE', `/api/properties/${propertyId}`);
    },
    onSuccess: () => {
      toast({
        title: t('agent.propertyDeleted'),
        description: t('agent.propertyDeletedSuccess'),
      });
      queryClient.invalidateQueries({ queryKey: ['/api/agents', agentId, 'properties'] });
    },
    onError: () => {
      toast({
        title: t('common.error'),
        description: t('agent.propertyDeletedError'),
        variant: 'destructive',
      });
    },
  });

  const handleCreateProperty = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPropertyForm.title || !newPropertyForm.price) {
      toast({
        title: t('common.error'),
        description: t('agent.fillRequiredFields'),
        variant: 'destructive',
      });
      return;
    }
    createPropertyMutation.mutate(newPropertyForm);
  };

  const formatPrice = (price: string, currency: string) => {
    const num = parseFloat(price);
    if (num >= 1000000) {
      return `${currency}${(num / 1000000).toFixed(1)}M`;
    }
    if (num >= 1000) {
      return `${currency}${(num / 1000).toFixed(0)}K`;
    }
    return `${currency}${num.toLocaleString()}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-800">
      <div className="container mx-auto px-4 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-luxury text-4xl font-bold text-gray-900 dark:text-white mb-2">
              {t('agent.dashboard')}
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              {t('agent.welcomeBack')}
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
            <Button variant="outline" size="icon">
              <Settings className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <Card className="floating-card">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 luxury-gradient rounded-lg flex items-center justify-center">
                  <Home className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{t('agent.totalListings')}</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stats?.totalListings || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="floating-card">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center">
                  <Star className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{t('agent.activeListings')}</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stats?.activeListings || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="floating-card">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Eye className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{t('agent.totalViews')}</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stats?.totalViews || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="floating-card">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-orange-600 rounded-lg flex items-center justify-center">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{t('agent.newLeads')}</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stats?.newLeads || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="floating-card">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 luxury-gradient-gold rounded-lg flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{t('agent.totalValue')}</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stats?.totalValue || '€0'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="listings" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="listings" className="flex items-center space-x-2">
              <Home className="h-4 w-4" />
              <span>{t('agent.listings')}</span>
            </TabsTrigger>
            <TabsTrigger value="add-property" className="flex items-center space-x-2">
              <Plus className="h-4 w-4" />
              <span>{t('agent.addProperty')}</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center space-x-2">
              <BarChart3 className="h-4 w-4" />
              <span>{t('agent.analytics')}</span>
            </TabsTrigger>
            <TabsTrigger value="leads" className="flex items-center space-x-2">
              <MessageCircle className="h-4 w-4" />
              <span>{t('agent.leads')}</span>
            </TabsTrigger>
            <TabsTrigger value="subscription" className="flex items-center space-x-2">
              <Star className="h-4 w-4" />
              <span>{t('agent.subscription')}</span>
            </TabsTrigger>
          </TabsList>

          {/* Listings Tab */}
          <TabsContent value="listings">
            <Card className="luxury-shadow">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{t('agent.myListings')}</span>
                  <Button className="luxury-button">
                    <Plus className="h-4 w-4 mr-2" />
                    {t('agent.newListing')}
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {propertiesLoading ? (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map((i) => (
                      <Card key={i} className="animate-pulse">
                        <div className="h-48 bg-gray-200 dark:bg-gray-700"></div>
                        <CardContent className="p-4 space-y-3">
                          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : properties.length === 0 ? (
                  <div className="text-center py-12">
                    <Home className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      {t('agent.noListings')}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-6">
                      {t('agent.noListingsDescription')}
                    </p>
                    <Button className="luxury-button">
                      <Plus className="h-4 w-4 mr-2" />
                      {t('agent.createFirstListing')}
                    </Button>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {properties.map((property) => (
                      <Card key={property.id} className="floating-card group">
                        <div className="relative">
                          <img
                            src={property.images?.[0] || "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00"}
                            alt={property.title}
                            className="w-full h-48 object-cover"
                          />
                          <div className="absolute top-2 left-2">
                            <Badge className={property.isActive ? 'bg-green-600' : 'bg-gray-600'}>
                              {property.isActive ? t('agent.active') : t('agent.inactive')}
                            </Badge>
                          </div>
                          <div className="absolute top-2 right-2 flex space-x-1">
                            <Button variant="ghost" size="icon" className="bg-white/90 hover:bg-white">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="bg-white/90 hover:bg-white"
                              onClick={() => deletePropertyMutation.mutate(property.id)}
                            >
                              <Trash2 className="h-4 w-4 text-red-600" />
                            </Button>
                          </div>
                        </div>
                        
                        <CardContent className="p-4">
                          <Link href={`/property/${property.id}`}>
                            <h3 className="font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-forest-600 dark:group-hover:text-forest-400 transition-colors">
                              {property.title}
                            </h3>
                          </Link>
                          <div className="text-xl font-bold text-forest-600 dark:text-forest-400 mb-2">
                            {formatPrice(property.price, property.currency)}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                            {property.city}, {property.country}
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center space-x-3 text-gray-600 dark:text-gray-400">
                              <span>{property.bedrooms} {t('property.beds')}</span>
                              <span>{property.bathrooms} {t('property.baths')}</span>
                              <span>{property.area} m²</span>
                            </div>
                            <div className="flex items-center space-x-1 text-gray-500">
                              <Eye className="h-3 w-3" />
                              <span>{property.views}</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Add Property Tab */}
          <TabsContent value="add-property">
            <Card className="luxury-shadow">
              <CardHeader>
                <CardTitle>{t('agent.addNewProperty')}</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreateProperty} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                        {t('property.title')} *
                      </label>
                      <Input
                        value={newPropertyForm.title}
                        onChange={(e) => setNewPropertyForm(prev => ({ ...prev, title: e.target.value }))}
                        placeholder={t('agent.propertyTitlePlaceholder')}
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                        {t('property.price')} *
                      </label>
                      <div className="flex space-x-2">
                        <Select
                          value={newPropertyForm.currency}
                          onValueChange={(value) => setNewPropertyForm(prev => ({ ...prev, currency: value }))}
                        >
                          <SelectTrigger className="w-24">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="EUR">EUR</SelectItem>
                            <SelectItem value="USD">USD</SelectItem>
                            <SelectItem value="GBP">GBP</SelectItem>
                          </SelectContent>
                        </Select>
                        <Input
                          type="number"
                          value={newPropertyForm.price}
                          onChange={(e) => setNewPropertyForm(prev => ({ ...prev, price: e.target.value }))}
                          placeholder="0"
                          className="flex-1"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                      {t('property.description')}
                    </label>
                    <Textarea
                      value={newPropertyForm.description}
                      onChange={(e) => setNewPropertyForm(prev => ({ ...prev, description: e.target.value }))}
                      placeholder={t('agent.propertyDescriptionPlaceholder')}
                      rows={4}
                    />
                  </div>

                  <div className="grid md:grid-cols-3 gap-6">
                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                        {t('search.propertyType')} *
                      </label>
                      <Select
                        value={newPropertyForm.propertyType}
                        onValueChange={(value) => setNewPropertyForm(prev => ({ ...prev, propertyType: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={t('search.selectType')} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="villa">{t('propertyTypes.villa')}</SelectItem>
                          <SelectItem value="apartment">{t('propertyTypes.apartment')}</SelectItem>
                          <SelectItem value="penthouse">{t('propertyTypes.penthouse')}</SelectItem>
                          <SelectItem value="farmhouse">{t('propertyTypes.farmhouse')}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                        {t('search.listingType')} *
                      </label>
                      <Select
                        value={newPropertyForm.listingType}
                        onValueChange={(value) => setNewPropertyForm(prev => ({ ...prev, listingType: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="sale">{t('listingTypes.sale')}</SelectItem>
                          <SelectItem value="rent">{t('listingTypes.rent')}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                        {t('property.area')} (m²)
                      </label>
                      <Input
                        type="number"
                        value={newPropertyForm.area}
                        onChange={(e) => setNewPropertyForm(prev => ({ ...prev, area: e.target.value }))}
                        placeholder="0"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-3 gap-6">
                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                        {t('search.country')} *
                      </label>
                      <Input
                        value={newPropertyForm.country}
                        onChange={(e) => setNewPropertyForm(prev => ({ ...prev, country: e.target.value }))}
                        placeholder={t('search.country')}
                        required
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                        {t('search.region')} *
                      </label>
                      <Input
                        value={newPropertyForm.region}
                        onChange={(e) => setNewPropertyForm(prev => ({ ...prev, region: e.target.value }))}
                        placeholder={t('search.region')}
                        required
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                        {t('search.city')} *
                      </label>
                      <Input
                        value={newPropertyForm.city}
                        onChange={(e) => setNewPropertyForm(prev => ({ ...prev, city: e.target.value }))}
                        placeholder={t('search.city')}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                      {t('property.address')}
                    </label>
                    <Input
                      value={newPropertyForm.address}
                      onChange={(e) => setNewPropertyForm(prev => ({ ...prev, address: e.target.value }))}
                      placeholder={t('agent.addressPlaceholder')}
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                        {t('property.bedrooms')}
                      </label>
                      <Select
                        value={newPropertyForm.bedrooms.toString()}
                        onValueChange={(value) => setNewPropertyForm(prev => ({ ...prev, bedrooms: parseInt(value) }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                            <SelectItem key={num} value={num.toString()}>{num}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                        {t('property.bathrooms')}
                      </label>
                      <Select
                        value={newPropertyForm.bathrooms.toString()}
                        onValueChange={(value) => setNewPropertyForm(prev => ({ ...prev, bathrooms: parseInt(value) }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {[1, 2, 3, 4, 5, 6].map((num) => (
                            <SelectItem key={num} value={num.toString()}>{num}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-4">
                    <Button type="button" variant="outline">
                      {t('common.cancel')}
                    </Button>
                    <Button 
                      type="submit" 
                      className="luxury-button"
                      disabled={createPropertyMutation.isPending}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      {createPropertyMutation.isPending ? t('common.creating') : t('agent.createListing')}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card className="luxury-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <TrendingUp className="h-5 w-5" />
                    <span>{t('agent.performanceOverview')}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-forest-50 dark:bg-forest-900/20 rounded-lg">
                      <span className="text-sm font-medium">{t('agent.thisMonth')}</span>
                      <span className="text-green-600 dark:text-green-400 font-semibold">+24%</span>
                    </div>
                    <div className="h-40 bg-gradient-to-r from-forest-100 to-gold-100 dark:from-gray-700 dark:to-gray-600 rounded-lg flex items-end space-x-1 p-4">
                      {[40, 60, 80, 100, 70, 90, 85].map((height, i) => (
                        <div
                          key={i}
                          className="w-full bg-forest-500 rounded-t"
                          style={{ height: `${height}%` }}
                        ></div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="luxury-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Globe className="h-5 w-5" />
                    <span>{t('agent.globalReach')}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">{t('agent.countriesReached')}</span>
                      <span className="font-semibold">12</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">{t('agent.portalsActive')}</span>
                      <span className="font-semibold">45</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">{t('agent.internationalViews')}</span>
                      <span className="font-semibold">68%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Leads Tab */}
          <TabsContent value="leads">
            <Card className="luxury-shadow">
              <CardHeader>
                <CardTitle>{t('agent.recentLeads')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {t('agent.noLeads')}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {t('agent.noLeadsDescription')}
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Subscription Tab */}
          <TabsContent value="subscription">
            <Card className="luxury-shadow">
              <CardHeader>
                <CardTitle>{t('agent.currentPlan')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between p-6 bg-forest-50 dark:bg-forest-900/20 rounded-lg">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">Global 50</h3>
                    <p className="text-gray-600 dark:text-gray-400">{t('pricing.plans.global50.description')}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-forest-600 dark:text-forest-400">$160/mo</div>
                    <Badge className="bg-green-600 text-white">{t('agent.activePlan')}</Badge>
                  </div>
                </div>
                
                <div className="mt-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <span>{t('agent.listingsUsed')}</span>
                    <span className="font-semibold">{properties.length}/50</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-forest-600 h-2 rounded-full" 
                      style={{ width: `${(properties.length / 50) * 100}%` }}
                    ></div>
                  </div>
                </div>

                <div className="mt-8 flex space-x-4">
                  <Link href="/pricing">
                    <Button className="luxury-button">
                      {t('agent.upgradePlan')}
                    </Button>
                  </Link>
                  <Button variant="outline">
                    {t('agent.manageBilling')}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
