import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import { insertPropertySchema } from "@shared/schema";
import { 
  Home, 
  BarChart3, 
  MessageSquare, 
  Settings, 
  Plus,
  Edit,
  Trash2,
  Eye,
  DollarSign,
  TrendingUp,
  Users,
  Crown,
  MapPin,
  Bed,
  Bath,
  Square
} from "lucide-react";
import { Link } from "wouter";

export default function AgentDashboard() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading, user } = useAuth();
  const queryClient = useQueryClient();
  const [isAddPropertyOpen, setIsAddPropertyOpen] = useState(false);

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

  const { data: agentProfile } = useQuery({
    queryKey: ["/api/agents/profile/me"],
    enabled: isAuthenticated,
  });

  const { data: myProperties = [], isLoading: propertiesLoading } = useQuery({
    queryKey: ["/api/properties", { agentId: user?.id }],
    enabled: isAuthenticated && !!user?.id,
    queryFn: async () => {
      const res = await fetch(`/api/properties?agentId=${user?.id}`);
      if (!res.ok) throw new Error("Failed to fetch properties");
      return res.json();
    },
  });

  const { data: messages = [], isLoading: messagesLoading } = useQuery({
    queryKey: ["/api/messages"],
    enabled: isAuthenticated,
  });

  const { data: countries = [] } = useQuery({
    queryKey: ["/api/countries"],
  });

  const addPropertyMutation = useMutation({
    mutationFn: async (propertyData: any) => {
      return await apiRequest("POST", "/api/properties", propertyData);
    },
    onSuccess: () => {
      toast({
        title: "Property Added",
        description: "Your property has been successfully listed.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/properties"] });
      setIsAddPropertyOpen(false);
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
        description: "Failed to add property. Please try again.",
        variant: "destructive",
      });
    },
  });

  const deletePropertyMutation = useMutation({
    mutationFn: async (propertyId: number) => {
      return await apiRequest("DELETE", `/api/properties/${propertyId}`);
    },
    onSuccess: () => {
      toast({
        title: "Property Deleted",
        description: "Property has been removed from your listings.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/properties"] });
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
        description: "Failed to delete property. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleAddProperty = (formData: FormData) => {
    const propertyData = {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      price: formData.get("price") as string,
      propertyType: formData.get("propertyType") as string,
      listingType: formData.get("listingType") as string,
      bedrooms: parseInt(formData.get("bedrooms") as string),
      bathrooms: parseInt(formData.get("bathrooms") as string),
      squareMeters: parseInt(formData.get("squareMeters") as string),
      address: formData.get("address") as string,
      city: formData.get("city") as string,
      region: formData.get("region") as string,
      countryId: parseInt(formData.get("countryId") as string),
      currency: "EUR",
      images: ["https://images.unsplash.com/photo-1613977257363-707ba9348227?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"],
      features: [],
      isActive: true,
      isFeatured: false,
    };

    try {
      insertPropertySchema.parse(propertyData);
      addPropertyMutation.mutate(propertyData);
    } catch (error) {
      toast({
        title: "Validation Error",
        description: "Please check all required fields.",
        variant: "destructive",
      });
    }
  };

  // Calculate stats
  const totalViews = myProperties.reduce((sum: number, prop: any) => sum + (prop.viewCount || 0), 0);
  const activeListings = myProperties.filter((prop: any) => prop.isActive).length;
  const featuredListings = myProperties.filter((prop: any) => prop.isFeatured).length;
  const totalValue = myProperties.reduce((sum: number, prop: any) => sum + parseFloat(prop.price || "0"), 0);
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
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="font-luxury text-4xl font-bold text-gray-900 dark:text-white mb-2">
                Agent Dashboard
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                Manage your listings, track performance, and connect with clients
              </p>
            </div>
            <Dialog open={isAddPropertyOpen} onOpenChange={setIsAddPropertyOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-forest-600 to-forest-700 hover:from-forest-700 hover:to-forest-800 text-white">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Property
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Add New Property</DialogTitle>
                </DialogHeader>
                <form onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.target as HTMLFormElement);
                  handleAddProperty(formData);
                }} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="title">Property Title</Label>
                      <Input id="title" name="title" required />
                    </div>
                    <div>
                      <Label htmlFor="price">Price (EUR)</Label>
                      <Input id="price" name="price" type="number" required />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea id="description" name="description" rows={3} required />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="propertyType">Property Type</Label>
                      <Select name="propertyType" required>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="villa">Villa</SelectItem>
                          <SelectItem value="apartment">Apartment</SelectItem>
                          <SelectItem value="penthouse">Penthouse</SelectItem>
                          <SelectItem value="farmhouse">Farmhouse</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="listingType">Listing Type</Label>
                      <Select name="listingType" required>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="sale">For Sale</SelectItem>
                          <SelectItem value="rent">For Rent</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="bedrooms">Bedrooms</Label>
                      <Input id="bedrooms" name="bedrooms" type="number" min="0" required />
                    </div>
                    <div>
                      <Label htmlFor="bathrooms">Bathrooms</Label>
                      <Input id="bathrooms" name="bathrooms" type="number" min="0" required />
                    </div>
                    <div>
                      <Label htmlFor="squareMeters">Square Meters</Label>
                      <Input id="squareMeters" name="squareMeters" type="number" min="0" required />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="address">Address</Label>
                    <Input id="address" name="address" required />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="city">City</Label>
                      <Input id="city" name="city" required />
                    </div>
                    <div>
                      <Label htmlFor="region">Region</Label>
                      <Input id="region" name="region" required />
                    </div>
                    <div>
                      <Label htmlFor="countryId">Country</Label>
                      <Select name="countryId" required>
                        <SelectTrigger>
                          <SelectValue placeholder="Select country" />
                        </SelectTrigger>
                        <SelectContent>
                          {countries.map((country: any) => (
                            <SelectItem key={country.id} value={country.id.toString()}>
                              {country.flag} {country.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-2 pt-4">
                    <Button type="button" variant="outline" onClick={() => setIsAddPropertyOpen(false)}>
                      Cancel
                    </Button>
                    <Button 
                      type="submit" 
                      disabled={addPropertyMutation.isPending}
                      className="bg-gradient-to-r from-forest-600 to-forest-700 hover:from-forest-700 hover:to-forest-800 text-white"
                    >
                      {addPropertyMutation.isPending ? "Adding..." : "Add Property"}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {/* Performance Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-forest-100 dark:bg-forest-900 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Home className="h-6 w-6 text-forest-600 dark:text-forest-400" />
                </div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {activeListings}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Active Listings</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-gold-100 dark:bg-gold-900 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Eye className="h-6 w-6 text-gold-600 dark:text-gold-400" />
                </div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {totalViews}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Total Views</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-forest-100 dark:bg-forest-900 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <MessageSquare className="h-6 w-6 text-forest-600 dark:text-forest-400" />
                </div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {unreadMessages.length}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">New Leads</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-gold-100 dark:bg-gold-900 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <DollarSign className="h-6 w-6 text-gold-600 dark:text-gold-400" />
                </div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  €{(totalValue / 1000000).toFixed(1)}M
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Portfolio Value</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-forest-100 dark:bg-forest-900 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Crown className="h-6 w-6 text-forest-600 dark:text-forest-400" />
                </div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {featuredListings}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Featured</div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Tabs */}
          <Tabs defaultValue="listings" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="listings" className="flex items-center space-x-2">
                <Home className="h-4 w-4" />
                <span>My Listings</span>
              </TabsTrigger>
              <TabsTrigger value="analytics" className="flex items-center space-x-2">
                <BarChart3 className="h-4 w-4" />
                <span>Analytics</span>
              </TabsTrigger>
              <TabsTrigger value="messages" className="flex items-center space-x-2">
                <MessageSquare className="h-4 w-4" />
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

            {/* Listings Tab */}
            <TabsContent value="listings">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Home className="h-5 w-5 text-forest-600" />
                      <span>Property Listings</span>
                    </div>
                    <Badge variant="secondary">
                      {activeListings} active
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {propertiesLoading ? (
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
                  ) : myProperties.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Home className="h-12 w-12 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        No Properties Listed
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 mb-6">
                        Start building your portfolio by adding your first property listing.
                      </p>
                      <Button 
                        onClick={() => setIsAddPropertyOpen(true)}
                        className="bg-gradient-to-r from-forest-600 to-forest-700 hover:from-forest-700 hover:to-forest-800 text-white"
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Add Your First Property
                      </Button>
                    </div>
                  ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {myProperties.map((property: any) => (
                        <Card key={property.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                          <div className="relative">
                            <img 
                              src={property.images[0]} 
                              alt={property.title}
                              className="w-full h-48 object-cover" 
                            />
                            <div className="absolute top-2 left-2">
                              <Badge className={property.isActive ? "bg-green-600" : "bg-gray-600"}>
                                {property.isActive ? "Active" : "Inactive"}
                              </Badge>
                            </div>
                            {property.isFeatured && (
                              <div className="absolute top-2 right-2">
                                <Badge className="bg-gold-600">
                                  <Crown className="mr-1 h-3 w-3" />
                                  Featured
                                </Badge>
                              </div>
                            )}
                          </div>
                          <CardContent className="p-4">
                            <div className="text-xl font-bold text-forest-600 dark:text-forest-400 mb-2">
                              €{Number(property.price).toLocaleString()}
                            </div>
                            <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm mb-3">
                              <MapPin className="mr-1 h-4 w-4" />
                              {property.city}, {property.region}
                            </div>
                            <h3 className="font-semibold text-gray-900 dark:text-white mb-3 line-clamp-2">
                              {property.title}
                            </h3>
                            <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400 mb-4">
                              <span className="flex items-center">
                                <Bed className="mr-1 h-4 w-4" />
                                {property.bedrooms}
                              </span>
                              <span className="flex items-center">
                                <Bath className="mr-1 h-4 w-4" />
                                {property.bathrooms}
                              </span>
                              <span className="flex items-center">
                                <Square className="mr-1 h-4 w-4" />
                                {property.squareMeters}m²
                              </span>
                            </div>
                            <div className="flex items-center justify-between mb-4">
                              <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                                <Eye className="h-4 w-4" />
                                <span>{property.viewCount || 0} views</span>
                              </div>
                            </div>
                            <div className="flex space-x-2">
                              <Link href={`/property/${property.id}`} className="flex-1">
                                <Button variant="outline" size="sm" className="w-full">
                                  <Eye className="mr-2 h-4 w-4" />
                                  View
                                </Button>
                              </Link>
                              <Button variant="outline" size="sm">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => deletePropertyMutation.mutate(property.id)}
                                disabled={deletePropertyMutation.isPending}
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

            {/* Analytics Tab */}
            <TabsContent value="analytics">
              <div className="grid lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <TrendingUp className="h-5 w-5 text-forest-600" />
                      <span>Performance Overview</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center p-4 bg-forest-50 dark:bg-forest-950 rounded-lg">
                        <span className="text-gray-700 dark:text-gray-300">This Month's Views</span>
                        <span className="font-bold text-forest-600 dark:text-forest-400">{totalViews}</span>
                      </div>
                      <div className="flex justify-between items-center p-4 bg-gold-50 dark:bg-gold-950 rounded-lg">
                        <span className="text-gray-700 dark:text-gray-300">Average View per Listing</span>
                        <span className="font-bold text-gold-600 dark:text-gold-400">
                          {activeListings > 0 ? Math.round(totalViews / activeListings) : 0}
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-4 bg-forest-50 dark:bg-forest-950 rounded-lg">
                        <span className="text-gray-700 dark:text-gray-300">Inquiry Rate</span>
                        <span className="font-bold text-forest-600 dark:text-forest-400">
                          {totalViews > 0 ? ((messages.length / totalViews) * 100).toFixed(1) : 0}%
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Users className="h-5 w-5 text-gold-600" />
                      <span>Top Performing Listings</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {myProperties
                        .sort((a: any, b: any) => (b.viewCount || 0) - (a.viewCount || 0))
                        .slice(0, 5)
                        .map((property: any, index: number) => (
                        <div key={property.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                              #{index + 1}
                            </div>
                            <div>
                              <div className="font-medium text-gray-900 dark:text-white text-sm line-clamp-1">
                                {property.title}
                              </div>
                              <div className="text-xs text-gray-600 dark:text-gray-400">
                                {property.city}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-forest-600 dark:text-forest-400">
                              {property.viewCount || 0}
                            </div>
                            <div className="text-xs text-gray-600 dark:text-gray-400">views</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Messages Tab */}
            <TabsContent value="messages">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <MessageSquare className="h-5 w-5 text-forest-600" />
                    <span>Client Messages</span>
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
                        <MessageSquare className="h-12 w-12 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        No Messages Yet
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300">
                        When clients contact you about properties, their messages will appear here.
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
              <div className="grid lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Settings className="h-5 w-5 text-gold-600" />
                      <span>Agent Profile</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Company Name
                      </label>
                      <p className="text-gray-900 dark:text-white">
                        {agentProfile?.companyName || "Not set"}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        License Number
                      </label>
                      <p className="text-gray-900 dark:text-white">
                        {agentProfile?.licenseNumber || "Not set"}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Verification Status
                      </label>
                      <div className="flex items-center space-x-2">
                        <Badge variant={agentProfile?.isVerified ? "default" : "secondary"}>
                          {agentProfile?.isVerified ? "Verified" : "Unverified"}
                        </Badge>
                      </div>
                    </div>
                    <Button variant="outline" className="w-full">
                      Update Profile
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Subscription Plan</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Current Plan
                      </label>
                      <p className="text-gray-900 dark:text-white">
                        {user?.subscriptionPlan?.replace("_", " ").toUpperCase() || "No Active Plan"}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Listings Used
                      </label>
                      <p className="text-gray-900 dark:text-white">
                        {activeListings} / {user?.subscriptionPlan === "global_20" ? "20" : user?.subscriptionPlan === "global_50" ? "50" : user?.subscriptionPlan === "global_100" ? "100" : "0"}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Status
                      </label>
                      <Badge variant={user?.subscriptionStatus === "active" ? "default" : "destructive"}>
                        {user?.subscriptionStatus || "Inactive"}
                      </Badge>
                    </div>
                    <Link href="/pricing">
                      <Button className="w-full bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 text-white">
                        Upgrade Plan
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Footer is included in Layout */}
      </Layout>
    </div>
  );
}
