import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Heart, Search, MessageCircle, Settings, User, Bell,
  Trash2, Eye, MapPin, Calendar, Filter, Crown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
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
  bedrooms: number;
  bathrooms: number;
  area: string;
  images: string[];
  views: number;
}

interface SavedSearch {
  id: number;
  name: string;
  criteria: any;
  isEmailAlert: boolean;
  createdAt: string;
}

interface Message {
  id: number;
  fromUserId: number;
  toUserId: number;
  propertyId: number;
  subject: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  property?: Property;
}

export default function UserDashboard() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [profileForm, setProfileForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    bio: '',
  });

  // Mock user ID - in real app this would come from auth context
  const userId = 1;

  // Fetch user favorites
  const { data: favorites = [], isLoading: favoritesLoading } = useQuery({
    queryKey: ['/api/users', userId, 'favorites'],
  });

  // Fetch saved searches
  const { data: savedSearches = [], isLoading: searchesLoading } = useQuery({
    queryKey: ['/api/users', userId, 'saved-searches'],
  });

  // Fetch messages
  const { data: messages = [], isLoading: messagesLoading } = useQuery({
    queryKey: ['/api/users', userId, 'messages'],
  });

  // Fetch user profile
  const { data: user } = useQuery({
    queryKey: ['/api/users', userId],
    onSuccess: (data) => {
      if (data) {
        setProfileForm({
          firstName: data.firstName || '',
          lastName: data.lastName || '',
          email: data.email || '',
          phone: data.phone || '',
          bio: data.bio || '',
        });
      }
    },
  });

  // Remove favorite mutation
  const removeFavoriteMutation = useMutation({
    mutationFn: async (propertyId: number) => {
      await apiRequest('DELETE', '/api/favorites', {
        userId,
        propertyId,
      });
    },
    onSuccess: () => {
      toast({
        title: t('user.favoriteRemoved'),
        description: t('user.favoriteRemovedSuccess'),
      });
      queryClient.invalidateQueries({ queryKey: ['/api/users', userId, 'favorites'] });
    },
    onError: () => {
      toast({
        title: t('common.error'),
        description: t('user.favoriteRemovedError'),
        variant: 'destructive',
      });
    },
  });

  // Delete saved search mutation
  const deleteSavedSearchMutation = useMutation({
    mutationFn: async (searchId: number) => {
      await apiRequest('DELETE', `/api/saved-searches/${searchId}`);
    },
    onSuccess: () => {
      toast({
        title: t('user.searchDeleted'),
        description: t('user.searchDeletedSuccess'),
      });
      queryClient.invalidateQueries({ queryKey: ['/api/users', userId, 'saved-searches'] });
    },
    onError: () => {
      toast({
        title: t('common.error'),
        description: t('user.searchDeletedError'),
        variant: 'destructive',
      });
    },
  });

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: async (profileData: any) => {
      await apiRequest('PUT', `/api/users/${userId}`, profileData);
    },
    onSuccess: () => {
      toast({
        title: t('user.profileUpdated'),
        description: t('user.profileUpdatedSuccess'),
      });
      queryClient.invalidateQueries({ queryKey: ['/api/users', userId] });
    },
    onError: () => {
      toast({
        title: t('common.error'),
        description: t('user.profileUpdatedError'),
        variant: 'destructive',
      });
    },
  });

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

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfileMutation.mutate(profileForm);
  };

  const unreadMessages = messages.filter((m: Message) => !m.isRead).length;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-800">
      <div className="container mx-auto px-4 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-luxury text-4xl font-bold text-gray-900 dark:text-white mb-2">
              {t('user.dashboard')}
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              {t('user.welcomeBack')}, {user?.firstName}
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              {unreadMessages > 0 && (
                <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {unreadMessages}
                </span>
              )}
            </Button>
            <Button variant="outline" size="icon">
              <Settings className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="floating-card">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center">
                  <Heart className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{t('user.favorites')}</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {favorites.length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="floating-card">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 luxury-gradient rounded-lg flex items-center justify-center">
                  <Search className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{t('user.savedSearches')}</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {savedSearches.length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="floating-card">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                  <MessageCircle className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{t('user.messages')}</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {messages.length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="floating-card">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 luxury-gradient-gold rounded-lg flex items-center justify-center">
                  <Crown className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{t('user.membership')}</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {t('user.premium')}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="favorites" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="favorites" className="flex items-center space-x-2">
              <Heart className="h-4 w-4" />
              <span>{t('user.favorites')}</span>
            </TabsTrigger>
            <TabsTrigger value="searches" className="flex items-center space-x-2">
              <Search className="h-4 w-4" />
              <span>{t('user.savedSearches')}</span>
            </TabsTrigger>
            <TabsTrigger value="messages" className="flex items-center space-x-2">
              <MessageCircle className="h-4 w-4" />
              <span>{t('user.messages')}</span>
              {unreadMessages > 0 && (
                <Badge className="bg-red-500 text-white text-xs">
                  {unreadMessages}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center space-x-2">
              <Settings className="h-4 w-4" />
              <span>{t('user.settings')}</span>
            </TabsTrigger>
          </TabsList>

          {/* Favorites Tab */}
          <TabsContent value="favorites">
            <Card className="luxury-shadow">
              <CardHeader>
                <CardTitle>{t('user.myFavorites')}</CardTitle>
              </CardHeader>
              <CardContent>
                {favoritesLoading ? (
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
                ) : favorites.length === 0 ? (
                  <div className="text-center py-12">
                    <Heart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      {t('user.noFavorites')}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-6">
                      {t('user.noFavoritesDescription')}
                    </p>
                    <Link href="/search">
                      <Button className="luxury-button">
                        <Search className="h-4 w-4 mr-2" />
                        {t('user.browseProperties')}
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {favorites.map((favorite: any) => {
                      const property = favorite.property;
                      if (!property) return null;
                      
                      return (
                        <Card key={favorite.id} className="floating-card group">
                          <div className="relative">
                            <img
                              src={property.images?.[0] || "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00"}
                              alt={property.title}
                              className="w-full h-48 object-cover"
                            />
                            <Button
                              variant="ghost"
                              size="icon"
                              className="absolute top-2 right-2 bg-white/90 hover:bg-white"
                              onClick={() => removeFavoriteMutation.mutate(property.id)}
                            >
                              <Trash2 className="h-4 w-4 text-red-600" />
                            </Button>
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
                            <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 mb-3">
                              <MapPin className="h-4 w-4" />
                              <span>{property.city}, {property.country}</span>
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
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Saved Searches Tab */}
          <TabsContent value="searches">
            <Card className="luxury-shadow">
              <CardHeader>
                <CardTitle>{t('user.mySavedSearches')}</CardTitle>
              </CardHeader>
              <CardContent>
                {searchesLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="animate-pulse p-4 border border-border rounded-lg">
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-2"></div>
                        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                      </div>
                    ))}
                  </div>
                ) : savedSearches.length === 0 ? (
                  <div className="text-center py-12">
                    <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      {t('user.noSavedSearches')}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-6">
                      {t('user.noSavedSearchesDescription')}
                    </p>
                    <Link href="/search">
                      <Button className="luxury-button">
                        <Search className="h-4 w-4 mr-2" />
                        {t('user.createSearch')}
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {savedSearches.map((search: SavedSearch) => (
                      <Card key={search.id} className="floating-card">
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                {search.name}
                              </h3>
                              <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400 mb-3">
                                <div className="flex items-center space-x-1">
                                  <Calendar className="h-4 w-4" />
                                  <span>{new Date(search.createdAt).toLocaleDateString()}</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <Filter className="h-4 w-4" />
                                  <span>{Object.keys(search.criteria).length} {t('user.filters')}</span>
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Switch
                                  checked={search.isEmailAlert}
                                  className="data-[state=checked]:bg-forest-600"
                                />
                                <span className="text-sm text-gray-600 dark:text-gray-400">
                                  {t('user.emailAlerts')}
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Button variant="outline" size="sm">
                                {t('user.runSearch')}
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => deleteSavedSearchMutation.mutate(search.id)}
                              >
                                <Trash2 className="h-4 w-4 text-red-600" />
                              </Button>
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

          {/* Messages Tab */}
          <TabsContent value="messages">
            <Card className="luxury-shadow">
              <CardHeader>
                <CardTitle>{t('user.myMessages')}</CardTitle>
              </CardHeader>
              <CardContent>
                {messagesLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="animate-pulse p-4 border border-border rounded-lg">
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-2"></div>
                        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full mb-1"></div>
                        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
                      </div>
                    ))}
                  </div>
                ) : messages.length === 0 ? (
                  <div className="text-center py-12">
                    <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      {t('user.noMessages')}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      {t('user.noMessagesDescription')}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {messages.map((message: Message) => (
                      <Card key={message.id} className={`floating-card ${!message.isRead ? 'border-forest-400' : ''}`}>
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-1">
                                <h3 className="font-semibold text-gray-900 dark:text-white">
                                  {message.subject}
                                </h3>
                                {!message.isRead && (
                                  <Badge className="bg-forest-600 text-white text-xs">
                                    {t('user.new')}
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                {new Date(message.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <p className="text-gray-700 dark:text-gray-300 mb-3">
                            {message.message}
                          </p>
                          {message.property && (
                            <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                                {t('user.regardingProperty')}:
                              </p>
                              <Link href={`/property/${message.property.id}`}>
                                <span className="text-forest-600 dark:text-forest-400 hover:underline">
                                  {message.property.title}
                                </span>
                              </Link>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings">
            <Card className="luxury-shadow">
              <CardHeader>
                <CardTitle>{t('user.profileSettings')}</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleProfileSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                        {t('user.firstName')}
                      </label>
                      <Input
                        value={profileForm.firstName}
                        onChange={(e) => setProfileForm(prev => ({ ...prev, firstName: e.target.value }))}
                        placeholder={t('user.firstName')}
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                        {t('user.lastName')}
                      </label>
                      <Input
                        value={profileForm.lastName}
                        onChange={(e) => setProfileForm(prev => ({ ...prev, lastName: e.target.value }))}
                        placeholder={t('user.lastName')}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                      {t('user.email')}
                    </label>
                    <Input
                      type="email"
                      value={profileForm.email}
                      onChange={(e) => setProfileForm(prev => ({ ...prev, email: e.target.value }))}
                      placeholder={t('user.email')}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                      {t('user.phone')}
                    </label>
                    <Input
                      type="tel"
                      value={profileForm.phone}
                      onChange={(e) => setProfileForm(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder={t('user.phone')}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                      {t('user.bio')}
                    </label>
                    <Textarea
                      value={profileForm.bio}
                      onChange={(e) => setProfileForm(prev => ({ ...prev, bio: e.target.value }))}
                      placeholder={t('user.bioPlaceholder')}
                      rows={4}
                    />
                  </div>

                  <div className="flex justify-end space-x-4">
                    <Button type="button" variant="outline">
                      {t('common.cancel')}
                    </Button>
                    <Button 
                      type="submit" 
                      className="luxury-button"
                      disabled={updateProfileMutation.isPending}
                    >
                      <User className="h-4 w-4 mr-2" />
                      {updateProfileMutation.isPending ? t('common.saving') : t('user.saveProfile')}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
