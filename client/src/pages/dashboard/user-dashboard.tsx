import { useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import { 
  Heart, 
  Search, 
  Mail, 
  Settings, 
  MapPin, 
  Bed, 
  Bath, 
  Square,
  Trash2,
  MessageSquare,
  Bell,
  User,
  Home,
  TrendingUp
} from "lucide-react";
import { Link } from "wouter";

export default function UserDashboard() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading, user } = useAuth();
  const queryClient = useQueryClient();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  const { data: savedProperties = [], isLoading: savedPropertiesLoading } = useQuery({
    queryKey: ["/api/saved-properties"],
    enabled: isAuthenticated,
  });

  const { data: savedSearches = [], isLoading: savedSearchesLoading } = useQuery({
    queryKey: ["/api/saved-searches"],
    enabled: isAuthenticated,
  });

  const { data: messages = [], isLoading: messagesLoading } = useQuery({
    queryKey: ["/api/messages"],
    enabled: isAuthenticated,
  });

  const { data: properties = [] } = useQuery({
    queryKey: ["/api/properties"],
    enabled: isAuthenticated,
  });

  const unsavePropertyMutation = useMutation({
    mutationFn: async (propertyId: number) => {
      return await apiRequest("DELETE", `/api/saved-properties/${propertyId}`);
    },
    onSuccess: () => {
      toast({
        title: "Property Removed",
        description: "Property has been removed from your favorites.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/saved-properties"] });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to remove property. Please try again.",
        variant: "destructive",
      });
    },
  });

  const deleteSavedSearchMutation = useMutation({
    mutationFn: async (searchId: number) => {
      return await apiRequest("DELETE", `/api/saved-searches/${searchId}`);
    },
    onSuccess: () => {
      toast({
        title: "Search Deleted",
        description: "Saved search has been removed.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/saved-searches"] });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to delete search. Please try again.",
        variant: "destructive",
      });
    },
  });

  const markMessageAsReadMutation = useMutation({
    mutationFn: async (messageId: number) => {
      return await apiRequest("PATCH", `/api/messages/${messageId}/read`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/messages"] });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
    },
  });

  // Get saved property details
  const savedPropertyDetails = savedProperties.map((saved: any) => {
    const property = properties.find((p: any) => p.id === saved.propertyId);
    return { ...saved, property };
  }).filter((item: any) => item.property);

  const unreadMessages = messages.filter((msg: any) => !msg.isRead);

  if (isLoading) {
    return (
      <Layout>
        <div className="pt-20">
          <div className="container mx-auto px-4 lg:px-8 py-8">
            <Skeleton className="w-64 h-8 mb-8" />
            <div className="grid lg:grid-cols-4 gap-8">
              <Skeleton className="h-64" />
              <Skeleton className="h-64" />
              <Skeleton className="h-64" />
              <Skeleton className="h-64" />
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Layout>
      
      <div className="pt-20">
        <div className="container mx-auto px-4 lg:px-8 py-8">
          {/* Welcome Header */}
          <div className="mb-8">
            <h1 className="font-luxury text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Welcome back, {user?.firstName || "User"}
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Manage your property searches, favorites, and messages
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-forest-100 dark:bg-forest-900 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Heart className="h-6 w-6 text-forest-600 dark:text-forest-400" />
                </div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {savedProperties.length}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Saved Properties</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-gold-100 dark:bg-gold-900 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Search className="h-6 w-6 text-gold-600 dark:text-gold-400" />
                </div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {savedSearches.length}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Saved Searches</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-forest-100 dark:bg-forest-900 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <MessageSquare className="h-6 w-6 text-forest-600 dark:text-forest-400" />
                </div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {messages.length}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Messages</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-gold-100 dark:bg-gold-900 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Bell className="h-6 w-6 text-gold-600 dark:text-gold-400" />
                </div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {unreadMessages.length}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Unread</div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Tabs */}
          <Tabs defaultValue="favorites" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="favorites" className="flex items-center space-x-2">
                <Heart className="h-4 w-4" />
                <span>Favorites</span>
              </TabsTrigger>
              <TabsTrigger value="searches" className="flex items-center space-x-2">
                <Search className="h-4 w-4" />
                <span>Saved Searches</span>
              </TabsTrigger>
              <TabsTrigger value="messages" className="flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <span>Messages</span>
                {unreadMessages.length > 0 && (
                  <Badge variant="destructive" className="ml-1 text-xs">
                    {unreadMessages.length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center space-x-2">
                <Settings className="h-4 w-4" />
                <span>Settings</span>
              </TabsTrigger>
            </TabsList>

            {/* Favorites Tab */}
            <TabsContent value="favorites">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Heart className="h-5 w-5 text-forest-600" />
                    <span>Saved Properties</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {savedPropertiesLoading ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {Array.from({ length: 3 }).map((_, i) => (
                        <Card key={i}>
                          <Skeleton className="w-full h-48" />
                          <CardContent className="p-4">
                            <Skeleton className="h-6 w-3/4 mb-2" />
                            <Skeleton className="h-4 w-1/2 mb-4" />
                            <div className="flex space-x-4 mb-4">
                              <Skeleton className="h-4 w-16" />
                              <Skeleton className="h-4 w-16" />
                            </div>
                            <Skeleton className="h-8 w-full" />
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : savedPropertyDetails.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Heart className="h-12 w-12 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        No Saved Properties
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 mb-6">
                        Start browsing properties and save your favorites to see them here.
                      </p>
                      <Link href="/search">
                        <Button className="bg-gradient-to-r from-forest-600 to-forest-700 hover:from-forest-700 hover:to-forest-800 text-white">
                          Browse Properties
                        </Button>
                      </Link>
                    </div>
                  ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {savedPropertyDetails.map((item: any) => (
                        <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                          <div className="relative">
                            <img 
                              src={item.property.images[0]} 
                              alt={item.property.title}
                              className="w-full h-48 object-cover" 
                            />
                            <Button
                              variant="destructive"
                              size="sm"
                              className="absolute top-2 right-2"
                              onClick={() => unsavePropertyMutation.mutate(item.propertyId)}
                              disabled={unsavePropertyMutation.isPending}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                          <CardContent className="p-4">
                            <div className="text-xl font-bold text-forest-600 dark:text-forest-400 mb-2">
                              €{Number(item.property.price).toLocaleString()}
                            </div>
                            <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm mb-3">
                              <MapPin className="mr-1 h-4 w-4" />
                              {item.property.city}, {item.property.region}
                            </div>
                            <h3 className="font-semibold text-gray-900 dark:text-white mb-3 line-clamp-2">
                              {item.property.title}
                            </h3>
                            <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400 mb-4">
                              <span className="flex items-center">
                                <Bed className="mr-1 h-4 w-4" />
                                {item.property.bedrooms}
                              </span>
                              <span className="flex items-center">
                                <Bath className="mr-1 h-4 w-4" />
                                {item.property.bathrooms}
                              </span>
                              <span className="flex items-center">
                                <Square className="mr-1 h-4 w-4" />
                                {item.property.squareMeters}m²
                              </span>
                            </div>
                            <Link href={`/property/${item.property.id}`}>
                              <Button className="w-full bg-gradient-to-r from-forest-600 to-forest-700 hover:from-forest-700 hover:to-forest-800 text-white">
                                View Details
                              </Button>
                            </Link>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Saved Searches Tab */}
            <TabsContent value="searches">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Search className="h-5 w-5 text-gold-600" />
                    <span>Saved Searches</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {savedSearchesLoading ? (
                    <div className="space-y-4">
                      {Array.from({ length: 3 }).map((_, i) => (
                        <Card key={i}>
                          <CardContent className="p-4">
                            <Skeleton className="h-6 w-1/3 mb-2" />
                            <Skeleton className="h-4 w-full mb-4" />
                            <div className="flex justify-between">
                              <Skeleton className="h-8 w-20" />
                              <Skeleton className="h-8 w-16" />
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : savedSearches.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Search className="h-12 w-12 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        No Saved Searches
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 mb-6">
                        Save your search criteria to quickly find properties that match your preferences.
                      </p>
                      <Link href="/search">
                        <Button className="bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 text-white">
                          Start Searching
                        </Button>
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {savedSearches.map((search: any) => (
                        <Card key={search.id}>
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start mb-3">
                              <div>
                                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                                  {search.name || "Unnamed Search"}
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-300">
                                  Saved on {new Date(search.createdAt).toLocaleDateString()}
                                </p>
                              </div>
                              <div className="flex space-x-2">
                                {search.alertEnabled && (
                                  <Badge variant="secondary">
                                    <Bell className="mr-1 h-3 w-3" />
                                    Alerts On
                                  </Badge>
                                )}
                              </div>
                            </div>
                            <div className="flex justify-between items-center">
                              <Button variant="outline" size="sm">
                                Run Search
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => deleteSavedSearchMutation.mutate(search.id)}
                                disabled={deleteSavedSearchMutation.isPending}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
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
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Mail className="h-5 w-5 text-forest-600" />
                    <span>Messages</span>
                    {unreadMessages.length > 0 && (
                      <Badge variant="destructive">
                        {unreadMessages.length} unread
                      </Badge>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {messagesLoading ? (
                    <div className="space-y-4">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Card key={i}>
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start mb-2">
                              <Skeleton className="h-5 w-1/3" />
                              <Skeleton className="h-4 w-20" />
                            </div>
                            <Skeleton className="h-4 w-full mb-2" />
                            <Skeleton className="h-4 w-3/4" />
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : messages.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Mail className="h-12 w-12 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        No Messages
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300">
                        Contact agents about properties to start conversations.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {messages.map((message: any) => (
                        <Card 
                          key={message.id} 
                          className={`cursor-pointer transition-colors ${
                            !message.isRead ? "border-forest-200 dark:border-forest-800 bg-forest-50 dark:bg-forest-950" : ""
                          }`}
                          onClick={() => {
                            if (!message.isRead) {
                              markMessageAsReadMutation.mutate(message.id);
                            }
                          }}
                        >
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start mb-2">
                              <div className="flex items-center space-x-2">
                                <h3 className="font-semibold text-gray-900 dark:text-white">
                                  {message.subject}
                                </h3>
                                {!message.isRead && (
                                  <Badge variant="destructive" className="text-xs">
                                    New
                                  </Badge>
                                )}
                              </div>
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                {new Date(message.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                              From: {message.fromUserId}
                            </p>
                            <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-3">
                              {message.message}
                            </p>
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
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Settings className="h-5 w-5 text-gold-600" />
                    <span>Account Settings</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center space-x-2">
                          <User className="h-5 w-5" />
                          <span>Profile Information</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Email
                          </label>
                          <p className="text-gray-900 dark:text-white">{user?.email || "Not provided"}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Name
                          </label>
                          <p className="text-gray-900 dark:text-white">
                            {user?.firstName} {user?.lastName}
                          </p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Member Since
                          </label>
                          <p className="text-gray-900 dark:text-white">
                            {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "Unknown"}
                          </p>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center space-x-2">
                          <Bell className="h-5 w-5" />
                          <span>Preferences</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Language
                          </label>
                          <p className="text-gray-900 dark:text-white">
                            {user?.preferredLanguage?.toUpperCase() || "EN"}
                          </p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Theme
                          </label>
                          <p className="text-gray-900 dark:text-white capitalize">
                            {user?.preferredTheme || "Light"}
                          </p>
                        </div>
                        <Button variant="outline" className="w-full">
                          Update Preferences
                        </Button>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Account Actions
                    </h3>
                    <div className="flex space-x-4">
                      <Button
                        variant="outline"
                        onClick={() => window.location.href = "/api/logout"}
                      >
                        Sign Out
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Footer is included in Layout */}
      </Layout>
    </div>
  );
}
